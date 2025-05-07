"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { FiMoon, FiSun } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Inter, Poppins } from "next/font/google";

// Import custom fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600'], variable: '--font-poppins' })

interface Comment {
  id: number
  text: string
  author: string
}

interface Snippet {
  id: number
  code: string
  language: string
  likes: number
  comments: Comment[]
  author: string
}

const DeveloperFeed: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [selectedSnippetId, setSelectedSnippetId] = useState<number | null>(null)
  const [likedSnippets, setLikedSnippets] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<'all' | string>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Sample data
  const sampleSnippets: Snippet[] = [
    {
      id: 1,
      code: "<button className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg'>Click Me</button>",
      language: 'html',
      likes: 1,
      comments: [{ id: 1, author: 'You', text: 'Nice work!' }],
      author: 'john_doe',
    },
    {
      id: 2,
      code: "console.log('Hello, world!');",
      language: 'javascript',
      likes: 0,
      comments: [],
      author: 'jane_doe',
    },
    {
      id: 3,
      code: "<div className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg'>Styled Div</div>",
      language: 'html',
      likes: 0,
      comments: [],
      author: 'css_master',
    },
  ]

  // Initialize feed and theme
  useEffect(() => {
    setSnippets(sampleSnippets);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = stored || prefer;
    setTheme(initial);

    // Ensure the 'dark' class is applied to the <html> element
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a202c'; // Explicitly set dark background
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb'; // Explicitly set light background
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);

    // Toggle the 'dark' class on the <html> element
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a202c'; // Explicitly set dark background
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb'; // Explicitly set light background
    }

    localStorage.setItem('theme', next);
  }

  // Handlers
  const handleLike = (id: number) => {
    setSnippets(snippets.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s))
    setLikedSnippets(prev => [...prev, id])
  }

  const handleAddComment = (id: number) => {
    if (!newComment.trim()) return
    const comment: Comment = { id: Date.now(), text: newComment, author: 'You' }
    setSnippets(
      snippets.map(s =>
        s.id === id ? { ...s, comments: [...s.comments, comment] } : s
      )
    )
    setNewComment('')
  }

  // Filtering
  const filtered = snippets.filter(s => {
    const search = searchQuery.toLowerCase()
    const matches = [s.author, s.language, s.code].some(field =>
      field.toLowerCase().includes(search)
    )
    return activeFilter === 'all' ? matches : matches && s.language === activeFilter
  })

  const languages = ['all', ...new Set(snippets.map(s => s.language))]

  return (
    <div className={`${inter.variable} ${poppins.variable} font-sans min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 md:mb-0">
            Dev Showcase
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light'
                ? <FiMoon className="w-6 h-6 text-gray-700" />
                : <FiSun className="w-6 h-6 text-yellow-300" />
              }
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                aria-label="Search feed"
                placeholder="Search code, language, or author..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveFilter(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === lang
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.length > 0 ? (
            filtered.map(s => (
              <article
                key={s.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                      {s.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {s.author}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Shared a code snippet • {new Date().toLocaleDateString()}
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
                      background: theme === 'light' ? '#f5f5f5' : '#2d2d2d',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    {s.code}
                  </SyntaxHighlighter>
                </div>

                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
                  <div className="flex space-x-6">
                    <button
                      onClick={() => handleLike(s.id)}
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <AiOutlineLike
                        className={`w-5 h-5 ${
                          likedSnippets.includes(s.id) ? 'text-indigo-600' : ''
                        }`}
                      />
                      <span className="font-medium">{s.likes}</span>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedSnippetId(
                          selectedSnippetId === s.id ? null : s.id
                        )
                      }
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <AiOutlineComment className="w-5 h-5" />
                      <span className="font-medium">{s.comments.length}</span>
                    </button>
                  </div>
                </div>

                {selectedSnippetId === s.id && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {s.comments.map(c => (
                      <div key={c.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                          {c.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {c.author}
                          </p>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        aria-label="Add comment"
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                      />
                      <button
                        onClick={() => handleAddComment(s.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-500 dark:text-gray-400">
                No code snippets found. Try another search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperFeed
