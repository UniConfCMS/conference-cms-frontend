import React, { useState } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";

const faqItems = [
  {
    question: "What is Newspaper Group Space?",
    answer:
      "Newspaper Group Space is a platform where you can find the freshest news and newspapers from schools in your city.",
  },
  {
    question: "How often is the news updated?",
    answer:
      "We update our news daily to keep you informed about all the latest school events and announcements.",
  },
  {
    question: "Can I submit news from my school?",
    answer:
      "Yes! Schools can contact us to submit their news and have it published on our platform.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Currently, we do not have a mobile app, but our website is fully responsive and works great on any device.",
  },
];

export const FAQView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <DefaultLayout>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#1a1a26] rounded-lg p-6 cursor-pointer select-none"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">{item.question}</h2>
                <span className="text-white text-2xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-4 text-gray-400">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </DefaultLayout>
  );
};
