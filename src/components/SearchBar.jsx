import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, className = '', placeholder = "Search events..." }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
        {/* Search Icon Section */}
        <div className="flex-shrink-0">
          <Search className="text-gray-400 w-5 h-5" />
        </div>
        
        {/* Input Text Section */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-base bg-transparent"
        />
        
        {/* Clear Icon Section */}
        {query && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
