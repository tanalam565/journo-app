import Image from "next/image";
import Link from "next/link";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Awesome App!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Welcome! This will become our social media platform for news and discussions.
        </p>

        {/* Button to Profile Page */}
        <Link
          href="/profile"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to profile
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Journo App Chatbot</h2>
        <Chat />
      </div>
    </main>
  );
}
