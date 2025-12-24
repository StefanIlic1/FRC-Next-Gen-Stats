import { TBAMatch } from '.././types';

export default function StatsDisplay({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const getRecords = (matches: TBAMatch[]) => {
    let all = [0, 0, 0];
    let quals = [0, 0, 0];
    let playoffs = [0, 0, 0];

    let offseasonAll = [0, 0, 0];
    let offseasonQuals = [0, 0, 0];
    let offseasonPlayoffs = [0, 0, 0];

    matches.forEach(match => {
        const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
        const won = (isRedAlliance && match.winning_alliance === 'red') || (!isRedAlliance && match.winning_alliance === 'blue');
        const broken = match.alliances.red.score === -1 && match.alliances.blue.score === -1;
        const tied = match.winning_alliance === '' && !broken;
        const isQual = match.comp_level === 'qm';
        const isOfficial = match.official;

        if (isOfficial) {
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
        } else {
          if (isQual) {
            if (won) {
              offseasonQuals[0] += 1;
              offseasonAll[0] += 1;
            } else if (tied) {
              offseasonQuals[2] += 1;
              offseasonAll[2] += 1;
            } else if (!broken) {
              offseasonQuals[1] += 1;
              offseasonAll[1] += 1;
            }
          } else {
            if (won) {
              offseasonPlayoffs[0] += 1;
              offseasonAll[0] += 1;
            } else if (tied) {
              offseasonPlayoffs[2] += 1;
              offseasonAll[2] += 1;
            } else if (!broken) {
              offseasonPlayoffs[1] += 1;
              offseasonAll[1] += 1;
            }
          }
        }
    });

    let allMatches = [all[0] + offseasonAll[0], all[1] + offseasonAll[1], all[2] + offseasonAll[2]];
    let allQualMatches = [quals[0] + offseasonQuals[0], quals[1] + offseasonQuals[1], quals[2] + offseasonQuals[2]];
    let allPlayoffMatches = [playoffs[0] + offseasonPlayoffs[0], playoffs[1] + offseasonPlayoffs[1], playoffs[2] + offseasonPlayoffs[2]];

    return new Map<string, number[]>([
      ['Cumulative Match Record', allMatches],
      ['Qual Match Record', allQualMatches],
      ['Playoff Match Record', allPlayoffMatches],
      ['Official Match Record', all],
      ['Official Qual Match Record', quals],
      ['Official Playoff Match Record', playoffs],
      ['Offseason Cumulative Match Record', offseasonAll],
      ['Offseason Qual Match Record', offseasonQuals],
      ['Offseason Playoff Match Record', offseasonPlayoffs],
    ]);

  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg text-sky-300">All Matches</h2>
      <div className="bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Cumulative</h3>
        <p className="text-2xl font-bold text-blue-700">{getRecords(matches).get('Cumulative Match Record')?.join('-')}</p>
      </div>
      <div className="bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Quals</h3>
        <p className="text-2xl font-bold text-blue-700">{getRecords(matches).get('Qual Match Record')?.join('-')}</p>
      </div>
      <div className="bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Playoffs</h3>
        <p className="text-2xl font-bold text-blue-700">{getRecords(matches).get('Playoff Match Record')?.join('-')}</p>
      </div>
      </div>
      
      <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg text-green-300">Official Matches</h2>
      <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Cumulative</h3>
        <p className="text-2xl font-bold text-green-700">{getRecords(matches).get('Official Match Record')?.join('-')}</p>
      </div>
      <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Quals</h3>
        <p className="text-2xl font-bold text-green-700">{getRecords(matches).get('Official Qual Match Record')?.join('-')}</p>
      </div>
      <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Playoffs</h3>
        <p className="text-2xl font-bold text-green-700">{getRecords(matches).get('Official Playoff Match Record')?.join('-')}</p>
      </div>
      </div>
      
      <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg text-orange-300">Offseason Matches</h2>
      <div className="bg-orange-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Cumulative</h3>
        <p className="text-2xl font-bold text-orange-700">{getRecords(matches).get('Offseason Cumulative Match Record')?.join('-')}</p>
      </div>
      <div className="bg-orange-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Quals</h3>
        <p className="text-2xl font-bold text-orange-700">{getRecords(matches).get('Offseason Qual Match Record')?.join('-')}</p>
      </div>
      <div className="bg-orange-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 mb-2">Playoffs</h3>
        <p className="text-2xl font-bold text-orange-700">{getRecords(matches).get('Offseason Playoff Match Record')?.join('-')}</p>
      </div>
      </div>
    </div>
  );
}