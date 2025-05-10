"use client";

import React, { FC, useEffect, useState } from "react";
import { AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { FiMoon, FiSun } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Inter } from "next/font/google";

// fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// data types
interface Comment { id: number; text: string; author: string }
interface Snippet { id: number; code: string; language: string; likes: number; comments: Comment[]; author: string }

// sample data
const SAMPLE: Snippet[] = [
  { id: 1, code: `<button className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg'>Click Me</button>`, language: "html", likes: 1, comments: [{ id: 1, author: "You", text: "Nice work!" }], author: "john_doe" },
  { id: 2, code: `console.log('An Easy complexity task with minimal functionality requirements.');`, language: "javascript", likes: 0, comments: [], author: "jane_doe" },
  { id: 3, code: `<div className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg'>Styled Div</div>`, language: "html", likes: 0, comments: [], author: "css_master" },
];

// ThemeToggle
const ThemeToggle: FC<{ theme: string; toggle: () => void }> = ({ theme, toggle }) => (
  <button
    onClick={toggle}
aria-label="Toggle theme"
className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
>
{theme === "light" ? <FiMoon className="w-6 h-6 text-gray-700" /> : <FiSun className="w-6 h-6 text-yellow-300" />}
</button>
);

// Header with search
const Header: FC<{
  title: string;
  search: string;
  onSearch: (q: string) => void;
  theme: string;
  toggle: () => void;
}> = ({ title, search, onSearch, theme, toggle }) => (
  <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
  <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 md:mb-0">{title}</h1>
    <div className="flex items-center space-x-3 w-full md:w-auto">
<ThemeToggle theme={theme} toggle={toggle} />
<div className="relative flex-1">
<input
  type="text"
aria-label="Search feed"
placeholder="Search code, language, or author..."
className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
value={search}
onChange={e => onSearch(e.target.value)}
/>
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
</div>
</div>
</header>
);

// Filter chips
const FilterChips: FC<{ options: string[]; active: string; onChange: (v: string) => void }> = ({ options, active, onChange }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {options.map(opt => (
        <button
          key={opt}
      onClick={() => onChange(opt)}
className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
  active === opt
    ? "bg-indigo-600 text-white shadow"
    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
}`}
>
{opt.charAt(0).toUpperCase() + opt.slice(1)}
</button>
))}
</div>
);

// Snippet card + comments
const SnippetCard: FC<{
  snippet: Snippet;
  liked: boolean;
  onLike: (id: number) => void;
  onToggleComments: (id: number) => void;
  showComments: boolean;
  onAddComment: (id: number, text: string) => void;
}> = ({ snippet: s, liked, onLike, onToggleComments, showComments, onAddComment }) => {
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
    <div className="flex items-center space-x-3">
    <img
      src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.author}`}
  alt={`${s.author}'s avatar`}
  className="w-10 h-10 rounded-full"
  />
  <div>
    <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{s.author}</h2>
    <p className="text-xs text-gray-500 dark:text-gray-400">
    Shared a code snippet · {new Date().toLocaleDateString()}
  </p>
  </div>
  </div>
  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
    {s.language}
    </span>
    </div>

    <div className="px-4 py-3">
  <SyntaxHighlighter
    language={s.language}
  style={vscDarkPlus}
  customStyle={{
    background: showComments ? undefined : undefined,
      borderRadius: "0.5rem",
      fontSize: "0.9rem",
  }}
>
  {s.code}
  </SyntaxHighlighter>
  </div>

  <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
  <div className="flex space-x-6">
  <button
    onClick={() => {
    try {
      onLike(s.id);
      setErr(null);
    } catch {
      setErr("Failed to like");
    }
  }}
  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
  >
  <AiOutlineLike className={`w-5 h-5 ${liked ? "text-indigo-600" : ""}`} />
  <span className="font-medium">{s.likes}</span>
    </button>
    <button
  onClick={() => onToggleComments(s.id)}
  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
  >
  <AiOutlineComment className="w-5 h-5" />
  <span className="font-medium">{s.comments.length}</span>
    </button>
    </div>
    </div>

  {err && <p className="px-4 text-sm text-red-500">{err}</p>}

    {showComments && (
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4">
        {s.comments.map(c => (
            <div key={c.id} className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
            {c.author[0].toUpperCase()}
            </div>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.author}</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
            </div>
            </div>
    ))}
      <div className="flex space-x-2">
      <input
        type="text"
      aria-label="Add comment"
      placeholder="Add a comment..."
      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      value={draft}
      onChange={e => setDraft(e.target.value)}
      />
      <button
      onClick={() => {
      try {
        onAddComment(s.id, draft);
        setDraft("");
        setErr(null);
      } catch {
        setErr("Failed to add comment");
      }
    }}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
        Post
        </button>
        </div>
        </div>
    )}
    </article>
  );
  };

// Main page
  export default function DeveloperFeed() {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadErr, setLoadErr] = useState<string|null>(null);
    const [theme, setTheme] = useState<"light"|"dark">("light");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all"|string>("all");
    const [liked, setLiked] = useState<number[]>([]);
    const [showCommentsFor, setShowCommentsFor] = useState<number|null>(null);

    // simulate fetch + theme init
    useEffect(() => {
      // theme
      const stored = localStorage.getItem("theme") as "light"|"dark"|null;
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const initTheme = stored || prefers;
      setTheme(initTheme);
      document.documentElement.classList.toggle("dark", initTheme === "dark");

      // data
      const load = async () => {
        try {
          await new Promise(r => setTimeout(r, 500));
          setSnippets(SAMPLE);
        } catch {
          setLoadErr("Unable to load feed.");
        } finally {
          setLoading(false);
        }
      };
      load();
    }, []);

    const toggleTheme = () => {
      const next = theme === "light" ? "dark" : "light";
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    };

    const handleLike = (id: number) => {
      setSnippets(prevSnippets =>
        prevSnippets.map(snippet =>
          snippet.id === id
            ? { ...snippet, likes: liked.includes(id) ? snippet.likes - 1 : snippet.likes + 1 }
            : snippet
        )
      );
      setLiked(prev =>
        prev.includes(id) ? prev.filter(likedId => likedId !== id) : [...prev, id]
      );
    };

    const handleComment = (id: number, text: string) => {
      setSnippets(s =>
        s.map(sn =>
          sn.id === id
            ? { ...sn, comments: [...sn.comments, { id: Date.now(), author: "You", text }] }
            : sn
        )
      );
    };

    // filtering
    const filtered = snippets.filter(sn => {
      const q = search.toLowerCase();
      const match = sn.author.includes(q) || sn.language.includes(q) || sn.code.includes(q);
      return filter === "all" ? match : match && sn.language === filter;
    });
    const langs = ["all", ...Array.from(new Set(snippets.map(sn => sn.language)))];

    return (
      <div className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
    <Header title="Dev Showcase" search={search} onSearch={setSearch} theme={theme} toggle={toggleTheme} />
    <FilterChips options={langs} active={filter} onChange={setFilter} />

    {loading ? (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading feed…</p>
    ) : loadErr ? (
      <p className="text-center text-red-500">{loadErr}</p>
    ) : filtered.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">No snippets found.</p>
    ) : (
      <div className="space-y-6">
        {filtered.map(sn => (
            <SnippetCard
              key={sn.id}
          snippet={sn}
          liked={liked.includes(sn.id)}
          onLike={handleLike}
          onToggleComments={id => setShowCommentsFor(prev => prev === id ? null : id)}
      showComments={showCommentsFor === sn.id}
      onAddComment={handleComment}
      />
    ))}
      </div>
    )}
    </div>
    </div>
  );
  }
