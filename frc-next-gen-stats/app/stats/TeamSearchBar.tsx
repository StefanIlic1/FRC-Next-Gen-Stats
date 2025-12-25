'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface TeamSearchBarProps {
  currentTeam?: number;
}

export default function TeamSearchBar({ currentTeam }: TeamSearchBarProps) {
  const [teamNumber, setTeamNumber] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const team = Number.parseInt(teamNumber);

    if (!Number.isNaN(team) && team > 0) {
      router.push(`/stats/${team}`);
      setTeamNumber(''); // Clear the input after navigation
    }
  };

  return (
    <div className="bg-blue-900 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <label htmlFor="team-search" className="text-sky-300 font-semibold">
          Search Team:
        </label>
        <input
          id="team-search"
          type="number"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
          placeholder={currentTeam ? `Currently viewing: ${currentTeam}` : "Enter team number..."}
          className="flex-1 max-w-xs px-4 py-2 rounded-lg bg-blue-800 border border-sky-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          min="1"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-sky-400 text-blue-950 font-semibold hover:bg-sky-300 transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}
