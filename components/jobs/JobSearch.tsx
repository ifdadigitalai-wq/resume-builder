'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Briefcase, Globe, X } from 'lucide-react';

interface JobSearchProps {
  onSearch: (filters: {
    query: string;
    location: string;
    experience: string;
    workmode: string;
  }) => void;
  isLoading?: boolean;
}

export function JobSearch({ onSearch, isLoading = false }: JobSearchProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [workmode, setWorkmode] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, location, experience, workmode });
  };

  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setExperience('');
    setWorkmode('');
    onSearch({ query: '', location: '', experience: '', workmode: '' });
  };

  const hasActiveFilters = query || location || experience || workmode;

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-white/80 backdrop-blur-md border border-[#CFE0F7] rounded-2xl p-5 shadow-sm space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Keyword Search Input */}
        <div className="md:col-span-4 relative flex flex-col justify-end">
          <Input
            label="Job Title / Keyword"
            placeholder="Search React, Node, Python, Design..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-[34px] h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Location Search Input */}
        <div className="md:col-span-3 relative flex flex-col justify-end">
          <Input
            label="Location"
            placeholder="Bangalore, Remote, Delhi..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
          <MapPin className="absolute left-3 top-[34px] h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Experience Select */}
        <div className="md:col-span-2 relative">
          <Select
            label="Experience"
            placeholder="All Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            options={[
              { value: 'freshers', label: 'Freshers (0-2 yrs)' },
              { value: 'mid', label: 'Mid-Level (3-5 yrs)' },
              { value: 'senior', label: 'Senior (5+ yrs)' },
            ]}
          />
        </div>

        {/* Work Mode Select */}
        <div className="md:col-span-2 relative">
          <Select
            label="Job Mode"
            placeholder="All Modes"
            value={workmode}
            onChange={(e) => setWorkmode(e.target.value)}
            options={[
              { value: 'remote', label: 'Remote' },
              { value: 'onsite', label: 'On-site' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />
        </div>

        {/* Submit Actions */}
        <div className="md:col-span-1 flex items-end min-h-[40px]">
          <Button
            type="submit"
            loading={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 flex items-center justify-center font-bold"
          >
            {!isLoading && <Search className="h-4 w-4 shrink-0" />}
            <span>Go</span>
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-semibold">Active search filters</span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Reset filters
          </button>
        </div>
      )}
    </form>
  );
}
