"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <div className={theme === "light" ? "min-h-screen bg-gray-100 text-black py-12 px-6" : "min-h-screen bg-gradient-to-tr from-gray-900 via-blue-900 to-gray-800 text-white py-12 px-6"}>
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Flexible plans that grow with your business</h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="border rounded-full px-4 py-2 text-sm font-semibold hover:scale-105 transition"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <p className="text-gray-400 mb-10">Start free. Upgrade anytime. No credit card needed.</p>

        <div className="flex justify-center mb-12">
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            {billingCycle === "monthly" ? "Switch to Yearly Billing" : "Switch to Monthly Billing"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              whileHover={{ scale: 1.05 }}
              className={`relative rounded-3xl p-8 shadow-xl transition backdrop-blur-md ${
                theme === "light" ? "bg-white/80 border border-gray-300" : "bg-white/10 border border-blue-700"
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
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-semibold">
                Start Free Trial
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-left max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className={`p-6 rounded-xl ${
                theme === "light" ? "bg-white/70" : "bg-white/10"
              } backdrop-blur-md`}>
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
