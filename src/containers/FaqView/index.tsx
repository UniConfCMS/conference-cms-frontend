import React, { useState } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";

const faqItems = [
  {
    question: "What is the University Consortium Conference CMS?",
    answer:
      "The University Consortium Conference CMS is a platform designed to streamline the creation and management of websites for the annual Animal Science Days conference hosted by a consortium of universities.",
  },
  {
    question: "Who can use the CMS?",
    answer:
      "The CMS supports three roles: Anonymous users (public access), Editors (content management), and Administrators (full system control).",
  },
  {
    question: "How do I access the CMS?",
    answer:
      "Anonymous users can visit the public website. Editors and Administrators log in via a secure form with provided credentials.",
  },
  {
    question: "What can Editors do in the CMS?",
    answer:
      "Editors can add, remove, or edit subpages for their assigned conference edition and upload files (.doc, .docx, .pdf).",
  },
  {
    question: "What can Administrators do in the CMS?",
    answer:
      "Administrators can create conference editions, manage users, assign editors, and add, edit, or remove subpages.",
  },
  {
    question: "What types of files can be uploaded to the CMS?",
    answer:
      "The CMS supports .doc, .docx, and .pdf file uploads, which can be linked to subpages.",
  },
  {
    question: "Does the CMS support multiple languages?",
    answer:
      "Yes, the CMS supports multilingual content for creating and managing subpages in different languages.",
  },
  {
    question: "What is the WYSIWYG editor, and what can it do?",
    answer:
      "The WYSIWYG editor allows text formatting, image uploads, and insertion of links and tables without coding knowledge.",
  },
  {
    question: "Is the CMS mobile-friendly?",
    answer:
      "Yes, the CMS is fully responsive, ensuring usability on desktops, tablets, and mobile devices.",
  },
  {
    question: "Why was this CMS created?",
    answer:
      "The CMS eliminates the need to create new websites annually for the same conference, providing a unified platform for all consortium universities.",
  },
  {
    question: "Can I customize the look of the conference website?",
    answer:
      "Yes, the CMS uses customizable, publicly available templates (e.g., MIT-licensed) to match the conference’s branding.",
  },
  {
    question: "How is the CMS hosted?",
    answer:
      "The CMS has a separated frontend and backend. If not built in PHP, a compatible hosting provider (e.g., Namecheap for Python) is provided.",
  },
  {
    question: "How secure is the CMS?",
    answer:
      "The CMS uses secure logins and role-based access control to protect user data and system functions.",
  },
  {
    question: "Can I access previous conference editions?",
    answer:
      "Yes, past editions are archived for public viewing and administrative management.",
  },
  {
    question: "How do I get started as an Editor or Administrator?",
    answer:
      "Contact the consortium’s administrator for credentials and assignment to a conference edition or system role.",
  },
  {
    question: "Is there a mobile app for the CMS?",
    answer:
      "No mobile app is available, but the CMS is accessible via web browsers on all devices.",
  },
  {
    question: "Who do I contact for technical support?",
    answer:
      "Contact the consortium’s IT administrator or the hosting provider’s support team for assistance.",
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