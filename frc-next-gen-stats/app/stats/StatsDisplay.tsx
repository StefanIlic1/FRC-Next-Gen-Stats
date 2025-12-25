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

  const getMeanScore = (matches: TBAMatch[]) => {
    let totalScore = 0;
    let matchCount = 0;
    matches.forEach(match => {
      const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
      const score = isRedAlliance ? match.alliances.red.score : match.alliances.blue.score;
      // exclude red card matches and broken matches
      if (score > 0) {
        totalScore += score;
        matchCount += 1;
      }
    });

    return matchCount === 0 ? 0 : totalScore / matchCount;

  };

  const getFiveNumberSummary = (matches: TBAMatch[]) => {
    const scores: number[] = [];
    matches.forEach(match => {
      const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
      const score = isRedAlliance ? match.alliances.red.score : match.alliances.blue.score;
      // exclude red card matches and broken matches
      if (score > 0) {
        scores.push(score);
      }
    });

    // get five number summary (min, 25th percentile, median, 75th percentile, max)
    scores.sort((a, b) => a - b);
    const min = scores[0] || 0;
    const max = scores[scores.length - 1] || 0;
    const median = scores.length % 2 === 0 ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2 : scores[Math.floor(scores.length / 2)];
    const q1 = scores.length >= 4 ? (scores[Math.floor(scores.length / 4) - 1] + scores[Math.floor(scores.length / 4)]) / 2 : min;
    const q3 = scores.length >= 4 ? (scores[Math.floor((3 * scores.length) / 4) - 1] + scores[Math.floor((3 * scores.length) / 4)]) / 2 : max;

    return { min, q1, median, q3, max };
  }

  return (
    <div>
    <div className="bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4 w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Alliance Score - Official Matches</h3>
      <p className="text-2xl font-bold text-blue-700">{getMeanScore(matches.filter(match => match.official)).toFixed(2)}</p>
    </div>

    <div className="bg-sky-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-8 w-full max-w-full overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Scoring Summary - Official Matches</h3>
      <div className="flex gap-4 sm:gap-6 md:gap-10 min-w-max sm:min-w-0">
      <div>
        <p className="text-sm text-gray-700 mb-1">Min</p>
        <p className="text-2xl font-bold text-blue-700">{getFiveNumberSummary(matches.filter(match => match.official)).min}</p>
      </div>
      <div>
        <p className="text-sm text-gray-700 mb-1">25th</p>
        <p className="text-2xl font-bold text-blue-700">{getFiveNumberSummary(matches.filter(match => match.official)).q1}</p>
      </div>
      <div>
        <p className="text-sm text-gray-700 mb-1">Median</p>
        <p className="text-2xl font-bold text-blue-700">{getFiveNumberSummary(matches.filter(match => match.official)).median}</p>
      </div>
      <div>
        <p className="text-sm text-gray-700 mb-1">75th</p>
        <p className="text-2xl font-bold text-blue-700">{getFiveNumberSummary(matches.filter(match => match.official)).q3}</p>
      </div>
      <div>
        <p className="text-sm text-gray-700 mb-1">Max</p>
        <p className="text-2xl font-bold text-blue-700">{getFiveNumberSummary(matches.filter(match => match.official)).max}</p>
      </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
    </div>
  );
}