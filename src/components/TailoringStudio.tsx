/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Sparkles, Ruler, ShieldCheck, ChevronRight, ChevronLeft, 
  Layers, Paintbrush, Scissors, Plus, Check, Info, Upload, Image as ImageIcon
} from "lucide-react";
import { Fabric, SavedMeasurements, TailoringOrder } from "../types";
import { PREMIUM_FABRICS } from "../mockData";
import SmartSizeModal from "./SmartSizeModal";

interface TailoringStudioProps {
  onAddCustomToCart: (customOrder: TailoringOrder, payDeposit: boolean) => void;
  initialTemplate?: any; // To allow customizing a ready-made product
}

export default function TailoringStudio({ onAddCustomToCart, initialTemplate }: TailoringStudioProps) {
  // Wizard steps: 1 = Category, 2 = Design Source, 3 = Fabric, 4 = Details/Addons, 5 = Measurements, 6 = Review
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"female" | "male">(initialTemplate?.category === "men" ? "male" : "female");
  const [productType, setProductType] = useState<string>(initialTemplate?.subCategory || "عباية");
  const [designSource, setDesignSource] = useState<"gallery" | "upload" | "new_design">("gallery");
  const [designDescription, setDesignDescription] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Fabric and color state
  const [selectedFabric, setSelectedFabric] = useState<Fabric>(PREMIUM_FABRICS[0]);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(PREMIUM_FABRICS[0].colors[0]);

  // Optional Add-ons state
  const [embroidery, setEmbroidery] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [addName, setAddName] = useState("");
  const [addLogo, setAddLogo] = useState(false);
  const [sleeveStyle, setSleeveStyle] = useState("كلاسيكي قياسي");
  const [collarStyle, setCollarStyle] = useState("رسمي فاخر");
  const [lengthAdjustment, setLengthAdjustment] = useState("لا يوجد تعديل");

  // Measurements
  const [measurements, setMeasurements] = useState<SavedMeasurements>({
    id: "m-temp",
    profileName: "مقاسات تفصيل حالية",
    gender: gender,
    height: 170,
    shoulder: 42,
    chest: 98,
    waist: 80,
    hips: 104,
    sleeveLength: 60,
    neckline: 16,
    neck: 40,
    armLength: 62
  });

  const [smartSizeOpen, setSmartSizeOpen] = useState(false);
  const [smartSizeApplied, setSmartSizeApplied] = useState(false);

  const productTypes = gender === "female" 
    ? [
        { id: "عباية", name: "عباية فاخرة", basePrice: 400, desc: "عباءة شرقية انسيابية فخمة" },
        { id: "فستان", name: "فستان سهرة", basePrice: 650, desc: "فستان كوتور للمناسبات السعيدة" },
        { id: "جلابية", name: "جلابية عصرية", basePrice: 350, desc: "جلابيات مطرزة خفيفة وراقية" },
        { id: "تصميم خاص", name: "تصميم نسائي خاص", basePrice: 800, desc: "تفصيل رسمة أو تصميم خاص بكِ" }
      ]
    : [
        { id: "ثوب", name: "ثوب سعودي فاخر", basePrice: 280, desc: "ثوب بياقة واقفة وأزرار رسمية" },
        { id: "بدلة", name: "بدلة قطعتين", basePrice: 900, desc: "بدلة رسمية كلاسيكية بقصة عصرية" },
        { id: "قميص", name: "قميص مخصص", basePrice: 180, desc: "قميص رسمي مفصل بدقة تامة" },
        { id: "تصميم خاص", name: "تصميم رجالي خاص", basePrice: 650, desc: "تفصيل بدلة أو قطعة خاصة بك" }
      ];

  const getBasePrice = () => {
    const typeObj = productTypes.find(t => t.id === productType);
    return typeObj ? typeObj.basePrice : 300;
  };

  const calculateTotal = () => {
    let total = getBasePrice();
    total += selectedFabric.priceExtra;
    if (embroidery) total += 120;
    if (printing) total += 60;
    if (addName.trim()) total += 30;
    return total;
  };

  const handleNextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleApplySmartSize = (aiMeasurements: Partial<SavedMeasurements>) => {
    setMeasurements((prev) => ({
      ...prev,
      ...aiMeasurements
    }) as SavedMeasurements);
    setSmartSizeApplied(true);
  };

  const handleAddToBag = (payDeposit: boolean) => {
    const tailoredOrder: TailoringOrder = {
      id: `tailor-${Date.now()}`,
      customerName: "أيمن سيد أحمد",
      productType: productTypes.find(t => t.id === productType)?.name || productType,
      designSource,
      designImageUrl: designSource === "upload" ? uploadedImage || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=300" : undefined,
      designDescription: designSource === "new_design" ? designDescription : undefined,
      fabric: selectedFabric,
      color: selectedColor,
      addons: {
        embroidery,
        printing,
        addName,
        addLogo,
        sleeveStyle,
        collarStyle,
        lengthAdjustment
      },
      measurements,
      status: "pending",
      progressPercentage: 5,
      price: calculateTotal(),
      orderDate: new Date().toLocaleDateString("ar-SA"),
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("ar-SA") // 10 days delivery
    };

    onAddCustomToCart(tailoredOrder, payDeposit);
  };

  // Mock upload simulator
  const handleMockUpload = () => {
    const mockSketches = [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=400"
    ];
    setUploadedImage(mockSketches[Math.floor(Math.random() * mockSketches.length)]);
  };

  return (
    <div className="w-full bg-white border border-[#1A1A1A]/10 overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">
      
      {/* Sidebar Progress (visible on tablet/desktop) */}
      <div className="md:w-64 bg-[#1A1A1A] text-white p-6 flex flex-col justify-between shrink-0 font-sans">
        <div>
          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] block mb-1">استوديو التفصيل الفاخر</span>
          <h3 className="font-serif text-xl font-black mb-6 text-white">صمّم إطلالتك الخاصة</h3>
          
          {/* Progress Steps */}
          <div className="space-y-4">
            {[
              { num: 1, label: "نوع اللباس" },
              { num: 2, label: "اختيار التصميم" },
              { num: 3, label: "نوع القماش" },
              { num: 4, label: "التفاصيل والإضافات" },
              { num: 5, label: "مقاسات الخياطة" },
              { num: 6, label: "المراجعة والتأكيد" }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-none flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  step === s.num 
                    ? "bg-[#C5A059] text-white" 
                    : step > s.num 
                      ? "bg-white/20 text-white" 
                      : "bg-white/5 text-white/40"
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : s.num}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  step === s.num ? "text-[#C5A059] font-bold" : "text-white/60"
                }`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tailor's Promise Card */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-none text-[10px] text-white/80 space-y-2 mt-6 md:mt-0">
          <div className="flex items-center gap-1.5 font-bold text-[#C5A059] text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>ضمان الجودة والقياس</span>
          </div>
          <p className="leading-relaxed">
            جميع ملابس يزن المفصلة تخضع لثلاث مراحل من فحص الدقة. إذا لم يكن المقاس متطابقاً 100% سنعيد تعديلها مجاناً.
          </p>
        </div>
      </div>

      {/* Main Work Space */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        
        {/* Step Contents */}
        <div className="flex-1">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 1: اختر الفئة وموديل اللباس الرئيسي</h4>
                <p className="text-xs text-stone-500">اختر نوع التصميم الذي ترغب بتفصيله وفق رغبتك</p>
              </div>

              {/* Gender selector */}
              <div className="flex gap-2 p-1 bg-stone-100 rounded-lg max-w-xs">
                <button
                  id="gender-btn-female"
                  onClick={() => { setGender("female"); setProductType("عباية"); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    gender === "female" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  أزياء نسائية
                </button>
                <button
                  id="gender-btn-male"
                  onClick={() => { setGender("male"); setProductType("ثوب"); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    gender === "male" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  أزياء رجالية
                </button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {productTypes.map((type) => (
                  <button
                    id={`type-card-${type.id}`}
                    key={type.id}
                    onClick={() => setProductType(type.id)}
                    className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      productType === type.id
                        ? "border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 text-amber-950"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">{type.name}</span>
                      <span className="text-xs text-stone-500 block mt-1">{type.desc}</span>
                    </div>
                    <div className="mt-3.5 flex justify-between items-center w-full">
                      <span className="text-[10px] text-stone-400">سعر التفصيل الأساسي:</span>
                      <span className="font-mono text-xs font-bold text-amber-700">{type.basePrice} ر.س</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Design Source */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 2: حدد شكل التصميم المطلوب</h4>
                <p className="text-xs text-stone-500">كيف ترغب في إعلام الخياط بتصميمك المختار؟</p>
              </div>

              {/* Source Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gallery", name: "تصميم من المعرض", desc: "اختر شكلاً جاهزاً" },
                  { id: "upload", name: "رفع صورة تصميم", desc: "صورة من جهازك" },
                  { id: "new_design", name: "اكتب مواصفاتك", desc: "اشرح فكرتك الخاصة" }
                ].map((s) => (
                  <button
                    id={`design-source-${s.id}`}
                    key={s.id}
                    onClick={() => setDesignSource(s.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      designSource === s.id
                        ? "border-amber-600 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="text-xs block">{s.name}</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Design Content Inputs */}
              {designSource === "gallery" && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/50 text-center">
                  <span className="text-xs text-stone-500 block mb-2">أشكال السيلويت والقصات الأساسية المعتمدة لـ {productType}:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="p-2.5 bg-white rounded-lg border border-stone-200 hover:border-amber-500 cursor-pointer text-center">
                        <ImageIcon className="w-5 h-5 mx-auto mb-1.5 text-stone-400" />
                        <span className="text-[10px] font-bold text-stone-700 block">سيلويت قياسي #{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {designSource === "upload" && (
                <div className="space-y-3">
                  <div 
                    onClick={handleMockUpload}
                    className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-stone-700 block mb-0.5">اسحب وأفلت صورة التصميم أو انقر للاختيار</span>
                    <span className="text-[10px] text-stone-400">يدعم صيغ JPG, PNG أو رسومات سكتش للبدلات والثياب</span>
                  </div>
                  
                  {uploadedImage && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                      <img src={uploadedImage} alt="sketch" className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-stone-800 block">تم رفع سكتش التصميم بنجاح</span>
                        <span className="text-[9px] text-stone-500">تم التعرف على الشكل والتصميم والياقة</span>
                      </div>
                      <button onClick={() => setUploadedImage(null)} className="text-xs text-red-500 hover:underline">حذف</button>
                    </div>
                  )}
                </div>
              )}

              {designSource === "new_design" && (
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">اكتب شرحك المفصل لموديل اللباس (سيتلقاها الخياط مباشرة):</label>
                  <textarea
                    id="design-text-desc"
                    value={designDescription}
                    onChange={(e) => setDesignDescription(e.target.value)}
                    rows={4}
                    placeholder="مثال: ياقة مرتفعة صينية، أكمام ضيقة من المعصم مع أزرار مخفية وطول إضافي 3 سم مع تطريز خيط حرير أسود على الكتف الأيمن..."
                    className="w-full p-3 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Fabric Selection */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 3: اختر نوع قماش التفصيل الفاخر</h4>
                <p className="text-xs text-stone-500">نستورد خاماتنا مباشرة من نخبة مصانع الأقمشة العالمية</p>
              </div>

              {/* Fabrics List */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                {PREMIUM_FABRICS.map((fab) => (
                  <button
                    id={`fabric-card-${fab.id}`}
                    key={fab.id}
                    onClick={() => {
                      setSelectedFabric(fab);
                      setSelectedColor(fab.colors[0]);
                    }}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex gap-3 ${
                      selectedFabric.id === fab.id
                        ? "border-amber-600 bg-amber-50/50 ring-1 ring-amber-600"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100"
                    }`}
                  >
                    <img src={fab.image} alt={fab.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900">{fab.name}</span>
                          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full font-medium">بلد المنشأ: {fab.origin}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-1 line-clamp-1">{fab.quality}</span>
                      </div>
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-[10px] text-stone-400 ml-1.5">قيمة إضافية:</span>
                        <span className="font-mono text-xs font-bold text-amber-700">+{fab.priceExtra} ر.س</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Fabric Color & Optional Addons */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 4: حدد لون القماش والإضافات الفنية</h4>
                <p className="text-xs text-stone-500">اختر لوناً متوفراً وأي مزايا إضافية للتطريز أو شكل الياقة</p>
              </div>

              {/* Color Palette based on selected fabric */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700">الألوان المتاحة لقماش ({selectedFabric.name}):</span>
                <div className="flex flex-wrap gap-2.5">
                  {selectedFabric.colors.map((col) => (
                    <button
                      id={`color-btn-${col.name}`}
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        selectedColor.name === col.name
                          ? "border-amber-600 bg-amber-50 text-amber-950"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-700">تعديلات وإضافات الخياط (اختياري):</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="toggle-embroidery"
                    type="button"
                    onClick={() => setEmbroidery(!embroidery)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex justify-between items-center ${
                      embroidery ? "border-amber-600 bg-amber-50/55" : "border-stone-200"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-stone-800">تطريز يدوي فاخر</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5">خيوط ذهبية أو فضية نقية</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-700">+120 ر.س</span>
                  </button>

                  <button
                    id="toggle-printing"
                    type="button"
                    onClick={() => setPrinting(!printing)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex justify-between items-center ${
                      printing ? "border-amber-600 bg-amber-50/55" : "border-stone-200"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-stone-800">طباعة مخصصة للبطانة</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5">نقوش عربية على الطلب</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-700">+60 ر.س</span>
                  </button>
                </div>

                {/* Name engraving input */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">اسم مخصص للحفر والتهديب (اختياري - +30 ر.س):</label>
                  <input
                    id="input-add-name"
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="مثال: أ. س. أ (الحروف الأولى لاسمك)"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                {/* Sleeve / Collar selects */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">موديل الأكمام</label>
                    <select
                      id="select-sleeves"
                      value={sleeveStyle}
                      onChange={(e) => setSleeveStyle(e.target.value)}
                      className="w-full px-2 py-1.5 border border-stone-200 bg-stone-50 rounded-lg text-xs font-medium text-stone-800"
                    >
                      <option>كلاسيكي قياسي</option>
                      <option>فرنسي بأزرار كبك</option>
                      <option>واسع ومتهدل</option>
                      <option>مبطن بحشوة صلبة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">موديل الياقة</label>
                    <select
                      id="select-collar"
                      value={collarStyle}
                      onChange={(e) => setCollarStyle(e.target.value)}
                      className="w-full px-2 py-1.5 border border-stone-200 bg-stone-50 rounded-lg text-xs font-medium text-stone-800"
                    >
                      <option>رسمي فاخر</option>
                      <option>صيني كروي مغلق</option>
                      <option>مفتوح مريح سبعة</option>
                      <option>قلاب كلاسيكي</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Measurements Inputs & AI */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 5: إدخال مقاسات الخياطة الفنية</h4>
                  <p className="text-xs text-stone-500">أدخل قياساتك بالسم، أو استعن بمساعدنا الذكي للمقاسات</p>
                </div>
                
                {/* AI Size Assistant trigger */}
                <button
                  id="open-smart-size-advisor"
                  type="button"
                  onClick={() => setSmartSizeOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-600/10"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>مساعد المقاسات الذكي (AI)</span>
                </button>
              </div>

              {smartSizeApplied && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-green-600" />
                  <span>تم تقدير وتعبئة مقاساتك التفصيلية بالذكاء الاصطناعي بنجاح! يمكنك تعديلها يدوياً أدناه إن لزم الأمر.</span>
                </div>
              )}

              {/* Grid of Measurements */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-stone-50 p-4 rounded-xl border border-stone-200/50">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">الطول الكلي (سم)</label>
                  <input
                    id="measure-height"
                    type="number"
                    value={measurements.height}
                    onChange={(e) => setMeasurements({ ...measurements, height: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">عرض الكتف (سم)</label>
                  <input
                    id="measure-shoulder"
                    type="number"
                    value={measurements.shoulder}
                    onChange={(e) => setMeasurements({ ...measurements, shoulder: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">محيط الصدر (سم)</label>
                  <input
                    id="measure-chest"
                    type="number"
                    value={measurements.chest}
                    onChange={(e) => setMeasurements({ ...measurements, chest: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">محيط الخصر (سم)</label>
                  <input
                    id="measure-waist"
                    type="number"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">طول الكم (سم)</label>
                  <input
                    id="measure-sleeve"
                    type="number"
                    value={measurements.sleeveLength}
                    onChange={(e) => setMeasurements({ ...measurements, sleeveLength: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                  />
                </div>

                {gender === "female" ? (
                  <>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">محيط الأرداف (سم)</label>
                      <input
                        id="measure-hips"
                        type="number"
                        value={measurements.hips || 100}
                        onChange={(e) => setMeasurements({ ...measurements, hips: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">فتحة الرقبة (سم)</label>
                      <input
                        id="measure-neckline"
                        type="number"
                        value={measurements.neckline || 16}
                        onChange={(e) => setMeasurements({ ...measurements, neckline: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">محيط الرقبة (سم)</label>
                      <input
                        id="measure-neck"
                        type="number"
                        value={measurements.neck || 40}
                        onChange={(e) => setMeasurements({ ...measurements, neck: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">طول الذراع (سم)</label>
                      <input
                        id="measure-armlength"
                        type="number"
                        value={measurements.armLength || 62}
                        onChange={(e) => setMeasurements({ ...measurements, armLength: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-center font-mono font-bold text-stone-800 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review & Checkout Details */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">الخطوة 6: مراجعة تفاصيل تصميم ومواصفات تفصيلك</h4>
                <p className="text-xs text-stone-500">راجع كل شيء قبل المتابعة لإضافته إلى حقيبة التسوق</p>
              </div>

              {/* Review summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/50 space-y-1.5">
                  <span className="font-bold text-stone-800 block text-xs border-b border-stone-200 pb-1">مواصفات القطعة والتصميم</span>
                  <div className="flex justify-between">
                    <span className="text-stone-500">النوع:</span>
                    <span className="font-bold text-stone-900">{productTypes.find(t => t.id === productType)?.name || productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">التصميم ومصدره:</span>
                    <span className="font-bold text-stone-900">{designSource === "gallery" ? "من المعرض المعتمد" : designSource === "upload" ? "سكتش مرفوع" : "وصف مفصل خاص"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">نوع القماش المختار:</span>
                    <span className="font-bold text-stone-900">{selectedFabric.name} ({selectedFabric.origin})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">اللون الفني:</span>
                    <span className="font-bold text-stone-950 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block" style={{ backgroundColor: selectedColor.hex }} />
                      {selectedColor.name}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/50 space-y-1.5">
                  <span className="font-bold text-stone-800 block text-xs border-b border-stone-200 pb-1">خيارات الخياط والقياسات</span>
                  <div className="flex justify-between">
                    <span className="text-stone-500">تطريز يدوي:</span>
                    <span className="font-bold text-stone-900">{embroidery ? "نعم (+120 ر.س)" : "لا"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">اسم مخصص محفور:</span>
                    <span className="font-bold text-stone-900">{addName ? `نعم (${addName}) (+30 ر.س)` : "لا"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">الأكمام والياقة:</span>
                    <span className="font-bold text-stone-900">{sleeveStyle} / {collarStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">المقاسات:</span>
                    <span className="font-bold text-amber-700">ارتفاع {measurements.height} سم | كتف {measurements.shoulder} سم | صدر {measurements.chest} سم</span>
                  </div>
                </div>
              </div>

              {/* Timeline Delivery */}
              <div className="p-3 bg-amber-50/50 border border-amber-200/40 rounded-xl text-xs text-amber-900 flex gap-2.5">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block text-[11px] mb-0.5">جدول إنتاج وتوصيل طلبك المخصص:</span>
                  <p className="text-stone-700 leading-relaxed">
                    يستغرق تفصيل هذه القطعة المميزة بدقة 10 أيام عمل. تاريخ التوصيل المتوقع إلى باب منزلك هو: <strong className="text-amber-800 font-serif">{new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("ar-SA")}</strong>.
                  </p>
                </div>
              </div>

              {/* Price summary & Arabic Deposit (عربون) Action */}
              <div className="p-4 bg-stone-900 text-white rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">سعر التفصيل الإجمالي النهائي</span>
                  <div className="text-2xl font-mono font-bold text-amber-500 mt-0.5">{calculateTotal()} ر.س</div>
                  <span className="text-[9px] text-stone-400 block mt-0.5">شامل الأقمشة والقص والتطريز والضريبة</span>
                </div>
                
                {/* Deposit action buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    id="btn-add-deposit"
                    onClick={() => handleAddToBag(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-100 rounded-lg text-xs font-bold transition-all text-center"
                    title="ابدأ التفصيل الآن بدفع عربون وتكملة الباقي لاحقاً"
                  >
                    دفع عربون (100 ر.س)
                  </button>
                  <button
                    id="btn-add-full"
                    onClick={() => handleAddToBag(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold transition-all text-center shadow-lg shadow-amber-600/15"
                  >
                    دفع القيمة كاملة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-stone-100 mt-6">
          <button
            id="wizard-prev-btn"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-stone-200 hover:border-stone-300 disabled:opacity-40 rounded-xl text-xs font-bold text-stone-700 transition-colors disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-xs font-mono font-bold text-stone-400">
            الخطوة {step} من 6
          </span>

          {step < 6 ? (
            <button
              id="wizard-next-btn"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-[10px] text-stone-400 font-medium">خطوة المراجعة والإنتاج</div>
          )}
        </div>
      </div>

      {/* Smart Size Advisor Modal */}
      {smartSizeOpen && (
        <SmartSizeModal
          gender={gender}
          onApply={handleApplySmartSize}
          onClose={() => setSmartSizeOpen(false)}
        />
      )}
    </div>
  );
}
