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

export interface MembershipRecord {
  id: string;
  name: string;
  phone: string;
  district: string;
  knowsPawari: string;
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
  adminPin: string;
}
