"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { toast, Toaster } from "react-hot-toast";

// types
type Font = {
  family: string;
  category: string;
  variants: string[];
  tags: string[];
};

type FilterOption = {
  id: string;
  label: string;
  examples: { text: string; fonts: string[] }[];
};

// consts
const DEFAULT_PREVIEW_TEXT =
  "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief";

const filterOptions: FilterOption[] = [
  {
    id: "feeling",
    label: "Feeling",
    examples: [
      {
        text: "Fancy",
        fonts: ["Dancing Script", "Playfair Display", "Great Vibes"],
      },
      { text: "Business", fonts: ["Roboto", "Montserrat", "Open Sans"] },
      { text: "Friendly", fonts: ["Comic Neue", "Baloo 2", "Nunito"] },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    examples: [
      { text: "Modern", fonts: ["Poppins", "Raleway", "Inter"] },
      {
        text: "Classic",
        fonts: ["Times New Roman", "Garamond", "Baskerville"],
      },
      { text: "Minimal", fonts: ["Helvetica", "Arial", "Fira Sans"] },
    ],
  },
  {
    id: "serif",
    label: "Serif",
    examples: [
      {
        text: "Traditional",
        fonts: ["Times New Roman", "Georgia", "Palatino"],
      },
      { text: "Contemporary", fonts: ["PT Serif", "Lora", "Source Serif Pro"] },
      { text: "Display", fonts: ["Playfair Display", "Bodoni", "Didot"] },
    ],
  },
  {
    id: "sans-serif",
    label: "Sans Serif",
    examples: [
      { text: "Geometric", fonts: ["Futura", "Avant Garde", "Century Gothic"] },
      { text: "Humanist", fonts: ["Gill Sans", "Myriad", "Frutiger"] },
      { text: "Grotesque", fonts: ["Helvetica", "Arial", "Univers"] },
    ],
  },
  {
    id: "technology",
    label: "Technology",
    examples: [
      { text: "Futuristic", fonts: ["Orbitron", "Rajdhani", "Titillium Web"] },
      {
        text: "Techy",
        fonts: ["Share Tech Mono", "Courier Prime", "Inconsolata"],
      },
      { text: "Digital", fonts: ["Digital-7", "LCD", "Seven Segment"] },
    ],
  },
];
//fonts families
const mockFonts: Font[] = [
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["100", "300", "400", "500", "700", "900"],
    tags: ["Business", "Modern"],
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    tags: ["Business", "Friendly"],
  },
  {
    family: "Lato",
    category: "sans-serif",
    variants: ["100", "300", "400", "700", "900"],
    tags: ["Modern", "Friendly"],
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Business", "Modern"],
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Modern", "Minimal"],
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Fancy", "Classic"],
  },
  {
    family: "Merriweather",
    category: "serif",
    variants: ["300", "400", "700", "900"],
    tags: ["Classic", "Traditional"],
  },
  {
    family: "PT Serif",
    category: "serif",
    variants: ["400", "700"],
    tags: ["Contemporary", "Traditional"],
  },
  {
    family: "Courier Prime",
    category: "monospace",
    variants: ["400", "700"],
    tags: ["Techy", "Minimal"],
  },
  {
    family: "Inconsolata",
    category: "monospace",
    variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Techy", "Digital"],
  },
  {
    family: "Dancing Script",
    category: "handwriting",
    variants: ["400", "700"],
    tags: ["Fancy", "Friendly"],
  },
  {
    family: "Pacifico",
    category: "handwriting",
    variants: ["400"],
    tags: ["Fancy", "Friendly"],
  },
  {
    family: "Great Vibes",
    category: "handwriting",
    variants: ["400"],
    tags: ["Fancy", "Classic"],
  },
  {
    family: "Comic Neue",
    category: "handwriting",
    variants: ["300", "400", "700"],
    tags: ["Friendly", "Modern"],
  },
  {
    family: "Baloo 2",
    category: "display",
    variants: ["400", "500", "600", "700", "800"],
    tags: ["Friendly", "Modern"],
  },
  {
    family: "Nunito",
    category: "sans-serif",
    variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Friendly", "Minimal"],
  },
  {
    family: "Raleway",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Modern", "Minimal"],
  },
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Modern", "Minimal"],
  },
  {
    family: "Times New Roman",
    category: "serif",
    variants: ["400", "700"],
    tags: ["Classic", "Traditional"],
  },
  {
    family: "Garamond",
    category: "serif",
    variants: ["400", "500", "600", "700", "800"],
    tags: ["Classic", "Traditional"],
  },
  {
    family: "Baskerville",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    tags: ["Classic", "Traditional"],
  },
  {
    family: "Helvetica",
    category: "sans-serif",
    variants: ["100", "300", "400", "500", "700", "900"],
    tags: ["Minimal", "Modern"],
  },
  {
    family: "Arial",
    category: "sans-serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Minimal", "Modern"],
  },
  {
    family: "Fira Sans",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    tags: ["Minimal", "Modern"],
  },
  {
    family: "Lora",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    tags: ["Contemporary", "Classic"],
  },
  {
    family: "Source Serif Pro",
    category: "serif",
    variants: ["200", "300", "400", "600", "700", "900"],
    tags: ["Contemporary", "Traditional"],
  },
  {
    family: "Bodoni",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Display", "Classic"],
  },
  {
    family: "Didot",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Display", "Classic"],
  },
  {
    family: "Futura",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800", "900"],
    tags: ["Geometric", "Modern"],
  },
  {
    family: "Century Gothic",
    category: "sans-serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Geometric", "Modern"],
  },
  {
    family: "Gill Sans",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    tags: ["Humanist", "Friendly"],
  },
  {
    family: "Myriad",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800", "900"],
    tags: ["Humanist", "Modern"],
  },
  {
    family: "Frutiger",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800", "900"],
    tags: ["Humanist", "Friendly"],
  },
  {
    family: "Univers",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800", "900"],
    tags: ["Grotesque", "Modern"],
  },
  {
    family: "Orbitron",
    category: "display",
    variants: ["400", "500", "600", "700", "800", "900"],
    tags: ["Futuristic", "Digital"],
  },
  {
    family: "Rajdhani",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700"],
    tags: ["Futuristic", "Modern"],
  },
  {
    family: "Titillium Web",
    category: "sans-serif",
    variants: ["200", "300", "400", "600", "700", "900"],
    tags: ["Futuristic", "Modern"],
  },
  {
    family: "Share Tech Mono",
    category: "monospace",
    variants: ["400"],
    tags: ["Techy", "Digital"],
  },
  {
    family: "Digital-7",
    category: "monospace",
    variants: ["400"],
    tags: ["Digital", "Techy"],
  },
  {
    family: "LCD",
    category: "monospace",
    variants: ["400"],
    tags: ["Digital", "Techy"],
  },
  {
    family: "Seven Segment",
    category: "monospace",
    variants: ["400"],
    tags: ["Digital", "Techy"],
  },
];

export default function GoogleFontsClone() {
  // states
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [viewingSelectedFonts, setViewingSelectedFonts] = useState(false);

  useEffect(() => {
    setFonts(mockFonts);
    setLoading(false);
  }, []);

  // methods
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    setActiveSubFilter(null);
  };

  const handleSubFilterClick = (fontFamily: string) => {
    setActiveSubFilter(activeSubFilter === fontFamily ? null : fontFamily);
  };

  const toggleFontSelection = (fontFamily: string) => {
    setSelectedFonts((prev) =>
      prev.includes(fontFamily)
        ? prev.filter((font) => font !== fontFamily)
        : [...prev, fontFamily],
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleViewSelectedFonts = () => {
    setViewingSelectedFonts(true);
  };

  const handleRemoveFont = (fontFamily: string) => {
    setSelectedFonts((prev) => prev.filter((font) => font !== fontFamily));
  };

  const handleDownloadFont = (fontFamily: string) => {
    toast.success(`Downloading ${fontFamily}...`, {
      position: "bottom-right",
      style: {
        background: darkMode ? "#1B1B1B" : "#fff",
        color: darkMode ? "#fff" : "#000",
      },
    });
  };

  const handleDownloadAll = () => {
    toast.success(`Downloading ${selectedFonts.length} fonts...`, {
      position: "bottom-right",
      style: {
        background: darkMode ? "#1B1B1B" : "#fff",
        color: darkMode ? "#fff" : "#000",
      },
    });
  };

  const handleBackToBrowse = () => {
    setViewingSelectedFonts(false);
  };

  const filteredFonts = fonts.filter((font) => {
    if (viewingSelectedFonts) {
      return selectedFonts.includes(font.family);
    }

    const matchesSearch = font.family
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeSubFilter) {
      return matchesSearch && font.family === activeSubFilter;
    }

    if (!activeFilter) return matchesSearch;

    const filterOption = filterOptions.find((f) => f.id === activeFilter);
    if (!filterOption) return matchesSearch;

    const isExampleFont = filterOption.examples.some((example) =>
      example.fonts.includes(font.family),
    );

    return matchesSearch && isExampleFont;
  });

  // styles
  const styles = {
    sidebar: {
      light: "bg-gray-50 border-gray-200",
      dark: "bg-[#1B1B1B] border-[#333333]",
    },
    mainContent: {
      light: "bg-white",
      dark: "bg-[#131314]",
    },
    text: {
      light: "text-gray-900",
      dark: "text-gray-100",
    },
    secondaryText: {
      light: "text-gray-600",
      dark: "text-gray-400",
    },
    input: {
      light: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
      dark: "bg-[#282A2C] border-[#333333] text-white placeholder-gray-500",
    },
    button: {
      light: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      dark: "bg-gray-700 hover:bg-gray-600 text-gray-100",
    },
    selectedFont: {
      light: "bg-blue-50",
      dark: "bg-[#282A2C]",
    },
    filterButton: {
      light: {
        base: "hover:bg-gray-100",
        active: "bg-blue-100 text-blue-800",
      },
      dark: {
        base: "hover:bg-gray-700",
        active: "bg-blue-600 text-white",
      },
    },
    subFilterButton: {
      light: {
        base: "hover:bg-gray-100",
        active: "bg-blue-200 text-blue-800",
      },
      dark: {
        base: "hover:bg-gray-700",
        active: "bg-blue-700 text-white",
      },
    },
  };

  return (
    <div
      className={`min-h-screen flex ${darkMode ? "text-gray-100" : "text-gray-900"}`}
    >
      <Head>
        <title>Google Fonts Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* toaster for successful download */}
      <Toaster />

      {/* sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 flex-shrink-0 border-r ${darkMode ? styles.sidebar.dark : styles.sidebar.light}`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Preview Text</h2>
              <textarea
                placeholder="Type something to preview fonts..."
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? styles.input.dark : styles.input.light} focus:outline-none`}
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Filters</h2>
              <div className="space-y-4">
                {filterOptions.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <button
                      onClick={() => handleFilterClick(filter.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${
                        activeFilter === filter.id
                          ? darkMode
                            ? styles.filterButton.dark.active
                            : styles.filterButton.light.active
                          : darkMode
                            ? styles.filterButton.dark.base
                            : styles.filterButton.light.base
                      }`}
                    >
                      {filter.label}
                    </button>
                    {activeFilter === filter.id && (
                      <div className="ml-4 space-y-2">
                        {filter.examples.map((example, index) => (
                          <div key={index} className="space-y-2">
                            <p
                              className={`text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {example.text}
                            </p>
                            <div className="space-y-1">
                              {example.fonts.map((fontName) => {
                                const font = fonts.find(
                                  (f) => f.family === fontName,
                                );
                                if (!font) return null;
                                return (
                                  <button
                                    key={fontName}
                                    onClick={() =>
                                      handleSubFilterClick(fontName)
                                    }
                                    className={`w-full text-left px-2 py-1.5 rounded transition-all ${
                                      activeSubFilter === fontName
                                        ? darkMode
                                          ? styles.subFilterButton.dark.active
                                          : styles.subFilterButton.light.active
                                        : darkMode
                                          ? styles.subFilterButton.dark.base
                                          : styles.subFilterButton.light.base
                                    }`}
                                    style={{ fontFamily: font.family }}
                                  >
                                    {fontName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* dark/light mode toggler */}
            <div className="mb-4">
              <button
                onClick={toggleDarkMode}
                className={`flex items-center justify-center w-full py-2 rounded-lg ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
              >
                {darkMode ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div
        className={`flex-1 flex flex-col ${darkMode ? styles.mainContent.dark : styles.mainContent.light}`}
      >
        {/* nav */}
        <nav
          className={`sticky top-0 z-10 ${darkMode ? "bg-[#1B1B1B] border-[#333333]" : "bg-white border-gray-200"} border-b px-6 py-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`mr-4 p-2 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Google Fonts</h1>
            </div>

            <div className="flex-1 max-w-xl mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fonts"
                  className={`w-full pr-10 pl-4 py-2.5 rounded-lg border focus:outline-none placeholder:invisible sm:placeholder:visible ${darkMode ? styles.input.dark : styles.input.light}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={
                  selectedFonts.length > 0 ? handleViewSelectedFonts : undefined
                }
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${darkMode ? styles.button.dark : styles.button.light} ${selectedFonts.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="text-sm font-medium">
                  {selectedFonts.length}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* font list area */}
        <main className="flex-1 p-6">
          {viewingSelectedFonts ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleBackToBrowse}
                  className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? styles.button.dark : styles.button.light}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Browse
                </button>
                {selectedFonts.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-green-700 hover:bg-green-600 text-white" : "bg-green-100 hover:bg-green-200 text-green-800"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download All ({selectedFonts.length})
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {selectedFonts.length === 0 ? (
                  <div
                    className={`text-center py-16 ${darkMode ? styles.secondaryText.dark : styles.secondaryText.light}`}
                  >
                    <h3 className="text-xl font-medium mb-2">
                      No fonts selected
                    </h3>
                    <p>Select some fonts to see them here</p>
                  </div>
                ) : (
                  filteredFonts.map((font) => (
                    <div
                      key={font.family}
                      className={`p-5 rounded-lg transition-all ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-semibold">{font.family}</h2>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRemoveFont(font.family)}
                            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-200 text-red-500"}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadFont(font.family)}
                            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700 text-green-400" : "hover:bg-gray-200 text-green-500"}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div
                        className="text-2xl py-4 break-words leading-snug"
                        style={{ fontFamily: font.family }}
                      >
                        {previewText || DEFAULT_PREVIEW_TEXT}
                      </div>
                      <div
                        className={`text-sm ${darkMode ? styles.secondaryText.dark : styles.secondaryText.light}`}
                      >
                        {font.variants.length} styles • {font.category}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFonts.map((font) => (
                <div
                  key={font.family}
                  onClick={() => toggleFontSelection(font.family)}
                  className={`p-5 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedFonts.includes(font.family)
                      ? darkMode
                        ? styles.selectedFont.dark
                        : styles.selectedFont.light
                      : darkMode
                        ? "hover:bg-gray-900 hover:shadow-sm"
                        : "hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold">{font.family}</h2>
                      <span
                        className={`text-sm ${darkMode ? styles.secondaryText.dark : styles.secondaryText.light}`}
                      >
                        <span
                          className={`text-sm ${darkMode ? styles.secondaryText.dark : styles.secondaryText.light} pr-2`}
                        >
                          |
                        </span>
                        {font.variants.length} styles • {font.category}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-2xl py-4 break-words leading-snug"
                    style={{ fontFamily: font.family }}
                  >
                    {previewText || DEFAULT_PREVIEW_TEXT}
                  </div>
                </div>
              ))}

              {filteredFonts.length === 0 && !loading && (
                <div
                  className={`text-center py-16 ${darkMode ? styles.secondaryText.dark : styles.secondaryText.light}`}
                >
                  <h3 className="text-xl font-medium mb-2">No fonts found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
