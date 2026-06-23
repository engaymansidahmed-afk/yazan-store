/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles, Loader2, ArrowLeft, Ruler, AlertCircle, HelpCircle } from "lucide-react";
import { SavedMeasurements } from "../types";

interface SmartSizeModalProps {
  gender: "female" | "male";
  onApply: (measurements: Partial<SavedMeasurements>) => void;
  onClose: () => void;
}

export default function SmartSizeModal({ gender, onApply, onClose }: SmartSizeModalProps) {
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");
  const [age, setAge] = useState<string>("30");
  const [bodyType, setBodyType] = useState<string>("عادي");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bodyTypes = [
    { name: "نحيف", desc: "بنية خفيفة وقوام دقيق" },
    { name: "رياضي", desc: "أكتاف عريضة وبنية عضلية" },
    { name: "عادي", desc: "بنية متوازنة ومعدل قياسي" },
    { name: "ممتلئ", desc: "قوام ممتلئ متناسق" },
    { name: "عريض", desc: "بنية ممتلئة مع أكتاف عريضة" }
  ];

  const handleCalculate = async () => {
    if (!height || !weight || !age) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة لضمان دقة المقاس.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/smart-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: Number(height),
          weight: Number(weight),
          age: Number(age),
          gender,
          bodyType
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.measurements);
      } else {
        setError(data.error || "حدث خطأ أثناء الاتصال بمساعد المقاسات.");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    
    const measurements: Partial<SavedMeasurements> = {
      gender,
      height: result.height || Number(height),
      shoulder: result.shoulder,
      chest: result.chest,
      waist: result.waist,
      sleeveLength: result.sleeveLength,
    };

    if (gender === "female") {
      measurements.hips = result.hips;
      measurements.neckline = result.neckline;
    } else {
      measurements.neck = result.neck;
      measurements.armLength = result.armLength || Math.round(result.sleeveLength * 1.05);
    }

    onApply(measurements);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="smart-size-modal"
        className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">مساعد المقاسات الذكي</h3>
              <p className="text-xs text-stone-300">تحليل فوري للمقاسات المثالية بدقة الذكاء الاصطناعي</p>
            </div>
          </div>
          <button 
            id="close-smart-size"
            onClick={onClose} 
            className="p-1.5 hover:bg-white/10 rounded-lg text-stone-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {!result ? (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl text-amber-900 text-sm flex gap-3">
                <Ruler className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  بدلاً من إدخال جميع مقاسات الخياطة يدوياً، أدخل بياناتك البدنية العامة وسيقوم مصمم الذكاء الاصطناعي الخاص بنا بتقدير مقاساتك التفصيلية بدقة تناسب هوية الملابس الشرقية والغربية.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">الطول (سم)</label>
                  <input
                    id="input-height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center text-stone-800 font-mono text-sm focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">الوزن (كجم)</label>
                  <input
                    id="input-weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center text-stone-800 font-mono text-sm focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="70"
                    min="30"
                    max="200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">العمر (سنة)</label>
                  <input
                    id="input-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center text-stone-800 font-mono text-sm focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="30"
                    min="10"
                    max="100"
                  />
                </div>
              </div>

              {/* Body Type Select */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">شكل الجسم وبنيته</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bodyTypes.map((type) => (
                    <button
                      id={`bodytype-${type.name}`}
                      key={type.name}
                      type="button"
                      onClick={() => setBodyType(type.name)}
                      className={`flex flex-col text-right p-2.5 rounded-xl border text-sm transition-all ${
                        bodyType === type.name
                          ? "border-amber-600 bg-amber-50 text-amber-950"
                          : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300"
                      }`}
                    >
                      <span className="font-bold">{type.name}</span>
                      <span className="text-xs text-stone-500 mt-0.5">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-calculate-size"
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-stone-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحليل شكل الجسم وحساب المقاسات...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد المقاسات بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sizing Results Header */}
              <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">دقة التحليل المتوقعة</span>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-3xl font-mono font-bold text-amber-600">{result.confidenceScore}%</div>
                  <div className="text-stone-300">|</div>
                  <div className="text-sm font-medium text-stone-700">جنس العميل: {gender === "female" ? "أنثى" : "ذكر"}</div>
                </div>
              </div>

              {/* Sizing Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 text-sm border-r-2 border-amber-600 pr-2">المقاسات المقدرة لجسمكِ (بالسنتيمتر):</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">الطول الإجمالي:</span>
                    <span className="font-mono font-bold text-stone-900">{result.height} سم</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">عرض الكتف:</span>
                    <span className="font-mono font-bold text-stone-900">{result.shoulder} سم</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">محيط الصدر:</span>
                    <span className="font-mono font-bold text-stone-900">{result.chest} سم</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">محيط الخصر:</span>
                    <span className="font-mono font-bold text-stone-900">{result.waist} سم</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">طول الكم:</span>
                    <span className="font-mono font-bold text-stone-900">{result.sleeveLength} سم</span>
                  </div>

                  {gender === "female" ? (
                    <>
                      <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-stone-600 font-medium">محيط الأرداف:</span>
                        <span className="font-mono font-bold text-stone-900">{result.hips || "--"} سم</span>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-stone-600 font-medium">فتحة الرقبة:</span>
                        <span className="font-mono font-bold text-stone-900">{result.neckline || "--"} سم</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-stone-600 font-medium">محيط الرقبة:</span>
                        <span className="font-mono font-bold text-stone-900">{result.neck || "--"} سم</span>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-stone-600 font-medium">طول الذراع الكامل:</span>
                        <span className="font-mono font-bold text-stone-900">{result.armLength || "--"} سم</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sizing Advisor Note */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm">
                <span className="font-serif font-bold text-amber-900 block mb-1">ملاحظة مصمم يزن للأناقة:</span>
                <p className="text-stone-700 leading-relaxed font-sans">{result.tailorNote}</p>
              </div>

              {/* Double CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-recalculate"
                  type="button"
                  onClick={() => setResult(null)}
                  className="py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl font-bold text-sm transition-colors text-center"
                >
                  إعادة حساب
                </button>
                <button
                  id="btn-apply-size"
                  type="button"
                  onClick={handleApply}
                  className="py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors text-center shadow-lg shadow-amber-600/10"
                >
                  اعتماد وتعبئة المقاسات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
