"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiFilter, FiX, FiPlus, FiMinus, FiShoppingCart, FiHeart, FiStar, FiChevronDown } from "react-icons/fi";
import React from "react";

interface Product {
    id: number;
    name: string;
    price: string;
    originalPrice?: string;
    stockStatus: string;
    category: string;
    image: string;
    description: string;
    quantity: number;
    rating: number;
    reviews: number;
    colors?: string[];
    sizes?: string[];
    isNew?: boolean;
    isFeatured?: boolean;
    isOnSale?: boolean;
}

const products: Product[] = [
    {
        id: 1,
        name: "Premium Cotton Tee",
        price: "$24.99",
        originalPrice: "$29.99",
        stockStatus: "In Stock",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Ultra-soft premium cotton tee with a perfect fit. Designed for comfort and style.",
        quantity: 10,
        rating: 4.5,
        reviews: 128,
        colors: ["#3b82f6", "#ef4444", "#000000"],
        sizes: ["S", "M", "L", "XL"],
        isNew: true,
        isOnSale: true
    },
    {
        id: 2,
        name: "Slim Fit Denim Jeans",
        price: "$59.99",
        stockStatus: "In Stock",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Classic slim fit denim jeans with stretch technology for all-day comfort.",
        quantity: 15,
        rating: 4.2,
        reviews: 89,
        colors: ["#1e40af", "#000000"],
        sizes: ["28", "30", "32", "34", "36"],
        isFeatured: true
    },
    {
        id: 3,
        name: "Winter Parka Jacket",
        price: "$129.99",
        stockStatus: "Low Stock",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Heavy-duty winter parka with waterproof shell and thermal insulation.",
        quantity: 3,
        rating: 4.8,
        reviews: 56,
        colors: ["#1e293b", "#92400e"],
        sizes: ["S", "M", "L", "XL"],
        isFeatured: true
    },
    {
        id: 4,
        name: "Performance Running Shoes",
        price: "$89.99",
        stockStatus: "In Stock",
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Lightweight running shoes with responsive cushioning and breathable mesh.",
        quantity: 20,
        rating: 4.7,
        reviews: 215,
        colors: ["#f59e0b", "#000000", "#dc2626"],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
        isNew: true
    },
    {
        id: 5,
        name: "Italian Wool Blazer",
        price: "$199.99",
        originalPrice: "$249.99",
        stockStatus: "Out of Stock",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Premium Italian wool blazer with tailored fit and satin lining.",
        quantity: 0,
        rating: 4.9,
        reviews: 42,
        colors: ["#1e293b", "#4b5563"],
        sizes: ["38R", "40R", "42R", "44R"],
        isOnSale: true
    },
    {
        id: 6,
        name: "Linen Shorts",
        price: "$34.99",
        stockStatus: "In Stock",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Breathable linen shorts perfect for summer with an elastic waistband.",
        quantity: 12,
        rating: 4.1,
        reviews: 37,
        colors: ["#84cc16", "#f97316", "#ffffff"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 7,
        name: "Leather Crossbody Bag",
        price: "$79.99",
        stockStatus: "In Stock",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Genuine leather crossbody bag with multiple compartments and adjustable strap.",
        quantity: 8,
        rating: 4.6,
        reviews: 63,
        colors: ["#78350f", "#000000"]
    },
    {
        id: 8,
        name: "High-Waisted Yoga Pants",
        price: "$49.99",
        stockStatus: "In Stock",
        category: "Activewear",
        image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "High-waisted yoga pants with four-way stretch and moisture-wicking fabric.",
        quantity: 18,
        rating: 4.4,
        reviews: 94,
        colors: ["#000000", "#64748b", "#ec4899"],
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 9,
        name: "Cashmere Hoodie",
        price: "$149.99",
        stockStatus: "In Stock",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Luxurious cashmere hoodie with kangaroo pocket and ribbed cuffs.",
        quantity: 5,
        rating: 4.9,
        reviews: 31,
        colors: ["#57534e", "#1e40af", "#831843"],
        sizes: ["S", "M", "L"]
    },
    {
        id: 10,
        name: "Leather Sandals",
        price: "$59.99",
        stockStatus: "Out of Stock",
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Handcrafted leather sandals with cushioned footbed and adjustable straps.",
        quantity: 0,
        rating: 4.3,
        reviews: 28,
        colors: ["#78350f", "#000000"],
        sizes: ["US 6", "US 7", "US 8", "US 9", "US 10"]
    },
    {
        id: 11,
        name: "Silk Midi Dress",
        price: "$89.99",
        stockStatus: "In Stock",
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Elegant silk midi dress with v-neckline and concealed side zipper.",
        quantity: 7,
        rating: 4.7,
        reviews: 52,
        colors: ["#7c3aed", "#0d9488", "#be123c"],
        sizes: ["XS", "S", "M", "L"]
    },
    {
        id: 12,
        name: "Cropped Knit Sweater",
        price: "$45.99",
        originalPrice: "$59.99",
        stockStatus: "In Stock",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Chunky knit cropped sweater with ribbed hem and cuffs.",
        quantity: 9,
        rating: 4.0,
        reviews: 41,
        colors: ["#f59e0b", "#ec4899", "#1e40af"],
        sizes: ["S", "M", "L"],
        isOnSale: true
    }
];

const categoryOptions: string[] = ["All", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories", "Activewear", "Dresses"];
const stockOptions: string[] = ["All", "In Stock", "Low Stock", "Out of Stock"];
const sortOptions: { value: string; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
];

interface ProductCardProps {
    product: Product;
    onOpen: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen, onAddToCart, onAddToWishlist }) => {
    const { name, price, originalPrice, stockStatus, category, image, rating, reviews, isNew, isFeatured, isOnSale } = product;

    return (
        <motion.div
            className="relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-800"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col items-start space-y-2">
                {isNew && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white">
            New
          </span>
                )}
                {isFeatured && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-purple-600 text-white">
            Featured
          </span>
                )}
                {isOnSale && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
            Sale
          </span>
                )}
            </div>

            {/* Wishlist button */}
            <button
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(product);
                }}
            >
                <FiHeart className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>

            <div onClick={() => onOpen(product)} className="cursor-pointer">
                <div className="h-64 overflow-hidden relative">
                    <img
                        src={image}
                        alt={`Image of ${name}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        <div className="px-3 py-1 rounded-full text-xs font-semibold shadow-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                            {category}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold shadow-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <span
                  className={`w-2 h-2 rounded-full mr-1 inline-block ${
                      stockStatus === "In Stock"
                          ? "bg-emerald-500"
                          : stockStatus === "Low Stock"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                  }`}
              ></span>
                            {stockStatus}
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{name}</h3>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < Math.floor(rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : i < rating
                                                ? "text-yellow-400 fill-yellow-400/30"
                                                : "text-slate-300 dark:text-slate-600"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
              ({reviews})
            </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            {originalPrice ? (
                                <>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{price}</span>
                                    <span className="ml-2 text-sm line-through text-slate-500 dark:text-slate-400">
                    {originalPrice}
                  </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{price}</span>
                            )}
                        </div>
                        <button
                            className="p-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                            disabled={stockStatus === "Out of Stock"}
                        >
                            <FiShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, onAddToWishlist }) => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (product) {
            setSelectedColor(product.colors?.[0] || null);
            setSelectedSize(product.sizes?.[0] || null);
            setQuantity(1);
        }
    }, [product]);

    if (!product) return null;

    const { name, price, originalPrice, stockStatus, category, image, description, rating, reviews, colors, sizes } = product;

    const handleQuantityChange = (value: number) => {
        setQuantity(Math.max(1, Math.min(product.quantity, value)));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div className="relative">
                    <button
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300 shadow-md z-10"
                        onClick={onClose}
                    >
                        <FiX className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="h-full relative">
                            <div className="h-96 md:h-full overflow-hidden relative rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                                <img
                                    src={image}
                                    alt={`Detailed view of ${name}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="px-3 py-1 rounded-full text-xs font-semibold shadow-md inline-block bg-slate-100 dark:bg-slate-800 mb-2">
                                        {category}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h2>
                                </div>
                                <button
                                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-300"
                                    onClick={() => onAddToWishlist(product)}
                                >
                                    <FiHeart className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="flex items-center mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i < Math.floor(rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : i < rating
                                                        ? "text-yellow-400 fill-yellow-400/30"
                                                        : "text-slate-300 dark:text-slate-600"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {rating.toFixed(1)} ({reviews} reviews)
                </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>

                            <div className="mb-6">
                                {originalPrice ? (
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{price}</span>
                                        <span className="ml-3 text-lg line-through text-slate-500 dark:text-slate-400">
                      {originalPrice}
                    </span>
                                        {originalPrice && (
                                            <span className="ml-3 px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                        {Math.round(
                            ((parseFloat(originalPrice.replace("$", "")) -
                                    parseFloat(price.replace("$", ""))) /
                                parseFloat(originalPrice.replace("$", ""))) * 100
                            )}% OFF
                      </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{price}</span>
                                )}
                            </div>

                            {colors && colors.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Color: {selectedColor && <span className="font-normal">{selectedColor}</span>}
                                    </h3>
                                    <div className="flex space-x-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                                                    selectedColor === color
                                                        ? "border-slate-900 dark:border-white"
                                                        : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setSelectedColor(color)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizes && sizes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Size: {selectedSize && <span className="font-normal">{selectedSize}</span>}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                                    selectedSize === size
                                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                                                }`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Availability
                                </h3>
                                <p
                                    className={`text-lg font-semibold ${
                                        stockStatus === "In Stock"
                                            ? "text-emerald-500"
                                            : stockStatus === "Low Stock"
                                                ? "text-amber-500"
                                                : "text-rose-500"
                                    }`}
                                >
                                    {stockStatus}
                                    {stockStatus === "In Stock" && product.quantity > 0 && (
                                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                      ({product.quantity} available)
                    </span>
                                    )}
                                </p>
                            </div>

                            {stockStatus !== "Out of Stock" && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Quantity
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                                <button
                                                    className="px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
                                                    onClick={() => handleQuantityChange(quantity - 1)}
                                                    disabled={quantity <= 1}
                                                >
                                                    <FiMinus className="h-5 w-5" />
                                                </button>
                                                <span className="px-4 py-2 text-slate-900 dark:text-white">{quantity}</span>
                                                <button
                                                    className="px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
                                                    onClick={() => handleQuantityChange(quantity + 1)}
                                                    disabled={quantity >= product.quantity}
                                                >
                                                    <FiPlus className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <button
                                                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-md transition-colors duration-300 hover:bg-slate-700 dark:hover:bg-slate-200 flex items-center justify-center space-x-2"
                                                onClick={() => onAddToCart(product)}
                                            >
                                                <FiShoppingCart className="h-5 w-5" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ClothingBoutique: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<string>("All");
    const [stockStatus, setStockStatus] = useState<string>("All");
    const [sortOption, setSortOption] = useState<string>("featured");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [cart, setCart] = useState<Product[]>([]);
    const [, setWishlist] = useState<Product[]>([]);
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [showWishlistNotification, setShowWishlistNotification] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(savedDarkMode);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("darkMode", isDarkMode.toString());
            document.documentElement.classList.toggle("dark", isDarkMode);
        }
    }, [isDarkMode, mounted]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Apply filters
        if (category !== "All") {
            result = result.filter((product) => product.category === category);
        }

        if (stockStatus !== "All") {
            result = result.filter((product) => product.stockStatus === stockStatus);
        }

        // Apply sorting
        switch (sortOption) {
            case "newest":
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "price-low":
                result.sort(
                    (a, b) =>
                        parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
                );
                break;
            case "price-high":
                result.sort(
                    (a, b) =>
                        parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""))
                );
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "featured":
            default:
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
        }

        return result;
    }, [category, stockStatus, sortOption]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilteredProducts(filteredAndSortedProducts);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [filteredAndSortedProducts]);

    const handleOpenModal = (product: Product): void => {
        setSelectedProduct(product);
    };

    const handleCloseModal = (): void => {
        setSelectedProduct(null);
    };

    const toggleDarkMode = (): void => {
        setIsDarkMode(!isDarkMode);
    };

    const addToCart = (product: Product): void => {
        setCart((prevCart) => [...prevCart, product]);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const addToWishlist = (product: Product): void => {
        setWishlist((prevWishlist) => [...prevWishlist, product]);
        setShowWishlistNotification(true);
        setTimeout(() => setShowWishlistNotification(false), 3000);
    };

    const cartItemCount = cart.length;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-slate-950" : "light bg-slate-50"}`}>
            {/* Notification Toasts */}
            <AnimatePresence>
                {showCartNotification && (
                    <motion.div
                        className="fixed bottom-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <FiShoppingCart className="h-5 w-5" />
                        <span>Item added to cart!</span>
                    </motion.div>
                )}
                {showWishlistNotification && (
                    <motion.div
                        className="fixed bottom-4 right-4 z-50 bg-rose-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <FiHeart className="h-5 w-5" />
                        <span>Item added to wishlist!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-6 md:space-y-0">
                    <div className="relative">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            LuxeBoutique
                            <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cartItemCount > 0 ? cartItemCount : "B"}
              </span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Curated luxury fashion collection
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded-md transition-colors duration-300 flex items-center space-x-2 shadow-md ${
                                isDarkMode
                                    ? "bg-slate-800 text-white hover:bg-slate-700"
                                    : "bg-white text-slate-900 hover:bg-slate-100"
                            }`}
                            onClick={toggleDarkMode}
                        >
                            {isDarkMode ? (
                                <>
                                    <FiSun className="h-5 w-5" />
                                    <span>Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <FiMoon className="h-5 w-5" />
                                    <span>Dark Mode</span>
                                </>
                            )}
                        </button>
                        <button
                            className={`md:hidden px-4 py-2 rounded-md transition-colors duration-300 flex items-center space-x-2 shadow-md ${
                                isDarkMode
                                    ? "bg-slate-800 text-white hover:bg-slate-700"
                                    : "bg-white text-slate-900 hover:bg-slate-100"
                            }`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <FiFilter className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div
                        className={`md:col-span-1 transition-all duration-300 ${
                            isFilterOpen ? "block" : "hidden md:block"
                        }`}
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 mb-6 md:mb-0 border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                                <FiFilter className="h-5 w-5 mr-2" />
                                Filters
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Sort By
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 pr-8"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                                            <FiChevronDown className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 pr-8"
                                        >
                                            {categoryOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                                            <FiChevronDown className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Availability
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={stockStatus}
                                            onChange={(e) => setStockStatus(e.target.value)}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 pr-8"
                                        >
                                            {stockOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                                            <FiChevronDown className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                        onClick={() => {
                                            setCategory("All");
                                            setStockStatus("All");
                                            setSortOption("featured");
                                        }}
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-md transition-colors duration-300 hover:bg-slate-700 dark:hover:bg-slate-200"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden animate-pulse"
                                    >
                                        <div className="h-64 bg-slate-300 dark:bg-slate-700"></div>
                                        <div className="p-5">
                                            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                                            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-5"></div>
                                            <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {filteredProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onOpen={handleOpenModal}
                                                onAddToCart={addToCart}
                                                onAddToWishlist={addToWishlist}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto mb-4 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            No products found
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            We couldn't find any products matching your filters.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setCategory("All");
                                                setStockStatus("All");
                                                setSortOption("featured");
                                            }}
                                            className="mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-slate-700 dark:hover:bg-slate-200"
                                        >
                                            Reset Filters
                                        </button>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={handleCloseModal}
                        onAddToCart={addToCart}
                        onAddToWishlist={addToWishlist}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClothingBoutique;