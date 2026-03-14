"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Search, X, Clock, Newspaper, Briefcase, ArrowRight, Loader2 } from "lucide-react";

interface SearchResult {
  news: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    cover_image: string;
    created_at: string;
  }>;
  services: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
  total: number;
}

export default function GlobalSearch() {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("lixin_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Focus input when opened, manage body overflow
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchResults = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}&limit=5`
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      }
      setIsSearching(false);
    },
    [locale]
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("lixin_recent_searches", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  const handleNavigate = (path: string) => {
    if (query.trim()) saveRecentSearch(query.trim());
    handleClose();
    router.push(path as "/news");
  };

  const handleViewAll = () => {
    if (query.trim()) saveRecentSearch(query.trim());
    handleClose();
    router.push(`/news?q=${encodeURIComponent(query.trim())}` as "/news");
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q || q.length < 2) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-gray-300 hover:text-yellow-500 transition-colors"
        aria-label={t("title")}
      >
        <Search size={18} />
      </button>

      {/* Search overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
          />

          {/* Search panel */}
          <div className="relative max-w-2xl mx-auto mt-20 sm:mt-28 mx-4 sm:mx-auto animate-slide-down">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 text-gray-900 text-lg outline-none placeholder:text-gray-400 bg-transparent"
                  autoComplete="off"
                />
                {isSearching && (
                  <Loader2 size={18} className="text-yellow-500 animate-spin flex-shrink-0" />
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200">
                  ESC
                </kbd>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 sm:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Recent searches (when no query) */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {t("recent")}
                    </p>
                    <div className="space-y-1">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            fetchResults(term);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Clock size={14} className="text-gray-300" />
                          <span className="text-sm">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No query, no recent */}
                {!query && recentSearches.length === 0 && (
                  <div className="p-8 text-center">
                    <Search size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">{t("placeholder")}</p>
                    <p className="text-gray-300 text-xs mt-2">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 border border-gray-200">
                        Ctrl
                      </kbd>
                      {" + "}
                      <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 border border-gray-200">
                        K
                      </kbd>
                    </p>
                  </div>
                )}

                {/* Search results */}
                {query && results && (
                  <>
                    {/* News results */}
                    {results.news.length > 0 && (
                      <div className="p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Newspaper size={14} />
                          {t("news_results")}
                        </p>
                        <div className="space-y-1">
                          {results.news.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(`/news/${item.slug || item.id}`)}
                              className="flex items-start gap-3 w-full px-3 py-3 text-left hover:bg-yellow-50 rounded-xl transition-colors group"
                            >
                              {item.cover_image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.cover_image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                                  {highlightMatch(item.title, query)}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                  {highlightMatch(item.excerpt, query)}
                                </p>
                              </div>
                              <ArrowRight
                                size={14}
                                className="text-gray-300 group-hover:text-yellow-500 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-all"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Service results */}
                    {results.services.length > 0 && (
                      <div className="p-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Briefcase size={14} />
                          {t("service_results")}
                        </p>
                        <div className="space-y-1">
                          {results.services.map((item) => (
                            <button
                              key={item.slug}
                              onClick={() => handleNavigate(`/services#${item.slug}`)}
                              className="flex items-center gap-3 w-full px-3 py-3 text-left hover:bg-yellow-50 rounded-xl transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <Briefcase size={14} className="text-yellow-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
                                  {highlightMatch(item.title, query)}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                              <ArrowRight
                                size={14}
                                className="text-gray-300 group-hover:text-yellow-500 flex-shrink-0 group-hover:translate-x-0.5 transition-all"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View all / No results */}
                    {results.total > 0 ? (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={handleViewAll}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-yellow-600 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-colors"
                        >
                          {t("view_all")} ({results.total})
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="p-8 text-center">
                          <Search size={40} className="mx-auto text-gray-200 mb-3" />
                          <p className="text-gray-500 font-medium">{t("no_results")}</p>
                          <p className="text-gray-400 text-sm mt-1">{t("try_different")}</p>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
