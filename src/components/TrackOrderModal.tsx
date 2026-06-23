/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  X, Truck, MapPin, Calendar, Clock, Phone, MessageSquare, 
  Copy, Check, Info, ShieldCheck, Compass, Navigation, Star, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function TrackOrderModal({ isOpen, onClose, order }: TrackOrderModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "checkpoints">("map");

  // Determine actual items, tailoring vs ready-made
  const isTailored = order?.tailoring !== undefined;
  const item = isTailored ? order.tailoring : order;
  const status = item?.status || "pending";
  const orderId = order?.id || "ORD-000000";
  const price = order?.price || 0;
  const orderDate = order?.orderDate || "مؤخراً";

  // Dynamic estimated delivery date (2 days after order date if ready, or calculated based on status)
  const getEstimatedArrival = () => {
    if (status === "ready") {
      return "اليوم، خلال الساعات القادمة";
    }
    if (status === "quality_check") {
      return "غداً، بين الساعة 2 ظهراً - 6 مساءً";
    }
    if (status === "sewing" || status === "workshop") {
      return "خلال 2-3 أيام عمل";
    }
    return "خلال 4-5 أيام عمل";
  };

  // Status mapping to progress percentage for the map path
  const getStatusBaseProgress = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending": return 10;
      case "approved": return 25;
      case "workshop": return 45;
      case "sewing": return 65;
      case "quality_check": return 85;
      case "ready": return 100;
      default: return 10;
    }
  };

  // Initialize simulation progress based on current status
  useEffect(() => {
    if (isOpen) {
      setSimulationProgress(getStatusBaseProgress(status));
    }
  }, [isOpen, status]);

  // Handle simulation trigger
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 1.5;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleCopyTracking = () => {
    const trackingNumber = `YZN-${orderId.replace("ORD-", "")}-TRK`;
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerCall = () => {
    setCallStatus("جاري الاتصال بالكابتن عبدالله الغامدي عبر الشبكة الآمنة...");
    setTimeout(() => {
      setCallStatus(null);
    }, 4000);
  };

  const triggerWhatsApp = () => {
    setCallStatus("جاري تحويلك لدردشة الواتساب المباشرة لخدمة التوصيل...");
    setTimeout(() => {
      setCallStatus(null);
    }, 4000);
  };

  if (!isOpen || !order) return null;

  // Visual Path Points on Map SVG (Responsive and Custom-styled)
  // We define a beautiful SVG curve for the track
  const svgPath = "M 50 160 Q 150 60, 250 140 T 450 80 T 650 130";
  
  // Calculate point on path based on percentage (using SVG path properties approximated)
  // For standard mock, we can place the truck along x & y based on percentages
  const getTruckCoordinates = (percentage: number) => {
    // 5 segments rough approximation for curve: M 50 160 Q 150 60, 250 140 T 450 80 T 650 130
    const ratio = percentage / 100;
    // Let's interpolate
    const startX = 60;
    const endX = 610;
    const x = startX + (endX - startX) * ratio;
    
    // Wave formula for y-axis mapping
    const y = 140 - Math.sin(ratio * Math.PI * 2.5) * 45 + (1 - ratio) * 20;
    return { x, y };
  };

  const truckPos = getTruckCoordinates(simulationProgress);

  const checkpoints = [
    {
      id: "pending",
      title: "استقبال الطلب واعتماده",
      desc: "تم استلام طلبك ومراجعته للبدء في خط الإنتاج الفاخر لدار يزن.",
      time: "10:30 ص",
      date: orderDate,
      active: true,
      done: true,
    },
    {
      id: "workshop",
      title: "قص واختيار القماش الإيطالي",
      desc: "اكتمل قص الأثواب حسب قياساتك المحفوظة بإشراف خياط الدار الرئيسي.",
      time: "02:15 م",
      date: orderDate,
      active: ["workshop", "sewing", "quality_check", "ready"].includes(status),
      done: ["workshop", "sewing", "quality_check", "ready"].includes(status),
    },
    {
      id: "sewing",
      title: "الخياطة اليدوية والتطريز",
      desc: "الخياطة الدقيقة وتثبيت التطريز والأزرار بمهارة عالية في معاملنا المخصصة.",
      time: "09:00 ص",
      date: "أمس",
      active: ["sewing", "quality_check", "ready"].includes(status),
      done: ["sewing", "quality_check", "ready"].includes(status),
    },
    {
      id: "quality_check",
      title: "فحص الجودة والتعبئة الفاخرة",
      desc: "خضوع المنتج لفحص الجودة اليدوي المزدوج، والتعطير، والتغليف في صندوق دار يزن المخملي.",
      time: "11:30 ص",
      date: "اليوم",
      active: ["quality_check", "ready"].includes(status),
      done: ["quality_check", "ready"].includes(status),
    },
    {
      id: "ready",
      title: "التسليم لشركة الشحن (خارج للتوصيل)",
      desc: "استلم الكابتن عبدالله الغامدي صندوقك الفاخر وهو في طريقه إليك الآن.",
      time: "03:45 م",
      date: "اليوم",
      active: status === "ready",
      done: status === "ready",
    }
  ];

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ direction: "rtl" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative"
      >
        {/* Decorative Golden Top Border */}
        <div className="h-1.5 bg-gradient-to-l from-amber-600 via-stone-900 to-amber-700 w-full" />

        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-600/10 text-amber-800 rounded-lg">
                <Truck className="w-5 h-5" />
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">متابعة شحنتك الفاخرة</h3>
            </div>
            <p className="text-xs text-stone-500">
              رقم الطلب: <span className="font-mono font-bold text-stone-900">{orderId}</span> • تاريخ الطلب: <span className="font-bold text-stone-700">{orderDate}</span>
            </p>
          </div>
          <button 
            id="btn-close-tracker-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Status Overlay Notification */}
        <AnimatePresence>
          {callStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute top-16 left-6 right-6 z-50 bg-stone-900 text-amber-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3 shadow-lg border border-amber-600/30"
            >
              <Navigation className="w-4 h-4 animate-spin text-amber-500 shrink-0" />
              <span>{callStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Overview Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-100 bg-white">
          <div className="p-5 border-l border-b md:border-b-0 border-stone-100 text-center md:text-right space-y-1 bg-amber-50/20">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">تاريخ التوصيل المقدر</span>
            <span className="text-sm font-bold text-amber-900 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{getEstimatedArrival()}</span>
            </span>
          </div>

          <div className="p-5 border-l border-b md:border-b-0 border-stone-100 text-center md:text-right space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">مزود التوصيل الحصري</span>
            <span className="text-sm font-bold text-stone-800 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>يزن إكسبريس الفاخر</span>
            </span>
          </div>

          <div className="p-5 border-l border-b md:border-b-0 border-stone-100 text-center md:text-right space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">رقم تتبع الشحنة</span>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-stone-900">YZN-{orderId.replace("ORD-", "")}-TRK</span>
              <button 
                id="btn-copy-tracking"
                onClick={handleCopyTracking}
                className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-50 transition-colors"
                title="نسخ رقم التتبع"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-5 text-center md:text-right space-y-1 bg-stone-50/50 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">نوع الشحن وقيمة الطلب</span>
            <span className="text-xs text-stone-700 font-bold mt-1">شحن سريع VIP (مجاني)</span>
            <span className="text-xs font-mono font-bold text-amber-700 mt-0.5">{price} ر.س مسبق الدفع</span>
          </div>
        </div>

        {/* Modal Tab Controls */}
        <div className="flex border-b border-stone-100 bg-stone-50/30 p-2 gap-1.5">
          <button
            id="tab-view-map"
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "map"
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/10"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>خريطة تتبع الشحنة المباشرة</span>
          </button>
          <button
            id="tab-view-checkpoints"
            onClick={() => setActiveTab("checkpoints")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "checkpoints"
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/10"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>سجل الخطوات والملخص</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {activeTab === "map" ? (
            <div className="space-y-6">
              {/* INTERACTIVE VECTOR MAP CONTAINER */}
              <div className="relative border border-stone-200/60 rounded-3xl overflow-hidden bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50/10 p-4 h-[280px] shadow-inner select-none">
                {/* Simulated Grid overlay lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-25"></div>
                
                {/* Soft Geographic contour design details representing desert / sand dunes and roads */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full text-stone-400" viewBox="0 0 700 280">
                    <path d="M -50 200 C 150 150, 200 300, 450 180 C 600 100, 650 220, 800 200" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M -10 120 C 120 80, 220 180, 380 90 C 500 50, 600 150, 750 100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                    <circle cx="200" cy="80" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="480" cy="180" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                  </svg>
                </div>

                {/* Simulated Roads/Highways in Riyadh (Modern High-end layout) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 680 280">
                  {/* Highway Line 1 (Al-Muzahimiyah - Riyadh Road) */}
                  <path d="M 40 180 L 180 180 Q 250 180, 310 130 T 490 100 L 630 100" fill="none" stroke="stone-300" strokeWidth="4" strokeLinecap="round" className="opacity-30" />
                  <path d="M 40 180 L 180 180 Q 250 180, 310 130 T 490 100 L 630 100" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="6,4" className="opacity-80" />

                  {/* King Fahd Road Crossing */}
                  <line x1="380" y1="20" x2="380" y2="260" stroke="#d6d3d1" strokeWidth="4" strokeLinecap="round" className="opacity-30" />
                  <line x1="380" y1="20" x2="380" y2="260" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4,4" className="opacity-70" />

                  {/* Northern Ring Road */}
                  <path d="M 120 60 C 250 50, 420 50, 580 60" fill="none" stroke="#d6d3d1" strokeWidth="4" className="opacity-30" />
                  <path d="M 120 60 C 250 50, 420 50, 580 60" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6,4" className="opacity-70" />
                </svg>

                {/* SVG Route Connector Path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 680 280">
                  {/* Background route glow path */}
                  <path 
                    d={svgPath} 
                    fill="none" 
                    stroke="rgba(217, 119, 6, 0.1)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                  {/* Dynamic Dashed Track */}
                  <path 
                    d={svgPath} 
                    fill="none" 
                    stroke="#d6d3d1" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeDasharray="6,5"
                  />
                  {/* Dynamic Glowing Solid Active Path */}
                  <path 
                    d={svgPath} 
                    fill="none" 
                    stroke="#b45309" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: "680",
                      strokeDashoffset: 680 - (680 * (simulationProgress / 100))
                    }}
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Landmarks / Waypoints Icons and Labels */}
                
                {/* 1. Start Node: Warehouse / Workshop (المزاحمية) */}
                <div className="absolute top-[145px] right-[570px] flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-stone-900 border-2 border-white flex items-center justify-center shadow-lg text-white">
                    <Scissors className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="mt-1 bg-stone-900/90 backdrop-blur-sm text-[9px] text-white px-2 py-0.5 rounded-md font-bold shadow whitespace-nowrap">
                    ورشة التفصيل (المزاحمية)
                  </div>
                </div>

                {/* 2. Middle Node: Distribution Center (شمال الرياض) */}
                <div className="absolute top-[125px] right-[390px] flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-all duration-300 ${
                    simulationProgress >= 50 ? "bg-amber-700 text-white" : "bg-white text-stone-400"
                  }`}>
                    <Truck className="w-3 h-3" />
                  </div>
                  <div className="mt-1 bg-white/90 backdrop-blur-sm text-[8px] text-stone-700 border border-stone-200 px-1.5 py-0.5 rounded font-bold shadow whitespace-nowrap">
                    مركز فرز شمال الرياض
                  </div>
                </div>

                {/* 3. End Node: Customer Delivery Address (الرياض - حي الياسمين / الملقا) */}
                <div className="absolute top-[105px] right-[40px] flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all duration-300 ${
                    simulationProgress >= 98 ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-white text-stone-500"
                  }`}>
                    <MapPin className={`w-4 h-4 ${simulationProgress >= 98 ? "text-white" : "text-amber-600 animate-pulse"}`} />
                  </div>
                  <div className="mt-1 bg-stone-900 text-white px-2 py-0.5 rounded-md font-bold shadow-md text-[9px] whitespace-nowrap flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>موقعك (حي الملقا)</span>
                  </div>
                </div>

                {/* ACTIVE COURIER TRUCK PIN (Dynamic movement on SVG) */}
                <div 
                  className="absolute pointer-events-none transition-all duration-300 ease-out z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${truckPos.x}px`,
                    top: `${truckPos.y}px`
                  }}
                >
                  {/* Glowing Pulse Effect around courier vehicle */}
                  <div className="absolute w-10 h-10 rounded-full bg-amber-600/30 animate-ping -z-10"></div>
                  
                  {/* Premium Delivery Van Marker Card */}
                  <div className="bg-amber-600 text-stone-950 p-2 rounded-xl shadow-lg border border-white flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-stone-950 rotate-45 animate-pulse" />
                    <span className="font-bold text-[10px] font-mono">توصيل يزن المباشر</span>
                  </div>
                  {/* Pin Tail */}
                  <div className="w-2 h-2 bg-amber-600 rotate-45 -mt-1.5 shadow-md"></div>
                </div>

                {/* Live Coordinates / Simulation Stats Bar */}
                <div className="absolute bottom-3 right-3 left-3 bg-white/95 backdrop-blur-sm border border-stone-200/50 rounded-2xl p-2.5 flex justify-between items-center text-[10px] font-bold text-stone-700 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                    <span>الإحداثيات الحية: 24.8142° N, 46.6391° E</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-400">السرعة: 65 كم/ساعة</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-stone-700 font-mono">اكتمال المسار: {Math.round(simulationProgress)}%</span>
                  </div>
                </div>
              </div>

              {/* Simulation Play / Reset Controls for Interactive Map */}
              <div className="flex justify-between items-center bg-stone-50 border border-stone-200/60 rounded-2xl p-4">
                <div className="space-y-0.5 max-w-lg">
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>محاكاة الشحن التفاعلية</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    يمكنك تشغيل محاكاة حركة المركبة على الخريطة لتجربة واجهة التتبع الفاخرة لدار يزن بالكامل من الورشة وحتى الباب.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {simulationProgress === 100 ? (
                    <button
                      id="btn-reset-simulation"
                      onClick={() => setSimulationProgress(getStatusBaseProgress(status))}
                      className="px-3.5 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span>إعادة ضبط التتبع</span>
                    </button>
                  ) : (
                    <button
                      id="btn-toggle-simulation"
                      onClick={() => setIsSimulating(!isSimulating)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        isSimulating
                          ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          : "bg-amber-600 text-stone-950 hover:bg-amber-700"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isSimulating ? "إيقاف المؤقت للمحاكاة" : "محاكاة التتبع الحي"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* DETAILED CHECKPOINTS LIST TAB */
            <div className="space-y-6">
              <div className="border border-stone-100 rounded-2xl overflow-hidden bg-white shadow-sm p-5 space-y-5">
                <h4 className="text-xs font-bold text-stone-900 border-r-3 border-amber-600 pr-2">سجل حركة الشحنة المعتمد بالتاريخ والوقت</h4>
                
                <div className="relative border-r-2 border-stone-200 pr-5 mr-3 space-y-6 pt-1 pb-1">
                  {checkpoints.map((cp, idx) => (
                    <div key={cp.id} className="relative">
                      {/* Checkpoint Marker Circle */}
                      <div className={`absolute -right-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                        cp.done
                          ? "bg-green-600 text-white shadow"
                          : cp.active
                            ? "bg-amber-600 text-stone-950 ring-4 ring-amber-600/20"
                            : "bg-stone-200"
                      }`}>
                        {cp.done && <Check className="w-2 h-2" />}
                      </div>

                      {/* Content Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <div className="space-y-1 max-w-xl">
                          <h5 className={`text-xs font-bold ${cp.active ? "text-stone-900" : "text-stone-400"}`}>
                            {cp.title}
                          </h5>
                          <p className={`text-[11px] ${cp.active ? "text-stone-600" : "text-stone-400"}`}>
                            {cp.desc}
                          </p>
                        </div>
                        <div className="text-[10px] font-mono text-left text-stone-400 shrink-0">
                          <span className="font-bold">{cp.date}</span>
                          <span className="mx-1">•</span>
                          <span>{cp.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LUXURY COURIER CAPTAIN DETAILS SECTION */}
          <div className="mt-6 border border-stone-200/60 rounded-3xl p-5 bg-gradient-to-r from-stone-50 to-amber-50/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3.5">
              {/* Captain Avatar with golden ring */}
              <div className="relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
                  alt="courier portrait"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-600/40 bg-stone-100"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center" title="نشط حالياً"></span>
              </div>

              {/* Captain Name & Vehicle Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-stone-900 text-amber-500 px-1.5 py-0.5 rounded font-bold">كابتن يزن VIP</span>
                  <h4 className="text-xs font-bold text-stone-950">عبدالله الغامدي</h4>
                </div>
                <p className="text-[11px] text-stone-600">
                  مرسيدس فيتو سوداء فاخرة • <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1 py-0.5 rounded">لوحة: أ ب ج 1 2 3 4</span>
                </p>
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.95 تقييم متميز</span>
                  <span className="text-stone-300">|</span>
                  <span className="text-stone-500 font-normal">أكثر من 500 عملية توصيل فاخرة</span>
                </div>
              </div>
            </div>

            {/* Contact Actions for Captain */}
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                id="btn-call-captain"
                onClick={triggerCall}
                className="flex-1 sm:flex-initial px-4 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-white shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>اتصال بالكابتن</span>
              </button>
              <button
                id="btn-whatsapp-captain"
                onClick={triggerWhatsApp}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-green-100"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>محادثة واتساب</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-500">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>يتم تحديث التتبع تلقائياً كل دقيقة بناءً على مستشعرات GPS للمركبة اللوجستية لدار يزن.</span>
          </span>
          <button 
            id="btn-dismiss-tracker"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs transition-colors"
          >
            إغلاق نافذة التتبع
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Scissors icon declaration is needed, let's export or define if not imported
function Scissors(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="9.8" y1="8.2" x2="21" y2="19.4" />
      <line x1="21" y1="4.6" x2="12.5" y2="13" />
      <line x1="9.8" y1="15.8" x2="12.5" y2="13" />
    </svg>
  );
}
