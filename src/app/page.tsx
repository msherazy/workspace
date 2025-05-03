"use client";

import React, { useEffect, useState } from "react";
import { Facebook, Heart, Home, Instagram, Moon, PlusCircle, Search, Sun, Twitter, User, X } from "lucide-react";

// Add Google Fonts directly in the component
const GoogleFontStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Nunito:wght@400;500;600;700&display=swap');
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
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

const Index = () => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'search'>('feed');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or prefer-color-scheme
  useEffect(() => {
    const savedMode = localStorage.getItem('knitConnectDarkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('knitConnectDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('knitConnectDarkMode', 'false');
    }
  }, [darkMode]);

  // State for posts
  const [posts, setPosts] = useState<Post[]>([]);

  // State for profiles
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // State for current user
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'projectType' | 'yarnBrand'>('projectType');

  // State for new post
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    image: '',
    description: '',
    projectType: '',
    yarnBrand: ''
  });

  // State for profile edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    favoriteYarn: '',
    image: ''
  });

  // State for modal animations
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

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
  }, []);

  // Handle like functionality with animation
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
    if (currentUser && newPost.description && newPost.image) {
      const newPostObject: Post = {
        id: posts.length + 1,
        userId: currentUser.id,
        username: currentUser.name,
        userImage: currentUser.image,
        image: newPost.image,
        description: newPost.description,
        projectType: newPost.projectType || 'Other',
        yarnBrand: newPost.yarnBrand || 'Unknown',
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <GoogleFontStyles />

      {/* Header */}
      <header className="bg-[#F97358] dark:bg-gray-800 text-white p-4 shadow-lg transition-colors duration-200">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-merriweather">Knit Connect</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-[#E75137] dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <nav className="hidden md:flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'feed' ? 'bg-[#8B5CF6] dark:bg-[#7C3AED] text-white' : 'text-white hover:bg-[#E75137] dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'profile' ? 'bg-[#8B5CF6] dark:bg-[#7C3AED] text-white' : 'text-white hover:bg-[#E75137] dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'search' ? 'bg-[#8B5CF6] dark:bg-[#7C3AED] text-white' : 'text-white hover:bg-[#E75137] dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('search')}
              >
                Search
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.3)] flex justify-around z-10 transition-colors duration-200">
        <button
          className={`p-4 flex-1 flex flex-col items-center ${activeTab === 'feed' ? 'text-[#8B5CF6] dark:text-[#C6B7F6]' : 'text-gray-700 dark:text-gray-400'}`}
          onClick={() => setActiveTab('feed')}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Feed</span>
        </button>
        <button
          className={`p-4 flex-1 flex flex-col items-center ${activeTab === 'search' ? 'text-[#8B5CF6] dark:text-[#C6B7F6]' : 'text-gray-700 dark:text-gray-400'}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button
          className={`p-4 flex-1 flex flex-col items-center ${activeTab === 'profile' ? 'text-[#8B5CF6] dark:text-[#C6B7F6]' : 'text-gray-700 dark:text-gray-400'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6 transition-colors duration-200">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-merriweather text-[#7A1D0F] dark:text-[#C6B7F6]">Latest Projects</h2>
              <button
                onClick={() => openModal('post')}
                className="bg-[#8B5CF6] dark:bg-[#7C3AED] text-white p-2 rounded-full shadow-md hover:bg-[#7C3AED] dark:hover:bg-[#6D28D9] transition-all hover:scale-105 active:scale-95"
                aria-label="Create new post"
              >
                <PlusCircle size={20} />
              </button>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Post Header */}
                  <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={post.userImage}
                      alt={post.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="ml-2">
                      <h3 className="font-medium text-[#7A1D0F] dark:text-[#C6B7F6]">{post.username}</h3>
                      <p className="text-xs text-gray-700 dark:text-gray-400">{post.timestamp}</p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <img
                    src={post.image}
                    alt={post.description}
                    className="w-full aspect-square object-cover"
                  />

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 dark:text-gray-200 mb-2 font-nunito">{post.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => filterByTag('projectType', post.projectType)}
                        className="bg-[#FFF0EB] dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-[#7A1D0F] dark:text-[#C6B7F6] hover:bg-[#FED7C8] dark:hover:bg-gray-600 transition-colors"
                      >
                        Project: {post.projectType}
                      </button>
                      <button
                        onClick={() => filterByTag('yarnBrand', post.yarnBrand)}
                        className="bg-[#FFF0EB] dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-[#7A1D0F] dark:text-[#C6B7F6] hover:bg-[#FED7C8] dark:hover:bg-gray-600 transition-colors"
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
                        className={`transition-all duration-300 ${post.liked
                          ? 'text-rose-500 fill-rose-500 animate-[heartbeat_0.5s_ease-in-out]'
                          : 'text-gray-500 dark:text-gray-500 group-hover:text-rose-400'}`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#9E2A1D] dark:group-hover:text-[#C6B7F6] transition-colors">
                        {post.likes}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-700 dark:text-gray-400">No posts yet. Be the first to share a project!</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && currentUser && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-[#F97358] to-[#8B5CF6] dark:from-gray-700 dark:to-gray-600"></div>
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
                  <h2 className="text-xl font-merriweather text-[#7A1D0F] dark:text-[#C6B7F6]">{currentUser.name}</h2>
                  <p className="text-gray-700 dark:text-gray-300">Favorite Yarn: {currentUser.favoriteYarn}</p>
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
                  className="w-full py-2 bg-[#8B5CF6] dark:bg-[#7C3AED] text-white rounded-md font-medium hover:bg-[#7C3AED] dark:hover:bg-[#6D28D9] transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* My Projects Section */}
            <div className="mt-8">
              <h3 className="text-lg font-merriweather text-[#7A1D0F] dark:text-[#C6B7F6] mb-4">My Projects</h3>

              {posts.filter(post => post.userId === currentUser.id).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {posts.filter(post => post.userId === currentUser.id).map(post => (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={post.image}
                        alt={post.description}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-gray-800 dark:text-gray-200 text-sm line-clamp-2 font-nunito">{post.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-1">
                            <Heart
                              size={16}
                              className={post.liked
                                ? 'text-rose-500 fill-rose-500'
                                : 'text-gray-500 dark:text-gray-500'}
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{post.likes}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-400">You haven't shared any projects yet.</p>
                  <button
                    onClick={() => {
                      openModal('post');
                      setActiveTab('feed');
                    }}
                    className="mt-2 px-4 py-2 bg-[#8B5CF6] dark:bg-[#7C3AED] text-white rounded-md text-sm hover:bg-[#7C3AED] dark:hover:bg-[#6D28D9] transition-colors"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === 'projectType' ? 'project type' : 'yarn brand'}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex">
                  <button
                    className={`px-4 py-2 rounded-l-md border ${searchType === 'projectType'
                      ? 'bg-[#8B5CF6] dark:bg-[#7C3AED] text-white border-[#8B5CF6] dark:border-[#7C3AED]'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'} transition-colors`}
                    onClick={() => setSearchType('projectType')}
                  >
                    Project Type
                  </button>
                  <button
                    className={`px-4 py-2 rounded-r-md border ${searchType === 'yarnBrand'
                      ? 'bg-[#8B5CF6] dark:bg-[#7C3AED] text-white border-[#8B5CF6] dark:border-[#7C3AED]'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'} transition-colors`}
                    onClick={() => setSearchType('yarnBrand')}
                  >
                    Yarn Brand
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div>
              <h2 className="text-lg font-merriweather text-[#7A1D0F] dark:text-[#C6B7F6] mb-4">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Projects'}
              </h2>

              {filteredPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Post Header */}
                      <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                        <img src={post.userImage} alt={post.username} className="w-8 h-8 rounded-full object-cover" />
                        <div className="ml-2">
                          <h3 className="font-medium text-[#7A1D0F] dark:text-[#C6B7F6]">{post.username}</h3>
                          <p className="text-xs text-gray-700 dark:text-gray-400">{post.timestamp}</p>
                        </div>
                      </div>

                      {/* Post Image */}
                      <img src={post.image} alt={post.description} className="w-full aspect-square object-cover" />

                      {/* Post Content */}
                      <div className="p-4">
                        <p className="text-gray-800 dark:text-gray-200 mb-2 font-nunito">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <button
                            onClick={() => filterByTag('projectType', post.projectType)}
                            className="bg-[#FFF0EB] dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-[#7A1D0F] dark:text-[#C6B7F6] hover:bg-[#FED7C8] dark:hover:bg-gray-600 transition-colors"
                          >
                            Project: {post.projectType}
                          </button>
                          <button
                            onClick={() => filterByTag('yarnBrand', post.yarnBrand)}
                            className="bg-[#FFF0EB] dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-[#7A1D0F] dark:text-[#C6B7F6] hover:bg-[#FED7C8] dark:hover:bg-gray-600 transition-colors"
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
                            className={`transition-all duration-300 ${post.liked
                              ? 'text-rose-500 fill-rose-500 animate-[heartbeat_0.5s_ease-in-out]'
                              : 'text-gray-500 dark:text-gray-500 group-hover:text-rose-400'}`}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#9E2A1D] dark:group-hover:text-[#C6B7F6] transition-colors">
                            {post.likes}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-400">No projects found. Try a different search term.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      {(isCreatingPost || isEditingProfile) && (
        <div
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4 transition-opacity duration-200 ${modalClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={closeModal}
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transition-all duration-200 ${modalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Create Post Modal */}
            {isCreatingPost && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-[#7A1D0F] dark:text-[#C6B7F6]">Share Your Project</h3>
                  <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Image URL</label>
                    <input
                      type="text"
                      placeholder="Paste an image URL"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Description</label>
                    <textarea
                      placeholder="Tell us about your project..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                      value={newPost.description}
                      onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Project Type</label>
                      <input
                        type="text"
                        placeholder="E.g., Sweater, Scarf"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                        value={newPost.projectType}
                        onChange={(e) => setNewPost({...newPost, projectType: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Yarn Brand</label>
                      <input
                        type="text"
                        placeholder="E.g., Malabrigo, Lion Brand"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                        value={newPost.yarnBrand}
                        onChange={(e) => setNewPost({...newPost, yarnBrand: e.target.value})}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.image || !newPost.description}
                    className={`w-full py-2 rounded-md text-white font-medium transition-colors ${!newPost.image || !newPost.description
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-[#8B5CF6] dark:bg-[#7C3AED] hover:bg-[#7C3AED] dark:hover:bg-[#6D28D9]'}`}
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
                  <h3 className="text-lg font-medium text-[#7A1D0F] dark:text-[#C6B7F6]">Edit Profile</h3>
                  <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Favorite Yarn</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                      value={editedProfile.favoriteYarn}
                      onChange={(e) => setEditedProfile({...editedProfile, favoriteYarn: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7A1D0F] dark:text-[#C6B7F6] mb-1">Profile Image URL</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#7C3AED] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                      value={editedProfile.image}
                      onChange={(e) => setEditedProfile({...editedProfile, image: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-2 bg-[#8B5CF6] dark:bg-[#7C3AED] text-white rounded-md font-medium hover:bg-[#7C3AED] dark:hover:bg-[#6D28D9] transition-colors"
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
      <footer className="bg-[#E75137] dark:bg-gray-800 text-white py-6 px-4 transition-colors duration-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-merriweather">Knit Connect</h2>
              <p className="text-sm opacity-80 mt-1">Share your knitting journey</p>
            </div>

            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6B7F6] transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6B7F6] transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C6B7F6] transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm opacity-80">
            <p>© 2025 Knit Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;