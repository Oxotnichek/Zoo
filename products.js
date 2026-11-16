/* Real Domikzoo catalog slice — prices/photos from domikzoo.ru */
const PRODUCTS = [
  {
    id: "grandorf-salmon-mini",
    name: "Grandorf Fresh Adult Mini Salmon & Sweet Potato",
    desc: "Сухой корм для взрослых собак мелких пород, лосось и батат",
    full: "Сухой корм Grandorf Fresh Adult Mini Salmon & Sweet Potato для взрослых собак мелких пород.",
    pet: "dogs",
    type: "food",
    brand: "Grandorf",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Лосось",
    rating: 5,
    hit: true,
    selectedVariant: "3kg",
    variants: [
      {
        id: "1kg",
        label: "1 кг",
        price: 1710,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/a/f21vpo9xb98iwdt_387821ec.jpg.webp",
      },
      {
        id: "3kg",
        label: "3 кг",
        price: 3810,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/h/59ki5vjobnb7fe7_8eeb763a.png.webp",
      },
    ],
  },
  {
    id: "grandorf-white-fish",
    name: "Grandorf Medium & Maxi White Fish",
    desc: "Сухой корм для взрослых собак средних и крупных пород, белая рыба",
    full: "Сухой корм Grandorf Medium & Maxi White Fish для взрослых собак средних и крупных пород.",
    pet: "dogs",
    type: "food",
    brand: "Grandorf",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Рыба белая",
    rating: 5,
    hit: true,
    selectedVariant: "10kg",
    variants: [
      {
        id: "1kg",
        label: "1 кг",
        price: 1570,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/b/rwql3hlr4z6x55h_6784f656.jpg.webp",
      },
      {
        id: "3kg",
        label: "3 кг",
        price: 3710,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/h/dibo023x1jle5dc_82d98345.webp.webp",
      },
      {
        id: "10kg",
        label: "10 кг",
        price: 9560,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/f/epv028ywgmjjosv_9695bc3b.webp.webp",
      },
    ],
  },
  {
    id: "proplan-lamb",
    name: "PRO PLAN Lamb Sensitive Digestion",
    desc: "Сухой корм для взрослых собак средних пород с чувствительным пищеварением",
    full: "Сухой корм PRO PLAN Lamb для взрослых собак средних пород с высоким содержанием ягненка.",
    pet: "dogs",
    type: "food",
    brand: "Pro Plan",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Ягнёнок",
    rating: 5,
    hit: true,
    selectedVariant: "7kg",
    variants: [
      {
        id: "7kg",
        label: "7 кг",
        price: 5870,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/c/o01j24r6oi4ou3d_f5a54422.webp.webp",
      },
    ],
  },
  {
    id: "rc-sterilised",
    name: "Royal Canin Sterilised 37",
    desc: "Сухой корм для взрослых стерилизованных кошек и кастрированных котов",
    full: "Сухой корм Royal Canin Sterilised 37 для взрослых стерилизованных кошек и кастрированных котов.",
    pet: "cats",
    type: "food",
    brand: "Royal Canin",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Птица",
    rating: 5,
    hit: true,
    selectedVariant: "4kg",
    variants: [
      {
        id: "4kg",
        label: "4 кг",
        price: 5150,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/e/ajgh9p81l01pkp8_ed692eaf.jpg.webp",
      },
      {
        id: "10kg",
        label: "10 кг",
        price: 15540,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/d/b4rm6uu35y9w04g_f4fcd8ba.jpg.webp",
      },
    ],
  },
  {
    id: "rc-sensible",
    name: "Royal Canin Sensible 33",
    desc: "Сухой корм для взрослых кошек с чувствительным пищеварением",
    full: "Сухой корм Royal Canin Sensible 33 для взрослых кошек с чувствительным пищеварением.",
    pet: "cats",
    type: "food",
    brand: "Royal Canin",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Птица",
    rating: 5,
    hit: true,
    selectedVariant: "4kg",
    variants: [
      {
        id: "4kg",
        label: "4 кг",
        price: 6760,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/g/8rf0e0zpcjt3xuu_57e2791b.jpg.webp",
      },
    ],
  },
  {
    id: "almo-salmon",
    name: "Almo Nature Sterilised Salmon & Rice",
    desc: "Сухой корм для стерилизованных кошек, лосось и коричневый рис",
    full: "Сухой корм Almo Nature Sterilised Salmon & Rice для стерилизованных кошек.",
    pet: "cats",
    type: "food",
    brand: "Almo Nature",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Лосось, рис",
    rating: 5,
    hit: true,
    selectedVariant: "2kg",
    variants: [
      {
        id: "2kg",
        label: "2 кг",
        price: 1840,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/c/mopqlzavvjs5b10_f9794c6e.jpg.webp",
      },
    ],
  },
  {
    id: "almo-beef",
    name: "Almo Nature Sterilised Beef & Rice",
    desc: "Сухой корм для стерилизованных кошек, говядина и коричневый рис",
    full: "Сухой корм Almo Nature Sterilised Beef & Rice для стерилизованных кошек.",
    pet: "cats",
    type: "food",
    brand: "Almo Nature",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Говядина, рис",
    rating: 5,
    hit: true,
    selectedVariant: "12kg",
    variants: [
      {
        id: "12kg",
        label: "12 кг",
        price: 7840,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/h/a19175hqw4ag0yp_27a537bf.png.webp",
      },
    ],
  },
  {
    id: "taormina-lamb",
    name: "Taormina Lamb Alpine Meadow",
    desc: "Сухой корм для взрослых кошек, с ягненком",
    full: "Сухой корм Taormina Lamb Alpine Meadow для взрослых кошек, с ягненком.",
    pet: "cats",
    type: "food",
    brand: "Taormina",
    age: "Для взрослых",
    taste: "Ягнёнок",
    rating: 5,
    hit: true,
    selectedVariant: "2_5kg",
    variants: [
      {
        id: "2_5kg",
        label: "2,5 кг",
        price: 2050,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/i/z8sydee6wzacopb_4ef33e8a.png.webp",
      },
    ],
  },
  {
    id: "grandorf-chicken-shrimp",
    name: "Grandorf Chicken & Shrimp",
    desc: "Влажный корм для взрослых кошек, куриная грудка с креветками",
    full: "Влажный корм Grandorf для взрослых кошек, куриная грудка с креветками, 70 г.",
    pet: "cats",
    type: "food",
    brand: "Grandorf",
    badge: "Хит",
    age: "Для взрослых",
    taste: "Курица, креветка",
    rating: 5,
    hit: true,
    selectedVariant: "70g",
    variants: [
      {
        id: "70g",
        label: "70 г",
        price: 220,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/c/r5tzodpg0wvk1gz_50707262.webp.webp",
      },
    ],
  },
  {
    id: "rc-kitten-sauce",
    name: "Royal Canin Kitten в соусе",
    desc: "Влажный корм для котят до 12 месяцев, пауч",
    full: "Влажный корм Royal Canin Kitten в соусе для котят до 12 месяцев, пауч 85 г.",
    pet: "cats",
    type: "food",
    brand: "Royal Canin",
    badge: "Хит",
    age: "Для котят",
    taste: "Свинина",
    rating: 5,
    hit: true,
    selectedVariant: "85g",
    variants: [
      {
        id: "85g",
        label: "85 г",
        price: 130,
        image: "https://domikzoo.ru/storage/photo/resized/axy_866x866/g/w69z28guz1pkxr4_6885be5e.jpg.webp",
      },
    ],
  },
  {
    id: "proplan-cat-lamb",
    name: "PRO PLAN Adult Lamb в желе",
    desc: "Влажный корм для взрослых кошек, кусочки с ягненком",
    full: "Влажный корм PRO PLAN Lamb для взрослых кошек, кусочки с ягненком в желе, 85 г.",
    pet: "cats",
    type: "food",
    brand: "Pro Plan",
    badge: "Рекомендуем",
    age: "Для взрослых",
    taste: "Ягнёнок",
    rating: 5,
    hit: false,
    selectedVariant: "85g",
    variants: [
      {
        id: "85g",
        label: "85 г",
        price: 110,
        image: "https://domikzoo.ru/storage/photo/resized/xy_268x268/b/ail9ftmy6nrh23u_e2374de4.webp.webp",
      },
    ],
  },
  {
    id: "ball-rope",
    name: "Мяч с канатом",
    desc: "Игрушка для прогулок",
    full: "Прочный хлопковый канат и резиновый мяч.",
    pet: "dogs",
    type: "accessory",
    brand: "ZooPlay",
    rating: 5,
    hit: true,
    selectedVariant: "std",
    variants: [
      {
        id: "std",
        label: "1 шт",
        price: 690,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "cat-bowl",
    name: "Двойная миска",
    desc: "Керамика для корма и воды",
    full: "Две чаши для корма и воды.",
    pet: "cats",
    type: "accessory",
    brand: "HomePet",
    badge: "Новинка",
    rating: 5,
    hit: true,
    selectedVariant: "std",
    variants: [
      {
        id: "std",
        label: "1 шт",
        price: 890,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

function productVariants(product) {
  return product.variants && product.variants.length
    ? product.variants
    : [{ id: "default", label: product.weight || "1 шт", price: product.price, image: product.image }];
}

function getVariant(product, variantId) {
  const list = productVariants(product);
  const id = variantId || product.selectedVariant || list[0].id;
  return list.find((v) => v.id === id) || list[0];
}

function productPrice(product, variantId) {
  return getVariant(product, variantId).price;
}

function productImage(product, variantId) {
  return getVariant(product, variantId).image || product.image;
}

function productWeightLabel(product, variantId) {
  return getVariant(product, variantId).label;
}
