"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

const plans = [
  {
    title: "Starter",
    monthly: "$9",
    yearly: "$90",
    description: "Perfect for individuals just getting started.",
    features: [
      "1 project",
      "Basic analytics",
      "Email support",
      "Community access",
      "Starter templates"
    ],
    popular: false,
  },
  {
    title: "Professional",
    monthly: "$29",
    yearly: "$290",
    description: "For growing businesses and teams.",
    features: [
      "Up to 10 projects",
      "Advanced analytics",
      "Priority email support",
      "Premium templates",
      "Team collaboration"
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    monthly: "$99",
    yearly: "$990",
    description: "Full power for large organizations.",
    features: [
      "Unlimited projects",
      "Custom analytics",
      "Dedicated account manager",
      "Onboarding assistance",
      "Custom integrations"
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "Is there a free trial available?",
    answer: "Yes, every plan comes with a 14-day free trial. No credit card needed.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade or downgrade at any time.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [theme, setTheme] = useState("dark");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedPlan]);

  return (
    <div className={theme === "light" ? "min-h-screen bg-gradient-to-b from-gray-50 to-white text-black" : "min-h-screen bg-gradient-to-tr from-gray-900 via-blue-900 to-gray-800 text-white"}>

      {/* Tooltip */}
      {showTooltip && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-purple-600 text-white text-sm px-5 py-2 rounded-full shadow-lg z-50"
          >
            Selected Plan: {selectedPlan}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md ${
        theme === "light" ? "bg-white/80 border-b border-gray-300" : "bg-gray-900/70 border-b border-gray-700"
      } flex items-center justify-between px-6 py-5 shadow-sm`}>
        <div className="flex flex-col text-left leading-tight">
          <span className="font-bold text-2xl">Flowly</span>
          <span className={`text-sm mt-1 ${
            theme === "light" ? "text-gray-600 font-medium" : "text-gray-400"
          }`}>
    The future of work is here
  </span>
        </div>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "light" ? (
            <FiMoon className="h-6 w-6 text-gray-800" />
          ) : (
            <FiSun className="h-6 w-6 text-yellow-400" />
          )}
        </button>
      </header>

      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-bold mb-4">Flexible plans that grow with your business</motion.h1>
          <p className={`mb-10 ${
            theme === "light" ? "text-gray-600 font-medium" : "text-gray-400"
          }`}>
            Start free. Upgrade anytime. No credit card needed.
          </p>


          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-full shadow-inner">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  billingCycle === "monthly" ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  billingCycle === "yearly" ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: plan.popular ? 0.2 : 0 }}
                className={`relative rounded-3xl p-8 shadow-xl transition backdrop-blur-md ${
                  theme === "light" ? "bg-white/90 border border-gray-200" : "bg-white/10 border border-blue-700"
                } ${
                  plan.popular ? "ring-2 ring-blue-400" : ""
                } ${
                  selectedPlan === plan.title ? "ring-4 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <p className="text-3xl font-extrabold mb-6">
                  {billingCycle === "monthly" ? plan.monthly : plan.yearly}
                </p>
                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.title)}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    theme === "light" ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-purple-600 to-blue-600"
                  } hover:shadow-lg hover:shadow-purple-400/50 text-white`}
                >
                  {selectedPlan === plan.title ? "Selected" : "Start Free Trial"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-left max-w-4xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</motion.h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`p-6 rounded-xl ${
                    theme === "light" ? "bg-white/80" : "bg-white/10"
                  } backdrop-blur-md`}
                >
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
