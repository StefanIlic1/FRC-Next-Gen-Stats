'use client';

import { useState } from 'react';
import { TBAMatch } from '.././types';

type SortField = 'time' | 'score';
type SortDirection = 'asc' | 'desc';

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

export default function MatchesTable({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for score, ascending for time
      setSortField(field);
      setSortDirection(field === 'score' ? 'desc' : 'asc');
    }
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortField === 'time') {
      return sortDirection === 'asc' ? a.time - b.time : b.time - a.time;
    } else {
      // Sort by team's alliance score
      const isRedA = a.alliances.red.team_keys.includes(`${team_key}`);
      const isRedB = b.alliances.red.team_keys.includes(`${team_key}`);
      const scoreA = isRedA ? a.alliances.red.score : a.alliances.blue.score;
      const scoreB = isRedB ? b.alliances.red.score : b.alliances.blue.score;
      return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-500 ml-1">⇅</span>;
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-sky-600">
            <th
              className="p-3 font-semibold text-sky-300 cursor-pointer hover:bg-blue-800 select-none"
              onClick={() => handleSort('time')}
            >
              Date/Time <SortIcon field="time" />
            </th>
            <th className="p-3 font-semibold text-sky-300">Event</th>
            <th className="p-3 font-semibold text-sky-300">Match</th>
            <th className="p-3 font-semibold text-sky-300">Level</th>
            <th className="p-3 font-semibold text-sky-300">Red Alliance</th>
            <th className="p-3 font-semibold text-sky-300">Blue Alliance</th>
            <th className="p-3 font-semibold text-sky-300">Full Score</th>
            <th
              className="p-3 font-semibold text-sky-300 cursor-pointer hover:bg-blue-800 select-none"
              onClick={() => handleSort('score')}
            >
              Alliance Score <SortIcon field="score" />
            </th>
            <th className="p-3 font-semibold text-sky-300">Result</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((match) => {
            const isRedAlliance = match.alliances.red.team_keys.includes(`${team_key}`);
            const won = (isRedAlliance && match.winning_alliance === 'red') ||
                       (!isRedAlliance && match.winning_alliance === 'blue');
            const teamScore = isRedAlliance ? match.alliances.red.score : match.alliances.blue.score;

            // in case of unplayed finals matches with scores of -1 to -1
            if (match.alliances.red.score === -1 && match.alliances.blue.score === -1) { 
              return null;
            }

            return (
              <tr key={match.key} className="border-b border-blue-800 hover:bg-blue-800">
                <td className="p-3">
                  {match.time ? (
                    <>
                      <div>{new Date(match.time * 1000).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(match.time * 1000).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">TBD</span>
                  )}
                </td>
                <td className="p-3 text-sm">{match.event_name}</td>
                <td className="p-3">
                  {['qf', 'sf', 'f'].includes(match.comp_level)
                  ? `${match.set_number}-${match.match_number}`
                  : match.match_number}
                </td>
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
                <td className={`p-3 font-bold ${isRedAlliance ? 'text-red-400' : 'text-blue-400'}`}>
                  {teamScore}
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
  );
}
