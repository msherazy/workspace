'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Sun,
  Moon,
  Bookmark,
  Image as LucideImage,
  Video,
  Smile,
  User,
  Home,
  Search,
  Bell,
  Mail,
  Pencil,
  X,
  Check,
  Send,
  Flame
} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Head from 'next/head'
import React from 'react'
import { Outfit } from 'next/font/google'
const outfit = Outfit({ subsets: ['latin'] })

type User = {
  id: string
  username: string
  name: string
  avatar: string
  bio: string
  followers: number
  following: number
  website?: string
  location?: string
  joinDate: Date
}

type Post = {
  id: string
  user: User
  content: string
  image?: string
  likes: number
  liked: boolean
  bookmarked: boolean
  timestamp: Date
  comments: Comment[]
  shares: number
  tags?: string[]
}

type Comment = {
  id: string
  user: User
  content: string
  timestamp: Date
  likes: number
  liked: boolean
}

type Notification = {
  id: string
  type: 'like' | 'comment' | 'follow' | 'trending'
  user?: User
  postId?: string
  read: boolean
  timestamp: Date
  content?: string
}

type SuggestedUser = {
  user: User
  mutualFollowers: number
  reason: 'popular' | 'mutual' | 'new'
}

type TrendingTopic = {
  id: string
  title: string
  posts: number
  category: 'technology' | 'entertainment' | 'sports' | 'politics'
}

export default function SocialApp() {
  // State
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeEmojiPickerFor, setActiveEmojiPickerFor] = useState<'post' | string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [editProfileData, setEditProfileData] = useState<Partial<User>>({})
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [activeProfile, setActiveProfile] = useState<User | null>(null)
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({})
  const [activeHashtagMenu, setActiveHashtagMenu] = useState<{postId: string, tagIndex: number} | null>(null)
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: User;
    receiver: User;
    content: string;
    timestamp: Date;
    read: boolean;
  }>>([])

  // Initialize with sample data
  useEffect(() => {
    const sampleUser: User = {
      id: '1',
      username: 'currentuser',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/300?img=5',
      bio: 'Digital creator | Web developer | Coffee enthusiast',
      followers: 1342,
      following: 256,
      website: 'alexjohnson.dev',
      location: 'San Francisco, CA',
      joinDate: new Date('2020-06-15')
    }

    const sampleUsers: User[] = [
      sampleUser,
      {
        id: '2',
        username: 'johndoe',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/300?img=1',
        bio: 'UX Designer | Photographer | Travel addict',
        followers: 5243,
        following: 189,
        website: 'johndoe.design',
        location: 'New York, NY',
        joinDate: new Date('2019-03-10')
      },
      {
        id: '3',
        username: 'janedoe',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300?img=2',
        bio: 'Frontend Developer | Open source contributor | Cat lover',
        followers: 2876,
        following: 334,
        website: 'janedoe.dev',
        location: 'Austin, TX',
        joinDate: new Date('2021-01-22')
      },
      {
        id: '4',
        username: 'devguru',
        name: 'Dev Guru',
        avatar: 'https://i.pravatar.cc/300?img=3',
        bio: 'Tech blogger | JavaScript expert | Conference speaker',
        followers: 15432,
        following: 142,
        website: 'devguru.tech',
        location: 'Seattle, WA',
        joinDate: new Date('2018-11-05')
      },
      {
        id: '5',
        username: 'codewizard',
        name: 'Sarah Smith',
        avatar: 'https://i.pravatar.cc/300?img=6',
        bio: 'Full-stack developer | AI enthusiast | Coffee addict',
        followers: 8765,
        following: 231,
        website: 'codewizard.io',
        location: 'Boston, MA',
        joinDate: new Date('2020-09-18')
      },
      {
        id: '6',
        username: 'designqueen',
        name: 'Emily Chen',
        avatar: 'https://i.pravatar.cc/300?img=7',
        bio: 'UI/UX Designer | Illustrator | Minimalism lover',
        followers: 6543,
        following: 187,
        website: 'emilychen.design',
        location: 'Chicago, IL',
        joinDate: new Date('2021-05-30')
      }
    ]

    const samplePosts: Post[] = [
      {
        id: '1',
        user: sampleUsers[1],
        content: 'Just finished building this awesome social app with Next.js and Tailwind! What do you think? #webdev #react #nextjs',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        likes: 124,
        liked: false,
        bookmarked: false,
        timestamp: new Date(Date.now() - 3600000),
        comments: [
          {
            id: 'c1',
            user: sampleUsers[2],
            content: 'Looks amazing! The UI is so clean and modern. Love the dark mode implementation.',
            timestamp: new Date(Date.now() - 1800000),
            likes: 13,
            liked: false
          },
          {
            id: 'c2',
            user: sampleUsers[3],
            content: 'Great job! How did you handle the real-time updates?',
            timestamp: new Date(Date.now() - 1200000),
            likes: 5,
            liked: true
          }
        ],
        shares: 25,
        tags: ['webdev', 'react', 'nextjs']
      },
      {
        id: '2',
        user: sampleUsers[3],
        content: 'Working on a new project using Next.js 14. The new features are absolutely game-changing! The server actions and partial prerendering are next level. #nextjs #webdev #javascript',
        likes: 342,
        liked: true,
        bookmarked: true,
        timestamp: new Date(Date.now() - 7200000),
        comments: [
          {
            id: 'c3',
            user: sampleUsers[4],
            content: 'I just migrated my project to Next 14 and the performance improvements are insane!',
            timestamp: new Date(Date.now() - 3600000),
            likes: 28,
            liked: false
          }
        ],
        shares: 112,
        tags: ['nextjs', 'webdev', 'javascript']
      },
      {
        id: '3',
        user: sampleUsers[1],
        content: 'Beautiful day for coding outdoors! The sunshine and fresh air really boost productivity. ☀️ #coderlife #remotework #digitalnomad',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        likes: 287,
        liked: false,
        bookmarked: false,
        timestamp: new Date(Date.now() - 86400000),
        comments: [
          {
            id: 'c4',
            user: sampleUsers[3],
            content: 'Nice setup! What laptop is that? The keyboard looks perfect for coding.',
            timestamp: new Date(Date.now() - 82800000),
            likes: 12,
            liked: true
          },
          {
            id: 'c5',
            user: sampleUsers[1],
            content: 'It\'s the new MacBook Pro with M2 chip. The keyboard is indeed amazing for long coding sessions!',
            timestamp: new Date(Date.now() - 82000000),
            likes: 25,
            liked: false
          }
        ],
        shares: 47,
        tags: ['coderlife', 'remotework', 'digitalnomad']
      },
      {
        id: '4',
        user: sampleUsers[4],
        content: 'Just launched my new course on advanced React patterns! 🚀 Learn how to build performant, scalable applications with modern React. Check out the link in my bio! #react #webdev #javascript',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        likes: 512,
        liked: true,
        bookmarked: true,
        timestamp: new Date(Date.now() - 172800000),
        comments: [
          {
            id: 'c6',
            user: sampleUsers[2],
            content: 'Signed up immediately! Your last course was fantastic.',
            timestamp: new Date(Date.now() - 170000000),
            likes: 42,
            liked: false
          }
        ],
        shares: 87,
        tags: ['react', 'webdev', 'javascript']
      },
      {
        id: '5',
        user: sampleUsers[5],
        content: 'Design tip: Always consider accessibility first. Your beautiful UI means nothing if people can\'t use it. Here are my top 5 accessibility tips for designers... (thread) #design #ux #accessibility',
        likes: 876,
        liked: false,
        bookmarked: true,
        timestamp: new Date(Date.now() - 259200000),
        comments: [
          {
            id: 'c7',
            user: sampleUsers[1],
            content: 'This is so important! Especially contrast ratios that many designers overlook.',
            timestamp: new Date(Date.now() - 258000000),
            likes: 73,
            liked: true
          },
          {
            id: 'c8',
            user: sampleUsers[3],
            content: 'Couldn\'t agree more. Accessibility should never be an afterthought.',
            timestamp: new Date(Date.now() - 257500000),
            likes: 56,
            liked: false
          }
        ],
        shares: 213,
        tags: ['design', 'ux', 'accessibility']
      }
    ]

    const sampleNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'like',
        user: sampleUsers[1],
        postId: '1',
        read: false,
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: 'n2',
        type: 'comment',
        user: sampleUsers[2],
        postId: '1',
        read: false,
        timestamp: new Date(Date.now() - 3600000),
        content: 'Looks amazing! The UI is so clean and modern.'
      },
      {
        id: 'n3',
        type: 'follow',
        user: sampleUsers[3],
        read: true,
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: 'n4',
        type: 'trending',
        read: false,
        timestamp: new Date(Date.now() - 7200000),
        content: 'Your post about Next.js 14 is trending in the #webdev community!'
      },
      {
        id: 'n5',
        type: 'like',
        user: sampleUsers[4],
        postId: '4',
        read: false,
        timestamp: new Date(Date.now() - 10800000)
      }
    ]

    const sampleSuggestedUsers: SuggestedUser[] = [
      {
        user: sampleUsers[3],
        mutualFollowers: 12,
        reason: 'popular'
      },
      {
        user: sampleUsers[4],
        mutualFollowers: 8,
        reason: 'mutual'
      },
      {
        user: sampleUsers[5],
        mutualFollowers: 3,
        reason: 'new'
      }
    ]

    const sampleTrendingTopics: TrendingTopic[] = [
      {
        id: 't1',
        title: '#NextJS14',
        posts: 12500,
        category: 'technology'
      },
      {
        id: 't2',
        title: 'React Server Components',
        posts: 8700,
        category: 'technology'
      },
      {
        id: 't3',
        title: 'AI in Web Development',
        posts: 6500,
        category: 'technology'
      },
      {
        id: 't4',
        title: 'Summer Tech Conferences',
        posts: 3200,
        category: 'technology'
      }
    ]

    const sampleMessages = [
      {
        id: 'm1',
        sender: sampleUsers[1],
        receiver: sampleUser,
        content: "Hey Alex! I saw your latest post about the Next.js app. Would love to collaborate on a project sometime!",
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 'm2',
        sender: sampleUsers[2],
        receiver: sampleUser,
        content: "Just wanted to share this amazing article about React Server Components. Thought you might find it interesting!",
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 'm3',
        sender: sampleUsers[3],
        receiver: sampleUser,
        content: "Thanks for the follow! I'm working on a new open-source project. Would you be interested in contributing?",
        timestamp: new Date(Date.now() - 7200000),
        read: true
      },
      {
        id: 'm4',
        sender: sampleUsers[4],
        receiver: sampleUser,
        content: "Your dark mode implementation is fantastic! Mind if I ask how you handled the theme persistence?",
        timestamp: new Date(Date.now() - 86400000),
        read: true
      },
      {
        id: 'm5',
        sender: sampleUser,
        receiver: sampleUsers[1],
        content: "Absolutely! Let's connect next week to discuss the collaboration. I have some ideas we could explore.",
        timestamp: new Date(Date.now() - 1700000),
        read: true
      }
    ]

    setCurrentUser(sampleUser)
    setPosts(samplePosts)
    setNotifications(sampleNotifications)
    setSuggestedUsers(sampleSuggestedUsers)
    setTrendingTopics(sampleTrendingTopics)
    setMessages(sampleMessages)
    setEditProfileData({
      name: sampleUser.name,
      username: sampleUser.username,
      bio: sampleUser.bio,
      website: sampleUser.website,
      location: sampleUser.location
    })
  }, [])

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim() && !imagePreview) return

    if (!currentUser) return

    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content: newPostContent,
      image: imagePreview || undefined,
      likes: 0,
      liked: false,
      bookmarked: false,
      timestamp: new Date(),
      comments: [],
      shares: 0
    }

    setPosts([newPost, ...posts])
    setNewPostContent('')
    setImagePreview(null)
    setShowImageUpload(false)
  }

  const removeHashtag = (postId: string, tagIndex: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.tags) {
        // Create a new array with the tag removed
        const updatedTags = [...post.tags];
        updatedTags.splice(tagIndex, 1);

        return {
          ...post,
          tags: updatedTags.length > 0 ? updatedTags : undefined
        };
      }
      return post;
    }));

    // Close the hashtag menu
    setActiveHashtagMenu(null);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (!post.liked && currentUser && post.user.id !== currentUser.id) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'like',
            user: currentUser,
            postId: post.id,
            read: false,
            timestamp: new Date()
          }
          setNotifications([newNotification, ...notifications])
        }

        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        }
      }
      return post
    }))
  }

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              liked: !comment.liked
            }
          }
          return comment
        })
        return { ...post, comments: updatedComments }
      }
      return post
    }))
  }

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault()
    const commentContent = commentInputs[postId]
    if (!commentContent?.trim()) return

    if (!currentUser) return

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          user: currentUser,
          content: commentContent,
          timestamp: new Date(),
          likes: 0,
          liked: false
        }

        if (post.user.id !== currentUser.id) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'comment',
            user: currentUser,
            postId: post.id,
            read: false,
            timestamp: new Date()
          }
          setNotifications([newNotification, ...notifications])
        }

        return {
          ...post,
          comments: [...post.comments, newComment]
        }
      }
      return post
    }))

    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
  }

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          bookmarked: !post.bookmarked
        }
      }
      return post
    }))
  }

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        }
      }
      return post
    }))

    if (navigator.share) {
      const post = posts.find(p => p.id === postId)
      if (post) {
        navigator.share({
          title: `Post by ${post.user.name}`,
          text: post.content,
          url: window.location.href
        }).catch(err => {
          console.log('Error sharing:', err)
        })
      }
    } else {
      alert('Link copied to clipboard!')
      const post = posts.find(p => p.id === postId)
      if (post) {
        navigator.clipboard.writeText(post.content)
      }
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImagePreview = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const handleEmojiClick = (emojiData: never, context: 'post' | string) => {
    if (context === 'post') {
      setNewPostContent(prev => prev + emojiData?.emoji)
    } else {
      setCommentInputs(prev => ({
        ...prev,
        [context]: (prev[context] || '') + emojiData?.emoji
      }))
    }
    setShowEmojiPicker(false)
    setActiveEmojiPickerFor(null)
  }

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const resizeSidebar = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth > 200 && newWidth < 400) {
        setSidebarWidth(newWidth)
      }
    }
  }

  const stopResize = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resizeSidebar)
      window.addEventListener('mouseup', stopResize)
    } else {
      window.removeEventListener('mousemove', resizeSidebar)
      window.removeEventListener('mouseup', stopResize)
    }

    return () => {
      window.removeEventListener('mousemove', resizeSidebar)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [isResizing])

  const handleProfileEdit = (field: keyof User, value: string) => {
    setEditProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveProfileChanges = () => {
    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      ...editProfileData
    }

    setCurrentUser(updatedUser)
    setEditProfile(false)

    // Update posts with the new user data
    setPosts(posts.map(post => {
      if (post.user.id === currentUser.id) {
        return {
          ...post,
          user: updatedUser
        }
      }
      return post
    }))
  }

  const filteredPosts = activeTab === 'bookmarks'
    ? posts.filter(post => post.bookmarked)
    : activeTab === 'profile' && currentUser
      ? posts.filter(post => post.user.id === currentUser.id)
      : posts.filter(post =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        )

  const unreadNotifications = notifications.filter(n => !n.read).length

  const viewProfile = (user: User) => {
    setActiveProfile(user)
    setActiveTab('profile')
  }

  return (
    <>
      <Head>
        <title>BlissBlaze - Connect and Share</title>
      </Head>

      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} ${outfit.className}`}>
        {/* Desktop Navigation */}
        <nav
          className={`hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 border-r ${darkMode ? 'border-purple-900 bg-gray-800' : 'border-purple-200 bg-white'} transition-all duration-200`}
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 font-impact text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">BlissBlaze</h1>

            <div className="space-y-2 mb-8">
              <button
                onClick={() => {
                  setActiveTab('home')
                  setActiveProfile(null)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${activeTab === 'home' ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                <Home size={20} />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('notifications')
                  setActiveProfile(null)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${activeTab === 'notifications' ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                <div className="relative">
                  <Bell size={20}/>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-3 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('messages')
                  setActiveProfile(null)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${activeTab === 'messages' ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                <Mail size={20} />
                <span>Messages</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('bookmarks')
                  setActiveProfile(null)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${activeTab === 'bookmarks' ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                <Bookmark size={20} />
                <span>Bookmarks</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('profile')
                  setActiveProfile(null)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${activeTab === 'profile' && !activeProfile ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
            </div>
          </div>

          {currentUser && (
            <div className={`mt-auto p-3 rounded-lg flex items-center space-x-3 transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <img src={currentUser.avatar} alt={currentUser.username} className="w-10 h-10 rounded-full" />
              <div className="overflow-hidden">
                <p className="font-medium truncate">{currentUser.name}</p>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{currentUser.username}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`mt-4 p-3 rounded-lg flex items-center space-x-3 transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-purple-500" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>

        {/* Resize handle */}
        <div
          className={`hidden md:block fixed top-0 bottom-0 w-2 cursor-col-resize z-20 ${darkMode ? 'hover:bg-purple-700' : 'hover:bg-purple-300'}`}
          style={{ left: `${sidebarWidth}px` }}
          onMouseDown={startResize}
        />

        {/* Mobile Navigation */}
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t z-10`}>
          <div className="flex justify-around p-3">
            <button
              onClick={() => {
                setActiveTab('home')
                setActiveProfile(null)
              }}
              className={`p-3 ${activeTab === 'home' ? (darkMode ? 'text-purple-400' : 'text-purple-600') : ''}`}
            >
              <Home size={24} />
            </button>
            <button
              onClick={() => {
                setActiveTab('explore')
                setActiveProfile(null)
              }}
              className={`p-3 ${activeTab === 'explore' ? (darkMode ? 'text-purple-400' : 'text-purple-600') : ''}`}
            >
              <Search size={24} />
            </button>
            <button
              onClick={() => {
                setActiveTab('notifications')
                setShowNotifications(true)
                setActiveProfile(null)
              }}
              className={`p-3 relative ${activeTab === 'notifications' ? (darkMode ? 'text-purple-400' : 'text-purple-600') : ''}`}
            >
              <Bell size={24} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('bookmarks')
                setActiveProfile(null)
              }}
              className={`p-3 ${activeTab === 'bookmarks' ? (darkMode ? 'text-purple-400' : 'text-purple-600') : ''}`}
            >
              <Bookmark size={24} />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-3 ${showMobileMenu ? (darkMode ? 'text-purple-400' : 'text-purple-600') : ''}`}
            >
              <MoreHorizontal size={24} />
            </button>
          </div>

          {showMobileMenu && (
            <div className={`absolute bottom-16 left-0 right-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-lg rounded-t-lg`}>
              <button
                onClick={() => {
                  setActiveTab('profile')
                  setActiveProfile(null)
                  setShowMobileMenu(false)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg ${activeTab === 'profile' && !activeProfile ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : ''}`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('messages')
                  setActiveProfile(null)
                  setShowMobileMenu(false)
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg ${activeTab === 'messages' ? (darkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900') : ''}`}
              >
                <Mail size={20} />
                <span>Messages</span>
              </button>
              <button
                onClick={() => {
                  setDarkMode(!darkMode)
                  setShowMobileMenu(false)
                }}
                className="flex items-center space-x-3 w-full p-3 rounded-lg"
              >
                {darkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-purple-500" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Notifications Panel */}
        {showNotifications && (
          <div className={`md:hidden fixed inset-0 z-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button onClick={() => {
                  setShowNotifications(false)
                  if (activeTab !== 'notifications') {
                    setActiveTab('home')
                  }
                }}>
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg transition-all ${!notification.read ? (darkMode ? 'bg-purple-900/30' : 'bg-purple-100') : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        {notification.user ? (
                          <img
                            src={notification.user.avatar}
                            alt={notification.user.username}
                            className="w-10 h-10 rounded-full"
                            onClick={() => {
                              if (notification.user) {
                                viewProfile(notification.user)
                                setShowNotifications(false)
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>
                            <Flame className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                          </div>
                        )}
                        <div className="flex-1">
                          <p>
                            {notification.type === 'trending' ? (
                              <span className="font-medium">Trending Update</span>
                            ) : (
                              <span
                                className="font-medium"
                                onClick={() => {
                                  if (notification.user) {
                                    viewProfile(notification.user)
                                    setShowNotifications(false)
                                  }
                                }}
                              >
                                {notification.user?.name}
                              </span>
                            )}
                            {notification.type === 'like' && ' liked your post'}
                            {notification.type === 'comment' && ' commented: ' + notification.content}
                            {notification.type === 'follow' && ' started following you'}
                            {notification.type === 'trending' && ' ' + notification.content}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatTime(notification.timestamp)}
                          </p>
                          {notification.postId && (
                            <button
                              onClick={() => {
                                const post = posts.find(p => p.id === notification.postId)
                                if (post) {
                                  setExpandedPosts(prev => ({ ...prev, [post.id]: true }))
                                  setActiveTab('home')
                                  setShowNotifications(false)
                                }
                              }}
                              className={`mt-2 text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
                            >
                              View post
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`md:ml-0 pb-16 md:pb-0 ${showNotifications ? 'hidden md:block' : ''}`}
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row flex-wrap w-full">
            <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
              {/* Search Bar (Mobile) */}
              <div className="md:hidden mb-6">
                <div className={`flex items-center p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Search className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search BlissBlaze..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 ml-2 bg-transparent focus:outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* Create Post */}
              {activeTab !== 'notifications' && (
                <form onSubmit={handlePostSubmit} className={`mb-8 p-4 rounded-lg transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white shadow hover:shadow-md'}`}>
                  <div className="flex space-x-3">
                    <img
                      src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=5'}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's blazing in your mind?"
                        className={`w-full p-3 rounded-lg resize-none focus:outline-none transition-all ${darkMode ? 'bg-gray-700 focus:ring-2 focus:ring-purple-500' : 'bg-gray-100 focus:ring-2 focus:ring-purple-400'}`}
                        rows={3}
                      />

                      {imagePreview && (
                        <div className="mt-2 relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg max-h-80 object-cover" />
                          <button
                            type="button"
                            onClick={removeImagePreview}
                            className={`absolute top-2 right-2 p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                          >
                            <X />
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowImageUpload(!showImageUpload)
                              setShowEmojiPicker(false)
                            }}
                            className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700 text-purple-400' : 'hover:bg-gray-100 text-purple-600'}`}
                          >
                            <LucideImage />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEmojiPicker(!showEmojiPicker)
                              setActiveEmojiPickerFor('post')
                              setShowImageUpload(false)
                            }}
                            className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-yellow-600'}`}
                          >
                            <Smile />
                          </button>
                          <button
                            type="button"
                            className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700 text-pink-400' : 'hover:bg-gray-100 text-pink-600'}`}
                          >
                            <Video />
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={!newPostContent.trim() && !imagePreview}
                          className={`px-4 py-2 rounded-full font-medium transition-all ${newPostContent.trim() || imagePreview ? (darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white') : (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed')}`}
                        >
                          Blaze It
                        </button>
                      </div>

                      {showImageUpload && (
                        <div className="mt-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            Upload Image
                          </button>
                        </div>
                      )}

                      {showEmojiPicker && activeEmojiPickerFor === 'post' && (
                        <div className="mt-2">
                          <EmojiPicker
                            onEmojiClick={(emojiData) => handleEmojiClick(emojiData, 'post')}
                            width="100%"
                            height={350}
                            previewConfig={{ showPreview: false }}
                            theme={darkMode ? 'dark' : 'light'}
                            searchDisabled
                            skinTonesDisabled
                            suggestedEmojisMode="recent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* Notifications (Desktop) */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Notifications</h2>
                    <button
                      onClick={markNotificationsAsRead}
                      className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
                    >
                      Mark all as read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg transition-all ${!notification.read ? (darkMode ? 'bg-purple-900/30' : 'bg-purple-100') : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          {notification.user ? (
                            <img
                              src={notification.user.avatar}
                              alt={notification.user.username}
                              className="w-10 h-10 rounded-full cursor-pointer"
                              onClick={() => viewProfile(notification.user!)}
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>
                              <Flame className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                            </div>
                          )}
                          <div className="flex-1">
                            <p>
                              {notification.type === 'trending' ? (
                                <span className="font-medium">Trending Update</span>
                              ) : (
                                <span
                                  className="font-medium cursor-pointer"
                                  onClick={() => notification.user && viewProfile(notification.user)}
                                >
                                  {notification.user?.name}
                                </span>
                              )}
                              {notification.type === 'like' && ' liked your post'}
                              {notification.type === 'comment' && ' commented: ' + notification.content}
                              {notification.type === 'follow' && ' started following you'}
                              {notification.type === 'trending' && ' ' + notification.content}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatTime(notification.timestamp)}
                            </p>
                            {notification.postId && (
                              <button
                                onClick={() => {
                                  const post = posts.find(p => p.id === notification.postId)
                                  if (post) {
                                    setExpandedPosts(prev => ({ ...prev, [post.id]: true }))
                                    setActiveTab('home')
                                  }
                                }}
                                className={`mt-2 text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
                              >
                                View post
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Profile */}
              {activeTab === 'profile' && (activeProfile || currentUser) && (
                <div className={`mb-8 rounded-lg overflow-hidden transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white shadow hover:shadow-md'}`}>
                  <div className={`h-48 ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-100 to-pink-100'}`}></div>
                  <div className="p-4 relative">
                    <div className="flex justify-between items-start">
                      <img
                        src={activeProfile?.avatar || currentUser?.avatar}
                        alt={activeProfile?.username || currentUser?.username}
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 -mt-12"
                      />
                      {(!activeProfile || activeProfile.id === currentUser?.id) && (
                        <button
                          onClick={() => editProfile ? saveProfileChanges() : setEditProfile(!editProfile)}
                          className={`px-4 py-2 rounded-full border flex items-center space-x-2 transition-all ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                          {editProfile ? (
                            <>
                              <Check size={16} />
                              <span>Save</span>
                            </>
                          ) : (
                            <>
                              <Pencil size={16} />
                              <span>Edit Profile</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {editProfile ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                          <input
                            type="text"
                            value={editProfileData.name || ''}
                            onChange={(e) => handleProfileEdit('name', e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                          <input
                            type="text"
                            value={editProfileData.username || ''}
                            onChange={(e) => handleProfileEdit('username', e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                          <textarea
                            value={editProfileData.bio || ''}
                            onChange={(e) => handleProfileEdit('bio', e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Website</label>
                          <input
                            type="text"
                            value={editProfileData.website || ''}
                            onChange={(e) => handleProfileEdit('website', e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                          <input
                            type="text"
                            value={editProfileData.location || ''}
                            onChange={(e) => handleProfileEdit('location', e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border`}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold mt-2">{activeProfile?.name || currentUser?.name}</h2>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{activeProfile?.username || currentUser?.username}</p>
                        <p className="mt-3">{activeProfile?.bio || currentUser?.bio}</p>

                        <div className="flex flex-wrap gap-4 mt-4">
                          {activeProfile?.website || currentUser?.website ? (
                            <div className="flex items-center">
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <a
                                  href={`https://${activeProfile?.website || currentUser?.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
                                >
                                  {activeProfile?.website || currentUser?.website}
                                </a>
                              </span>
                            </div>
                          ) : null}

                          {activeProfile?.location || currentUser?.location ? (
                            <div className="flex items-center">
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {activeProfile?.location || currentUser?.location}
                              </span>
                            </div>
                          ) : null}

                          <div className="flex items-center">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Joined {new Date(activeProfile?.joinDate || currentUser?.joinDate || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-4">
                          <div className="flex items-center">
                            <span className="font-bold">{activeProfile?.following || currentUser?.following}</span>
                            <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Following</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold">{activeProfile?.followers || currentUser?.followers}</span>
                            <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Followers</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Messages</h2>
                  </div>
                  {messages.length === 0 ? (
                    <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white shadow hover:shadow-md'} ${!message.read ? (darkMode ? 'bg-purple-900/30' : 'bg-purple-100') : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.username}
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={() => viewProfile(message.sender)}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <span
                                  className="font-medium cursor-pointer hover:underline"
                                  onClick={() => viewProfile(message.sender)}
                                >
                                  {message.sender.name}
                                </span>
                                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  @{message.sender.username}
                                </span>
                              </div>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="mt-2">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Posts Feed */}
              {!['notifications', 'messages'].includes(activeTab) && (
                <div className="space-y-6">
                  {filteredPosts.length === 0 ? (
                    <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                      <p>{activeTab === 'bookmarks'
                        ? 'You haven\'t bookmarked any posts yet'
                        : activeTab === 'profile'
                          ? activeProfile
                            ? `${activeProfile.name} hasn't posted anything yet`
                            : 'You haven\'t posted anything yet'
                          : 'No posts found'}</p>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <article
                        key={post.id}
                        className={`rounded-lg overflow-hidden transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white shadow hover:shadow-md'}`}
                      >
                        <div className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.user.avatar}
                              alt={`${post.user.username}'s avatar`}
                              className="w-10 h-10 rounded-full cursor-pointer"
                              onClick={() => viewProfile(post.user)}
                            />
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-semibold truncate cursor-pointer"
                                onClick={() => viewProfile(post.user)}
                              >
                                {post.user.name}
                              </h3>
                              <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                @{post.user.username} · {formatTime(post.timestamp)}
                              </p>
                            </div>
                            <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                              <MoreHorizontal />
                            </button>
                          </div>
                          <p className="mt-3 mb-4">{post.content}</p>

                          {post.image && (
                            <div className="mb-4 rounded-lg overflow-hidden">
                              <img
                                src={post.image}
                                alt="Post content"
                                className="w-full h-auto max-h-96 object-cover cursor-pointer"
                                onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: true }))}
                              />
                            </div>
                          )}

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, index) => (
                                <div key={tag} className="relative inline-flex items-center">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full cursor-pointer ${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-gray-100 text-purple-600'}`}
                                    onClick={() => setSearchQuery(tag)}
                                  >
                                    #{tag}
                                  </span>
                                  <button
                                    onClick={() => setActiveHashtagMenu({ postId: post.id, tagIndex: index })}
                                    className={`ml-1 p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                  >
                                    <MoreHorizontal size={12} />
                                  </button>
                                  {activeHashtagMenu?.postId === post.id && activeHashtagMenu?.tagIndex === index && (
                                    <div
                                      className={`absolute top-6 left-0 z-10 p-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                    >
                                      <button
                                        onClick={() => removeHashtag(post.id, index)}
                                        className={`text-sm px-3 py-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center border-t pt-3">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${post.liked ? (darkMode ? 'text-pink-400' : 'text-pink-500') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                            >
                              {post.liked ? <Heart className="fill-current" /> : <Heart />}
                              <span>{post.likes}</span>
                            </button>
                            <button
                              onClick={() => toggleComments(post.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <MessageSquare />
                              <span>{post.comments.length}</span>
                            </button>
                            <button
                              onClick={() => handleShare(post.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <Share2 />
                              <span>{post.shares}</span>
                            </button>
                            <button
                              onClick={() => toggleBookmark(post.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${post.bookmarked ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                            >
                              {post.bookmarked ? <Bookmark className="fill-current" /> : <Bookmark />}
                            </button>
                          </div>
                        </div>

                        {expandedPosts[post.id] && (
                          <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="p-4 space-y-4">
                              {post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                  <div key={comment.id} className="flex space-x-3">
                                    <img
                                      src={comment.user.avatar}
                                      alt={`${comment.user.username}'s avatar`}
                                      className="w-8 h-8 rounded-full cursor-pointer"
                                      onClick={() => viewProfile(comment.user)}
                                    />
                                    <div className="flex-1">
                                      <div className={`inline-block px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <div className="flex items-center space-x-2">
                                          <h4
                                            className="font-semibold text-sm cursor-pointer"
                                            onClick={() => viewProfile(comment.user)}
                                          >
                                            {comment.user.name}
                                          </h4>
                                          <span
                                            className={`text-xs cursor-pointer ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                            onClick={() => viewProfile(comment.user)}
                                          >
                                            @{comment.user.username}
                                          </span>
                                        </div>
                                        <p className="text-sm mt-1">{comment.content}</p>
                                      </div>
                                      <div className="flex items-center mt-1 space-x-4">
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                          {formatTime(comment.timestamp)}
                                        </p>
                                        <button
                                          onClick={() => handleCommentLike(post.id, comment.id)}
                                          className={`text-xs flex items-center space-x-1 ${comment.liked ? (darkMode ? 'text-pink-400' : 'text-pink-500') : ''}`}
                                        >
                                          {comment.liked ? <Heart className="fill-current" size={12} /> : <Heart size={12} />}
                                          <span>{comment.likes}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className={`text-center py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No comments yet</p>
                              )}
                            </div>
                            <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <div className="flex space-x-3">
                                <img
                                  src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=5'}
                                  alt="Your avatar"
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1 flex">
                                  <input
                                    type="text"
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    placeholder="Write a comment..."
                                    className={`flex-1 px-3 py-2 rounded-l-lg focus:outline-none ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowEmojiPicker(!showEmojiPicker)
                                      setActiveEmojiPickerFor(post.id)
                                    }}
                                    className={`px-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border-l`}
                                  >
                                    <Smile className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!commentInputs[post.id]?.trim()}
                                    className={`px-3 rounded-r-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${commentInputs[post.id]?.trim() ? (darkMode ? 'text-purple-400' : 'text-purple-600') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}
                                  >
                                    <Send />
                                  </button>
                                </div>
                              </div>
                              {showEmojiPicker && activeEmojiPickerFor === post.id && (
                                <div className="mt-2">
                                  <EmojiPicker
                                    onEmojiClick={(emojiData) => handleEmojiClick(emojiData, post.id)}
                                    width="100%"
                                    height={350}
                                    previewConfig={{ showPreview: false }}
                                    theme={darkMode ? 'dark' : 'light'}
                                    searchDisabled
                                    skinTonesDisabled
                                    suggestedEmojisMode="recent"
                                  />
                                </div>
                              )}
                            </form>
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar (Desktop) */}
            <div className="hidden lg:block w-1/3 overflow-y-auto max-h-screen">
              {/* Search Bar */}
              <div className="mb-6 sticky top-4 z-10">
                <div className={`flex items-center p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Search className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search BlissBlaze..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 ml-2 bg-transparent focus:outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* Trending Topics */}
              <div className={`mb-6 rounded-lg overflow-hidden sticky top-20 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                <div className={`p-4 ${darkMode ? 'bg-gray-750' : 'bg-gray-100'}`}>
                  <h2 className="text-lg font-bold flex items-center">
                    <Flame className="mr-2 text-orange-500" />
                    Trending Now
                  </h2>
                </div>
                <div className="p-4">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className={`py-3 ${index !== trendingTopics.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                    >
                      <div>
                        <h3 className="font-medium cursor-pointer hover:underline" onClick={() => setSearchQuery(topic.title)}>
                          {topic.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {topic.posts.toLocaleString()} posts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className={`mb-6 rounded-lg overflow-hidden sticky top-96 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                <div className={`p-4 ${darkMode ? 'bg-gray-750' : 'bg-gray-100'}`}>
                  <h2 className="text-lg font-bold">Who to follow</h2>
                </div>
                <div className="p-4">
                  {suggestedUsers.map((suggestion, index) => (
                    <div
                      key={suggestion.user.id}
                      className={`py-3 ${index !== suggestedUsers.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-3">
                          <img
                            src={suggestion.user.avatar}
                            alt={suggestion.user.username}
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={() => viewProfile(suggestion.user)}
                          />
                          <div>
                            <h3
                              className="font-medium cursor-pointer"
                              onClick={() => viewProfile(suggestion.user)}
                            >
                              {suggestion.user.name}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              @{suggestion.user.username}
                            </p>
                            {suggestion.mutualFollowers > 0 && (
                              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {suggestion.mutualFollowers} mutual followers
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setFollowingStatus(prev => ({ ...prev, [suggestion.user.id]: !prev[suggestion.user.id] }))}
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${followingStatus[suggestion.user.id] ? (darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300') : (darkMode ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800')}`}
                        >
                          {followingStatus[suggestion.user.id] ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Info */}
              <div className={`rounded-lg overflow-hidden sticky top-[600px] ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                <div className="p-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    © {new Date().getFullYear()} BlissBlaze · <a href="#" className="hover:underline">About</a> · <a href="#" className="hover:underline">Help</a> · <a href="#" className="hover:underline">Terms</a> · <a href="#" className="hover:underline">Privacy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

