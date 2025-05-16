"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiMoon, FiSun } from "react-icons/fi";
import Head from "next/head";

interface Product {
    id: number;
    name: string;
    price: string;
    stockStatus: "In Stock" | "Out of Stock";
    category: string;
    image: string;
    description: string;
    quantity: number;
}

const products: Product[] = [
    {
        id: 1,
        name: "Classic White Tee",
        price: "$24.99",
        stockStatus: "In Stock",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Premium quality cotton t-shirt for everyday wear.",
        quantity: 10,
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: "$59.99",
        stockStatus: "In Stock",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Comfortable slim fit jeans with stretch technology.",
        quantity: 15,
    },
    {
        id: 3,
        name: "Winter Parka",
        price: "$129.99",
        stockStatus: "Out of Stock",
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        description: "Warm winter parka with waterproof exterior.",
        quantity: 0,
    },
];

const categoryOptions: string[] = ["All", "Tops", "Bottoms", "Outerwear"];
const stockOptions: string[] = ["All", "In Stock", "Out of Stock"];

const ProductModal: React.FC<{
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState<number>(1);

    if (!product) return null;

    const { name, price, stockStatus, category, image, description } = product;

    const handleQuantityChange = (value: number) => {
        setQuantity(Math.max(1, Math.min(product.quantity, value)));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div className="relative">
                    <button
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-full p-2 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-600 transition-colors duration-300 shadow-md z-10"
                        onClick={onClose}
                    >
                        <FiX className="h-5 w-5" />
                    </button>

                    <div className="h-64 overflow-hidden relative rounded-t-2xl">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    <div className="p-6">
                        <div className="mb-4">
                            <div className="px-3 py-1 rounded-full text-xs font-medium shadow-sm inline-block bg-slate-100 dark:bg-slate-700 mb-2">
                                {category}
                            </div>
                            <h2
                                className="text-2xl font-medium text-slate-900 dark:text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {name}
                            </h2>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            {description}
                        </p>

                        <div className="mb-6">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {price}
              </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                Availability
                            </h3>
                            <p
                                className={`text-lg font-medium ${
                                    stockStatus === "In Stock"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                }`}
                            >
                                {stockStatus}
                            </p>
                        </div>

                        {stockStatus === "In Stock" && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                        Quantity
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
                                            <button
                                                className="px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-300"
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={quantity <= 1}
                                            >
                                                <FiMinus className="h-5 w-5" />
                                            </button>
                                            <span className="px-4 py-2 text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                                            <button
                                                className="px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-300"
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
            </motion.div>
        </div>
    );
};

const ClothingBoutique: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<string>("All");
    const [stockStatus, setStockStatus] = useState<string>("All");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [cart, setCart] = useState<Product[]>([]);
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    const filteredAndSortedProducts = useMemo(() => {
        return products.filter((product) => {
            return (
                (category === "All" || product.category === category) &&
                (stockStatus === "All" || product.stockStatus === stockStatus)
            );
        });
    }, [category, stockStatus]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.toggle("dark", isDarkMode);
        }
    }, [isDarkMode, mounted]);

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

    const cartItemCount = cart.length;

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className={`min-h-screen transition-colors duration-300 ${
                    isDarkMode ? "dark bg-slate-900" : "light bg-slate-50"
                }`}
                style={{
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '0.025em'
                }}
            >
                {/* Notification Toast */}
                <AnimatePresence>
                    {showCartNotification && (
                        <motion.div
                            className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <FiShoppingCart className="h-5 w-5" />
                            <span>Item added to cart!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Premium Header */}
                <header className="bg-white dark:bg-slate-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1
                                className="text-3xl font-medium text-slate-900 dark:text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Élégance
                                <span className="ml-2 text-xs font-normal text-rose-500">Boutique</span>
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Curated luxury fashion
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-300"
                                onClick={toggleDarkMode}
                            >
                                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </button>

                            <div className="relative">
                                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-300">
                                    <FiShoppingCart size={20} />
                                </button>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Enhanced Filters Sidebar */}
                        <aside className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2
                                        className="text-lg font-medium text-slate-900 dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Refine
                                    </h2>
                                    <button
                                        className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => {
                                            setCategory("All");
                                            setStockStatus("All");
                                        }}
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                                            Category
                                        </h3>
                                        <div className="space-y-2">
                                            {categoryOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                                                        category === option
                                                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'
                                                    }`}
                                                    onClick={() => setCategory(option)}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                                            Availability
                                        </h3>
                                        <div className="space-y-2">
                                            {stockOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                                                        stockStatus === option
                                                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'
                                                    }`}
                                                    onClick={() => setStockStatus(option)}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Premium Product Grid */}
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
                                            <div className="h-72 bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="p-5">
                                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                >
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div
                                                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden group border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                                onClick={() => handleOpenModal(product)}
                                            >
                                                <div className="relative overflow-hidden h-72">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                        <div className="flex justify-between items-center">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-white/90 dark:bg-slate-700/90 text-slate-900 dark:text-white">
                                {product.category}
                              </span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                                product.stockStatus === "In Stock"
                                                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                                                                    : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200"
                                                            }`}>
                                {product.stockStatus}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h3
                                                        className="text-lg font-medium text-slate-900 dark:text-white mb-1"
                                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                                        {product.description}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {product.price}
                            </span>
                                                        <button
                                                            className="p-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-300 disabled:opacity-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            disabled={product.stockStatus === "Out of Stock"}
                                                        >
                                                            <FiShoppingCart size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <div className="max-w-md mx-auto">
                                        <h3
                                            className="text-xl font-medium text-slate-900 dark:text-white mb-3"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            No items found
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                                            We couldn't find any products matching your selection.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setCategory("All");
                                                setStockStatus("All");
                                            }}
                                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-300"
                                        >
                                            Reset filters
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </main>

                <AnimatePresence>
                    {selectedProduct && (
                        <ProductModal
                            product={selectedProduct}
                            onClose={handleCloseModal}
                            onAddToCart={addToCart}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ClothingBoutique;