export default function Contact() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-12  min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          Got questions or feedback? We’d love to hear from you.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows={5}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </main>
    </>
  );
}
