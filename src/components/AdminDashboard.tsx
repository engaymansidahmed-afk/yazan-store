/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  TrendingUp, BarChart3, Package, Users, ShoppingBag, 
  Scissors, Plus, Trash2, Check, RefreshCw, Layers, DollarSign, Sparkles 
} from "lucide-react";
import { Product, TailoringOrder } from "../types";

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
  const [adminTab, setAdminTab] = useState<"metrics" | "production" | "products">("metrics");
  
  // New Product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [category, setCategory] = useState<Product["category"]>("women");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryEn, setSubCategoryEn] = useState("");
  const [price, setPrice] = useState("450");
  const [image, setImage] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(true);

  const handleAddProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !price || !subCategory) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      nameEn: nameEn || name,
      description,
      descriptionEn: descriptionEn || description,
      category,
      subCategory,
      subCategoryEn: subCategoryEn || subCategory,
      price: Number(price),
      image: image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600",
      rating: 5.0,
      reviewsCount: 1,
      sizes: category === "women" ? ["S", "M", "L", "XL"] : ["48", "50", "52", "54", "56"],
      colors: [{ name: "أسود داكن", hex: "#0c0a09", nameEn: "Deep Black" }],
      isCustomizable,
      isNew: true
    };

    onAddProduct(newProd);

    // Reset Form
    setName("");
    setNameEn("");
    setDescription("");
    setDescriptionEn("");
    setSubCategory("");
    setSubCategoryEn("");
    setPrice("450");
    setImage("");
    setShowAddForm(false);
  };

  // Calculate sum metrics
  const totalSalesFromTailoring = tailoringOrders.reduce((acc, o) => acc + o.price, 0);
  const totalSalesFromReady = products.slice(0, 3).reduce((acc, p) => acc + (p.price * 10), 0); // Simulated sales
  const totalSales = totalSalesFromTailoring + totalSalesFromReady;
  
  const categoriesCount = {
    women: products.filter(p => p.category === "women").length,
    men: products.filter(p => p.category === "men").length,
    shoes: products.filter(p => p.category === "shoes").length,
    accessories: products.filter(p => p.category === "accessories").length
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-amber-600" />
            <span>لوحة التحكم وإدارة العمليات والإنتاج</span>
          </h3>
          <p className="text-xs text-stone-500">مراقبة مبيعات المنصة، وإدارة الأوردرات الجارية وتحديث مراحل التفصيل بالورشة</p>
        </div>

        {/* Tab Links */}
        <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
          {[
            { id: "metrics", label: "المؤشرات والأداء", icon: BarChart3 },
            { id: "production", label: "خط الإنتاج والتفصيل", icon: Scissors },
            { id: "products", label: "إدارة الكتالوج", icon: Package }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                id={`admin-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === tab.id
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ADMIN TABS CONTENTS */}
      
      {/* TAB 1: METRICS */}
      {adminTab === "metrics" && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Widget Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">إجمالي مبيعات يزن</span>
                <span className="text-lg font-mono font-bold text-stone-900 block mt-1">{totalSales.toLocaleString()} ر.س</span>
                <span className="text-[9px] text-green-600 font-medium flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.4% مبيعات هذا الشهر</span>
                </span>
              </div>
              <div className="p-2.5 bg-green-50 rounded-lg text-green-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">طلبات التفصيل المخصصة</span>
                <span className="text-lg font-mono font-bold text-stone-900 block mt-1">{tailoringOrders.length} طلبات</span>
                <span className="text-[9px] text-amber-600 font-medium mt-1 block">قيد التنفيذ في المشغل</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                <Scissors className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">المخزون والكتالوج</span>
                <span className="text-lg font-mono font-bold text-stone-900 block mt-1">{products.length} تصميم</span>
                <span className="text-[9px] text-stone-400 mt-1 block">جاهز ومخصص للتفصيل</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-lg text-stone-600">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">عملاء يزن المشتركين</span>
                <span className="text-lg font-mono font-bold text-stone-900 block mt-1">1,412 عميل</span>
                <span className="text-[9px] text-amber-600 font-bold mt-1 block flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>80% كبار العملاء (VIP)</span>
                </span>
              </div>
              <div className="p-2.5 bg-stone-900 text-white rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Graphical Representation (Simulated Bars) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider border-b border-stone-100 pb-2">مبيعات الأقسام الرئيسية</h4>
              <div className="space-y-3.5">
                {[
                  { label: "الأزياء النسائية (العبايات والفساتين)", count: categoriesCount.women, percent: 55, color: "bg-amber-600" },
                  { label: "الأزياء الرجالية (الثياب والبدلات)", count: categoriesCount.men, percent: 30, color: "bg-stone-900" },
                  { label: "قسم الأحذية الشرقية والكلاسيكية", count: categoriesCount.shoes, percent: 10, color: "bg-amber-500" },
                  { label: "قسم الحقائب والإكسسوارات والعود", count: categoriesCount.accessories, percent: 5, color: "bg-stone-400" }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-stone-700">{item.label}</span>
                      <strong className="text-stone-900 font-bold">{item.percent}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col justify-between">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider border-b border-stone-100 pb-2">كفاءة تشغيل الورشة والإنتاج</h4>
              
              <div className="p-4 bg-stone-50 rounded-xl text-center border border-stone-100 space-y-1">
                <span className="text-[10px] text-stone-400 font-bold block">متوسط زمن إنجاز التفصيل المخصص</span>
                <span className="text-3xl font-serif font-bold text-amber-700">7.2 أيام عمل</span>
                <span className="text-[10px] text-stone-500 block">أسرع بـ 2.8 أيام من المعدل الإقليمي العام لخدمات الخياطة</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-4">
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="text-stone-400 block text-[10px]">معدل الاسترجاع</span>
                  <strong className="text-stone-800 font-bold text-sm block mt-0.5">0.4%</strong>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="text-stone-400 block text-[10px]">معدل دقة القياسات</span>
                  <strong className="text-green-700 font-bold text-sm block mt-0.5">99.6%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bespoke Production Stepper updating */}
      {adminTab === "production" && (
        <div className="space-y-5 animate-fade-in">
          {tailoringOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 bg-white border border-stone-200 rounded-xl">
              لا توجد طلبات تفصيل نشطة حالياً.
            </div>
          ) : (
            <div className="space-y-4">
              {tailoringOrders.map((order) => {
                const isTailored = order.productType !== undefined || order.tailoring !== undefined;
                const item = order.tailoring ? order.tailoring : order;
                const customerName = item.customerName || "عميل دار يزن";
                
                return (
                  <div 
                    id={`admin-order-${order.id}`}
                    key={order.id}
                    className="bg-white p-5 border border-stone-200 rounded-xl shadow-sm space-y-4"
                  >
                    {/* Order Top Summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-950 text-sm font-bold">العميل: {customerName}</strong>
                          <span className="text-[10px] bg-amber-500/10 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                            {isTailored ? "طلب تفصيل مخصص" : "طلب جاهز"} #{order.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">تاريخ الطلب: {order.orderDate} | قيمة الطلب: {order.price} ر.س</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-stone-500">الحالة الحالية:</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          {order.status === "pending" && "بانتظار المراجعة والاعتماد"}
                          {order.status === "approved" && "معتمد - بانتظار تحويل المشغل"}
                          {order.status === "workshop" && "في الورشة الرئيسية"}
                          {order.status === "sewing" && "قيد الخياطة والتطريز اليدوي"}
                          {order.status === "quality_check" && "فحص الجودة والتهديب النهائي"}
                          {order.status === "ready" && "جاهز للتوصيل والاتصال بالشحن"}
                        </span>
                      </div>
                    </div>

                    {/* Garment Details & Measurements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {isTailored ? (
                        <>
                          <div className="space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200/50">
                            <strong className="text-stone-800 font-bold block mb-1">تفاصيل ومواصفات القطعة:</strong>
                            <p><span className="text-stone-500">نوع اللباس:</span> <strong className="text-stone-800 font-bold">{item.productType}</strong></p>
                            <p><span className="text-stone-500">القماش واللون:</span> <strong className="text-stone-800 font-bold">{item.fabric?.name} (لون: {item.color?.name})</strong></p>
                            <p><span className="text-stone-500">الأكمام والياقة:</span> <strong className="text-stone-800 font-bold">{item.addons?.sleeveStyle} / {item.addons?.collarStyle}</strong></p>
                            {item.addons?.addName && (
                              <p><span className="text-stone-500">الاسم المخصص المطلوب:</span> <strong className="text-amber-700 font-bold">{item.addons?.addName}</strong></p>
                            )}
                          </div>

                          <div className="space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200/50">
                            <strong className="text-stone-800 font-bold block mb-1">مقاسات الخياطة المعتمدة بالسم:</strong>
                            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الطول</span>
                                <span className="font-bold text-stone-800">{item.measurements?.height}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الكتف</span>
                                <span className="font-bold text-stone-800">{item.measurements?.shoulder}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الصدر</span>
                                <span className="font-bold text-stone-800">{item.measurements?.chest}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الخصر</span>
                                <span className="font-bold text-stone-800">{item.measurements?.waist}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الكم</span>
                                <span className="font-bold text-stone-800">{item.measurements?.sleeveLength}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-stone-100">
                                <span className="text-stone-400 block text-[9px]">الحوض/الرقبة</span>
                                <span className="font-bold text-stone-800">
                                  {item.measurements?.gender === "female" ? item.measurements?.hips : item.measurements?.neck}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200/50 col-span-2">
                            <strong className="text-stone-800 font-bold block mb-1">مواصفات القطعة الجاهزة:</strong>
                            <p><span className="text-stone-500">اسم المنتج:</span> <strong className="text-stone-800 font-bold">{item.product?.name || "قطعة يزن الجاهزة"}</strong></p>
                            <p><span className="text-stone-500">المقاس المختار:</span> <strong className="text-stone-800 font-mono font-bold">{order.selectedSize || "L"}</strong></p>
                            <p><span className="text-stone-500">اللون:</span> <strong className="text-stone-800 font-bold">{order.selectedColor?.name || "افتراضي"}</strong></p>
                            <p><span className="text-stone-500">الكمية:</span> <strong className="text-stone-800 font-bold">{order.quantity || 1}</strong></p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Production Status update action buttons */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-stone-700 block mb-2">تحديث خطوة ومراحل الإنتاج لهذه القطعة:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "pending", label: "استقبال الطلب" },
                          { id: "approved", label: "اعتماد التصميم" },
                          { id: "workshop", label: "تحويل للورشة" },
                          { id: "sewing", label: "بدء الخياطة والتطريز" },
                          { id: "quality_check", label: "فحص الجودة" },
                          { id: "ready", label: "جاهز للتسليم" }
                        ].map((step) => (
                          <button
                            id={`btn-set-status-${order.id}-${step.id}`}
                            key={step.id}
                            type="button"
                            onClick={() => onUpdateTailoringStatus(order.id, step.id as any)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              order.status === step.id
                                ? "bg-amber-600 text-stone-950 shadow-sm"
                                : "bg-stone-100 hover:bg-stone-200 text-stone-700"
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
      )}

      {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
      {adminTab === "products" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-stone-900 text-sm">إدارة كتالوج المنتجات والمخزون</h4>
              <p className="text-xs text-stone-500">إضافة موديلات جاهزة أو تصاميم جديدة للتفصيل حسب الطلب على المتجر</p>
            </div>
            
            <button
              id="btn-toggle-product-form"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <form onSubmit={handleAddProductSubmit} className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-4 animate-fade-in">
              <strong className="text-stone-800 text-xs block font-bold">تعبئة مواصفات المنتج الجديد:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">اسم المنتج بالعربية</label>
                  <input
                    id="new-prod-name-ar"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: عباية الحرير الملكي المطرزة"
                    className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">اسم المنتج بالإنجليزية</label>
                  <input
                    id="new-prod-name-en"
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Royal Embroidered Silk Abaya"
                    className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">القسم</label>
                  <select
                    id="new-prod-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800"
                  >
                    <option value="women">نسائي (women)</option>
                    <option value="men">رجالي (men)</option>
                    <option value="shoes">أحذية (shoes)</option>
                    <option value="accessories">إكسسوارات (accessories)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">الفئة الفرعية بالعربية</label>
                  <input
                    id="new-prod-sub-ar"
                    type="text"
                    required
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="مثال: عبايات، ثياب، صنادل"
                    className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">السعر الأساسي (ريال)</label>
                  <input
                    id="new-prod-price"
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800 font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="text-xs space-y-1">
                <label className="block text-stone-600 font-medium mb-1">شرح ووصف تفصيلي للموديل</label>
                <textarea
                  id="new-prod-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="وصف المنتج، نوع خاماته وقصته وتفاصيله الفنية..."
                  className="w-full p-2 border border-stone-200 bg-white rounded-lg text-stone-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">رابط صورة المنتج (مباشر)</label>
                  <input
                    id="new-prod-image-url"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-stone-800"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    id="new-prod-customizable-checkbox"
                    type="checkbox"
                    checked={isCustomizable}
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="new-prod-customizable-checkbox" className="font-bold text-stone-700">تفعيل خيار "التفصيل حسب الطلب" لهذا المنتج</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  id="btn-cancel-add-prod"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 border border-stone-300 rounded-lg font-bold text-stone-700"
                >
                  إلغاء
                </button>
                <button
                  id="btn-submit-add-prod"
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-850 text-white rounded-lg font-bold"
                >
                  إضافة للمتجر فوراً
                </button>
              </div>
            </form>
          )}

          {/* Simple Products List View */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div 
                id={`admin-catalog-item-${p.id}`}
                key={p.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden p-3 space-y-2 text-right relative hover:shadow-sm transition-shadow"
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-28 object-cover rounded-lg bg-stone-100"
                  referrerPolicy="no-referrer"
                />
                <h5 className="font-bold text-xs text-stone-900 truncate">{p.name}</h5>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-500">{p.category === "women" ? "نسائي" : "رجالي"} ({p.subCategory})</span>
                  <span className="font-mono font-bold text-amber-700">{p.price} ر.س</span>
                </div>
                {p.isCustomizable && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-700 font-bold px-1.5 py-0.5 rounded block w-max">قابل للتفصيل</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
