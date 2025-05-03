"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Howl } from "howler";
import { Poppins } from "next/font/google";

// Set up Poppins font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Type definitions
interface Artist {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  skills: {
    [key: string]: number;
  };
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  medium: 'illustration' | '3d' | 'photography';
  image: string;
  likes: number;
  views: number;
  description: string;
  featured: boolean;
}

// Sample data
const sampleArtists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Astra Nova',
    bio: 'Digital sculptor and concept artist working at the intersection of organic forms and technology.',
    profileImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    skills: {
      '3D Modeling': 92,
      'Concept Art': 88,
      'Texture Design': 75,
      'Animation': 68,
    }
  },
  {
    id: 'artist-2',
    name: 'Pixel Perfect',
    bio: 'Illustrator specializing in vibrant digital paintings that blend surrealism with cyberpunk elements.',
    profileImage: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
    skills: {
      'Digital Painting': 95,
      'Character Design': 89,
      'Environment Art': 82,
      'UI Design': 70,
    }
  },
  {
    id: 'artist-3',
    name: 'Lensa View',
    bio: 'Photographer exploring urban landscapes and architectural abstraction through experimental techniques.',
    profileImage: 'https://images.unsplash.com/photo-1588453383063-37ea0b78f30f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    skills: {
      'Photography': 96,
      'Photo Manipulation': 85,
      'Color Grading': 90,
      'Composition': 94,
    }
  },
];

const sampleArtworks: Artwork[] = [
  {
    id: 'art-1',
    title: 'Neon Dreams',
    artist: 'Astra Nova',
    medium: '3d',
    image: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    likes: 324,
    views: 4512,
    description: 'Exploring the intersection of organic forms and digital architecture in an imagined cyberpunk cityscape.',
    featured: true,
  },
  {
    id: 'art-2',
    title: 'Digital Flora',
    artist: 'Pixel Perfect',
    medium: 'illustration',
    image: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=1200',
    likes: 267,
    views: 3128,
    description: 'Digital illustration exploring the evolution of nature through algorithmic patterns and vibrant color theory.',
    featured: true,
  },
  {
    id: 'art-3',
    title: 'Urban Reflections',
    artist: 'Lensa View',
    medium: 'photography',
    image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    likes: 198,
    views: 2376,
    description: 'A series exploring urban architecture through reflective surfaces, creating abstract compositions from everyday structures.',
    featured: false,
  },
  {
    id: 'art-4',
    title: 'Bio Mechanism',
    artist: 'Astra Nova',
    medium: '3d',
    image: 'https://images.pexels.com/photos/53494/mushroom-fungi-fungus-many-53494.jpeg?auto=compress&cs=tinysrgb&w=1200',
    likes: 421,
    views: 5823,
    description: '3D sculpture exploring the fusion of mechanical and biological forms in a post-human context.',
    featured: true,
  },
  {
    id: 'art-5',
    title: 'Dreamscape Portal',
    artist: 'Pixel Perfect',
    medium: 'illustration',
    image: 'https://images.unsplash.com/photo-1619472351888-f844a0b33f5b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
    likes: 356,
    views: 4102,
    description: 'Digital painting exploring subconscious realms through surreal imagery and symbolic motifs.',
    featured: false,
  },
  {
    id: 'art-6',
    title: 'Chromatic Fragments',
    artist: 'Lensa View',
    medium: 'photography',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1064&q=80',
    likes: 245,
    views: 3297,
    description: 'Experimental photography utilizing prisms and light manipulation to create abstract color compositions.',
    featured: false,
  },
];

// SVG Morph Paths
const morphPaths = [
  "M80,250 C169,210 195,110 269,116 C343,122 352,229 434,229 C515,229 570,169 570,80",
  "M80,180 C147,282 186,160 278,174 C369,188 367,283 434,180 C501,77 570,220 570,80",
  "M80,120 C139,200 206,287 266,216 C325,145 358,219 434,135 C509,51 570,145 570,80",
  "M80,80 C135,149 183,54 269,54 C354,54 363,144 434,176 C505,208 570,97 570,80"
];

// Main Component
export default function Home() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [filterMedium, setFilterMedium] = useState<string | null>(null);
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [expandedArtwork, setExpandedArtwork] = useState<Artwork | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState(0);
  const [sound, setSound] = useState<Howl | null>(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [, setScrollY] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    medium: 'illustration',
    description: '',
    file: null as File | null,
  });

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Intersection Observers
  const [featuredRef, featuredInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const [artistsRef, artistsInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Filter artworks based on selected medium
  const filteredArtworks = filterMedium
    ? sampleArtworks.filter(artwork => artwork.medium === filterMedium)
    : sampleArtworks;

  // Generate path for SVG morph animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPath((prev) => (prev + 1) % morphPaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize sounds
  useEffect(() => {
    const lightSound = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-atmosphere-ambience-2119.mp3'],
      loop: true,
      volume: 0.3,
    });

    const darkSound = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-small-waves-breaking-on-beach-1181.mp3'],
      loop: true,
      volume: 0.3,
    });

    setSound(darkMode ? darkSound : lightSound);

    return () => {
      lightSound.unload();
      darkSound.unload();
    };
  }, [darkMode]);

  // Toggle sound on/off
  const toggleSound = () => {
    if (sound) {
      if (isSoundPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsSoundPlaying(!isSoundPlaying);
    }
  };

  // Toggle mood (dark/light mode)
  const toggleMood = () => {
    setDarkMode(!darkMode);
    if (sound) {
      sound.stop();
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo purposes
    if (username === "artist" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Use 'artist' and 'password' for demo.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // Upload form handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would upload to a server
    alert(`Artwork "${uploadForm.title}" submitted successfully!`);
    setUploadForm({
      title: '',
      medium: 'illustration',
      description: '',
      file: null,
    });
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0],
      });
    }
  };

  // Radial Progress component with detailed comments
  const RadialProgress = ({ skill, value, index }: { skill: string; value: number; index: number }) => {
    const radius = 40; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const offset = circumference - (value / 100) * circumference; // Calculate offset for progress

    return (
      <motion.div
        className="skill-progress"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#333"
            strokeWidth="4"
            fill="transparent"
            strokeOpacity="0.2"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={darkMode ? "#00ffcc" : "#ff3366"}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        </svg>
        {/* Skill label and percentage */}
        <div className="skill-info">
          <h4>{skill}</h4>
          <p>{value}%</p>
        </div>
      </motion.div>
    );
  };

  // Animated SVG background component
  const AnimatedBackground = () => (
    <div className="animated-background">
      <svg
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
        className="morph-path"
      >
        <motion.path
          d={morphPaths[currentPath]}
          fill="transparent"
          stroke={darkMode ? "#00ffcc" : "#ff3366"}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!newProperty.title.trim()) errors.title = "Title is required.";
    if (newProperty.price <= 0) errors.price = "Price must be greater than 0.";
    if (newProperty.bedrooms < 0) errors.bedrooms = "Bedrooms cannot be negative.";
    if (newProperty.bathrooms < 0) errors.bathrooms = "Bathrooms cannot be negative.";
    if (newProperty.area <= 0) errors.area = "Area must be greater than 0.";
    if (!newProperty.location.trim()) errors.location = "Location is required.";
    if (!newProperty.agent.trim()) errors.agent = "Agent is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProperty = () => {
    if (!validateForm()) return;

    const newId = Math.max(...properties.map((p) => p.id), 0) + 1;
    setProperties([...properties, { ...newProperty, id: newId }]);
    setShowAddProperty(false);
    setNewProperty({
      title: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      agent: "",
      image: "",
      status: "new",
      location: "",
      propertyType: "apartment",
      amenities: [],
      listedDate: new Date().toISOString().split("T")[0],
      commission: 0,
    });
    setValidationErrors({});
  };

  return (
    <div className={`app-container ${poppins.className} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Head>
        <title>Flux Gallery | Digital Art Portfolio</title>
        <meta name="description" content="A futuristic digital art portfolio" />
      </Head>

      <header ref={headerRef} className="main-header">
        <nav>
          <div className="logo">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              FLUX GALLERY
            </motion.div>
          </div>
          <motion.ul
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            <motion.li><a href="#featured">Featured</a></motion.li>
            <motion.li><a href="#artists">Artists</a></motion.li>
            <motion.li><a href="#gallery">Gallery</a></motion.li>
            {isLoggedIn ? (
              <>
                <motion.li><a href="#upload">Upload</a></motion.li>
                <motion.li><button onClick={handleLogout} className="login-btn">Logout</button></motion.li>
              </>
            ) : (
              <motion.li><button onClick={() => document.getElementById('login-modal')?.classList.add('visible')} className="login-btn">Login</button></motion.li>
            )}
          </motion.ul>
        </nav>

        <div className="hero-section">
          <AnimatedBackground />
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1>Where Digital Art<br /><span>Comes Alive</span></h1>
            <p>Explore a curated collection of cutting-edge digital artwork from talented creators around the world</p>
            <div className="hero-cta">
              <button onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Gallery
              </button>
              <button className="mood-toggle" onClick={toggleMood}>
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <button className="sound-toggle" onClick={toggleSound}>
                {isSoundPlaying ? '🔇 Mute' : '🔊 Ambient Sound'}
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      <main>
        {/* Featured Section */}
        <section id="featured" ref={featuredRef} className="featured-section">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Featured Artwork
          </motion.h2>

          <div className="featured-grid">
            {sampleArtworks.filter(art => art.featured).map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="featured-item"
                initial={{ opacity: 0, y: 50 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => setExpandedArtwork(artwork)}
              >
                <div className="artwork-preview">
                  <img src={artwork.image} alt={artwork.title} />
                  <div className="artwork-overlay">
                    <h3>{artwork.title}</h3>
                    <p>by {artwork.artist}</p>
                    <span className="medium-tag">{artwork.medium}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Artists Section */}
        <section id="artists" ref={artistsRef} className="artists-section">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={artistsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Meet Our Artists
          </motion.h2>

          <div className="artists-grid">
            {sampleArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                className={`artist-card ${currentArtist?.id === artist.id ? 'expanded' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={artistsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => setCurrentArtist(currentArtist?.id === artist.id ? null : artist)}
              >
                <div className="artist-profile">
                  <div className="artist-image">
                    <img src={artist.profileImage} alt={artist.name} />
                  </div>
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    <p>{artist.bio}</p>
                  </div>
                </div>

                {currentArtist?.id === artist.id && (
                  <motion.div
                    className="artist-skills"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>Skills</h4>
                    <div className="skills-grid">
                      {Object.entries(artist.skills).map(([skill, value], i) => (
                        <RadialProgress key={skill} skill={skill} value={value} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" ref={galleryRef} className="gallery-section">
          <h2>Art Gallery</h2>

          <div className="filter-controls">
            <button
              className={filterMedium === null ? 'active' : ''}
              onClick={() => setFilterMedium(null)}
            >
              All
            </button>
            <button
              className={filterMedium === 'illustration' ? 'active' : ''}
              onClick={() => setFilterMedium('illustration')}
            >
              Illustration
            </button>
            <button
              className={filterMedium === '3d' ? 'active' : ''}
              onClick={() => setFilterMedium('3d')}
            >
              3D Art
            </button>
            <button
              className={filterMedium === 'photography' ? 'active' : ''}
              onClick={() => setFilterMedium('photography')}
            >
              Photography
            </button>
          </div>

          <motion.div
            className="gallery-grid"
            layout
          >
            <AnimatePresence>
              {filteredArtworks.map((artwork) => (
                <motion.div
                  layout
                  key={artwork.id}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setExpandedArtwork(artwork)}
                >
                  <img src={artwork.image} alt={artwork.title} />
                  <div className="gallery-item-info">
                    <h3>{artwork.title}</h3>
                    <p>by {artwork.artist}</p>
                    <div className="artwork-stats">
                      <span>❤️ {artwork.likes}</span>
                      <span>👁️ {artwork.views}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Upload Section - Only visible when logged in */}
        {isLoggedIn && (
          <section id="upload" className="upload-section">
            <h2>Upload New Artwork</h2>
            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="medium">Medium</label>
                <select
                  id="medium"
                  value={uploadForm.medium}
                  onChange={(e) => setUploadForm({...uploadForm, medium: e.target.value as never})}
                  required
                >
                  <option value="illustration">Illustration</option>
                  <option value="3d">3D Art</option>
                  <option value="photography">Photography</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="artwork-file">Upload Image</label>
                <input
                  type="file"
                  id="artwork-file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Upload Artwork</button>
            </form>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">FLUX GALLERY</div>
          <div className="footer-links">
            <a href="#featured">Featured</a>
            <a href="#artists">Artists</a>
            <a href="#gallery">Gallery</a>
            {isLoggedIn && <a href="#upload">Upload</a>}
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Behance">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12h6v4H1z"></path>
                <path d="M9 8h6v8H9z"></path>
                <path d="M17 12h6v4h-6z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} Flux Gallery. All rights reserved.
        </div>
      </footer>

      {/* Login Modal */}
      <div id="login-modal" className="modal">
        <div className="modal-content">
          <button className="close-btn" onClick={() => document.getElementById('login-modal')?.classList.remove('visible')}>×</button>
          <h2>Artist Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-submit">Login</button>
            <p className="login-hint">(Use &quot;artist&quot; / &quot;password&quot; for demo)</p>
          </form>
        </div>
      </div>

      {/* Expanded Artwork Modal */}
      {expandedArtwork && (
        <div className="artwork-modal visible">
          <div className="artwork-modal-content">
            <button className="close-btn" onClick={() => setExpandedArtwork(null)}>×</button>
            <div className="artwork-details">
              <div className="artwork-image">
                <img src={expandedArtwork.image} alt={expandedArtwork.title} />
              </div>
              <div className="artwork-info">
                <h2>{expandedArtwork.title}</h2>
                <h3>by {expandedArtwork.artist}</h3>
                <div className="artwork-stats">
                  <span>❤️ {expandedArtwork.likes} likes</span>
                  <span>👁️ {expandedArtwork.views} views</span>
                </div>
                <p className="artwork-description">{expandedArtwork.description}</p>
                <span className="medium-tag large">{expandedArtwork.medium}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          cursor: pointer;
          font-family: inherit;
        }

        .app-container {
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        .app-container.light-mode {
          background-color: #f8f9fa;
          color: #333;
        }

        .app-container.dark-mode {
          background-color: #121212;
          color: #f0f0f0;
        }

        /* Header */
        .main-header {
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .dark-mode .main-header {
          background: linear-gradient(135deg, #040d21 0%, #0d1f33 100%);
        }

        .light-mode .main-header {
          background: linear-gradient(135deg, #f6f7f9 0%, #e9ecef 100%);
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          position: fixed;
          width: 100%;
          z-index: 1000;
          backdrop-filter: blur(8px);
          transition: background-color 0.3s ease;
        }

        .dark-mode nav {
          background-color: rgba(18, 18, 18, 0.8);
        }

        .light-mode nav {
          background-color: rgba(248, 249, 250, 0.8);
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .dark-mode .logo {
          color: #00ffcc;
        }

        .light-mode .logo {
          color: #ff3366;
        }

        nav ul {
          display: flex;
          flex-direction: column; /* Change to column layout */
          list-style: none;
          gap: 1rem; /* Add spacing between links */
          align-items: flex-start; /* Align links to the start */
        }

        @media (min-width: 768px) {
          nav ul {
            flex-direction: row; /* Revert to row layout for larger screens */
            align-items: center; /* Center align links */
          }
        }

        nav li a {
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .dark-mode nav li a:hover {
          color: #00ffcc;
        }

        .light-mode nav li a:hover {
          color: #ff3366;
        }

        .login-btn {
          background: transparent;
          border: 2px solid;
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .dark-mode .login-btn {
          border-color: #00ffcc;
          color: #00ffcc;
        }

        .dark-mode .login-btn:hover {
          background-color: #00ffcc;
          color: #121212;
        }

        .light-mode .login-btn {
          border-color: #ff3366;
          color: #ff3366;
        }

        .light-mode .login-btn:hover {
          background-color: #ff3366;
          color: #fff;
        }

        /* Hero Section */
        .hero-section {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 10%;
          position: relative;
        }

        .animated-background {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
        }

        .morph-path {
          width: 100%;
          height: 100%;
        }

        .hero-content {
          max-width: 700px;
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .dark-mode .hero-content h1 span {
          color: #00ffcc;
        }

        .light-mode .hero-content h1 span {
          color: #ff3366;
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-cta button {
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }

        .dark-mode .hero-cta button:first-child {
          background-color: #00ffcc;
          color: #121212;
        }

        .dark-mode .hero-cta button:first-child:hover {
          background-color: #00e6b8;
        }

        .light-mode .hero-cta button:first-child {
          background-color: #ff3366;
          color: #fff;
        }

        .light-mode .hero-cta button:first-child:hover {
          background-color: #e62e5c;
        }

        .mood-toggle, .sound-toggle {
          background-color: transparent !important;
          border: 2px solid !important;
        }

        .dark-mode .mood-toggle, .dark-mode .sound-toggle {
          border-color: #333 !important;
          color: #f0f0f0 !important;
        }

        .light-mode .mood-toggle, .light-mode .sound-toggle {
          border-color: #ddd !important;
          color: #333 !important;
        }

        /* Sections */
        section {
          padding: 5rem 10%;
        }

        section h2 {
          font-size: 2.5rem;
          margin-bottom: 3rem;
          text-align: center;
          position: relative;
        }

        .dark-mode section h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background-color: #00ffcc;
        }

        .light-mode section h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background-color: #ff3366;
        }

        /* Featured Section */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .featured-item {
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .featured-item:hover {
          transform: translateY(-10px);
        }

        .artwork-preview {
          position: relative;
          height: 300px;
        }

        .artwork-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .artwork-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: #fff;
        }

        .artwork-overlay h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .medium-tag {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }

        .dark-mode .medium-tag {
          background-color: #00ffcc;
          color: #121212;
        }

        .light-mode .medium-tag {
          background-color: #ff3366;
          color: #fff;
        }

        /* Artists Section */
        .artists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .artist-card {
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .dark-mode .artist-card {
          background-color: #1f1f1f;
        }

        .light-mode .artist-card {
          background-color: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .artist-profile {
          display: flex;
          padding: 1.5rem;
          gap: 1rem;
        }

        .artist-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .artist-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .artist-info h3 {
          margin-bottom: 0.5rem;
        }

        .artist-info p {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .artist-skills {
          padding: 0 1.5rem 1.5rem;
        }

        .artist-skills h4 {
          margin-bottom: 1rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .skill-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .skill-info {
          text-align: center;
          margin-top: 0.5rem;
        }

        .skill-info h4 {
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }

        .skill-info p {
          font-weight: 600;
        }

        /* Gallery Section */
        .filter-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-controls button {
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 2px solid;
          background: transparent;
        }

        .dark-mode .filter-controls button {
          border-color: #333;
          color: #f0f0f0;
        }

        .dark-mode .filter-controls button.active,
        .dark-mode .filter-controls button:hover {
          background-color: #00ffcc;
          border-color: #00ffcc;
          color: #121212;
        }

        .light-mode .filter-controls button {
          border-color: #ddd;
          color: #333;
        }

        .light-mode .filter-controls button.active,
        .light-mode .filter-controls button:hover {
          background-color: #ff3366;
          border-color: #ff3366;
          color: #fff;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .gallery-item {
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          aspect-ratio: 1/1;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.05);
        }

        .gallery-item-info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: #fff;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-item-info {
          transform: translateY(0);
        }

        .gallery-item-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.2rem;
        }

        .artwork-stats {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        /* Upload Section */
        .upload-section {
          max-width: 800px;
          margin: 0 auto;
        }

        .upload-form {
          display: grid;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.8rem;
          border-radius: 5px;
          border: 1px solid;
          font-family: inherit;
          resize: vertical;
        }

        .dark-mode .form-group input,
        .dark-mode .form-group select,
        .dark-mode .form-group textarea {
          background-color: #1f1f1f;
          border-color: #333;
          color: #f0f0f0;
        }

        .light-mode .form-group input,
        .light-mode .form-group select,
        .light-mode .form-group textarea {
          background-color: #f8f9fa;
          border-color: #ddd;
          color: #333;
        }

        .form-group textarea {
          min-height: 150px;
        }

        .submit-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          justify-self: start;
        }

        .dark-mode .submit-btn {
          background-color: #00ffcc;
          color: #121212;
        }

        .dark-mode .submit-btn:hover {
          background-color: #00e6b8;
        }

        .light-mode .submit-btn {
          background-color: #ff3366;
          color: #fff;
        }

        .light-mode .submit-btn:hover {
          background-color: #e62e5c;
        }

        /* Footer */
        footer {
          padding: 3rem 10%;
        }

        .dark-mode footer {
          background-color: #1a1a1a;
        }

        .light-mode footer {
          background-color: #e9ecef;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .dark-mode .footer-logo {
          color: #00ffcc;
        }

        .light-mode .footer-logo {
          color: #ff3366;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
        }

        .footer-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .dark-mode .footer-social a {
          background-color: #2a2a2a;
        }

        .dark-mode .footer-social a:hover {
          background-color: #00ffcc;
          color: #121212;
        }

        .light-mode .footer-social a {
          background-color: #f0f0f0;
        }

        .light-mode .footer-social a:hover {
          background-color: #ff3366;
          color: #fff;
        }

        .copyright {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid;
          font-size: 0.9rem;
        }

        .dark-mode .copyright {
          border-color: #333;
        }

        .light-mode .copyright {
          border-color: #ddd;
        }

        /* Modals */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .modal.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          border-radius: 15px;
          position: relative;
        }

        .dark-mode .modal-content {
          background-color: #1f1f1f;
        }

        .light-mode .modal-content {
          background-color: #ffffff;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .dark-mode .close-btn:hover {
          color: #00ffcc;
        }

        .light-mode .close-btn:hover {
          color: #ff3366;
        }

        .modal-content h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .login-submit {
          width: 100%;
          padding: 0.8rem;
          border-radius: 5px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          margin-top: 1rem;
        }

        .dark-mode .login-submit {
          background-color: #00ffcc;
          color: #121212;
        }

        .dark-mode .login-submit:hover {
          background-color: #00e6b8;
        }

        .light-mode .login-submit {
          background-color: #ff3366;
          color: #fff;
        }

        .light-mode .login-submit:hover {
          background-color: #e62e5c;
        }

        .login-hint {
          font-size: 0.8rem;
          opacity: 0.7;
          text-align: center;
          margin-top: 0.5rem;
        }

        /* Artwork Modal */
        .artwork-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .artwork-modal.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .artwork-modal-content {
          width: 90%;
          max-width: 1000px;
          padding: 2rem;
          border-radius: 15px;
          position: relative;
          color: #fff;
        }

        .artwork-details {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .artwork-image {
          flex: 1;
          min-width: 300px;
          border-radius: 10px;
          overflow: hidden;
        }

        .artwork-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .artwork-info {
          flex: 1;
          min-width: 300px;
        }

        .artwork-info h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .artwork-info h3 {
          font-size: 1.2rem;
          font-weight: 400;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .artwork-info .artwork-stats {
          margin: 1rem 0;
          display: flex;
          gap: 1rem;
        }

        .artwork-description {
          margin: 1.5rem 0;
          line-height: 1.8;
        }

        .medium-tag.large {
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          nav {
            padding: 1rem 5%;
          }

          .logo {
            font-size: 1.5rem;
          }

          nav ul {
            gap: 1.5rem;
          }

          .hero-content h1 {
            font-size: 3rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          section {
            padding: 4rem 5%;
          }

          section h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5rem;
          }

          .featured-grid,
          .artists-grid,
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }

          .footer-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .artwork-details {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          nav ul {
            gap: 1rem;
            font-size: 0.9rem;
          }

          .hero-cta {
            flex-direction: column;
          }

          .hero-cta button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
