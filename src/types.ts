/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: "women" | "men" | "shoes" | "accessories";
  subCategory: string;
  subCategoryEn: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  colors: { name: string; hex: string; nameEn: string }[];
  isCustomizable: boolean;
  fabricOption?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  discountPercentage?: number;
}

export interface Fabric {
  id: string;
  name: string;
  nameEn: string;
  origin: string;
  originEn: string;
  quality: string;
  qualityEn: string;
  priceExtra: number;
  image: string;
  colors: { name: string; hex: string; nameEn: string }[];
}

export interface SavedMeasurements {
  id: string;
  profileName: string; // e.g., "مقاساتي الخاصة", "الوالد"
  gender: "female" | "male";
  
  // Female-specific or general
  height: number;      // الطول
  shoulder: number;    // الكتف
  chest: number;       // الصدر
  waist: number;       // الخصر
  hips?: number;       // الأرداف
  sleeveLength: number;// طول الكم
  neckline?: number;   // فتحة الرقبة

  // Male-specific or general
  neck?: number;       // الرقبة
  armLength?: number;  // طول الذراع
}

export interface TailoringOrder {
  id: string;
  customerName: string;
  productType: string; // e.g., "ثوب رجالي", "عباية"
  designSource: "gallery" | "upload" | "new_design";
  designImageUrl?: string;
  designDescription?: string;
  fabric: Fabric;
  color: { name: string; hex: string };
  addons: {
    embroidery: boolean;  // تطريز
    printing: boolean;    // طباعة
    addName: string;      // اسم مخصص
    addLogo: boolean;     // شعار
    sleeveStyle: string;  // شكل الأكمام
    collarStyle: string;  // شكل الياقة
    lengthAdjustment: string; // تعديل الطول
  };
  measurements: SavedMeasurements;
  status: "pending" | "approved" | "workshop" | "sewing" | "quality_check" | "ready";
  progressPercentage: number;
  price: number;
  orderDate: string;
  deliveryDate: string;
}

export interface CartItem {
  id: string; // Unique for cart line
  product?: Product; // Defined if ready-made
  tailoring?: TailoringOrder; // Defined if custom tailoring
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  title: string; // e.g., "المنزل", "العمل"
  fullName: string;
  city: string;
  street: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  membershipLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
}

export interface ShoppingMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}
