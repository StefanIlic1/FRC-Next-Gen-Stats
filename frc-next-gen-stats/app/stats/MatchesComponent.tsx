'use client';

import { useState } from 'react';
import { TBAMatch } from '.././types';
import MatchesTable from './MatchesTable';

export default function MatchesComponent({ team_key, matches }: Readonly<{ team_key: string; matches: TBAMatch[] }>) {
  const [includeOffseason, setIncludeOffseason] = useState(true);

  return (
    <div className="bg-blue-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-sky-300">
          Matches
        </h2>
        <button
          onClick={() => setIncludeOffseason(!includeOffseason)}
          className="ml-4 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Click to {includeOffseason ? "Hide" : "Show"} Offseason Events
        </button>
      </div>
      <MatchesTable team_key={team_key} matches={matches} includeOffseason={includeOffseason} />
    </div>
  );
}