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
}

interface EventWithMatches {
  event: TBAEvent;
  matches: TBAMatch[];
}

// Helper function to fetch from TBA API
async function fetchTBA(endpoint: string) {
  const apiKey = process.env.TBA_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
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
async function getTeamEventsWithMatches(teamNumber: number, year: number): Promise<EventWithMatches[]> {
  const teamKey = `frc${teamNumber}`;

  // Fetch team's events for the year
  const events: TBAEvent[] = await fetchTBA(`/team/${teamKey}/events/${year}`);

  // Fetch matches for each event
  const eventsWithMatches = await Promise.all(
    events.map(async (event) => {
      try {
        const allMatches: TBAMatch[] = await fetchTBA(`/event/${event.key}/matches`);
        // Filter matches where team 3061 participated
        const teamMatches = allMatches.filter(match =>
          match.alliances.red.team_keys.includes(teamKey) ||
          match.alliances.blue.team_keys.includes(teamKey)
        );
        return { event, matches: teamMatches };
      } catch (error) {
        console.error(`Error fetching matches for event ${event.key}:`, error);
        return { event, matches: [] };
      }
    })
  );

  return eventsWithMatches;
}

// Match level display helper
function getMatchLevelDisplay(compLevel: string): string {
  const levels: { [key: string]: string } = {
    'qm': 'Qualification',
    'ef': 'Eighth Finals',
    'qf': 'Quarter Finals',
    'sf': 'Semi Finals',
    'f': 'Finals',
  };
  return levels[compLevel] || compLevel;
}

export default async function Stats() {
  let eventsWithMatches: EventWithMatches[] = [];
  let error: string | null = null;

  try {
    eventsWithMatches = await getTeamEventsWithMatches(3061, 2025);
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
        ) : eventsWithMatches.length === 0 ? (
          <div className="bg-yellow-900 border border-yellow-500 text-white p-4 rounded-lg">
            <p>No events found for Team 3061 in 2025.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventsWithMatches.map(({ event, matches }) => (
              <div key={event.key} className="bg-blue-900 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-sky-300 mb-2">
                    {event.name}
                  </h2>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>
                      📍 {event.city}, {event.state_prov}, {event.country}
                    </p>
                    <p>
                      📅 {new Date(event.start_date).toLocaleDateString()} -{' '}
                      {new Date(event.end_date).toLocaleDateString()}
                    </p>
                    <p>Event Code: {event.event_code}</p>
                  </div>
                </div>

                {matches.length === 0 ? (
                  <p className="text-gray-400 italic">No matches available yet for this event.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-sky-600">
                          <th className="p-3 font-semibold text-sky-300">Match</th>
                          <th className="p-3 font-semibold text-sky-300">Level</th>
                          <th className="p-3 font-semibold text-sky-300">Red Alliance</th>
                          <th className="p-3 font-semibold text-sky-300">Blue Alliance</th>
                          <th className="p-3 font-semibold text-sky-300">Score</th>
                          <th className="p-3 font-semibold text-sky-300">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map((match) => {
                          const isRedAlliance = match.alliances.red.team_keys.includes('frc3061');
                          const won = (isRedAlliance && match.winning_alliance === 'red') ||
                                     (!isRedAlliance && match.winning_alliance === 'blue');

                          return (
                            <tr key={match.key} className="border-b border-blue-800 hover:bg-blue-800">
                              <td className="p-3">{match.match_number}</td>
                              <td className="p-3">{getMatchLevelDisplay(match.comp_level)}</td>
                              <td className={`p-3 ${isRedAlliance ? 'font-bold text-red-400' : ''}`}>
                                {match.alliances.red.team_keys.map(key => key.replace('frc', '')).join(', ')}
                              </td>
                              <td className={`p-3 ${!isRedAlliance ? 'font-bold text-blue-400' : ''}`}>
                                {match.alliances.blue.team_keys.map(key => key.replace('frc', '')).join(', ')}
                              </td>
                              <td className="p-3">
                                <span className="text-red-400">{match.alliances.red.score}</span>
                                {' - '}
                                <span className="text-blue-400">{match.alliances.blue.score}</span>
                              </td>
                              <td className="p-3">
                                {match.winning_alliance === '' ? (
                                  <span className="text-gray-400">TBD</span>
                                ) : won ? (
                                  <span className="text-green-400 font-bold">✓ Win</span>
                                ) : (
                                  <span className="text-gray-400">Loss</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
