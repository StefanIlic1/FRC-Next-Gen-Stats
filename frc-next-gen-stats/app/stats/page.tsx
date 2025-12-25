import TeamSearchBar from './TeamSearchBar';

export default function Stats() {
  return (
    <div className="min-h-screen bg-blue-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-400 mb-4">
            FRC Team Statistics
          </h1>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-sky-300 px-6 text-blue-950 transition-colors hover:bg-gray-200 mb-6"
            href="/"
          >
            ← Home
          </a>
        </div>

        <TeamSearchBar />

        <div className="mt-8 bg-blue-900 border border-sky-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-sky-300 mb-3">
            Welcome to Team Stats
          </h2>
          <p className="text-gray-300 mb-2">
            Enter a team number above to view their 2025 season statistics, match history, and performance analytics.
          </p>
          <p className="text-gray-400 text-sm">
            Example: Try searching for team 3061, 254, or 1114
          </p>
        </div>
      </div>
    </div>
  );
}
