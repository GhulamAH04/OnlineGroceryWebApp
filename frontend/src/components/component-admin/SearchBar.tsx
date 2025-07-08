'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from 'use-debounce';

const SearchBar = ({ setSearchEvents }: any) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 1000);

  useEffect(() => {
    setSearchEvents(debouncedSearch);
  }, [debouncedSearch, setSearchEvents]);

  return (
    <div className="container mx-auto px-12">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-lg">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search Products..."
            className="py-2 px-4 rounded-xl border border-gray-300 w-full pr-10"
          />
          <FaSearch
            size={22}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
