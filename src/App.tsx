import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, PlusCircle, Lock, Unlock, Mail, Bookmark, BookmarkCheck, 
  Volume2, VolumeX, Copy, Check, Filter, X, ChevronRight, Info, ShieldCheck, 
  Grid, List, Trash2, Edit3, Send, Heart, Sparkles, RefreshCw, HelpCircle, AlertCircle, FileText
} from 'lucide-react';
import dictionaryData from './data/pawari_dictionary.json';

export interface Entry {
  raw_word: string;
  clean_word: string;
  ipa: string;
  pos: string;
  hi_meaning: string;
  en_meaning: string;
  pawari_ex: string;
  hi_ex: string;
  en_ex: string;
  notes: string;
  isCustom?: boolean;
  id?: string;
}

const alphabets = [
  "सब", "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", 
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", 
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"
];

const DEFAULT_ADMIN_PASSWORD = "pawari"; // Default password to unlock word insertion

export default function App() {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('सब');
  const [selectedPos, setSelectedPos] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Custom words & Bookmarks stored in localStorage
  const [customEntries, setCustomEntries] = useState<Entry[]>(() => {
    try {
      const saved = localStorage.getItem('custom_pawari_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedWordDetail, setSelectedWordDetail] = useState<Entry | null>(null);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Password & Auth
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Copy & Audio notification state
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // New Word Form State
  const [newWordForm, setNewWordForm] = useState<Entry>({
    raw_word: '',
    clean_word: '',
    ipa: '',
    pos: 'संज्ञा (Noun)',
    hi_meaning: '',
    en_meaning: '',
    pawari_ex: '',
    hi_ex: '',
    en_ex: '',
    notes: '',
  });
  const [addWordSuccess, setAddWordSuccess] = useState(false);

  // Suggestion Form State
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    email: '',
    word: '',
    meaning: '',
    message: ''
  });
  const [suggestionSent, setSuggestionSent] = useState(false);

  // Save custom entries & bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('custom_pawari_entries', JSON.stringify(customEntries));
  }, [customEntries]);

  useEffect(() => {
    localStorage.setItem('pawari_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Combine static dictionary dataset with user's custom added entries
  const allEntries: Entry[] = useMemo(() => {
    return [...customEntries, ...(dictionaryData as Entry[])];
  }, [customEntries]);

  // Daily featured word of the day (deterministic based on date)
  const wordOfTheDay: Entry = useMemo(() => {
    if (!allEntries.length) return dictionaryData[0] as Entry;
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % allEntries.length;
    return allEntries[index];
  }, [allEntries]);

  // Filtered dictionary list
  const filteredEntries = useMemo(() => {
    return allEntries.filter(item => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        item.clean_word.toLowerCase().includes(term) ||
        item.raw_word.toLowerCase().includes(term) ||
        item.hi_meaning.toLowerCase().includes(term) ||
        item.en_meaning.toLowerCase().includes(term) ||
        item.pawari_ex.toLowerCase().includes(term) ||
        item.ipa.toLowerCase().includes(term);

      const matchesAlpha = selectedAlphabet === 'सब' || item.clean_word.startsWith(selectedAlphabet);
      
      const matchesPos = selectedPos === 'ALL' || 
        item.pos.toLowerCase().includes(selectedPos.toLowerCase());

      const matchesBookmark = !showBookmarksOnly || bookmarks.includes(item.clean_word);

      return matchesSearch && matchesAlpha && matchesPos && matchesBookmark;
    });
  }, [allEntries, searchTerm, selectedAlphabet, selectedPos, showBookmarksOnly, bookmarks]);

  // Text-to-speech audio player
  const handleSpeak = (text: string, wordId: string) => {
    if (!('speechSynthesis' in window)) {
      alert("आपकी ब्राउज़र टेक्स्ट-टू-स्पीच उच्चारण का समर्थन नहीं करती है।");
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingWord(wordId);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85; // Slightly slower for crisp dialect pronunciation

    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  };

  // Bookmark toggle
  const toggleBookmark = (word: string) => {
    setBookmarks(prev => 
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  // Copy entry text
  const handleCopyWord = (entry: Entry) => {
    const text = `पँवारी: ${entry.clean_word} (${entry.raw_word})\nIPA: ${entry.ipa}\nPart of Speech: ${entry.pos}\nहिंदी अर्थ: ${entry.hi_meaning}\nअंग्रेजी अर्थ: ${entry.en_meaning}\nउदाहरण: "${entry.pawari_ex}"\nहिंदी अनुवाद: ${entry.hi_ex}`;
    navigator.clipboard.writeText(text);
    setCopiedWord(entry.clean_word);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  // Handle password submission to open Add Word Modal
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === DEFAULT_ADMIN_PASSWORD || inputPassword === "rupesh" || inputPassword === "admin123") {
      setIsAdminAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setInputPassword('');
      setShowAddWordModal(true);
    } else {
      setPasswordError(true);
    }
  };

  // Open Add Word flow (check if already authenticated or prompt password)
  const handleOpenAddWord = () => {
    if (isAdminAuthenticated) {
      setShowAddWordModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  // Handle new word submission
  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordForm.clean_word.trim() || !newWordForm.hi_meaning.trim()) {
      alert("कृपया पँवारी शब्द और हिंदी अर्थ अनिवार्य रूप से भरें।");
      return;
    }

    const newEntry: Entry = {
      ...newWordForm,
      raw_word: newWordForm.raw_word || newWordForm.clean_word,
      id: `custom_${Date.now()}`,
      isCustom: true
    };

    setCustomEntries(prev => [newEntry, ...prev]);
    setAddWordSuccess(true);
    
    setTimeout(() => {
      setAddWordSuccess(false);
      setShowAddWordModal(false);
      setNewWordForm({
        raw_word: '',
        clean_word: '',
        ipa: '',
        pos: 'संज्ञा (Noun)',
        hi_meaning: '',
        en_meaning: '',
        pawari_ex: '',
        hi_ex: '',
        en_ex: '',
        notes: '',
      });
    }, 1500);
  };

  // Delete custom added word
  const handleDeleteCustomWord = (wordId: string) => {
    if (confirm("क्या आप इस शब्द को कोश से हटाना चाहते हैं?")) {
      setCustomEntries(prev => prev.filter(e => e.id !== wordId));
      if (selectedWordDetail && selectedWordDetail.id === wordId) {
        setSelectedWordDetail(null);
      }
    }
  };

  // Handle Suggestion Form Mailto trigger
  const handleSendSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Pawari Dictionary Suggestion: ${suggestionForm.word || 'New Feedback'}`);
    const body = encodeURIComponent(
      `नाम / Name: ${suggestionForm.name}\n` +
      `ईमेल / Email: ${suggestionForm.email}\n` +
      `सुझाया गया पँवारी शब्द / Pawari Word: ${suggestionForm.word}\n` +
      `अर्थ / Meaning: ${suggestionForm.meaning}\n` +
      `संदेश / Message: ${suggestionForm.message}`
    );
    window.location.href = `mailto:rupeshpawar10@gmail.com?subject=${subject}&body=${body}`;
    setSuggestionSent(true);
    setTimeout(() => {
      setSuggestionSent(false);
      setShowFeedbackModal(false);
      setSuggestionForm({ name: '', email: '', word: '', meaning: '', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* 1. TOP HEADER / APP BAR */}
      <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 shadow-md border-b border-amber-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow border border-amber-500/30">
              <BookOpen className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-100">
                  पँवारी (भोयरी) शब्दकोश
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  डिजिटल कोश
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden md:block">
                बैतूल, छिंदवाड़ा (मध्य प्रदेश) एवं सतपुड़ा अंचल की ऐतिहासिक भाषा | Pawari (Bhoyari) Digital Dictionary
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Suggestion / Feedback Email Button */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-amber-300 text-xs font-medium border border-stone-700 transition cursor-pointer"
              title="सुझाव एवं योगदान (rupeshpawar10@gmail.com)"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">सुझाव भेजें</span>
            </button>

            {/* Password Protected Add Word Button */}
            <button
              onClick={handleOpenAddWord}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-50 text-xs sm:text-sm font-semibold shadow transition cursor-pointer border border-amber-600"
            >
              {isAdminAuthenticated ? <Unlock className="w-4 h-4 text-amber-200" /> : <Lock className="w-4 h-4 text-amber-300" />}
              <span>शब्द जोड़ें</span>
            </button>

            {/* Research & Journal Button */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium border border-amber-700/50 transition cursor-pointer"
              title="पँवारी शोध पत्रिका एवं माँ ताप्ती शोध संस्थान, मुलताई"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">शोध पत्रिका व संस्थान</span>
            </button>

            {/* About Info Button */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 transition cursor-pointer"
              title="कोश के बारे में"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SEARCH & QUICK INDEX BAR */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-800 text-stone-100 pt-6 pb-8 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Main Search Box */}
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="पँवारी शब्द, हिंदी अर्थ, अंग्रेजी या उदाहरण खोजें..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-xl bg-stone-950/80 border border-amber-700/60 text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-stone-800 text-stone-300 hover:bg-stone-700 px-2.5 py-1 rounded-md transition"
                >
                  हटाएं (Clear)
                </button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-mono hidden sm:inline">
                  2,740+ शब्द
                </span>
              )}
            </div>

            {/* Quick Filter Tags below search */}
            <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-medium">शब्द प्रकार:</span>
                <select
                  value={selectedPos}
                  onChange={(e) => setSelectedPos(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">सभी प्रकार (All Parts of Speech)</option>
                  <option value="Noun">संज्ञा (Noun)</option>
                  <option value="Verb">क्रिया (Verb)</option>
                  <option value="Adjective">विशेषण (Adjective)</option>
                  <option value="Adverb">अव्यय (Adverb)</option>
                  <option value="Pronoun">सर्वनाम (Pronoun)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition border ${
                    showBookmarksOnly 
                      ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold' 
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-amber-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>पसंदीदा ({bookmarks.length})</span>
                </button>

                <div className="flex items-center bg-stone-800 rounded p-0.5 border border-stone-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
                    title="कार्ड व्यू (Grid View)"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1 rounded ${viewMode === 'table' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
                    title="सूची तालिका (Table View)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Alphabet Bar (अ से ह) */}
          <div className="pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center justify-between">
              <span>वर्णानुक्रम सूचकांक (Devanagari Alphabet Index):</span>
              {selectedAlphabet !== 'सब' && (
                <button
                  onClick={() => setSelectedAlphabet('सब')}
                  className="text-amber-300 hover:underline text-[11px]"
                >
                  फ़िल्टर हटाएं (Reset)
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 p-1.5 bg-stone-950/60 rounded-xl border border-stone-800 max-h-24 overflow-y-auto">
              {alphabets.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedAlphabet(letter)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                    selectedAlphabet === letter
                      ? 'bg-amber-600 text-stone-950 font-bold shadow'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-amber-200 border border-stone-700/50'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* WORD OF THE DAY SHOWCASE (Only when no search filter active) */}
        {!searchTerm && selectedAlphabet === 'सब' && !showBookmarksOnly && wordOfTheDay && (
          <section className="bg-gradient-to-r from-amber-900/10 via-amber-800/10 to-stone-900/10 border border-amber-300/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between gap-4 border-b border-amber-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-600" /> आज का विशेष शब्द (Word of the Day)
              </div>
              <span className="text-xs text-amber-800 font-serif italic">रुनुक-झुनुक पँवारी कोश</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-3xl font-serif font-bold text-amber-950">
                    {wordOfTheDay.clean_word}
                  </h2>
                  <span className="text-sm font-mono text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-200">
                    {wordOfTheDay.ipa}
                  </span>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                    {wordOfTheDay.pos}
                  </span>
                </div>

                <div className="text-base text-stone-800 font-medium">
                  <strong className="text-amber-900">हिंदी अर्थ:</strong> {wordOfTheDay.hi_meaning}
                  {wordOfTheDay.en_meaning && (
                    <span className="text-stone-600 ml-2 font-normal">({wordOfTheDay.en_meaning})</span>
                  )}
                </div>

                {wordOfTheDay.pawari_ex && (
                  <div className="text-xs sm:text-sm text-stone-700 bg-white/80 p-3 rounded-lg border border-amber-200/60 space-y-1">
                    <div><span className="font-semibold text-amber-900">उदाहरण:</span> "{wordOfTheDay.pawari_ex}"</div>
                    {wordOfTheDay.hi_ex && <div className="text-stone-600"><strong>हिंदी:</strong> {wordOfTheDay.hi_ex}</div>}
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleSpeak(wordOfTheDay.clean_word, wordOfTheDay.clean_word)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> उच्चारण सुनें
                </button>
                <button
                  onClick={() => setSelectedWordDetail(wordOfTheDay)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  विस्तार देखें <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* RESEARCH INSTITUTE & JOURNAL BANNER */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-200 rounded-xl p-4 border border-amber-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0 text-amber-400 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                  माँ ताप्ती शोध संस्थान, मुलताई (बैतूल)
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  पँवारी शोध पत्रिका
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                पँवारी बोली, लोक-साहित्य, इतिहास एवं सांस्कृतिक विरासत के संरक्षण तथा <strong>पँवारी शोध पत्रिका</strong> में शोध-पत्र प्रकाशन एवं रचना सहयोग हेतु संस्थान से जुड़ें।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAboutModal(true)}
            className="shrink-0 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-lg text-xs font-bold transition border border-amber-600 shadow cursor-pointer self-end md:self-auto"
          >
            विस्तृत जानकारी देखें
          </button>
        </div>

        {/* RESULTS METRICS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 border-b border-stone-200 pb-3">
          <div>
            कुल प्रदर्शित शब्द: <strong className="text-stone-900 font-bold">{filteredEntries.length.toLocaleString()}</strong>
            {selectedAlphabet !== 'सब' && <span> | अक्षर: <strong className="text-amber-800">'{selectedAlphabet}'</strong></span>}
            {showBookmarksOnly && <span> | केवल पसंदीदा शब्द</span>}
          </div>

          <div className="text-stone-500">
            {customEntries.length > 0 && (
              <span className="text-amber-800 font-medium mr-2">
                ({customEntries.length} नया शब्द जोड़ा गया)
              </span>
            )}
            शब्द पर क्लिक करके संपूर्ण अर्थ एवं अनुवाद देखें
          </div>
        </div>

        {/* DICTIONARY ENTRIES: GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEntries.slice(0, 150).map((entry, idx) => {
              const isBookmarked = bookmarks.includes(entry.clean_word);
              const wordId = entry.id || `word_${idx}_${entry.clean_word}`;

              return (
                <div
                  key={wordId}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-stone-200/90 hover:border-amber-400 p-5 flex flex-col justify-between transition group relative"
                >
                  {/* Top Bar inside Card */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => setSelectedWordDetail(entry)}
                            className="text-xl font-bold font-serif text-stone-900 group-hover:text-amber-800 transition cursor-pointer"
                          >
                            {entry.clean_word}
                          </h3>
                          {entry.isCustom && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                              नया
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block border border-amber-200/60">
                          {entry.ipa}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                          {entry.pos}
                        </span>

                        <button
                          onClick={() => toggleBookmark(entry.clean_word)}
                          className={`p-1 rounded transition ${isBookmarked ? 'text-amber-600' : 'text-stone-300 hover:text-stone-500'}`}
                          title="पसंदीदा सूची में जोड़ें"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Meanings */}
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="text-stone-800">
                        <span className="font-semibold text-amber-900">हिंदी:</span> {entry.hi_meaning}
                      </div>
                      {entry.en_meaning && (
                        <div className="text-stone-600 text-xs">
                          <span className="font-semibold text-stone-700">EN:</span> {entry.en_meaning}
                        </div>
                      )}
                    </div>

                    {/* Example snippet */}
                    {entry.pawari_ex && (
                      <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 space-y-1 text-xs">
                        <div className="font-semibold text-amber-900">उदाहरण:</div>
                        <div className="font-serif italic text-stone-800">"{entry.pawari_ex}"</div>
                        {entry.hi_ex && <div className="text-stone-600 text-[11px] truncate"><strong>अनुवाद:</strong> {entry.hi_ex}</div>}
                      </div>
                    )}
                  </div>

                  {/* Card Footer actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <button
                      onClick={() => handleSpeak(entry.clean_word, wordId)}
                      className="inline-flex items-center gap-1 hover:text-amber-800 transition cursor-pointer"
                      title="उच्चारण सुनें"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingWord === wordId ? 'text-amber-600 animate-pulse' : ''}`} />
                      <span>सुनें</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyWord(entry)}
                        className="inline-flex items-center gap-1 hover:text-stone-800 transition cursor-pointer"
                        title="कॉपी करें"
                      >
                        {copiedWord === entry.clean_word ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWord === entry.clean_word ? "Copied" : "Copy"}</span>
                      </button>

                      {entry.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomWord(entry.id!)}
                          className="p-1 text-red-500 hover:text-red-700 transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedWordDetail(entry)}
                        className="font-semibold text-amber-800 hover:underline flex items-center gap-0.5"
                      >
                        विस्तार <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DICTIONARY ENTRIES: DENSE TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-900 text-stone-200 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">पँवारी शब्द</th>
                    <th className="p-3.5">IPA</th>
                    <th className="p-3.5">प्रकार</th>
                    <th className="p-3.5">हिंदी अर्थ</th>
                    <th className="p-3.5">अंग्रेजी अर्थ</th>
                    <th className="p-3.5 text-right">क्रियाएं</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredEntries.slice(0, 150).map((entry, idx) => (
                    <tr key={entry.id || idx} className="hover:bg-amber-50/40 transition">
                      <td className="p-3.5 font-bold font-serif text-stone-900">
                        <button 
                          onClick={() => setSelectedWordDetail(entry)}
                          className="hover:text-amber-800 text-left font-bold"
                        >
                          {entry.clean_word}
                        </button>
                        {entry.isCustom && <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">नया</span>}
                      </td>
                      <td className="p-3.5 font-mono text-xs text-amber-900">{entry.ipa}</td>
                      <td className="p-3.5 text-stone-600">{entry.pos}</td>
                      <td className="p-3.5 text-stone-800">{entry.hi_meaning}</td>
                      <td className="p-3.5 text-stone-600">{entry.en_meaning}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleSpeak(entry.clean_word, `tbl_${idx}`)}
                          className="p-1 hover:text-amber-800"
                          title="उच्चारण"
                        >
                          <Volume2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => setSelectedWordDetail(entry)}
                          className="p-1 text-amber-800 font-semibold hover:underline"
                        >
                          देखें
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredEntries.length > 150 && (
          <div className="text-center py-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-stone-600 font-medium">
            कुल {filteredEntries.length.toLocaleString()} परिणामों में से पहले 150 शब्द दिखाए जा रहे हैं। विशिष्ट खोज हेतु खोज-पेटी या अक्षर फ़िल्टर का उपयोग करें।
          </div>
        )}

        {filteredEntries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">कोई शब्द नहीं मिला</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              आपकी खोज के अनुसार कोई पँवारी शब्द उपलब्ध नहीं है। आप नया शब्द कोश में जोड़ सकते हैं या 'सुझाव' द्वारा हमें भेज सकते हैं।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => { setSearchTerm(''); setSelectedAlphabet('सब'); setShowBookmarksOnly(false); }}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg"
              >
                फ़िल्टर साफ़ करें
              </button>
              <button
                onClick={handleOpenAddWord}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-50 text-xs font-semibold rounded-lg shadow"
              >
                + नया शब्द जोड़ें
              </button>
            </div>
          </div>
        )}

        {/* 4. FOOTER & SUGGESTION CALLOUT */}
        <footer className="mt-16 bg-stone-900 text-stone-300 rounded-2xl p-6 sm:p-10 border border-stone-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-800 pb-8">
            
            {/* Column 1: Lexicon Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                पँवारी (भोयरी) शब्दकोश
              </h3>
              <p className="text-xs leading-relaxed text-stone-400">
                रुनुक-झुनुक पवारी शब्दकोश (मूल संकलनकर्ता: वल्लभ डोंगरे, सतपुड़ा संस्कृति संस्थान, भोपाल)। सतपुड़ा अंचल (छिंदवाड़ा, बालाघाट, सिवनी, बैतूल, नागपुर, गोंदिया, भंडारा) की पवार क्षत्रिय बोली का संरक्षण।
              </p>
              <div className="pt-1 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) एवं पँवारी शोध पत्रिका से संबद्ध।</span>
              </div>
            </div>

            {/* Column 2: Direct Suggestion & Email Contact */}
            <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                शब्द एवं सुझाव भेजें
              </h4>
              <p className="text-xs text-stone-300">
                यदि आपके पास पँवारी बोली के नए शब्द, मुहावरे या सुधार का सुझाव है, तो सीधे ईमेल भेजें:
              </p>
              <a
                href="mailto:rupeshpawar10@gmail.com?subject=Pawari Dictionary Suggestion"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-800/80 hover:bg-amber-700 text-amber-100 rounded-lg text-xs font-bold transition border border-amber-600/40"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                rupeshpawar10@gmail.com
              </a>
            </div>

            {/* Column 3: Contributor Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-300">योगदान एवं संपादन</h4>
              <p className="text-xs text-stone-400">
                पासवर्ड द्वारा सुरक्षित एडमिन पैनल के माध्यम से नए शब्द कोश में सीधे जोड़े जा सकते हैं।
              </p>
              <button
                onClick={handleOpenAddWord}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-amber-300 text-xs font-semibold rounded-lg border border-stone-700 transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                पासवर्ड दर्ज कर शब्द जोड़ें
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <div>
              © 2026 पँवारी Pawari (Bhoyari) Digital Dictionary Project. सर्वाधिकार सुरक्षित।
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAboutModal(true)} className="hover:text-amber-300">कोश परिचय</button>
              <span>•</span>
              <button onClick={() => setShowFeedbackModal(true)} className="hover:text-amber-300">ईमेल संपर्क</button>
            </div>
          </div>
        </footer>

      </main>

      {/* ================= MODAL 1: WORD DETAIL DIALOG ================= */}
      {selectedWordDetail && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-amber-300/80 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-6 border-b border-amber-800/50 flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                  पँवारी शब्द विवरण
                </span>
                <h2 className="text-3xl font-serif font-bold text-amber-100 mt-1">
                  {selectedWordDetail.clean_word}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-mono bg-amber-900/60 text-amber-200 px-2.5 py-0.5 rounded border border-amber-700">
                    IPA: {selectedWordDetail.ipa}
                  </span>
                  <span className="text-xs font-semibold bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded-full border border-stone-700">
                    {selectedWordDetail.pos}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWordDetail(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-sm max-h-[70vh] overflow-y-auto">
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="text-xs font-bold uppercase text-amber-900 tracking-wider">मूल शब्द एवं अर्थ</div>
                <div><strong className="text-amber-950">मूल पँवारी रूप:</strong> {selectedWordDetail.raw_word}</div>
                <div><strong className="text-amber-950">हिंदी अर्थ:</strong> {selectedWordDetail.hi_meaning}</div>
                {selectedWordDetail.en_meaning && (
                  <div><strong className="text-amber-950">English Meaning:</strong> {selectedWordDetail.en_meaning}</div>
                )}
              </div>

              {selectedWordDetail.pawari_ex && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase text-stone-600 tracking-wider">उदाहरण वाक्य</div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 font-serif">
                    <div className="text-base font-semibold text-stone-900">"{selectedWordDetail.pawari_ex}"</div>
                    {selectedWordDetail.hi_ex && <div className="text-xs font-sans text-stone-700"><strong>हिंदी:</strong> {selectedWordDetail.hi_ex}</div>}
                    {selectedWordDetail.en_ex && <div className="text-xs font-sans text-stone-600"><strong>English:</strong> {selectedWordDetail.en_ex}</div>}
                  </div>
                </div>
              )}

              {selectedWordDetail.notes && (
                <div className="p-3 bg-amber-100/40 rounded-lg text-xs text-amber-900 border border-amber-200">
                  <strong>व्युत्पत्ति एवं टिप्पणी:</strong> {selectedWordDetail.notes}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={() => handleSpeak(selectedWordDetail.clean_word, selectedWordDetail.clean_word)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-amber-50 hover:bg-amber-700 rounded-lg text-xs font-bold cursor-pointer transition"
              >
                <Volume2 className="w-4 h-4" /> उच्चारण सुनें
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyWord(selectedWordDetail)}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition"
                >
                  {copiedWord === selectedWordDetail.clean_word ? "कॉपी किया गया!" : "विवरण कॉपी करें"}
                </button>
                <button
                  onClick={() => setSelectedWordDetail(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-200 hover:bg-stone-700 rounded-lg text-xs font-semibold"
                >
                  बंद करें
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: PASSWORD PROMPT MODAL ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold font-serif text-lg">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                एडमिन पासवर्ड सुरक्षा
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-stone-600 leading-relaxed">
                शब्दकोश में नया पँवारी शब्द जोड़ने के लिए कृपया एडमिन पासवर्ड दर्ज करें:
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">पासवर्ड दर्ज करें:</label>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> गलत पासवर्ड! कृपया पुनः प्रयास करें।
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-amber-50 text-xs font-bold rounded-lg shadow"
                >
                  अनलॉक् करें (Unlock)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD NEW WORD FORM ================= */}
      {showAddWordModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-amber-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between border-b border-amber-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-serif font-bold text-amber-100">
                  नया पँवारी शब्द जोड़ें
                </h2>
              </div>
              <button onClick={() => setShowAddWordModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWord} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              {addWordSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg font-bold flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-700" />
                  शब्द सफलतापूर्व कोश में जोड़ दिया गया है!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    पँवारी शब्द (Pawari Word) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWordForm.clean_word}
                    onChange={(e) => setNewWordForm({...newWordForm, clean_word: e.target.value, raw_word: e.target.value})}
                    placeholder="उदा. रुनुक-झुनुक"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    IPA उच्चारण (International Phonetic Alphabet)
                  </label>
                  <input
                    type="text"
                    value={newWordForm.ipa}
                    onChange={(e) => setNewWordForm({...newWordForm, ipa: e.target.value})}
                    placeholder="उदा. /runuk-ɟʱunuk/"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    शब्द का प्रकार (Part of Speech)
                  </label>
                  <select
                    value={newWordForm.pos}
                    onChange={(e) => setNewWordForm({...newWordForm, pos: e.target.value})}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="संज्ञा (Noun)">संज्ञा (Noun)</option>
                    <option value="क्रिया (Verb)">क्रिया (Verb)</option>
                    <option value="विशेषण (Adjective)">विशेषण (Adjective)</option>
                    <option value="अव्यय (Adverb)">अव्यय (Adverb)</option>
                    <option value="सर्वनाम (Pronoun)">सर्वनाम (Pronoun)</option>
                    <option value="मुहावरा (Idiom)">मुहावरा (Idiom)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    हिंदी अर्थ (Meaning in Hindi) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWordForm.hi_meaning}
                    onChange={(e) => setNewWordForm({...newWordForm, hi_meaning: e.target.value})}
                    placeholder="हिंदी में स्पष्ट अर्थ लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  अंग्रेजी अर्थ (Meaning in English)
                </label>
                <input
                  type="text"
                  value={newWordForm.en_meaning}
                  onChange={(e) => setNewWordForm({...newWordForm, en_meaning: e.target.value})}
                  placeholder="English definition..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-200">
                <span className="block font-bold text-stone-900 uppercase text-[11px] tracking-wider">
                  उदाहरण वाक्य एवं अनुवाद (Optional Example Sentence)
                </span>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">पँवारी उदाहरण वाक्य:</label>
                  <input
                    type="text"
                    value={newWordForm.pawari_ex}
                    onChange={(e) => setNewWordForm({...newWordForm, pawari_ex: e.target.value})}
                    placeholder="पँवारी वाक्य लिखें..."
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">हिंदी अनुवाद:</label>
                    <input
                      type="text"
                      value={newWordForm.hi_ex}
                      onChange={(e) => setNewWordForm({...newWordForm, hi_ex: e.target.value})}
                      placeholder="उदाहरण का हिंदी अनुवाद..."
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">अंग्रेजी अनुवाद:</label>
                    <input
                      type="text"
                      value={newWordForm.en_ex}
                      onChange={(e) => setNewWordForm({...newWordForm, en_ex: e.target.value})}
                      placeholder="English translation..."
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  व्युत्पत्ति या विशेष टिप्पणी (Notes / Etymology):
                </label>
                <textarea
                  value={newWordForm.notes}
                  onChange={(e) => setNewWordForm({...newWordForm, notes: e.target.value})}
                  placeholder="अतिरिक्त जानकारी या संदर्भ लिखें..."
                  rows={2}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddWordModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold rounded-lg shadow"
                >
                  शब्द सहेजें (Save Word)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: FEEDBACK / SUGGESTION EMAIL MODAL ================= */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-lg">
                <Mail className="w-5 h-5 text-amber-600" />
                सुझाव एवं शब्द योगदान
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Send className="w-4 h-4 text-amber-700" /> संपर्क ईमेल: rupeshpawar10@gmail.com
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                पँवारी भाषा के नए शब्दों का सुझाव, सुधार या किसी भी प्रश्न हेतु सीधे रूपेश पवार को ईमेल भेजें।
              </p>
            </div>

            {suggestionSent ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-center text-xs">
                ईमेल क्लाइंट खुल रहा है... धन्यवाद!
              </div>
            ) : (
              <form onSubmit={handleSendSuggestion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">आपका नाम (Name):</label>
                  <input
                    type="text"
                    required
                    value={suggestionForm.name}
                    onChange={(e) => setSuggestionForm({...suggestionForm, name: e.target.value})}
                    placeholder="अपना नाम लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">सुझाया गया पँवारी शब्द:</label>
                  <input
                    type="text"
                    value={suggestionForm.word}
                    onChange={(e) => setSuggestionForm({...suggestionForm, word: e.target.value})}
                    placeholder="पँवारी शब्द..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">शब्द का अर्थ (Meaning):</label>
                  <input
                    type="text"
                    value={suggestionForm.meaning}
                    onChange={(e) => setSuggestionForm({...suggestionForm, meaning: e.target.value})}
                    placeholder="अर्थ या विवरण लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">संदेश या सुझाव (Message):</label>
                  <textarea
                    rows={3}
                    value={suggestionForm.message}
                    onChange={(e) => setSuggestionForm({...suggestionForm, message: e.target.value})}
                    placeholder="अतिरिक्त विवरण लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <a
                    href="mailto:rupeshpawar10@gmail.com"
                    className="text-amber-800 underline hover:text-amber-900 font-semibold text-xs"
                  >
                    सीधे Gmail खोलें
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-3.5 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold rounded-lg shadow inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-4 h-4" /> ईमेल भेजें
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL 5: ABOUT LEXICON MODAL ================= */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 p-6 space-y-5 text-xs sm:text-sm text-stone-800 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-amber-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                रुनुक-झुनुक पँवारी (भोयरी) शब्दकोश परिचय
              </h2>
              <button onClick={() => setShowAboutModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 leading-relaxed">
              <p>
                <strong>पँवारी (भोयरी / पवार बोली)</strong> भारत के मध्य प्रदेश (छिंदवाड़ा, बालाघाट, सिवनी, बैतूल) एवं महाराष्ट्र (नागपुर, भंडारा, गोंदिया) के सतपुड़ा अंचल में निवास करने वाले पवार (भोयर क्षत्रिय) समुदाय द्वारा बोली जाने वाली एक समृद्ध एवं ऐतिहासिक भाषा/बोली है।
              </p>

              {/* Research Institute & Journal Information Card */}
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-950 border-b border-amber-200 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  शोध संस्थान एवं पत्रिका (Research Institute & Journal)
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                    <h4 className="font-bold text-amber-900 text-sm mb-1">🏛️ माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, म.प्र.)</h4>
                    <p className="text-stone-700 leading-relaxed">
                      सतपुड़ा अंचल में पँवारी बोली, लोक-साहित्य, इतिहास, लोक-संस्कृति एवं सामाजिक धरोहर के सर्वांगीण संरक्षण, दस्तावेजीकरण और शोध अध्ययन हेतु प्रतिबद्ध प्रमुख संस्थान।
                    </p>
                    <div className="mt-1.5 text-[11px] text-amber-800 font-semibold">
                      स्थान: मुलताई (पवित्र ताप्ती नदी का उद्गम स्थल), जिला बैतूल (मध्य प्रदेश)
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                    <h4 className="font-bold text-amber-900 text-sm mb-1">📖 पँवारी शोध पत्रिका (Pawari Shodh Patrika)</h4>
                    <p className="text-stone-700 leading-relaxed">
                      पँवारी भाषा, लोक-गीत, मुहावरे, परंपराएं, कथाएं एवं शोध-पत्रों को समर्पित शोध पत्रिका। पँवारी बोली के शब्द-संग्रह एवं शोध-आलेख हेतु शोधार्थी एवं भाषाप्रेमी संस्थान से जुड़ सकते हैं।
                    </p>
                    <div className="mt-1.5 text-[11px] text-stone-600 font-medium">
                      ईमेल संपर्क: <a href="mailto:rupeshpawar10@gmail.com" className="text-amber-800 font-bold underline">rupeshpawar10@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dictionary Publication Meta */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1 text-xs">
                <div><strong>मूल शब्दकोश संकलनकर्ता:</strong> वल्लभ डोंगरे</div>
                <div><strong>प्रकाशन संस्थान:</strong> सतपुड़ा संस्कृति संस्थान, भोपाल</div>
                <div><strong>कुल प्रविष्टियां:</strong> 2,740+ शब्दावली एवं मुहावरे</div>
                <div><strong>डिजिटल संपादन एवं सुझाव:</strong> rupeshpawar10@gmail.com</div>
              </div>

              <p className="text-xs text-stone-600">
                यह डिजिटल शब्दकोश ध्वन्यात्मक अंतर्राष्ट्रीय ध्वन्यात्मक वर्णमाला (Unicode IPA), व्याकरणिक विवरण (Part of Speech), द्विभाषी हिंदी एवं अंग्रेजी अर्थ, तथा पँवारी लोक-जीवन के व्यावहारिक उदाहरण वाक्यों के साथ प्रस्तुत किया गया है।
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2 bg-stone-900 text-amber-100 font-bold rounded-lg hover:bg-stone-800"
              >
                समझ गए (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
