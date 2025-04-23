"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";

interface SearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

interface PageContent {
  title: string;
  extract: string;
  fullurl: string;
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoClick = () => {
    setSearchTerm("");
    setSearchResults([]);
    setPageContent(null);
  };

  const fetchSearchResults = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setPageContent(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          srsearch: searchTerm,
          format: "json",
          origin: "*",
        },
      });
      setSearchResults(response.data.query.search);
      setPageContent(null);
    } catch (err) {
      setError(
        "There was an error getting your search results, please try again.",
      );
      setSearchResults([]);
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchSearchResults, 500);

  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm]);

  const fetchPageContent = async (pageId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          pageids: pageId,
          prop: "extracts|info",
          explaintext: true,
          inprop: "url",
          format: "json",
          origin: "*",
        },
      });
      const page = response.data.query.pages[pageId];
      setPageContent({
        title: page.title,
        extract: page.extract,
        fullurl: page.fullurl,
      });
    } catch (err) {
      setError("Failed to fetch page content");
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        event.target !== searchInputRef.current
      ) {
        setSearchTerm("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#181a1b]" : "bg-gray-50"}`}
    >
      <header
        className={`w-full h-20 p-4 border-b flex justify-between items-center ${
          isDarkMode
            ? "bg-[#181a1b] border-[#23272f]"
            : "bg-gray-50 border-zinc-200"
        }`}
      >
        <button
          type="button"
          className="h-12 cursor-pointer"
          onClick={handleLogoClick}
          aria-label="Wikipedia Home"
        >
          <img
            src="https://pngimg.com/d/wikipedia_PNG11.png"
            alt="Wikipedia logo"
            className={`h-8 sm:h-9 md:h-full ${isDarkMode && "invert"}`}
          />
        </button>
        <button
          className={`cursor-pointer rounded transition-colors flex items-center justify-center
            text-xs py-1.5 px-2 sm:text-sm sm:py-2 sm:px-3 md:text-base md:py-3 md:px-4 ${
              isDarkMode
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-700 text-yellow-300"
            }`}
          onClick={toggleDarkMode}
          title={isDarkMode ? "Toggle to light mode" : "Toggle to dark mode"}
        >
          {isDarkMode ? (
            <>
              <span className="mr-1">☀️</span>
              <span className="hidden sm:inline">Light mode</span>
            </>
          ) : (
            <>
              <span className="mr-1">🌙</span>
              <span className="hidden sm:inline">Dark mode</span>
            </>
          )}
        </button>
      </header>
      <main className="w-full mx-auto mt-20 px-4 md:px-6 pb-8 md:pb-12">
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-4">
            <img
              src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png"
              alt="Wikipedia logo"
              className="w-32 md:w-36 lg:w-40 mr-4"
            />

            <h1
              className={`text-2xl md:text-3xl lg:text-4xl font-serif mt-4 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Welcome to Wikipedia,
            </h1>
            <p
              className={`text-base md:text-lg lg:text-xl mb-6 mb-4 ${
                isDarkMode ? "text-white" : "text-gray-600"
              }`}
            >
              the free encyclopedia that anyone can edit.
            </p>
          </div>
        </div>

        {/* NEW: Unified container for search and content */}
        <div className="max-w-[750px] mx-auto px-4">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                id="wikiSearch"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Wikipedia..."
                className={`w-full p-4 pl-12 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-[#23272f] text-white placeholder:text-gray-300"
                    : "bg-white text-gray-800 placeholder:text-gray-600"
                }`}
              />
              <label htmlFor="wikiSearch">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </label>
            </div>
          </div>

          {/* Loading/Error/No Results */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-xl h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : searchTerm.trim() &&
            searchResults.length === 0 &&
            !pageContent ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>No content found. Try searching for something else.</p>
            </div>
          ) : (
            <>
              {searchResults.length > 0 && !pageContent && (
                <div
                  className={`rounded-xl shadow-md mb-6 border ${
                    isDarkMode
                      ? "bg-[#23272f] border-[#262b33]"
                      : "bg-gray-100 border-gray-200"
                  }`}
                  ref={searchInputRef}
                >
                  <ul
                    className={`divide-y max-h-[400px] overflow-y-auto ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {searchResults.map((result) => (
                      <li
                        role="button"
                        aria-label={`View topic: ${result.title}`}
                        key={result.pageid}
                        className={`p-4 cursor-pointer transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                        }`}
                        onClick={() => fetchPageContent(result.pageid)}
                      >
                        <h2
                          className={`text-xl font-semibold mb-1 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {result.title}
                        </h2>
                        <div
                          className={`text-sm line-clamp-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                          dangerouslySetInnerHTML={{ __html: result.snippet }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pageContent && (
                <div
                  className={`
                    rounded-xl shadow-md
                    my-8
                    border
                    flex flex-col gap-4
                    p-6
                    ${
                      isDarkMode
                        ? "bg-[#23272f] border-[#262b33]"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h1
                      className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {pageContent.title}
                    </h1>
                    <a
                      href={pageContent.fullurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
    block w-full sm:w-auto px-5 py-2 rounded-xl
    bg-blue-600 text-white font-semibold
    shadow-md border border-blue-700
    hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-300
    transition
    text-center
  `}
                      tabIndex={0}
                    >
                      View on Wikipedia
                    </a>
                  </div>

                  {pageContent.extract && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p
                        className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {pageContent.extract}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
