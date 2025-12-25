import MatchesTable from '../MatchesTable';
import { TBAMatch, TBAEvent } from '../../types';
import StatsDisplay from '../StatsDisplay';
import MatchesComponent from '../MatchesComponent';
import TeamSearchBar from '../TeamSearchBar';

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

  // Fetch events to get event names and types
  const events: TBAEvent[] = await fetchTBA(`/team/${teamKey}/events/${year}`);
  const eventNameMap = new Map(events.map(event => [event.key, event.name]));
  const eventTypeMap = new Map(events.map(event => [event.key, event.event_type]));

  // Fetch all team matches for the year in one call
  const matches: TBAMatch[] = (await fetchTBA(`/team/${teamKey}/matches/${year}`)).map((match: { time: number; event_key: string; }) => {
    const eventType = eventTypeMap.get(match.event_key) ?? 99;
    // Official events have event_type 0-6 (Regional, District, Championship, etc.)
    // Offseason = 99, Preseason = 100, Unlabeled = -1
    const isOfficial = eventType >= 0 && eventType < 99;

    return {
      ...match,
      real_time: new Date(match.time * 1000).toLocaleString(),
      event_name: eventNameMap.get(match.event_key) || match.event_key,
      official: isOfficial
    };
  });

  // Sort matches by time
  matches.sort((a, b) => a.time - b.time);

  return matches;
}

export default async function TeamStats({ params }: { params: Promise<{ team: string }> }) {
  const { team } = await params;
  const teamNumber = Number.parseInt(team);
  let error: string | null = null;
  let matches: TBAMatch[] = [];

  // Validate team number
  if (Number.isNaN(teamNumber) || teamNumber <= 0) {
    error = 'Invalid team number. Please enter a valid FRC team number.';
  } else {
    try {
      matches = await getTeamMatches(teamNumber, 2025);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch data from TBA API';
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-400 pt-16 mb-4">
            Team {teamNumber} - 2025 Season Stats
          </h1>
          <div className="flex gap-4 items-center mb-4">
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-sky-300 px-6 text-blue-950 transition-colors hover:bg-gray-200"
              href="/"
            >
              ← Home
            </a>
          </div>
          <TeamSearchBar currentTeam={teamNumber} />
        </div>

        {!error ? (matches.length === 0 ? (
          <div className="bg-yellow-900 border border-yellow-500 text-white p-4 rounded-lg">
            <p>No matches found for Team {teamNumber} in 2025.</p>
          </div>
        ) : (
          <div>
            <div className="bg-blue-900 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-sky-300 mb-4">
                Season Summary
              </h2>
              <StatsDisplay team_key={`frc${teamNumber}`} matches={matches} />
            </div>
            <MatchesComponent team_key={`frc${teamNumber}`} matches={matches} />
          </div>
        )) : (
          <div className="bg-red-900 border border-red-500 text-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Failed to fetch from TBA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
