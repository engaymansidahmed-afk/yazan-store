/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  ShoppingBag, User, Ruler, LayoutGrid, Sparkles, Scissors, Info, 
  MapPin, Check, Search, Filter, Star, Eye, ArrowLeft, ArrowRight, 
  Menu, X, BadgePercent, Tag, ShieldCheck, Heart, Trash2, CheckCircle2,
  Share2, Copy
} from "lucide-react";

import { Product, TailoringOrder, CartItem, SavedMeasurements, Address, UserProfile } from "./types";
import { 
  INITIAL_PRODUCTS, PREMIUM_FABRICS, INITIAL_MEASUREMENTS, 
  INITIAL_ADDRESSES, USER_PROFILE, COUPONS 
} from "./mockData";

import TailoringStudio from "./components/TailoringStudio";
import CustomerProfile from "./components/CustomerProfile";
import AdminDashboard from "./components/AdminDashboard";
import SmartStylistChat from "./components/SmartStylistChat";

export default function App() {
  // Navigation tabs: 'home' | 'catalog' | 'tailoring' | 'account' | 'cart' | 'admin'
  const [activeTab, setActiveTab] = useState<"home" | "catalog" | "tailoring" | "account" | "cart" | "admin">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tailoringOrders, setTailoringOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedMeasurements, setSavedMeasurements] = useState<SavedMeasurements[]>(INITIAL_MEASUREMENTS);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_PROFILE);

  // Favorites List
  const [favorites, setFavorites] = useState<string[]>([]);

  // Selected Category / Search Filters for Catalog
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Active Selected Product for Detail overlay
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  
  // Share product overlay states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Coupon promo code
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Checkout process simulation
  const [selectedAddress, setSelectedAddress] = useState<Address>(savedAddresses[0] || INITIAL_ADDRESSES[0]);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"mada" | "visa" | "apple" | "stc" | "cod">("mada");
  const [orderCompleted, setOrderCompleted] = useState<any | null>(null);

  // Stylist AI Assistant Drawer toggle
  const [isStylistChatOpen, setIsStylistChatOpen] = useState(false);

  // Template to pass to tailoring studio when clicking "Tailor this design"
  const [tailoringTemplate, setTailoringTemplate] = useState<Product | null>(null);

  // Cart animation & feedback states
  const [cartPulse, setCartPulse] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: ""
  });

  const triggerCartFeedback = (message: string) => {
    setToastNotification({ visible: true, message });
    setCartPulse(true);
    setTimeout(() => {
      setToastNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
    setTimeout(() => {
      setCartPulse(false);
    }, 1000);
  };

  // Add Item to Cart
  const handleAddReadyToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    if (!size || !color) return;

    const cartId = `cart-ready-${product.id}-${size}-${color.name}`;
    const existing = cart.find(item => item.id === cartId);

    if (existing) {
      setCart(cart.map(item => item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      const newItem: CartItem = {
        id: cartId,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: 1,
        price: product.price
      };
      setCart([...cart, newItem]);
    }
    
    triggerCartFeedback(`تمت إضافة "${product.name}" إلى حقيبة التسوق بنجاح!`);
    
    // Switch to cart view to let user see
    setActiveTab("cart");
    setSelectedProduct(null);
  };

  // Add Custom Bespoke Item to Cart
  const handleAddCustomToCart = (tailoredOrder: TailoringOrder, payDeposit: boolean) => {
    // If user chose to pay a deposit (عربون), the immediate price is 100 SAR, else full tailored price
    const finalPrice = payDeposit ? 100 : tailoredOrder.price;
    const cartId = `cart-custom-${tailoredOrder.id}`;

    const newItem: CartItem = {
      id: cartId,
      tailoring: {
        ...tailoredOrder,
        // Save the payment flag in tailoring specifications
        addons: {
          ...tailoredOrder.addons,
          lengthAdjustment: payDeposit ? "دفع عربون حجز" : "دفع كامل القيمة"
        }
      },
      quantity: 1,
      price: finalPrice
    };

    setCart([...cart, newItem]);
    
    // Add directly to the user's active orders tracking list but keep status pending/approved
    setTailoringOrders([tailoredOrder, ...tailoringOrders]);

    triggerCartFeedback(`تمت إضافة تصميمك المخصص "${tailoredOrder.productType}" إلى حقيبة التسوق!`);

    setActiveTab("cart");
    setTailoringTemplate(null);
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Toggle Favorite
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Apply Coupon Code
  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      setDiscountPercentage(coupon.discountPercentage);
      setCouponSuccess(`تم تطبيق كوبون (${coupon.code}) بنجاح! خصم بقيمة ${coupon.discountPercentage}%.`);
    } else {
      setCouponError("كوبون الخصم غير صالح أو منتهي الصلاحية.");
      setDiscountPercentage(0);
    }
  };

  // Simulated Checkout Submission
  const handleCompleteCheckout = () => {
    if (cart.length === 0) return;

    // Create a robust summary order object
    const newOrderId = `YAZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const checkoutSummary = {
      id: newOrderId,
      orderDate: new Date().toLocaleDateString("ar-SA"),
      itemsCount: cart.length,
      price: calculateTotalCart(),
      paymentMethod: getPaymentMethodLabelAr(paymentMethod),
      shippingAddress: selectedAddress?.title || "المنزل",
      status: "pending"
    };

    // Push standard items into simulated database as orders too
    const newOrdersList = cart.map(item => {
      if (item.product) {
        return {
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          orderDate: new Date().toLocaleDateString("ar-SA"),
          product: item.product,
          price: item.price * item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
          paymentMethod: getPaymentMethodLabelAr(paymentMethod),
          status: "pending" as const,
          progressPercentage: 5,
        };
      } else {
        return {
          id: item.tailoring?.id || `ORD-TAILOR-${Date.now()}`,
          orderDate: new Date().toLocaleDateString("ar-SA"),
          tailoring: item.tailoring,
          price: item.price,
          paymentMethod: getPaymentMethodLabelAr(paymentMethod),
          status: item.tailoring?.status || "pending",
          progressPercentage: item.tailoring?.progressPercentage || 5,
        };
      }
    });

    setTailoringOrders((prev) => {
      const filteredPrev = prev.filter(p => !newOrdersList.some(n => n.id === p.id));
      return [...newOrdersList, ...filteredPrev];
    });

    // Award loyalty points based on total price (1 point for each 10 SAR spent)
    const pointsAwarded = Math.round(calculateTotalCart() / 10);
    setUserProfile({
      ...userProfile,
      loyaltyPoints: userProfile.loyaltyPoints + pointsAwarded
    });

    setOrderCompleted(checkoutSummary);
    setCart([]); // Empty the cart
    setDiscountPercentage(0);
    setCouponCode("");
  };

  const getPaymentMethodLabelAr = (method: string) => {
    switch (method) {
      case "mada": return "مدى (Mada)";
      case "visa": return "بطاقة ائتمان (Visa/Mastercard)";
      case "apple": return "Apple Pay";
      case "stc": return "STC Pay";
      case "cod": return "الدفع عند الاستلام";
      default: return "بطاقة مدى";
    }
  };

  // Sizing and totals helpers
  const calculateSubtotalCart = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateTotalCart = () => {
    const subtotal = calculateSubtotalCart();
    const discount = subtotal * (discountPercentage / 100);
    const shipping = shippingMethod === "express" ? 30 : 0;
    return subtotal - discount + shipping;
  };

  // Admin tailoring status updater
  const handleUpdateTailoringStatus = (id: string, newStatus: TailoringOrder["status"]) => {
    setTailoringOrders(tailoringOrders.map(o => {
      if (o.id === id) {
        let progress = 5;
        if (newStatus === "approved") progress = 20;
        if (newStatus === "workshop") progress = 45;
        if (newStatus === "sewing") progress = 70;
        if (newStatus === "quality_check") progress = 90;
        if (newStatus === "ready") progress = 100;

        return { ...o, status: newStatus, progressPercentage: progress };
      }
      return o;
    }));
  };

  const handleAddProductAdmin = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  // Filter products catalog
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                          p.nameEn.toLowerCase().includes(searchQuery) ||
                          p.subCategory.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C5A059]/20 selection:text-[#1A1A1A]">
      
      {/* 1. TOP HEADER / BRAND NAVIGATION */}
      <header className="bg-[#F9F8F6] text-[#1A1A1A] sticky top-0 z-40 border-b border-[#1A1A1A]/10 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo & Calligraphy Style */}
            <div 
              id="brand-logo-container"
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} 
              className="flex flex-col items-start cursor-pointer select-none"
            >
              <h1 className="font-serif text-3xl font-black tracking-[-0.03em] text-[#1A1A1A] leading-none">YAZAN</h1>
              <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-[0.25em] leading-none mt-1">دار يـزن للأزيـاء</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium">
              {[
                { id: "home", label: "الصفحة الرئيسية" },
                { id: "catalog", label: "كتالوج الأزياء والعود" },
                { id: "tailoring", label: "استوديو التفصيل والإنتاج" },
                { id: "account", label: "حسابي والقياسات" },
                { id: "admin", label: "إدارة المشغل والعمليات" }
              ].map((tab) => (
                <button
                  id={`nav-link-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-2 transition-all ${
                    activeTab === tab.id 
                      ? "text-[#1A1A1A] font-bold border-b border-[#1A1A1A]" 
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Icons Actions Side */}
            <div className="hidden md:flex items-center gap-6">
              {/* Member Level Indicator */}
              <div className="flex items-center gap-1.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                <span>عضوية ذهبية ({userProfile.loyaltyPoints} نقطة)</span>
              </div>

              {/* Shopping Bag Icon with Badge count */}
              <button
                id="btn-nav-cart"
                onClick={() => setActiveTab("cart")}
                className={`relative p-2 text-[#1A1A1A] hover:opacity-70 transition-all duration-200 ${
                  cartPulse ? "animate-cart-pulse text-[#C5A059]" : ""
                }`}
                title="حقيبة التسوق"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className={`absolute -top-1 -left-1 w-4.5 h-4.5 text-white rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                    cartPulse ? "bg-[#C5A059] scale-110" : "bg-[#1A1A1A]"
                  }`}>
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex md:hidden items-center gap-3">
              <button
                id="mobile-cart-indicator"
                onClick={() => setActiveTab("cart")}
                className={`relative p-2 ${
                  cartPulse ? "animate-cart-pulse text-[#C5A059]" : ""
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
                {cart.length > 0 && (
                  <span className={`absolute top-0 left-0 w-4 h-4 text-white rounded-full text-[8px] font-bold flex items-center justify-center transition-all ${
                    cartPulse ? "bg-[#C5A059] scale-110" : "bg-[#1A1A1A]"
                  }`}>
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </button>
              
              <button 
                id="toggle-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-1"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#1A1A1A]" /> : <Menu className="w-6 h-6 text-[#1A1A1A]" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F9F8F6] border-t border-[#1A1A1A]/10 px-4 py-3 space-y-2 animate-fade-in shadow-lg">
            {[
              { id: "home", label: "الصفحة الرئيسية" },
              { id: "catalog", label: "كتالوج الأزياء والعود" },
              { id: "tailoring", label: "استوديو التفصيل والإنتاج" },
              { id: "account", label: "حسابي والقياسات" },
              { id: "admin", label: "إدارة المشغل والعمليات" }
            ].map((tab) => (
              <button
                id={`mobile-nav-link-${tab.id}`}
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }}
                className={`w-full text-right py-2 text-xs font-bold block ${
                  activeTab === tab.id ? "text-[#C5A059]" : "text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 2. MAIN WORKSPACE / ROUTING SWITCH */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* TAB: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-10 animate-fade-in">
            {/* Luxury Hero Slider Banner */}
            <div className="relative bg-[#E5E2DA] text-[#1A1A1A] border border-[#1A1A1A]/10 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4 md:space-y-6 text-right z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-[#C5A059] border-b border-[#C5A059] pb-1 inline-block">
                  مجموعة صيف 2026 الحصرية • مخصصة لك
                </span>
                <h2 className="font-serif text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter">
                  أناقة <br />
                  <span className="italic font-light">تُصنع خصيصاً</span> <br />
                  <span className="text-[#C5A059]">لطلتكِ وهيبتكِ</span>
                </h2>
                <p className="text-xs md:text-sm text-[#1A1A1A]/80 leading-relaxed max-w-xl font-sans">
                  نجمع بين بيع الملابس الجاهزة الفاخرة وخياطة وتفصيل الأزياء الشرقية حسب الطلب. نعتمد على استيراد نخبة الأقمشة الحريرية الكورية واليابانية والصوف الإيطالي الكشمير الفاخر وتطويع التكنولوجيا والذكاء الاصطناعي لحساب مقاساتكِ بدقة متناهية.
                </p>

                {/* Double CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    id="hero-cta-tailor"
                    onClick={() => setActiveTab("tailoring")}
                    className="editorial-btn-primary cursor-pointer"
                  >
                    ابدأ تصميم ملابسك المخصصة
                  </button>
                  <button
                    id="hero-cta-catalog"
                    onClick={() => setActiveTab("catalog")}
                    className="editorial-btn-secondary cursor-pointer bg-transparent"
                  >
                    تصفح المجموعات الجاهزة
                  </button>
                </div>
              </div>

              {/* Decorative Luxury Image */}
              <div className="w-full md:w-96 h-64 md:h-80 overflow-hidden border border-[#1A1A1A]/10 relative group bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
                  alt="luxury fabrics fashion showcase" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#C5A059]/10 opacity-30 group-hover:bg-transparent transition-all"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-[#1A1A1A]/5 font-black font-serif pointer-events-none">YAZAN</div>
              </div>
            </div>

            {/* Quick Categories Bento Grid */}
            <div className="space-y-4">
              <div className="border-b border-[#1A1A1A]/10 pb-2">
                <h3 className="font-serif text-lg font-black tracking-tight text-[#1A1A1A]">تصفح الأقسام والخدمات الرئيسية</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { id: "women", name: "الأزياء النسائية", desc: "العبايات والفساتين والجلابيات", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300" },
                  { id: "men", name: "الأزياء الرجالية", desc: "الثياب والبدلات والقمصان المخصصة", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=300" },
                  { id: "shoes", name: "الأحذية اليدوية", desc: "الأحذية الرسمية والصنادل الشرقية", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=300" },
                  { id: "accessories", name: "الإكسسوارات والعود", desc: "الحقائب، الأحزمة، وعطور يزن الملكية", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300" },
                  { id: "tailoring", name: "مشغل التفصيل", desc: "خياطة وتطريز على المقاس بدقة", img: "https://images.unsplash.com/photo-1524295981975-64414a5136aa?auto=format&fit=crop&q=80&w=300", isSpecial: true }
                ].map((cat) => (
                  <div
                    id={`home-cat-card-${cat.id}`}
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === "tailoring") {
                        setActiveTab("tailoring");
                      } else {
                        setSelectedCategory(cat.id);
                        setActiveTab("catalog");
                      }
                    }}
                    className={`group cursor-pointer overflow-hidden relative border transition-all duration-300 ${
                      cat.isSpecial 
                        ? "border-[#C5A059] bg-[#1A1A1A] text-white" 
                        : "border-[#1A1A1A]/10 bg-white text-[#1A1A1A]"
                    }`}
                  >
                    <div className="h-28 overflow-hidden relative">
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-4 text-right">
                      <h4 className="font-serif font-black text-sm">{cat.name}</h4>
                      <p className={`text-[10px] mt-1 font-sans font-medium uppercase tracking-wider line-clamp-1 ${cat.isSpecial ? "text-[#C5A059]" : "opacity-60"}`}>{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Best Sellers Products */}
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-[#1A1A1A]/10 pb-2">
                <h3 className="font-serif text-lg font-black text-[#1A1A1A]">مجموعتنا الفاخرة الأكثر مبيعاً</h3>
                <button
                  id="home-btn-view-all"
                  onClick={() => setActiveTab("catalog")}
                  className="text-xs font-sans uppercase tracking-wider font-bold text-[#C5A059] hover:underline underline-offset-4"
                >
                  عرض الكتالوج بالكامل
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map((p) => (
                  <div
                    id={`home-prod-card-${p.id}`}
                    key={p.id}
                    className="bg-white border border-[#1A1A1A]/10 p-4 space-y-4 relative group hover:shadow-sm transition-all duration-300 text-right"
                  >
                    {/* Image frame */}
                    <div className="aspect-square overflow-hidden relative bg-[#F9F8F6]">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover eye overlay */}
                      <div 
                        onClick={() => setSelectedProduct(p)}
                        className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <span className="bg-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold px-4 py-2 flex items-center gap-2 shadow-sm">
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض التفاصيل</span>
                        </span>
                      </div>

                      {/* Best seller or new badges */}
                      {p.isBestSeller && (
                        <span className="absolute top-2 right-2 text-[9px] bg-[#C5A059] text-white px-2 py-1 font-bold uppercase tracking-wider">
                          الأكثر مبيعاً
                        </span>
                      )}
                      {p.isNew && (
                        <span className="absolute top-2 right-2 text-[9px] bg-[#1A1A1A] text-white px-2 py-1 font-bold uppercase tracking-wider">
                          جديدنا
                        </span>
                      )}
                    </div>

                    {/* Meta properties */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-[#C5A059] uppercase tracking-widest font-sans font-bold block">{p.subCategory}</span>
                      <h4 className="font-serif font-black text-sm text-[#1A1A1A] truncate leading-snug">{p.name}</h4>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A]/5">
                        <span className="font-sans text-xs font-bold text-[#1A1A1A]">{p.price} ر.س</span>
                        
                        {/* Rating stars */}
                        <div className="flex items-center gap-1 text-[#C5A059] text-[10px]">
                          <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                          <span className="font-sans font-bold text-[#1A1A1A]/70">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Partners & Experience trust widgets */}
            <div className="p-8 bg-[#F0E6D2]/30 border border-[#1A1A1A]/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-black text-sm text-[#1A1A1A]">ضمان ومثالية المقاس</h4>
                <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">تضمن يزن الدقة الفائقة لخياطينا في قص الأقمشة والتطريز وتكرار المقاسات بسهولة.</p>
              </div>

              <div className="space-y-2 border-y md:border-y-0 md:border-x border-[#1A1A1A]/10 py-4 md:py-0 md:px-6">
                <div className="w-10 h-10 bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-black text-sm text-[#1A1A1A]">مستشار الأناقة ومساعد الذكاء الاصطناعي</h4>
                <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">مساعدنا الذكي يقترح لك المقاسات الأنسب بناءً على طولك ووزنك وبنيتك الجسدية في ثوانٍ.</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-2">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-black text-sm text-[#1A1A1A]">خدمة العربون المرنة</h4>
                <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">ابدأ تفصيل عباءتك أو ثوبك الفاخر بدفع عربون 100 ر.س فقط لتشغيل الورشة، وسدد الباقي عند الشحن.</p>
              </div>
            </div>

          </div>
        )}

        {/* TAB: CATALOG / READY & CUSTOM SELECTOR */}
        {activeTab === "catalog" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Intro */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl font-bold text-stone-900">كتالوج الأزياء والإكسسوارات الفاخرة</h2>
              <p className="text-xs text-stone-500">
                تصفح تشكيلة يزن الحصرية من الملابس الجاهزة الفاخرة، أو انقر على "تخصيص وتفصيل" لتعديل المقاسات، الأقمشة، والتطريز على ذوقكِ الخاص.
              </p>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-stone-100 p-4 rounded-2xl shadow-sm">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {[
                  { id: "all", label: "الكل" },
                  { id: "women", label: "نسائي" },
                  { id: "men", label: "رجالي" },
                  { id: "shoes", label: "الأحذية" },
                  { id: "accessories", label: "الإكسسوارات والعود" }
                ].map((cat) => (
                  <button
                    id={`catalog-cat-tab-${cat.id}`}
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live search input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                <input
                  id="catalog-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                  placeholder="ابحث باسم الموديل أو نوع الفئة..."
                  className="w-full pl-3 pr-9 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-16 text-center text-stone-500 text-sm">
                عذراً، لم نجد أي تصاميم تطابق بحثك حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    id={`catalog-prod-card-${p.id}`}
                    key={p.id}
                    className="bg-white border border-stone-200 rounded-2xl overflow-hidden p-3.5 space-y-3 relative hover:shadow-md transition-all text-right"
                  >
                    {/* Image frame */}
                    <div className="aspect-square rounded-xl overflow-hidden relative bg-stone-100 group">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover eye overlay */}
                      <div 
                        onClick={() => setSelectedProduct(p)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <span className="bg-white/95 text-stone-900 text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <Eye className="w-4 h-4" />
                          <span>تصفح واشترِ</span>
                        </span>
                      </div>

                      {/* Customizable indicator */}
                      {p.isCustomizable && (
                        <span className="absolute bottom-2.5 right-2.5 text-[9px] bg-amber-600 text-stone-950 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          <span>قابل للتفصيل</span>
                        </span>
                      )}
                    </div>

                    {/* Meta properties */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-stone-400 font-bold block">{p.subCategory}</span>
                      <h4 className="font-bold text-xs text-stone-900 truncate leading-snug">{p.name}</h4>
                      
                      <div className="flex justify-between items-center pt-1.5">
                        <span className="font-mono text-xs font-bold text-amber-700">{p.price} ر.س</span>
                        
                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px]">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-mono font-bold text-stone-800">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: TAILORING BESPOKE STUDIO WIZARD */}
        {activeTab === "tailoring" && (
          <div className="space-y-6 animate-fade-in">
            <TailoringStudio 
              onAddCustomToCart={handleAddCustomToCart}
              initialTemplate={tailoringTemplate}
            />
          </div>
        )}

        {/* TAB: CLIENT ACCOUNT / SIZE PROFILE MANAGER */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-fade-in">
            <CustomerProfile 
              userProfile={userProfile}
              savedMeasurements={savedMeasurements}
              savedAddresses={savedAddresses}
              orders={tailoringOrders} // Track custom orders
              onUpdateAddresses={setSavedAddresses}
              onUpdateMeasurements={setSavedMeasurements}
            />
          </div>
        )}

        {/* TAB: SHOPPING CART & FULL CHECKOUT SIMULATOR */}
        {activeTab === "cart" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-stone-900 border-r-4 border-amber-600 pr-3 mb-6">حقيبة التسوق وإتمام الطلب</h3>
            
            {orderCompleted ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-5 shadow-lg animate-fade-in">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="font-serif text-xl font-bold text-stone-900">تهانينا! تم تسجيل طلبك بنجاح</h4>
                  <p className="text-xs text-stone-500">تم حجز الأقمشة وبدء إدراج التفصيل في المشغل</p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/50 text-xs text-right space-y-2 font-medium">
                  <div className="flex justify-between">
                    <span className="text-stone-500">رقم الفاتورة:</span>
                    <strong className="font-mono font-bold text-stone-900">{orderCompleted.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">قيمة الفاتورة المدفوعة:</span>
                    <strong className="font-mono text-amber-700 font-bold">{orderCompleted.price} ر.س</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">طريقة الدفع الفعالة:</span>
                    <strong className="text-stone-900">{orderCompleted.paymentMethod}</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 text-amber-900 text-[11px] rounded-lg">
                  * إذا كانت طلبيتك تحتوي على قطع "تفصيل مخصص"، يمكنك الانتقال فوراً لتبويب <strong>"حسابي والقياسات"</strong> أو لوحة <strong>"إدارة المشغل"</strong> لتتبع تقدم الخياطة وخطوات التفصيل لحظة بلحظة!
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    id="btn-completed-tracking"
                    onClick={() => { setOrderCompleted(null); setActiveTab("account"); }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-xs font-bold"
                  >
                    تتبع تفاصيل طلبي
                  </button>
                  <button
                    id="btn-completed-continue"
                    onClick={() => { setOrderCompleted(null); setActiveTab("catalog"); }}
                    className="px-5 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-bold"
                  >
                    مواصلة التسوق
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="p-16 text-center bg-white border border-stone-150 rounded-2xl">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-stone-700">حقيبة تسوقك فارغة حالياً.</p>
                <p className="text-xs text-stone-500 mt-1">تصفح الكتالوج للعثور على تصاميم تناسب أناقتك وهيبتك.</p>
                <button
                  id="btn-empty-cart-cta"
                  onClick={() => setActiveTab("catalog")}
                  className="mt-4 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold"
                >
                  الذهاب للكتالوج
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => {
                    const isTailored = item.tailoring !== undefined;
                    const specs = isTailored ? item.tailoring : null;

                    return (
                      <div 
                        id={`cart-line-${item.id}`}
                        key={item.id}
                        className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 text-right relative shadow-sm"
                      >
                        <img 
                          src={isTailored ? specs?.fabric?.image : item.product?.image} 
                          alt="item image" 
                          className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-xs text-stone-900 leading-snug">
                                {isTailored ? `تفصيل مخصص: ${specs?.productType}` : item.product?.name}
                              </h4>
                              
                              <button
                                id={`btn-cart-delete-${item.id}`}
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-stone-400 hover:text-red-500 transition-colors mr-2"
                                title="إزالة من السلة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[10px] text-stone-500 mt-1">
                              {isTailored ? (
                                <>قماش: {specs?.fabric?.name} | اللون: {specs?.color?.name} | كم: {specs?.measurements?.sleeveLength} سم</>
                              ) : (
                                <>المقاس: {item.selectedSize} | اللون: {item.selectedColor?.name} | الكمية: {item.quantity}</>
                              )}
                            </p>

                            {isTailored && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[9px] bg-amber-500/10 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  {specs?.addons?.lengthAdjustment}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-end mt-1">
                            <span className="text-[10px] text-stone-400">سعر الوحدة:</span>
                            <span className="font-mono text-xs font-bold text-stone-900">{item.price} ر.س</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checkout Summary Form side Panel */}
                <div className="space-y-4">
                  <div className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-4 shadow-sm text-xs">
                    <h4 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">تفاصيل الفاتورة ومتابعة الدفع</h4>
                    
                    {/* Subtotals list */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-stone-500">
                        <span>قيمة السلة الفرعية:</span>
                        <span className="font-mono">{calculateSubtotalCart()} ر.س</span>
                      </div>
                      
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>الخصم المطبق ({discountPercentage}%):</span>
                          <span className="font-mono">-{calculateSubtotalCart() * (discountPercentage / 100)} ر.س</span>
                        </div>
                      )}

                      <div className="flex justify-between text-stone-500">
                        <span>رسوم الشحن والتسليم:</span>
                        <span className="font-mono">{shippingMethod === "express" ? "30 ر.س" : "مجاني"}</span>
                      </div>

                      <div className="flex justify-between font-bold text-sm text-stone-950 border-t border-stone-100 pt-2.5">
                        <span>القيمة الإجمالية النهائية:</span>
                        <span className="font-mono text-amber-700">{calculateTotalCart()} ر.س</span>
                      </div>
                    </div>

                    {/* Promocode form */}
                    <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1 border-t border-stone-100 pt-3">
                      <input
                        id="cart-coupon-input"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="كوبون خصم (YAZAN10)"
                        className="flex-1 px-2 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs focus:outline-none focus:border-amber-600"
                      />
                      <button
                        id="btn-cart-apply-coupon"
                        type="submit"
                        className="px-3 bg-stone-900 text-white rounded text-xs font-bold hover:bg-stone-850"
                      >
                        تطبيق
                      </button>
                    </form>

                    {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
                    {couponSuccess && <p className="text-[10px] text-green-600 font-medium leading-relaxed">{couponSuccess}</p>}

                    {/* Delivery address selector */}
                    <div className="space-y-1.5 border-t border-stone-100 pt-3.5">
                      <span className="font-bold text-stone-800 block text-xs">عنوان شحن وتسليم الفاتورة:</span>
                      <select
                        id="select-checkout-address"
                        onChange={(e) => setSelectedAddress(savedAddresses.find(a => a.id === e.target.value) || savedAddresses[0])}
                        className="w-full px-2 py-1.5 border border-stone-200 bg-stone-50 rounded text-xs font-medium text-stone-800"
                      >
                        {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>{addr.title} - {addr.fullName} ({addr.city})</option>
                        ))}
                      </select>
                    </div>

                    {/* Shipping speed selector */}
                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-stone-800 block text-xs">سرعة الشحن وطريقة التوصيل:</span>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                        <button
                          id="shipping-std-btn"
                          type="button"
                          onClick={() => setShippingMethod("standard")}
                          className={`py-1 border rounded ${shippingMethod === "standard" ? "border-amber-600 bg-amber-50 text-amber-900" : "border-stone-200"}`}
                        >
                          شحن عادي (مجاني)
                        </button>
                        <button
                          id="shipping-exp-btn"
                          type="button"
                          onClick={() => setShippingMethod("express")}
                          className={`py-1 border rounded ${shippingMethod === "express" ? "border-amber-600 bg-amber-50 text-amber-900" : "border-stone-200"}`}
                        >
                          سريع (+30 ر.س)
                        </button>
                        <button
                          id="shipping-pickup-btn"
                          type="button"
                          onClick={() => setShippingMethod("pickup")}
                          className={`py-1 border rounded ${shippingMethod === "pickup" ? "border-amber-600 bg-amber-50 text-amber-900" : "border-stone-200"}`}
                        >
                          استلام فرع (مجاني)
                        </button>
                      </div>
                    </div>

                    {/* Payment methods icons options */}
                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-stone-800 block text-xs">طريقة الدفع الإلكتروني أو النقدي:</span>
                      <select
                        id="select-checkout-payment"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-2 py-1.5 border border-stone-200 bg-stone-50 rounded text-xs font-medium text-stone-800"
                      >
                        <option value="mada">مدى (Mada)</option>
                        <option value="visa">بطاقة ائتمان (Visa/Mastercard)</option>
                        <option value="apple">Apple Pay</option>
                        <option value="stc">STC Pay</option>
                        <option value="cod">الدفع عند الاستلام (+15 ر.س)</option>
                      </select>
                    </div>

                    {/* Complete action button */}
                    <button
                      id="btn-complete-checkout"
                      type="button"
                      onClick={handleCompleteCheckout}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-xl font-bold text-xs md:text-sm text-center transition-colors shadow-lg shadow-amber-600/10 mt-3"
                    >
                      تأكيد ودفع {calculateTotalCart()} ر.س
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB: ADMIN CONSOLE */}
        {activeTab === "admin" && (
          <div className="space-y-6 animate-fade-in">
            <AdminDashboard 
              products={products}
              tailoringOrders={tailoringOrders}
              onAddProduct={handleAddProductAdmin}
              onUpdateTailoringStatus={handleUpdateTailoringStatus}
            />
          </div>
        )}

      </main>

      {/* 3. PRODUCT DETAIL INTERACTIVE QUICK-VIEW OVERLAY */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/75 backdrop-blur-sm animate-fade-in">
          <div 
            id="product-details-modal"
            className="w-full max-w-2xl bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Left Media Column */}
            <div className="md:w-72 h-64 md:h-auto overflow-hidden relative shrink-0 border-l border-[#1A1A1A]/10">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#C5A059]/10 pointer-events-none mix-blend-multiply opacity-25"></div>
            </div>

            {/* Right Information Details Column */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between text-right space-y-4">
              
              {/* Product Info Header */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-[#1A1A1A] text-white px-2.5 py-0.5 font-bold font-sans uppercase tracking-[0.25em]">
                      {selectedProduct.subCategory}
                    </span>
                    
                    {/* Share Trigger Button */}
                    <button
                      id="btn-share-product"
                      type="button"
                      onClick={() => {
                        setIsShareOpen(!isShareOpen);
                        setCopiedLink(false);
                      }}
                      className="p-1 text-[#1A1A1A]/60 hover:text-[#C5A059] transition-colors flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer"
                      title="مشاركة هذا التصميم"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isShareOpen ? "إغلاق المشاركة" : "مشاركة"}</span>
                    </button>
                  </div>
                  
                  <button 
                    id="close-prod-details"
                    onClick={() => { setSelectedProduct(null); setSelectedSize(""); setSelectedColor(null); setIsShareOpen(false); }} 
                    className="p-1 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-serif text-xl font-black text-[#1A1A1A] leading-snug">{selectedProduct.name}</h3>
                
                <div className="flex items-center gap-1.5 text-[#C5A059] text-[11px] font-sans font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                  <span className="text-[#1A1A1A]">{selectedProduct.rating}</span>
                  <span className="text-[#1A1A1A]/20">|</span>
                  <span className="text-[#1A1A1A]/60 font-sans">({selectedProduct.reviewsCount} تقييم حقيقي للعملاء)</span>
                </div>
              </div>

              {/* Smart Elegant Share Panel */}
              {isShareOpen && (
                <div className="bg-[#F0E6D2]/30 border border-[#1A1A1A]/10 p-3.5 space-y-2 animate-fade-in text-right">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1">مشاركة هذا الموديل الفاخر:</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Copy Link Option */}
                    <button
                      type="button"
                      onClick={async () => {
                        const link = `${window.location.origin}/product/${selectedProduct.id}`;
                        try {
                          await navigator.clipboard.writeText(link);
                          setCopiedLink(true);
                          triggerCartFeedback("تم نسخ رابط المنتج بنجاح!");
                          setTimeout(() => setCopiedLink(false), 2000);
                        } catch (err) {
                          const input = document.createElement("input");
                          input.value = link;
                          document.body.appendChild(input);
                          input.select();
                          document.execCommand("copy");
                          document.body.removeChild(input);
                          setCopiedLink(true);
                          triggerCartFeedback("تم نسخ رابط المنتج بنجاح!");
                          setTimeout(() => setCopiedLink(false), 2000);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A]/15 bg-white hover:bg-[#1A1A1A] hover:text-white transition-all text-[10px] font-sans font-bold cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? "تم نسخ الرابط" : "نسخ الرابط المباشر"}</span>
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`شاهد هذا الموديل الفاخر من دار يزن للأزياء: ${selectedProduct.name} - ${window.location.origin}/product/${selectedProduct.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A]/15 bg-white hover:bg-[#1A1A1A] hover:text-white transition-all text-[10px] font-sans font-bold"
                    >
                      <span>واتساب</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`إطلالة ساحرة وتصميم فاخر من دار يزن للأزياء: ${selectedProduct.name}`)}&url=${encodeURIComponent(`${window.location.origin}/product/${selectedProduct.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A]/15 bg-white hover:bg-[#1A1A1A] hover:text-white transition-all text-[10px] font-sans font-bold"
                    >
                      <span>تويتر / إكس</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/product/${selectedProduct.id}`)}&text=${encodeURIComponent(`تصميم مذهل من دار يزن للأزياء: ${selectedProduct.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A]/15 bg-white hover:bg-[#1A1A1A] hover:text-white transition-all text-[10px] font-sans font-bold"
                    >
                      <span>تليجرام</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Price & Description */}
              <div className="space-y-1.5">
                <div className="font-sans text-lg font-bold text-[#1A1A1A]">{selectedProduct.price} ر.س</div>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">{selectedProduct.description}</p>
              </div>

              {/* Care Washing instructions & policies */}
              <div className="p-3.5 bg-[#F0E6D2]/30 border border-[#1A1A1A]/10 text-[10.5px] space-y-1 text-[#1A1A1A]/70">
                <p className="font-bold text-[#1A1A1A] flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>دليل الأناقة والعناية بقطعة يزن:</span>
                </p>
                <p>* يفضل الغسيل الجاف (Dry Clean) أو يدوي بارد للمحافظة على ألوان التطريز والتهديب الفاخر.</p>
                <p>* سياسة الإرجاع: نقبل الاستبدال والاسترجاع مجاناً للأزياء الجاهزة خلال 7 أيام من الاستلام.</p>
              </div>

              {/* Selection Options standard size & color */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sizes selection */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 block">المقاس الجاهز:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        id={`size-choice-${s}`}
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`w-9 h-9 border text-xs font-sans font-bold flex items-center justify-center transition-all cursor-pointer ${
                          selectedSize === s 
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" 
                            : "border-[#1A1A1A]/15 hover:border-[#1A1A1A] bg-transparent text-[#1A1A1A]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color choices selection */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 block">اللون الفاخر:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.colors.map((col) => (
                      <button
                        id={`color-choice-${col.name}`}
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`p-1 border transition-all cursor-pointer ${
                          selectedColor?.name === col.name ? "border-[#1A1A1A]" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        title={col.name}
                      >
                        <span className="w-5.5 h-5.5 border border-[#1A1A1A]/10 block" style={{ backgroundColor: col.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Standard Add to Cart OR Custom tailor bespoke */}
              <div className="flex gap-2.5 pt-3.5 border-t border-[#1A1A1A]/10">
                {selectedProduct.isCustomizable && (
                  <button
                    id="btn-tailor-this-template"
                    type="button"
                    onClick={() => {
                      setTailoringTemplate(selectedProduct);
                      setActiveTab("tailoring");
                      setSelectedProduct(null);
                      setIsShareOpen(false);
                    }}
                    className="flex-1 py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-sans text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>تفصيل مخصص على مقاسي</span>
                  </button>
                )}
                
                <button
                  id="btn-add-standard-to-cart"
                  type="button"
                  disabled={!selectedSize || !selectedColor}
                  onClick={() => {
                    handleAddReadyToCart(selectedProduct, selectedSize, selectedColor!);
                    setIsShareOpen(false);
                  }}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#333] disabled:bg-[#1A1A1A]/10 disabled:text-[#1A1A1A]/30 text-white font-sans text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title={(!selectedSize || !selectedColor) ? "الرجاء تحديد المقاس واللون أولاً" : "أضف للحقيبة"}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>شراء جاهز الآن</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. CHAT ASSISTANT STYLIST DRAWER / FLOATING */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-end gap-3.5">
        
        {/* Assistant Expanded view */}
        {isStylistChatOpen && (
          <div className="animate-fade-in-up">
            <SmartStylistChat 
              catalogProducts={products}
              onProductClick={(p) => { setSelectedProduct(p); setIsStylistChatOpen(false); }}
              onClose={() => setIsStylistChatOpen(false)}
            />
          </div>
        )}

        {/* Floating trigger round button */}
        <button
          id="btn-toggle-floating-stylist"
          onClick={() => setIsStylistChatOpen(!isStylistChatOpen)}
          className="w-12 h-12 bg-[#1A1A1A] text-[#C5A059] hover:text-white rounded-none flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-[#1A1A1A] ring-4 ring-[#C5A059]/10"
          title="مستشار يزن للأناقة"
        >
          {isStylistChatOpen ? <X className="w-5 h-5 text-[#C5A059]" /> : <Sparkles className="w-5.5 h-5.5 animate-pulse text-[#C5A059]" />}
        </button>

      </div>

      {/* 5. FOOTER BRAND BRAND */}
      <footer className="bg-[#F0E6D2]/20 text-[#1A1A1A]/80 py-12 border-t border-[#1A1A1A]/10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
          <div className="space-y-4">
            <h4 className="font-serif text-[#1A1A1A] font-black text-sm uppercase tracking-wider">منصة يزن الفاخرة للأزياء</h4>
            <p className="leading-relaxed text-[#1A1A1A]/70 font-sans">
              بوتيك متكامل متخصص في الأزياء والملابس الجاهزة وحفظ مقاسات العملاء وتفصيل العباءات والفساتين والثياب الرجالية الفاخرة باستخدام تقنيات الذكاء الاصطناعي الأكثر دقة وسهولة.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-serif text-[#1A1A1A] font-black text-sm uppercase tracking-wider">أقسام التسوق والطلب</h4>
            <button id="footer-link-women" onClick={() => { setSelectedCategory("women"); setActiveTab("catalog"); }} className="block text-[#1A1A1A]/70 hover:text-[#C5A059] transition-colors text-right cursor-pointer">العبايات والفساتين النسائية</button>
            <button id="footer-link-men" onClick={() => { setSelectedCategory("men"); setActiveTab("catalog"); }} className="block text-[#1A1A1A]/70 hover:text-[#C5A059] transition-colors text-right cursor-pointer">الثياب والبدلات الرجالية</button>
            <button id="footer-link-shoes" onClick={() => { setSelectedCategory("shoes"); setActiveTab("catalog"); }} className="block text-[#1A1A1A]/70 hover:text-[#C5A059] transition-colors text-right cursor-pointer">الأحذية والصنادل الشرقية</button>
            <button id="footer-link-acc" onClick={() => { setSelectedCategory("accessories"); setActiveTab("catalog"); }} className="block text-[#1A1A1A]/70 hover:text-[#C5A059] transition-colors text-right cursor-pointer">حقائب جلدية وعطور العود</button>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-serif text-[#1A1A1A] font-black text-sm uppercase tracking-wider">العناية بالعملاء والضمان</h4>
            <p className="text-[#1A1A1A]/70">* دليل المقاسات الذكي</p>
            <p className="text-[#1A1A1A]/70">* الشحن السريع الآمن والضمان والتبديل</p>
            <p className="text-[#1A1A1A]/70">* دفع العربون المرن للتفصيل المخصص</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-[#1A1A1A] font-black text-sm uppercase tracking-wider">الهوية والشعار</h4>
            <span className="italic text-[#C5A059] font-serif text-sm block">"يزن... أناقة تُصنع خصيصًا لك"</span>
            <p className="text-[#1A1A1A]/50 font-mono mt-2">© 2026 Yazan Fashion & Custom Tailoring. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Elegant Editorial Toast Notification */}
      {toastNotification.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white border border-[#C5A059] px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-toast-slide-in font-sans">
          <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-ping"></div>
          <p className="text-[11px] font-bold uppercase tracking-wider">{toastNotification.message}</p>
          <button 
            onClick={() => setToastNotification(prev => ({ ...prev, visible: false }))}
            className="mr-3 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
