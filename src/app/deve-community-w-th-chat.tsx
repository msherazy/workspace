"use client";
import { useEffect, useRef, useState } from "react";
import { Code, FolderKanban, MessageSquare, Moon, Send, Star, Sun, X } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface Post {
  id: number;
  title: string;
  code: string;
  description: string;
  comments: Comment[];
  stars: number;
  author: string;
  date: string;
  language: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  date: string;
  isRead: boolean;
}

interface Chat {
  id: number;
  user: string;
  lastMessage: string;
  date: string;
  isOnline: boolean;
  messages: Message[];
}

interface User {
  id: number;
  name: string;
  bio: string;
  location: string;
  website: string;
  joined: string;
  avatar: string;
}

const user: User = {
  id: 1,
  name: "Alex Johnson",
  bio: "Full-stack developer passionate about building scalable web applications...",
  location: "San Francisco, CA",
  website: "https://alexjohnson.dev",
  joined: "March 2023",
  avatar:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const posts: Post[] = [
  {
    id: 1,
    title: "Building a RESTful API with Node.js and Express",
    code: `const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    description:
      "Learn how to create a simple RESTful API using Node.js and Express framework...",
    comments: [
      { id: 1, author: "Jane Doe", text: "Great tutorial! Very informative.", date: "2 hours ago" },
      { id: 2, author: "John Doe", text: "Thanks for sharing this. Very helpful for beginners.", date: "1 hour ago" },
    ],
    stars: 13,
    author: "Alex Johnson",
    date: "2 days ago",
    language: "javascript",
  },
  {
    id: 2,
    title: "Introduction to React Hooks",
    code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}`,
    description:
      "Understand the basics of React Hooks and how to use them in your applications...",
    comments: [
      { id: 1, author: "Jane Doe", text: "Great tutorial! Very informative.", date: "2 hours ago" },
      { id: 2, author: "John Doe", text: "Thanks for sharing this. Very helpful for beginners.", date: "1 hour ago" },
    ],
    stars: 8,
    author: "Sam Smith",
    date: "3 days ago",
    language: "javascript",
  },
  {
    id: 3,
    title: "CSS Grid Layout Guide",
    code: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.item {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
}`,
    description:
      "Master the power of CSS Grid to create complex layouts with ease...",
    comments: [
      { id: 1, author: "Jane Doe", text: "Great tutorial! Very informative.", date: "2 hours ago" },
      { id: 2, author: "John Doe", text: "Thanks for sharing this. Very helpful for beginners.", date: "1 hour ago" },
    ],
    stars: 15,
    author: "Taylor Brown",
    date: "4 days ago",
    language: "css",
  },
];

const chats: Chat[] = [
  {
    id: 1,
    user: "Jordan Peterson",
    lastMessage: "Hey, need help with your code?",
    date: "10:00 AM",
    isOnline: true,
    messages: [
      { id: 1, sender: "Jordan Peterson", text: "Hey! How are you doing?", date: "10:05 AM", isRead: true },
      { id: 2, sender: user.name, text: "I'm good, thanks! How about you?", date: "10:07 AM", isRead: true },
      { id: 3, sender: "Jordan Peterson", text: "I'm doing well. Need help with your code?", date: "10:10 AM", isRead: true },
      { id: 4, sender: user.name, text: "Sure, what seems to be the problem?", date: "10:12 AM", isRead: true },
      { id: 5, sender: "Jordan Peterson", text: "I'm getting an error with...", date: "10:15 AM", isRead: false },
    ],
  },
  {
    id: 2,
    user: "Sarah Williams",
    lastMessage: "Let's catch up soon!",
    date: "Yesterday",
    isOnline: false,
    messages: [
      { id: 1, sender: "Sarah Williams", text: "Hey! Long time no talk.", date: "Yesterday 5:30 PM", isRead: true },
      { id: 2, sender: user.name, text: "Yeah! How have you been?", date: "Yesterday 5:35 PM", isRead: true },
      { id: 3, sender: "Sarah Williams", text: "I've been good. Let's catch up soon!", date: "Yesterday 5:40 PM", isRead: true },
    ],
  },
  {
    id: 3,
    user: "Michael Johnson",
    lastMessage: "I'll send you the details.",
    date: "Tuesday",
    isOnline: true,
    messages: [
      { id: 1, sender: "Michael Johnson", text: "Hi! I wanted to discuss the project.", date: "Tuesday 2:45 PM", isRead: true },
      { id: 2, sender: user.name, text: "Sure, I'm interested. Tell me more.", date: "Tuesday 2:50 PM", isRead: true },
      { id: 3, sender: "Michael Johnson", text: "I'll send you the details.", date: "Tuesday 2:55 PM", isRead: true },
    ],
  },
];

const SyntaxHighlighter = ({ code, language }: { code: string; language: string }) => {
  useEffect(() => {
    (async () => {
      const { default: hljs } = await import("highlight.js");
      document.querySelectorAll<HTMLElement>(".code-block code").forEach(block => {
        hljs.highlightElement(block);
      });
    })();
  }, [code]);

  return (
    <div className="code-block rounded-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700">
      <pre className="p-4 bg-gray-50 dark:bg-gray-900">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments);
  const [starsCount, setStarsCount] = useState(post.stars);
  const [hasStarred, setHasStarred] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [reactions, setReactions] = useState<number | null>(null);

  useEffect(() => {
    // Simulate asynchronous loading of reactions
    const fetchReactions = async () => {
      const response = await new Promise<number>(resolve => setTimeout(() => resolve(post.stars), 500));
      setReactions(response);
    };
    fetchReactions();
  }, [post.stars]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: commentsList.length + 1,
      author: user.name,
      text: newComment.trim(),
      date: "Just now",
    };
    setCommentsList([...commentsList, comment]);
    setNewComment("");
  };

  const handleStar = () => {
    if (!hasStarred) {
      setStarsCount(starsCount + 1);
      setHasStarred(true);
    }
  };

  return (
    <div className={`${inter.className} bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:shadow-lg`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStar}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                hasStarred
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              }`}
            >
              <Star className={`w-4 h-4 ${hasStarred ? "fill-current" : ""}`} />
              <span>{reactions !== null ? reactions : "..."}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentsList.length}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
          <img
            src={user.avatar}
            alt={post.author}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{post.author}</span> • {post.date}
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">{post.description}</p>

        {showCode && <SyntaxHighlighter code={post.code} language={post.language} />}

        <button
          onClick={() => setShowCode(!showCode)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center mb-4 transition-colors"
        >
          <Code className="w-4 h-4 mr-1" />
          {showCode ? "Hide code" : "View code"}
        </button>

        {showComments && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comments ({commentsList.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {commentsList.map(comment => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatPanel = ({
                     chats,
                     activeChat,
                     onSelectChat,
                     onClose,
                   }: {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onClose: () => void;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        const newMsg: Message = {
          id: chat.messages.length + 1,
          sender: user.name,
          text: newMessage.trim(),
          date: "Just now",
          isRead: true,
        };
        return {
          ...chat,
          lastMessage: newMsg.text,
          date: newMsg.date,
          messages: [...chat.messages, newMsg],
        };
      }
      return chat;
    });
    const updatedChat = updatedChats.find(c => c.id === activeChat.id)!;
    onSelectChat(updatedChat);
    setNewMessage("");
  };

  const filteredChats = chats.filter(chat =>
    chat.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${inter.className} bg-white dark:bg-gray-800 w-full md:w-80 h-full flex flex-col absolute md:static top-0 right-0 z-50 border-l border-gray-200 dark:border-gray-700`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
        <button
          onClick={onClose}
          className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <img
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${activeChat.user}`}
                    alt={activeChat.user}
                    className="w-10 h-10 rounded-full"
                  />
                  {activeChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{activeChat.user}</h3>
                  <span className={`text-xs ${activeChat.isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {activeChat.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === user.name ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs p-3 rounded-lg ${message.sender === user.name ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs mt-1 block">{message.date}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="p-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="relative mr-3">
                  <img
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${chat.user}`}
                    alt={chat.user}
                    className="w-10 h-10 rounded-full"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{chat.user}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatPanel(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    if (isMobile) {
      setShowChatPanel(true);
    }
  };

  const handleCloseChat = () => {
    setShowChatPanel(false);
    setTimeout(() => setActiveChat(null), 300);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <header className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FolderKanban className="w-8 h-8 mr-2 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Developer Community</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowChatPanel(!showChatPanel)}
              className="relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {chats.some(chat => chat.messages.some(msg => !msg.isRead)) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <main className="flex-1 p-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h2>
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Contributors</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map(userId => (
                      <div key={userId} className="flex items-center">
                        <img
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=User${userId}`}
                          alt={`User ${userId}`}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">User {userId}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{5 + userId} posts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {isMobile && showChatPanel && (
          <div className="fixed inset-0 z-50 transition-transform duration-300 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseChat}></div>
            <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 flex flex-col h-full">
              <ChatPanel
                chats={chats}
                activeChat={activeChat}
                onSelectChat={handleSelectChat}
                onClose={handleCloseChat}
              />
            </div>
          </div>
        )}

        {!isMobile && showChatPanel && (
          <ChatPanel
            chats={chats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            onClose={handleCloseChat}
          />
        )}
      </div>

      <footer className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Developer Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

