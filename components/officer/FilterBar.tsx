'use client';

import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface OfficerFilters {
  branch: string;
  year: string;
  score: string;
  status: string;
}

interface FilterBarProps {
  filters: OfficerFilters;
  onChange: (filters: OfficerFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = (key: keyof OfficerFilters) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, [key]: event.target.value });
  };

  return (
    <div className="grid gap-3 rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_38px_rgba(59,73,223,0.08)] md:grid-cols-5">
      <Select label="Branch" value={filters.branch} onChange={set('branch')} options={['All', 'Kalkaji', 'Badarpur'].map((value) => ({ value, label: value }))} />
      <Select label="Year" value={filters.year} onChange={set('year')} options={['All', '1st', '2nd', '3rd', '4th'].map((value) => ({ value, label: value }))} />
      <Select label="ATS Score" value={filters.score} onChange={set('score')} options={['All', 'Below 50', '50-70', 'Above 70'].map((value) => ({ value, label: value }))} />
      <Select label="Status" value={filters.status} onChange={set('status')} options={['All', 'Submitted', 'Draft', 'Not Started'].map((value) => ({ value, label: value }))} />
      <div className="flex items-end">
        <Button variant="ghost" className="w-full bg-[#DDEBFF] text-[#07111F] hover:bg-primary-DEFAULT hover:text-white" onClick={() => onChange({ branch: 'All', year: 'All', score: 'All', status: 'All' })}>Clear Filters</Button>
      </div>
    </div>
  );
}
