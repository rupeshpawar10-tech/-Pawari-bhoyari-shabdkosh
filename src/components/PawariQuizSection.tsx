import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Award, RotateCcw, CheckCircle2, XCircle, ArrowRight, 
  HelpCircle, BookOpen, ShieldCheck, User, MapPin, RefreshCw, ChevronRight, Camera, Trash2
} from 'lucide-react';
import { Certificate } from './Certificate';
import dictionaryData from '../data/pawari_dictionary.json';
import paheliyanData from '../data/pawari_paheliyan.json';

export interface QuizQuestion {
  id: number | string;
  type: 'paheliyan' | 'words';
  questionText: string;
  hintOrContext?: string;
  correctAnswer: string;
  options: string[];
}

export interface QuizRecord {
  id: string;
  name: string;
  district: string;
  quizType: 'paheliyan' | 'words';
  score: number;
  totalQuestions: number;
  percentage: number;
  status: 'उत्तीर्ण (Passed)' | 'प्रयासरत (Failed)';
  certificateId?: string;
  date: string;
  timestamp: number;
}

interface PawariQuizSectionProps {
  initialType?: 'paheliyan' | 'words';
}

export const PawariQuizSection: React.FC<PawariQuizSectionProps> = ({ initialType = 'paheliyan' }) => {
  const [quizType, setQuizType] = useState<'paheliyan' | 'words'>(initialType);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Certificate Form Inputs
  const [candidateName, setCandidateName] = useState('');
  const [candidateDistrict, setCandidateDistrict] = useState('बैतूल');
  const [candidatePhoto, setCandidatePhoto] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("कृपया 5 MB से कम साइज की फोटो चुनें।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCandidatePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to shuffle array
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Generate 10 Questions
  const generateQuestions = (type: 'paheliyan' | 'words') => {
    setQuizType(type);
    setCurrentIdx(0);
    setSelectedOption(null);
    setUserAnswers({});
    setScore(0);
    setQuizFinished(false);
    setShowCertificate(false);

    if (type === 'paheliyan') {
      const shuffledPaheliyan = shuffle(paheliyanData).slice(0, 10);
      const allAnswers = paheliyanData.map(p => p.answer);

      const generated: QuizQuestion[] = shuffledPaheliyan.map((p, index) => {
        const correct = p.answer;
        // filter out correct answer to pick 3 unique distractors
        const otherAnswers = shuffle(allAnswers.filter(a => a !== correct));
        const distractors = Array.from(new Set(otherAnswers)).slice(0, 3);
        const options = shuffle([correct, ...distractors]);

        return {
          id: p.id || index + 1,
          type: 'paheliyan',
          questionText: p.paheli,
          hintOrContext: p.hint ? `संकेत: ${p.hint}` : 'पँवारी लोक-पहेली',
          correctAnswer: correct,
          options
        };
      });

      setQuestions(generated);
    } else {
      // Words Quiz
      const shuffledWords = shuffle(dictionaryData).slice(0, 10);
      const allMeanings = dictionaryData.map(w => w.hi_meaning);

      const generated: QuizQuestion[] = shuffledWords.map((w, index) => {
        const correct = w.hi_meaning;
        const otherMeanings = shuffle(allMeanings.filter(m => m !== correct));
        const distractors = Array.from(new Set(otherMeanings)).slice(0, 3);
        const options = shuffle([correct, ...distractors]);

        return {
          id: index + 1,
          type: 'words',
          questionText: w.clean_word,
          hintOrContext: w.pawari_ex ? `प्रयोग: "${w.pawari_ex}"` : `उच्चारण: ${w.ipa || w.clean_word}`,
          correctAnswer: correct,
          options
        };
      });

      setQuestions(generated);
    }
  };

  // Initial load
  useEffect(() => {
    const startType: 'paheliyan' | 'words' = initialType === 'words' ? 'words' : 'paheliyan';
    generateQuestions(startType);
  }, [initialType]);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null) return; // Answered already
    setSelectedOption(option);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: option }));

    if (option === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const saveQuizRecord = (nameStr?: string, distStr?: string) => {
    try {
      const existing: QuizRecord[] = JSON.parse(localStorage.getItem('pawari_quiz_records') || '[]');
      const certId = score >= 7 ? `PWR-${quizType === 'paheliyan' ? 'PAH' : 'WRD'}-${Math.floor(100000 + Math.random() * 900000)}` : undefined;
      
      const newRecord: QuizRecord = {
        id: `rec_${Date.now()}`,
        name: (nameStr || candidateName).trim() || 'परीक्षार्थी',
        district: (distStr || candidateDistrict).trim() || 'सतपुड़ा अंचल',
        quizType,
        score,
        totalQuestions: 10,
        percentage: Math.round((score / 10) * 100),
        status: score >= 7 ? 'उत्तीर्ण (Passed)' : 'प्रयासरत (Failed)',
        certificateId: certId,
        date: new Date().toLocaleString('hi-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timestamp: Date.now()
      };

      // Filter out duplicate identical recent record if any
      const updated = [newRecord, ...existing.filter(r => r.id !== newRecord.id)];
      localStorage.setItem('pawari_quiz_records', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save quiz record', err);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      // Auto save attempt record
      saveQuizRecord();
    }
  };

  const handleGenerateCertificate = () => {
    if (!candidateName.trim()) return;
    saveQuizRecord(candidateName, candidateDistrict);
    setShowCertificate(true);
  };

  const percentage = Math.round((score / 10) * 100);
  const isPassed = score >= 5; // 50%+ score requirement (5 out of 10)

  if (showCertificate) {
    return (
      <Certificate
        userName={candidateName}
        userDistrict={candidateDistrict}
        candidatePhoto={candidatePhoto}
        score={score}
        totalQuestions={10}
        quizType={quizType}
        onRestart={() => generateQuestions(quizType)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Quiz Top Mode Switcher Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-amber-50 p-4 rounded-2xl shadow-lg border border-amber-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100">
              पँवारी (भोयरी) ई-क्विज़ अभ्यास
            </h2>
            <p className="text-xs text-amber-300">
              70% (7/10) या उससे अधिक अंक प्राप्त करने पर आपको ई-प्रमाण-पत्र मिलेगा!
            </p>
          </div>
        </div>

        {/* Separate Quiz Mode Buttons */}
        <div className="flex items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-amber-700/50">
          <button
            onClick={() => generateQuestions('paheliyan')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              quizType === 'paheliyan'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-200 hover:text-white hover:bg-stone-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>🧩 10 पहेलियाँ क्विज़</span>
          </button>

          <button
            onClick={() => generateQuestions('words')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              quizType === 'words'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-200 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>📖 10 शब्दकोश क्विज़</span>
          </button>
        </div>
      </div>

      {/* QUIZ IN PROGRESS VIEW */}
      {!quizFinished && currentQ && (
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200/80 p-6 sm:p-8 space-y-6">
          
          {/* Header Progress Line */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                {quizType === 'paheliyan' ? 'पँवारी लोक-पहेलियाँ परीक्षा' : 'पँवारी शब्दकोश (शब्द-अर्थ) परीक्षा'}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                प्रश्न {currentIdx + 1} / 10
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-600" />
              <span>स्कोर: {score} / {currentIdx + (selectedOption !== null ? 1 : 0)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-700 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
            ></div>
          </div>

          {/* Question Display Card */}
          <div className="bg-gradient-to-br from-amber-50/90 via-stone-50 to-amber-100/50 p-6 sm:p-8 rounded-2xl border border-amber-200/80 text-center space-y-3 shadow-inner">
            {currentQ.hintOrContext && (
              <span className="inline-block text-xs font-semibold bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                {currentQ.hintOrContext}
              </span>
            )}

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-relaxed">
              {quizType === 'words' ? (
                <span>
                  पँवारी शब्द <span className="text-amber-800 underline decoration-amber-400">"{currentQ.questionText}"</span> का सही हिंदी अर्थ क्या है?
                </span>
              ) : (
                <span>"{currentQ.questionText}"</span>
              )}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              सही विकल्प चुनें (Choose the correct option):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, oIdx) => {
                let btnStyle = "bg-stone-50 hover:bg-amber-50 text-stone-900 border-stone-200 hover:border-amber-400";
                
                if (selectedOption !== null) {
                  if (opt === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-100 text-emerald-950 border-emerald-500 font-bold shadow-md ring-2 ring-emerald-400";
                  } else if (opt === selectedOption && opt !== currentQ.correctAnswer) {
                    btnStyle = "bg-rose-100 text-rose-950 border-rose-400 font-semibold opacity-80";
                  } else {
                    btnStyle = "bg-stone-100 text-stone-400 border-stone-200 opacity-50";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-xl text-left border text-sm sm:text-base font-serif transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white/80 border border-stone-300 text-stone-700 text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1 leading-normal">{opt}</span>

                    {selectedOption !== null && opt === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {selectedOption !== null && opt === selectedOption && opt !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action / Next Button */}
          {selectedOption !== null && (
            <div className="pt-4 border-t border-stone-200 flex justify-end animate-in fade-in duration-200">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{currentIdx < 9 ? 'अगला प्रश्न' : 'परिणाम देखें (View Result)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* QUIZ FINISHED / RESULTS VIEW */}
      {quizFinished && (
        <div className="bg-white rounded-2xl shadow-xl border border-amber-300 p-6 sm:p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
          
          {/* Badge & Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-800 shadow-lg">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900">
              क्विज़ समाप्त! (Quiz Complete)
            </h2>

            <p className="text-sm text-stone-600 max-w-md mx-auto">
              आपने 10 में से <strong className="text-amber-800 font-bold">{score}</strong> प्रश्नों के सही उत्तर दिए हैं।
            </p>
          </div>

          {/* Score Circle Card */}
          <div className="max-w-xs mx-auto p-6 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-2xl border border-amber-300 space-y-2">
            <div className="text-xs font-bold uppercase text-amber-800 tracking-wider">
              आपका अंतिम अंक (Score):
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-amber-950 font-serif">
              {percentage}%
            </div>
            <div className="text-xs font-bold text-stone-700">
              ({score} / 10 सही उत्तर)
            </div>
          </div>

          {/* QUALIFIED (70%+) FOR CERTIFICATE */}
          {isPassed ? (
            <div className="bg-emerald-50 border-2 border-emerald-400 p-6 sm:p-8 rounded-2xl text-left space-y-6 max-w-lg mx-auto shadow-md">
              <div className="flex items-center gap-3 border-b border-emerald-200 pb-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-950 font-serif">
                    🎉 बधाई हो! आप प्रमाण-पत्र हेतु पात्र हैं
                  </h3>
                  <p className="text-xs text-emerald-800">
                    अपना नाम और जिला दर्ज कर आधिकारिक प्रमाण-पत्र जनरेट करें।
                  </p>
                </div>
              </div>

              {/* Form Inputs for Certificate */}
              <div className="space-y-4 font-sans text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-700" />
                    परीक्षार्थी का नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="उदा. राजेश पवार / संगीता डोंगरे"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    जिला / अंचल (District) *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateDistrict}
                    onChange={(e) => setCandidateDistrict(e.target.value)}
                    placeholder="उदा. बैतूल, छिंदवाड़ा, पांढुर्णा, नागपुर, वर्धा, अमरावती..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-700" />
                      परीक्षार्थी की फोटो (ऐच्छिक / Optional)
                    </span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      (प्रमाण-पत्र हेतु)
                    </span>
                  </label>

                  {candidatePhoto ? (
                    <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                      <img src={candidatePhoto} alt="Candidate Preview" className="w-12 h-12 rounded-lg object-cover border border-amber-400" />
                      <div className="flex-1 text-xs">
                        <p className="font-bold text-emerald-800">फोटो सफलतापूर्वक अपलोड हुई!</p>
                        <p className="text-stone-500 text-[11px]">यह फोटो आपके प्रमाण-पत्र पर प्रदर्शित होगी।</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCandidatePhoto(null)}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
                        title="फोटो हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                    />
                  )}
                </div>

                <button
                  disabled={!candidateName.trim()}
                  onClick={handleGenerateCertificate}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Award className="w-5 h-5 text-amber-300" />
                  <span>प्रमाण-पत्र प्राप्त एवं डाउनलोड करें (Generate Certificate)</span>
                </button>
              </div>
            </div>
          ) : (
            /* NOT QUALIFIED (<70%) */
            <div className="bg-amber-50 border border-amber-300 p-6 rounded-2xl text-stone-800 space-y-4 max-w-lg mx-auto">
              <p className="text-sm font-semibold text-amber-950">
                प्रमाण-पत्र (Certificate) प्राप्त करने के लिए न्यूनतम <strong>70% (7/10 अंक)</strong> प्राप्त करना आवश्यक है।
              </p>
              <p className="text-xs text-stone-600">
                घबराएं नहीं! आप शब्दकोश या पहेलियाँ का पुनः अभ्यास कर तुरंत नया क्विज़ दे सकते हैं।
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => generateQuestions(quizType)}
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> पुनः प्रयास करें (Retry Quiz)
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => generateQuestions('paheliyan')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 cursor-pointer"
            >
              🧩 पहेलियाँ क्विज़ खेलें
            </button>
            <button
              onClick={() => generateQuestions('words')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 cursor-pointer"
            >
              📖 शब्दकोश क्विज़ खेलें
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
