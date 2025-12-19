import MatchesTable from './MatchesTable';

// TBA API Types
interface TBAEvent {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  start_date: string;
  end_date: string;
  year: number;
  city: string;
  state_prov: string;
  country: string;
}

interface TBAMatch {
  key: string;
  comp_level: string;
  set_number: number;
  match_number: number;
  time: number;
  alliances: {
    red: {
      score: number;
      team_keys: string[];
    };
    blue: {
      score: number;
      team_keys: string[];
    };
  };
  winning_alliance: string;
  event_key: string;
  event_name: string;
  real_time: string;
}

// Helper function to fetch from TBA API
async function fetchTBA(endpoint: string) {
  const apiKey = process.env.TBA_API_KEY;

  if (!apiKey) {
    throw new Error('TBA_API_KEY is not configured. Please add your API key to .env.local');
  }

  const response = await fetch(`https://www.thebluealliance.com/api/v3${endpoint}`, {
    headers: {
      'X-TBA-Auth-Key': apiKey,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TBA API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch team events and their matches
async function getTeamMatches(teamNumber: number, year: number): Promise<TBAMatch[]> {
  const teamKey = `frc${teamNumber}`;

  // Fetch all team matches for the year in one call
  const matches: TBAMatch[] = (await fetchTBA(`/team/${teamKey}/matches/${year}`)).map((match: { time: number; }) => ({
    ...match,
    real_time: new Date(match.time * 1000).toLocaleString()
  }));

  // Sort matches by time
  matches.sort((a, b) => a.time - b.time);

  return matches;
}

export default async function Stats() {
  let error: string | null = null;
  let matches: TBAMatch[] = [];

  try {
    matches = await getTeamMatches(3061, 2025);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data from TBA API';
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-400 mb-4">
            Team 3061 - 2025 Season Stats
          </h1>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-sky-300 px-6 text-blue-950 transition-colors hover:bg-gray-200"
            href="/"
          >
            ← Home
          </a>
        </div>

        {error ? (
          <div className="bg-red-900 border border-red-500 text-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Make sure you have set your TBA API key in the .env.local file.
              You can get an API key from{' '}
              <a
                href="https://www.thebluealliance.com/account"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                The Blue Alliance Account Dashboard
              </a>
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-yellow-900 border border-yellow-500 text-white p-4 rounded-lg">
            <p>No matches found for Team 3061 in 2025.</p>
          </div>
        ) : (
          <div className="bg-blue-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-sky-300 mb-4">
              All Matches ({matches.length})
            </h2>
            <MatchesTable team_key="frc3061" matches={matches} />
          </div>
        )}
      </div>
    </div>
  );
}
