import { TBAMatch } from '.././types';

export default function StatsDisplay({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const getRecords = (matches: TBAMatch[]) => {
    let all = [0, 0, 0];
    let quals = [0, 0, 0];
    let playoffs = [0, 0, 0];
    matches.forEach(match => {
        const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
        const won = (isRedAlliance && match.winning_alliance === 'red') || (!isRedAlliance && match.winning_alliance === 'blue');
        const broken = match.alliances.red.score === -1 && match.alliances.blue.score === -1;
        const tied = match.winning_alliance === '' && !broken;
        const isQual = match.comp_level === 'qm';

        if (isQual) {
          if (won) {
            quals[0] += 1;
            all[0] += 1;
          } else if (tied) {
            quals[2] += 1;
            all[2] += 1;
          } else if (!broken) {
            quals[1] += 1;
            all[1] += 1;
          }
        } else {
          if (won) {
            playoffs[0] += 1;
            all[0] += 1;
          } else if (tied) {
            playoffs[2] += 1;
            all[2] += 1;
          } else if (!broken) {
            playoffs[1] += 1;
            all[1] += 1;
          }
        }
    });
    return new Map<string, number[]>([
      ['Cumulative Match Record', all],
      ['Qualification Match Record', quals],
      ['Playoff Match Record', playoffs],
    ]);
  };

  return (
    <div className="overflow-x-auto flex gap-4 p-4">
      {Array.from(getRecords(matches)).map(([label, record]) => (
      <div key={label} className="flex flex-col items-center bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-max">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{label}</h3>
        <p className="text-2xl font-semibold text-blue-700">{record[0]}-{record[1]}-{record[2]}</p>
      </div>
      ))}
    </div>
  );
}