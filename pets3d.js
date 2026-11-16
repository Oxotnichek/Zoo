/* Cute WebGL pet toys for category cards — Three.js */
(function () {
  const CREAM = 0xfff0e0;
  const PEACH = 0xffc9a8;
  const CARAMEL = 0xe8b07a;
  const TAN = 0xd4a574;
  const SOFT_GRAY = 0xc8c4c0;
  const WHITE = 0xfff8f2;
  const BELLY = 0xfff6ee;
  const BLUSH = 0xff8fa3;
  const NOSE = 0xff6b7a;
  const ACCENT = 0xc46b5c;
  const BEAK = 0xffb347;
  const PUPIL = 0x4a3428;
  const BIRD = 0xff8a7a;
  const BIRD_SOFT = 0xffb0a4;
  const FISH = 0x6ec8ff;
  const FISH_FIN = 0xff9ec8;
  const HORSE = 0xd2a679;
  const MANE = 0x8b5a3c;

  const scenes = new Map();
  let raf = 0;
  let THREE = null;

  function mat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: opts.roughness ?? 0.72,
      metalness: opts.metalness ?? 0.02,
      ...opts,
    });
  }

  function sphere(r, color, opts) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), mat(color, opts));
  }

  function capsule(r, len, color) {
    return new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 16), mat(color));
  }

  function cone(r, h, color, segments = 16) {
    return new THREE.Mesh(new THREE.ConeGeometry(r, h, segments), mat(color));
  }

  function torus(r, tube, color, arc = Math.PI * 2) {
    return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 40, arc), mat(color));
  }

  /** Flat kawaii eyes glued to the face (+Z), no billboarding */
  function cuteFace(face, { spread = 0.11, size = 0.07, y = 0.05, z = 0.26, blush = true } = {}) {
    [-1, 1].forEach((s) => {
      const white = new THREE.Mesh(
        new THREE.CircleGeometry(size, 24),
        new THREE.MeshBasicMaterial({ color: WHITE })
      );
      white.position.set(s * spread, y, z);
      white.renderOrder = 2;
      face.add(white);

      const pupil = new THREE.Mesh(
        new THREE.CircleGeometry(size * 0.58, 20),
        new THREE.MeshBasicMaterial({ color: PUPIL })
      );
      pupil.position.set(s * spread + size * 0.03, y - size * 0.05, z + 0.003);
      pupil.renderOrder = 3;
      face.add(pupil);

      const shine = new THREE.Mesh(
        new THREE.CircleGeometry(size * 0.2, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      shine.position.set(s * spread - size * 0.16, y + size * 0.2, z + 0.005);
      shine.renderOrder = 4;
      face.add(shine);
    });

    if (blush) {
      [-1, 1].forEach((s) => {
        const cheek = sphere(size * 0.4, BLUSH, { roughness: 0.95, transparent: true, opacity: 0.45 });
        cheek.scale.set(1.2, 0.65, 0.3);
        cheek.position.set(s * (spread + size * 1.05), y - size * 1.1, z - size * 0.35);
        face.add(cheek);
      });
    }
  }

  function smile(face, { y = -0.06, z = 0.28, w = 0.08 } = {}) {
    const mouth = capsule(0.012, w, NOSE);
    mouth.rotation.z = Math.PI / 2;
    mouth.scale.set(1, 0.6, 1);
    mouth.position.set(0, y, z);
    face.add(mouth);
  }

  /* —— Собака: карамель, пухлая, с ошейником —— */
  function makeDog() {
    const g = new THREE.Group();

    const body = sphere(0.42, CARAMEL);
    body.scale.set(1.15, 1.05, 1.2);
    body.position.set(0, 0, -0.05);
    g.add(body);

    const belly = sphere(0.26, BELLY);
    belly.position.set(0, -0.08, 0.28);
    g.add(belly);

    const face = new THREE.Group();
    face.position.set(0, 0.46, 0.28);
    face.add(sphere(0.32, CARAMEL));

    const snout = sphere(0.14, PEACH);
    snout.scale.set(0.95, 0.8, 1.35);
    snout.position.set(0, -0.06, 0.24);
    face.add(snout);

    const nose = sphere(0.05, NOSE);
    nose.position.set(0, -0.02, 0.4);
    face.add(nose);

    cuteFace(face, { spread: 0.12, size: 0.07, y: 0.08, z: 0.3 });
    smile(face, { y: -0.14, z: 0.34, w: 0.06 });

    [-1, 1].forEach((s) => {
      const ear = capsule(0.1, 0.26, TAN);
      ear.rotation.z = s * 0.95;
      ear.rotation.x = 0.4;
      ear.position.set(s * 0.28, 0.02, -0.04);
      face.add(ear);
      const inner = capsule(0.05, 0.14, PEACH);
      inner.rotation.z = s * 0.95;
      inner.rotation.x = 0.4;
      inner.position.set(s * 0.28, 0.0, 0.02);
      face.add(inner);
    });
    g.add(face);

    const collar = torus(0.28, 0.04, ACCENT);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.2, 0.22);
    g.add(collar);

    [-1, 1].forEach((s) => {
      const paw = sphere(0.11, PEACH);
      paw.position.set(s * 0.2, -0.42, 0.3);
      g.add(paw);
    });
    [-1, 1].forEach((s) => {
      const hip = sphere(0.16, CARAMEL);
      hip.position.set(s * 0.22, -0.16, -0.28);
      g.add(hip);
    });

    const tail = new THREE.Group();
    const t = capsule(0.055, 0.2, CARAMEL);
    t.rotation.x = -0.9;
    t.position.set(0, 0.1, -0.06);
    tail.add(t);
    tail.position.set(0, 0.1, -0.48);
    g.add(tail);
    g.userData.tail = tail;

    g.userData.idle = "wag";
    g.userData.baseY = -0.28;
    return g;
  }

  /* —— Кошка: сидит анфас, ушки треугольником, хвост сбоку —— */
  function makeCat() {
    const g = new THREE.Group();

    const body = sphere(0.4, CREAM);
    body.scale.set(1.15, 1.05, 1.05);
    body.position.set(0, -0.02, -0.04);
    g.add(body);

    const belly = sphere(0.24, BELLY);
    belly.position.set(0, -0.1, 0.26);
    g.add(belly);

    const face = new THREE.Group();
    face.position.set(0, 0.42, 0.28);
    face.add(sphere(0.28, CREAM));

    [-1, 1].forEach((s) => {
      const ear = cone(0.11, 0.24, CREAM, 3);
      ear.rotation.z = s * 0.28;
      ear.position.set(s * 0.16, 0.26, -0.02);
      face.add(ear);
      const inner = cone(0.055, 0.13, PEACH, 3);
      inner.rotation.z = s * 0.28;
      inner.position.set(s * 0.16, 0.22, 0.04);
      face.add(inner);
    });

    cuteFace(face, { spread: 0.11, size: 0.065, y: -0.02, z: 0.275 });

    const nose = sphere(0.04, NOSE);
    nose.position.set(0, -0.1, 0.28);
    face.add(nose);
    smile(face, { y: -0.16, z: 0.28, w: 0.05 });

    // усы — по 3 слева и справа, оба ряда видны спереди
    [-1, 1].forEach((s) => {
      [-0.055, 0, 0.055].forEach((dy) => {
        const w = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.013, 0.013),
          mat(0xfffaf5, { roughness: 0.45 })
        );
        w.position.set(s * 0.34, -0.1 + dy, 0.3);
        w.rotation.z = s * dy * 2.2;
        face.add(w);
      });
    });
    g.add(face);

    [-1, 1].forEach((s) => {
      const paw = sphere(0.1, PEACH);
      paw.position.set(s * 0.2, -0.4, 0.28);
      g.add(paw);
    });

    const tail = new THREE.Group();
    const t1 = capsule(0.05, 0.22, PEACH);
    t1.rotation.z = 1.1;
    t1.position.set(0, 0.08, 0);
    tail.add(t1);
    const t2 = capsule(0.045, 0.18, CREAM);
    t2.rotation.z = 0.25;
    t2.position.set(-0.16, 0.26, 0);
    tail.add(t2);
    const t3 = capsule(0.04, 0.12, PEACH);
    t3.rotation.z = -0.4;
    t3.position.set(-0.24, 0.4, 0);
    tail.add(t3);
    tail.position.set(-0.42, 0.05, -0.1);
    g.add(tail);
    g.userData.tail = tail;

    g.userData.idle = "wag";
    g.userData.baseY = -0.22;
    g.userData.baseRotY = 0;
    return g;
  }

  /* —— Хомяк: круглый, без щёк —— */
  function makeRodent() {
    const g = new THREE.Group();

    const body = sphere(0.46, PEACH);
    body.scale.set(1.05, 0.95, 1);
    g.add(body);

    const belly = sphere(0.28, BELLY);
    belly.position.set(0, -0.1, 0.28);
    g.add(belly);

    [-1, 1].forEach((s) => {
      const ear = sphere(0.15, PEACH);
      ear.scale.set(1, 1, 0.4);
      ear.position.set(s * 0.3, 0.38, 0);
      g.add(ear);
      const inner = sphere(0.085, BLUSH);
      inner.scale.set(1, 1, 0.35);
      inner.position.set(s * 0.3, 0.38, 0.05);
      g.add(inner);
    });

    const face = new THREE.Group();
    face.position.set(0, 0.06, 0.38);
    cuteFace(face, { spread: 0.14, size: 0.08, y: 0.08, z: 0.1 });
    const muzzle = sphere(0.12, BELLY);
    muzzle.position.set(0, -0.08, 0.1);
    face.add(muzzle);
    const nose = sphere(0.06, NOSE);
    nose.position.set(0, -0.04, 0.2);
    face.add(nose);
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.02), mat(WHITE));
    tooth.position.set(0, -0.12, 0.18);
    face.add(tooth);
    g.add(face);

    [-1, 1].forEach((s) => {
      const paw = sphere(0.09, CARAMEL);
      paw.position.set(s * 0.22, -0.36, 0.28);
      g.add(paw);
    });

    g.userData.idle = "bob";
    g.userData.baseY = -0.12;
    return g;
  }

  /* —— Рыба: голубая, розовые плавники —— */
  function makeFish() {
    const g = new THREE.Group();

    const body = sphere(0.34, FISH);
    body.scale.set(1.8, 1.05, 0.75);
    g.add(body);

    const belly = sphere(0.2, BELLY);
    belly.scale.set(1.4, 0.7, 0.5);
    belly.position.set(0.05, -0.12, 0.1);
    g.add(belly);

    [-1, 1].forEach((s) => {
      const lobe = cone(0.16, 0.32, FISH_FIN, 16);
      lobe.rotation.z = Math.PI / 2 + s * 0.5;
      lobe.position.set(-0.65, s * 0.12, 0);
      g.add(lobe);
    });

    const dorsal = cone(0.1, 0.26, FISH_FIN);
    dorsal.position.set(0.05, 0.38, 0);
    g.add(dorsal);

    [-1, 1].forEach((s) => {
      const fin = cone(0.08, 0.18, FISH_FIN);
      fin.rotation.z = s * -0.9;
      fin.rotation.y = s * 0.45;
      fin.position.set(0.05, 0, s * 0.26);
      g.add(fin);
    });

    const eyeWhite = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 24),
      new THREE.MeshBasicMaterial({ color: WHITE })
    );
    eyeWhite.position.set(0.38, 0.1, 0.28);
    g.add(eyeWhite);
    const pupil = new THREE.Mesh(
      new THREE.CircleGeometry(0.05, 16),
      new THREE.MeshBasicMaterial({ color: PUPIL })
    );
    pupil.position.set(0.39, 0.09, 0.283);
    g.add(pupil);
    const shine = new THREE.Mesh(
      new THREE.CircleGeometry(0.02, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shine.position.set(0.36, 0.13, 0.285);
    g.add(shine);

    const smileM = capsule(0.012, 0.06, NOSE);
    smileM.rotation.z = Math.PI / 2;
    smileM.position.set(0.52, -0.06, 0.08);
    g.add(smileM);

    g.userData.idle = "swim";
    g.userData.baseRotY = 0.35;
    return g;
  }

  /* —— Птица: круглая анфас, клюв вперёд, хохолок —— */
  function makeBird() {
    const g = new THREE.Group();

    const body = sphere(0.38, BIRD);
    body.scale.set(1.0, 1.1, 0.95);
    body.position.set(0, -0.02, 0);
    g.add(body);

    const belly = sphere(0.24, BELLY);
    belly.position.set(0, -0.12, 0.26);
    g.add(belly);

    const face = new THREE.Group();
    face.position.set(0, 0.3, 0.22);
    face.add(sphere(0.24, BIRD_SOFT));

    const beak = cone(0.07, 0.18, BEAK);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, -0.02, 0.26);
    face.add(beak);

    cuteFace(face, { spread: 0.1, size: 0.06, y: 0.0, z: 0.23 });

    for (let i = 0; i < 3; i += 1) {
      const c = cone(0.04, 0.12, ACCENT);
      c.position.set((i - 1) * 0.06, 0.22 + (i === 1 ? 0.04 : 0), -0.04);
      face.add(c);
    }
    g.add(face);

    [-1, 1].forEach((s) => {
      const wing = sphere(0.16, BIRD_SOFT);
      wing.scale.set(0.55, 1.1, 0.85);
      wing.rotation.z = s * 0.35;
      wing.position.set(s * 0.32, 0.02, 0.05);
      g.add(wing);
      if (s === 1) g.userData.wing = wing;
    });

    [-1, 1].forEach((s) => {
      const leg = capsule(0.018, 0.22, TAN);
      leg.position.set(s * 0.1, -0.46, 0.04);
      g.add(leg);
      const foot = capsule(0.016, 0.1, TAN);
      foot.rotation.z = Math.PI / 2;
      foot.position.set(s * 0.1, -0.58, 0.08);
      g.add(foot);
    });

    g.userData.idle = "flap";
    g.userData.baseY = 0.08;
    g.userData.baseRotY = -0.2;
    return g;
  }

  /* —— Лошади: знак подковы —— */
  function makeHorse() {
    const g = new THREE.Group();
    const metal = mat(0xd8b896, { roughness: 0.28, metalness: 0.65 });
    const R = 0.4;
    const tube = 0.1;
    const span = Math.PI * 1.35; // открыта снизу

    // U-подкова: дуга сверху, открытие снизу
    const pts = [];
    for (let i = 0; i <= 48; i += 1) {
      const a = -span / 2 + (i / 48) * span;
      pts.push(new THREE.Vector3(Math.sin(a) * R, Math.cos(a) * R, 0));
    }
    const path = new THREE.CatmullRomCurve3(pts);
    const shoe = new THREE.Mesh(
      new THREE.TubeGeometry(path, 64, tube, 16, false),
      metal
    );
    g.add(shoe);

    [pts[0], pts[pts.length - 1]].forEach((p) => {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(tube, 16, 12), metal);
      tip.position.copy(p);
      g.add(tip);
    });

    for (let i = 1; i <= 6; i += 1) {
      const a = -span / 2 + (i / 7) * span;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, tube * 2.5, 12),
        mat(0x3d2a1f, { roughness: 0.9, metalness: 0.1 })
      );
      hole.rotation.x = Math.PI / 2;
      hole.position.set(Math.sin(a) * R, Math.cos(a) * R, 0);
      g.add(hole);
    }

    // чуть повернуть к камере, чтобы U читалась сразу
    g.rotation.x = -0.15;
    g.userData.idle = "bob";
    g.userData.baseY = 0.08;
    g.userData.baseRotY = 0;
    return g;
  }

  const builders = {
    dogs: makeDog,
    cats: makeCat,
    rodents: makeRodent,
    birds: makeBird,
    fish: makeFish,
    horses: makeHorse,
  };

  function buildScene(canvas, petId) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
    camera.position.set(0.15, 0.15, 3.05);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const hemi = new THREE.HemisphereLight(0xfff5ee, 0x4a3a35, 1.15);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff8f0, 1.15);
    key.position.set(2, 3.2, 2.4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffd0c8, 0.45);
    fill.position.set(-2, 0.6, 1.2);
    scene.add(fill);

    const model = (builders[petId] || makeDog)();
    model.rotation.y = model.userData.baseRotY ?? -0.3;
    model.position.y = model.userData.baseY ?? 0;
    scene.add(model);

    return { scene, camera, renderer, model, canvas, petId, hover: false, t0: performance.now() };
  }

  function resizeEntry(entry) {
    const { canvas, camera, renderer } = entry;
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const t = now * 0.001;
    scenes.forEach((entry) => {
      if (!entry.visible) return;
      resizeEntry(entry);
      const { model, renderer, scene, camera, hover } = entry;
      const speed = hover ? 1.4 : 0.4;
      const baseRot = model.userData.baseRotY ?? -0.3;
      model.rotation.y = baseRot + Math.sin(t * speed * 0.5) * (hover ? 0.4 : 0.15);

      model.position.y = model.userData.baseY ?? 0;
      model.rotation.z = 0;

      renderer.render(scene, camera);
    });
  }

  function ensureLoop() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function disposeAll() {
    scenes.forEach((entry) => {
      entry.ro?.disconnect();
      entry.renderer.dispose();
      entry.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    });
    scenes.clear();
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function mount(root = document) {
    if (!window.THREE) {
      console.warn("Three.js not loaded");
      return;
    }
    THREE = window.THREE;
    disposeAll();

    root.querySelectorAll(".category[data-filter]").forEach((card) => {
      const stage = card.querySelector(".category__stage");
      if (!stage) return;
      stage.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.className = "pet-toy-canvas";
      canvas.setAttribute("aria-hidden", "true");
      stage.appendChild(canvas);

      const entry = buildScene(canvas, card.dataset.filter);
      entry.visible = true;

      card.addEventListener("pointerenter", () => {
        entry.hover = true;
      });
      card.addEventListener("pointerleave", () => {
        entry.hover = false;
      });

      const ro = new IntersectionObserver(
        ([obs]) => {
          entry.visible = !!obs?.isIntersecting;
        },
        { threshold: 0.05 }
      );
      ro.observe(card);
      entry.ro = ro;

      scenes.set(card, entry);
      resizeEntry(entry);
    });

    ensureLoop();
  }

  window.Pets3D = { mount, disposeAll };
})();
