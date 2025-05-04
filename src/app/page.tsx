"use client";

import React, { useEffect, useState } from "react";
import { Heart, Home, Moon, PlusCircle, Search, Sun, User, X } from "lucide-react";

// Google Fonts
const GoogleFontStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Nunito:wght@400;500;600;700&display=swap');
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    ::placeholder {
      font-size: 0.85rem;
      opacity: 0.6;
      font-style: italic;
    }
  `}</style>
);

// Define our types
type Profile = {
  id: number;
  name: string;
  favoriteYarn: string;
  image: string;
};

type Post = {
  id: number;
  userId: number;
  username: string;
  userImage: string;
  image: string;
  description: string;
  projectType: string;
  yarnBrand: string;
  likes: number;
  liked: boolean;
  timestamp: string;
};

// Craft-inspired color palette
const COLORS = {
  primary: {
    light: '#A78B71', // Warm taupe (undyed wool)
    dark: '#8D6E63'   // Darker taupe
  },
  accent: {
    light: '#C77D58', // Terracotta (clay)
    dark: '#B56549'   // Darker terracotta
  },
  secondary: {
    light: '#6B8E7E', // Sage green
    dark: '#5A7A6D'   // Darker sage
  },
  background: {
    light: '#F8F4F0', // Creamy ivory
    dark: '#2B2118'   // Dark chocolate
  },
  text: {
    primary: {
      light: '#3E2723', // Dark chocolate
      dark: '#F5F5F5'   // Bright white (95% white)
    },
    secondary: {
      light: '#5D4037', // Medium brown
      dark: '#E0E0E0'   // Light gray (88% white)
    }
  },
  card: {
    light: '#FFFFFF', // Pure white for cards
    dark: '#3E2723'   // Dark brown for cards
  }
};

const Index = () => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'search'>('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'projectType' | 'yarnBrand'>('projectType');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    image: '',
    description: '',
    projectType: '',
    yarnBrand: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    favoriteYarn: '',
    image: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

  // Get color based on current mode
  const getColor = (colorType: keyof typeof COLORS, textType: 'primary' | 'secondary' = 'primary') => {
    if (colorType === 'text') {
      return darkMode ? COLORS.text[textType].dark : COLORS.text[textType].light;
    }
    return darkMode ? COLORS[colorType].dark : COLORS[colorType].light;
  };

  // Initialize with sample data
  useEffect(() => {
    const sampleProfiles = [
      { id: 1, name: 'Emma Wilson', favoriteYarn: 'Merino Wool', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 2, name: 'Sarah Johnson', favoriteYarn: 'Bamboo Silk', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 3, name: 'James Miller', favoriteYarn: 'Cotton Blend', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 4, name: 'You', favoriteYarn: 'Alpaca Wool', image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ];

    const samplePosts = [
      {
        id: 1,
        userId: 1,
        username: 'Emma Wilson',
        userImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        image: 'https://cdn.shopify.com/s/files/1/0553/8142/6241/files/0H5A3379_480x480.jpg?v=1734063814',
        description: 'Just finished this cozy winter scarf! Love how the colors came out.',
        projectType: 'Scarf',
        yarnBrand: 'Cascade',
        likes: 12,
        liked: false,
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        userId: 2,
        username: 'Sarah Johnson',
        userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        image: 'https://images.pexels.com/photos/6230971/pexels-photo-6230971.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'My first attempt at a cable knit sweater. Still learning but I\'m proud!',
        projectType: 'Sweater',
        yarnBrand: 'Malabrigo',
        likes: 24,
        liked: true,
        timestamp: '1 day ago'
      },
      {
        id: 3,
        userId: 3,
        username: 'James Miller',
        userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        image: 'https://images.pexels.com/photos/8955855/pexels-photo-8955855.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Made these mittens for my niece. She loves the bunny pattern!',
        projectType: 'Mittens',
        yarnBrand: 'Lion Brand',
        likes: 18,
        liked: false,
        timestamp: '3 days ago'
      }
    ];

    setProfiles(sampleProfiles);
    setPosts(samplePosts);
    setCurrentUser(sampleProfiles[3]);

    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('knitDarkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? savedMode === 'true' : prefersDark);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('knitDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('knitDarkMode', 'false');
    }
  }, [darkMode]);

  // Handle like functionality
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  // Handle search functionality
  const filteredPosts = searchTerm
    ? posts.filter(post => {
      if (searchType === 'projectType') {
        return post.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post.yarnBrand.toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    : posts;

  // Create a new post
  const handleCreatePost = () => {
    if (
      currentUser && 
      newPost.description.trim() !== '' && 
      newPost.image.trim() !== '' &&
      newPost.projectType.trim() !== '' &&
      newPost.yarnBrand.trim() !== ''
    ) {
      const newPostObject: Post = {
        id: posts.length + 1,
        userId: currentUser.id,
        username: currentUser.name,
        userImage: currentUser.image,
        image: newPost.image,
        description: newPost.description,
        projectType: newPost.projectType,
        yarnBrand: newPost.yarnBrand,
        likes: 0,
        liked: false,
        timestamp: 'Just now'
      };

      setPosts([newPostObject, ...posts]);
      setNewPost({
        image: '',
        description: '',
        projectType: '',
        yarnBrand: ''
      });
      closeModal();
    }
  };

  // Update profile
  const handleUpdateProfile = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: editedProfile.name || currentUser.name,
        favoriteYarn: editedProfile.favoriteYarn || currentUser.favoriteYarn,
        image: editedProfile.image || currentUser.image
      };

      setCurrentUser(updatedUser);
      setProfiles(profiles.map(profile =>
        profile.id === currentUser.id ? updatedUser : profile
      ));
      closeModal();
    }
  };

  // Modal handling with animations
  const openModal = (type: 'post' | 'profile') => {
    setModalOpen(true);
    if (type === 'post') {
      setIsCreatingPost(true);
    } else {
      setIsEditingProfile(true);
    }
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setIsCreatingPost(false);
      setIsEditingProfile(false);
    }, 200);
  };

  // Filter posts by tag
  const filterByTag = (type: 'projectType' | 'yarnBrand', value: string) => {
    setSearchType(type);
    setSearchTerm(value);
    setActiveTab('search');
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{ backgroundColor: getColor('background') }}
    >
      <GoogleFontStyles />

      {/* Header */}
      <header
        className="p-4 shadow-lg sticky top-0 z-10"
        style={{ backgroundColor: getColor('primary') }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-merriweather text-white">Knit Connect</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-white hover:bg-black/10 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <nav className="hidden md:flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'feed' ? 'bg-white/20 text-white' : 'text-white hover:bg-black/10'
                }`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'profile' ? 'bg-white/20 text-white' : 'text-white hover:bg-black/10'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'search' ? 'bg-white/20 text-white' : 'text-white hover:bg-black/10'
                }`}
                onClick={() => setActiveTab('search')}
              >
                Search
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-merriweather"
                style={{ color: getColor('text', 'primary') }}
              >
                Latest Projects
              </h2>
              <button
                onClick={() => openModal('post')}
                className="p-2 rounded-full shadow-md text-white transition-all hover:scale-105"
                style={{ backgroundColor: getColor('accent') }}
              >
                <PlusCircle size={20} />
              </button>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-lg shadow-md overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
                >
                  {/* Post Header */}
                  <div className={`flex items-center p-3 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <img src={post.userImage} alt={post.username} className="w-8 h-8 rounded-full object-cover" />
                    <div className="ml-2">
                      <h3
                        className="font-medium"
                        style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                      >
                        {post.username}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                      >
                        {post.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <img src={post.image} alt={post.description} className="w-full aspect-square object-cover" />

                  {/* Post Content */}
                  <div className="p-4">
                    <p
                      className="mb-2 font-nunito"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => filterByTag('projectType', post.projectType)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-teal-300 hover:bg-gray-600' :
                            'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        } transition-colors`}
                      >
                        Project: {post.projectType}
                      </button>
                      <button
                        onClick={() => filterByTag('yarnBrand', post.yarnBrand)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-amber-300 hover:bg-gray-600' :
                            'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        } transition-colors`}
                      >
                        Yarn: {post.yarnBrand}
                      </button>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 group"
                    >
                      <Heart
                        size={18}
                        className={`transition-all duration-300 ${
                          post.liked
                            ? 'text-rose-500 fill-rose-500 animate-[heartbeat_0.5s_ease-in-out]'
                            : 'text-gray-400 dark:text-gray-300 group-hover:text-rose-400'
                        }`}
                      />
                      <span
                        className="text-sm"
                        style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                      >
                        {post.likes}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && currentUser && (
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-lg shadow-md overflow-hidden border ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
            >
              <div className="relative">
                <div
                  className="h-32"
                  style={{ backgroundColor: getColor('secondary') }}
                ></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
                  />
                </div>
              </div>

              <div className="pt-16 px-6 pb-6">
                <div className="text-center mb-6">
                  <h2
                    className="text-xl font-merriweather"
                    style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                  >
                    {currentUser.name}
                  </h2>
                  <p style={{ color: darkMode ? '#E0E0E0' : '#5D4037' }}>
                    Favorite Yarn: {currentUser.favoriteYarn}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditedProfile({
                      name: currentUser.name,
                      favoriteYarn: currentUser.favoriteYarn,
                      image: currentUser.image
                    });
                    openModal('profile');
                  }}
                  className="w-full py-2 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: getColor('accent') }}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* My Projects Section */}
            <div className="mt-8">
              <h3
                className="text-lg font-merriweather mb-4"
                style={{ color: getColor('text', 'primary') }}
              >
                My Projects
              </h3>

              {posts.filter(post => post.userId === currentUser.id).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {posts.filter(post => post.userId === currentUser.id).map(post => (
                    <div
                      key={post.id}
                      className={`rounded-lg shadow-md overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
                    >
                      <img
                        src={post.image}
                        alt={post.description}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p
                          className="text-sm line-clamp-2 font-nunito"
                          style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                        >
                          {post.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-1">
                            <Heart
                              size={16}
                              className={post.liked
                                ? 'text-rose-500 fill-rose-500'
                                : 'text-gray-400 dark:text-gray-300'}
                            />
                            <span
                              className="text-xs"
                              style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                            >
                              {post.likes}
                            </span>
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                          >
                            {post.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-center py-8 rounded-lg shadow-md border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
                >
                  <p
                    className=""
                    style={{ color: darkMode ? '#E0E0E0' : '#5D4037' }}
                  >
                    You haven't shared any projects yet.
                  </p>
                  <button
                    onClick={() => {
                      openModal('post');
                      setActiveTab('feed');
                    }}
                    className="mt-2 px-4 py-2 text-white rounded-md text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: getColor('accent') }}
                  >
                    Share Your First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div
              className={`rounded-lg shadow-md p-4 mb-6 border ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                  />
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === 'projectType' ? 'project type' : 'yarn brand'}...`}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                    style={{
                      backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                      color: darkMode ? '#FFFFFF' : '#3E2723',
                      borderColor: darkMode ? '#4A5568' : '#E2E8F0'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex">
                  <button
                    className={`px-4 py-2 rounded-l-md border ${
                      searchType === 'projectType'
                        ? 'text-white border-transparent'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{
                      backgroundColor: searchType === 'projectType' ? getColor('accent') :
                        (darkMode ? '#2D3748' : '#F7FAFC'),
                      color: searchType === 'projectType' ? '#FFFFFF' : 
                        (darkMode ? '#FFFFFF' : '#3E2723')
                    }}
                    onClick={() => setSearchType('projectType')}
                  >
                    Project Type
                  </button>
                  <button
                    className={`px-4 py-2 rounded-r-md border ${
                      searchType === 'yarnBrand'
                        ? 'text-white border-transparent'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{
                      backgroundColor: searchType === 'yarnBrand' ? getColor('accent') :
                        (darkMode ? '#2D3748' : '#F7FAFC'),
                      color: searchType === 'yarnBrand' ? '#FFFFFF' : 
                        (darkMode ? '#FFFFFF' : '#3E2723')
                    }}
                    onClick={() => setSearchType('yarnBrand')}
                  >
                    Yarn Brand
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div>
              <h2
                className="text-lg font-merriweather mb-4"
                style={{ color: getColor('text', 'primary') }}
              >
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Projects'}
              </h2>

              {filteredPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`rounded-lg shadow-md overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
                    >
                      {/* Post Header */}
                      <div className={`flex items-center p-3 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <img src={post.userImage} alt={post.username} className="w-8 h-8 rounded-full object-cover" />
                        <div className="ml-2">
                          <h3
                            className="font-medium"
                            style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                          >
                            {post.username}
                          </h3>
                          <p
                            className="text-xs"
                            style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                          >
                            {post.timestamp}
                          </p>
                        </div>
                      </div>

                      {/* Post Image */}
                      <img src={post.image} alt={post.description} className="w-full aspect-square object-cover" />

                      {/* Post Content */}
                      <div className="p-4">
                        <p
                          className="mb-2 font-nunito"
                          style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                        >
                          {post.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <button
                            onClick={() => filterByTag('projectType', post.projectType)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-teal-300 hover:bg-gray-600' :
                                'bg-teal-100 text-teal-800 hover:bg-teal-200'
                            } transition-colors`}
                          >
                            Project: {post.projectType}
                          </button>
                          <button
                            onClick={() => filterByTag('yarnBrand', post.yarnBrand)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-amber-300 hover:bg-gray-600' :
                                'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            } transition-colors`}
                          >
                            Yarn: {post.yarnBrand}
                          </button>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 group"
                        >
                          <Heart
                            size={18}
                            className={`transition-all duration-300 ${
                              post.liked
                                ? 'text-rose-500 fill-rose-500 animate-[heartbeat_0.5s_ease-in-out]'
                                : 'text-gray-400 dark:text-gray-300 group-hover:text-rose-400'
                            }`}
                          />
                          <span
                            className="text-sm"
                            style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                          >
                            {post.likes}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-center py-12 rounded-lg shadow-md border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
                >
                  <p
                    className=""
                    style={{ color: darkMode ? '#E0E0E0' : '#5D4037' }}
                  >
                    No projects found. Try a different search term.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around z-10 py-3"
        style={{
          backgroundColor: getColor('primary'),
          borderTop: `1px solid ${darkMode ? '#5D4037' : '#BCAAA4'}`
        }}
      >
        <button
          className="flex flex-col items-center"
          onClick={() => setActiveTab('feed')}
        >
          <Home
            size={24}
            color={activeTab === 'feed' ? '#FFFFFF' : '#D7CCC8'}
          />
          <span
            className="text-xs mt-1"
            style={{ color: activeTab === 'feed' ? '#FFFFFF' : '#D7CCC8' }}
          >
            Feed
          </span>
        </button>

        <button
          className="flex flex-col items-center"
          onClick={() => setActiveTab('search')}
        >
          <Search
            size={24}
            color={activeTab === 'search' ? '#FFFFFF' : '#D7CCC8'}
          />
          <span
            className="text-xs mt-1"
            style={{ color: activeTab === 'search' ? '#FFFFFF' : '#D7CCC8' }}
          >
            Search
          </span>
        </button>

        <button
          className="flex flex-col items-center"
          onClick={() => setActiveTab('profile')}
        >
          <User
            size={24}
            color={activeTab === 'profile' ? '#FFFFFF' : '#D7CCC8'}
          />
          <span
            className="text-xs mt-1"
            style={{ color: activeTab === 'profile' ? '#FFFFFF' : '#D7CCC8' }}
          >
            Profile
          </span>
        </button>
      </div>

      {/* Modal Overlay */}
      {(isCreatingPost || isEditingProfile) && (
        <div
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4 transition-opacity duration-200 ${
            modalClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeModal}
        >
          <div
            className={`rounded-lg shadow-xl max-w-md w-full p-6 transition-all duration-200 ${
              modalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{ backgroundColor: darkMode ? COLORS.card.dark : COLORS.card.light }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Create Post Modal */}
            {isCreatingPost && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-lg font-medium"
                    style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                  >
                    Share Your Project
                  </h3>
                  <button
                    onClick={closeModal}
                    style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      Image URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Paste an image URL"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                      style={{
                        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                        backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#3E2723',
                        focusRingColor: getColor('accent')
                      }}
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      placeholder="Tell us about your project..."
                      className="w-full px-3 py-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 text-base"
                      style={{
                        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                        backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#3E2723',
                        focusRingColor: getColor('accent')
                      }}
                      value={newPost.description}
                      onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                      >
                        Project Type <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Sweater, Scarf"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                        style={{
                          borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                          backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                          color: darkMode ? '#FFFFFF' : '#3E2723',
                          focusRingColor: getColor('accent')
                        }}
                        value={newPost.projectType}
                        onChange={(e) => setNewPost({...newPost, projectType: e.target.value})}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                      >
                        Yarn Brand <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Malabrigo, Lion Brand"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                        style={{
                          borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                          backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                          color: darkMode ? '#FFFFFF' : '#3E2723',
                          focusRingColor: getColor('accent')
                        }}
                        value={newPost.yarnBrand}
                        onChange={(e) => setNewPost({...newPost, yarnBrand: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="text-xs" style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}>
                    <span className="text-rose-500">*</span> All fields are required
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={
                      !newPost.image.trim() || 
                      !newPost.description.trim() || 
                      !newPost.projectType.trim() || 
                      !newPost.yarnBrand.trim()
                    }
                    className={`w-full py-2 rounded-md text-white font-medium transition-opacity ${
                      !newPost.image.trim() || 
                      !newPost.description.trim() || 
                      !newPost.projectType.trim() || 
                      !newPost.yarnBrand.trim() 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:opacity-90'
                    }`}
                    style={{ backgroundColor: getColor('accent') }}
                  >
                    Share Project
                  </button>
                </div>
              </>
            )}

            {/* Edit Profile Modal */}
            {isEditingProfile && currentUser && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-lg font-medium"
                    style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                  >
                    Edit Profile
                  </h3>
                  <button
                    onClick={closeModal}
                    style={{ color: darkMode ? '#CCCCCC' : '#5D4037' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your display name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                      style={{
                        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                        backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#3E2723',
                        focusRingColor: getColor('accent')
                      }}
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      Favorite Yarn
                    </label>
                    <input
                      type="text"
                      placeholder="What yarn do you love to work with?"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                      style={{
                        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                        backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#3E2723',
                        focusRingColor: getColor('accent')
                      }}
                      value={editedProfile.favoriteYarn}
                      onChange={(e) => setEditedProfile({...editedProfile, favoriteYarn: e.target.value})}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: darkMode ? '#FFFFFF' : '#3E2723' }}
                    >
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="Link to your profile picture"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base"
                      style={{
                        borderColor: darkMode ? '#4A5568' : '#E2E8F0',
                        backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#3E2723',
                        focusRingColor: getColor('accent')
                      }}
                      value={editedProfile.image}
                      onChange={(e) => setEditedProfile({...editedProfile, image: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-2 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: getColor('accent') }}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="py-6 px-4 text-center"
        style={{ backgroundColor: getColor('primary') }}
      >
        <p className="text-white">
          © 2025 Knit Connect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;

