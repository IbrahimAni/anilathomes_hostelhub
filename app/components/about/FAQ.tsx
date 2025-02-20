'use client';
import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "How do I book a hostel?",
    answer: "Simply search for your desired university location in Nigeria, browse available hostels, and follow the booking process. You'll need to create an account and can pay through various Nigerian payment methods to confirm your booking."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major Nigerian payment methods including bank transfers, USSD, local debit cards, and popular payment platforms like Paystack and Flutterwave."
  },
  {
    question: "Is inspection possible before booking?",
    answer: "Yes! We offer virtual tours for all our listings, and where possible, we can arrange physical inspections with our local agents at each university location."
  },
  {
    question: "Are bills included in the rent?",
    answer: "This varies by hostel. Most of our listings include basic utilities (NEPA bill, water), but premium services like generator subscription might be separate. Check each listing for specific details."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer full refunds if cancelled within 24 hours of booking and at least 7 days before check-in. Special considerations are given for admission-related cancellations with proper documentation."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gray-50" data-testid="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div 
                className={`px-6 py-4 bg-gray-50 transition-all duration-200 ease-in-out ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                <p className="text-gray-700" data-testid="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}