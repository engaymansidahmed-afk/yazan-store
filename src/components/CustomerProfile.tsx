/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  User, MapPin, Ruler, ShoppingBag, Plus, Trash2, Edit2, 
  Check, Award, AwardIcon, TrendingUp, Sparkles, MapPinCheck 
} from "lucide-react";
import { SavedMeasurements, Address, UserProfile, TailoringOrder } from "../types";

interface CustomerProfileProps {
  userProfile: UserProfile;
  savedMeasurements: SavedMeasurements[];
  savedAddresses: Address[];
  orders: any[];
  onUpdateAddresses: (addresses: Address[]) => void;
  onUpdateMeasurements: (measurements: SavedMeasurements[]) => void;
  onSelectSavedMeasurement?: (m: SavedMeasurements) => void;
}

export default function CustomerProfile({
  userProfile,
  savedMeasurements,
  savedAddresses,
  orders,
  onUpdateAddresses,
  onUpdateMeasurements,
  onSelectSavedMeasurement
}: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "measurements" | "addresses">("orders");
  
  // States for adding new address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState("");
  const [newAddrFullName, setNewAddrFullName] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("الرياض");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");

  // States for adding new sizing profile
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileGender, setNewProfileGender] = useState<"female" | "male">("female");
  const [newProfileHeight, setNewProfileHeight] = useState(170);
  const [newProfileShoulder, setNewProfileShoulder] = useState(42);
  const [newProfileChest, setNewProfileChest] = useState(98);
  const [newProfileWaist, setNewProfileWaist] = useState(80);
  const [newProfileHips, setNewProfileHips] = useState(104);
  const [newProfileSleeve, setNewProfileSleeve] = useState(60);

  // Address Handlers
  const handleAddAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle || !newAddrFullName || !newAddrStreet || !newAddrPhone) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      fullName: newAddrFullName,
      city: newAddrCity,
      street: newAddrStreet,
      phone: newAddrPhone,
      isDefault: savedAddresses.length === 0
    };

    onUpdateAddresses([...savedAddresses, newAddr]);
    
    // Clear Form
    setNewAddrTitle("");
    setNewAddrFullName("");
    setNewAddrStreet("");
    setNewAddrPhone("");
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateAddresses(savedAddresses.filter(a => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    onUpdateAddresses(savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  // Measurement Handlers
  const handleAddMeasurement = (e: FormEvent) => {
    e.preventDefault();
    if (!newProfileName) return;

    const newM: SavedMeasurements = {
      id: `m-${Date.now()}`,
      profileName: newProfileName,
      gender: newProfileGender,
      height: Number(newProfileHeight),
      shoulder: Number(newProfileShoulder),
      chest: Number(newProfileChest),
      waist: Number(newProfileWaist),
      hips: newProfileGender === "female" ? Number(newProfileHips) : undefined,
      sleeveLength: Number(newProfileSleeve),
    };

    onUpdateMeasurements([...savedMeasurements, newM]);

    setNewProfileName("");
    setShowMeasureForm(false);
  };

  const handleDeleteMeasurement = (id: string) => {
    onUpdateMeasurements(savedMeasurements.filter(m => m.id !== id));
  };

  // Stepper helper for tailoring status
  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "approved": return 2;
      case "workshop": return 3;
      case "sewing": return 4;
      case "quality_check": return 5;
      case "ready": return 6;
      default: return 1;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending": return 15;
      case "approved": return 40;
      case "workshop": return 60;
      case "sewing": return 75;
      case "quality_check": return 90;
      case "ready": return 100;
      default: return 15;
    }
  };

  const getFourStageActiveStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "approved": return 1;
      case "workshop": 
      case "sewing": 
        return 2;
      case "quality_check": 
        return 3;
      case "ready": 
        return 4;
      default: return 1;
    }
  };

  const getStatusLabelAr = (status: string) => {
    switch (status) {
      case "pending": return "بانتظار المراجعة";
      case "approved": return "تم اعتماد التصميم";
      case "workshop": return "في ورشة يزن";
      case "sewing": return "تحت الخياطة والتطريز";
      case "quality_check": return "فحص الجودة النهائي";
      case "ready": return "جاهز للشحن والتسليم";
      default: return "قيد المعالجة";
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Visual Identity Profile Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-6 border border-stone-800 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-right">
          <img 
            src={userProfile.avatar} 
            alt={userProfile.fullName} 
            className="w-16 h-16 rounded-full border-2 border-amber-500 object-cover bg-stone-700"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-serif text-lg font-bold text-white">{userProfile.fullName}</h3>
            <p className="text-xs text-stone-400">{userProfile.email} | {userProfile.phone}</p>
            
            {/* Loyalty level badges */}
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>عضوية {userProfile.membershipLevel === "Gold" ? "ذهبية" : userProfile.membershipLevel}</span>
              </span>
              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                {userProfile.loyaltyPoints} نقطة ولاء
              </span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="w-full sm:w-64 space-y-1.5 text-right sm:text-left">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>العضوية التالية: بلاتينية</span>
            <span className="font-mono">75% مكتمل</span>
          </div>
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <span className="text-[9px] text-stone-500 block">اجمع 250 نقطة أخرى للاستفادة من شحن سريع وتعديل مجاني مدى الحياة.</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-stone-200">
        {[
          { id: "orders", label: "الطلبات والمشتريات", icon: ShoppingBag },
          { id: "measurements", label: "ملفات مقاساتي المحفوظة", icon: Ruler },
          { id: "addresses", label: "عناوين الشحن والتسليم", icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "border-amber-600 text-amber-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[250px]">
        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-5 animate-fade-in">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-stone-50 rounded-xl border border-stone-100">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-stone-700">لم تقم بإجراء أي طلبات حتى الآن.</p>
                <p className="text-xs text-stone-500 mt-1">تصفح الكتالوج أو تفضل بزيارة استوديو التفصيل لتصميم أول ملابس فاخرة مخصصة لك!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => {
                  const isTailored = o.tailoring !== undefined;
                  const item = isTailored ? o.tailoring as TailoringOrder : o;
                  
                  return (
                    <div 
                      id={`order-card-${o.id}`}
                      key={o.id}
                      className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-3.5 gap-2 text-xs">
                        <div>
                          <span className="text-stone-500">رقم الطلب:</span>
                          <span className="font-mono font-bold text-stone-900 mr-1.5">{o.id}</span>
                          <span className="mr-3 text-stone-300">|</span>
                          <span className="text-stone-500 mr-2">التاريخ:</span>
                          <span className="font-bold text-stone-800">{o.orderDate || "مؤخراً"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500">طريقة الدفع:</span>
                          <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                            {o.paymentMethod || "بطاقة ائتمان"}
                          </span>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex gap-4">
                        <img 
                          src={isTailored ? item.fabric?.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200" : o.product?.image} 
                          alt="item photo" 
                          className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-sm text-stone-900 truncate">
                                {isTailored ? `تفصيل: ${item.productType}` : o.product?.name}
                              </h5>
                              <span className="font-mono text-sm font-bold text-amber-700">{o.price} ر.س</span>
                            </div>
                            
                            {/* Meta properties */}
                            <p className="text-xs text-stone-500 mt-1">
                              {isTailored ? (
                                <>قماش: {item.fabric?.name} | اللون: {item.color?.name} | الطول المقدر: {item.measurements?.height} سم</>
                              ) : (
                                <>المقاس: {o.selectedSize} | اللون: {o.selectedColor?.name} | الكمية: {o.quantity}</>
                              )}
                            </p>
                          </div>

                          {isTailored && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase">نوع الخدمة:</span>
                              <span className="text-[9px] bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>تفصيل مخصص حسب الطلب (Bespoke)</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Improved 4-Stage Visual Progress Tracker */}
                      <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-700 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>تتبع مرحلة الطلب الحالية:</span>
                          </span>
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/50">
                            {getStatusLabelAr(item.status)} ({getProgressPercentage(item.status)}%)
                          </span>
                        </div>

                        {/* Beautiful Visual Progress Bar */}
                        <div className="relative pt-4 pb-2">
                          {/* Progress Track Background */}
                          <div className="absolute top-[34px] left-[10%] right-[10%] h-1 bg-stone-200 rounded-full -z-0"></div>
                          {/* Dynamic Progress Fill */}
                          <div 
                            className="absolute top-[34px] right-[10%] h-1 bg-amber-600 rounded-full transition-all duration-500 -z-0 animate-pulse"
                            style={{ 
                              width: `${(getFourStageActiveStep(item.status) - 1) * 33.33 * 0.8}%`
                            }}
                          ></div>

                          <div className="grid grid-cols-4 gap-2 relative z-10">
                            {[
                              { step: 1, label: "اختيار القماش", labelEn: "Fabric Selection" },
                              { step: 2, label: "خياطة وتفصيل", labelEn: "Tailoring" },
                              { step: 3, label: "فحص الجودة", labelEn: "Quality Check" },
                              { step: 4, label: "الشحن والتوصيل", labelEn: "Shipping" }
                            ].map((s) => {
                              const activeStep = getFourStageActiveStep(item.status);
                              const isCompleted = activeStep > s.step || item.status === "ready";
                              const isCurrent = activeStep === s.step && item.status !== "ready";

                              return (
                                <div key={s.step} className="text-center flex flex-col items-center">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted 
                                      ? "bg-green-600 text-white shadow-md shadow-green-100" 
                                      : isCurrent 
                                        ? "bg-amber-600 text-white ring-4 ring-amber-600/20 shadow-md shadow-amber-100" 
                                        : "bg-stone-100 text-stone-400 border-2 border-stone-200"
                                  }`}>
                                    {isCompleted ? (
                                      <Check className="w-5 h-5" />
                                    ) : (
                                      <span className="font-bold text-xs font-mono">{s.step}</span>
                                    )}
                                  </div>
                                  <div className="mt-2.5 space-y-0.5">
                                    <span className={`text-[11px] font-bold block transition-colors ${
                                      isCurrent ? "text-amber-800" : isCompleted ? "text-green-700" : "text-stone-500"
                                    }`}>
                                      {s.label}
                                    </span>
                                    <span className="text-[9px] text-stone-400 block font-mono">
                                      {s.labelEn}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEASUREMENTS */}
        {activeTab === "measurements" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">إدارة ملفات قياسات الخياطة الخاصة بك</h4>
                <p className="text-xs text-stone-500">احفظ مقاساتك أو مقاسات عائلتك لتسهيل تفصيل المنتجات في ثوانٍ معدودة</p>
              </div>
              <button
                id="btn-add-new-profile"
                onClick={() => setShowMeasureForm(!showMeasureForm)}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة ملف جديد</span>
              </button>
            </div>

            {/* Measurement form */}
            {showMeasureForm && (
              <form onSubmit={handleAddMeasurement} className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">اسم الملف (مثل: مقاسي الشخصي، أخي محمد)</label>
                    <input
                      id="new-profile-name"
                      type="text"
                      required
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                      placeholder="مقاساتي المفصلة"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">الجنس</label>
                    <select
                      id="new-profile-gender"
                      value={newProfileGender}
                      onChange={(e) => setNewProfileGender(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800"
                    >
                      <option value="female">نسائي</option>
                      <option value="male">رجالي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">الطول (سم)</label>
                    <input
                      id="new-profile-height"
                      type="number"
                      value={newProfileHeight}
                      onChange={(e) => setNewProfileHeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-mono text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">عرض الكتف (سم)</label>
                    <input
                      id="new-profile-shoulder"
                      type="number"
                      value={newProfileShoulder}
                      onChange={(e) => setNewProfileShoulder(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">محيط الصدر (سم)</label>
                    <input
                      id="new-profile-chest"
                      type="number"
                      value={newProfileChest}
                      onChange={(e) => setNewProfileChest(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">محيط الخصر (سم)</label>
                    <input
                      id="new-profile-waist"
                      type="number"
                      value={newProfileWaist}
                      onChange={(e) => setNewProfileWaist(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">طول الكم (سم)</label>
                    <input
                      id="new-profile-sleeve"
                      type="number"
                      value={newProfileSleeve}
                      onChange={(e) => setNewProfileSleeve(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-center font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    id="btn-cancel-profile"
                    type="button"
                    onClick={() => setShowMeasureForm(false)}
                    className="px-4 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-700"
                  >
                    إلغاء
                  </button>
                  <button
                    id="btn-save-profile"
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold"
                  >
                    حفظ الملف الحالي
                  </button>
                </div>
              </form>
            )}

            {/* Sizing list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedMeasurements.map((m) => (
                <div 
                  id={`profile-card-${m.id}`}
                  key={m.id}
                  className="p-4 bg-white border border-stone-200 rounded-xl relative hover:border-amber-500 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-sm text-stone-900">{m.profileName}</h5>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold block w-max mt-1">
                        {m.gender === "female" ? "نسائي" : "رجالي"}
                      </span>
                    </div>
                    
                    <button
                      id={`delete-profile-${m.id}`}
                      onClick={() => handleDeleteMeasurement(m.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="حذف الملف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Measurements summary list */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono text-stone-600">
                    <div className="bg-stone-50 p-1.5 rounded text-center">
                      <span className="block text-stone-400">الطول</span>
                      <strong className="text-stone-800 font-bold">{m.height} سم</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded text-center">
                      <span className="block text-stone-400">الكتف</span>
                      <strong className="text-stone-800 font-bold">{m.shoulder} سم</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded text-center">
                      <span className="block text-stone-400">الصدر</span>
                      <strong className="text-stone-800 font-bold">{m.chest} سم</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded text-center">
                      <span className="block text-stone-400">الخصر</span>
                      <strong className="text-stone-800 font-bold">{m.waist} سم</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded text-center">
                      <span className="block text-stone-400">الكم</span>
                      <strong className="text-stone-800 font-bold">{m.sleeveLength} سم</strong>
                    </div>
                    {m.gender === "female" ? (
                      <div className="bg-stone-50 p-1.5 rounded text-center">
                        <span className="block text-stone-400">الأرداف</span>
                        <strong className="text-stone-800 font-bold">{m.hips || "--"} سم</strong>
                      </div>
                    ) : (
                      <div className="bg-stone-50 p-1.5 rounded text-center">
                        <span className="block text-stone-400">الرقبة</span>
                        <strong className="text-stone-800 font-bold">{m.neck || "--"} سم</strong>
                      </div>
                    )}
                  </div>

                  {onSelectSavedMeasurement && (
                    <button
                      id={`select-profile-${m.id}`}
                      onClick={() => onSelectSavedMeasurement(m)}
                      className="w-full mt-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[10px] font-bold text-center transition-colors"
                    >
                      استخدم هذا الملف المعتمد
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">عناوين التوصيل المفضلة لديك</h4>
                <p className="text-xs text-stone-500">إضافة أو تعديل عناوين استلام الطلبيات</p>
              </div>
              <button
                id="btn-add-new-address"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة عنوان جديد</span>
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">تسمية العنوان (المنزل، العمل)</label>
                    <input
                      id="new-addr-title"
                      type="text"
                      required
                      value={newAddrTitle}
                      onChange={(e) => setNewAddrTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800 focus:outline-none"
                      placeholder="عنوان المنزل"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">الاسم الكامل للمستلم</label>
                    <input
                      id="new-addr-fullname"
                      type="text"
                      required
                      value={newAddrFullName}
                      onChange={(e) => setNewAddrFullName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800 focus:outline-none"
                      placeholder="الاسم الثلاثي"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">المدينة</label>
                    <select
                      id="new-addr-city"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full px-2 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800"
                    >
                      <option>الرياض</option>
                      <option>جدة</option>
                      <option>الدمام</option>
                      <option>مكة المكرمة</option>
                      <option>المدينة المنورة</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">الحي، الشارع ورقم الشقة أو الفيلا</label>
                    <input
                      id="new-addr-street"
                      type="text"
                      required
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800 focus:outline-none"
                      placeholder="مثال: حي الصحافة، شارع العليا، مبنى 5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">رقم الجوال الفعال للتوصيل</label>
                    <input
                      id="new-addr-phone"
                      type="text"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 bg-white rounded-lg text-xs text-stone-800 focus:outline-none"
                      placeholder="+9665XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    id="btn-cancel-addr"
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-700"
                  >
                    إلغاء
                  </button>
                  <button
                    id="btn-save-addr"
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold"
                  >
                    حفظ العنوان المكتوب
                  </button>
                </div>
              </form>
            )}

            {/* Address cards list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((a) => (
                <div 
                  id={`addr-card-${a.id}`}
                  key={a.id}
                  className={`p-4 rounded-xl border relative shadow-sm ${
                    a.isDefault ? "border-amber-600 bg-amber-50/10" : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-stone-900">{a.title}</span>
                        {a.isDefault && (
                          <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <MapPinCheck className="w-2.5 h-2.5" />
                            <span>الافتراضي للطلب</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-800 font-medium mt-1">{a.fullName}</p>
                    </div>

                    <div className="flex gap-1">
                      {!a.isDefault && (
                        <button
                          id={`set-default-addr-${a.id}`}
                          onClick={() => handleSetDefaultAddress(a.id)}
                          className="text-[10px] text-stone-400 hover:text-amber-700 hover:underline px-1.5"
                        >
                          تحديد كافتراضي
                        </button>
                      )}
                      <button
                        id={`delete-addr-${a.id}`}
                        onClick={() => handleDeleteAddress(a.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors animate-fade-in"
                        title="حذف العنوان"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">{a.city} - {a.street}</p>
                  <p className="text-xs font-mono font-bold text-stone-500 mt-1">{a.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
