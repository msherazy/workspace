"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Poppins } from "next/font/google";

// Set up Poppins font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Mock data for initial state
const initialUsers = [
  { id: 1, name: "Alex", avatar: "A", online: true, typing: false },
  { id: 2, name: "Taylor", avatar: "T", online: false, typing: false },
  { id: 3, name: "Jordan", avatar: "J", online: true, typing: false },
  { id: 4, name: "Morgan", avatar: "M", online: false, typing: false }
];

const initialMessages = [
  { id: 1, userId: 1, text: "Hey everyone!", timestamp: Date.now() - 3600000 },
  { id: 2, userId: 3, text: "Hi Alex! How are you?", timestamp: Date.now() - 3500000 },
  { id: 3, userId: 1, text: "Doing great, thanks for asking!", timestamp: Date.now() - 3000000 }
];

// Typing indicator animation (bouncing dots)
const TypingIndicator = () => (
  <div className="flex items-center gap-1 ml-1">
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-purple-400 rounded-full inline-block"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const ChatVerse = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure TypeScript setup is correct. If not, configure `tsconfig.json` in the project root.

  // Adjust font loading for plain React (if not using Next.js)
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Optional: Use Poppins font (make sure to include the font in your project)
  useEffect(() => {
    document.body.style.fontFamily = "'Poppins', sans-serif";
  }, []);

  // Example: Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Example: Handle dark mode toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      userId: currentUserId,
      text: inputMessage,
      timestamp: Date.now()
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsTyping(false);

    // Simulate response from other users
    if (Math.random() > 0.7) simulateResponse();
  };

  // Prevent overlapping simulated responses
  const simulateResponse = () => {
    const onlineUsers = users.filter(u => u.online && u.id !== currentUserId);
    if (onlineUsers.length === 0) return;

    const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    setUsers(users => users.map(user => user.id === randomUser.id ? { ...user, typing: true } : user));

    setTimeout(() => {
      const responses = [
        "That's interesting! 😃",
        "I agree with you.",
        "What do you think about this?",
        "👍",
        "Nice one! 🚀",
        "Tell me more about that.",
        "I'm not sure about this."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const newMessage = {
        id: messages.length + 2,
        userId: randomUser.id,
        text: response,
        timestamp: Date.now()
      };

      // Ensure a delay between user message and response
      setTimeout(() => {
        setMessages(prev => [...prev, newMessage]);
        setUsers(users => users.map(user => user.id === randomUser.id ? { ...user, typing: false } : user));
      }, 1000); // Add a delay of 1 second
    }, 1500 + Math.random() * 1500);
  };

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (e.target.value.trim() !== "" && !isTyping) {
      setIsTyping(true);
      setUsers(users => users.map(user => user.id === currentUserId ? { ...user, typing: true } : user));
    } else if (e.target.value.trim() === "" && isTyping) {
      setIsTyping(false);
      setUsers(users => users.map(user => user.id === currentUserId ? { ...user, typing: false } : user));
    }
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: number) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    if (diff < 60000) return "Just now";
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (messageDate.toDateString() === new Date(now.getTime() - 86400000).toDateString()) {
      return `Yesterday ${messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (diff > 604800000) {
      return messageDate.toLocaleDateString([], { day: "numeric", month: "short" });
    }
    return messageDate.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
  };

  // Simulate users going online/offline
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => {
        const randomIndex = Math.floor(Math.random() * prevUsers.length);
        if (prevUsers[randomIndex].id === currentUserId) return prevUsers;
        return prevUsers.map((user, i) =>
          i === randomIndex ? { ...user, online: !user.online } : user
        );
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Responsive design for sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`${poppins.className} ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} h-screen flex`}>
      {/* Sidebar */}
      <aside className={`w-64 min-w-[220px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex-col p-4 space-y-4 ${sidebarOpen ? "block" : "hidden"} md:flex`}>
        <div className="text-lg font-semibold mb-2">Active Users</div>
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow ${user.online ? "bg-green-100 text-green-800" : "bg-gray-300 text-gray-500"}`}>
                {user.avatar}
              </div>
              <div>
                <div className="font-medium">
                  {user.name}
                  {user.id === currentUserId && <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">You</span>}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-300">
                  {user.online ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      <span>Online</span>
                      {user.typing && <TypingIndicator />}
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                      <span>Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <div className="flex items-center space-x-2">
            {/* Mobile sidebar toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(o => !o)}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }} className={`text-2xl font-bold mr-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
              ChatVerse
            </motion.div>
            <div className={`hidden md:flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>{users.filter(u => u.online).length} online</span>
            </div>
          </div>
          <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`} aria-label="Toggle dark mode">
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707 8 8 0 1017.293 13.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v1a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </header>

        {/* Chat window */}
        <main className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const user = users.find(u => u.id === msg.userId);
                const isCurrent = msg.userId === currentUserId;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`flex ${isCurrent ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-end space-x-2">
                      {!isCurrent && (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow ${user?.online ? "bg-green-100 text-green-800" : "bg-gray-300 text-gray-500"}`}>
                          {user?.avatar}
                        </div>
                      )}
                      <div className={`max-w-xs px-5 py-3 rounded-2xl shadow-lg ${isCurrent ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-700"} transition-colors`}>
                        <div className="text-sm">{msg.text}</div>
                        <div className="text-xs mt-1 text-gray-400 text-right">{formatTimestamp(msg.timestamp)}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {/* Show own typing indicator in chat */}
            {users.find(u => u.id !== currentUserId && u.typing) && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow bg-green-100 text-green-800">
                    {users.find(u => u.id !== currentUserId && u.typing)?.avatar}
                  </div>
                  <div className="max-w-xs px-5 py-3 rounded-2xl shadow-lg bg-white dark:bg-gray-700">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </main>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className={`flex items-center gap-2 p-4 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <input
            className={`flex-1 rounded-full px-4 py-2 outline-none ${darkMode ? "bg-gray-700 text-gray-100 placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-400"}`}
            placeholder="Type your message…"
            value={inputMessage}
            onChange={handleInputChange}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatVerse;
