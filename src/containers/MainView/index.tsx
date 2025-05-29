import React from "react";
import { DefaultLayout } from "../../components/DefaultLayout";

const newsData = [
  {
    id: 1,
    title: "School Science Fair Announced",
    date: "May 20, 2025",
    summary: "Join us for the annual science fair where students showcase amazing projects."
  },
  {
    id: 2,
    title: "New Library Books Arrived",
    date: "May 18, 2025",
    summary: "Our school library has received a fresh batch of books. Come check them out!"
  },
  {
    id: 3,
    title: "Spring Sports Day Highlights",
    date: "May 15, 2025",
    summary: "A recap of the exciting sports day event held last weekend."
  }
];

const testimonials = [
  {
    id: 1,
    name: "Anna Petrova",
    role: "Teacher",
    text: "Great platform! Now our school news reaches all students instantly.",
    avatar: "https://i.pravatar.cc/50?img=12"
  },
  {
    id: 2,
    name: "Ivan Sidorov",
    role: "Student",
    text: "I love reading the latest school papers here. Very convenient and stylish!",
    avatar: "https://i.pravatar.cc/50?img=5"
  },
  {
    id: 3,
    name: "Olga Kuznetsova",
    role: "Parent",
    text: "Thanks to Newspaper Group space, I always stay updated on school events.",
    avatar: "https://i.pravatar.cc/50?img=9"
  },
];

export const MainView = () => {
  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Приветственный блок */}
        <section className="text-start bg-[#1a1a26] rounded-lg px-8 py-8 mb-16">
          <h1 className="text-3xl mb-4">
            Welcome to -{" "}
            <span className="text-blue-600 font-semibold">Newspaper Group</span> space
          </h1>
          <p className="text-base text-gray-400 max-w-2xl pb-10">
            Here you will find the freshest news and newspapers from schools in your city.
            Stay updated to always be in the loop with school life!
          </p>
        </section>

        {/* Карточки */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1a1a26] rounded-lg shadow-md shadow-black/50 p-6 hover:bg-[#2a2a40] transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-3 text-white">News</h2>
            <p className="text-gray-300 mb-4">
              The latest school news and events from your area.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Go to News
            </button>
          </div>

          <div className="bg-[#1a1a26] rounded-lg shadow-md shadow-black/50 p-6 hover:bg-[#2a2a40] transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-3 text-white">Newspapers</h2>
            <p className="text-gray-300 mb-4">
              Browse and download school newspapers and announcements.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              View Newspapers
            </button>
          </div>

          <div className="bg-[#1a1a26] rounded-lg shadow-md shadow-black/50 p-6 hover:bg-[#2a2a40] transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-3 text-white">Contacts</h2>
            <p className="text-gray-300 mb-4">
              Get in touch with administration and editorial team.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Contact Us
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Latest News</h2>
          <div className="space-y-6">
            {newsData.map(({ id, title, date, summary }) => (
              <article key={id} className="bg-[#1a1a26] rounded-lg p-6 shadow-md shadow-black/50 hover:bg-[#2a2a40] transition cursor-pointer">
                <h3 className="text-xl font-semibold text-blue-500 mb-2">{title}</h3>
                <time className="text-gray-500 text-sm mb-2 block">{date}</time>
                <p className="text-gray-300">{summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1a1a26] rounded-lg p-8 mx-auto w-full">
          <h2 className="text-xl font-semibold mb-4">Subscribe for Updates</h2>
          <p className="text-gray-400 mb-6">
            Get the latest school news and newspapers straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded bg-[#2a2a40] border border-gray-600 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </DefaultLayout>
  );
};
