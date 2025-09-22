import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">📰 Journalism App</h1>
      <p className="text-lg text-gray-600">
        Welcome! This will become our social platform for verified news and discussions.
      </p>
    </main>
  );
}
