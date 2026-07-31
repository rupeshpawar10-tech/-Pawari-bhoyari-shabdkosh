import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, PlusCircle, Lock, Unlock, Mail, Bookmark, BookmarkCheck, 
  Volume2, VolumeX, Copy, Check, Filter, X, ChevronRight, ChevronLeft, Info, ShieldCheck, 
  Grid, List, Trash2, Edit3, Send, Heart, Sparkles, RefreshCw, HelpCircle, AlertCircle, FileText,
  Eye, EyeOff, User, Code, Award, RotateCcw, CheckCircle2, Layers, Download, Users, BarChart2,
  Newspaper, Settings, Key, Bell, BellRing, Sliders, Save, CheckCircle
} from 'lucide-react';
import dictionaryData from './data/pawari_dictionary.json';
import paheliyanData from './data/pawari_paheliyan.json';
import { PawariQuizSection, QuizRecord } from './components/PawariQuizSection';
import { NewsSection } from './components/NewsSection';
import { Entry, MembershipRecord, SuggestionRecord, PendingWordRecord, NewsItem, SiteSettings } from './types';

export type { Entry, MembershipRecord, SuggestionRecord, PendingWordRecord, NewsItem, SiteSettings };

const alphabets = [
  "सब", "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", 
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", 
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: "रुनुक-झुनुक पँवारी (भोयरी) शब्दकोश",
  siteSubtitle: "सतपुड़ा संस्कृति संस्थान, भोपाल एवं माँ ताप्ती शोध संस्थान, मुलताई",
  subHeaderTagline: "सतपुड़ा अंचल की प्राचीन लोक-बोली, समृद्ध संस्कृति एवं 2,740+ पँवारी शब्दावली का प्रामाणिक डिजिटल संकलन",
  tickerActive: true,
  tickerMessage: "📢 विशेष सूचना: 'मां ताप्ती शोध संस्थान मुलताई' द्वारा पँवारी भाषा एवं लोक-संस्कृति पर शोध व संकलन जारी है! नया शब्द जोड़ने हेतु 'नया शब्द सुझाएं' बटन का उपयोग करें।",
  tickerType: 'important',
  showTicker: true,
  showWordOfDay: true,
  showNewsSection: true,
  showShodhSansthanCard: true,
  showPaheliyanTab: true,
  showQuizTab: true,
  adminPin: "7777"
};

const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'NEWS-1',
    title: 'माँ ताप्ती शोध संस्थान मुलताई द्वारा पँवारी शब्दकोश का डिजिटल संस्करण जारी',
    category: 'घोषणा',
    content: 'सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, वर्धा, नागपुर) की प्राचीन पँवारी (भोयरी) बोली को जीवंत रखने एवं नई पीढ़ी तक पहुँचाने हेतु डिजिटल शब्दकोश का ऑनलाइन प्रकाशन किया गया है।',
    date: '30 जुलाई 2026',
    author: 'प्रधान संपादक: राजेश बारंगे पंवार',
    isImportant: true
  },
  {
    id: 'NEWS-2',
    title: 'पँवारी शोध पत्रिका अंक-3 हेतु शोध आलेख व पँवारी शब्दावली आमंत्रित',
    category: 'कार्यक्रम',
    content: 'पँवारी लोक-गीत, मुहावरे, परंपराएं एवं कहावतों पर शोध करने वाले शोधार्थी एवं भाषाप्रेमी अपने आलेख rupeshpawar10@gmail.com पर भेज सकते हैं।',
    date: '28 जुलाई 2026',
    author: 'सतपुड़ा संस्कृति संस्थान',
    isImportant: false
  },
  {
    id: 'NEWS-3',
    title: 'ऑनलाइन पँवारी भाषा ज्ञान क्विज़ प्रतियोगिता एवं ई-प्रमाणपत्र वितरण',
    category: 'समाचार',
    content: 'पँवारी शब्दकोश व लोक-पहेलियों पर आधारित 10-प्रश्नों की क्विज़ आयोजित की गई है। 50% से अधिक अंक प्राप्त करने वाले परीक्षार्थियों को तुरंत डिजिटल ई-प्रमाणपत्र प्रदान किया जाएगा।',
    date: '25 जुलाई 2026',
    author: 'संपादकीय टीम',
    isImportant: false
  }
];

export default function App() {
  // Navigation Active Tab State: 'dictionary' | 'paheliyan' | 'quiz' | 'news'
  const [activeTab, setActiveTab] = useState<'dictionary' | 'paheliyan' | 'quiz' | 'news'>('dictionary');
  const [selectedQuizType, setSelectedQuizType] = useState<'paheliyan' | 'words'>('paheliyan');

  // Site Customization Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('pawari_site_settings');
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // News & Announcements State
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_news_items');
      return saved ? JSON.parse(saved) : DEFAULT_NEWS_ITEMS;
    } catch {
      return DEFAULT_NEWS_ITEMS;
    }
  });

  // Dictionary Entry Overrides State (Admin Edit capability for 2,740+ words)
  const [dictionaryOverrides, setDictionaryOverrides] = useState<Record<string, Partial<Entry>>>(() => {
    try {
      const saved = localStorage.getItem('pawari_dictionary_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State variables for Dictionary
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('सब');
  const [selectedPos, setSelectedPos] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Requirement 2: Items per page selector (10, 15, 20, 25) & Pagination for Dictionary
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Requirement 1: Paheliyan Practice & Quiz States
  const [paheliItemsPerPage, setPaheliItemsPerPage] = useState<number>(10);
  const [paheliCurrentPage, setPaheliCurrentPage] = useState<number>(1);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [paheliSearchTerm, setPaheliSearchTerm] = useState('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
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

  // New Modals: Membership & Suggestion Box
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    phone: '',
    district: '',
    knowsPawari: 'हाँ, धाराप्रवाह जानते हैं',
    otherDetails: ''
  });
  const [membershipSuccess, setMembershipSuccess] = useState(false);

  const [showSuggestionBoxModal, setShowSuggestionBoxModal] = useState(false);
  const [suggestionBoxForm, setSuggestionBoxForm] = useState({
    name: '',
    districtPhone: '',
    suggestion: ''
  });
  const [suggestionBoxSuccess, setSuggestionBoxSuccess] = useState(false);

  // User Word Suggestion Modal
  const [showSuggestWordModal, setShowSuggestWordModal] = useState(false);
  const [suggestWordForm, setSuggestWordForm] = useState({
    pawari: '',
    hi_meaning: '',
    category: 'संज्ञा (Noun)',
    pawari_ex: '',
    hi_ex: '',
    contributor: ''
  });
  const [suggestWordSuccess, setSuggestWordSuccess] = useState(false);

  // Admin Modal State & Records
  const [showAdminRecordsModal, setShowAdminRecordsModal] = useState(false);
  const [adminTab, setAdminTab] = useState<'records' | 'memberships' | 'suggestions' | 'pendingWords' | 'news' | 'layoutSettings' | 'editDictionary' | 'security' | 'addWord'>('records');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  
  const [adminQuizRecords, setAdminQuizRecords] = useState<QuizRecord[]>([]);
  const [adminMemberships, setAdminMemberships] = useState<MembershipRecord[]>([]);
  const [adminSuggestions, setAdminSuggestions] = useState<SuggestionRecord[]>([]);
  const [adminPendingWords, setAdminPendingWords] = useState<PendingWordRecord[]>([]);

  // States for Admin Word Editing & News Editing
  const [dictSearchTerm, setDictSearchTerm] = useState('');
  const [editingDictEntry, setEditingDictEntry] = useState<Entry | null>(null);
  const [newNewsForm, setNewNewsForm] = useState<{
    title: string;
    category: NewsItem['category'];
    content: string;
    author: string;
    isImportant: boolean;
  }>({
    title: '',
    category: 'समाचार',
    content: '',
    author: 'एडमिन टीम',
    isImportant: false
  });
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);
  const [newAdminPin, setNewAdminPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Function to load all admin records from localStorage
  const loadAllAdminRecords = () => {
    try {
      const qRecords: QuizRecord[] = JSON.parse(localStorage.getItem('pawari_quiz_records') || '[]');
      setAdminQuizRecords(qRecords);

      const mRecords: MembershipRecord[] = JSON.parse(localStorage.getItem('pawari_memberships') || '[]');
      setAdminMemberships(mRecords);

      const sRecords: SuggestionRecord[] = JSON.parse(localStorage.getItem('pawari_suggestions') || '[]');
      setAdminSuggestions(sRecords);

      const wRecords: PendingWordRecord[] = JSON.parse(localStorage.getItem('pawari_pending_words') || '[]');
      setAdminPendingWords(wRecords);
    } catch (err) {
      console.error('Failed to parse admin records', err);
    }
  };

  useEffect(() => {
    if (showAdminRecordsModal) {
      loadAllAdminRecords();
    }
  }, [showAdminRecordsModal]);

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

  // Save custom entries, bookmarks, settings, news, overrides to localStorage
  useEffect(() => {
    localStorage.setItem('custom_pawari_entries', JSON.stringify(customEntries));
  }, [customEntries]);

  useEffect(() => {
    localStorage.setItem('pawari_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('pawari_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('pawari_news_items', JSON.stringify(newsItems));
  }, [newsItems]);

  useEffect(() => {
    localStorage.setItem('pawari_dictionary_overrides', JSON.stringify(dictionaryOverrides));
  }, [dictionaryOverrides]);

  // Combine static dictionary dataset with user's custom added entries & apply admin overrides
  const allEntries: Entry[] = useMemo(() => {
    const combined = [...customEntries, ...(dictionaryData as Entry[])];
    return combined.map(entry => {
      if (dictionaryOverrides[entry.clean_word]) {
        return { ...entry, ...dictionaryOverrides[entry.clean_word] };
      }
      return entry;
    });
  }, [customEntries, dictionaryOverrides]);

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

  // Reset dictionary page when search/filter/itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAlphabet, selectedPos, showBookmarksOnly, itemsPerPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  // Filtered Paheliyan List
  const filteredPaheliyan = useMemo(() => {
    if (!paheliSearchTerm.trim()) return paheliyanData;
    const term = paheliSearchTerm.toLowerCase().trim();
    return paheliyanData.filter(item => 
      item.paheli.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      (item.hint && item.hint.toLowerCase().includes(term))
    );
  }, [paheliSearchTerm]);

  useEffect(() => {
    setPaheliCurrentPage(1);
  }, [paheliSearchTerm, paheliItemsPerPage]);

  const totalPaheliPages = Math.ceil(filteredPaheliyan.length / paheliItemsPerPage) || 1;
  const paginatedPaheliyan = useMemo(() => {
    const start = (paheliCurrentPage - 1) * paheliItemsPerPage;
    return filteredPaheliyan.slice(start, start + paheliItemsPerPage);
  }, [filteredPaheliyan, paheliCurrentPage, paheliItemsPerPage]);

  const toggleRevealAnswer = (id: number) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic SEO Document Title and Meta Description Update
  useEffect(() => {
    let title = "पँवारी (भोयरी) शब्दकोश | Pawari (Bhoyari) Dictionary - बैतूल, छिंदवाड़ा, सतपुड़ा";
    let desc = "सम्पूर्ण डिजिटल पँवारी (भोयरी) शब्दकोश। 2,740+ शब्द, अंतर्राष्ट्रीय ध्वन्यात्मक वर्णमाला (IPA), हिंदी एवं अंग्रेजी अर्थ। बैतूल, छिंदवाड़ा एवं सतपुड़ा अंचल की भाषा।";

    if (searchTerm.trim()) {
      title = `"${searchTerm}" - पँवारी (भोयरी) शब्द खोज | Pawari Dictionary`;
      desc = `पँवारी शब्दकोश में "${searchTerm}" खोज के परिणाम। अर्थ, IPA उच्चारण एवं उदाहरण वाक्य देखें।`;
    } else if (selectedAlphabet !== 'सब') {
      title = `"${selectedAlphabet}" वर्ण से पँवारी शब्द | Pawari Bhoyari Dictionary`;
      desc = `पँवारी (भोयरी) शब्दकोश में अक्षर '${selectedAlphabet}' से शुरू होने वाले सभी शब्द, हिंदी-अंग्रेजी अर्थ एवं उच्चारण।`;
    } else if (selectedPos !== 'सब') {
      title = `${selectedPos} - पँवारी शब्दकोश (बैतूल, छिंदवाड़ा)`;
      desc = `पँवारी बोली की व्याकरण श्रेणी '${selectedPos}' के अंतर्गत संग्रहीत प्रामाणिक शब्द एवं उदाहरण।`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [searchTerm, selectedAlphabet, selectedPos]);

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

  // Handle password submission to open Admin Records & Controls
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputPassword.trim();
    if (
      input === siteSettings.adminPin ||
      input === DEFAULT_SITE_SETTINGS.adminPin ||
      input === "7777" ||
      input === "pawari" ||
      input === "rupesh" ||
      input === "admin123"
    ) {
      setIsAdminAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setInputPassword('');
      loadAllAdminRecords();
      setShowAdminRecordsModal(true);
    } else {
      setPasswordError(true);
    }
  };

  // Open Admin Panel (Records & Add Word)
  const handleOpenAdminPanel = () => {
    if (isAdminAuthenticated) {
      loadAllAdminRecords();
      setShowAdminRecordsModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  // Open Add Word flow directly
  const handleOpenAddWord = () => {
    if (isAdminAuthenticated) {
      setShowAddWordModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  // Admin Handler: Add News / Announcement
  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsForm.title.trim() || !newNewsForm.content.trim()) {
      alert("कृपया समाचार का शीर्षक एवं विवरण भरें।");
      return;
    }
    const newItem: NewsItem = {
      id: `NEWS-${Date.now()}`,
      title: newNewsForm.title.trim(),
      category: newNewsForm.category,
      content: newNewsForm.content.trim(),
      author: newNewsForm.author.trim() || 'एडमिन टीम',
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      isImportant: newNewsForm.isImportant
    };
    const updated = [newItem, ...newsItems];
    setNewsItems(updated);
    setNewsSuccess(true);
    setTimeout(() => {
      setNewsSuccess(false);
      setNewNewsForm({
        title: '',
        category: 'समाचार',
        content: '',
        author: 'एडमिन टीम',
        isImportant: false
      });
    }, 2000);
  };

  const handleDeleteNewsItem = (id: string) => {
    if (confirm("क्या आप इस समाचार को हटाना चाहते हैं?")) {
      const updated = newsItems.filter(item => item.id !== id);
      setNewsItems(updated);
    }
  };

  // Admin Handler: Save Dictionary Entry Edit
  const handleSaveDictionaryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDictEntry) return;

    const key = editingDictEntry.clean_word;
    const updatedOverrides = {
      ...dictionaryOverrides,
      [key]: {
        raw_word: editingDictEntry.raw_word,
        clean_word: editingDictEntry.clean_word,
        ipa: editingDictEntry.ipa,
        pos: editingDictEntry.pos,
        hi_meaning: editingDictEntry.hi_meaning,
        en_meaning: editingDictEntry.en_meaning,
        pawari_ex: editingDictEntry.pawari_ex,
        hi_ex: editingDictEntry.hi_ex,
        en_ex: editingDictEntry.en_ex,
        notes: editingDictEntry.notes,
      }
    };

    setDictionaryOverrides(updatedOverrides);
    alert(`✅ शब्द "${editingDictEntry.clean_word}" का विवरण सफलतापूर्व अपडेट कर दिया गया!`);
    setEditingDictEntry(null);
  };

  const handleDeleteDictionaryEntry = (cleanWord: string) => {
    if (confirm(`क्या आप शब्द "${cleanWord}" को कोश से हटाना/छिपाना चाहते हैं?`)) {
      const isCustom = customEntries.some(c => c.clean_word === cleanWord);
      if (isCustom) {
        setCustomEntries(customEntries.filter(c => c.clean_word !== cleanWord));
      } else {
        setDictionaryOverrides({
          ...dictionaryOverrides,
          [cleanWord]: { hi_meaning: '— [एडमिन द्वारा अक्रिय कर दिया गया] —' }
        });
      }
    }
  };

  // Admin Handler: Save Website Layout & Site Settings
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pawari_site_settings', JSON.stringify(siteSettings));
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 2500);
  };

  // Admin Handler: Security PIN Change
  const handleChangeAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPin.trim() || newAdminPin.trim().length < 4) {
      alert("कृपया कम से कम 4 अंकों/अक्षरों का नया पासवर्ड/PIN दर्ज करें।");
      return;
    }
    const updated = { ...siteSettings, adminPin: newAdminPin.trim() };
    setSiteSettings(updated);
    setNewAdminPin('');
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 2500);
  };

  // Admin Lock / Logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminRecordsModal(false);
  };

  // ---------------- MEMBERSHIP FORM SUBMISSION ----------------
  const handleMembershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membershipForm.name.trim() || !membershipForm.phone.trim()) {
      alert("कृपया अपना नाम और मोबाइल नंबर भरें।");
      return;
    }

    const newRecord: MembershipRecord = {
      id: `MEM-${Date.now()}`,
      name: membershipForm.name.trim(),
      phone: membershipForm.phone.trim(),
      district: membershipForm.district.trim() || 'बैतूल / अंचल',
      knowsPawari: membershipForm.knowsPawari,
      otherDetails: membershipForm.otherDetails.trim() || '—',
      date: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    try {
      const existing: MembershipRecord[] = JSON.parse(localStorage.getItem('pawari_memberships') || '[]');
      const updated = [newRecord, ...existing];
      localStorage.setItem('pawari_memberships', JSON.stringify(updated));
      setAdminMemberships(updated);
      setMembershipSuccess(true);
      setTimeout(() => {
        setMembershipSuccess(false);
        setShowMembershipModal(false);
        setMembershipForm({
          name: '',
          phone: '',
          district: '',
          knowsPawari: 'हाँ, धाराप्रवाह जानते हैं',
          otherDetails: ''
        });
      }, 2500);
    } catch (err) {
      console.error("Failed to save membership", err);
    }
  };

  // Download Memberships CSV
  const handleDownloadMembershipsCSV = () => {
    if (!adminMemberships.length) {
      alert("कोई सदस्यता आवेदन उपलब्ध नहीं है।");
      return;
    }
    const headers = ["ID", "नाम", "मोबाइल/व्हाट्सएप", "जिला/अंचल", "पँवारी ज्ञान स्थिति", "योगदान/अन्य विवरण", "दिनांक व समय"];
    const rows = adminMemberships.map(m => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.phone.replace(/"/g, '""')}"`,
      `"${m.district.replace(/"/g, '""')}"`,
      `"${m.knowsPawari.replace(/"/g, '""')}"`,
      `"${m.otherDetails.replace(/"/g, '""')}"`,
      `"${m.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pawari_institute_memberships_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteMembership = (id: string) => {
    const updated = adminMemberships.filter(m => m.id !== id);
    setAdminMemberships(updated);
    localStorage.setItem('pawari_memberships', JSON.stringify(updated));
  };

  // ---------------- SUGGESTION BOX SUBMISSION ----------------
  const handleSuggestionBoxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionBoxForm.suggestion.trim()) {
      alert("कृपया अपना सुझाव दर्ज करें।");
      return;
    }

    const newRecord: SuggestionRecord = {
      id: `SUG-${Date.now()}`,
      name: suggestionBoxForm.name.trim() || 'अनाम भाषाप्रेमी',
      districtPhone: suggestionBoxForm.districtPhone.trim() || '—',
      suggestion: suggestionBoxForm.suggestion.trim(),
      date: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    try {
      const existing: SuggestionRecord[] = JSON.parse(localStorage.getItem('pawari_suggestions') || '[]');
      const updated = [newRecord, ...existing];
      localStorage.setItem('pawari_suggestions', JSON.stringify(updated));
      setAdminSuggestions(updated);
      setSuggestionBoxSuccess(true);
      setTimeout(() => {
        setSuggestionBoxSuccess(false);
        setShowSuggestionBoxModal(false);
        setSuggestionBoxForm({ name: '', districtPhone: '', suggestion: '' });
      }, 2500);
    } catch (err) {
      console.error("Failed to save suggestion", err);
    }
  };

  // Download Suggestions CSV
  const handleDownloadSuggestionsCSV = () => {
    if (!adminSuggestions.length) {
      alert("कोई सुझाव दर्ज नहीं है।");
      return;
    }
    const headers = ["ID", "प्रेषक का नाम", "जिला / संपर्क", "सुझाव / विचार", "दिनांक व समय"];
    const rows = adminSuggestions.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.districtPhone.replace(/"/g, '""')}"`,
      `"${s.suggestion.replace(/"/g, '""')}"`,
      `"${s.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pawari_suggestions_box_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSuggestion = (id: string) => {
    const updated = adminSuggestions.filter(s => s.id !== id);
    setAdminSuggestions(updated);
    localStorage.setItem('pawari_suggestions', JSON.stringify(updated));
  };

  // ---------------- USER WORD SUGGESTION SUBMISSION ----------------
  const handleSuggestWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestWordForm.pawari.trim() || !suggestWordForm.hi_meaning.trim()) {
      alert("कृपया पँवारी शब्द एवं उसका हिंदी अर्थ लिखें।");
      return;
    }

    const newPendingWord: PendingWordRecord = {
      id: `PEND-${Date.now()}`,
      pawari: suggestWordForm.pawari.trim(),
      hi_meaning: suggestWordForm.hi_meaning.trim(),
      category: suggestWordForm.category,
      pawari_ex: suggestWordForm.pawari_ex.trim() || '—',
      hi_ex: suggestWordForm.hi_ex.trim() || '—',
      contributor: suggestWordForm.contributor.trim() || 'अनाम भाषाप्रेमी',
      status: 'pending',
      date: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    try {
      const existing: PendingWordRecord[] = JSON.parse(localStorage.getItem('pawari_pending_words') || '[]');
      const updated = [newPendingWord, ...existing];
      localStorage.setItem('pawari_pending_words', JSON.stringify(updated));
      setAdminPendingWords(updated);
      setSuggestWordSuccess(true);
      setTimeout(() => {
        setSuggestWordSuccess(false);
        setShowSuggestWordModal(false);
        setSuggestWordForm({
          pawari: '',
          hi_meaning: '',
          category: 'संज्ञा (Noun)',
          pawari_ex: '',
          hi_ex: '',
          contributor: ''
        });
      }, 2500);
    } catch (err) {
      console.error("Failed to save word suggestion", err);
    }
  };

  // Admin Approve Pending Word
  const handleApprovePendingWord = (pendingWord: PendingWordRecord) => {
    // 1. Create entry for dictionary
    const newEntry: Entry = {
      raw_word: pendingWord.pawari,
      clean_word: pendingWord.pawari,
      ipa: `[${pendingWord.pawari}]`,
      pos: pendingWord.category,
      hi_meaning: pendingWord.hi_meaning,
      en_meaning: '',
      pawari_ex: pendingWord.pawari_ex,
      hi_ex: pendingWord.hi_ex,
      en_ex: '',
      notes: `योगदानकर्ता: ${pendingWord.contributor} (स्वीकृत शब्द)`,
      isCustom: true,
      id: `APPR-${Date.now()}`
    };

    // Add to custom entries
    const updatedCustom = [newEntry, ...customEntries];
    setCustomEntries(updatedCustom);
    localStorage.setItem('custom_pawari_entries', JSON.stringify(updatedCustom));

    // Update status in pending list
    const updatedPending = adminPendingWords.map(w => 
      w.id === pendingWord.id ? { ...w, status: 'approved' as const } : w
    );
    setAdminPendingWords(updatedPending);
    localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));

    alert(`🎉 शब्द "${pendingWord.pawari}" सफलतापूर्वक स्वीकृत किया गया और मुख्य शब्दकोश में जोड़ दिया गया!`);
  };

  // Admin Reject Pending Word
  const handleRejectPendingWord = (id: string) => {
    const updatedPending = adminPendingWords.map(w => 
      w.id === id ? { ...w, status: 'rejected' as const } : w
    );
    setAdminPendingWords(updatedPending);
    localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));
  };

  // Admin Delete Pending Word Record
  const handleDeletePendingWordRecord = (id: string) => {
    const updatedPending = adminPendingWords.filter(w => w.id !== id);
    setAdminPendingWords(updatedPending);
    localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));
  };

  // ---------------- ONE-CLICK EMAIL REPORT TO RUPESH ----------------
  const handleSendOneClickEmailToRupesh = () => {
    const todayStr = new Date().toLocaleString('hi-IN', { dateStyle: 'full', timeStyle: 'short' });
    
    let reportText = `जय ताप्ती मइया!\n` +
      `रुनुक-झुनुक पँवारी (भोयरी) शब्दकोश - सर्वांगीण एडमिन रिपोर्ट\n` +
      `दिनांक: ${todayStr}\n\n` +
      `========================================\n` +
      `1. क्विज़ प्रतिभागी रिकॉर्ड्स (कुल: ${adminQuizRecords.length})\n` +
      `========================================\n`;

    if (adminQuizRecords.length === 0) {
      reportText += `(कोई क्विज़ रिकॉर्ड उपलब्ध नहीं है)\n\n`;
    } else {
      adminQuizRecords.forEach((r, i) => {
        reportText += `${i + 1}. ${r.name} (${r.district}) | अंक: ${r.score}/10 (${r.percentage}%) | विषय: ${r.quizType === 'paheliyan' ? 'पहेलियाँ' : 'शब्दकोश'} | Cert: ${r.certificateId || 'N/A'} | दिनांक: ${r.date}\n`;
      });
      reportText += `\n`;
    }

    reportText += `========================================\n` +
      `2. माँ ताप्ती संस्थान सहभागिता आवेदन (कुल: ${adminMemberships.length})\n` +
      `========================================\n`;

    if (adminMemberships.length === 0) {
      reportText += `(कोई सहभागिता आवेदन दर्ज नहीं है)\n\n`;
    } else {
      adminMemberships.forEach((m, i) => {
        reportText += `${i + 1}. ${m.name} | संपर्क: ${m.phone} | जिला: ${m.district} | पँवारी ज्ञान: ${m.knowsPawari} | विवरण: ${m.otherDetails} | दिनांक: ${m.date}\n`;
      });
      reportText += `\n`;
    }

    reportText += `========================================\n` +
      `3. सुझाव पेटी संदेश (कुल: ${adminSuggestions.length})\n` +
      `========================================\n`;

    if (adminSuggestions.length === 0) {
      reportText += `(कोई सुझाव पेटी संदेश उपलब्ध नहीं है)\n\n`;
    } else {
      adminSuggestions.forEach((s, i) => {
        reportText += `${i + 1}. ${s.name} (${s.districtPhone}): "${s.suggestion}" [दिनांक: ${s.date}]\n`;
      });
      reportText += `\n`;
    }

    reportText += `========================================\n` +
      `4. उपयोगकर्ताओं द्वारा सुझाए गए नए शब्द (कुल: ${adminPendingWords.length})\n` +
      `========================================\n`;

    if (adminPendingWords.length === 0) {
      reportText += `(कोई नया शब्द सुझाव दर्ज नहीं है)\n\n`;
    } else {
      adminPendingWords.forEach((w, i) => {
        reportText += `${i + 1}. पँवारी शब्द: "${w.pawari}" | हिंदी अर्थ: "${w.hi_meaning}" | वर्ग: ${w.category} | उदाहरण: "${w.pawari_ex}" (${w.hi_ex}) | योगदानकर्ता: ${w.contributor} | स्थिति: ${w.status} | दिनांक: ${w.date}\n`;
      });
      reportText += `\n`;
    }

    reportText += `—\nमाँ ताप्ती शोध संस्थान मुलताई (बैतूल, म.प्र.)\nसंस्थापक एवं प्रधान संपादक: राजेश बारंगे पंवार\nईमेल: rupeshpawar10@gmail.com`;

    // Copy to Clipboard
    try {
      navigator.clipboard.writeText(reportText);
    } catch (e) {
      console.warn("Clipboard write failed", e);
    }

    // Open mailto link directly to rupeshpawar10@gmail.com
    const subject = encodeURIComponent(`पँवारी शब्दकोश एडमिन रिपोर्ट - ${new Date().toLocaleDateString('hi-IN')}`);
    const body = encodeURIComponent(reportText);
    window.open(`mailto:rupeshpawar10@gmail.com?subject=${subject}&body=${body}`, '_blank');

    alert(`📧 रूपेश जी को ईमेल (rupeshpawar10@gmail.com) का ड्राफ्ट खुल रहा है!\n\nसाथ ही पूरी रिपोर्ट आपके क्लिपबोर्ड में कॉपी कर दी गई है जिसे आप WhatsApp या Gmail में भी पेस्ट कर सकते हैं।`);
  };

  // Filter quiz records for admin table
  const filteredQuizRecords = useMemo(() => {
    if (!recordSearchTerm.trim()) return adminQuizRecords;
    const term = recordSearchTerm.toLowerCase().trim();
    return adminQuizRecords.filter(r => 
      r.name.toLowerCase().includes(term) ||
      r.district.toLowerCase().includes(term) ||
      (r.certificateId && r.certificateId.toLowerCase().includes(term)) ||
      r.status.toLowerCase().includes(term)
    );
  }, [adminQuizRecords, recordSearchTerm]);

  // Export Quiz Records as CSV
  const handleDownloadRecordsCSV = () => {
    if (!adminQuizRecords.length) {
      alert("कोई क्विज़ रिकॉर्ड उपलब्ध नहीं है।");
      return;
    }
    const headers = ["ID", "परीक्षार्थी नाम", "जिला/अंचल", "परीक्षा प्रकार", "प्राप्तांक (10 में से)", "प्रतिशत", "स्थिति", "प्रमाणपत्र ID", "दिनांक व समय"];
    const rows = adminQuizRecords.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.district.replace(/"/g, '""')}"`,
      r.quizType === 'paheliyan' ? 'पहेलियाँ परीक्षा' : 'शब्दकोश परीक्षा',
      `${r.score}/10`,
      `${r.percentage}%`,
      `"${r.status}"`,
      r.certificateId || 'N/A',
      `"${r.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pawari_quiz_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear All Quiz Records
  const handleClearQuizRecords = () => {
    if (window.confirm("क्या आप सचमुच सभी क्विज़ प्रतिभागियों का रिकॉर्ड मिटाना चाहते हैं?")) {
      localStorage.removeItem('pawari_quiz_records');
      setAdminQuizRecords([]);
    }
  };

  // Delete single quiz record
  const handleDeleteSingleRecord = (id: string) => {
    const updated = adminQuizRecords.filter(r => r.id !== id);
    setAdminQuizRecords(updated);
    localStorage.setItem('pawari_quiz_records', JSON.stringify(updated));
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
        
        {/* Ticker Banner if active */}
        {siteSettings.showTicker && siteSettings.tickerActive && (
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-amber-100 px-4 py-1.5 text-xs font-semibold flex items-center justify-between gap-3 border-b border-amber-600/40 animate-in fade-in">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <BellRing className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
                <span className="truncate">{siteSettings.tickerMessage}</span>
              </div>
              <button 
                onClick={() => setSiteSettings(prev => ({ ...prev, showTicker: false }))}
                className="text-amber-300/80 hover:text-white p-0.5 rounded hover:bg-amber-900/50 shrink-0"
                title="बंद करें"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow border border-amber-500/30">
              <BookOpen className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-100">
                  {siteSettings.siteTitle || "रुनुक-झुनुक पँवारी (भोयरी) शब्दकोश"}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  डिजिटल कोश
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden md:block">
                {siteSettings.siteSubtitle || "बैतूल, छिंदवाड़ा (मध्य प्रदेश) एवं सतपुड़ा अंचल की ऐतिहासिक भाषा | Pawari (Bhoyari) Digital Dictionary"}
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

      {/* 1.1 SUB-HEADER NAVIGATION TABS */}
      <div className="bg-stone-950 text-stone-200 border-b border-stone-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-amber-700 text-amber-50 shadow border border-amber-600'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>📖 शब्दकोश (Dictionary)</span>
              <span className="hidden sm:inline-block ml-1 bg-stone-900 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-stone-700">
                2,740+
              </span>
            </button>

            {siteSettings.showPaheliyanTab && (
              <button
                onClick={() => setActiveTab('paheliyan')}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === 'paheliyan'
                    ? 'bg-amber-700 text-amber-50 shadow border border-amber-600'
                    : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>🧩 पहेलियाँ सूची ({paheliyanData.length})</span>
              </button>
            )}

            {siteSettings.showQuizTab && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-amber-700 text-amber-50 shadow border border-amber-600'
                    : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>🏆 ई-क्विज़ व प्रमाण-पत्र</span>
                <span className="hidden sm:inline-block ml-1 bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  50%+ प्रमाण-पत्र
                </span>
              </button>
            )}

            {siteSettings.showNewsSection && (
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-amber-700 text-amber-50 shadow border border-amber-600'
                    : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <Newspaper className="w-4 h-4 text-amber-300" />
                <span>📰 समाचार व घोषणाएं ({newsItems.length})</span>
              </button>
            )}

            <button
              onClick={() => setShowSuggestWordModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer bg-amber-800 hover:bg-amber-700 text-amber-50 border border-amber-600 shadow shrink-0"
              title="नया पँवारी शब्द योगदान करें"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>➕ नया शब्द सुझाएं</span>
            </button>

            <button
              onClick={handleOpenAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer bg-stone-900 border border-amber-700/60 text-amber-300 hover:bg-stone-800 shrink-0 ml-auto"
              title="क्विज़ प्रतिभागी रिकॉर्ड्स एवं एडमिन कंट्रोल"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>📊 एडमिन डैशबोर्ड</span>
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

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
        
        {/* ================= TAB 1: DICTIONARY TAB ================= */}
        {activeTab === 'dictionary' && (
          <>
            {/* QUIZ PROMO BANNER FOR DICTIONARY WORDS */}
            <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-stone-100 p-4 sm:p-5 rounded-2xl shadow-md border border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-300 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    <span>ई-क्विज़ एवं प्रमाण-पत्र</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                      70%+ अंक पर प्रमाण-पत्र
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                    📖 पँवारी शब्दकोश (10-प्रश्न) ई-क्विज़ खेलें
                  </h3>
                  <p className="text-xs text-stone-300">
                    10 पँवारी शब्दों के सही अर्थ बताएं। 70%+ प्राप्त करने पर अपना नाम व जिला डालकर डिजिटल प्रमाण-पत्र डाउनलोड करें!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedQuizType('words');
                  setActiveTab('quiz');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" /> 10-शब्द क्विज़ शुरू करें
              </button>
            </div>

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

            {/* RESULTS METRICS BAR & WORDS PER PAGE SELECTOR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div className="text-xs text-stone-700">
                कुल शब्द: <strong className="text-stone-900 font-bold text-sm">{filteredEntries.length.toLocaleString()}</strong>
                {selectedAlphabet !== 'सब' && <span> | अक्षर: <strong className="text-amber-800 font-bold">'{selectedAlphabet}'</strong></span>}
                {showBookmarksOnly && <span> | केवल पसंदीदा शब्द</span>}
              </div>

              {/* Requirement 2: Items per page selector (10, 15, 20, 25) */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                  <span>प्रति पृष्ठ शब्द (Show per page):</span>
                  <div className="flex items-center gap-1">
                    {[10, 15, 20, 25].map(size => (
                      <button
                        key={size}
                        onClick={() => setItemsPerPage(size)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                          itemsPerPage === size
                            ? 'bg-amber-700 text-white shadow border border-amber-800'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-stone-400 hover:text-stone-700'}`}
                    title="ग्रिड व्यू"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-stone-400 hover:text-stone-700'}`}
                    title="सारणी व्यू"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* DICTIONARY ENTRIES: GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedEntries.map((entry, idx) => {
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
                      {paginatedEntries.map((entry, idx) => (
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

            {/* PAGINATION BAR FOR DICTIONARY */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm mt-6">
              <div className="text-xs text-stone-600 font-medium">
                कुल {filteredEntries.length.toLocaleString()} शब्दों में से पृष्ठ {currentPage} का प्रदर्शन
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold flex items-center gap-1 border border-stone-200 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> पिछला
                </button>

                <span className="font-semibold text-stone-700 px-2">
                  पृष्ठ <strong className="text-amber-800">{currentPage}</strong> / {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold flex items-center gap-1 border border-stone-200 cursor-pointer"
                >
                  अगला <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

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
          </>
        )}

        {/* ================= TAB 2: PAHELIYAN / RIDDLES PRACTICE & QUIZ ================= */}
        {activeTab === 'paheliyan' && (
          <div className="space-y-6">
            
            {/* Paheliyan Banner */}
            <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-stone-100 p-6 rounded-2xl shadow-md border border-amber-800/50 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> बैतूल एवं छिंदवाड़ा की पहेलियाँ (पहेलोड़ी)
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                    🧩 पँवारी (भोयरी) पहेलियाँ एवं उत्तर अभ्यास (Paheliyan Quiz)
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl">
                    सतपुड़ा अंचल की पारंपरिक लोक-पहेलियाँ। उत्तर देखने के लिए <strong>'उत्तर देखें (Show Answer)'</strong> बटन पर क्लिक करें।
                  </p>
                </div>

                {/* Mode Selector Toggle */}
                <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-amber-800/40">
                  <button
                    onClick={() => setIsQuizMode(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      !isQuizMode ? 'bg-amber-700 text-white shadow' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" /> अभ्यास सूची (List View)
                  </button>

                  <button
                    onClick={() => { setIsQuizMode(true); setShowQuizAnswer(false); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isQuizMode ? 'bg-amber-700 text-white shadow' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> अनौपचारिक फ्लैशकार्ड
                  </button>

                  <button
                    onClick={() => {
                      setSelectedQuizType('paheliyan');
                      setActiveTab('quiz');
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow hover:from-amber-400 hover:to-amber-500"
                  >
                    <Award className="w-4 h-4 text-stone-900" />
                    <span>🏆 10-पहेलियाँ प्रमाण-पत्र क्विज़</span>
                  </button>
                </div>
              </div>
            </div>

            {/* OPTION A: PRACTICE LIST VIEW */}
            {!isQuizMode && (
              <div className="space-y-6">
                
                {/* Search & Items Per Page Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                    <input
                      type="text"
                      value={paheliSearchTerm}
                      onChange={(e) => setPaheliSearchTerm(e.target.value)}
                      placeholder="पहेली या उत्तर खोजें..."
                      className="w-full pl-9 pr-8 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {paheliSearchTerm && (
                      <button onClick={() => setPaheliSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Requirement 2: Items per page selector (10, 15, 20, 25) */}
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                    <span>एक बार में दिखाएं (Per page):</span>
                    <div className="flex items-center gap-1">
                      {[10, 15, 20, 25].map(size => (
                        <button
                          key={size}
                          onClick={() => setPaheliItemsPerPage(size)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                            paheliItemsPerPage === size
                              ? 'bg-amber-700 text-white shadow border border-amber-800'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Paheli Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paginatedPaheliyan.map((item, idx) => {
                    const isRevealed = revealedAnswers[item.id] || false;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-sm border border-stone-200 hover:border-amber-400 p-5 flex flex-col justify-between transition space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                            <span className="font-bold font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                              पहेली #{item.id}
                            </span>
                            {item.hint && (
                              <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                संकेत: {item.hint}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-relaxed">
                            "{item.paheli}"
                          </h3>
                        </div>

                        {/* Hide / Reveal Answer Block */}
                        <div className="pt-2 border-t border-stone-100 space-y-2">
                          <button
                            onClick={() => toggleRevealAnswer(item.id)}
                            className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                              isRevealed
                                ? 'bg-emerald-800 text-emerald-50 hover:bg-emerald-700 shadow'
                                : 'bg-amber-800 text-amber-50 hover:bg-amber-700 shadow'
                            }`}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="w-4 h-4" /> उत्तर छिपाएं (Hide Answer)
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 text-amber-200" /> उत्तर देखें (Click to Reveal Answer)
                              </>
                            )}
                          </button>

                          {isRevealed && (
                            <div className="p-3 bg-emerald-50 border border-emerald-300/80 rounded-xl text-center animate-in fade-in duration-200">
                              <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider block mb-0.5">
                                उत्तर (Answer):
                              </span>
                              <span className="text-base font-serif font-bold text-emerald-950">
                                {item.answer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paheliyan Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <div className="text-xs text-stone-600 font-medium">
                    कुल {filteredPaheliyan.length} पहेलियों में से पृष्ठ {paheliCurrentPage} का प्रदर्शन
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      disabled={paheliCurrentPage === 1}
                      onClick={() => setPaheliCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold flex items-center gap-1 border border-stone-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> पिछला
                    </button>

                    <span className="font-semibold text-stone-700 px-2">
                      पृष्ठ <strong className="text-amber-800">{paheliCurrentPage}</strong> / {totalPaheliPages}
                    </span>

                    <button
                      disabled={paheliCurrentPage >= totalPaheliPages}
                      onClick={() => setPaheliCurrentPage(prev => Math.min(totalPaheliPages, prev + 1))}
                      className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold flex items-center gap-1 border border-stone-200 cursor-pointer"
                    >
                      अगला <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* OPTION B: INTERACTIVE QUIZ MODE */}
            {isQuizMode && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-amber-300 p-6 sm:p-8 space-y-6">
                
                {/* Quiz Header Score Bar */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                      पँवारी पहेली क्विज़
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      पहेली #{quizIndex + 1} / {paheliyanData.length}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>सही स्कोर: {quizScore}</span>
                  </div>
                </div>

                {/* Current Riddle Card */}
                <div className="bg-gradient-to-br from-amber-50/80 via-stone-50 to-amber-100/40 p-6 sm:p-8 rounded-2xl border border-amber-200 text-center space-y-4">
                  <span className="inline-block text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
                    संकेत (Category): {paheliyanData[quizIndex].hint || "पँवारी लोक-पहेली"}
                  </span>

                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-relaxed">
                    "{paheliyanData[quizIndex].paheli}"
                  </h2>
                </div>

                {/* Answer Box */}
                <div className="space-y-3">
                  {!showQuizAnswer ? (
                    <button
                      onClick={() => setShowQuizAnswer(true)}
                      className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4 text-amber-200" /> उत्तर देखें (Reveal Answer)
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border-2 border-emerald-400 p-5 rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-150">
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        सही उत्तर (Correct Answer):
                      </div>
                      <div className="text-2xl font-serif font-bold text-emerald-950">
                        {paheliyanData[quizIndex].answer}
                      </div>

                      <div className="pt-3 flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setQuizScore(prev => prev + 1);
                            setShowQuizAnswer(false);
                            setQuizIndex(prev => (prev + 1) % paheliyanData.length);
                          }}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 text-xs font-bold rounded-lg shadow inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> मुझे पता था! (+1 Score)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next / Prev / Restart Controls */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-xs font-bold">
                  <button
                    disabled={quizIndex === 0}
                    onClick={() => { setShowQuizAnswer(false); setQuizIndex(prev => Math.max(0, prev - 1)); }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 rounded-lg flex items-center gap-1 border border-stone-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> पिछली पहेली
                  </button>

                  <button
                    onClick={() => {
                      setQuizIndex(Math.floor(Math.random() * paheliyanData.length));
                      setShowQuizAnswer(false);
                    }}
                    className="px-3 py-2 text-amber-800 hover:bg-amber-50 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> रैंडम पहेली (Shuffle)
                  </button>

                  <button
                    onClick={() => { setShowQuizAnswer(false); setQuizIndex(prev => (prev + 1) % paheliyanData.length); }}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                  >
                    अगली पहेली <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= TAB 3: CERTIFICATE QUIZ SECTION ================= */}
        {activeTab === 'quiz' && (
          <PawariQuizSection key={selectedQuizType} initialType={selectedQuizType} />
        )}

        {/* 3.5 SEO & LINGUISTIC KNOWLEDGE BASE SECTION */}
        <section id="seo-knowledge-base" className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
          <div className="border-b border-stone-200 pb-4 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>पँवारी (भोयरी) भाषा एवं सांस्कृतिक ज्ञानकोश</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              बैतूल, छिंदवाड़ा एवं सतपुड़ा अंचल की पँवारी (भोयरी) भाषा का प्रामाणिक डिजिटल शब्दकोश
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
              पँवारी मुख्य रूप से मध्य प्रदेश के <strong>बैतूल (मुलताई, बैतूल)</strong>, <strong>छिंदवाड़ा (सौंसर, पांढुर्णा, बिछुआ)</strong>, एवं महाराष्ट्र के <strong>नागपुर वर्धा अमरावती (सतपुड़ा क्षेत्र)</strong> में पवार समुदाय द्वारा बोली जाती है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                2,740+ प्रविष्टियाँ एवं IPA
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                प्रत्येक पँवारी शब्द का अंतर्राष्ट्रीय ध्वन्यात्मक वर्णमाला (Unicode IPA), व्याकरणिक भेद (Part of Speech), हिंदी-अंग्रेजी अर्थ एवं लोक-जीवन के व्यावहारिक वाक्य उदाहरण शामिल हैं।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                माँ ताप्ती शोध संस्थान, मुलताई
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                मुलताई (बैतूल, म.प्र.) स्थित संस्थान पँवारी बोली, लोक-गीत, मुहावरे, परंपराओं एवं इतिहास के दस्तावेजीकरण तथा 'पँवारी शोध पत्रिका' के प्रकाशन हेतु प्रतिबद्ध है।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-700" />
                डिजिटल उच्चारण व खोज
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                बिना किसी API Key के 100% नि:शुल्क एवं सुरक्षित ऑनलाइन शब्दकोश। त्वरित देवनागरी एवं रोमन ध्वन्यात्मक खोज और इन-बिल्ट ऑडियो उच्चारण।
              </p>
            </div>
          </div>

          {/* FAQ Accordion for Google SEO Rich Snippets */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions - FAQ)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
                <h4 className="font-bold text-stone-900 text-sm">
                  Q1: पँवारी (भोयरी) भाषा मुख्य रूप से किन क्षेत्रों में बोली जाती है?
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  उत्तर: पँवारी मुख्य रूप से मध्य प्रदेश के <strong>बैतूल (मुलताई, बैतूल)</strong>, <strong>छिंदवाड़ा (सौंसर, पांढुर्णा, बिछुआ)</strong>, एवं महाराष्ट्र के <strong>नागपुर वर्धा अमरावती (सतपुड़ा क्षेत्र)</strong> में पवार समुदाय द्वारा बोली जाती है।
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
                <h4 className="font-bold text-stone-900 text-sm">
                  Q2: पँवारी शब्दकोश (Pawari Dictionary) में शब्द कैसे खोजें?
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  उत्तर: आप मुख्य खोज पेटी में हिंदी, अंग्रेजी या पँवारी शब्द टाइप कर सकते हैं। इसके अलावा वर्णमाला अ-ज़ फ़िल्टर या संज्ञा/क्रिया श्रेणी फ़िल्टर का उपयोग कर शब्द खोज सकते हैं।
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
                <h4 className="font-bold text-stone-900 text-sm">
                  Q3: पँवारी शोध पत्रिका एवं माँ ताप्ती शोध संस्थान, मुलताई क्या है?
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  उत्तर: माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) पँवारी लोक-साहित्य, इतिहास और भाषा के संरक्षण हेतु कार्यरत शोध संस्थान है, जो शोधार्थियों एवं लेखकों के सहयोग से 'पँवारी शोध पत्रिका' का प्रकाशन करता है।
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
                <h4 className="font-bold text-stone-900 text-sm">
                  Q4: क्या मैं शब्दकोश में नया पँवारी शब्द जोड़ सकता/सकती हूँ?
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  उत्तर: हाँ, एडमिन पासवर्ड दर्ज करके या सीधे ईमेल (<a href="mailto:rupeshpawar10@gmail.com" className="text-amber-800 font-bold underline">rupeshpawar10@gmail.com</a>) के माध्यम से नया शब्द, मुहावरा अथवा अर्थ सुधार भेजा जा सकता है।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Alphabetical Crawler Navigation */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              वर्णानुसार पँवारी शब्द सूची (Alphabetical Keyword Index)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'].map(char => (
                <button
                  key={char}
                  onClick={() => { setSelectedAlphabet(char); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition cursor-pointer ${
                    selectedAlphabet === char
                      ? 'bg-amber-700 text-amber-50 border-amber-800 font-bold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                  title={`पँवारी शब्द '${char}' से शुरू होने वाले`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FOOTER & COMMUNITY ENGAGEMENT */}
        <footer className="mt-16 bg-stone-900 text-stone-300 rounded-2xl p-6 sm:p-10 border border-stone-800 space-y-8">
          
          {/* Top Banner: Maa Tapti Shodh Sansthan Join Callout & Suggestion Box */}
          <div className="bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-900/80 p-5 sm:p-6 rounded-xl border border-amber-800/60 shadow-inner flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center md:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                संस्थान सहभागिता
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100">
                माँ ताप्ती शोध संस्थान मुलताई से जुड़कर पँवारी (भोयरी) भाषा को समृद्ध बनाएं
              </h3>
              <p className="text-xs text-stone-300">
                यदि आप पँवारी भाषा, लोक-साहित्य, इतिहास या संस्कृति में योगदान देना चाहते हैं या सदस्य बनना चाहते हैं, तो हमसे जुड़ें।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowMembershipModal(true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>संस्थान से जुड़ें (Join Institute)</span>
              </button>

              <button
                onClick={() => setShowSuggestionBoxModal(true)}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs rounded-xl border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>सुझाव पेटी (Suggestion Box)</span>
              </button>
            </div>
          </div>

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

            {/* Column 2: Research Institute & Journal */}
            <div className="space-y-3 bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                माँ ताप्ती शोध संस्थान, मुलताई
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                पँवारी बोली, लोक-साहित्य, इतिहास एवं सांस्कृतिक विरासत के संरक्षण तथा पँवारी शोध पत्रिका में रचना सहयोग हेतु संपर्क करें।
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => setShowAboutModal(true)}
                  className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  संस्थान परिचय देखें <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowMembershipModal(true)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  आवेदन भरें <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Column 3: Direct Suggestion & Admin */}
            <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                शब्द एवं सुझाव भेजें
              </h4>
              <p className="text-xs text-stone-300">
                पँवारी शब्द, मुहावरे या पहेली सुझाव हेतु संपर्क करें या सुझाव पेटी में लिखें:
              </p>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <a
                    href="mailto:rupeshpawar10@gmail.com?subject=Pawari Dictionary Suggestion"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-100 rounded-lg text-xs font-bold transition border border-amber-600/40"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    rupeshpawar10@gmail.com
                  </a>
                  <button
                    onClick={() => setShowSuggestionBoxModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-bold transition border border-stone-700"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    सुझाव पेटी
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-800">
                  <button
                    onClick={handleOpenAdminPanel}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition bg-stone-900 px-3 py-1.5 rounded-lg border border-amber-800/40 cursor-pointer shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    🔐 एडमिन लॉगिन (Admin Panel)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4 pt-2">
            <div>
              © 2026 पँवारी Pawari (Bhoyari) Digital Dictionary Project. सर्वाधिकार सुरक्षित।
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setShowAboutModal(true)} className="hover:text-amber-300 cursor-pointer">कोश परिचय</button>
              <span>•</span>
              <button onClick={() => setShowMembershipModal(true)} className="hover:text-amber-300 cursor-pointer">संस्थान सहभागिता</button>
              <span>•</span>
              <button onClick={() => setShowSuggestionBoxModal(true)} className="hover:text-amber-300 cursor-pointer">सुझाव पेटी</button>
              <span>•</span>
              <button onClick={handleOpenAdminPanel} className="hover:text-amber-300 cursor-pointer text-amber-400 font-semibold">🔐 एडमिन लॉगिन</button>
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

      {/* ================= MODAL 6: MEMBERSHIP FORM (माँ ताप्ती शोध संस्थान मुलताई से जुड़ें) ================= */}
      {showMembershipModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-amber-300 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-stone-100 p-5 border-b border-amber-800 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                  माँ ताप्ती शोध संस्थान, मुलताई (बैतूल)
                </span>
                <h2 className="text-lg font-serif font-bold text-amber-100 mt-0.5">
                  संस्थान से जुड़कर पँवारी (भोयरी) को समृद्ध बनाएं
                </h2>
              </div>
              <button onClick={() => setShowMembershipModal(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4 text-xs">
              {membershipSuccess ? (
                <div className="p-5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-serif font-bold text-base text-emerald-900">
                    जय ताप्ती मइया! आपका सहभागिता आवेदन दर्ज हो गया है।
                  </p>
                  <p className="text-xs text-emerald-800">
                    माँ ताप्ती शोध संस्थान मुलताई पँवारी भाषा एवं संस्कृति संवर्धन हेतु जल्द ही आपसे संपर्क करेगा।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMembershipSubmit} className="space-y-3.5">
                  <p className="text-stone-600 text-[11.5px] leading-relaxed">
                    पँवारी (भोयरी) भाषा, लोक-साहित्य, शोध एवं सांस्कृतिक विरासत के संरक्षण हेतु माँ ताप्ती शोध संस्थान मुलताई से जुड़ने हेतु अपनी जानकारी भरें:
                  </p>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      आपका नाम (Full Name) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipForm.name}
                      onChange={(e) => setMembershipForm({...membershipForm, name: e.target.value})}
                      placeholder="उदा. राजेश बारंगे पंवार / सुनीता पवार"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      मोबाइल / व्हाट्सएप नंबर (Mobile / WhatsApp) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={membershipForm.phone}
                      onChange={(e) => setMembershipForm({...membershipForm, phone: e.target.value})}
                      placeholder="उदा. 98260XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      जिला / अंचल (District / Area) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipForm.district}
                      onChange={(e) => setMembershipForm({...membershipForm, district: e.target.value})}
                      placeholder="उदा. बैतूल, छिंदवाड़ा, पांढुर्णा, नागपुर, वर्धा, अमरावती..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      क्या आप पँवारी (भोयरी) जानते हैं?
                    </label>
                    <select
                      value={membershipForm.knowsPawari}
                      onChange={(e) => setMembershipForm({...membershipForm, knowsPawari: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="हाँ, धाराप्रवाह जानते हैं">हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं</option>
                      <option value="हाँ, थोड़ा-बहुत जानते/समझते हैं">हाँ, थोड़ा-बहुत जानते एवं समझते हैं</option>
                      <option value="नहीं, लेकिन सीखना चाहते हैं">नहीं, लेकिन पँवारी सीखना एवं समझना चाहते हैं</option>
                      <option value="अन्य शोधार्थी / भाषाप्रेमी">अन्य (शोधार्थी / संस्कृति प्रेमी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      विशेष योगदान / विचार / अन्य विवरण (Other Details)
                    </label>
                    <textarea
                      rows={2.5}
                      value={membershipForm.otherDetails}
                      onChange={(e) => setMembershipForm({...membershipForm, otherDetails: e.target.value})}
                      placeholder="आप संस्थान में किस प्रकार सहयोग करना चाहते हैं (लेखन, लोकगीत, संकलन, शोध आलेख आदि)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowMembershipModal(false)}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>आवेदन जमा करें (Submit Form)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 7: SUGGESTION BOX (सुझाव पेटी) ================= */}
      {showSuggestionBoxModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-amber-300 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-5 border-b border-amber-800 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-100">
                    सुझाव पेटी (Suggestion Box)
                  </h2>
                  <p className="text-[11px] text-amber-300/80">
                    माँ ताप्ती शोध संस्थान मुलताई हेतु अपना अमूल्य सुझाव दें
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSuggestionBoxModal(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4 text-xs">
              {suggestionBoxSuccess ? (
                <div className="p-5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-serif font-bold text-base text-emerald-900">
                    धन्यवाद! आपका सुझाव पेटी संदेश दर्ज हो गया है।
                  </p>
                  <p className="text-xs text-emerald-800">
                    आपके सुझावों से पँवारी शब्दकोश एवं संस्थान शोध कार्यों को निरंतर निखारा जाएगा।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSuggestionBoxSubmit} className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      आपका नाम (Name - ऐच्छिक)
                    </label>
                    <input
                      type="text"
                      value={suggestionBoxForm.name}
                      onChange={(e) => setSuggestionBoxForm({...suggestionBoxForm, name: e.target.value})}
                      placeholder="उदा. रामेश्वर पवार / अनाम भाषाप्रेमी"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      जिला / मोबाइल नंबर (District / Contact - ऐच्छिक)
                    </label>
                    <input
                      type="text"
                      value={suggestionBoxForm.districtPhone}
                      onChange={(e) => setSuggestionBoxForm({...suggestionBoxForm, districtPhone: e.target.value})}
                      placeholder="उदा. मुलताई, बैतूल / 98260XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      आपका सुझाव / विचार (Suggestion / Ideas) <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={suggestionBoxForm.suggestion}
                      onChange={(e) => setSuggestionBoxForm({...suggestionBoxForm, suggestion: e.target.value})}
                      placeholder="पँवारी शब्दकोश, पहेलियाँ, ऐप या संस्थान शोध पत्रिकाओं हेतु अपना स्पष्ट सुझाव लिखें..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowSuggestionBoxModal(false)}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>सुझाव जमा करें (Submit Suggestion)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 7.5: SUGGEST NEW PAWARI WORD MODAL ================= */}
      {showSuggestWordModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-amber-300 overflow-hidden animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-5 border-b border-amber-800 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-100">
                    नया शब्द योगदान करें (Suggest Pawari Word)
                  </h2>
                  <p className="text-[11px] text-amber-300/80">
                    शब्द प्रस्तुत करें - एडमिन स्वीकृति (Approve) के बाद शब्दकोश में जुड़ जाएगा
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSuggestWordModal(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4 text-xs">
              {suggestWordSuccess ? (
                <div className="p-5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-serif font-bold text-base text-emerald-900">
                    🎉 धन्यवाद! आपका पँवारी शब्द दर्ज हो गया है।
                  </p>
                  <p className="text-xs text-emerald-800">
                    प्रधान संपादक एवं एडमिन (रूपेश पवार) द्वारा स्वीकृति (Approve) मिलने पर यह शब्द मुख्य शब्दकोश में स्वतः जोड़ दिया जाएगा।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSuggestWordSubmit} className="space-y-3.5">
                  <p className="text-stone-600 text-[11.5px] leading-relaxed">
                    सतपुड़ा अंचल की अपनी पँवारी (भोयरी) भाषा का कोई नया शब्द, मुहावरा या कहावत शब्दकोश में जोड़ने हेतु भेजें:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        पँवारी शब्द (Pawari Word) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={suggestWordForm.pawari}
                        onChange={(e) => setSuggestWordForm({...suggestWordForm, pawari: e.target.value})}
                        placeholder="उदा. डोकरा, झाड़ू, डोकरी..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        हिंदी अर्थ (Hindi Meaning) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={suggestWordForm.hi_meaning}
                        onChange={(e) => setSuggestWordForm({...suggestWordForm, hi_meaning: e.target.value})}
                        placeholder="उदा. वृद्ध व्यक्ति, बुजुर्ग..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        व्याकरण / श्रेणी (Category)
                      </label>
                      <select
                        value={suggestWordForm.category}
                        onChange={(e) => setSuggestWordForm({...suggestWordForm, category: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="संज्ञा (Noun)">संज्ञा (Noun)</option>
                        <option value="क्रिया (Verb)">क्रिया (Verb)</option>
                        <option value="विशेषण (Adjective)">विशेषण (Adjective)</option>
                        <option value="मुहावरा (Idiom)">मुहावरा (Idiom)</option>
                        <option value="लोक-कहावत (Proverb)">लोक-कहावत (Proverb)</option>
                        <option value="अव्यय (Adverb)">अव्यय (Adverb)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        आपका नाम व जिला (Contributor)
                      </label>
                      <input
                        type="text"
                        value={suggestWordForm.contributor}
                        onChange={(e) => setSuggestWordForm({...suggestWordForm, contributor: e.target.value})}
                        placeholder="उदा. राजेश बारंगे (मुलताई)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      पँवारी वाक्य प्रयोग (Example Sentence in Pawari)
                    </label>
                    <input
                      type="text"
                      value={suggestWordForm.pawari_ex}
                      onChange={(e) => setSuggestWordForm({...suggestWordForm, pawari_ex: e.target.value})}
                      placeholder="उदा. हमारे डोकरा बाबा राम की कहानी सुनाते हैं..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      हिंदी वाक्य अनुवाद (Hindi Translation of Example)
                    </label>
                    <input
                      type="text"
                      value={suggestWordForm.hi_ex}
                      onChange={(e) => setSuggestWordForm({...suggestWordForm, hi_ex: e.target.value})}
                      placeholder="उदा. हमारे दादा जी श्री राम जी की कहानी सुनाते हैं..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowSuggestWordModal(false)}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-amber-50 font-bold rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>शब्द जमा करें (Submit Word)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 8: ALL-IN-ONE ADMIN PANEL MODAL ================= */}
      {showAdminRecordsModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-amber-400 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-amber-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold text-amber-100">
                    एडमिन डैशबोर्ड & डेटा प्रबंधन
                  </h2>
                  <p className="text-xs text-stone-400">
                    सुरक्षित एडमिन एक्सेस: क्विज़ रिकॉर्ड्स, संस्थान सदस्यता, सुझाव पेटी व शब्द स्वीकृति
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendOneClickEmailToRupesh}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer text-xs border border-amber-400/40"
                  title="सभी रिकॉर्ड्स रूपेश जी (rupeshpawar10@gmail.com) को ईमेल भेजें"
                >
                  <Mail className="w-4 h-4 text-stone-950" />
                  <span>✉️ रूपेश जी को 1-क्लिक ईमेल भेजें</span>
                </button>
                <button
                  onClick={() => setShowAdminRecordsModal(false)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Admin Tabs Bar */}
            <div className="bg-stone-100 p-2 border-b border-stone-200 flex flex-wrap gap-2 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setAdminTab('records')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'records'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>1. क्विज़ रिकॉर्ड्स ({adminQuizRecords.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('memberships')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'memberships'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2. संस्थान सदस्य ({adminMemberships.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('suggestions')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'suggestions'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>3. सुझाव पेटी ({adminSuggestions.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('pendingWords')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'pendingWords'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  4. शब्द स्वीकृति ({adminPendingWords.filter(w => w.status === 'pending').length} लंबित)
                </span>
              </button>

              <button
                onClick={() => setAdminTab('news')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'news'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Newspaper className="w-4 h-4 text-amber-500" />
                <span>5. 📰 समाचार व घोषणाएं ({newsItems.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('layoutSettings')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'layoutSettings'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>6. 🎨 वेबसाइट सेटिंग्स & लेआउट</span>
              </button>

              <button
                onClick={() => setAdminTab('editDictionary')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'editDictionary'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>7. 📖 2,740+ शब्द संपादक</span>
              </button>

              <button
                onClick={() => setAdminTab('security')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'security'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span>8. 🔒 सुरक्षा व PIN</span>
              </button>

              <button
                onClick={() => { setShowAdminRecordsModal(false); setShowAddWordModal(true); }}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-xl flex items-center gap-1.5 shadow cursor-pointer ml-auto shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>➕ नया शब्द</span>
              </button>
            </div>

            {/* Content Body based on Active Tab */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* TAB 1: QUIZ RECORDS */}
              {adminTab === 'records' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={recordSearchTerm}
                        onChange={(e) => setRecordSearchTerm(e.target.value)}
                        placeholder="परीक्षार्थी नाम या जिला खोजें..."
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleDownloadRecordsCSV}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-lg font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> Excel/CSV डाउनलोड
                      </button>
                      <button
                        onClick={handleClearQuizRecords}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold flex items-center gap-1 border border-rose-200 cursor-pointer text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> सारे रिकॉर्ड मिटाएं
                      </button>
                    </div>
                  </div>

                  {filteredQuizRecords.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                      <Users className="w-10 h-10 text-stone-400 mx-auto" />
                      <p className="font-bold text-sm text-stone-700">कोई क्विज़ रिकॉर्ड उपलब्ध नहीं है</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                            <th className="p-3 border-b border-stone-800">क्र.</th>
                            <th className="p-3 border-b border-stone-800">परीक्षार्थी नाम</th>
                            <th className="p-3 border-b border-stone-800">जिला / अंचल</th>
                            <th className="p-3 border-b border-stone-800">परीक्षा विषय</th>
                            <th className="p-3 border-b border-stone-800">अंक / प्रतिशत</th>
                            <th className="p-3 border-b border-stone-800">परिणाम</th>
                            <th className="p-3 border-b border-stone-800">प्रमाणपत्र ID</th>
                            <th className="p-3 border-b border-stone-800">दिनांक</th>
                            <th className="p-3 border-b border-stone-800 text-right">हटाएं</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white text-stone-800 font-medium">
                          {filteredQuizRecords.map((rec, idx) => (
                            <tr key={rec.id} className="hover:bg-amber-50/50 transition">
                              <td className="p-3 font-mono text-stone-500 text-[11px]">{idx + 1}</td>
                              <td className="p-3 font-bold text-stone-900">{rec.name}</td>
                              <td className="p-3 font-semibold text-amber-950">{rec.district}</td>
                              <td className="p-3 text-stone-700">
                                {rec.quizType === 'paheliyan' ? 'लोक-पहेलियाँ' : 'शब्दकोश'}
                              </td>
                              <td className="p-3 font-bold text-stone-900">
                                {rec.score} / 10 ({rec.percentage}%)
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  rec.score >= 7 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                    : 'bg-stone-100 text-stone-700 border border-stone-300'
                                }`}>
                                  {rec.status}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-amber-900">
                                {rec.certificateId || '—'}
                              </td>
                              <td className="p-3 text-[11px] text-stone-500 whitespace-nowrap">
                                {rec.date}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteSingleRecord(rec.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="रिकॉर्ड बताएं"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MEMBERSHIP APPLICATIONS */}
              {adminTab === 'memberships' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">
                        माँ ताप्ती शोध संस्थान मुलताई - सहभागिता / सदस्यता आवेदन
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        कुल जमा आवेदन: {adminMemberships.length}
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadMembershipsCSV}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-lg font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Excel/CSV डाउनलोड
                    </button>
                  </div>

                  {adminMemberships.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                      <Users className="w-10 h-10 text-stone-400 mx-auto" />
                      <p className="font-bold text-sm text-stone-700">कोई सदस्यता आवेदन प्राप्त नहीं हुआ है</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                            <th className="p-3 border-b border-stone-800">क्र.</th>
                            <th className="p-3 border-b border-stone-800">आवेदक का नाम</th>
                            <th className="p-3 border-b border-stone-800">मोबाइल / व्हाट्सएप</th>
                            <th className="p-3 border-b border-stone-800">जिला / अंचल</th>
                            <th className="p-3 border-b border-stone-800">पँवारी ज्ञान</th>
                            <th className="p-3 border-b border-stone-800">विशेष योगदान / विचार</th>
                            <th className="p-3 border-b border-stone-800">दिनांक</th>
                            <th className="p-3 border-b border-stone-800 text-right">हटाएं</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white text-stone-800 font-medium">
                          {adminMemberships.map((m, idx) => (
                            <tr key={m.id} className="hover:bg-amber-50/50 transition">
                              <td className="p-3 font-mono text-stone-500 text-[11px]">{idx + 1}</td>
                              <td className="p-3 font-bold text-stone-900">{m.name}</td>
                              <td className="p-3 font-mono text-amber-900 font-bold">{m.phone}</td>
                              <td className="p-3 font-semibold text-stone-800">{m.district}</td>
                              <td className="p-3 text-xs text-amber-950 font-bold">{m.knowsPawari}</td>
                              <td className="p-3 text-stone-600 max-w-xs truncate" title={m.otherDetails}>
                                {m.otherDetails}
                              </td>
                              <td className="p-3 text-[11px] text-stone-500 whitespace-nowrap">{m.date}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteMembership(m.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="आवेदन बताएं"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SUGGESTION BOX */}
              {adminTab === 'suggestions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">
                        सुझाव पेटी (Suggestion Box) संदेश
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        कुल प्राप्त सुझाव: {adminSuggestions.length}
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadSuggestionsCSV}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-lg font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Excel/CSV डाउनलोड
                    </button>
                  </div>

                  {adminSuggestions.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                      <Sparkles className="w-10 h-10 text-stone-400 mx-auto" />
                      <p className="font-bold text-sm text-stone-700">सुझाव पेटी में कोई संदेश दर्ज नहीं है</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                            <th className="p-3 border-b border-stone-800">क्र.</th>
                            <th className="p-3 border-b border-stone-800">प्रेषक का नाम</th>
                            <th className="p-3 border-b border-stone-800">जिला / संपर्क</th>
                            <th className="p-3 border-b border-stone-800">सुझाव / विचार</th>
                            <th className="p-3 border-b border-stone-800">दिनांक</th>
                            <th className="p-3 border-b border-stone-800 text-right">हटाएं</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white text-stone-800 font-medium">
                          {adminSuggestions.map((s, idx) => (
                            <tr key={s.id} className="hover:bg-amber-50/50 transition">
                              <td className="p-3 font-mono text-stone-500 text-[11px]">{idx + 1}</td>
                              <td className="p-3 font-bold text-stone-900">{s.name}</td>
                              <td className="p-3 font-semibold text-amber-950">{s.districtPhone}</td>
                              <td className="p-3 text-stone-800 font-normal">{s.suggestion}</td>
                              <td className="p-3 text-[11px] text-stone-500 whitespace-nowrap">{s.date}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteSuggestion(s.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="सुझाव बताएं"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PENDING WORDS APPROVAL */}
              {adminTab === 'pendingWords' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">
                        उपयोगकर्ताओं द्वारा सुझाए गए नए शब्द (Words Approval Box)
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        लंबित शब्दों को जांचकर 'स्वीकृत (Approve)' करें, जिससे वे सीधे मुख्य शब्दकोश में जुड़ जाएंगे।
                      </p>
                    </div>

                    <button
                      onClick={() => { setShowAdminRecordsModal(false); setShowSuggestWordModal(true); }}
                      className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-lg font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> नया शब्द फॉर्म खोलें
                    </button>
                  </div>

                  {adminPendingWords.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                      <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
                      <p className="font-bold text-sm text-stone-700">कोई लंबित शब्द सुझाव उपलब्ध नहीं है</p>
                      <p className="text-xs text-stone-500">जब भी कोई प्रयोक्ता 'नया शब्द सुझाएं' बटन से शब्द भेजेगा, वह यहाँ स्वीकृति हेतु दिखाई देगा।</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                            <th className="p-3 border-b border-stone-800">क्र.</th>
                            <th className="p-3 border-b border-stone-800">पँवारी शब्द</th>
                            <th className="p-3 border-b border-stone-800">हिंदी अर्थ</th>
                            <th className="p-3 border-b border-stone-800">श्रेणी</th>
                            <th className="p-3 border-b border-stone-800">उदाहरण वाक्य</th>
                            <th className="p-3 border-b border-stone-800">योगदानकर्ता</th>
                            <th className="p-3 border-b border-stone-800">स्थिति</th>
                            <th className="p-3 border-b border-stone-800 text-right">कार्रवाई (Action)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white text-stone-800 font-medium">
                          {adminPendingWords.map((w, idx) => (
                            <tr key={w.id} className="hover:bg-amber-50/50 transition">
                              <td className="p-3 font-mono text-stone-500 text-[11px]">{idx + 1}</td>
                              <td className="p-3 font-bold text-amber-950 text-sm">{w.pawari}</td>
                              <td className="p-3 font-semibold text-stone-900">{w.hi_meaning}</td>
                              <td className="p-3 text-stone-600">{w.category}</td>
                              <td className="p-3 text-stone-600 max-w-xs truncate" title={`${w.pawari_ex} (${w.hi_ex})`}>
                                "{w.pawari_ex}"
                              </td>
                              <td className="p-3 text-stone-700 font-bold">{w.contributor}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  w.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : w.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                }`}>
                                  {w.status === 'approved' ? '✓ स्वीकृत' : w.status === 'rejected' ? '✗ अस्वीकृत' : '⏳ लंबित (Pending)'}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {w.status !== 'approved' && (
                                    <button
                                      onClick={() => handleApprovePendingWord(w)}
                                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-emerald-50 rounded-lg text-[11px] font-bold shadow flex items-center gap-1 cursor-pointer"
                                      title="स्वीकृत कर शब्दकोश में जोड़ें"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> स्वीकृति
                                    </button>
                                  )}
                                  {w.status === 'pending' && (
                                    <button
                                      onClick={() => handleRejectPendingWord(w.id)}
                                      className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[11px] font-bold cursor-pointer"
                                      title="अस्वीकृत करें"
                                    >
                                      अस्वीकृत
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeletePendingWordRecord(w.id)}
                                    className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer ml-1"
                                    title="हटाएं"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: NEWS & ANNOUNCEMENTS MANAGER */}
              {adminTab === 'news' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-amber-700" />
                      समाचार व घोषणाएं पोस्ट करें (Post News / Announcement)
                    </h3>
                    <p className="text-stone-600 text-[11px]">
                      यहाँ से जोड़ा गया समाचार मुख्य पृष्ठ एवं 'समाचार व घोषणाएं' टैब पर तुरंत दिखाई देगा।
                    </p>

                    {newsSuccess && (
                      <div className="mt-2 p-2 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold border border-emerald-300">
                        ✓ समाचार सफलतापूर्वक प्रकाशित कर दिया गया!
                      </div>
                    )}

                    <form onSubmit={handleAddNewsSubmit} className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-800 mb-1">शीर्षक (Title) *</label>
                          <input
                            type="text"
                            required
                            value={newNewsForm.title}
                            onChange={(e) => setNewNewsForm({...newNewsForm, title: e.target.value})}
                            placeholder="उदा. पँवारी शब्दकोश का नया संस्करण जारी..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">श्रेणी (Category)</label>
                          <select
                            value={newNewsForm.category}
                            onChange={(e) => setNewNewsForm({...newNewsForm, category: e.target.value as NewsItem['category']})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                          >
                            <option value="समाचार">📰 समाचार</option>
                            <option value="घोषणा">📢 घोषणा</option>
                            <option value="कार्यक्रम">📅 कार्यक्रम</option>
                            <option value="शोध पत्र">📑 शोध पत्र</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 mb-1">समाचार विवरण / संदेश *</label>
                        <textarea
                          required
                          rows={3}
                          value={newNewsForm.content}
                          onChange={(e) => setNewNewsForm({...newNewsForm, content: e.target.value})}
                          placeholder="विस्तृत विवरण लिखें..."
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block font-bold text-stone-800 mb-1">लेखक / संस्था</label>
                            <input
                              type="text"
                              value={newNewsForm.author}
                              onChange={(e) => setNewNewsForm({...newNewsForm, author: e.target.value})}
                              placeholder="उदा. माँ ताप्ती शोध संस्थान"
                              className="p-2 bg-white border border-stone-300 rounded-lg text-xs w-48"
                            />
                          </div>

                          <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer mt-5">
                            <input
                              type="checkbox"
                              checked={newNewsForm.isImportant}
                              onChange={(e) => setNewNewsForm({...newNewsForm, isImportant: e.target.checked})}
                              className="w-4 h-4 text-amber-600 rounded"
                            />
                            <span>विशेष हाइलाइट (Highlight)</span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow cursor-pointer self-end"
                        >
                          ➕ प्रकाशित करें (Publish News)
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Posted News List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-xs">वर्तमान में प्रकाशित समाचार ({newsItems.length})</h4>
                    <div className="space-y-2">
                      {newsItems.map((item) => (
                        <div key={item.id} className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                {item.category}
                              </span>
                              <span className="text-stone-400 text-[10px]">{item.date}</span>
                              {item.isImportant && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  विशेष
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-stone-900 text-xs">{item.title}</h5>
                            <p className="text-stone-600 text-[11px] line-clamp-2">{item.content}</p>
                            <div className="text-[10px] text-stone-500 font-semibold">लेखक: {item.author}</div>
                          </div>

                          <button
                            onClick={() => handleDeleteNewsItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                            title="समाचार हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: WEBSITE LAYOUT & SITE SETTINGS */}
              {adminTab === 'layoutSettings' && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-700" />
                        वेबसाइट लेआउट व शीर्षक सेटिंग्स (Website Customization)
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        वेबसाइट का नाम, सब-टाइटल्स, ऊपर टिकर सूचना पट्टी और सभी सेक्शन को ऑन/ऑफ करें।
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Save className="w-4 h-4" /> सहेजें (Save Settings)
                    </button>
                  </div>

                  {settingsSavedSuccess && (
                    <div className="p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-xs text-center">
                      ✓ वेबसाइट सेटिंग्स सफलतापूर्व सहेज दी गईं!
                    </div>
                  )}

                  {/* 1. Header Titles & Taglines */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2">
                      1. मुख्य वेबसाइट शीर्षक व सब-टाइटल्स (Branding Titles)
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">मुख्य वेबसाइट शीर्षक (Main Title)</label>
                        <input
                          type="text"
                          value={siteSettings.siteTitle}
                          onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-serif font-bold text-amber-950"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 mb-1">संस्थान / सब-टाईटल (Sub-Title Line)</label>
                        <input
                          type="text"
                          value={siteSettings.siteSubtitle}
                          onChange={(e) => setSiteSettings({...siteSettings, siteSubtitle: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 mb-1">हेडर विवरण टैगलाइन (Header Tagline)</label>
                        <textarea
                          rows={2}
                          value={siteSettings.subHeaderTagline}
                          onChange={(e) => setSiteSettings({...siteSettings, subHeaderTagline: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Top Notification Ticker Banner */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2 flex items-center justify-between">
                      <span>2. शीर्ष सूचना पट्टी (Top Announcement Ticker)</span>
                      <label className="flex items-center gap-2 cursor-pointer text-amber-800 font-bold">
                        <input
                          type="checkbox"
                          checked={siteSettings.tickerActive}
                          onChange={(e) => setSiteSettings({...siteSettings, tickerActive: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <span>सूचना पट्टी सक्रिय रखें</span>
                      </label>
                    </h4>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">सूचना पट्टी संदेश (Ticker Message Text)</label>
                      <input
                        type="text"
                        value={siteSettings.tickerMessage}
                        onChange={(e) => setSiteSettings({...siteSettings, tickerMessage: e.target.value})}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* 3. Section Visibility Toggles */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2">
                      3. सेक्शन दृश्यता नियंत्रण (Section Visibility Toggles)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>आज का शब्द कार्ड</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showWordOfDay}
                          onChange={(e) => setSiteSettings({...siteSettings, showWordOfDay: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>समाचार व घोषणाएं सेक्शन</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showNewsSection}
                          onChange={(e) => setSiteSettings({...siteSettings, showNewsSection: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>माँ ताप्ती संस्थान कार्ड</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showShodhSansthanCard}
                          onChange={(e) => setSiteSettings({...siteSettings, showShodhSansthanCard: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>पहेलियाँ टैब</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showPaheliyanTab}
                          onChange={(e) => setSiteSettings({...siteSettings, showPaheliyanTab: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>ई-क्विज़ व प्रमाण-पत्र टैब</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showQuizTab}
                          onChange={(e) => setSiteSettings({...siteSettings, showQuizTab: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 7: LIVE DICTIONARY EDITOR (2,740+ WORDS) */}
              {adminTab === 'editDictionary' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        2,740+ शब्दकोश प्रविष्टियां संपादित करें (Edit Dictionary Words)
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        कोश के किसी भी शब्द का अर्थ, उच्चारण, व्याकरण श्रेणी या उदाहरण लाइव संशोधित करें।
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={dictSearchTerm}
                        onChange={(e) => setDictSearchTerm(e.target.value)}
                        placeholder="संपादित करने हेतु शब्द खोजें..."
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Word Edit Form Box if editing */}
                  {editingDictEntry && (
                    <form onSubmit={handleSaveDictionaryEdit} className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 space-y-3 shadow-lg animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h4 className="font-bold text-amber-950 text-sm">
                          ✏️ शब्द संपादित करें: <span className="text-amber-800 font-serif font-extrabold">{editingDictEntry.clean_word}</span>
                        </h4>
                        <button type="button" onClick={() => setEditingDictEntry(null)} className="text-stone-500 hover:text-stone-900 font-bold text-xs cursor-pointer">
                          रद्द करें (Cancel)
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-stone-800 mb-1">पँवारी शब्द (Clean Word)</label>
                          <input
                            type="text"
                            required
                            value={editingDictEntry.clean_word}
                            onChange={(e) => setEditingDictEntry({...editingDictEntry, clean_word: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">हिंदी अर्थ (Hindi Meaning)</label>
                          <input
                            type="text"
                            required
                            value={editingDictEntry.hi_meaning}
                            onChange={(e) => setEditingDictEntry({...editingDictEntry, hi_meaning: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">व्याकरण श्रेणी (POS)</label>
                          <input
                            type="text"
                            value={editingDictEntry.pos}
                            onChange={(e) => setEditingDictEntry({...editingDictEntry, pos: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-800 mb-1">पँवारी उदाहरण वाक्य</label>
                          <input
                            type="text"
                            value={editingDictEntry.pawari_ex}
                            onChange={(e) => setEditingDictEntry({...editingDictEntry, pawari_ex: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">हिंदी उदाहरण वाक्य</label>
                          <input
                            type="text"
                            value={editingDictEntry.hi_ex}
                            onChange={(e) => setEditingDictEntry({...editingDictEntry, hi_ex: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                        <button type="button" onClick={() => setEditingDictEntry(null)} className="px-4 py-1.5 bg-stone-200 text-stone-800 font-bold rounded-lg cursor-pointer">
                          रद्द करें
                        </button>
                        <button type="submit" className="px-5 py-1.5 bg-amber-800 text-white font-bold rounded-lg shadow cursor-pointer">
                          ✓ बदलाव सहेजें (Save Word Edits)
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Search Results List for Edit */}
                  <div className="max-h-96 overflow-y-auto rounded-xl border border-stone-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                          <th className="p-2.5 border-b border-stone-800">पँवारी शब्द</th>
                          <th className="p-2.5 border-b border-stone-800">हिंदी अर्थ</th>
                          <th className="p-2.5 border-b border-stone-800">श्रेणी</th>
                          <th className="p-2.5 border-b border-stone-800 text-right">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 bg-white font-medium">
                        {allEntries
                          .filter(e => !dictSearchTerm || e.clean_word.includes(dictSearchTerm) || e.hi_meaning.includes(dictSearchTerm))
                          .slice(0, 30)
                          .map(entry => (
                            <tr key={entry.clean_word} className="hover:bg-amber-50/40 transition">
                              <td className="p-2.5 font-bold text-amber-950 text-xs">{entry.clean_word}</td>
                              <td className="p-2.5 text-stone-800 text-xs">{entry.hi_meaning}</td>
                              <td className="p-2.5 text-stone-600 text-xs">{entry.pos}</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingDictEntry(entry)}
                                    className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded text-[11px] cursor-pointer"
                                  >
                                    ✏️ संपादित करें
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDictionaryEntry(entry.clean_word)}
                                    className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                                    title="हटाएं / छिपाएं"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 8: SECURITY & LOCK */}
              {adminTab === 'security' && (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                  <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                      <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl border border-amber-500/20">
                        <Key className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">एडमिन पासवर्ड / PIN सुरक्षा (Security Settings)</h3>
                        <p className="text-stone-500 text-xs">सुरक्षित एडमिन एक्सेस हेतु नया PIN निर्धारित करें।</p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium text-xs flex items-center justify-between">
                      <span>वर्तमान एडमिन स्थिति: <strong>सक्रिय (Logged In)</strong></span>
                      <button
                        onClick={handleAdminLogout}
                        className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        🔒 लॉगआउट एवं लॉक करें
                      </button>
                    </div>

                    {pinChangeSuccess && (
                      <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs text-center">
                        ✓ नया एडमिन पासवर्ड/PIN सफलतापूर्वक सहेज दिया गया!
                      </div>
                    )}

                    <form onSubmit={handleChangeAdminPinSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">नया पासवर्ड या 4-अंकी PIN दर्ज करें</label>
                        <input
                          type="password"
                          required
                          value={newAdminPin}
                          onChange={(e) => setNewAdminPin(e.target.value)}
                          placeholder="उदा. 7777 या नया पासवर्ड"
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow cursor-pointer text-xs"
                      >
                        🔑 पासवर्ड अपडेट करें (Update Security PIN)
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600">
              <div>
                माँ ताप्ती शोध संस्थान मुलताई • एडमिन कंट्रोल
              </div>
              <button
                onClick={() => setShowAdminRecordsModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-100 font-bold rounded-lg shadow cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
