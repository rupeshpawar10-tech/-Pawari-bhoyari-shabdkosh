import React, { useState } from 'react';
import { 
  BookOpen, Search, FileText, Download, Send, User, Users, Mail, Eye, X, Edit3, Award, Sparkles, Phone, MapPin, Calendar, Clock, PlusCircle, ExternalLink, Link, Copy, Check, Globe, Trash2
} from 'lucide-react';
import { SiteSettings, PatrikaArticle, SansthanOfficial } from '../types';

interface PatrikaSectionProps {
  siteSettings: SiteSettings;
  patrikaArticles: PatrikaArticle[];
  sansthanOfficials?: SansthanOfficial[];
  isAdminAuthenticated: boolean;
  onOpenAdminTab: (tab: 'patrikaCms' | 'shodhSansthanCms') => void;
  onOpenSuggestionModal: () => void;
  onDeletePatrikaArticle?: (id: string, title?: string) => void;
  onEditPatrikaArticle?: (article: PatrikaArticle) => void;
}

export const PatrikaSection: React.FC<PatrikaSectionProps> = ({
  siteSettings,
  patrikaArticles,
  sansthanOfficials = [],
  isAdminAuthenticated,
  onOpenAdminTab,
  onOpenSuggestionModal,
  onDeletePatrikaArticle,
  onEditPatrikaArticle,
}) => {
  const [patrikaSearchTerm, setPatrikaSearchTerm] = useState('');
  const [selectedPatrikaCategory, setSelectedPatrikaCategory] = useState('सब');
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<PatrikaArticle | null>(null);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedArticleId(id);
    setTimeout(() => setCopiedArticleId(null), 2500);
  };

  // Sansthan Officials state
  const [officialSearchTerm, setOfficialSearchTerm] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('सब');

  // Extract unique time periods from officials
  const timePeriods = Array.from(
    new Set(sansthanOfficials.map(o => o.timePeriod).filter(Boolean))
  );

  const filteredArticles = patrikaArticles
    .filter(a => selectedPatrikaCategory === 'सब' || a.category === selectedPatrikaCategory)
    .filter(a => !patrikaSearchTerm || a.title.includes(patrikaSearchTerm) || a.author.includes(patrikaSearchTerm) || a.summary.includes(patrikaSearchTerm));

  const filteredOfficials = sansthanOfficials
    .filter(o => selectedTimePeriod === 'सब' || o.timePeriod === selectedTimePeriod)
    .filter(o => !officialSearchTerm || 
      o.name.toLowerCase().includes(officialSearchTerm.toLowerCase()) || 
      o.designation.toLowerCase().includes(officialSearchTerm.toLowerCase()) ||
      (o.location && o.location.toLowerCase().includes(officialSearchTerm.toLowerCase())) ||
      (o.timePeriod && o.timePeriod.toLowerCase().includes(officialSearchTerm.toLowerCase()))
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-amber-800/60 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {siteSettings.shodhSansthanOrg || "सतपुड़ा संस्कृति संस्थान एवं माँ ताप्ती शोध संस्थान मुलताई"}
              </span>
              {siteSettings.patrikaRegistration && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-stone-800/80 text-amber-200 border border-stone-700">
                  {siteSettings.patrikaRegistration}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-amber-100 tracking-tight leading-tight">
              {siteSettings.patrikaTitle || "पँवारी शोध पत्रिका (Pawari Research Journal)"}
            </h1>

            <p className="text-sm sm:text-base font-bold text-amber-300 font-serif">
              📖 {siteSettings.patrikaVolume || "वर्ष 12, अंक 4 (सतपुड़ा संस्कृति व भाषा विशेषांक)"}
            </p>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              {siteSettings.patrikaDescription || "सतपुड़ा अंचल की प्राचीन पँवारी (भोयरी) बोली, लोक-साहित्य, इतिहास एवं धरोहर के प्रलेखीकरण तथा शोध हेतु समर्पित त्रैमासिक शोध पत्रिका।"}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {siteSettings.patrikaPdfUrl && (
                <a
                  href={siteSettings.patrikaPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ई-पत्रिका डाउनलोड करें (PDF)</span>
                </a>
              )}

              <button
                onClick={onOpenSuggestionModal}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs sm:text-sm rounded-xl border border-stone-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>शोध आलेख व रचना भेजें</span>
              </button>

              {isAdminAuthenticated && (
                <button
                  onClick={() => onOpenAdminTab('patrikaCms')}
                  className="px-3 py-2 bg-stone-950 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl border border-amber-600/60 transition flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>पत्रिका CMS संपादक</span>
                </button>
              )}
            </div>
          </div>

          {/* Cover Image Preview */}
          <div className="shrink-0 w-36 sm:w-48 h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-amber-600/60 shadow-2xl bg-stone-950 relative group">
            <img 
              src={siteSettings.patrikaCoverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
              alt="Patrika Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent p-3 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">मुद्रित ई-संस्करण</span>
              <span className="text-xs font-serif font-bold text-amber-100">पँवारी शोध पत्रिका</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SANSTHAN OFFICIALS & BOARD DETAILS WITH TIME PERIOD FILTER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-serif font-bold text-stone-900">
                माँ ताप्ती शोध संस्थान व संपादकीय मंडल विवरण ({filteredOfficials.length})
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              संस्थान के सभी पदाधिकारियों, संपादकों व शोधकर्ताओं का कार्यकाल (Time Period) एवं विवरण
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={officialSearchTerm}
                onChange={(e) => setOfficialSearchTerm(e.target.value)}
                placeholder="नाम, पद या कार्यकाल खोजें..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Time Period Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span className="text-[11px] font-bold text-amber-900">कार्यकाल:</span>
              <select
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
              >
                <option value="सब">सभी समय अवधि (All Periods)</option>
                {timePeriods.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Edit Link */}
            {isAdminAuthenticated && (
              <button
                onClick={() => onOpenAdminTab('shodhSansthanCms')}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>संस्थान CMS (जोड़ें / बदलें)</span>
              </button>
            )}
          </div>
        </div>

        {/* Officials Grid */}
        {filteredOfficials.length === 0 ? (
          <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
            कोई पदाधिकारी या सदस्य प्राप्त नहीं हुआ।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOfficials.map((off) => (
              <div
                key={off.id}
                className="bg-stone-50 hover:bg-amber-50/40 rounded-2xl p-5 border border-stone-200 hover:border-amber-400 transition space-y-3 flex flex-col justify-between shadow-sm relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{off.name}</span>
                      </h3>
                      <p className="text-xs font-bold text-stone-700 mt-0.5">{off.designation}</p>
                    </div>

                    {/* Time Period Badge */}
                    <span className="shrink-0 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>{off.timePeriod}</span>
                    </span>
                  </div>

                  {off.bio && (
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed pt-1">
                      {off.bio}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-600 space-y-1 font-medium">
                  {off.location && (
                    <p className="flex items-center gap-1.5 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{off.location}</span>
                    </p>
                  )}
                  {off.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <a href={`tel:${off.phone}`} className="font-mono text-stone-800 hover:underline">{off.phone}</a>
                    </p>
                  )}
                  {off.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <a href={`mailto:${off.email}`} className="text-amber-800 hover:underline truncate">{off.email}</a>
                    </p>
                  )}
                </div>

                {isAdminAuthenticated && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onOpenAdminTab('shodhSansthanCms')}
                      className="text-[10px] font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> CMS में संपादित करें
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PUBLISHED RESEARCH ARTICLES GRID */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-serif font-bold text-stone-900">
                प्रकाशित शोध आलेख एवं साहित्य संकलन ({patrikaArticles.length})
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              पँवारी बोली, लोक-गीत, इतिहास, मुहावरे एवं संस्कृति पर विद्वानों व शोधार्थियों के स्वीकृत शोध पत्र
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={patrikaSearchTerm}
                onChange={(e) => setPatrikaSearchTerm(e.target.value)}
                placeholder="आलेख या लेखक खोजें..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedPatrikaCategory}
              onChange={(e) => setSelectedPatrikaCategory(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-700 focus:outline-none"
            >
              <option value="सब">सभी विषय व कालखंड (All Categories & Periods)</option>
              <option value="भाषा व व्याकरण शोध">भाषा व व्याकरण शोध</option>
              <option value="इतिहास एवं लोक-संस्कृति">इतिहास एवं लोक-संस्कृति</option>
              <option value="लोक-साहित्य">लोक-साहित्य</option>
              <option value="लोक-संगीत">लोक-संगीत</option>
              <option value="विशेषांक / पत्रिका अंक">विशेषांक / पत्रिका अंक</option>
              <option value="लोक-कथा एवं पहेलियाँ">लोक-कथा एवं पहेलियाँ</option>
              <option value="शब्दकोश व शब्दावली शोध">शब्दकोश व शब्दावली शोध</option>
              <option value="समीक्षा व परिचर्चा">समीक्षा व परिचर्चा</option>
            </select>
          </div>
        </div>

        {/* Articles List Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
            <FileText className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="font-bold text-sm text-stone-700">कोई शोध आलेख प्राप्त नहीं हुआ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article, idx) => {
              const effectivePdfUrl = (article.pdfUrl && article.pdfUrl !== '#') ? article.pdfUrl : (siteSettings.patrikaPdfUrl || 'https://pawari-research.org/pdf/sample_article.pdf');
              const effectiveArticleUrl = article.articleUrl || `https://pawari-research.org/article/${article.id || idx}`;

              return (
                <div
                  key={article.id || `art_${idx}`}
                  className="bg-stone-50 hover:bg-amber-50/30 rounded-2xl p-5 sm:p-6 border border-stone-200 hover:border-amber-400 transition space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {article.category}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {article.date} • {article.readTime || '5 मिनट'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                      "{article.title}"
                    </h3>

                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      ✍️ {article.author}
                    </p>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>

                    {/* URL Link Box */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between gap-2 p-2 bg-stone-100 rounded-xl border border-stone-200 text-[11px] font-mono text-stone-600">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <Link className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="truncate font-medium text-stone-700">{effectiveArticleUrl}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyUrl(effectiveArticleUrl, article.id)}
                          className="shrink-0 px-2 py-0.5 bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 rounded font-sans font-bold text-[10px] cursor-pointer flex items-center gap-1 transition"
                          title="URL कॉपी करें"
                        >
                          {copiedArticleId === article.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">कॉपी हुआ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-stone-500" />
                              <span>कॉपी</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/90 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedArticleDetail(article)}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>सार पढ़ें</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* PDF Download Button */}
                      <a
                        href={effectivePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                        title="PDF फ़ाइल डाउनलोड करें"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF डाउनलोड</span>
                      </a>

                      {/* Direct URL Link Button */}
                      <a
                        href={effectiveArticleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="वेबसाइट पर डायरेक्ट आर्टिकल खोलें"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-800" />
                        <span>URL लिंक</span>
                      </a>

                      {isAdminAuthenticated && (
                        <>
                          {onEditPatrikaArticle && (
                            <button
                              type="button"
                              onClick={() => onEditPatrikaArticle(article)}
                              className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="आलेख संपादित करें"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                              <span>संपादित करें</span>
                            </button>
                          )}
                          {onDeletePatrikaArticle && (
                            <button
                              type="button"
                              onClick={() => onDeletePatrikaArticle(article.id, article.title)}
                              className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="आलेख हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                              <span>हटाएं</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SUBMISSION GUIDELINES FOR WRITERS */}
      <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-300 space-y-4">
        <div className="flex items-center gap-2 text-amber-900">
          <Award className="w-6 h-6 text-amber-800" />
          <h3 className="text-lg font-serif font-bold">
            रचनाकारों एवं शोधार्थियों हेतु दिशा-निर्देश (Submission Guidelines)
          </h3>
        </div>

        <div className="whitespace-pre-line text-xs sm:text-sm text-stone-800 font-medium leading-relaxed bg-white/90 p-5 rounded-2xl border border-amber-200 shadow-inner">
          {siteSettings.patrikaSubmissionGuidelines || `1. शोध आलेख/रचनाएँ पँवारी बोली, लोक-साहित्य, लोक-संगीत, मुहावरे या सतपुड़ा के इतिहास से संबंधित होनी चाहिए।\n2. आलेख देवनागरी लिपि में 500 से 2500 शब्दों में भेजें।\n3. मौलिकता का घोषणा-पत्र साथ में संलग्न करना अनिवार्य है।\n4. स्वीकृत आलेखों को आगामी शोध अंक में स्थान दिया जाएगा।`}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-xs text-stone-600 font-medium">
            अपनी रचनाएँ सीधे आधिकारिक ईमेल <strong className="text-amber-900 font-bold">{siteSettings.patrikaContactEmail || 'rupeshpawar10@gmail.com'}</strong> पर भेजें।
          </p>

          <button
            onClick={onOpenSuggestionModal}
            className="px-5 py-2.5 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> रचना ऑनलाइन प्रेषित करें
          </button>
        </div>
      </div>

      {/* PATRIKA ARTICLE DETAIL MODAL */}
      {selectedArticleDetail && (() => {
        const modalPdfUrl = (selectedArticleDetail.pdfUrl && selectedArticleDetail.pdfUrl !== '#') ? selectedArticleDetail.pdfUrl : (siteSettings.patrikaPdfUrl || 'https://pawari-research.org/pdf/sample_article.pdf');
        const modalArticleUrl = selectedArticleDetail.articleUrl || `https://pawari-research.org/article/${selectedArticleDetail.id}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedArticleDetail.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100">
                    {selectedArticleDetail.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-medium">
                    ✍️ {selectedArticleDetail.author} • {selectedArticleDetail.date}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedArticleDetail(null)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-950">आलेख सार (Executive Summary)</h4>
                  <p className="text-stone-700 font-serif text-sm leading-relaxed">
                    {selectedArticleDetail.summary}
                  </p>
                </div>

                {/* PDF & URL details box */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-700" />
                    डिजिटल प्रकाशन एवं लिंक विवरण (PDF & Article URL)
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium block">📄 PDF डाउनलोड लिंक (PDF URL):</span>
                      <a href={modalPdfUrl} target="_blank" rel="noreferrer" className="font-mono text-amber-800 hover:underline break-all font-semibold">
                        {modalPdfUrl}
                      </a>
                    </div>

                    <div>
                      <span className="text-stone-500 font-medium block">🔗 वेब आर्टिकल URL लिंक (Web Link):</span>
                      <a href={modalArticleUrl} target="_blank" rel="noreferrer" className="font-mono text-amber-800 hover:underline break-all font-semibold">
                        {modalArticleUrl}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-200 pt-3">
                  <h4 className="font-bold text-stone-900 text-xs">प्रकाशन एवं संदर्भ विवरण</h4>
                  <p className="text-xs text-stone-600">
                    यह शोध आलेख <strong>{siteSettings.patrikaTitle || "पँवारी शोध पत्रिका"}</strong> ({siteSettings.shodhSansthanOrg || "सतपुड़ा संस्कृति संस्थान एवं माँ ताप्ती शोध संस्थान मुलताई"}) के आधिकारिक डिजिटल शोध अंक में प्रकाशित किया गया है।
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={modalPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition"
                  >
                    <Download className="w-4 h-4" /> PDF डाउनलोड करें
                  </a>

                  <a
                    href={modalArticleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition"
                  >
                    <ExternalLink className="w-4 h-4" /> URL लिंक खोलें
                  </a>

                  <button
                    onClick={() => handleCopyUrl(modalArticleUrl, selectedArticleDetail.id)}
                    className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    {copiedArticleId === selectedArticleDetail.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">URL कॉपी हुआ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-600" />
                        <span>URL कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedArticleDetail(null)}
                  className="px-4 py-2 bg-stone-200 text-stone-800 hover:bg-stone-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
