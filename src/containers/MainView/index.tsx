import React, { useState, useEffect } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import { Conference } from "../../interfaces/Conference";
import logoImage from "../../assets/asd.svg";
import { Wysiwyg } from "../../components/Wyswig";

const testimonials = [
  {
    id: 1,
    name: "Anna Petrova",
    role: "Conference Organizer",
    text: "Perfect platform for managing and showcasing our academic conferences.",
    avatar: "https://i.pravatar.cc/50?img=12"
  },
  {
    id: 2,
    name: "Ivan Sidorov",
    role: "Researcher",
    text: "I discover amazing conferences here. Great way to stay connected with academic community!",
    avatar: "https://i.pravatar.cc/50?img=5"
  },
  {
    id: 3,
    name: "Olga Kuznetsova",
    role: "Academic",
    text: "Thanks to Conference Group, I never miss important academic events and conferences.",
    avatar: "https://i.pravatar.cc/50?img=9"
  },
];

export const MainView = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConferences = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/conferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Conference[] = await response.json();
      setConferences(data.slice(0, 3)); // Show only first 3 conferences on main page
      setError(null);
    } catch (err) {
      console.error('Error loading conferences:', err);
      setError('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome section with logo */}

        <section className="text-center bg-[#1a1a26] rounded-lg px-8 py-12 mb-16">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="Conference Group Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-4xl mb-4">
              Welcome to -{" "}
              <span className="text-blue-600 font-semibold">UniConf Conference</span> space
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl">
              Discover and connect with the latest academic conferences and research events.
              Stay updated with cutting-edge research presentations and networking opportunities!
            </p>
          </div>
        </section>

        {/* About section */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#1a1a26] rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              We connect researchers, academics, and professionals through comprehensive conference discovery. Our platform serves as a central hub for academic events, research presentations, and professional networking opportunities worldwide.
            </p>
          </div>
          <div className="bg-[#1a1a26] rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Why Choose Us</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Comprehensive conference database</li>
              <li>• Real-time updates on new events</li>
              <li>• Easy search and filtering options</li>
              <li>• Detailed conference information</li>
            </ul>
          </div>
        </section>

        {/* Latest Conferences section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-white">Latest Conferences</h2>
            <button
              onClick={() => navigate('/conferences')}
              className="text-blue-500 hover:text-blue-400 transition"
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-xl text-gray-400">Loading conferences...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={fetchConferences}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
              >
                Try again
              </button>
            </div>
          ) : conferences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No conferences found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferences.map((conference: Conference) => (
                <article
                  key={conference.id}
                  onClick={() => navigate(`/newspaper/${conference.id}`)}
                  className="bg-[#1a1a26] rounded-lg p-6 shadow-md shadow-black/50 hover:bg-[#2a2a40] transition cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-blue-500 mb-2">
                    {conference.title || 'No title'}
                  </h3>
                  <time className="text-gray-500 text-sm mb-2 block">
                    {conference.created_at 
                      ? new Date(conference.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'No date'
                    }
                  </time>
                  <p className="text-gray-300">Conference Year: {conference.year}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Features section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H19V4h-1V2H6v2H5v2H3.5C2.67 6 2 6.67 2 7.5S2.67 9 3.5 9H5v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9h1.5c.83 0 1.5-.67 1.5-1.5S20.33 6 19.5 6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Events</h3>
              <p className="text-gray-400">Curated and verified academic conferences and research events</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zM19 19H5V8h14v11z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Timely Updates</h3>
              <p className="text-gray-400">Stay informed with the latest conference announcements and deadlines</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 8H16c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v5h2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-400">Connect with researchers and academics from around the world</p>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-[#1a1a26] rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe section */}
        <section className="bg-[#1a1a26] rounded-lg p-8 mx-auto w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-4">Subscribe for Updates</h2>
            <p className="text-gray-400">
              Get the latest conference announcements and research event notifications straight to your inbox.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded bg-[#2a2a40] border border-gray-600 focus:outline-none focus:border-blue-600 text-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition font-semibold"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </DefaultLayout>
  );
};