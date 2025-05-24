import Image from "next/image";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white text-gray-800 p-6">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Astrology Consultation</h1>
        <p className="text-xl mb-6">Connect with our expert astrologer. First 5 people get live chat access.</p>
        <a
          href="/join"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700"
        >
          Join the Queue
        </a>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">About the Astrologer</h2>
        <p>
          With 15+ years of experience in Vedic astrology, our expert provides guidance on career, love, health,
          and spiritual growth.
        </p>
      </section>

      {/* Services */}
      <section className="max-w-3xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Personal Horoscope Analysis</li>
          <li>Career and Business Advice</li>
          <li>Relationship and Compatibility</li>
          <li>Health and Wellness Guidance</li>
        </ul>
      </section>
    </main>
  );
}

