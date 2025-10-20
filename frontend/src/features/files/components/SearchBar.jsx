import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, showSearchBar, toggleSearchBar, onSearch, isSearching }) {
  return (
    <div className={`px-3 sm:px-6 pb-3 sm:pb-5 ${showSearchBar ? 'border-b border-gray-200' : ''}`}>
      <form
        onSubmit={onSearch}
        className={`flex flex-col sm:flex-row gap-2 transition-all duration-300 ease-in-out overflow-hidden ${
          showSearchBar ? 'max-h-32 sm:max-h-20 opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher..."
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Search className="w-4 h-4" />
          <span>{isSearching ? 'Recherche...' : 'Rechercher'}</span>
        </button>
      </form>
    </div>
  );
}