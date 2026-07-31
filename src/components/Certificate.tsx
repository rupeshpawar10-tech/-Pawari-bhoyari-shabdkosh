import React, { useState, useRef } from 'react';
import { Award, Printer, RotateCcw, CheckCircle2, ShieldCheck, Sparkles, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CertificateProps {
  userName: string;
  userDistrict: string;
  candidatePhoto?: string | null;
  score: number;
  totalQuestions: number;
  quizType: 'paheliyan' | 'words';
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  userName,
  userDistrict,
  candidatePhoto,
  score,
  totalQuestions,
  quizType,
  onRestart
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const percentage = Math.round((score / totalQuestions) * 100);
  const certId = React.useMemo(() => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `PWR-${quizType === 'paheliyan' ? 'PAH' : 'WRD'}-${random}`;
  }, [quizType]);

  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const quizTitleHindi = quizType === 'paheliyan' ? 'पँवारी लोक-पहेलियाँ' : 'पँवारी शब्दकोश (शब्द-अर्थ)';

  // Handle Download as PNG/Image file
  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2, // High resolution for clear print & save
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Pawari_Certificate_${userName.replace(/\s+/g, '_')}_${certId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to capture certificate image', err);
      // Fallback to print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    // Direct window print
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-amber-900 text-amber-50 p-4 rounded-2xl shadow-md border border-amber-700">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2 rounded-xl text-amber-300 border border-amber-400/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-100">🎉 बधाई हो! आपका प्रमाण-पत्र तैयार है</h3>
            <p className="text-xs text-amber-300">
              प्रमाण-पत्र को सीधे गैलरी/फ़ाइल में सेव करने के लिए 'डाउनलोड (PNG/PDF)' बटन दबाएं।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            disabled={isDownloading}
            onClick={handleDownloadImage}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-stone-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>डाउनलोड हो रहा है...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-stone-950" />
                <span>प्रमाण-पत्र डाउनलोड करें (PNG/PDF)</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट करें</span>
          </button>

          <button
            onClick={onRestart}
            className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer border border-amber-700/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>पुनः खेलें</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Canvas */}
      <div 
        ref={certRef}
        className="certificate-print-area bg-white rounded-2xl p-4 sm:p-8 md:p-12 border-8 border-double border-amber-700 shadow-2xl relative overflow-hidden text-stone-900 max-w-4xl mx-auto my-4 font-serif"
      >
        
        {/* Decorative Outer Border Corner Accent */}
        <div className="absolute top-3 left-3 w-16 h-16 border-t-4 border-l-4 border-amber-800 pointer-events-none"></div>
        <div className="absolute top-3 right-3 w-16 h-16 border-t-4 border-r-4 border-amber-800 pointer-events-none"></div>
        <div className="absolute bottom-3 left-3 w-16 h-16 border-b-4 border-l-4 border-amber-800 pointer-events-none"></div>
        <div className="absolute bottom-3 right-3 w-16 h-16 border-b-4 border-r-4 border-amber-800 pointer-events-none"></div>

        {/* Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award className="w-[450px] h-[450px] text-amber-900" />
        </div>

        {/* Inner Content Border Frame */}
        <div className="border-2 border-amber-600/60 p-6 sm:p-10 rounded-xl relative z-10 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center space-y-6">
          
          {/* Header Banner */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-800 text-xs font-sans uppercase font-bold tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>माँ ताप्ती शोध संस्थान मुलताई</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-950 tracking-wide font-serif border-b-2 border-amber-300 pb-3 inline-block px-6">
              प्रशस्ति पत्र
            </h1>
            
            <div className="text-xs sm:text-sm font-sans font-semibold text-amber-900 uppercase tracking-wider pt-1">
              Certificate of Excellence & Knowledge
            </div>
          </div>

          {/* Award Medal Graphic & Candidate Photo */}
          <div className="flex items-center justify-center gap-6 my-2">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-emerald-50 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border border-emerald-300 shadow">
                {percentage}% उत्तीर्णांक
              </div>
            </div>

            {/* Optional Candidate Photo Frame */}
            {candidatePhoto && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-2 border-amber-600 overflow-hidden shadow-md bg-stone-100 p-0.5">
                  <img
                    src={candidatePhoto}
                    alt={userName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="text-[9px] font-bold text-amber-900 uppercase mt-1 tracking-wider">
                  सत्यापित परीक्षार्थी
                </span>
              </div>
            )}
          </div>

          {/* Main Body Text */}
          <div className="space-y-4 max-w-2xl mx-auto py-2">
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
              प्रमाणित किया जाता है कि
            </p>

            {/* Candidate Name & District */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-900 underline decoration-amber-500/60 underline-offset-8">
                {userName || 'परीक्षार्थी'}
              </h2>
              <p className="text-stone-700 text-sm sm:text-base font-sans pt-2">
                निवासी जिला: <strong className="text-amber-950 font-bold underline">{userDistrict || 'सतपुड़ा अंचल'}</strong>
              </p>
            </div>

            <p className="text-stone-800 text-sm sm:text-base leading-relaxed pt-3">
              ने <strong>'रुनुक-झुनुक पँवारी शब्दकोश एवं लोक-पहेलियाँ ई-ज्ञान परीक्षा'</strong> में अंतर्गत{' '}
              <span className="text-amber-900 font-bold bg-amber-100/80 px-3 py-1 rounded-md border border-amber-300 inline-block my-1">
                {quizTitleHindi} परीक्षा
              </span>{' '}
              में भाग लेकर <strong>{totalQuestions} में से {score} ({percentage}%)</strong> अंक प्राप्त कर यह उत्कृष्ट उपलब्धि अर्जित की है।
            </p>

            <p className="text-xs sm:text-sm text-stone-600 font-sans italic pt-1">
              पँवारी (भोयरी) भाषा, समृद्ध लोक-बोली एवं सतपुड़ा अंचल की लोक-संस्कृति के संरक्षण व संवर्धन हेतु आपका योगदान सराहनीय है।
            </p>
          </div>

          {/* Certificate Footer / Signatures */}
          <div className="pt-8 border-t-2 border-amber-300 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs font-sans items-end">
            
            {/* Seal / Issue Info */}
            <div className="text-left space-y-1">
              <div className="text-[11px] text-stone-500 uppercase font-bold">प्रमाण पत्र क्रमांक:</div>
              <div className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded border border-amber-300 inline-block text-[11px]">
                {certId}
              </div>
              <div className="text-[11px] text-stone-600 font-semibold pt-1">जारी तिथि: {currentDate}</div>
            </div>

            {/* Center Verified Emblem */}
            <div className="hidden sm:flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-700 flex items-center justify-center bg-amber-50 text-amber-900 text-center p-1 shadow-inner">
                <ShieldCheck className="w-9 h-9 text-amber-800" />
              </div>
              <span className="text-[10px] font-bold text-amber-950 uppercase mt-1 tracking-wider">माँ ताप्ती शोध संस्थान मुलताई</span>
            </div>

            {/* Clear Founder Signature Block */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-amber-950 font-black text-base sm:text-lg border-b-2 border-stone-600 pb-1 inline-block px-3 tracking-wide">
                राजेश बारंगे पंवार
              </div>
              <div className="font-bold text-stone-900 text-[12px]">संस्थापक एवं प्रधान संपादक</div>
              <div className="text-[10px] text-stone-600 font-medium">माँ ताप्ती शोध संस्थान, मुलताई</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
