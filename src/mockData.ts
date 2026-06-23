/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Fabric, SavedMeasurements, UserProfile, Coupon, Address } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "عباية مخملية سوداء مطرزة بالذهب",
    nameEn: "Gold-Embroidered Black Velvet Abaya",
    description: "عباية فاخرة مصنوعة من أفضل خامات المخمل الكوري ومطرزة بخيوط ذهبية ألمانية على الأكمام والصدر. تصميم كلاسيكي راقي يناسب جميع المناسبات الرسمية والخاصة.",
    descriptionEn: "Luxury abaya crafted from premium Korean velvet, hand-embroidered with German gold threads on sleeves and chest. A timeless design perfect for special occasions.",
    category: "women",
    subCategory: "عبايات",
    subCategoryEn: "Abayas",
    price: 850,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 124,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "أسود ملكي", hex: "#0c0a09", nameEn: "Royal Black" },
      { name: "كحلي داكن", hex: "#1e3a8a", nameEn: "Navy Blue" },
      { name: "عنابي دافئ", hex: "#7f1d1d", nameEn: "Burgundy" }
    ],
    isCustomizable: true,
    isBestSeller: true,
    discountPercentage: 10
  },
  {
    id: "prod-2",
    name: "فستان السهرة الحريري الإمبراطوري",
    nameEn: "Imperial Silk Evening Dress",
    description: "فستان سهرة فاخر من الحرير الطبيعي الانسيابي، يتميز بفتحة رقبة على شكل V وقصة متناسقة تبرز جمال التصميم وقوامه. التفصيل يتم خصيصاً على مقاساتكِ.",
    descriptionEn: "Exquisite evening gown in flowy natural silk, featuring a sophisticated V-neckline and a tailored waist. Tailored customized to your precise silhouette.",
    category: "women",
    subCategory: "فساتين",
    subCategoryEn: "Dresses",
    price: 1450,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 78,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "أحمر قرمزي", hex: "#991b1b", nameEn: "Scarlet Red" },
      { name: "أخضر زمردي", hex: "#065f46", nameEn: "Emerald Green" },
      { name: "ذهبي شامبين", hex: "#ca8a04", nameEn: "Champagne Gold" }
    ],
    isCustomizable: true,
    isNew: true
  },
  {
    id: "prod-3",
    name: "ثوب يزن الفاخر - خامة يابانية سلك",
    nameEn: "Yazan Signature Thobe - Japanese Silk",
    description: "ثوب رجالي سعودي بتصميم معاصر وأنيق، مخيط من قماش السلك الياباني الأصلي الفاخر المقاوم للتجعد والاصفرار. ياقة رسمية فاخرة وأزرار مخفية.",
    descriptionEn: "Contemporary Saudi thobe crafted from authentic wrinkle-resistant Japanese silk. Features a clean structured collar and a concealed placket.",
    category: "men",
    subCategory: "ثياب",
    subCategoryEn: "Thobes",
    price: 450,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 312,
    sizes: ["52", "54", "56", "58", "60"],
    colors: [
      { name: "أبيض ناصع", hex: "#fafaf9", nameEn: "Bright White" },
      { name: "كريمي دافئ", hex: "#f5f5f4", nameEn: "Warm Cream" },
      { name: "رمادي جليدي", hex: "#e7e5e4", nameEn: "Ice Gray" }
    ],
    isCustomizable: true,
    isBestSeller: true
  },
  {
    id: "prod-4",
    name: "بدلة كشمير إيطالية زرقاء ملكية",
    nameEn: "Royal Blue Italian Cashmere Suit",
    description: "بدلة رجالية رسمية فاخرة مكونة من قطعتين، مصممة من الصوف الإيطالي الكشمير الفاخر الممتاز. قصة كلاسيكية عصرية أنيقة للمناسبات الرسمية الفاخرة.",
    descriptionEn: "Premium two-piece double-breasted suit tailored from high-grade Italian cashmere wool. A sharp modern fit suited for elite occasions.",
    category: "men",
    subCategory: "بدلات",
    subCategoryEn: "Suits",
    price: 1850,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    reviewsCount: 43,
    sizes: ["48", "50", "52", "54", "56"],
    colors: [
      { name: "كحلي غامق", hex: "#1e3a8a", nameEn: "Navy Blue" },
      { name: "فحمي داكن", hex: "#1c1917", nameEn: "Dark Charcoal" }
    ],
    isCustomizable: true,
    isNew: true
  },
  {
    id: "prod-5",
    name: "حذاء أكسفورد كلاسيكي من الجلد الطبيعي",
    nameEn: "Classic Oxford Leather Shoe",
    description: "حذاء رجالي مصنوع يدوياً من الجلد الطبيعي الإيطالي الفاخر 100% مع نعل داخلي مريح ومبطن لتوفير الراحة القصوى والتحمل في الاستخدام اليومي.",
    descriptionEn: "Handcrafted Men's Oxford shoes made of 100% premium Italian full-grain leather, featuring a padded orthopedic sole for absolute daily comfort.",
    category: "shoes",
    subCategory: "الأحذية الرسمية",
    subCategoryEn: "Formal Shoes",
    price: 520,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 92,
    sizes: ["41", "42", "43", "44", "45"],
    colors: [
      { name: "بني هافان", hex: "#78350f", nameEn: "Havana Brown" },
      { name: "أسود داكن", hex: "#1c1917", nameEn: "Jet Black" }
    ],
    isCustomizable: false
  },
  {
    id: "prod-6",
    name: "صندل يزن الشرقي بالجلد الإيطالي المطرز",
    nameEn: "Yazan Hand-Embroidered Oriental Sandal",
    description: "صندل شرقي فاخر للغاية نخب أول، مصنوع من الجلد الطبيعي ومطرز بنقوش تراثية أصيلة يدوياً. قاعدة مريحة وخفيفة الوزن مقاومة للانزلاق.",
    descriptionEn: "Luxury oriental sandal made of high-quality premium leather with exquisite handcrafted traditional stitching. Cushioned light base.",
    category: "shoes",
    subCategory: "صنادل",
    subCategoryEn: "Sandals",
    price: 340,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 205,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "جملي دافئ", hex: "#b45309", nameEn: "Camel" },
      { name: "أسود مع فضي", hex: "#292524", nameEn: "Black with Silver" },
      { name: "زيتي زهر", hex: "#3f4238", nameEn: "Olive Green" }
    ],
    isCustomizable: false,
    isBestSeller: true
  },
  {
    id: "prod-7",
    name: "حقيبة اليد الأنيقة بنقشة التمساح",
    nameEn: "Croc-Embossed Elegant Handbag",
    description: "حقيبة نسائية فاخرة مصنوعة من الجلد الطبيعي بنقشة جلد التمساح الفاخرة، مع تفاصيل معدنية مطلية بالذهب غير قابلة للصدأ وقفل مغناطيسي آمن.",
    descriptionEn: "Luxurious handbag crafted from premium croc-embossed genuine leather. Completed with gold-plated stainless hardware and a secure magnetic clasp.",
    category: "accessories",
    subCategory: "الحقائب",
    subCategoryEn: "Bags",
    price: 980,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 61,
    sizes: ["One Size"],
    colors: [
      { name: "بني شيكولاتة", hex: "#451a03", nameEn: "Chocolate Brown" },
      { name: "أسود ملكي", hex: "#0c0a09", nameEn: "Royal Black" },
      { name: "عاجي فاخر", hex: "#f5f5f4", nameEn: "Ivory" }
    ],
    isCustomizable: false
  },
  {
    id: "prod-8",
    name: "عطر يزن الملكي - خلطة دهن العود والورد الطائفي",
    nameEn: "Yazan Royal Oud & Taif Rose Extrait",
    description: "تركيبة حصرية بتركيز زيت عطري نقي 100%. تمزج بين رقي دهن العود الكمبودي المعتق وعذوبة ولمعان الورد الطائفي الفاخر مع لمسة دافئة من العنبر والمسك.",
    descriptionEn: "An exclusive extrait de parfum with 100% pure essential oil concentration. Melds aged Cambodian Oud oil, pure Taif rose, warm amber, and white musk.",
    category: "accessories",
    subCategory: "العطور",
    subCategoryEn: "Perfumes",
    price: 490,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 157,
    sizes: ["100ml"],
    colors: [
      { name: "ذهبي عنبري", hex: "#d97706", nameEn: "Amber Gold" }
    ],
    isCustomizable: false,
    isBestSeller: true
  }
];

export const PREMIUM_FABRICS: Fabric[] = [
  {
    id: "fab-1",
    name: "الحرير الطبيعي الياباني الفاخر",
    nameEn: "Premium Japanese Natural Silk",
    origin: "اليابان",
    originEn: "Japan",
    quality: "ناعم جداً، انسيابي، لامع لمعة طبيعية هادئة ومقاوم للتجعد",
    qualityEn: "Ultra soft, flowy, elegant natural luster, highly wrinkle-resistant",
    priceExtra: 250,
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=400",
    colors: [
      { name: "أسود فاحم", hex: "#0c0a09", nameEn: "Jet Black" },
      { name: "أحمر كرزي", hex: "#991b1b", nameEn: "Cherry Red" },
      { name: "أبيض حليبي", hex: "#f5f5f4", nameEn: "Off-White" },
      { name: "كحلي داكن", hex: "#1e3a8a", nameEn: "Navy Blue" }
    ]
  },
  {
    id: "fab-2",
    name: "الصوف الكشمير الإيطالي الممتاز",
    nameEn: "Superfine Italian Cashmere Wool",
    origin: "إيطاليا",
    originEn: "Italy",
    quality: "دافئ، متوسط الوزن، مثالي للبدلات الرسمية الفخمة والجاكيتات الرسمية",
    qualityEn: "Warm, medium weight, absolute perfect for premium suits and blazers",
    priceExtra: 400,
    image: "https://images.unsplash.com/photo-1524295981975-64414a5136aa?auto=format&fit=crop&q=80&w=400",
    colors: [
      { name: "كحلي مخطط", hex: "#172554", nameEn: "Pinstripe Navy" },
      { name: "رمادي فحمي", hex: "#292524", nameEn: "Charcoal Gray" },
      { name: "أسود داكن", hex: "#1c1917", nameEn: "Dark Black" }
    ]
  },
  {
    id: "fab-3",
    name: "القطن السويسري النقي المبرد",
    nameEn: "Pure Swiss Cooled Cotton",
    origin: "سويسرا",
    originEn: "Switzerland",
    quality: "طبيعي 100%، بارد ولطيف على البشرة، ممتاز للثياب والقمصان الراقية",
    qualityEn: "100% Natural, cooling and gentle on skin, supreme for thobes and shirts",
    priceExtra: 120,
    image: "https://images.unsplash.com/photo-1582298538104-fc2d05527f14?auto=format&fit=crop&q=80&w=400",
    colors: [
      { name: "أبيض ناصع", hex: "#fafaf9", nameEn: "Pure White" },
      { name: "كريمي دافئ", hex: "#f5f5f4", nameEn: "Warm Cream" },
      { name: "سماوي بارد", hex: "#bae6fd", nameEn: "Ice Blue" }
    ]
  },
  {
    id: "fab-4",
    name: "الكتان الأيرلندي الأصيل",
    nameEn: "Authentic Irish Pure Linen",
    origin: "أيرلندا",
    originEn: "Ireland",
    quality: "قوي التحمل، صديق للبيئة، ذو ملمس كلاسيكي مثالي للملابس الصيفية واليومية",
    qualityEn: "Durable, eco-friendly, classic texture ideal for premium summer wear",
    priceExtra: 80,
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=400",
    colors: [
      { name: "رملي طبيعي", hex: "#d6c4ae", nameEn: "Natural Sand" },
      { name: "أخضر زيتوني", hex: "#3f4238", nameEn: "Olive Green" },
      { name: "أزرق نيلي", hex: "#1d4ed8", nameEn: "Indigo Blue" }
    ]
  },
  {
    id: "fab-5",
    name: "كريب الصالون الكوري الفاخر",
    nameEn: "Premium Korean Salon Crepe",
    origin: "كوريا الجنوبية",
    originEn: "South Korea",
    quality: "خفيف الوزن، انسيابي جداً، معتم بالكامل وبارد لارتداء العبايات اليومية المريحة",
    qualityEn: "Lightweight, beautifully draping, fully opaque and cooling for everyday Abayas",
    priceExtra: 90,
    image: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=400",
    colors: [
      { name: "أسود داكن", hex: "#0c0a09", nameEn: "Deep Black" },
      { name: "كحلي ليلي", hex: "#0f172a", nameEn: "Night Navy" },
      { name: "رمادي حجري", hex: "#78716c", nameEn: "Stone Gray" }
    ]
  }
];

export const INITIAL_MEASUREMENTS: SavedMeasurements[] = [
  {
    id: "m-1",
    profileName: "مقاساتي الشخصية (الافتراضي)",
    gender: "female",
    height: 162,
    shoulder: 39,
    chest: 94,
    waist: 76,
    hips: 102,
    sleeveLength: 58,
    neckline: 16
  },
  {
    id: "m-2",
    profileName: "مقاسات الوالد (رجالي)",
    gender: "male",
    height: 174,
    shoulder: 46,
    chest: 108,
    waist: 98,
    neck: 42,
    sleeveLength: 62,
    armLength: 64
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    title: "منزل الرياض",
    fullName: "أيمن سيد أحمد",
    city: "الرياض",
    street: "حي الملقا - شارع الضباب - فيلا 12",
    phone: "+966501234567",
    isDefault: true
  },
  {
    id: "addr-2",
    title: "مكتب العمل",
    fullName: "أيمن سيد أحمد",
    city: "جدة",
    street: "حي الروضة - مبنى الموضة - الدور الرابع",
    phone: "+966507654321",
    isDefault: false
  }
];

export const COUPONS: Coupon[] = [
  { code: "YAZAN10", discountPercentage: 10, description: "خصم بقيمة 10% لعملاء يزن المميزين" },
  { code: "EID2026", discountPercentage: 15, description: "خصم خاص بمناسبة عيد الفطر المبارك" },
  { code: "VIP20", discountPercentage: 20, description: "خصم VIP بنسبة 20% لكبار العملاء" }
];

export const USER_PROFILE: UserProfile = {
  fullName: "أيمن سيد أحمد",
  email: "eng.aymansidahmed@gmail.com",
  phone: "+966501234567",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  loyaltyPoints: 1250,
  membershipLevel: "Gold"
};
