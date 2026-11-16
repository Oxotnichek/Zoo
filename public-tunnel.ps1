# Keeps a public localhost.run tunnel alive and writes the current URL.
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$urlFile = Join-Path $root 'PUBLIC_URL.txt'
$logFile = Join-Path $root 'tunnel.log'
$port = 5173

function Write-Url([string]$url) {
  $url = $url.Trim()
  if (-not $url) { return }
  Set-Content -Path $urlFile -Value $url -Encoding UTF8
  Add-Content -Path $logFile -Value ("{0:u}  {1}" -f (Get-Date).ToUniversalTime(), $url)
  Write-Host ("PUBLIC: {0}" -f $url) -ForegroundColor Green
}

function Ensure-LocalServer {
  try {
    $r = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/" -f $port) -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) { return }
  } catch {}

  Write-Host "Starting local server on :$port ..." -ForegroundColor Yellow
  $server = Join-Path $root 'serve-local.ps1'
  if (Test-Path $server) {
    Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $server) -WindowStyle Minimized
    Start-Sleep -Seconds 2
  }
}

while ($true) {
  Ensure-LocalServer
  Write-Host "Starting tunnel..." -ForegroundColor Cyan

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'ssh'
  $psi.Arguments = '-o StrictHostKeyChecking=no -o ServerAliveInterval=20 -o ServerAliveCountMax=3 -o ConnectTimeout=25 -R 80:127.0.0.1:5173 nokey@localhost.run'
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true

  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $psi
  [void]$p.Start()

  $gotUrl = $false
  while (-not $p.HasExited) {
    $line = $p.StandardOutput.ReadLine()
    if ($null -eq $line) {
      Start-Sleep -Milliseconds 200
      continue
    }
    Add-Content -Path $logFile -Value $line
    if ($line -match 'https://[a-z0-9-]+\.app\.lhr\.life') {
      Write-Url $Matches[0]
      $gotUrl = $true
    }
  }

  $err = $p.StandardError.ReadToEnd()
  if ($err) { Add-Content -Path $logFile -Value $err }
  Write-Host "Tunnel exited. Restarting in 3s..." -ForegroundColor Yellow
  Start-Sleep -Seconds 3
}
