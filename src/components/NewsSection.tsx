import React, { useState } from 'react';
import { Newspaper, Calendar, User, Megaphone, ArrowRight, Sparkles, ChevronDown, ChevronUp, BellRing } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  newsItems: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsItems }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!newsItems || newsItems.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getCategoryBadgeClass = (category: NewsItem['category']) => {
    switch (category) {
      case 'घोषणा':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'कार्यक्रम':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'शोध पत्र':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-900/10 via-stone-900/5 to-amber-950/10 border border-amber-800/30 rounded-3xl p-5 sm:p-7 my-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-800/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-800 text-amber-100 rounded-2xl shadow border border-amber-700/50">
            <Newspaper className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-800/20 text-amber-900 text-[10px] font-bold uppercase rounded-full border border-amber-700/30 tracking-wider">
                ताज़ा अपडेट्स
              </span>
              <span className="animate-pulse flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
              समाचार, कार्यक्रम एवं घोषणाएं
            </h2>
          </div>
        </div>
        <p className="text-xs text-stone-600 max-w-md">
          पँवारी (भोयरी) भाषा, लोक-संस्कृति, शोध पत्र एवं माँ ताप्ती शोध संस्थान मुलताई की नवीनतम गतिविधियों के मुख्य समाचार
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isShort = item.content.length <= 130;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm flex flex-col justify-between ${
                item.isImportant
                  ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20'
                  : 'border-stone-200 hover:border-amber-300'
              }`}
            >
              <div>
                {/* Header Badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeClass(item.category)} flex items-center gap-1`}>
                    {item.isImportant && <BellRing className="w-3 h-3 text-amber-600 animate-bounce" />}
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2 leading-snug hover:text-amber-900 transition">
                  {item.title}
                </h3>

                {/* Author */}
                {item.author && (
                  <p className="text-[11px] font-semibold text-amber-900/80 mb-3 flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-700" />
                    {item.author}
                  </p>
                )}

                {/* Content */}
                <p className="text-xs text-stone-700 leading-relaxed font-normal">
                  {isExpanded || isShort ? item.content : `${item.content.slice(0, 130)}...`}
                </p>
              </div>

              {/* Action */}
              {!isShort && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <span>कम दिखाएं</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>पूरा समाचार पढ़ें</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
