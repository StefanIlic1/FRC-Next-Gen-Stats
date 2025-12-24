import { TBAMatch } from '.././types';

export default function StatsDisplay({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const getRecord = (matches: TBAMatch[]) => {
    let wins = 0;
    let losses = 0;
    let ties = 0;
    matches.forEach(match => {
        const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
        const won = (isRedAlliance && match.winning_alliance === 'red') || (!isRedAlliance && match.winning_alliance === 'blue');
        const broken = match.alliances.red.score === -1 && match.alliances.blue.score === -1;
        const tied = match.winning_alliance === '' && !broken;
        if (won) {
          wins++;
        } else if (tied) {
          ties++;
        } else if (!broken) {
          losses++;
        }
    });
    return `${wins}-${losses}-${ties}`;
  };

  return (
    <div className="overflow-x-auto">
      <p>Record: {getRecord(matches)}</p>

    </div>
  );
}