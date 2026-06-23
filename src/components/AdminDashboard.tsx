/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  TrendingUp, BarChart3, Package, Users, ShoppingBag, 
  Scissors, Plus, Trash2, Check, RefreshCw, Layers, DollarSign, Sparkles,
  Shield, MapPin, Truck, Award, Percent, FileText, Bell, Star,
  Edit3, Eye, Copy, Archive, Settings, AlertTriangle, HelpCircle,
  BookOpen, Search, Printer, MessageSquare, Send, CreditCard,
  Moon, Sun, ShieldAlert, ArrowUpRight
} from "lucide-react";
import { Product } from "../types";

interface AdminDashboardProps {
  products: Product[];
  tailoringOrders: any[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateTailoringStatus: (id: string, newStatus: any) => void;
}

export default function AdminDashboard({
  products,
  tailoringOrders,
  onAddProduct,
  onUpdateTailoringStatus
}: AdminDashboardProps) {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "orders" | "crm" | "marketing" | "roles">("dashboard");
  const [adminDarkMode, setAdminDarkMode] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("general_manager");
  
  // Tab-specific filters & search states
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [crmSearch, setCrmSearch] = useState("");

  // Product Creator state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "", nameEn: "", description: "", descriptionEn: "",
    category: "women" as Product["category"], subCategory: "", price: "450",
    image: "", isCustomizable: true, initialStock: "25", minStock: "5",
    seoKeywords: "", sortOrder: "1"
  });

  // Selected object state for Modals
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productVariants, setProductVariants] = useState<any | null>(null);

  // Simulated Persistent states for additional requirements
  const [categories, setCategories] = useState([
    { id: "cat-1", name: "العبايات والفساتين", nameEn: "Abayas & Dresses", type: "women", order: 1, seo: "عبايات فاخرة, تفصيل عباية", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" },
    { id: "cat-2", name: "الثياب والبدلات الرجالية", nameEn: "Thobes & Suits", type: "men", order: 2, seo: "ثوب سعودي, تفصيل رجالي ممتاز", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200" },
    { id: "cat-3", name: "الأحذية الشرقية والكلاسيكية", nameEn: "Oriental Footwear", type: "shoes", order: 3, seo: "حذاء شرقي, نعال جلد طبيعي", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200" },
    { id: "cat-4", name: "الحقائب والعطور الشرقية", nameEn: "Luxury Bags & Perfume", type: "accessories", order: 4, seo: "دهن العود, بخور يزن الملكي", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200" }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: "YAZ-ORD-201", customerName: "سعد بن خالد الرويلي", date: "2026/06/23", amount: 1250, paymentMethod: "مدى (Mada)", status: "new", address: "الرياض - حي الياسمين - شارع القيروان", items: "عباية مخملية سوداء مطرزة بالذهب (1)", courier: "يزن إكسبريس" },
    { id: "YAZ-ORD-202", customerName: "نوره بنت عبدالمحسن البدري", date: "2026/06/22", amount: 890, paymentMethod: "فيزا (Visa)", status: "paid", address: "جدة - حي الحمراء - طريق الكورنيش", items: "ثوب سحابي ناصع ناعم (1)", courier: "أرامكس" },
    { id: "YAZ-ORD-203", customerName: "فيصل بن عادل القحطاني", date: "2026/06/21", amount: 2400, paymentMethod: "أبل باي (Apple Pay)", status: "shipped", address: "الدمام - حي الشاطئ - طريق الخليج", items: "عطر دهن العود العتيق (2), شال كشميري فاخر (1)", courier: "سمسا" },
    { id: "YAZ-ORD-204", customerName: "سلطان العتيبي", date: "2026/06/19", amount: 450, paymentMethod: "الدفع عند الاستلام (COD)", status: "delivered", address: "مكة المكرمة - حي العوالي", items: "شال شتوي فاخر محبوك يدوياً (1)", courier: "يزن إكسبريس" }
  ]);

  const [crmCustomers, setCrmCustomers] = useState([
    { id: "c-1", name: "عبدالله بن جاسم الغامدي", email: "ab.gh@gmail.com", phone: "0554329810", ordersCount: 8, totalSpent: 6400, rank: "VIP ذهبي", points: 840, joinDate: "2025/11/02" },
    { id: "c-2", name: "رانية بنت فهد السليمان", email: "rania.f@hotmail.com", phone: "0501122334", ordersCount: 14, totalSpent: 12550, rank: "نخبة الماس VIP", points: 1950, joinDate: "2025/08/14" },
    { id: "c-3", name: "أيمن سيد أحمد", email: "eng.ayman@gmail.com", phone: "0598877665", ordersCount: 2, totalSpent: 1420, rank: "VIP فضي", points: 250, joinDate: "2026/02/10" },
    { id: "c-4", name: "صالح الشمراني", email: "saleh.sh@outlook.com", phone: "0566778899", ordersCount: 1, totalSpent: 570, rank: "مسجل جديد", points: 50, joinDate: "2026/06/21" }
  ]);

  const [coupons, setCoupons] = useState([
    { code: "YAZAN20", discount: 20, type: "percent", expiry: "2026/12/31", maxUses: 500, usedCount: 142, status: "active" },
    { code: "ROYAL100", discount: 100, type: "fixed", expiry: "2026/09/30", maxUses: 100, usedCount: 35, status: "active" },
    { code: "EID2026", discount: 15, type: "percent", expiry: "2026/07/15", maxUses: 1000, usedCount: 789, status: "active" }
  ]);

  const [blogArticles, setBlogArticles] = useState([
    { id: "art-1", title: "تاريخ البشت الحساوي ومراحل حياكته الذهبية والقصات التاريخية", views: 1240, category: "ثقافة الأزياء", status: "published", date: "2026/06/15" },
    { id: "art-2", title: "كيف تختار القماش السويسري البارد لتفادي حرارة الصيف؟", views: 890, category: "نصائح وخامات", status: "published", date: "2026/06/10" },
    { id: "art-3", title: "دليلك الشامل لقصات العبايات الملكية في دار يزن الفاخرة", views: 2310, category: "موديلات", status: "published", date: "2026/06/01" }
  ]);

  const [notificationsHistory, setNotificationsHistory] = useState([
    { id: "not-1", title: "حملة عيد الأضحى المبارك", channel: "الرسائل النصية SMS", target: "كافة عملاء VIP", date: "2026/06/20", count: 1412 },
    { id: "not-2", title: "قسيمة خصم ترحيبية بالعملاء الجدد", channel: "البريد الإلكتروني", target: "المسجلين الجدد", date: "2026/06/22", count: 250 }
  ]);

  const [paymentsList, setPaymentsList] = useState([
    { id: "TXN-8432109", orderId: "YAZ-ORD-201", customer: "سعد الرويلي", amount: 1250, method: "Mada", status: "completed", date: "2026/06/23" },
    { id: "TXN-8432110", orderId: "YAZ-ORD-202", customer: "نوره البدري", amount: 890, method: "Visa", status: "completed", date: "2026/06/22" },
    { id: "TXN-8432111", orderId: "YAZ-ORD-203", customer: "فيصل القحطاني", amount: 2400, method: "Apple Pay", status: "completed", date: "2026/06/21" },
    { id: "TXN-8432112", orderId: "YAZ-ORD-204", customer: "سلطان العتيبي", amount: 450, method: "Cash", status: "pending", date: "2026/06/19" }
  ]);

  // Selected workshop supervisors for Tailoring Orders
  const [orderSupervisors, setOrderSupervisors] = useState<Record<string, { name: string; pct: number }>>({
    "YAZ-583021": { name: "الخياط الرئيسي م. أحمد سليم", pct: 65 }
  });

  // Dynamic notification toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Roles Metadata & constraints
  const rolesInfo: Record<string, { label: string; access: string; greeting: string; color: string }> = {
    general_manager: { label: "المدير العام (CEO)", access: "وصول كامل لكافة الصلاحيات التشغيلية والمالية", greeting: "مرحباً بك يا مدير المنصة العام. لديك تحكم مطلق.", color: "bg-amber-600 text-stone-950" },
    sales_manager: { label: "مدير المبيعات", access: "إدارة الطلبات والعملاء والتسويق دون التعديل المالي والمخازن", greeting: "أهلاً بك مدير المبيعات. نركز اليوم على مراجعة شحنات التوصيل والعملاء.", color: "bg-stone-900 text-amber-500 border border-amber-500/30" },
    inventory_manager: { label: "أمين المستودع والمخازن", access: "إدارة كتالوج المنتجات وتحديث الكميات وتنبيهات النفاذ", greeting: "مرحباً بك أمين المستودع. الرجاء تحديث المنتجات منخفضة المخزون.", color: "bg-blue-600 text-white" },
    tailoring_manager: { label: "مدير الإنتاج والتفصيل", access: "توزيع طلبيات التفصيل وتعيين خياطي المعمل ومراقبة جودتها", greeting: "مرحباً بك كبير خياطي دار يزن. وزع الأثواب على المعلمين بالمشغل.", color: "bg-purple-600 text-white" },
    customer_service: { label: "فريق الدعم والعملاء", access: "متابعة سجلات العملاء والدعم الفني دون تعديل الكتالوج", greeting: "أهلاً بك في الدعم الفني. تواصل مع الكابتن لتسهيل التوصيل للعميل.", color: "bg-emerald-600 text-white" },
    accountant: { label: "المحاسب المالي الدولي", access: "عرض التقارير المالية وإدارة المعاملات وطلبات الاسترجاع", greeting: "مرحباً بك مدير الحسابات والتدقيق المالي. مراجعة آمنة للمدفوعات.", color: "bg-indigo-600 text-white" }
  };

  // Role Switch action
  const handleRoleChange = (roleKey: string) => {
    setSelectedRole(roleKey);
    triggerToast(`تم تحويل الصلاحية النشطة إلى: ${rolesInfo[roleKey].label}`);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.subCategory) return;

    const added: Product = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      nameEn: newProd.nameEn || newProd.name,
      description: newProd.description,
      descriptionEn: newProd.descriptionEn || newProd.description,
      category: newProd.category,
      subCategory: newProd.subCategory,
      subCategoryEn: newProd.subCategoryEn || newProd.subCategory,
      price: Number(newProd.price),
      image: newProd.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600",
      rating: 5.0,
      reviewsCount: 1,
      sizes: newProd.category === "women" ? ["S", "M", "L", "XL"] : ["48", "50", "52", "54", "56"],
      colors: [{ name: "أسود داكن", hex: "#0c0a09", nameEn: "Deep Black" }],
      isCustomizable: newProd.isCustomizable,
      isNew: true
    };

    onAddProduct(added);
    triggerToast("تمت إضافة التصميم الفاخر لكتالوج دار يزن بنجاح!");
    
    // Reset state
    setNewProd({
      name: "", nameEn: "", description: "", descriptionEn: "",
      category: "women", subCategory: "", price: "450", image: "",
      isCustomizable: true, initialStock: "25", minStock: "5",
      seoKeywords: "", sortOrder: "1"
    });
    setShowAddForm(false);
  };

  // Product actions: Duplicate
  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (نسخة مكررة)`,
      nameEn: `${p.nameEn} (Copy)`,
      isNew: true
    };
    onAddProduct(duplicated);
    triggerToast(`تم استنساخ المنتج: ${p.name}`);
  };

  // Category sorting order update
  const handleCategoryOrderChange = (id: string, dir: "up" | "down") => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const nextList = [...prev];
      if (dir === "up" && idx > 0) {
        const temp = nextList[idx].order;
        nextList[idx].order = nextList[idx - 1].order;
        nextList[idx - 1].order = temp;
      } else if (dir === "down" && idx < nextList.length - 1) {
        const temp = nextList[idx].order;
        nextList[idx].order = nextList[idx + 1].order;
        nextList[idx + 1].order = temp;
      }
      return nextList.sort((a, b) => a.order - b.order);
    });
    triggerToast("تم تحديث ترتيب ظهور الأقسام على واجهة المتجر");
  };

  // Coupon action: Add new
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "15", type: "percent", maxUses: "100" });
  const handleCreateCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    setCoupons(prev => [
      ...prev,
      {
        code: newCoupon.code.toUpperCase(),
        discount: Number(newCoupon.discount),
        type: newCoupon.type,
        expiry: "2026/12/31",
        maxUses: Number(newCoupon.maxUses),
        usedCount: 0,
        status: "active"
      }
    ]);
    triggerToast(`تم تفعيل الكوبون الجديد: ${newCoupon.code.toUpperCase()}`);
    setNewCoupon({ code: "", discount: "15", type: "percent", maxUses: "100" });
  };

  // Refund actions
  const handleProcessRefund = (txnId: string) => {
    setPaymentsList(prev => prev.map(t => t.id === txnId ? { ...t, status: "refunded" } : t));
    triggerToast(`تمت الموافقة الآمنة وإرجاع المبلغ للعملية ${txnId}`);
  };

  // Dynamic calculations for Dashboard metrics
  const totalSalesFromBespoke = tailoringOrders.reduce((acc, o) => acc + (o.price || 0), 0);
  const totalSalesFromStandard = purchaseOrders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const totalSalesSum = totalSalesFromBespoke + totalSalesFromStandard + 248000; // base sales offset

  const activeTailoringCount = tailoringOrders.filter(o => o.status !== "ready").length;
  const pendingPurchaseCount = purchaseOrders.filter(o => o.status === "new" || o.status === "paid").length;

  return (
    <div className={`w-full rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
      adminDarkMode 
        ? "bg-stone-900 border-stone-800 text-stone-100" 
        : "bg-white border-stone-200 text-stone-900"
    }`} style={{ direction: "rtl" }}>
      
      {/* Dynamic Toast Alerts */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-stone-950 text-amber-400 px-6 py-3.5 rounded-2xl text-xs font-bold shadow-2xl border border-amber-600/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LUXURY TOP BRANDING PANEL */}
      <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
        adminDarkMode ? "bg-stone-950 border-stone-800" : "bg-stone-50 border-stone-100"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-stone-950 text-amber-500 rounded-xl shadow-lg border border-amber-500/20">
              <Layers className="w-5.5 h-5.5" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2">
                <span className={adminDarkMode ? "text-white" : "text-stone-900"}>بوابة الإشراف والتحكم التنفيذي لدار يزن</span>
              </h2>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                لوحة SaaS الاحترافية لإدارة الأزياء وتفصيل البشت والمشالح والعبايات
              </span>
            </div>
          </div>
        </div>

        {/* TOP CONFIG BAR: MODE SELECTOR & ROLE SWITCHER */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Light/Dark mode toggler */}
          <button
            id="btn-admin-theme-toggle"
            onClick={() => {
              setAdminDarkMode(!adminDarkMode);
              triggerToast(`تم تحويل لوحة الإدارة إلى الوضع ${!adminDarkMode ? "المظلم" : "المضيء"}`);
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
              adminDarkMode 
                ? "bg-stone-800 border-stone-700 text-amber-400 hover:bg-stone-700" 
                : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100 shadow-sm"
            }`}
            title="تغيير مظهر لوحة الإدارة"
          >
            {adminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{adminDarkMode ? "الوضع المضيء" : "الوضع المظلم"}</span>
          </button>

          {/* Active Role Simulator Dropdown */}
          <div className="flex items-center gap-2 border rounded-xl p-1.5 bg-stone-900/5">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${adminDarkMode ? "text-stone-300" : "text-stone-600"}`}>الصلاحية النشطة:</span>
            <select
              id="admin-role-selector"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-stone-950 text-amber-400 text-xs font-bold py-1 px-3.5 rounded-lg border border-amber-500/20 focus:outline-none"
            >
              {Object.entries(rolesInfo).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ROLE GREETING BANNER */}
      <div className={`px-6 py-3 border-b text-xs flex items-center justify-between gap-4 ${
        adminDarkMode ? "bg-amber-600/10 border-stone-800 text-amber-300" : "bg-amber-500/5 border-stone-100 text-stone-700"
      }`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            <strong className="font-bold text-amber-700 ml-1">[{rolesInfo[selectedRole].label}]:</strong> 
            {rolesInfo[selectedRole].greeting}
          </span>
        </div>
        <div className="hidden md:block text-[10px] text-stone-400 font-mono">
          نطاق الوصول: {rolesInfo[selectedRole].access}
        </div>
      </div>

      {/* MAIN LAYOUT: HORIZONTAL TAB BUTTONS */}
      <div className={`p-3 border-b flex flex-wrap gap-1.5 ${
        adminDarkMode ? "bg-stone-900/50 border-stone-800" : "bg-stone-50/50 border-stone-100"
      }`}>
        {[
          { id: "dashboard", label: "الرئيسية والتحليلات", icon: BarChart3 },
          { id: "catalog", label: "الكتالوج والمخزون", icon: Package },
          { id: "orders", label: "إدارة ومراحل الطلبات", icon: Scissors },
          { id: "crm", label: "العملاء والمدفوعات", icon: Users },
          { id: "marketing", label: "التسويق والمحتوى", icon: Percent },
          { id: "roles", label: "الأدوار والصلاحيات", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-stone-950 text-white shadow-xl shadow-stone-950/20 border border-stone-800 text-amber-400"
                  : adminDarkMode
                    ? "text-stone-400 hover:text-white hover:bg-stone-800"
                    : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-stone-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <div className="p-6">
        
        {/* ==================== TAB 1: EXECUTIVE DASHBOARD & KPI'S ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI WIDGETS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className={`p-4 rounded-2xl border ${adminDarkMode ? "bg-stone-950/40 border-stone-800" : "bg-white border-stone-200 shadow-sm"} flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">إجمالي مبيعات يزن</span>
                  <span className="text-xl font-mono font-bold block">{totalSalesSum.toLocaleString()} ر.س</span>
                  <span className="text-[9px] text-green-600 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.2% عن الشهر الماضي</span>
                  </span>
                </div>
                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${adminDarkMode ? "bg-stone-950/40 border-stone-800" : "bg-white border-stone-200 shadow-sm"} flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">طلبات التفصيل الجارية</span>
                  <span className="text-xl font-mono font-bold block">{activeTailoringCount} أثواب مخصصة</span>
                  <span className="text-[9px] text-amber-600 font-bold">قيد الخياطة والقص بالمشغل</span>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Scissors className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${adminDarkMode ? "bg-stone-950/40 border-stone-800" : "bg-white border-stone-200 shadow-sm"} flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">شحنات الشراء العادية الجارية</span>
                  <span className="text-xl font-mono font-bold block">{pendingPurchaseCount} شحنات جارية</span>
                  <span className="text-[9px] text-emerald-600 font-bold">بانتظار الفرز والتسليم للكابتن</span>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${adminDarkMode ? "bg-stone-950/40 border-stone-800" : "bg-white border-stone-200 shadow-sm"} flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">قاعدة العملاء المشتركين</span>
                  <span className="text-xl font-mono font-bold block">1,412 عميل VIP</span>
                  <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>82% عضوية ذهبية وماسية</span>
                  </span>
                </div>
                <div className="p-3 bg-stone-950 text-amber-500 rounded-xl border border-amber-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* CHARTS & GRAPHICAL INTERFACES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Sales By Category Chart */}
              <div className={`p-5 rounded-2xl border lg:col-span-2 ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
                <div className="flex justify-between items-center border-b pb-3 border-stone-100">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span className={adminDarkMode ? "text-stone-100" : "text-stone-900"}>توزيع مبيعات الأقسام (الربع الحالي لعام 2026)</span>
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">آخر تحديث: تلقائي منذ دقيقة</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "الأزياء النسائية (العبايات الفاخرة والفساتين)", pct: 55, count: "136,400 ر.س", color: "bg-amber-600" },
                    { label: "الأزياء الرجالية (البشوت والثياب والبدلات)", pct: 30, count: "74,400 ر.س", color: "bg-stone-900" },
                    { label: "الأحذية الشرقية الجلدية الكلاسيكية والمطرزة", pct: 10, count: "24,800 ر.س", color: "bg-amber-500" },
                    { label: "العطور الفاخرة، والعود الملكي والحقائب النسائية", pct: 5, count: "12,400 ر.س", color: "bg-stone-400" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-bold ${adminDarkMode ? "text-stone-300" : "text-stone-700"}`}>{item.label}</span>
                        <div className="flex items-center gap-2 font-mono font-bold">
                          <span className="text-stone-400 text-[10px]">({item.count})</span>
                          <span className="text-amber-600">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational & Workshop Efficiency Metrics */}
              <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} flex flex-col justify-between space-y-4`}>
                <div className="border-b pb-3 border-stone-100">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className={adminDarkMode ? "text-stone-100" : "text-stone-900"}>مؤشرات الأداء اللوجستي والورشة</span>
                  </h4>
                </div>

                <div className={`p-4 rounded-xl text-center border ${adminDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-100"} space-y-1`}>
                  <span className="text-[10px] text-stone-400 font-bold block">متوسط زمن إنجاز التفصيل المخصص لدار يزن</span>
                  <span className="text-3xl font-serif font-bold text-amber-600">7.2 أيام عمل</span>
                  <span className="text-[9px] text-stone-500 block">أسرع بـ 2.8 أيام عمل من متوسط دورات التفصيل بالمملكة</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className={`p-3 rounded-xl border ${adminDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-100"}`}>
                    <span className="text-stone-400 block text-[9px] font-bold">دقة القياسات المحفوظة</span>
                    <strong className="text-green-600 font-bold text-base block mt-0.5">99.6%</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${adminDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-100"}`}>
                    <span className="text-stone-400 block text-[9px] font-bold">معدل استرجاع الطلبات</span>
                    <strong className="text-stone-500 font-bold text-base block mt-0.5">0.4%</strong>
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 flex items-center gap-1 bg-stone-500/5 p-2 rounded-lg">
                  <Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>تنبيه: تم إرسال 4 تنبيهات تلقائية لمخازن الأقمشة منخفضة المخزون اليوم.</span>
                </div>
              </div>

            </div>

            {/* LATEST TRANSACTIONS & ACTIVITY MINI LOGS */}
            <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-3">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className={adminDarkMode ? "text-stone-100" : "text-stone-900"}>أحدث أنشطة المنصة التشغيلية والمالية والإنتاجية</span>
              </h4>

              <div className="divide-y divide-stone-100 text-xs">
                {[
                  { time: "قبل 5 دقائق", title: "اعتماد طلب تفصيل بشت رجالي جديد وتعيينه للمعلم أحمد سليم", category: "تفصيل", badge: "نشط" },
                  { time: "قبل 15 دقيقة", title: "دفع آمن ناجح بقيمة 1250 ر.س عبر مدي للعميل سعد الرويلي", category: "مالية", badge: "مكتمل" },
                  { time: "قبل ساعة", title: "كابتن الشحن عبدالله الغامدي ينطلق لتوصيل الطلب YAZ-ORD-204", category: "لوجستي", badge: "خارج للتوصيل" },
                  { time: "اليوم 11:00 ص", title: "تعديل مستويات مخزون القماش الإيطالي المبرد (تنبيه بالانخفاض)", category: "المخازن", badge: "تنبيه" }
                ].map((act, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className={`font-bold ${adminDarkMode ? "text-stone-200" : "text-stone-800"}`}>{act.title}</p>
                      <span className="text-[10px] text-stone-400">{act.time} • القسم: {act.category}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-bold rounded text-[9px] shrink-0">
                      {act.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: CATALOG, VARIANTS & INVENTORY ==================== */}
        {activeTab === "catalog" && (
          <div className="space-y-6 animate-fade-in">
            {/* INVENTORY ALERTS & COUNTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl border border-red-200 bg-red-500/5 text-red-800 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">تنبيه: مخزون منخفض! (أقل من الحد الأدنى)</strong>
                  <span>عباية مخملية سوداء مطرزة بالذهب متبقي 2 قطع فقط في مخزن الرياض الرئيسي.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-500/5 text-amber-800 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">متطلبات إعادة ترتيب الطلب التلقائي</strong>
                  <span>تم تحفيز طلب توريد لـ 50 ياردة من القماش السويسري البارد لدار الإنتاج.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-500/5 text-stone-800 flex items-center gap-3">
                <Package className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">قائمة المتغيرات المتاحة للتصميم</strong>
                  <span>تخصيص كامل للأحجام والألوان والأقمشة لكل موديل على حده.</span>
                </div>
              </div>

            </div>

            {/* CATALOG TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="ابحث باسم الموديل أو رقم تصنيف التصميم الفاخر..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border outline-none ${
                    adminDarkMode 
                      ? "bg-stone-950 border-stone-800 text-stone-100" 
                      : "bg-stone-50 border-stone-200 text-stone-800"
                  }`}
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
              </div>

              <button
                id="btn-trigger-add-product"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-stone-950 hover:bg-stone-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>إضافة تصميم / منتج جديد</span>
              </button>
            </div>

            {/* ADD PRODUCT COLLAPSIBLE FORM */}
            {showAddForm && (
              <form onSubmit={handleAddProductSubmit} className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/50 border-stone-800" : "bg-stone-50 border-stone-200"} space-y-4 animate-fade-in`}>
                <h4 className="text-xs font-bold text-stone-900 border-r-4 border-amber-600 pr-2 block">إضافة مواصفات منتج فاخر جديد للكتالوج</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">اسم الموديل بالعربية *</label>
                    <input
                      type="text" required
                      value={newProd.name}
                      onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                      placeholder="مثال: عباية الحرير الملكي الفاخرة المطرزة بالخرز"
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">اسم الموديل بالإنجليزية (English Title) *</label>
                    <input
                      type="text" required
                      value={newProd.nameEn}
                      onChange={(e) => setNewProd({...newProd, nameEn: e.target.value})}
                      placeholder="Royal Beaded Silk Abaya"
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">القسم الرئيسي *</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({...newProd, category: e.target.value as any})}
                      className="w-full px-2 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    >
                      <option value="women">نسائي (women)</option>
                      <option value="men">رجالي (men)</option>
                      <option value="shoes">أحذية (shoes)</option>
                      <option value="accessories">إكسسوارات (accessories)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">الفئة الفرعية (مثال: عبايات) *</label>
                    <input
                      type="text" required
                      value={newProd.subCategory}
                      onChange={(e) => setNewProd({...newProd, subCategory: e.target.value})}
                      placeholder="مثال: عبايات شتوية"
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">السعر الأساسي (ر.س) *</label>
                    <input
                      type="number" required
                      value={newProd.price}
                      onChange={(e) => setNewProd({...newProd, price: e.target.value})}
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800 text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">الترتيب الافتراضي للظهور *</label>
                    <input
                      type="number"
                      value={newProd.sortOrder}
                      onChange={(e) => setNewProd({...newProd, sortOrder: e.target.value})}
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800 text-center font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">الكلمات الدلالية لمحركات البحث (SEO Keywords)</label>
                    <input
                      type="text"
                      value={newProd.seoKeywords}
                      onChange={(e) => setNewProd({...newProd, seoKeywords: e.target.value})}
                      placeholder="عباية سهرة, بشت ملكي, خياطة رجالي فاخرة"
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">رابط الصورة المباشر للموديل</label>
                    <input
                      type="text"
                      value={newProd.image}
                      onChange={(e) => setNewProd({...newProd, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-stone-600 font-bold mb-1">وصف الموديل وتفاصيل الخياطة والخامة</label>
                  <textarea
                    rows={2}
                    value={newProd.description}
                    onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                    placeholder="مواصفات الخامات المستخدمة ونعومتها والمقاسات النموذجية..."
                    className="w-full p-2.5 border border-stone-200 bg-white rounded-lg text-stone-800"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200/60">
                  <input
                    id="chk-customizable"
                    type="checkbox"
                    checked={newProd.isCustomizable}
                    onChange={(e) => setNewProd({...newProd, isCustomizable: e.target.checked})}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="chk-customizable" className="font-bold text-stone-700">تفعيل خيار "تفصيل مخصص حسب المقاس والوزن والطول" لهذا المنتج</label>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold bg-white"
                  >
                    إلغاء التعبئة
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold"
                  >
                    تأكيد وإضافة للمتجر فوراً
                  </button>
                </div>
              </form>
            )}

            {/* PRODUCTS DIRECTORY TABLE */}
            <div className={`border rounded-2xl overflow-hidden ${adminDarkMode ? "bg-stone-950/20 border-stone-800" : "bg-white border-stone-200 shadow-sm"}`}>
              <div className="p-4 border-b bg-stone-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-800">قائمة الكتالوج وتفاصيل المخزون والمتغيرات</span>
                <span className="text-[10px] font-mono text-stone-400">إجمالي العناصر المتاحة: {products.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold">
                      <th className="p-3.5">صورة الموديل</th>
                      <th className="p-3.5">اسم وتفصيل المنتج</th>
                      <th className="p-3.5">القسم</th>
                      <th className="p-3.5">السعر الأساسي</th>
                      <th className="p-3.5">المخزون المتوفر</th>
                      <th className="p-3.5">التفصيل المخصص</th>
                      <th className="p-3.5 text-center">الإجراءات والتحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.filter(p => p.name.includes(productSearch) || p.subCategory.includes(productSearch)).map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/40">
                        <td className="p-3">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-3 font-bold">
                          <div>
                            <span className="text-stone-900 block">{p.name}</span>
                            <span className="text-[9px] text-stone-400 block font-mono">{p.nameEn} • كود: {p.id}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-stone-100 rounded text-stone-600 font-bold text-[10px]">
                            {p.category === "women" ? "نسائي" : p.category === "men" ? "رجالي" : p.category === "shoes" ? "أحذية" : "إكسسوارات"} ({p.subCategory})
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-700">{p.price} ر.س</td>
                        <td className="p-3">
                          {p.price > 800 ? (
                            <span className="text-red-600 font-bold flex items-center gap-1 text-[10px]">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>2 قطع (مخزون حرج)</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-mono">25 قطعة</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.isCustomizable ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-400"
                          }`}>
                            {p.isCustomizable ? "متاح للتعديل" : "جاهز فقط"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setProductVariants(p);
                                triggerToast(`عرض متغيرات مقاسات وألوان: ${p.name}`);
                              }}
                              className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                              title="عرض وإدارة المتغيرات المخزنية"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1 text-amber-600 hover:text-amber-800 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                              title="نسخ وتكرار هذا الموديل"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => triggerToast(`تمت أرشفة الموديل الفاخر: ${p.name}`)}
                              className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                              title="أرشفة المنتج مؤقتاً"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VISUAL VARIABLES MODAL / ACCORDION */}
            {productVariants && (
              <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"} space-y-4`}>
                <div className="flex justify-between items-center border-b pb-3 border-stone-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-amber-600" />
                    <h5 className="text-xs font-bold text-stone-900">إدارة المتغيرات التفصيلية للموديل: {productVariants.name}</h5>
                  </div>
                  <button onClick={() => setProductVariants(null)} className="text-xs font-bold text-stone-400 hover:text-stone-700">إغلاق</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-stone-150">
                    <strong className="block text-[11px] text-stone-700 mb-2">الألوان المتاحة في المشغل:</strong>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: "#0c0a09" }}></span>
                        <span>الأسود الداكن الفاخر (افتراضي)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300 animate-pulse" style={{ backgroundColor: "#1e3a8a" }}></span>
                        <span>الكحلي الليلي الملكي (+50 ر.س)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-150">
                    <strong className="block text-[11px] text-stone-700 mb-2">المقاسات المعتمدة:</strong>
                    <div className="flex gap-1.5 flex-wrap">
                      {productVariants.sizes?.map((sz: string) => (
                        <span key={sz} className="px-2 py-1 bg-stone-100 rounded font-mono font-bold text-[10px] text-stone-800">{sz}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-150">
                    <strong className="block text-[11px] text-stone-700 mb-2">الأقمشة المتوفرة الموصى بها:</strong>
                    <div className="space-y-1 text-stone-600">
                      <p>• القطن السويسري النقي المبرد (متوفر)</p>
                      <p>• الكتان الياباني الصافي الفاخر (متوفر)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTIONS & SORTING MANAGEMENT */}
            <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
              <h4 className="text-xs font-bold text-stone-900 uppercase border-b pb-2">إدارة الأقسام والترتيب وظهور الصفحة الرئيسية</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-3 relative text-right">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-xs text-stone-900 block font-bold">{cat.name}</strong>
                        <span className="text-[10px] text-stone-400 font-mono">{cat.nameEn}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-stone-200 px-1.5 py-0.5 rounded font-bold">الترتيب: {cat.order}</span>
                    </div>

                    <p className="text-[10px] text-stone-500 truncate">الكلمات الدلالية: {cat.seo}</p>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCategoryOrderChange(cat.id, "up")}
                        className="flex-1 py-1 bg-white hover:bg-stone-100 border rounded text-[10px] font-bold"
                      >
                        ▲ رفع الترتيب
                      </button>
                      <button
                        onClick={() => handleCategoryOrderChange(cat.id, "down")}
                        className="flex-1 py-1 bg-white hover:bg-stone-100 border rounded text-[10px] font-bold"
                      >
                        ▼ خفض الترتيب
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: PURCHASE & BESPOKE TAILORING ORDERS ==================== */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* ORDERS FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="ابحث باسم العميل أو رقم الطلب أو كود الشحنة..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border outline-none ${
                    adminDarkMode 
                      ? "bg-stone-950 border-stone-800 text-stone-100" 
                      : "bg-stone-50 border-stone-200 text-stone-800"
                  }`}
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
              </div>

              <div className="text-xs text-stone-500 font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/15">
                تتبع مراحل تصنيع الورشة والطلبات العادية الجاهزة للشحن
              </div>
            </div>

            {/* SECTION A: STANDARD PURCHASE ORDERS (إدارة طلبات الشراء العادية) */}
            <div className={`border rounded-2xl overflow-hidden ${adminDarkMode ? "bg-stone-950/20 border-stone-800" : "bg-white border-stone-200 shadow-sm"}`}>
              <div className="p-4 border-b bg-stone-50/50 flex justify-between items-center">
                <strong className="text-xs text-stone-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-4.5 h-4.5 text-amber-600" />
                  <span>طلبات الشراء العادية الجاهزة للتوصيل والشحن</span>
                </strong>
                <span className="text-[10px] font-mono text-stone-400">إجمالي الطلبات العادية: {purchaseOrders.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold">
                      <th className="p-3.5">رقم الطلب</th>
                      <th className="p-3.5">العميل الفاخر</th>
                      <th className="p-3.5">المنتجات المطلوبة</th>
                      <th className="p-3.5">قيمة الفاتورة</th>
                      <th className="p-3.5">شركة الشحن</th>
                      <th className="p-3.5">حالة وتحديث الطلب</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {purchaseOrders.filter(o => o.customerName.includes(orderSearch) || o.id.includes(orderSearch)).map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/40">
                        <td className="p-3.5 font-mono font-bold text-stone-950">{o.id}</td>
                        <td className="p-3.5">
                          <div>
                            <span className="font-bold text-stone-800 block">{o.customerName}</span>
                            <span className="text-[9px] text-stone-400 block">{o.address}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-stone-600 max-w-[200px] truncate">{o.items}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-700">{o.amount} ر.س</td>
                        <td className="p-3.5">
                          <span className="px-2 py-1 bg-stone-100 rounded text-stone-700 font-bold text-[10px] flex items-center gap-1 w-max">
                            <Truck className="w-3.5 h-3.5 text-amber-500" />
                            <span>{o.courier}</span>
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={o.status}
                            onChange={(e) => {
                              const updatedStatus = e.target.value;
                              setPurchaseOrders(prev => prev.map(item => item.id === o.id ? { ...item, status: updatedStatus } : item));
                              triggerToast(`تم تحديث حالة الطلب ${o.id} بنجاح!`);
                            }}
                            className="bg-stone-50 text-stone-800 text-[10.5px] font-bold border rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="new">جديد (بانتظار المراجعة)</option>
                            <option value="paid">تم الدفع (قيد التجهيز)</option>
                            <option value="wrapped">تم التغليف الفاخر</option>
                            <option value="shipped">تم التسليم لشركة الشحن</option>
                            <option value="delivered">تم التسليم النهائي</option>
                            <option value="cancelled">ملغي</option>
                            <option value="returned">مسترجع</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setViewingInvoice(o);
                              triggerToast(`تحميل فاتورة الطلب: ${o.id}`);
                            }}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-[10px] flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>عرض الفاتورة</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION B: BESPOKE TAILORING PRODUCTION (طلبات التفصيل المخصصة والمعامل) */}
            <div className={`border rounded-2xl overflow-hidden ${adminDarkMode ? "bg-stone-950/20 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4 p-5`}>
              <div className="border-b pb-3 flex justify-between items-center border-stone-100">
                <strong className="text-xs text-stone-850 flex items-center gap-1.5">
                  <Scissors className="w-4.5 h-4.5 text-amber-600" />
                  <span>خط الإنتاج والورش المخصصة للتفصيل</span>
                </strong>
                <span className="text-[10px] text-stone-400">تحويل الطلب للمشغل، تعيين المعلم الخياط ومراقبة الإنجاز المباشر</span>
              </div>

              {tailoringOrders.length === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">لا توجد طلبات تفصيل مخصصة حالياً.</div>
              ) : (
                <div className="space-y-4">
                  {tailoringOrders.map((order) => {
                    const isTailored = order.productType !== undefined || order.tailoring !== undefined;
                    const item = order.tailoring ? order.tailoring : order;
                    const customerName = item.customerName || "عميل دار يزن الفاخر";
                    const orderId = order.id;
                    const supervisorInfo = orderSupervisors[orderId] || { name: "غير معين (بانتظار الإسناد)", pct: 15 };

                    return (
                      <div key={orderId} className={`p-4 rounded-xl border ${adminDarkMode ? "bg-stone-900/40 border-stone-800" : "bg-stone-50 border-stone-200/60"} space-y-4`}>
                        {/* Summary Line */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 border-stone-100 text-xs gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">العميل: {customerName}</span>
                              <span className="px-1.5 py-0.5 bg-amber-600/15 text-amber-800 font-bold text-[9px] rounded">
                                طلب تفصيل مخصص #{orderId}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 block mt-0.5">تاريخ الطلب: {order.orderDate} | القيمة: {order.price} ر.س</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-500 text-[11px]">مرحلة المشغل الحالية:</span>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                              {order.status === "pending" && "بانتظار المراجعة والاعتماد"}
                              {order.status === "approved" && "معتمد - بانتظار تحويل المشغل"}
                              {order.status === "workshop" && "في الورشة الرئيسية"}
                              {order.status === "sewing" && "قيد الخياطة والتطريز اليدوي"}
                              {order.status === "quality_check" && "فحص الجودة والتهديب النهائي"}
                              {order.status === "ready" && "جاهز للتوصيل والاتصال بالشحن"}
                            </span>
                          </div>
                        </div>

                        {/* Supervisor Dispatch Selector & Percentage Tracker */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Left Column: Workshop Dispatch & Quality supervisor */}
                          <div className="space-y-2.5 bg-white p-3 rounded-lg border border-stone-200">
                            <strong className="block text-[11px] text-stone-700 font-bold mb-1">توزيع العمل وتعيين المعلم المسؤول:</strong>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-stone-400 text-[10px]">المعلم الخياط:</span>
                              <select
                                value={supervisorInfo.name}
                                onChange={(e) => {
                                  const nameVal = e.target.value;
                                  setOrderSupervisors(prev => ({
                                    ...prev,
                                    [orderId]: { ...supervisorInfo, name: nameVal }
                                  }));
                                  triggerToast(`تم تكليف ${nameVal} بمتابعة تفصيل الطلب ${orderId}`);
                                }}
                                className="bg-stone-50 text-stone-800 font-bold border rounded px-2 py-1 focus:outline-none"
                              >
                                <option value="غير معين (بانتظار الإسناد)">اختر الخياط أو المشغل المعتمد...</option>
                                <option value="المعلم أحمد سليم (معمل العبايات النسائية)">المعلم أحمد سليم (معمل العبايات النسائية)</option>
                                <option value="المعلم مصطفى البكاري (معمل الثياب الفاخرة)">المعلم مصطفى البكاري (معمل الثياب الفاخرة)</option>
                                <option value="المشغل الرئيسي لدار يزن (المزاحمية)">المشغل الرئيسي لدار يزن (المزاحمية)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5 pt-1.5">
                              <div className="flex justify-between text-[10px] text-stone-500 font-bold">
                                <span>معدل اكتمال الحياكة الفعلي:</span>
                                <span className="font-mono text-amber-700">{supervisorInfo.pct}%</span>
                              </div>
                              <input
                                type="range" min="0" max="100" step="5"
                                value={supervisorInfo.pct}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setOrderSupervisors(prev => ({
                                    ...prev,
                                    [orderId]: { ...supervisorInfo, pct: val }
                                  }));
                                }}
                                className="w-full accent-amber-600 cursor-pointer h-1 bg-stone-200 rounded"
                              />
                            </div>
                          </div>

                          {/* Right Column: Garment Specs & approved measurements summary */}
                          <div className="space-y-1 bg-white p-3 rounded-lg border border-stone-200">
                            <strong className="block text-[11px] text-stone-700 font-bold mb-1">تفاصيل ومقاسات القطعة المعتمدة:</strong>
                            <p><span className="text-stone-400">نوع اللباس:</span> <strong className="text-stone-850 font-bold">{item.productType || "ثوب تفصيل فاخر"}</strong></p>
                            <p><span className="text-stone-400">نوع القماش واللون:</span> <strong className="text-stone-850 font-bold">{item.fabric?.name || "قطن سويسري"} ({item.color?.name || "أبيض"})</strong></p>
                            <p><span className="text-stone-400">الطول / الكتف / الصدر:</span> <strong className="text-stone-850 font-mono font-bold">{item.measurements?.height || "172"}سم / {item.measurements?.shoulder || "44"}سم / {item.measurements?.chest || "102"}سم</strong></p>
                          </div>
                        </div>

                        {/* Stage actions for tailoring */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-stone-600 block">تحديث مرحلة تفصيل المعمل لهذه القطعة:</span>
                          <div className="flex flex-wrap gap-1">
                            {[
                              { id: "pending", label: "استقبال الطلب" },
                              { id: "approved", label: "اعتماد التصميم" },
                              { id: "workshop", label: "تحويل للورشة" },
                              { id: "sewing", label: "بدء الخياطة والتطريز" },
                              { id: "quality_check", label: "فحص الجودة" },
                              { id: "ready", label: "جاهز للتسليم" }
                            ].map((step) => (
                              <button
                                key={step.id}
                                type="button"
                                onClick={() => {
                                  onUpdateTailoringStatus(orderId, step.id as any);
                                  // Update simulator percent alongside status for nicer sync
                                  let targetPct = 15;
                                  if (step.id === "approved") targetPct = 35;
                                  if (step.id === "workshop") targetPct = 50;
                                  if (step.id === "sewing") targetPct = 75;
                                  if (step.id === "quality_check") targetPct = 90;
                                  if (step.id === "ready") targetPct = 100;
                                  setOrderSupervisors(prev => ({
                                    ...prev,
                                    [orderId]: { ...supervisorInfo, pct: targetPct }
                                  }));
                                  triggerToast(`تم نقل بشت/ثوب العميل لخطوة: ${step.label}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  order.status === step.id
                                    ? "bg-amber-600 text-stone-950 shadow"
                                    : "bg-white hover:bg-stone-100 text-stone-700 border"
                                }`}
                              >
                                {step.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LIGHTBOX INVOICE PRINTER VIEW MODAL */}
            {viewingInvoice && (
              <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                <div className="bg-white text-stone-900 rounded-3xl p-6 w-full max-w-2xl border-t-8 border-amber-600 shadow-2xl space-y-6">
                  {/* Logo Banner */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div className="space-y-1 text-right">
                      <h3 className="font-serif text-lg font-bold">فاتورة ضريبية معتمدة - دار يزن الفاخرة</h3>
                      <p className="text-[10px] text-stone-400 font-mono">الرقم الضريبي: 398240210003</p>
                    </div>
                    <button 
                      onClick={() => setViewingInvoice(null)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold"
                    >
                      إغلاق النافذة
                    </button>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block font-bold">اسم العميل:</span>
                      <strong className="text-stone-800 font-bold">{viewingInvoice.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-bold">رقم وتاريخ الفاتورة:</span>
                      <strong className="text-stone-800 font-bold">{viewingInvoice.id} • {viewingInvoice.date}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 block font-bold">عنوان شحن الباب:</span>
                      <strong className="text-stone-800 font-bold">{viewingInvoice.address}</strong>
                    </div>
                  </div>

                  {/* Products Table inside Invoice */}
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-stone-50 font-bold text-stone-500">
                        <tr>
                          <th className="p-2.5">البيان والقطعة</th>
                          <th className="p-2.5">طريقة الدفع</th>
                          <th className="p-2.5">المبلغ شامل الضريبة</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2.5">{viewingInvoice.items}</td>
                          <td className="p-2.5">{viewingInvoice.paymentMethod}</td>
                          <td className="p-2.5 font-mono font-bold text-amber-700">{viewingInvoice.amount} ر.س</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center text-xs bg-stone-50 p-3 rounded-xl border">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>شكراً لتسوقكم من دار يزن للأزياء الفاخرة والملكية.</span>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة وتصدير الفاتورة</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 4: CRM, LOYALTY & PAYMENTS REFUNDS ==================== */}
        {activeTab === "crm" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* CRM TOOLBAR */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="ابحث باسم العميل، جواله، بريده الإلكتروني..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border outline-none ${
                    adminDarkMode 
                      ? "bg-stone-950 border-stone-800 text-stone-100" 
                      : "bg-stone-50 border-stone-200 text-stone-800"
                  }`}
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
              </div>

              <div className="text-xs bg-stone-950 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20 font-bold">
                إدارة عضويات كبار الشخصيات ونقاط الولاء الآمنة للمشترين
              </div>
            </div>

            {/* CUSTOMER PROFILE DATABASE */}
            <div className={`border rounded-2xl overflow-hidden ${adminDarkMode ? "bg-stone-950/20 border-stone-800" : "bg-white border-stone-200 shadow-sm"}`}>
              <div className="p-4 border-b bg-stone-50/50 flex justify-between items-center">
                <strong className="text-xs text-stone-800 flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-amber-600" />
                  <span>دليل وقاعدة بيانات كبار عملاء المنصة</span>
                </strong>
                <span className="text-[10px] font-mono text-stone-400">آخر انضمام: اليوم</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold">
                      <th className="p-3.5">الاسم والبيانات الشخصية</th>
                      <th className="p-3.5">رقم الجوال</th>
                      <th className="p-3.5">مستوى عضوية VIP</th>
                      <th className="p-3.5 font-mono">الطلبات المنجزة</th>
                      <th className="p-3.5 font-mono">نقاط الولاء المكتسبة</th>
                      <th className="p-3.5">إجمالي إنفاق العميل</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {crmCustomers.filter(c => c.name.includes(crmSearch) || c.phone.includes(crmSearch)).map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/40">
                        <td className="p-3.5 font-bold text-stone-800">
                          <div>
                            <span className="block">{c.name}</span>
                            <span className="text-[9.5px] text-stone-400 font-mono block">{c.email} • انضمام: {c.joinDate}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-stone-600">{c.phone}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            c.rank.includes("الماس") 
                              ? "bg-stone-950 text-amber-500 border border-amber-500/30" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {c.rank}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-stone-700">{c.ordersCount} طلبات</td>
                        <td className="p-3.5">
                          <span className="text-amber-700 font-mono font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            <span>{c.points} نقطة يزن</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">{c.totalSpent.toLocaleString()} ر.س</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => triggerToast(`تم إرسال بطاقة تهنئة وبخور هدية VIP للعميل: ${c.name}`)}
                            className="px-2.5 py-1 bg-stone-900 text-white hover:bg-stone-800 rounded-lg text-[9.5px] font-bold flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>إرسال هدية العضوية</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FINANCIAL TRANSACTIONS & SECURE REFUNDS LIST */}
            <div className={`border rounded-2xl overflow-hidden ${adminDarkMode ? "bg-stone-950/20 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-3 p-5`}>
              <div className="border-b pb-3 flex justify-between items-center border-stone-100">
                <strong className="text-xs text-stone-850 flex items-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-amber-600" />
                  <span>عمليات المدفوعات والتحصيل الإلكتروني وإدارة الاسترداد</span>
                </strong>
                <span className="text-[10px] text-stone-400">تدقيق مالي مباشر - بوابة ميسر و أبل باي الآمنة لدار يزن</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 font-bold text-stone-500">
                    <tr>
                      <th className="p-3">رقم المعاملة</th>
                      <th className="p-3">العميل والمستفيد</th>
                      <th className="p-3">قيمة العملية</th>
                      <th className="p-3 font-mono">طريقة الدفع الرقمية</th>
                      <th className="p-3">حالة التحصيل</th>
                      <th className="p-3 text-center">التحكم بالاسترجاع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paymentsList.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/40">
                        <td className="p-3 font-mono font-bold text-stone-900">{p.id}</td>
                        <td className="p-3 font-bold text-stone-700">{p.customer}</td>
                        <td className="p-3 font-mono font-bold text-amber-700">{p.amount} ر.س</td>
                        <td className="p-3 font-mono text-stone-500">{p.method}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            p.status === "completed" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : p.status === "refunded"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {p.status === "completed" ? "ناجحة ومحصلة" : p.status === "refunded" ? "مستردة للبنك" : "بانتظار الدفع"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {p.status === "completed" ? (
                            <button
                              onClick={() => handleProcessRefund(p.id)}
                              className="px-2.5 py-1 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-[9.5px] font-bold mx-auto flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>قبول الاسترجاع الفوري</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-stone-400">- تم الاسترجاع مسبقاً -</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 5: CAMPAIGNS, VIP COUPONS & CMS ARTICLES ==================== */}
        {activeTab === "marketing" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* VIP DISCOUNT COUPONS CREATOR FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} lg:col-span-1 space-y-4`}>
                <h4 className="text-xs font-bold text-stone-900 border-r-4 border-amber-600 pr-2">توليد كوبونات الخصم الفاخرة لدار يزن</h4>
                
                <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-stone-600 font-bold mb-1">رمز قسيمة الخصم الكود *</label>
                    <input
                      type="text" required
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                      placeholder="مثال: GOLDEN10"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 font-mono font-bold uppercase text-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-600 font-bold mb-1">قيمة الخصم *</label>
                      <input
                        type="number" required
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-bold mb-1">النوع *</label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                        className="w-full px-2 py-2 border border-stone-200 bg-white rounded-lg text-stone-800"
                      >
                        <option value="percent">نسبة مئوية (%)</option>
                        <option value="fixed">مبلغ ثابت (ر.س)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-bold mb-1">الحد الأقصى لعدد الاستخدامات *</label>
                    <input
                      type="number" required
                      value={newCoupon.maxUses}
                      onChange={(e) => setNewCoupon({...newCoupon, maxUses: e.target.value})}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 text-amber-500" />
                    <span>تأكيد وتفعيل الكوبون في المتجر</span>
                  </button>
                </form>
              </div>

              {/* ACTIVE COUPONS LOG TABLE */}
              <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} lg:col-span-2 space-y-3`}>
                <h4 className="text-xs font-bold text-stone-900 border-r-4 border-amber-600 pr-2">قائمة الكوبونات النشطة ومعدل الاستخدام الفعلي</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-50 font-bold text-stone-500">
                      <tr>
                        <th className="p-2.5">الكود والرمز</th>
                        <th className="p-2.5">قيمة الخصم</th>
                        <th className="p-2.5">تاريخ الصلاحية</th>
                        <th className="p-2.5 font-mono text-center">مرات الاستخدام المسموحة</th>
                        <th className="p-2.5">الحالة الحالية</th>
                        <th className="p-2.5 text-center">التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {coupons.map((cp, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/40">
                          <td className="p-2.5 font-mono font-bold text-stone-950">{cp.code}</td>
                          <td className="p-2.5 font-mono font-bold text-amber-700">{cp.discount} {cp.type === "percent" ? "%" : "ر.س"}</td>
                          <td className="p-2.5 font-mono text-stone-500">{cp.expiry}</td>
                          <td className="p-2.5 font-mono text-center text-stone-800">{cp.usedCount} / {cp.maxUses} مرّة</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold text-[9.5px] rounded border border-green-200">نشط وصالح</span>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.filter(item => item.code !== cp.code));
                                triggerToast(`تم تعطيل الكود الفاخر ${cp.code} وإيقافه عن المتجر.`);
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-stone-50"
                              title="إلغاء وتجميد هذا الكوبون"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* CMS - BLOG ARTICLES & STATIC PAGES MANAGER */}
            <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
              <div className="flex justify-between items-center border-b pb-3 border-stone-100">
                <strong className="text-xs text-stone-850 flex items-center gap-1.5">
                  <BookOpen className="w-4.5 h-4.5 text-amber-600" />
                  <span>إدارة محتوى المدونة والصفحات الثابتة والقصص الثقافية للأزياء</span>
                </strong>
                <button
                  onClick={() => triggerToast("تم فتح محرر كتابة المقالات الفاخرة")}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-[10px] font-bold"
                >
                  كتابة مقال ثقافي جديد
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blogArticles.map((art) => (
                  <div key={art.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 text-right space-y-2 relative">
                    <span className="text-[9px] bg-amber-600/10 text-amber-800 px-2 py-0.5 rounded font-bold">{art.category}</span>
                    <strong className="text-xs text-stone-900 block font-bold leading-tight">{art.title}</strong>
                    
                    <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-150">
                      <span>تاريخ: {art.date}</span>
                      <span className="font-mono">{art.views.toLocaleString()} قراءة حقيقية</span>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => triggerToast(`محرر مباشر للمقال: ${art.title}`)}
                        className="flex-1 py-1 bg-white hover:bg-stone-100 border rounded text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-stone-500" />
                        <span>تحرير</span>
                      </button>
                      <button
                        onClick={() => triggerToast(`تم مسح المقال ${art.id}`)}
                        className="p-1 text-red-600 hover:text-red-800 bg-white hover:bg-stone-50 rounded border"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 6: ROLES & SESSION CREDENTIALS ==================== */}
        {activeTab === "roles" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
              <div className="border-b pb-3 border-stone-100">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className={adminDarkMode ? "text-stone-100" : "text-stone-900"}>نظام إدارة الصلاحيات التشغيلية (Role-Based Access Simulation)</span>
                </h4>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                تتيح لك منصة يزن محاكاة وتغيير أدوار المستخدمين لتجربة بيئة العمل الفعالة لكل قسم. اختر الدور لتعديل نطاق الصلاحيات الظاهرة:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {Object.entries(rolesInfo).map(([key, val]) => (
                  <div 
                    key={key} 
                    onClick={() => handleRoleChange(key)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 relative text-right ${
                      selectedRole === key 
                        ? "border-amber-600 bg-amber-500/5 shadow-md scale-[1.01]" 
                        : "border-stone-200 bg-stone-50/50 hover:bg-stone-100/60 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-stone-900 font-bold block">{val.label}</strong>
                      <span className={`w-2.5 h-2.5 rounded-full ${selectedRole === key ? "bg-amber-600 animate-ping" : "bg-stone-300"}`}></span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">{val.access}</p>
                    <div className="text-[9px] text-amber-700 font-bold bg-amber-100/40 w-max px-2 py-0.5 rounded border border-amber-200">
                      نشط حالياً للمحاكاة
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY LOGS AUDIT */}
            <div className={`p-5 rounded-2xl border ${adminDarkMode ? "bg-stone-950/30 border-stone-800" : "bg-white border-stone-200 shadow-sm"} space-y-4`}>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b pb-3">سجل الأمن والوصول ومحاولات تسجيل الدخول للموظفين</h4>
              <div className="divide-y text-xs">
                <div className="py-2.5 flex justify-between text-stone-600">
                  <span>تم تسجيل دخول ناجح للمدير العام من عنوان IP 192.168.1.45</span>
                  <span className="font-mono text-stone-400">اليوم 02:30 م</span>
                </div>
                <div className="py-2.5 flex justify-between text-stone-600">
                  <span>تحديث صلاحية وصول الكابتن عبدالله الغامدي للخرائط والـ GPS للطلبات الجاهزة</span>
                  <span className="font-mono text-stone-400">أمس 11:15 ص</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


