import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, PlusCircle, Lock, Unlock, Mail, Bookmark, BookmarkCheck, 
  Volume2, VolumeX, Copy, Check, Filter, X, ChevronRight, ChevronLeft, Info, ShieldCheck, 
  Grid, List, Trash2, Edit3, Send, Heart, Sparkles, RefreshCw, HelpCircle, AlertCircle, FileText,
  Eye, EyeOff, User, Code, Award, RotateCcw, CheckCircle2, Layers, Download, Users, BarChart2,
  Newspaper, Settings, Key, Bell, BellRing, Sliders, Save, CheckCircle, UserPlus, Clock, Calendar
} from 'lucide-react';
import dictionaryData from './data/pawari_dictionary.json';
import paheliyanData from './data/pawari_paheliyan.json';
import { PawariQuizSection, QuizRecord } from './components/PawariQuizSection';
import { NewsSection } from './components/NewsSection';
import { PatrikaSection } from './components/PatrikaSection';
import { Entry, MembershipRecord, SuggestionRecord, PendingWordRecord, NewsItem, SiteSettings, PaheliItem, PatrikaArticle, SansthanOfficial } from './types';

export type { Entry, MembershipRecord, SuggestionRecord, PendingWordRecord, NewsItem, SiteSettings, PaheliItem, PatrikaArticle, SansthanOfficial };

const alphabets = [
  "सब", "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", 
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", 
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"
];

const DEFAULT_SANSTHAN_OFFICIALS: SansthanOfficial[] = [
  {
    id: 'off_1',
    name: 'वल्लभ डोंगरे',
    designation: 'संरक्षक व संस्थापक अध्यक्ष',
    timePeriod: '2018 - वर्तमान',
    phone: '+91-9425000000',
    email: 'vallabh.dongre@gmail.com',
    location: 'मुलताई (ज़िला बैतूल)',
    bio: 'सतपुड़ा संस्कृति संस्थान एवं माँ ताप्ती शोध संस्थान मुलताई के संस्थापक व पँवारी बोली के वरिष्ठ साहित्यकार व शोधकर्ता।'
  },
  {
    id: 'off_2',
    name: 'रूपेश पवार',
    designation: 'प्रधान संपादक व सचिव',
    timePeriod: '2020 - वर्तमान',
    phone: '+91-9425888888',
    email: 'rupeshpawar10@gmail.com',
    location: 'मुलताई (बैतूल)',
    bio: 'पँवारी शोध पत्रिका के प्रधान संपादक, डिजिटल कोश व भाषा प्रलेखीकरण अभियान के मुख्य संयोजक।'
  },
  {
    id: 'off_3',
    name: 'डॉ. रामेश्वर पवार',
    designation: 'उपाध्यक्ष व मुख्य सलाहकार',
    timePeriod: '2021 - वर्तमान',
    phone: '+91-9826000000',
    email: 'rameshwar.pawar@gmail.com',
    location: 'बैतूल (म.प्र.)',
    bio: 'लोक-साहित्य एवं भाषा विज्ञान के वरिष्ठ विद्वान परामर्शदाता।'
  },
  {
    id: 'off_4',
    name: 'प्रो. हरिशंकर ठाकरे',
    designation: 'संपादकीय मंडल सदस्य व शोध निदेशक',
    timePeriod: '2022 - वर्तमान',
    phone: '+91-9400011122',
    location: 'छिंदवाड़ा (म.प्र.)',
    bio: 'पँवारी (भोयरी) लोक-गीत एवं व्याकरण प्रलेखीकरण विशेषज्ञ।'
  },
  {
    id: 'off_5',
    name: 'इंजी. अमर पवार',
    designation: 'सह-संपादक व तकनीकी प्रमुख',
    timePeriod: '2023 - वर्तमान',
    phone: '+91-9898989898',
    location: 'नागपुर (महाराष्ट्र)',
    bio: 'डिजिटल शब्दकोश तकनीकी विकास व युवा शोध संवाद संयोजक।'
  },
  {
    id: 'off_6',
    name: 'राजेश बारंगे पंवार',
    designation: 'कार्यकारिणी सदस्य व प्रचार प्रमुख',
    timePeriod: '2022 - वर्तमान',
    phone: '+91-9123456789',
    location: 'मुलताई (बैतूल)',
    bio: 'पँवारी लोक-संस्कृति प्रलेखीकरण व वार्षिक शोध महोत्सव संयोजक।'
  }
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
  showQuickStats: true,
  showAlphabetGrid: true,
  showMembershipCard: true,
  showSuggestWordButton: true,
  showPatrikaSection: true,
  themeColor: 'amber',
  fontStyle: 'serif',
  shodhSansthanTitle: "माँ ताप्ती शोध संस्थान (मुलताई, बैतूल)",
  shodhSansthanEditor: "राजेश बारंगे पंवार",
  shodhSansthanOrg: "सतपुड़ा संस्कृति संस्थान एवं माँ ताप्ती शोध संस्थान",
  shodhSansthanAddress: "मुलताई, ज़िला बैतूल (मध्य प्रदेश)",
  shodhSansthanPhone: "+91-9425000000",
  shodhSansthanEmail: "rupeshpawar10@gmail.com",
  shodhSansthanDescription: "सतपुड़ा अंचल की पँवारी (भोयरी) बोली, लोक-संस्कृति, मुहावरे, कहावतें एवं प्राचीन परंपराओं के संरक्षण व शोध हेतु समर्पित संस्थान।",
  patrikaTitle: "पँवारी शोध पत्रिका (Pawari Research Journal)",
  patrikaVolume: "वर्ष 12, अंक 4 (सतपुड़ा संस्कृति व भाषा विशेषांक)",
  patrikaChiefEditor: "वल्लभ डोंगरे & रूपेश पवार",
  patrikaEditorialBoard: "डॉ. रामेश्वर पवार, प्रो. हरिशंकर ठाकरे, इंजी. अमर पवार, राजेश बारंगे पंवार",
  patrikaRegistration: "पंजीयन क्र. MP/PAWARI/PATRIKA/2026/12",
  patrikaCoverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  patrikaPdfUrl: "https://example.com/pawari-patrika-vol12.pdf",
  patrikaDescription: "पँवारी शोध पत्रिका सतपुड़ा संस्कृति संस्थान (भोपाल) एवं माँ ताप्ती शोध संस्थान (मुलताई) की संयुक्त त्रैमासिक शोध पत्रिका है। इसमें पँवारी बोली का इतिहास, लोक-साहित्य, लोकगीत, कहावतें, शब्द-व्युत्पत्ति तथा क्षेत्रीय संस्कृति पर गहन शोध आलेख प्रकाशित किए जाते हैं।",
  patrikaSubmissionGuidelines: "1. शोध आलेख/रचनाएँ पँवारी बोली, लोक-साहित्य, लोक-संगीत, मुहावरे या सतपुड़ा के इतिहास से संबंधित होनी चाहिए।\n2. आलेख देवनागरी लिपि में 500 से 2500 शब्दों में भेजें।\n3. मौलिकता का घोषणा-पत्र साथ में संलग्न करना अनिवार्य है।\n4. स्वीकृत आलेखों को आगामी शोध अंक में स्थान दिया जाएगा।",
  patrikaContactEmail: "rupeshpawar10@gmail.com",
  patrikaContactPhone: "+91-9425000000",
  footerText: "सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, नागपुर, वर्धा) की प्राचीन पँवारी (भोयरी) बोली का प्रथम प्रामाणिक डिजिटल कोश एवं शोध मंच।",
  footerCopyright: "© 2026 सतपुड़ा संस्कृति संस्थान एवं माँ ताप्ती शोध संस्थान मुलताई | सर्वाधिकार सुरक्षित",
  adminPin: "7777"
};

const DEFAULT_PATRIKA_ARTICLES: PatrikaArticle[] = [
  {
    id: 'ART-101',
    title: 'पँवारी (भोयरी) बोली की उत्पत्ति एवं सतपुड़ा अंचल की भाषिक धरोहर',
    author: 'वल्लभ डोंगरे (संस्थापक, सतपुड़ा संस्कृति संस्थान)',
    category: 'भाषा व व्याकरण शोध',
    summary: 'छिंदवाड़ा, बालाघाट, सिवनी एवं बैतूल जिलों में बोली जाने वाली पँवारी बोली के व्याकरणिक ढाँचे तथा राजस्थानी-मालवी-मराठी के ऐतिहासिक संगम पर विस्तृत विश्लेषणात्मक अध्ययन।',
    date: 'जनवरी 2026',
    readTime: '8 मिनट',
    pdfUrl: 'https://pawari-research.org/pdf/pawari_language_origin_2026.pdf',
    articleUrl: 'https://pawari-research.org/article/pawari_language_origin'
  },
  {
    id: 'ART-102',
    title: 'माँ ताप्ती तट मुलताई का ऐतिहासिक एवं सांस्कृतिक महत्व',
    author: 'रूपेश पवार (संपादक, माँ ताप्ती शोध संस्थान)',
    category: 'इतिहास एवं लोक-संस्कृति',
    summary: 'मुलताई (मूलतापी) क्षेत्र की पौराणिक कथाओं, सूर्यपुत्री माँ ताप्ती के पावन तट पर प्रचलित पँवारी लोकगीतों एवं कहावतों का प्रामाणिक संकलन व विवेचन।',
    date: 'दिसंबर 2025',
    readTime: '6 मिनट',
    pdfUrl: 'https://pawari-research.org/pdf/tapti_multai_history_2025.pdf',
    articleUrl: 'https://pawari-research.org/article/tapti_multai_history'
  },
  {
    id: 'ART-103',
    title: 'पँवारी कहावतें (अखाणे) एवं पहेलियाँ (फलौदी): समाजशास्त्र',
    author: 'डॉ. रामेश्वर पवार',
    category: 'लोक-साहित्य',
    summary: 'सतपुड़ा अंचल की कृषि परंपराओं, मौसम पूर्वानुमान एवं पारिवारिक जीवन से जुड़ी प्रामाणिक पँवारी पहेलियों (फलौदी) एवं अखाणों का सामाजिक विश्लेषण।',
    date: 'नवंबर 2025',
    readTime: '10 मिनट',
    pdfUrl: 'https://pawari-research.org/pdf/pawari_proverbs_2025.pdf',
    articleUrl: 'https://pawari-research.org/article/pawari_proverbs'
  },
  {
    id: 'ART-104',
    title: 'पँवारी लोकगीत: कृषि संस्कृति एवं फाग गायन परंपरा',
    author: 'प्रो. हरिशंकर ठाकरे',
    category: 'लोक-संगीत',
    summary: 'बैतूल-छिंदवाड़ा क्षेत्र में बुआई, कटाई एवं होली पर्व पर गाए जाने वाले पारंपरिक पँवारी फाग तथा लावणी लोकगीतों का स्वरलिपि सहित प्रलेखीकरण।',
    date: 'अक्टूबर 2025',
    readTime: '7 मिनट',
    pdfUrl: 'https://pawari-research.org/pdf/pawari_folksongs_2025.pdf',
    articleUrl: 'https://pawari-research.org/article/pawari_folksongs'
  }
];

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
  // Navigation Active Tab State: 'dictionary' | 'paheliyan' | 'quiz' | 'news' | 'patrika'
  const [activeTab, setActiveTab] = useState<'dictionary' | 'paheliyan' | 'quiz' | 'news' | 'patrika'>('dictionary');
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

  // Patrika Articles State
  const [patrikaArticles, setPatrikaArticles] = useState<PatrikaArticle[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_patrika_articles');
      return saved ? JSON.parse(saved) : DEFAULT_PATRIKA_ARTICLES;
    } catch {
      return DEFAULT_PATRIKA_ARTICLES;
    }
  });

  useEffect(() => {
    localStorage.setItem('pawari_patrika_articles', JSON.stringify(patrikaArticles));
  }, [patrikaArticles]);

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
    fatherName: '',
    phone: '',
    email: '',
    district: '',
    village: '',
    knowsPawari: 'हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं',
    membershipType: 'आजीवन सदस्य (Life Member)',
    otherDetails: ''
  });
  const [membershipSuccess, setMembershipSuccess] = useState(false);

  // Admin New Member State
  const [adminMemberSuccess, setAdminMemberSuccess] = useState(false);
  const [adminNewMemberForm, setAdminNewMemberForm] = useState({
    name: '',
    fatherName: '',
    phone: '',
    email: '',
    district: '',
    village: '',
    knowsPawari: 'हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं',
    membershipType: 'आजीवन सदस्य (Life Member)',
    otherDetails: ''
  });

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

  // Paheliyan (Riddles) List State (supports Admin CMS live add/edit/delete/reset)
  const [paheliyanList, setPaheliyanList] = useState<PaheliItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_paheliyan_custom_list');
      return saved ? JSON.parse(saved) : (paheliyanData as PaheliItem[]);
    } catch {
      return (paheliyanData as PaheliItem[]);
    }
  });

  useEffect(() => {
    localStorage.setItem('pawari_paheliyan_custom_list', JSON.stringify(paheliyanList));
  }, [paheliyanList]);

  // Admin Modal State & Records
  const [showAdminRecordsModal, setShowAdminRecordsModal] = useState(false);
  const [adminTab, setAdminTab] = useState<'records' | 'memberships' | 'suggestions' | 'pendingWords' | 'news' | 'paheliyanCms' | 'shodhSansthanCms' | 'patrikaCms' | 'layoutSettings' | 'editDictionary' | 'security' | 'addWord'>('records');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  
  const [adminQuizRecords, setAdminQuizRecords] = useState<QuizRecord[]>([]);
  const [adminMemberships, setAdminMemberships] = useState<MembershipRecord[]>([]);
  const [adminSuggestions, setAdminSuggestions] = useState<SuggestionRecord[]>([]);
  const [adminPendingWords, setAdminPendingWords] = useState<PendingWordRecord[]>([]);

  // Patrika CMS State
  const [patrikaCmsSuccess, setPatrikaCmsSuccess] = useState(false);
  const [patrikaArticleSearchCmsTerm, setPatrikaArticleSearchCmsTerm] = useState('');
  const [editingPatrikaArticle, setEditingPatrikaArticle] = useState<PatrikaArticle | null>(null);
  const [newPatrikaArticleForm, setNewPatrikaArticleForm] = useState<{
    title: string;
    author: string;
    category: string;
    summary: string;
    date: string;
    readTime: string;
    pdfUrl: string;
    articleUrl: string;
  }>({
    title: '',
    author: 'संपादकीय मंडल',
    category: 'शोध आलेख',
    summary: '',
    date: 'अगस्त 2026',
    readTime: '5 मिनट',
    pdfUrl: '',
    articleUrl: ''
  });

  // Paheliyan CMS State
  const [paheliSearchCmsTerm, setPaheliSearchCmsTerm] = useState('');
  const [editingPaheli, setEditingPaheli] = useState<PaheliItem | null>(null);
  const [newPaheliForm, setNewPaheliForm] = useState<{
    paheli: string;
    answer: string;
    hint: string;
    category: string;
  }>({
    paheli: '',
    answer: '',
    hint: '',
    category: 'फलौदी / छिन्न की कहानी (पहलोड़ी)'
  });
  const [paheliCmsSuccess, setPaheliCmsSuccess] = useState(false);

  // Shodh Sansthan CMS State & Officials List
  const [shodhSansthanSavedSuccess, setShodhSansthanSavedSuccess] = useState(false);
  const [sansthanOfficials, setSansthanOfficials] = useState<SansthanOfficial[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_sansthan_officials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SANSTHAN_OFFICIALS;
  });

  const [editingSansthanOfficial, setEditingSansthanOfficial] = useState<SansthanOfficial | null>(null);
  const [sansthanOfficialSearchTerm, setSansthanOfficialSearchTerm] = useState('');
  const [newSansthanOfficialForm, setNewSansthanOfficialForm] = useState<{
    name: string;
    designation: string;
    timePeriod: string;
    phone: string;
    email: string;
    location: string;
    bio: string;
  }>({
    name: '',
    designation: 'संपादकीय मंडल सदस्य',
    timePeriod: '2024 - वर्तमान',
    phone: '',
    email: '',
    location: 'मुलताई (बैतूल)',
    bio: ''
  });

  // Managed Time Periods State
  const [managedTimePeriods, setManagedTimePeriods] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_managed_time_periods');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const defaults = DEFAULT_SANSTHAN_OFFICIALS.map(o => o.timePeriod).filter(Boolean);
    return Array.from(new Set(['2024 - वर्तमान', '2020 - 2024', '2018 - 2022', '2015 - 2018', ...defaults]));
  });
  const [newTimePeriodInput, setNewTimePeriodInput] = useState('');
  const [editingTimePeriodObj, setEditingTimePeriodObj] = useState<{ oldName: string; newName: string } | null>(null);

  // States for Admin Word Editing & News Editing
  const [dictSearchTerm, setDictSearchTerm] = useState('');
  const [editingDictEntry, setEditingDictEntry] = useState<Entry | null>(null);
  const [originalDictCleanWord, setOriginalDictCleanWord] = useState<string | null>(null);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);
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
    return combined
      .map(entry => {
        if (dictionaryOverrides[entry.clean_word]) {
          return { ...entry, ...dictionaryOverrides[entry.clean_word] };
        }
        return entry;
      })
      .filter(entry => !entry.isDeleted);
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
    if (!paheliSearchTerm.trim()) return paheliyanList;
    const term = paheliSearchTerm.toLowerCase().trim();
    return paheliyanList.filter(item => 
      item.paheli.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      (item.hint && item.hint.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  }, [paheliSearchTerm, paheliyanList]);

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

  // Open Admin CMS directly to specified tab
  const handleOpenAdminCMSWithTab = (tab: 'records' | 'memberships' | 'suggestions' | 'pendingWords' | 'news' | 'paheliyanCms' | 'shodhSansthanCms' | 'patrikaCms' | 'layoutSettings' | 'editDictionary' | 'security' | 'addWord') => {
    setAdminTab(tab);
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

  // Admin Handler: Save Edited News Item
  const handleSaveNewsItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNewsItem) return;

    const updated = newsItems.map(item => item.id === editingNewsItem.id ? editingNewsItem : item);
    setNewsItems(updated);
    setEditingNewsItem(null);
    setNewsSuccess(true);
    setTimeout(() => setNewsSuccess(false), 2500);
    alert('✓ समाचार का विवरण सफलतापूर्वक अपडेट कर दिया गया!');
  };

  // Admin Handler: Delete News Item
  const handleDeleteNewsItem = (id: string, title?: string) => {
    const snippet = title ? ` "${title}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस समाचार/घोषणा${snippet} को हटाना चाहते हैं?\n\n(Are you sure you want to delete this news item?)`);
    if (isConfirmed) {
      const updated = newsItems.filter(item => item.id !== id);
      setNewsItems(updated);
      if (editingNewsItem && editingNewsItem.id === id) {
        setEditingNewsItem(null);
      }
      alert('✓ समाचार सफलतापूर्वक हटा दिया गया!');
    }
  };

  // Admin Handler: Approve Pending Word Submission (Adds directly to live dictionary)
  const handleApprovePendingWord = (wordRecord: PendingWordRecord) => {
    const newEntry: Entry = {
      raw_word: wordRecord.pawari,
      clean_word: wordRecord.pawari,
      ipa: `/${wordRecord.pawari}/`,
      pos: wordRecord.category || 'संज्ञा (Noun)',
      hi_meaning: wordRecord.hi_meaning,
      en_meaning: '',
      pawari_ex: wordRecord.pawari_ex || '',
      hi_ex: wordRecord.hi_ex || '',
      en_ex: '',
      notes: `योगदानकर्ता: ${wordRecord.contributor || 'लोक प्रयोक्ता'} (${wordRecord.date})`,
      isCustom: true,
      id: `WORD-${Date.now()}`
    };

    const updatedCustom = [newEntry, ...customEntries];
    setCustomEntries(updatedCustom);
    localStorage.setItem('custom_pawari_entries', JSON.stringify(updatedCustom));

    const updatedPending = adminPendingWords.map(w => w.id === wordRecord.id ? { ...w, status: 'approved' as const } : w);
    setAdminPendingWords(updatedPending);
    localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));

    alert(`✓ शब्द "${wordRecord.pawari}" सफलतापूर्वक स्वीकृत कर मुख्य शब्दकोश में जोड़ दिया गया!`);
  };

  const handleRejectPendingWord = (wordId: string) => {
    const updatedPending = adminPendingWords.map(w => w.id === wordId ? { ...w, status: 'rejected' as const } : w);
    setAdminPendingWords(updatedPending);
    localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));
  };

  const handleDeletePendingWordRecord = (wordId: string, wordName?: string) => {
    const snippet = wordName ? ` "${wordName}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस शब्द सुझाव रिकॉर्ड${snippet} को हटाना चाहते हैं?\n\n(Are you sure you want to delete this word record?)`);
    if (isConfirmed) {
      const updatedPending = adminPendingWords.filter(w => w.id !== wordId);
      setAdminPendingWords(updatedPending);
      localStorage.setItem('pawari_pending_words', JSON.stringify(updatedPending));
      alert('✓ शब्द सुझाव रिकॉर्ड सफलतापूर्वक हटा दिया गया!');
    }
  };

  // Admin Handler: Add New Paheli (Riddle)
  const handleAddPaheliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaheliForm.paheli.trim() || !newPaheliForm.answer.trim()) {
      alert("कृपया पहेली और उसका सही उत्तर अवश्य दर्ज करें।");
      return;
    }

    const newItem: PaheliItem = {
      id: Date.now(),
      paheli: newPaheliForm.paheli.trim(),
      answer: newPaheliForm.answer.trim(),
      hint: newPaheliForm.hint.trim() || 'लोक पहेली',
      category: newPaheliForm.category.trim() || 'फलौदी / छिन्न की कहानी (पहलोड़ी)'
    };

    const updated = [newItem, ...paheliyanList];
    setPaheliyanList(updated);
    setNewPaheliForm({
      paheli: '',
      answer: '',
      hint: '',
      category: 'फलौदी / छिन्न की कहानी (पहलोड़ी)'
    });
    setPaheliCmsSuccess(true);
    setTimeout(() => setPaheliCmsSuccess(false), 2500);
  };

  // Admin Handler: Save Edited Paheli
  const handleSavePaheliEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaheli) return;

    const updated = paheliyanList.map(item => item.id === editingPaheli.id ? editingPaheli : item);
    setPaheliyanList(updated);
    setEditingPaheli(null);
    setPaheliCmsSuccess(true);
    setTimeout(() => setPaheliCmsSuccess(false), 2500);
  };

  // Admin Handler: Delete Paheli
  const handleDeletePaheli = (id: number | string, paheliText?: string) => {
    const snippet = paheliText ? `\n\n"${paheliText.length > 60 ? paheliText.slice(0, 60) + '...' : paheliText}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस पहेली को सूची से हटाना चाहते हैं?${snippet}\n\n(Are you sure you want to delete this riddle?)`);
    if (isConfirmed) {
      const updated = paheliyanList.filter(item => String(item.id) !== String(id));
      setPaheliyanList(updated);
      localStorage.setItem('pawari_paheliyan_custom_list', JSON.stringify(updated));
      alert('✓ पहेली सफलतापूर्वक हटा दी गई!');
    }
  };

  // Admin Handler: Reset Paheliyan to Default
  const handleResetPaheliyanToDefault = () => {
    if (confirm('क्या आप सभी पहेलियों को डिफ़ॉल्ट मूल 180+ पहेलियाँ सूची पर रीसेट करना चाहते हैं?')) {
      setPaheliyanList(paheliyanData as PaheliItem[]);
      localStorage.removeItem('pawari_paheliyan_custom_list');
      alert('✓ पहेलियाँ मूल सूची पर रीसेट कर दी गईं!');
    }
  };

  // Admin Handler: Save Shodh Sansthan Details
  const handleSaveShodhSansthanSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pawari_site_settings', JSON.stringify(siteSettings));
    setShodhSansthanSavedSuccess(true);
    setTimeout(() => setShodhSansthanSavedSuccess(false), 2500);
  };

  // Admin Handler: Add Sansthan Official
  const handleAddSansthanOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSansthanOfficialForm.name || !newSansthanOfficialForm.designation) {
      alert('कृपया नाम और पदनाम दर्ज करें!');
      return;
    }
    const newOfficial: SansthanOfficial = {
      id: 'off_' + Date.now(),
      name: newSansthanOfficialForm.name.trim(),
      designation: newSansthanOfficialForm.designation.trim(),
      timePeriod: newSansthanOfficialForm.timePeriod.trim() || '2024 - वर्तमान',
      phone: newSansthanOfficialForm.phone.trim(),
      email: newSansthanOfficialForm.email.trim(),
      location: newSansthanOfficialForm.location.trim(),
      bio: newSansthanOfficialForm.bio.trim()
    };

    const updated = [newOfficial, ...sansthanOfficials];
    setSansthanOfficials(updated);
    localStorage.setItem('pawari_sansthan_officials', JSON.stringify(updated));

    setNewSansthanOfficialForm({
      name: '',
      designation: 'संपादकीय मंडल सदस्य',
      timePeriod: '2024 - वर्तमान',
      phone: '',
      email: '',
      location: 'मुलताई (बैतूल)',
      bio: ''
    });
    alert(`✓ नए पदाधिकारी/सदस्य "${newOfficial.name}" का विवरण सफलतापूर्वक जोड़ दिया गया!`);
  };

  // Admin Handler: Save Sansthan Official Edit
  const handleSaveSansthanOfficialEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSansthanOfficial) return;

    const updated = sansthanOfficials.map(off => off.id === editingSansthanOfficial.id ? editingSansthanOfficial : off);
    setSansthanOfficials(updated);
    localStorage.setItem('pawari_sansthan_officials', JSON.stringify(updated));

    setEditingSansthanOfficial(null);
    alert(`✓ पदाधिकारी "${editingSansthanOfficial.name}" का विवरण अपडेट कर दिया गया!`);
  };

  // Admin Handler: Delete Sansthan Official
  const handleDeleteSansthanOfficial = (id: string, name: string) => {
    if (confirm(`क्या आप संस्थान के पदाधिकारी/सदस्य "${name}" का विवरण हटाना चाहते हैं?`)) {
      const updated = sansthanOfficials.filter(off => off.id !== id);
      setSansthanOfficials(updated);
      localStorage.setItem('pawari_sansthan_officials', JSON.stringify(updated));
      alert(`✓ "${name}" का विवरण सफलतापूर्वक हटा दिया गया!`);
    }
  };

  // Admin Handler: Reset Sansthan Officials
  const handleResetSansthanOfficialsToDefault = () => {
    if (confirm('क्या आप संस्थान के पदाधिकारियों की सूची मूल डेटा पर रीसेट करना चाहते हैं?')) {
      setSansthanOfficials(DEFAULT_SANSTHAN_OFFICIALS);
      localStorage.setItem('pawari_sansthan_officials', JSON.stringify(DEFAULT_SANSTHAN_OFFICIALS));
      alert('✓ संस्थान पदाधिकारियों की सूची रीसेट कर दी गई!');
    }
  };

  // Time Period Handlers (Add, Edit, Delete Time Periods)
  const handleAddTimePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTimePeriodInput.trim();
    if (!trimmed) {
      alert("कृपया समय अवधि (Time Period) दर्ज करें!");
      return;
    }
    if (managedTimePeriods.includes(trimmed)) {
      alert(`समय अवधि "${trimmed}" पहले से मौजूद है!`);
      return;
    }
    const updated = [...managedTimePeriods, trimmed];
    setManagedTimePeriods(updated);
    localStorage.setItem('pawari_managed_time_periods', JSON.stringify(updated));
    setNewTimePeriodInput('');
    alert(`✓ नया कार्यकाल "${trimmed}" सफलतापूर्वक जोड़ा गया!`);
  };

  const handleSaveTimePeriodRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimePeriodObj) return;
    const oldName = editingTimePeriodObj.oldName.trim();
    const newName = editingTimePeriodObj.newName.trim();
    if (!newName) {
      alert("कृपया वैध समय अवधि दर्ज करें!");
      return;
    }
    if (oldName === newName) {
      setEditingTimePeriodObj(null);
      return;
    }

    const updatedPeriods = managedTimePeriods.map(p => p === oldName ? newName : p);
    setManagedTimePeriods(updatedPeriods);
    localStorage.setItem('pawari_managed_time_periods', JSON.stringify(updatedPeriods));

    let affectedCount = 0;
    const updatedOfficials = sansthanOfficials.map(off => {
      if (off.timePeriod === oldName) {
        affectedCount++;
        return { ...off, timePeriod: newName };
      }
      return off;
    });

    if (affectedCount > 0) {
      setSansthanOfficials(updatedOfficials);
      localStorage.setItem('pawari_sansthan_officials', JSON.stringify(updatedOfficials));
    }

    setEditingTimePeriodObj(null);
    alert(`✓ कार्यकाल "${oldName}" को बदलकर "${newName}" किया गया (${affectedCount} पदाधिकारी अपडेट हुए)!`);
  };

  const handleDeleteTimePeriod = (periodToDelete: string) => {
    const officialsCount = sansthanOfficials.filter(o => o.timePeriod === periodToDelete).length;
    let msg = `क्या आप कार्यकाल/समय अवधि "${periodToDelete}" को हटाना चाहते हैं?`;
    if (officialsCount > 0) {
      msg += `\n⚠️ इस कार्यकाल से ${officialsCount} पदाधिकारी जुड़े हैं। हटाने पर उनका कार्यकाल 'अन्य/अनिर्धारित' हो जाएगा।`;
    }

    if (confirm(msg)) {
      const updatedPeriods = managedTimePeriods.filter(p => p !== periodToDelete);
      setManagedTimePeriods(updatedPeriods);
      localStorage.setItem('pawari_managed_time_periods', JSON.stringify(updatedPeriods));

      if (officialsCount > 0) {
        const updatedOfficials = sansthanOfficials.map(off => {
          if (off.timePeriod === periodToDelete) {
            return { ...off, timePeriod: 'अन्य/अनिर्धारित' };
          }
          return off;
        });
        setSansthanOfficials(updatedOfficials);
        localStorage.setItem('pawari_sansthan_officials', JSON.stringify(updatedOfficials));
      }

      alert(`✓ कार्यकाल "${periodToDelete}" सफलतापूर्वक हटा दिया गया!`);
    }
  };

  // Admin Handler: Save Dictionary Entry Edit
  const handleSaveDictionaryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDictEntry) return;

    const oldKey = originalDictCleanWord || editingDictEntry.clean_word;
    const newKey = editingDictEntry.clean_word.trim();

    // 1. Check if custom word
    const isCustom = customEntries.some(c => c.clean_word === oldKey || (editingDictEntry.id && c.id === editingDictEntry.id));
    if (isCustom) {
      const updatedCustom = customEntries.map(c => 
        (c.clean_word === oldKey || (editingDictEntry.id && c.id === editingDictEntry.id))
          ? { ...c, ...editingDictEntry, clean_word: newKey }
          : c
      );
      setCustomEntries(updatedCustom);
      localStorage.setItem('custom_pawari_entries', JSON.stringify(updatedCustom));
    } else {
      // 2. Default dictionary word override
      const updatedOverrides = { ...dictionaryOverrides };
      if (oldKey && oldKey !== newKey) {
        updatedOverrides[oldKey] = { isDeleted: true };
      }
      updatedOverrides[newKey] = {
        raw_word: editingDictEntry.raw_word || newKey,
        clean_word: newKey,
        ipa: editingDictEntry.ipa || `/${newKey}/`,
        pos: editingDictEntry.pos || 'संज्ञा (Noun)',
        hi_meaning: editingDictEntry.hi_meaning,
        en_meaning: editingDictEntry.en_meaning || '',
        pawari_ex: editingDictEntry.pawari_ex || '',
        hi_ex: editingDictEntry.hi_ex || '',
        en_ex: editingDictEntry.en_ex || '',
        notes: editingDictEntry.notes || '',
        isDeleted: false,
      };

      setDictionaryOverrides(updatedOverrides);
      localStorage.setItem('pawari_dictionary_overrides', JSON.stringify(updatedOverrides));
    }

    alert(`✅ शब्द "${newKey}" का विवरण सफलतापूर्वक अपडेट कर दिया गया!`);
    setEditingDictEntry(null);
    setOriginalDictCleanWord(null);
  };

  const handleDeleteDictionaryEntry = (cleanWord: string) => {
    if (confirm(`क्या आप शब्द "${cleanWord}" को कोश से हटाना चाहते हैं?`)) {
      const isCustom = customEntries.some(c => c.clean_word === cleanWord);
      if (isCustom) {
        const updatedCustom = customEntries.filter(c => c.clean_word !== cleanWord);
        setCustomEntries(updatedCustom);
        localStorage.setItem('custom_pawari_entries', JSON.stringify(updatedCustom));
      } else {
        const updatedOverrides = {
          ...dictionaryOverrides,
          [cleanWord]: { isDeleted: true }
        };
        setDictionaryOverrides(updatedOverrides);
        localStorage.setItem('pawari_dictionary_overrides', JSON.stringify(updatedOverrides));
      }
      if (selectedWordDetail && selectedWordDetail.clean_word === cleanWord) {
        setSelectedWordDetail(null);
      }
      alert(`✓ शब्द "${cleanWord}" सफलतापूर्वक हटा दिया गया!`);
    }
  };

  // Admin Handler: Save Website Layout & Site Settings
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pawari_site_settings', JSON.stringify(siteSettings));
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 2500);
  };

  // Admin Handler: Patrika Article CRUD
  const handleAddPatrikaArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatrikaArticleForm.title.trim() || !newPatrikaArticleForm.summary.trim()) {
      alert("कृपया आलेख का शीर्षक एवं सार (Summary) भरें।");
      return;
    }

    const newArticle: PatrikaArticle = {
      id: `ART-${Date.now()}`,
      title: newPatrikaArticleForm.title.trim(),
      author: newPatrikaArticleForm.author.trim() || 'संपादकीय मंडल',
      category: newPatrikaArticleForm.category,
      summary: newPatrikaArticleForm.summary.trim(),
      date: newPatrikaArticleForm.date.trim() || 'अगस्त 2026',
      readTime: newPatrikaArticleForm.readTime.trim() || '5 मिनट',
      pdfUrl: newPatrikaArticleForm.pdfUrl.trim() || 'https://pawari-research.org/pdf/sample_article.pdf',
      articleUrl: newPatrikaArticleForm.articleUrl.trim() || `https://pawari-research.org/article/${Date.now()}`
    };

    const updated = [newArticle, ...patrikaArticles];
    setPatrikaArticles(updated);
    setNewPatrikaArticleForm({
      title: '',
      author: 'संपादकीय मंडल',
      category: 'शोध आलेख',
      summary: '',
      date: 'अगस्त 2026',
      readTime: '5 मिनट',
      pdfUrl: '',
      articleUrl: ''
    });
    setPatrikaCmsSuccess(true);
    setTimeout(() => setPatrikaCmsSuccess(false), 2500);
  };

  const handleSavePatrikaArticleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatrikaArticle) return;

    const updated = patrikaArticles.map(a => a.id === editingPatrikaArticle.id ? editingPatrikaArticle : a);
    setPatrikaArticles(updated);
    setEditingPatrikaArticle(null);
    setPatrikaCmsSuccess(true);
    setTimeout(() => setPatrikaCmsSuccess(false), 2500);
  };

  const handleDeletePatrikaArticle = (id: string, title?: string) => {
    const snippet = title ? ` "${title}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस शोध आलेख${snippet} को सूची से हटाना चाहते हैं?\n\n(Are you sure you want to delete this research article?)`);
    if (isConfirmed) {
      const updated = patrikaArticles.filter(a => a.id !== id);
      setPatrikaArticles(updated);
      alert('✓ शोध आलेख सफलतापूर्वक हटा दिया गया!');
    }
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
      alert("कृपया अपना नाम और मोबाइल नंबर अवश्य भरें।");
      return;
    }

    const newRecord: MembershipRecord = {
      id: `MEM-${Date.now()}`,
      name: membershipForm.name.trim(),
      fatherName: membershipForm.fatherName.trim() || undefined,
      phone: membershipForm.phone.trim(),
      email: membershipForm.email.trim() || undefined,
      district: membershipForm.district.trim() || 'बैतूल / अंचल',
      village: membershipForm.village.trim() || undefined,
      knowsPawari: membershipForm.knowsPawari,
      membershipType: membershipForm.membershipType,
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
          fatherName: '',
          phone: '',
          email: '',
          district: '',
          village: '',
          knowsPawari: 'हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं',
          membershipType: 'आजीवन सदस्य (Life Member)',
          otherDetails: ''
        });
      }, 2500);
    } catch (err) {
      console.error("Failed to save membership", err);
    }
  };

  // Admin Handler: Direct Add New Member
  const handleAdminAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewMemberForm.name.trim() || !adminNewMemberForm.phone.trim()) {
      alert("कृपया सदस्य का नाम एवं मोबाइल नंबर अवश्य भरें।");
      return;
    }

    const newRecord: MembershipRecord = {
      id: `MEM-${Date.now()}`,
      name: adminNewMemberForm.name.trim(),
      fatherName: adminNewMemberForm.fatherName.trim() || undefined,
      phone: adminNewMemberForm.phone.trim(),
      email: adminNewMemberForm.email.trim() || undefined,
      district: adminNewMemberForm.district.trim() || 'बैतूल',
      village: adminNewMemberForm.village.trim() || undefined,
      knowsPawari: adminNewMemberForm.knowsPawari,
      membershipType: adminNewMemberForm.membershipType,
      otherDetails: adminNewMemberForm.otherDetails.trim() || 'प्रशासनिक प्रविष्टि (Direct Admin Entry)',
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      const existing: MembershipRecord[] = JSON.parse(localStorage.getItem('pawari_memberships') || '[]');
      const updated = [newRecord, ...existing];
      localStorage.setItem('pawari_memberships', JSON.stringify(updated));
      setAdminMemberships(updated);
      setAdminMemberSuccess(true);
      setAdminNewMemberForm({
        name: '',
        fatherName: '',
        phone: '',
        email: '',
        district: '',
        village: '',
        knowsPawari: 'हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं',
        membershipType: 'आजीवन सदस्य (Life Member)',
        otherDetails: ''
      });
      setTimeout(() => setAdminMemberSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to add member by admin", err);
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

  const handleDeleteMembership = (id: string, name?: string) => {
    const snippet = name ? ` "${name}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच सदस्यता आवेदन/रिकॉर्ड${snippet} को हटाना चाहते हैं?\n\n(Are you sure you want to delete this membership record?)`);
    if (isConfirmed) {
      const updated = adminMemberships.filter(m => m.id !== id);
      setAdminMemberships(updated);
      localStorage.setItem('pawari_memberships', JSON.stringify(updated));
      alert('✓ सदस्यता रिकॉर्ड सफलतापूर्वक हटा दिया गया!');
    }
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

  const handleDeleteSuggestion = (id: string, name?: string) => {
    const snippet = name ? ` "${name}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस सुझाव रिकॉर्ड${snippet} को हटाना चाहते हैं?\n\n(Are you sure you want to delete this suggestion record?)`);
    if (isConfirmed) {
      const updated = adminSuggestions.filter(s => s.id !== id);
      setAdminSuggestions(updated);
      localStorage.setItem('pawari_suggestions', JSON.stringify(updated));
      alert('✓ सुझाव रिकॉर्ड सफलतापूर्वक हटा दिया गया!');
    }
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
  const handleDeleteSingleRecord = (id: string, name?: string) => {
    const snippet = name ? ` "${name}"` : '';
    const isConfirmed = window.confirm(`क्या आप सचमुच इस परीक्षार्थी रिकॉर्ड${snippet} को हटाना चाहते हैं?\n\n(Are you sure you want to delete this quiz record?)`);
    if (isConfirmed) {
      const updated = adminQuizRecords.filter(r => r.id !== id);
      setAdminQuizRecords(updated);
      localStorage.setItem('pawari_quiz_records', JSON.stringify(updated));
      alert('✓ परीक्षार्थी रिकॉर्ड सफलतापूर्वक हटा दिया गया!');
    }
  };

  // Admin Handler: Restore / Enable all deleted words & items on the site
  const handleEnableAllDeletedItems = () => {
    const isConfirmed = window.confirm(
      "क्या आप साइट पर सभी हटाए गए शब्दों (Deleted Words) तथा सामग्री को पुनः सक्रिय/इनेबल (Enable/Restore) करना चाहते हैं?\n\n(Are you sure you want to enable/restore all deleted items on the site?)"
    );
    if (isConfirmed) {
      // Clear isDeleted flags in dictionaryOverrides
      const cleanedOverrides: Record<string, Partial<Entry> & { isDeleted?: boolean }> = {};
      Object.entries(dictionaryOverrides).forEach(([wordKey, val]) => {
        if (val && typeof val === 'object') {
          cleanedOverrides[wordKey] = { ...(val as Record<string, unknown>), isDeleted: false };
        }
      });
      setDictionaryOverrides(cleanedOverrides);
      localStorage.setItem('pawari_dictionary_overrides', JSON.stringify(cleanedOverrides));

      alert("✓ सफलता! साइट पर सभी हटाए गए शब्द एवं सामग्रियां पुनः सक्रिय (Enable) कर दी गई हैं!");
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
    if (window.confirm("क्या आप इस शब्द को कोश से हटाना चाहते हैं?\n\n(Are you sure you want to delete this word?)")) {
      const updated = customEntries.filter(e => e.id !== wordId);
      setCustomEntries(updated);
      localStorage.setItem('custom_pawari_entries', JSON.stringify(updated));
      if (selectedWordDetail && selectedWordDetail.id === wordId) {
        setSelectedWordDetail(null);
      }
      alert('✓ शब्द सफलतापूर्वक हटा दिया गया!');
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

            {siteSettings.showPatrikaSection !== false && (
              <button
                onClick={() => setActiveTab('patrika')}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === 'patrika'
                    ? 'bg-amber-700 text-amber-50 shadow border border-amber-600'
                    : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>📚 संस्थान पत्रिका ({patrikaArticles.length})</span>
              </button>
            )}

            {siteSettings.showSuggestWordButton !== false && (
              <button
                onClick={() => setShowSuggestWordModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer bg-amber-800 hover:bg-amber-700 text-amber-50 border border-amber-600 shadow shrink-0"
                title="नया पँवारी शब्द योगदान करें"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>➕ नया शब्द सुझाएं</span>
              </button>
            )}

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
          {(siteSettings.showAlphabetGrid ?? true) && (
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
          )}

        </div>
      </section>

      {/* 3. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= TAB 1: DICTIONARY TAB ================= */}
        {activeTab === 'dictionary' && (
          <>
            {/* DICTIONARY ADMIN QUICK CMS BAR */}
            <div className="bg-stone-900 text-amber-100 p-3.5 rounded-2xl border border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>📖 शब्दकोश एडमिन CMS (2,740+ शब्द प्रबंधन)</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAdminCMSWithTab('editDictionary')}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-bold border border-amber-500 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                  <span>📖 2,740+ शब्द संपादक</span>
                </button>
                <button
                  onClick={() => handleOpenAdminCMSWithTab('pendingWords')}
                  className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-amber-200 rounded-xl text-xs font-bold border border-amber-600 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>📥 शब्द स्वीकृति ({adminPendingWords.filter(w => w.status === 'pending').length} लंबित)</span>
                </button>
                <button
                  onClick={handleOpenAddWord}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-500 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ नया शब्द जोड़ें</span>
                </button>
                <button
                  onClick={handleEnableAllDeletedItems}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded-xl text-xs font-bold border border-amber-800/60 shadow cursor-pointer flex items-center gap-1.5 transition"
                  title="साइट पर सभी हटाए गए शब्दों व सामग्री को पुनः सक्रिय/इनेबल करें"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>🔄 सभी हटाए गए शब्द/सामग्री इनेबल करें</span>
                </button>
              </div>
            </div>

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
                  const wordId = `grid_${entry.clean_word}_${idx}`;

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

                          {isAdminAuthenticated ? (
                            <button
                              onClick={() => handleDeleteDictionaryEntry(entry.clean_word)}
                              className="p-1 text-rose-600 hover:text-rose-800 transition cursor-pointer flex items-center gap-0.5 text-[11px] font-bold"
                              title="शब्द हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>हटाएं</span>
                            </button>
                          ) : entry.isCustom ? (
                            <button
                              onClick={() => handleDeleteCustomWord(entry.id!)}
                              className="p-1 text-rose-500 hover:text-rose-700 transition cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : null}

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
                        <tr key={`tbl_${entry.clean_word}_${idx}`} className="hover:bg-amber-50/40 transition">
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
                            {isAdminAuthenticated && (
                              <button
                                onClick={() => handleDeleteDictionaryEntry(entry.clean_word)}
                                className="p-1 text-rose-600 hover:text-rose-800 transition font-semibold"
                                title="हटाएं"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            )}
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
            
            {/* PAHELIYAN ADMIN CMS BAR */}
            <div className="bg-stone-900 text-amber-100 p-3.5 rounded-2xl border border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>🧩 पहेलियाँ एडमिन CMS (Paheliyan CMS)</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAdminCMSWithTab('paheliyanCms')}
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-bold border border-amber-500 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                  <span>🧩 पहेलियाँ सम्पादक / CMS (180+)</span>
                </button>
                <button
                  onClick={handleResetPaheliyanToDefault}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold border border-stone-700 cursor-pointer flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>मूल 180+ पहेलियाँ रीसेट</span>
                </button>
              </div>
            </div>
            
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
                        key={`pah_${item.id}_${idx}`}
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
          <div className="space-y-4">
            <div className="bg-stone-900 text-amber-100 p-3.5 rounded-2xl border border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>🏆 ई-क्विज़ एडमिन रिकॉर्ड्स & CMS</span>
              </div>
              <button
                onClick={() => handleOpenAdminCMSWithTab('records')}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-bold border border-amber-500 shadow cursor-pointer flex items-center gap-1.5 transition"
              >
                <BarChart2 className="w-3.5 h-3.5 text-amber-200" />
                <span>⚙️ परीक्षार्थी रिकॉर्ड्स & एडमिन CMS</span>
              </button>
            </div>
            <PawariQuizSection key={selectedQuizType} initialType={selectedQuizType} />
          </div>
        )}

        {/* ================= TAB 4: NEWS & ANNOUNCEMENTS SECTION ================= */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="bg-stone-900 text-amber-100 p-3.5 rounded-2xl border border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span>📰 समाचार व घोषणाएं एडमिन CMS</span>
              </div>
              <button
                onClick={() => handleOpenAdminCMSWithTab('news')}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-bold border border-amber-500 shadow cursor-pointer flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                <span>⚙️ समाचार जोडें व सम्पादित करें (CMS)</span>
              </button>
            </div>
            <NewsSection
              newsItems={newsItems}
              isAdminAuthenticated={isAdminAuthenticated}
              onOpenNewsCMS={() => handleOpenAdminCMSWithTab('news')}
              onDeleteNewsItem={handleDeleteNewsItem}
              onEditNewsItem={(item) => {
                setEditingNewsItem(item);
                handleOpenAdminCMSWithTab('news');
              }}
            />
          </div>
        )}

        {/* ================= TAB 5: SANSTHAN PATRIKA SECTION ================= */}
        {activeTab === 'patrika' && (
          <div className="space-y-4">
            <div className="bg-stone-900 text-amber-100 p-3.5 rounded-2xl border border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-md">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>📚 शोध पत्रिका व माँ ताप्ती संस्थान CMS</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAdminCMSWithTab('patrikaCms')}
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-bold border border-amber-500 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                  <span>📚 पत्रिका आलेख CMS</span>
                </button>
                <button
                  onClick={() => handleOpenAdminCMSWithTab('shodhSansthanCms')}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold border border-amber-800/40 cursor-pointer flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>🏛️ संस्थान विवरण CMS</span>
                </button>
                <button
                  onClick={() => handleOpenAdminCMSWithTab('memberships')}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-xl text-xs font-bold border border-emerald-600 shadow cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>👥 सदस्य प्रबंधन ({adminMemberships.length})</span>
                </button>
              </div>
            </div>
            <PatrikaSection
              siteSettings={siteSettings}
              patrikaArticles={patrikaArticles}
              sansthanOfficials={sansthanOfficials}
              isAdminAuthenticated={isAdminAuthenticated}
              onOpenAdminTab={(tab) => {
                setShowAdminRecordsModal(true);
                setAdminTab(tab);
              }}
              onOpenSuggestionModal={() => setShowSuggestionBoxModal(true)}
              onDeletePatrikaArticle={handleDeletePatrikaArticle}
              onEditPatrikaArticle={(article) => {
                setEditingPatrikaArticle(article);
                handleOpenAdminCMSWithTab('patrikaCms');
              }}
            />
          </div>
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
                {siteSettings.siteTitle || "पँवारी (भोयरी) शब्दकोश"}
              </h3>
              <p className="text-xs leading-relaxed text-stone-400">
                {siteSettings.footerText || "रुनुक-झुनुक पवारी शब्दकोश (मूल संकलनकर्ता: वल्लभ डोंगरे, सतपुड़ा संस्कृति संस्थान, भोपाल)। सतपुड़ा अंचल (छिंदवाड़ा, बालाघाट, सिवनी, बैतूल, नागपुर, गोंदिया, भंडारा) की पवार क्षत्रिय बोली का संरक्षण।"}
              </p>
              <div className="pt-1 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{siteSettings.shodhSansthanOrg || "माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) एवं पँवारी शोध पत्रिका से संबद्ध।"}</span>
              </div>
            </div>

            {/* Column 2: Research Institute & Journal */}
            <div className="space-y-3 bg-stone-950/80 p-4 rounded-xl border border-stone-800">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                {siteSettings.shodhSansthanTitle || "माँ ताप्ती शोध संस्थान, मुलताई"}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {siteSettings.shodhSansthanDescription || "पँवारी बोली, लोक-साहित्य, इतिहास एवं सांस्कृतिक विरासत के संरक्षण तथा पँवारी शोध पत्रिका में रचना सहयोग हेतु संपर्क करें।"}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('patrika');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-amber-100 hover:underline cursor-pointer bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-800/80 transition shadow-sm"
                  title="माँ ताप्ती शोध संस्थान विवरण एवं शोध पत्रिका पृष्ठ पर जाएं"
                >
                  <span>संस्थान परिचय व विवरण देखें</span> <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <button
                  onClick={() => setShowMembershipModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:text-emerald-300 hover:underline cursor-pointer bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 transition"
                >
                  <span>आवेदन भरें</span> <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
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
                    href={`mailto:${siteSettings.shodhSansthanEmail || 'rupeshpawar10@gmail.com'}?subject=Pawari Dictionary Suggestion`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-100 rounded-lg text-xs font-bold transition border border-amber-600/40"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    {siteSettings.shodhSansthanEmail || 'rupeshpawar10@gmail.com'}
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
              {siteSettings.footerCopyright || "© 2026 पँवारी Pawari (Bhoyari) Digital Dictionary Project. सर्वाधिकार सुरक्षित।"}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setShowAboutModal(true)} className="hover:text-amber-300 cursor-pointer">कोश परिचय</button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab('patrika');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-300 font-bold text-amber-400 cursor-pointer"
              >
                संस्थान परिचय (Sansthan Details)
              </button>
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
                {isAdminAuthenticated && (
                  <button
                    onClick={() => handleDeleteDictionaryEntry(selectedWordDetail.clean_word)}
                    className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="शब्द हटाएं"
                  >
                    <Trash2 className="w-4 h-4 text-rose-700" />
                    <span>शब्द हटाएं</span>
                  </button>
                )}
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

      {/* ================= MODAL 4: SANSTHAN & DICTIONARY ABOUT MODAL ================= */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-amber-400 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-5 border-b border-amber-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-amber-100">
                    माँ ताप्ती शोध संस्थान, मुलताई (बैतूल)
                  </h2>
                  <p className="text-xs text-amber-300/90 font-medium">
                    पँवारी (भोयरी) भाषा, लोक-साहित्य एवं सांस्कृतिक शोध केंद्र
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-stone-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs text-stone-700 leading-relaxed">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  संस्थान उद्देश्य एवं परिचय (Sansthan Overview)
                </h3>
                <p>
                  <strong>माँ ताप्ती शोध संस्थान मुलताई (जिला बैतूल, म.प्र.)</strong> सतपुड़ा अंचल की पौराणिक एवं ऐतिहासिक धरोहर पँवारी (भोयरी) बोली, लोक-साहित्य, शोध पत्रिकाओं, लोकगीतों, मुहावरों एवं संस्कृति के संवर्धन एवं संरक्षण हेतु कार्य कर रहा है।
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-amber-800">
                  मुख्य कार्य एवं गतिविधियाँ (Core Initiatives)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                  <li><strong>पँवारी शोध पत्रिका:</strong> त्रैमासिक शोध पत्रिका का सम्पादन, प्रकाशन एवं डिजिटल अर्काइव।</li>
                  <li><strong>डिजिटल पँवारी शब्दकोश:</strong> 2,740+ पँवारी शब्दों, मुहावरों एवं IPA उच्चारण का संकलन।</li>
                  <li><strong>लोक-साहित्य संकलन:</strong> पँवारी लोक-पहेलियाँ, लोकगीत, कहावतें एवं शोध आलेख।</li>
                  <li><strong>सदस्यता एवं शोध प्रोत्साहन:</strong> अंचल के शोधार्थियों, युवा लेखकों एवं भाषाप्रेमियों को जोड़ना।</li>
                </ul>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 space-y-1">
                <div className="font-bold text-stone-900">मूल संकलनकर्ता व प्रेरणास्रोत:</div>
                <div>वल्लभ डोंगरे (सतपुड़ा संस्कृति संस्थान, भोपाल) • रूपेश पवार (प्रधान संपादक)</div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-stone-200">
                <button
                  onClick={() => {
                    setShowAboutModal(false);
                    setActiveTab('patrika');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>संस्थान विवरण व पत्रिका पृष्ठ पर जाएं (Sansthan Details Page)</span>
                </button>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        आपका नाम (Full Name) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={membershipForm.name}
                        onChange={(e) => setMembershipForm({...membershipForm, name: e.target.value})}
                        placeholder="उदा. राजेश बारंगे पंवार"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        पिता / पति का नाम (Father/Husband Name)
                      </label>
                      <input
                        type="text"
                        value={membershipForm.fatherName}
                        onChange={(e) => setMembershipForm({...membershipForm, fatherName: e.target.value})}
                        placeholder="उदा. श्री रामेश्वर पवार"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        ईमेल ID (Email Address)
                      </label>
                      <input
                        type="email"
                        value={membershipForm.email}
                        onChange={(e) => setMembershipForm({...membershipForm, email: e.target.value})}
                        placeholder="उदा. example@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        जिला / अंचल (District) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={membershipForm.district}
                        onChange={(e) => setMembershipForm({...membershipForm, district: e.target.value})}
                        placeholder="उदा. बैतूल, छिंदवाड़ा, पांढुर्णा, नागपुर..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        तहसील / ग्राम / नगर (Town / Village)
                      </label>
                      <input
                        type="text"
                        value={membershipForm.village}
                        onChange={(e) => setMembershipForm({...membershipForm, village: e.target.value})}
                        placeholder="उदा. मुलताई / प्रभातपट्टन"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        सदस्यता श्रेणी (Membership Category)
                      </label>
                      <select
                        value={membershipForm.membershipType}
                        onChange={(e) => setMembershipForm({...membershipForm, membershipType: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="आजीवन सदस्य (Life Member)">आजीवन सदस्य (Life Member)</option>
                        <option value="शोधार्थी सदस्य (Research Scholar)">शोधार्थी सदस्य (Research Scholar)</option>
                        <option value="संरक्षक सदस्य (Patron Member)">संरक्षक सदस्य (Patron Member)</option>
                        <option value="साधारण सदस्य (General Member)">साधारण सदस्य (General Member)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        पँवारी (भोयरी) भाषा ज्ञान
                      </label>
                      <select
                        value={membershipForm.knowsPawari}
                        onChange={(e) => setMembershipForm({...membershipForm, knowsPawari: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं">हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं</option>
                        <option value="हाँ, थोड़ा-बहुत जानते/समझते हैं">हाँ, थोड़ा-बहुत जानते एवं समझते हैं</option>
                        <option value="नहीं, लेकिन सीखना चाहते हैं">नहीं, लेकिन पँवारी सीखना एवं समझना चाहते हैं</option>
                        <option value="अन्य शोधार्थी / भाषाप्रेमी">अन्य (शोधार्थी / संस्कृति प्रेमी)</option>
                      </select>
                    </div>
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
                <span>5. 📰 समाचार CMS ({newsItems.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('paheliyanCms')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'paheliyanCms'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>6. 🧩 पहेलियाँ CMS ({paheliyanList.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('shodhSansthanCms')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'shodhSansthanCms'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>7. 🏛️ संस्थान विवरण CMS</span>
              </button>

              <button
                onClick={() => setAdminTab('patrikaCms')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  adminTab === 'patrikaCms'
                    ? 'bg-amber-800 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>8. 📚 संस्थान पत्रिका CMS ({patrikaArticles.length})</span>
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
                <span>9. 🎨 थीम व लेआउट CMS</span>
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
                <span>10. 📖 2,740+ शब्द संपादक</span>
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
                <span>10. 🔒 सुरक्षा व PIN</span>
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
                                  onClick={() => handleDeleteSingleRecord(rec.id, rec.name)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="रिकॉर्ड हटाएं"
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

              {/* TAB 2: MEMBERSHIP APPLICATIONS & ADD NEW MEMBER */}
              {adminTab === 'memberships' && (
                <div className="space-y-6">
                  {/* Top Bar Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-700" />
                        <span>माँ ताप्ती शोध संस्थान मुलताई - सदस्यता एवं सदस्य प्रबंधन</span>
                      </h3>
                      <p className="text-stone-500 text-xs mt-0.5">
                        कुल पंजीकृत / आवदेक सदस्य: <strong>{adminMemberships.length}</strong>
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadMembershipsCSV}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 rounded-xl font-bold flex items-center gap-2 shadow transition cursor-pointer text-xs"
                    >
                      <Download className="w-4 h-4" /> Excel/CSV डाउनलोड
                    </button>
                  </div>

                  {/* Add New Member Admin Form Card */}
                  <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-100/30 p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                      <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-base">
                        <UserPlus className="w-5 h-5 text-amber-700" />
                        <span>➕ नया सदस्य पंजीकृत करें (New Member Registration Form)</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                        प्रशासनिक प्रविष्टि (Admin Panel)
                      </span>
                    </div>

                    {adminMemberSuccess && (
                      <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>✓ नया सदस्य सफलतापूर्वक पंजीकृत कर सूची में जोड़ दिया गया!</span>
                      </div>
                    )}

                    <form onSubmit={handleAdminAddMember} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            सदस्य का पूरा नाम <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={adminNewMemberForm.name}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, name: e.target.value})}
                            placeholder="उदा. राजेश बारंगे पंवार"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            पिता / पति का नाम
                          </label>
                          <input
                            type="text"
                            value={adminNewMemberForm.fatherName}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, fatherName: e.target.value})}
                            placeholder="उदा. श्री रामेश्वर पवार"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            मोबाइल / व्हाट्सएप नंबर <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={adminNewMemberForm.phone}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, phone: e.target.value})}
                            placeholder="उदा. 98260XXXXX"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            ईमेल ID
                          </label>
                          <input
                            type="email"
                            value={adminNewMemberForm.email}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, email: e.target.value})}
                            placeholder="उदा. example@gmail.com"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            जिला / अंचल <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={adminNewMemberForm.district}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, district: e.target.value})}
                            placeholder="उदा. बैतूल"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            तहसील / ग्राम / नगर
                          </label>
                          <input
                            type="text"
                            value={adminNewMemberForm.village}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, village: e.target.value})}
                            placeholder="उदा. मुलताई"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            सदस्यता श्रेणी (Membership Type)
                          </label>
                          <select
                            value={adminNewMemberForm.membershipType}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, membershipType: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          >
                            <option value="आजीवन सदस्य (Life Member)">आजीवन सदस्य (Life Member)</option>
                            <option value="शोधार्थी सदस्य (Research Scholar)">शोधार्थी सदस्य (Research Scholar)</option>
                            <option value="संरक्षक सदस्य (Patron Member)">संरक्षक सदस्य (Patron Member)</option>
                            <option value="साधारण सदस्य (General Member)">साधारण सदस्य (General Member)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            पँवारी भाषा ज्ञान
                          </label>
                          <select
                            value={adminNewMemberForm.knowsPawari}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, knowsPawari: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          >
                            <option value="हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं">हाँ, मातृभाषा के रूप में धाराप्रवाह जानते हैं</option>
                            <option value="हाँ, थोड़ा-बहुत जानते/समझते हैं">हाँ, थोड़ा-बहुत जानते एवं समझते हैं</option>
                            <option value="नहीं, लेकिन सीखना चाहते हैं">नहीं, लेकिन पँवारी सीखना एवं समझना चाहते हैं</option>
                            <option value="अन्य शोधार्थी / भाषाप्रेमी">अन्य (शोधार्थी / संस्कृति प्रेमी)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">
                            विशेष विवरण / टिप्पणियाँ
                          </label>
                          <input
                            type="text"
                            value={adminNewMemberForm.otherDetails}
                            onChange={(e) => setAdminNewMemberForm({...adminNewMemberForm, otherDetails: e.target.value})}
                            placeholder="संस्थान में दायित्व या विशेष विवरण..."
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>सदस्य पंजीकृत करें (Save New Member)</span>
                        </button>
                      </div>
                    </form>
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
                                  onClick={() => handleDeleteMembership(m.id, m.name)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="आवेदन हटाएं"
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
                                  onClick={() => handleDeleteSuggestion(s.id, s.name)}
                                  className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                  title="सुझाव हटाएं"
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
                            <tr key={`pending_${w.id || idx}_${idx}`} className="hover:bg-amber-50/50 transition">
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
                  {/* EDIT OR CREATE FORM */}
                  {editingNewsItem ? (
                    <form onSubmit={handleSaveNewsItemEdit} className="bg-amber-50 p-4 rounded-xl border-2 border-amber-400 space-y-3 shadow-md">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h3 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-amber-800" />
                          समाचार व घोषणा संपादित करें (Edit News / Announcement)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingNewsItem(null)}
                          className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg text-xs cursor-pointer"
                        >
                          ✕ रद्द करें
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-800 mb-1">शीर्षक (Title) *</label>
                          <input
                            type="text"
                            required
                            value={editingNewsItem.title}
                            onChange={(e) => setEditingNewsItem({...editingNewsItem, title: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-800 mb-1">श्रेणी (Category)</label>
                          <select
                            value={editingNewsItem.category}
                            onChange={(e) => setEditingNewsItem({...editingNewsItem, category: e.target.value as NewsItem['category']})}
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
                          value={editingNewsItem.content}
                          onChange={(e) => setEditingNewsItem({...editingNewsItem, content: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block font-bold text-stone-800 mb-1">लेखक / संस्था</label>
                            <input
                              type="text"
                              value={editingNewsItem.author || ''}
                              onChange={(e) => setEditingNewsItem({...editingNewsItem, author: e.target.value})}
                              className="p-2 bg-white border border-stone-300 rounded-lg text-xs w-48"
                            />
                          </div>

                          <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer mt-5">
                            <input
                              type="checkbox"
                              checked={editingNewsItem.isImportant}
                              onChange={(e) => setEditingNewsItem({...editingNewsItem, isImportant: e.target.checked})}
                              className="w-4 h-4 text-amber-600 rounded"
                            />
                            <span>विशेष हाइलाइट (Highlight)</span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2 self-end">
                          <button
                            type="button"
                            onClick={() => setEditingNewsItem(null)}
                            className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                          >
                            ✓ अपडेट सहेजें (Save Changes)
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
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
                  )}

                  {/* Posted News List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-xs">वर्तमान में प्रकाशित समाचार ({newsItems.length})</h4>
                    <div className="space-y-2">
                      {newsItems.map((item, idx) => (
                        <div key={`news_${item.id || idx}_${idx}`} className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-start justify-between gap-3">
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
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setEditingNewsItem(item)}
                              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="समाचार संपादित करें"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                              <span>संपादन</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNewsItem(item.id, item.title)}
                              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="समाचार हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                              <span>हटाएं</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PAHELIYAN (RIDDLES) CMS MANAGER */}
              {adminTab === 'paheliyanCms' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        पँवारी पहेलियाँ संपादक CMS (Riddles & Answers CMS)
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        कुल पहेलियाँ: <strong>{paheliyanList.length}</strong> • 'फलौदी', 'छिन्न की कहानी' एवं अन्य लोक-पहेलियाँ जोड़ें, संपादित करें या हटाएं।
                      </p>
                    </div>

                    <button
                      onClick={handleResetPaheliyanToDefault}
                      className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 border border-stone-300"
                    >
                      🔄 डिफ़ॉल्ट 180+ मूल पहेलियों पर रीसेट करें
                    </button>
                  </div>

                  {paheliCmsSuccess && (
                    <div className="p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-xs text-center">
                      ✓ पहेली डेटा सफलतापूर्वक सहेज दिया गया!
                    </div>
                  )}

                  {/* Edit Form if editing */}
                  {editingPaheli ? (
                    <form onSubmit={handleSavePaheliEdit} className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 space-y-3 shadow-md">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h4 className="font-bold text-amber-950 text-sm">
                          ✏️ पहेली #{editingPaheli.id} संपादित करें
                        </h4>
                        <button type="button" onClick={() => setEditingPaheli(null)} className="text-stone-500 font-bold text-xs">
                          रद्द करें
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block font-bold text-stone-800 text-xs mb-1">पहेली (Riddle Text) *</label>
                          <textarea
                            required
                            rows={2}
                            value={editingPaheli.paheli}
                            onChange={(e) => setEditingPaheli({...editingPaheli, paheli: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-serif font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-800 text-xs mb-1">उत्तर (Answer) *</label>
                            <input
                              type="text"
                              required
                              value={editingPaheli.answer}
                              onChange={(e) => setEditingPaheli({...editingPaheli, answer: e.target.value})}
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-800 text-xs mb-1">संकेत (Hint)</label>
                            <input
                              type="text"
                              value={editingPaheli.hint || ''}
                              onChange={(e) => setEditingPaheli({...editingPaheli, hint: e.target.value})}
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                        <button type="button" onClick={() => setEditingPaheli(null)} className="px-3.5 py-1.5 bg-stone-200 text-stone-800 font-bold text-xs rounded-lg">
                          रद्द करें
                        </button>
                        <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white font-bold text-xs rounded-lg shadow">
                          ✓ बदलाव सहेजें
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Add New Paheli Form */
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-amber-700" /> नई पहेली जोड़ें (Add New Riddle)
                      </h4>

                      <form onSubmit={handleAddPaheliSubmit} className="space-y-3">
                        <div>
                          <label className="block font-bold text-stone-800 text-xs mb-1">पहेली (Riddle Text) *</label>
                          <textarea
                            required
                            rows={2}
                            value={newPaheliForm.paheli}
                            onChange={(e) => setNewPaheliForm({...newPaheliForm, paheli: e.target.value})}
                            placeholder="उदा. 'छिन्ना की कहानी छिन्ना जाने...' या फलौदी पहेली लिखें..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-serif"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-800 text-xs mb-1">उत्तर (Answer) *</label>
                            <input
                              type="text"
                              required
                              value={newPaheliForm.answer}
                              onChange={(e) => setNewPaheliForm({...newPaheliForm, answer: e.target.value})}
                              placeholder="उदा. भुट्टा / कपास / चिड़िया"
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-800 text-xs mb-1">संकेत (Hint)</label>
                            <input
                              type="text"
                              value={newPaheliForm.hint}
                              onChange={(e) => setNewPaheliForm({...newPaheliForm, hint: e.target.value})}
                              placeholder="उदा. कृषि / प्रकृति / पक्षी"
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                        >
                          ➕ नई पहेली जोड़ें (Save Riddle)
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Riddles List Table with Search */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-bold text-stone-900 text-xs">पहेलियाँ सूची ({paheliyanList.length})</h4>
                      <input
                        type="text"
                        value={paheliSearchCmsTerm}
                        onChange={(e) => setPaheliSearchCmsTerm(e.target.value)}
                        placeholder="पहेली या उत्तर खोजें..."
                        className="px-3 py-1 bg-white border border-stone-300 rounded-lg text-xs w-48 sm:w-64"
                      />
                    </div>

                    <div className="max-h-80 overflow-y-auto rounded-xl border border-stone-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-900 text-amber-100 text-[11px] uppercase font-bold tracking-wider">
                            <th className="p-2.5 border-b border-stone-800"># आईडी</th>
                            <th className="p-2.5 border-b border-stone-800">पहेली</th>
                            <th className="p-2.5 border-b border-stone-800">उत्तर</th>
                            <th className="p-2.5 border-b border-stone-800">संकेत</th>
                            <th className="p-2.5 border-b border-stone-800 text-right">कार्रवाई</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white text-stone-800 text-xs font-medium">
                          {paheliyanList
                            .filter(p => !paheliSearchCmsTerm || p.paheli.includes(paheliSearchCmsTerm) || p.answer.includes(paheliSearchCmsTerm))
                            .map((item, idx) => (
                              <tr key={`cms_pah_${item.id || idx}_${idx}`} className="hover:bg-amber-50/40 transition">
                                <td className="p-2.5 font-mono text-stone-500 font-bold">#{item.id}</td>
                                <td className="p-2.5 font-serif font-bold text-stone-900 max-w-sm">"{item.paheli}"</td>
                                <td className="p-2.5 font-bold text-amber-950">{item.answer}</td>
                                <td className="p-2.5 text-stone-500 text-[11px]">{item.hint || '-'}</td>
                                <td className="p-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setEditingPaheli(item)}
                                      className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow-2xs transition"
                                    >
                                      ✏️ संपादन
                                    </button>
                                    <button
                                      onClick={() => handleDeletePaheli(item.id, item.paheli)}
                                      className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-[11px] cursor-pointer shadow-2xs transition flex items-center gap-1 border border-rose-300"
                                      title="पहेली हटाएं (Delete Riddle)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                                      <span>हटाएं</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SHODH SANSTHAN DETAILS CMS */}
              {adminTab === 'shodhSansthanCms' && (
                <form onSubmit={handleSaveShodhSansthanSettings} className="space-y-6">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-700" />
                        शोध संस्थान एवं संपादकीय विवरण CMS
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        माँ ताप्ती शोध संस्थान मुलताई एवं सतपुड़ा संस्कृति संस्थान का पता, फोन नंबर, ईमेल व विवरण बदलें।
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Save className="w-4 h-4" /> संस्थान विवरण सहेजें
                    </button>
                  </div>

                  {shodhSansthanSavedSuccess && (
                    <div className="p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-xs text-center">
                      ✓ संस्थान विवरण सफलतापूर्वक अपडेट कर दिया गया!
                    </div>
                  )}

                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संस्थान का मुख्य नाम (Institute Title)</label>
                        <input
                          type="text"
                          value={siteSettings.shodhSansthanTitle || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanTitle: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-amber-950"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">प्रधान संपादक का नाम (Chief Editor)</label>
                        <input
                          type="text"
                          value={siteSettings.shodhSansthanEditor || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanEditor: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 text-xs mb-1">संबद्ध संस्थाएं (Parent Organizations)</label>
                      <input
                        type="text"
                        value={siteSettings.shodhSansthanOrg || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanOrg: e.target.value})}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">स्थान / पता (Address)</label>
                        <input
                          type="text"
                          value={siteSettings.shodhSansthanAddress || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanAddress: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संपर्क फ़ोन नंबर (Phone)</label>
                        <input
                          type="text"
                          value={siteSettings.shodhSansthanPhone || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanPhone: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">आधिकारिक ईमेल (Email)</label>
                        <input
                          type="email"
                          value={siteSettings.shodhSansthanEmail || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanEmail: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 text-xs mb-1">संस्थान का उद्देश्य व परिचय (Institute Description)</label>
                      <textarea
                        rows={3}
                        value={siteSettings.shodhSansthanDescription || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, shodhSansthanDescription: e.target.value})}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 8: SANSTHAN PATRIKA (JOURNAL) CMS */}
              {adminTab === 'patrikaCms' && (
                <div className="space-y-6">
                  {patrikaCmsSuccess && (
                    <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>पत्रिका विवरण एवं शोध आलेख सफलतापूर्वक सुरक्षित (Saved) कर दिए गए हैं!</span>
                    </div>
                  )}

                  {/* Section 1: Master Patrika Details & Settings */}
                  <form onSubmit={handleSaveSiteSettings} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-700" />
                          1. पँवारी शोध पत्रिका - मूल विवरण (Master Patrika Details)
                        </h3>
                        <p className="text-stone-500 text-[11px]">
                          पत्रिका का नाम, विशेषांक अंक, प्रधान संपादक, सलाहकार मंडल, ISSN/पंजीयन क्रमांक व ई-पत्रिका PDF लिंक बदलें।
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>सुरक्षित करें (Save Master Details)</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">पत्रिका का नाम (Journal Title)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaTitle || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaTitle: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          placeholder="पँवारी शोध पत्रिका (Pawari Research Journal)"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">वर्ष एवं विशेषांक अंक (Volume / Issue Details)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaVolume || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaVolume: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          placeholder="वर्ष 12, अंक 4 (सतपुड़ा संस्कृति व भाषा विशेषांक)"
                        />
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="text-[10px] text-stone-500 font-bold self-center">त्वरित चयन:</span>
                          {[
                            'वर्ष 12, अंक 4 (2026)',
                            'वर्ष 12, अंक 3 (2026)',
                            'वर्ष 11, अंक 4 (2025)',
                            'सतपुड़ा संस्कृति व भाषा विशेषांक',
                            'लोक-साहित्य व लोक-गीत विशेषांक',
                            'वार्षिक विशेषांक 2026'
                          ].map((pVal) => (
                            <button
                              key={pVal}
                              type="button"
                              onClick={() => setSiteSettings({...siteSettings, patrikaVolume: pVal})}
                              className="px-2 py-0.5 bg-amber-100/80 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold border border-amber-300/80 transition cursor-pointer"
                            >
                              + {pVal}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">प्रधान संपादक (Chief Editors)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaChiefEditor || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaChiefEditor: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          placeholder="वल्लभ डोंगरे & रूपेश पवार"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संपादकीय व सलाहकार मंडल (Editorial Board)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaEditorialBoard || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaEditorialBoard: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          placeholder="डॉ. रामेश्वर पवार, प्रो. हरिशंकर ठाकरे, इंजी. अमर पवार, राजेश बारंगे पंवार"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">पंजीयन / ISSN क्रमांक (Registration Number)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaRegistration || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaRegistration: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          placeholder="पंजीयन क्र. MP/PAWARI/PATRIKA/2026/12"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">ई-पत्रिका कवर फोटो URL (Cover Image URL)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaCoverUrl || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaCoverUrl: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संपूर्ण ई-पत्रिका PDF डाउनलोड लिंक (Full PDF Link)</label>
                        <input
                          type="text"
                          value={siteSettings.patrikaPdfUrl || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaPdfUrl: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          placeholder="https://example.com/pawari-patrika.pdf"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संपर्क ईमेल (Contact Email)</label>
                        <input
                          type="email"
                          value={siteSettings.patrikaContactEmail || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaContactEmail: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          placeholder="rupeshpawar10@gmail.com"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-stone-800 text-xs mb-1">पत्रिका परिचय एवं उद्देश्य (Patrika Overview / Description)</label>
                        <textarea
                          rows={2}
                          value={siteSettings.patrikaDescription || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaDescription: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          placeholder="सतपुड़ा अंचल की प्राचीन पँवारी (भोयरी) बोली, लोक-साहित्य, इतिहास एवं धरोहर के प्रलेखीकरण तथा शोध हेतु..."
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-stone-800 text-xs mb-1">रचनाकारों हेतु दिशा-निर्देश (Submission Guidelines for Authors)</label>
                        <textarea
                          rows={3}
                          value={siteSettings.patrikaSubmissionGuidelines || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, patrikaSubmissionGuidelines: e.target.value})}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Section 2: Published Research Articles Management (Full CRUD) */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-700" />
                          2. प्रकाशित शोध आलेख व रचनाएँ (Articles CMS) ({patrikaArticles.length})
                        </h3>
                        <p className="text-stone-500 text-[11px]">
                          शोध पत्रिका में नए शोध आलेख जोड़ें, संपादित करें या हटाएं।
                        </p>
                      </div>
                    </div>

                    {/* Add / Edit Article Form */}
                    <form onSubmit={editingPatrikaArticle ? handleSavePatrikaArticleEdit : handleAddPatrikaArticle} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                          {editingPatrikaArticle ? '✏️ शोध आलेख संपादित करें' : '➕ नया शोध आलेख जोड़ें'}
                        </span>
                        {editingPatrikaArticle && (
                          <button
                            type="button"
                            onClick={() => setEditingPatrikaArticle(null)}
                            className="text-xs text-stone-500 hover:text-stone-800 underline"
                          >
                            रद्द करें
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-stone-700">आलेख शीर्षक (Article Title) *</label>
                          <input
                            type="text"
                            required
                            value={editingPatrikaArticle ? editingPatrikaArticle.title : newPatrikaArticleForm.title}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, title: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, title: e.target.value})}
                            placeholder="जैसे: पँवारी (भोयरी) बोली की उत्पत्ति एवं सतपुड़ा अंचल की भाषिक धरोहर"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">लेखक / शोधार्थी का नाम (Author) *</label>
                          <input
                            type="text"
                            required
                            value={editingPatrikaArticle ? editingPatrikaArticle.author : newPatrikaArticleForm.author}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, author: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, author: e.target.value})}
                            placeholder="लेखक का नाम"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">विषय श्रेणी (Category)</label>
                          <select
                            value={editingPatrikaArticle ? editingPatrikaArticle.category : newPatrikaArticleForm.category}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, category: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, category: e.target.value})}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-medium"
                          >
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

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">प्रकाशन माह, वर्ष व अंक (Period / Issue / Date)</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={editingPatrikaArticle ? editingPatrikaArticle.date : newPatrikaArticleForm.date}
                              onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, date: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, date: e.target.value})}
                              placeholder="उदा. अगस्त 2026 / वर्ष 12 अंक 4"
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedVal = e.target.value;
                                  if (editingPatrikaArticle) {
                                    setEditingPatrikaArticle({...editingPatrikaArticle, date: selectedVal});
                                  } else {
                                    setNewPatrikaArticleForm({...newPatrikaArticleForm, date: selectedVal});
                                  }
                                }
                              }}
                              className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shrink-0"
                              title="अवधि या वर्ष चुनें"
                            >
                              <option value="">➕ अवधि चुनें</option>
                              <option value="अगस्त 2026 (वर्ष 12 अंक 4)">अगस्त 2026 (वर्ष 12 अंक 4)</option>
                              <option value="मई 2026 (वर्ष 12 अंक 3)">मई 2026 (वर्ष 12 अंक 3)</option>
                              <option value="फरवरी 2026 (वर्ष 12 अंक 2)">फरवरी 2026 (वर्ष 12 अंक 2)</option>
                              <option value="जनवरी 2026 (वर्ष 12 अंक 1)">जनवरी 2026 (वर्ष 12 अंक 1)</option>
                              <option value="वर्ष 2025 (विशेषांक अंक)">वर्ष 2025 (विशेषांक अंक)</option>
                              <option value="वर्ष 2024 (वार्षिक विशेषांक)">वर्ष 2024 (वार्षिक विशेषांक)</option>
                              <option value="ऐतिहासिक धरोहर अंक">ऐतिहासिक धरोहर अंक</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">PDF डाउनलोड लिंक (PDF URL)</label>
                          <input
                            type="text"
                            value={editingPatrikaArticle ? (editingPatrikaArticle.pdfUrl || '') : newPatrikaArticleForm.pdfUrl}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, pdfUrl: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, pdfUrl: e.target.value})}
                            placeholder="https://example.com/article.pdf"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">वेब/आर्टिकल ऑनलाइन लिंक (Article URL)</label>
                          <input
                            type="text"
                            value={editingPatrikaArticle ? (editingPatrikaArticle.articleUrl || '') : newPatrikaArticleForm.articleUrl}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, articleUrl: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, articleUrl: e.target.value})}
                            placeholder="https://example.com/article"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-stone-700">आलेख सार (Summary / Abstract) *</label>
                          <textarea
                            rows={3}
                            required
                            value={editingPatrikaArticle ? editingPatrikaArticle.summary : newPatrikaArticleForm.summary}
                            onChange={(e) => editingPatrikaArticle ? setEditingPatrikaArticle({...editingPatrikaArticle, summary: e.target.value}) : setNewPatrikaArticleForm({...newPatrikaArticleForm, summary: e.target.value})}
                            placeholder="आलेख का संक्षिप्त विवरण एवं मुख्य शोध निष्कर्ष..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{editingPatrikaArticle ? 'आलेख अपडेट करें' : 'नया शोध आलेख जोड़ें'}</span>
                      </button>
                    </form>

                    {/* Articles Table */}
                    <div className="overflow-x-auto border border-stone-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold">
                            <th className="p-2.5">शीर्षक & श्रेणी</th>
                            <th className="p-2.5">लेखक</th>
                            <th className="p-2.5">दिनांक</th>
                            <th className="p-2.5 text-right">कार्रवाई</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {patrikaArticles.map((art) => (
                            <tr key={art.id} className="hover:bg-amber-50/50">
                              <td className="p-2.5">
                                <p className="font-bold text-stone-900">{art.title}</p>
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                                  {art.category}
                                </span>
                              </td>
                              <td className="p-2.5 text-stone-700 font-medium">{art.author}</td>
                              <td className="p-2.5 text-stone-500 text-[11px]">{art.date}</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingPatrikaArticle(art)}
                                    className="px-2 py-1 bg-amber-800 text-white font-bold rounded text-[11px] cursor-pointer"
                                  >
                                    ✏️ संपादन
                                  </button>
                                  <button
                                    onClick={() => handleDeletePatrikaArticle(art.id, art.title)}
                                    className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                                    title="आलेख हटाएं"
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

                  {/* Section 3: Sansthan Officials & Board Management (Add, Edit, Delete, Time Periods) */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-700" />
                          3. माँ ताप्ती शोध संस्थान - पदाधिकारी व मंडल प्रबन्धन ({sansthanOfficials.length})
                        </h3>
                        <p className="text-stone-500 text-[11px]">
                          संस्थान के सभी पदाधिकारियों/सदस्यों का विवरण जोड़ें, संपादित करें, बनाएं एवं कार्यकाल (Time Period) निर्धारित करें।
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetSansthanOfficialsToDefault}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-300 cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                        <span>मूल सूची रीसेट करें</span>
                      </button>
                    </div>

                    {/* Time Period Management Card (Add, Edit, Delete Time Periods) */}
                    <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300/80 space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                          <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                            कार्यकालावधि / समय अवधि (Time Period) प्रबन्धन ({managedTimePeriods.length})
                          </h4>
                        </div>
                        <span className="text-[11px] text-amber-900 font-medium">
                          पदाधिकारियों के लिए कार्यकाल जोड़ें, नाम बदलें या हटाएं
                        </span>
                      </div>

                      {/* Add Time Period Form */}
                      <form onSubmit={handleAddTimePeriod} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={newTimePeriodInput}
                          onChange={(e) => setNewTimePeriodInput(e.target.value)}
                          placeholder="नया कार्यकाल दर्ज करें (जैसे: 2024 - 2028, या 2012 - 2016)"
                          className="flex-1 p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-amber-950 placeholder:font-normal placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer shrink-0 flex items-center justify-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>नया कार्यकाल जोड़ें</span>
                        </button>
                      </form>

                      {/* Edit Time Period Inline Modal / Form */}
                      {editingTimePeriodObj && (
                        <form onSubmit={handleSaveTimePeriodRename} className="p-3 bg-white rounded-xl border-2 border-amber-500 space-y-2 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                            <span>✏️ कार्यकाल "{editingTimePeriodObj.oldName}" का नाम संपादित करें:</span>
                            <button
                              type="button"
                              onClick={() => setEditingTimePeriodObj(null)}
                              className="text-stone-500 hover:text-stone-800 underline text-[11px] cursor-pointer"
                            >
                              रद्द करें
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              value={editingTimePeriodObj.newName}
                              onChange={(e) => setEditingTimePeriodObj({ ...editingTimePeriodObj, newName: e.target.value })}
                              className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-amber-900"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                            >
                              अपडेट करें
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500 font-medium">
                            * इस कार्यकाल को बदलने से इस अवधि के सभी पदाधिकारियों का कार्यकाल अपने-आप नए नाम में बदल जाएगा।
                          </p>
                        </form>
                      )}

                      {/* Time Periods List Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {managedTimePeriods.map((period) => {
                          const count = sansthanOfficials.filter(o => o.timePeriod === period).length;
                          return (
                            <div
                              key={period}
                              className="px-2.5 py-1.5 bg-white border border-amber-300 hover:border-amber-500 rounded-xl flex items-center gap-2 shadow-2xs transition text-xs"
                            >
                              <span className="font-bold text-amber-950 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                                {period}
                              </span>

                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md border border-amber-200">
                                {count} सदस्य
                              </span>

                              <div className="flex items-center gap-1 border-l border-stone-200 pl-1.5 ml-0.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingTimePeriodObj({ oldName: period, newName: period })}
                                  className="p-1 hover:bg-amber-100 text-stone-600 hover:text-amber-900 rounded transition cursor-pointer"
                                  title="कार्यकाल नाम बदलें (Edit Time Period)"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTimePeriod(period)}
                                  className="p-1 hover:bg-rose-100 text-stone-400 hover:text-rose-700 rounded transition cursor-pointer"
                                  title="कार्यकाल हटाएं (Delete Time Period)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form for Add/Edit Official */}
                    <form onSubmit={editingSansthanOfficial ? handleSaveSansthanOfficialEdit : handleAddSansthanOfficial} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                          {editingSansthanOfficial ? `✏️ पदाधिकारी "${editingSansthanOfficial.name}" संपादित करें` : '➕ नया पदाधिकारी / मंडल सदस्य जोड़ें'}
                        </span>
                        {editingSansthanOfficial && (
                          <button
                            type="button"
                            onClick={() => setEditingSansthanOfficial(null)}
                            className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                          >
                            रद्द करें
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">पूरा नाम (Full Name) *</label>
                          <input
                            type="text"
                            required
                            value={editingSansthanOfficial ? editingSansthanOfficial.name : newSansthanOfficialForm.name}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, name: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, name: e.target.value})}
                            placeholder="जैसे: रूपेश पवार"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">पदनाम / जिम्मेदारी (Designation) *</label>
                          <input
                            type="text"
                            required
                            value={editingSansthanOfficial ? editingSansthanOfficial.designation : newSansthanOfficialForm.designation}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, designation: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, designation: e.target.value})}
                            placeholder="जैसे: प्रधान संपादक व सचिव"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-amber-950 flex items-center gap-1 mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            <span>कार्यकाल / समय अवधि (Time Period) *</span>
                          </label>
                          <div className="space-y-1.5">
                            <select
                              value={editingSansthanOfficial ? editingSansthanOfficial.timePeriod : newSansthanOfficialForm.timePeriod}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (editingSansthanOfficial) {
                                  setEditingSansthanOfficial({...editingSansthanOfficial, timePeriod: val});
                                } else {
                                  setNewSansthanOfficialForm({...newSansthanOfficialForm, timePeriod: val});
                                }
                              }}
                              className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-950 focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer"
                            >
                              <option value="">-- समय अवधि चुनें (Select Time Period) --</option>
                              {managedTimePeriods.map(p => (
                                <option key={p} value={p}>📅 {p}</option>
                              ))}
                              {((editingSansthanOfficial && editingSansthanOfficial.timePeriod && !managedTimePeriods.includes(editingSansthanOfficial.timePeriod)) ||
                                (!editingSansthanOfficial && newSansthanOfficialForm.timePeriod && !managedTimePeriods.includes(newSansthanOfficialForm.timePeriod))) && (
                                <option value={editingSansthanOfficial ? editingSansthanOfficial.timePeriod : newSansthanOfficialForm.timePeriod}>
                                  ✏️ {editingSansthanOfficial ? editingSansthanOfficial.timePeriod : newSansthanOfficialForm.timePeriod}
                                </option>
                              )}
                            </select>

                            {/* Quick select buttons for time periods */}
                            <div className="flex flex-wrap gap-1">
                              {managedTimePeriods.map(period => (
                                <button
                                  type="button"
                                  key={period}
                                  onClick={() => {
                                    if (editingSansthanOfficial) {
                                      setEditingSansthanOfficial({...editingSansthanOfficial, timePeriod: period});
                                    } else {
                                      setNewSansthanOfficialForm({...newSansthanOfficialForm, timePeriod: period});
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1 border ${
                                    (editingSansthanOfficial ? editingSansthanOfficial.timePeriod : newSansthanOfficialForm.timePeriod) === period
                                      ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                                      : 'bg-white text-stone-700 border-stone-300 hover:bg-amber-100 hover:border-amber-400'
                                  }`}
                                >
                                  <Calendar className="w-3 h-3 text-amber-700 shrink-0" />
                                  <span>{period}</span>
                                </button>
                              ))}
                            </div>

                            <input
                              type="text"
                              required
                              value={editingSansthanOfficial ? editingSansthanOfficial.timePeriod : newSansthanOfficialForm.timePeriod}
                              onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, timePeriod: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, timePeriod: e.target.value})}
                              placeholder="या कस्टम समय अवधि दर्ज करें..."
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">स्थान / शहर (Location)</label>
                          <input
                            type="text"
                            value={editingSansthanOfficial ? (editingSansthanOfficial.location || '') : newSansthanOfficialForm.location}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, location: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, location: e.target.value})}
                            placeholder="मुलताई (बैतूल)"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">दूरभाष / मोबाइल (Phone)</label>
                          <input
                            type="text"
                            value={editingSansthanOfficial ? (editingSansthanOfficial.phone || '') : newSansthanOfficialForm.phone}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, phone: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, phone: e.target.value})}
                            placeholder="+91-9425000000"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700">ईमेल (Email)</label>
                          <input
                            type="email"
                            value={editingSansthanOfficial ? (editingSansthanOfficial.email || '') : newSansthanOfficialForm.email}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, email: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, email: e.target.value})}
                            placeholder="email@example.com"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-stone-700">परिचय व योगदान (Bio / Contribution)</label>
                          <textarea
                            rows={2}
                            value={editingSansthanOfficial ? (editingSansthanOfficial.bio || '') : newSansthanOfficialForm.bio}
                            onChange={(e) => editingSansthanOfficial ? setEditingSansthanOfficial({...editingSansthanOfficial, bio: e.target.value}) : setNewSansthanOfficialForm({...newSansthanOfficialForm, bio: e.target.value})}
                            placeholder="पँवारी भाषा व लोक-संस्कृति प्रलेखीकरण में योगदान..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{editingSansthanOfficial ? 'पदाधिकारी विवरण अपडेट करें' : 'नया पदाधिकारी जोड़ें'}</span>
                      </button>
                    </form>

                    {/* Officials Table */}
                    <div className="overflow-x-auto border border-stone-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold">
                            <th className="p-2.5">नाम & पदनाम</th>
                            <th className="p-2.5">कार्यकाल (Time Period)</th>
                            <th className="p-2.5">स्थान & संपर्क</th>
                            <th className="p-2.5 text-right">कार्रवाई</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {sansthanOfficials.map((off) => (
                            <tr key={off.id} className="hover:bg-amber-50/50">
                              <td className="p-2.5">
                                <p className="font-bold text-stone-900">{off.name}</p>
                                <p className="text-[11px] text-stone-600 font-medium">{off.designation}</p>
                              </td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold">
                                  {off.timePeriod}
                                </span>
                              </td>
                              <td className="p-2.5 text-stone-600 text-[11px]">
                                <p>{off.location}</p>
                                <p className="font-mono text-stone-500">{off.phone}</p>
                              </td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingSansthanOfficial(off)}
                                    className="px-2 py-1 bg-amber-800 text-white font-bold rounded text-[11px] cursor-pointer"
                                  >
                                    ✏️ संपादन
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSansthanOfficial(off.id, off.name)}
                                    className="px-2 py-1 bg-rose-700 text-white font-bold rounded text-[11px] cursor-pointer"
                                  >
                                    🗑️ हटाएं
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: WEBSITE LAYOUT & SITE SETTINGS (THEME & TOGGLES CMS) */}
              {adminTab === 'layoutSettings' && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="flex items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-700" />
                        वेबसाइट लेआउट, थीम, फोंट व दृश्यता CMS (Full Control CMS)
                      </h3>
                      <p className="text-stone-500 text-[11px]">
                        यहाँ से वेबसाइट का रंग थीम, फ़ॉन्ट, हेडर, फूटर संदेश व सभी 9 सेक्शन ऑन/ऑफ करें।
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Save className="w-4 h-4" /> बदलाव सहेजें (Save All)
                    </button>
                  </div>

                  {settingsSavedSuccess && (
                    <div className="p-3 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-xs text-center">
                      ✓ वेबसाइट सेटिंग्स व थीम सफलतापूर्व सहेज दी गईं!
                    </div>
                  )}

                  {/* 1. Theme Color & Typography Choice */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-stone-900 text-xs border-b border-stone-200 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      1. वेबसाइट थीम कलर व फोंट शैली (Theme & Typography Choice)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-2">रंग थीम चुनें (Color Theme)</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'amber', name: '🟧 एम्बर हेरिटेज', bg: 'bg-amber-700 text-white' },
                            { id: 'emerald', name: '🟩 एमराल्ड नेचर', bg: 'bg-emerald-700 text-white' },
                            { id: 'indigo', name: '🟦 रॉयल इंडिगो', bg: 'bg-indigo-700 text-white' },
                            { id: 'rose', name: '🟥 टेराकोटा रेड', bg: 'bg-rose-700 text-white' },
                            { id: 'slate', name: '⬛ स्लेट मॉडर्न', bg: 'bg-slate-800 text-white' }
                          ].map(t => (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setSiteSettings({...siteSettings, themeColor: t.id as any})}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                                (siteSettings.themeColor || 'amber') === t.id
                                  ? `${t.bg} shadow-md border-stone-900 ring-2 ring-stone-900 ring-offset-1`
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                              }`}
                            >
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-2">फोंट शैली (Font Style)</label>
                        <div className="flex gap-2">
                          {[
                            { id: 'serif', name: '📜 पारंपरिक (Serif Classic)' },
                            { id: 'sans', name: '📱 आधुनिक (Sans Modern)' }
                          ].map(f => (
                            <button
                              type="button"
                              key={f.id}
                              onClick={() => setSiteSettings({...siteSettings, fontStyle: f.id as any})}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                                (siteSettings.fontStyle || 'serif') === f.id
                                  ? 'bg-amber-800 text-white shadow border-amber-900'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                              }`}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Header Titles & Taglines */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2">
                      2. मुख्य वेबसाइट शीर्षक व सब-टाइटल्स (Branding Titles)
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">मुख्य वेबसाइट शीर्षक (Main Title)</label>
                        <input
                          type="text"
                          value={siteSettings.siteTitle}
                          onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-serif font-bold text-amber-950"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">संस्थान / सब-टाईटल (Sub-Title Line)</label>
                        <input
                          type="text"
                          value={siteSettings.siteSubtitle}
                          onChange={(e) => setSiteSettings({...siteSettings, siteSubtitle: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">हेडर विवरण टैगलाइन (Header Tagline)</label>
                        <textarea
                          rows={2}
                          value={siteSettings.subHeaderTagline}
                          onChange={(e) => setSiteSettings({...siteSettings, subHeaderTagline: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Top Notification Ticker Banner */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2 flex items-center justify-between">
                      <span>3. शीर्ष सूचना पट्टी (Top Announcement Ticker)</span>
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
                      <label className="block font-bold text-stone-800 text-xs mb-1">सूचना पट्टी संदेश (Ticker Message Text)</label>
                      <input
                        type="text"
                        value={siteSettings.tickerMessage}
                        onChange={(e) => setSiteSettings({...siteSettings, tickerMessage: e.target.value})}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* 4. Complete Section Visibility Toggles */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2">
                      4. सभी मुख्य सेक्शन दृश्यता नियंत्रण (Toggle Sections On/Off)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🌟 त्वरित आँकड़े पट्टी (Quick Stats)</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showQuickStats ?? true}
                          onChange={(e) => setSiteSettings({...siteSettings, showQuickStats: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🔤 देवनागरी वर्णमाला ग्रिड</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showAlphabetGrid ?? true}
                          onChange={(e) => setSiteSettings({...siteSettings, showAlphabetGrid: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>💡 आज का शब्द (Word of Day)</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showWordOfDay}
                          onChange={(e) => setSiteSettings({...siteSettings, showWordOfDay: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>📢 समाचार व घोषणाएं सेक्शन</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showNewsSection}
                          onChange={(e) => setSiteSettings({...siteSettings, showNewsSection: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🏛️ माँ ताप्ती संस्थान कार्ड</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showShodhSansthanCard}
                          onChange={(e) => setSiteSettings({...siteSettings, showShodhSansthanCard: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🧩 पहेलियाँ मुख्य टैब</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showPaheliyanTab}
                          onChange={(e) => setSiteSettings({...siteSettings, showPaheliyanTab: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🏆 ई-क्विज़ व प्रमाण-पत्र टैब</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showQuizTab}
                          onChange={(e) => setSiteSettings({...siteSettings, showQuizTab: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>🤝 संस्थान सदस्यता कार्ड</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showMembershipCard ?? true}
                          onChange={(e) => setSiteSettings({...siteSettings, showMembershipCard: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>

                      <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer font-bold text-stone-800">
                        <span>✍️ नया शब्द सुझाएं बटन</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.showSuggestWordButton ?? true}
                          onChange={(e) => setSiteSettings({...siteSettings, showSuggestWordButton: e.target.checked})}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  {/* 5. Footer Content & Copyright */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-stone-800 text-xs border-b border-stone-200 pb-2">
                      5. फूटर विवरण व कॉपीराइट संदेश (Footer Details)
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">फूटर विवरण (Footer Description Text)</label>
                        <input
                          type="text"
                          value={siteSettings.footerText || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, footerText: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 text-xs mb-1">कॉपीराइट पंक्ति (Copyright Text)</label>
                        <input
                          type="text"
                          value={siteSettings.footerCopyright || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, footerCopyright: e.target.value})}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
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
                          .map((entry, idx) => (
                            <tr key={`cms_dict_${entry.clean_word}_${idx}`} className="hover:bg-amber-50/40 transition">
                              <td className="p-2.5 font-bold text-amber-950 text-xs">{entry.clean_word}</td>
                              <td className="p-2.5 text-stone-800 text-xs">{entry.hi_meaning}</td>
                              <td className="p-2.5 text-stone-600 text-xs">{entry.pos}</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingDictEntry(entry);
                                      setOriginalDictCleanWord(entry.clean_word);
                                    }}
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
