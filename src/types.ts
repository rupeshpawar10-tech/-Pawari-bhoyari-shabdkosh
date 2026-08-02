export interface SansthanOfficial {
  id: string;
  name: string;
  designation: string;
  timePeriod: string;
  phone?: string;
  email?: string;
  location?: string;
  bio?: string;
  photoUrl?: string;
}

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
  isDeleted?: boolean;
  id?: string;
}

export interface MembershipRecord {
  id: string;
  name: string;
  fatherName?: string;
  phone: string;
  email?: string;
  district: string;
  village?: string;
  knowsPawari: string;
  membershipType?: string;
  otherDetails: string;
  date: string;
}

export interface SuggestionRecord {
  id: string;
  name: string;
  districtPhone: string;
  suggestion: string;
  date: string;
}

export interface PendingWordRecord {
  id: string;
  pawari: string;
  hi_meaning: string;
  category: string;
  pawari_ex: string;
  hi_ex: string;
  contributor: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'समाचार' | 'घोषणा' | 'कार्यक्रम' | 'शोध पत्र';
  content: string;
  date: string;
  author: string;
  isImportant?: boolean;
}

export interface PaheliItem {
  id: number;
  paheli: string;
  answer: string;
  hint: string;
  category: string;
}

export interface PatrikaArticle {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  date: string;
  pdfUrl?: string;
  articleUrl?: string;
  readTime?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  subHeaderTagline: string;
  tickerActive: boolean;
  tickerMessage: string;
  tickerType: 'important' | 'news' | 'event';
  showTicker: boolean;
  showWordOfDay: boolean;
  showNewsSection: boolean;
  showShodhSansthanCard: boolean;
  showPaheliyanTab: boolean;
  showQuizTab: boolean;
  showQuickStats: boolean;
  showAlphabetGrid: boolean;
  showMembershipCard: boolean;
  showSuggestWordButton: boolean;
  showPatrikaSection?: boolean;
  themeColor: 'amber' | 'emerald' | 'indigo' | 'terracotta' | 'slate' | 'crimson';
  fontStyle: 'serif' | 'sans' | 'classic';
  shodhSansthanTitle: string;
  shodhSansthanEditor: string;
  shodhSansthanOrg: string;
  shodhSansthanAddress: string;
  shodhSansthanPhone: string;
  shodhSansthanEmail: string;
  shodhSansthanDescription: string;
  patrikaTitle?: string;
  patrikaVolume?: string;
  patrikaChiefEditor?: string;
  patrikaEditorialBoard?: string;
  patrikaRegistration?: string;
  patrikaCoverUrl?: string;
  patrikaPdfUrl?: string;
  patrikaDescription?: string;
  patrikaSubmissionGuidelines?: string;
  patrikaContactEmail?: string;
  patrikaContactPhone?: string;
  footerText: string;
  footerCopyright: string;
  adminPin: string;
}
