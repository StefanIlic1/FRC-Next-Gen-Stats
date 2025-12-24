'use client';

import { useState } from 'react';
import { TBAMatch } from '.././types';
import MatchesTable from './MatchesTable';

export default function MatchesSection({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const [includeOffseason, setIncludeOffseason] = useState(true);

  return (
    <div className="bg-blue-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-sky-300">
          Matches
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-white text-sm">Include Offseason Matches</span>
          <button
            onClick={() => setIncludeOffseason(!includeOffseason)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
              includeOffseason ? 'bg-sky-500' : 'bg-gray-400'
            }`}
            aria-label="Toggle offseason matches"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                includeOffseason ? 'transform translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>
      <MatchesTable team_key={team_key} matches={matches} />
    </div>
  );
}
