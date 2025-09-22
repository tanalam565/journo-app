import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Awesome App!</h1>
      <p className="text-lg text-grey-600">
        Welcome! This will vbecome our social media platform for news and discussions.
      </p>

      {/* Button to Profile Page*/}
      <Link
        href = "/profile"
        className = "px - 6 py - 3 bg-blue-600 text-white rounded - lg hover:bg-blue-700 transition"
      >
        Go to profile
      </Link>
    </main>
  );
}
