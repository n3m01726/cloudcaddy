import { Home, ChevronRight } from 'lucide-react';

export default function Navigation({ folderHistory, currentFolderName, onHome, onBreadcrumbClick }) {
  if (folderHistory.length === 0 && !currentFolderName) return null;

  const breadcrumbItems = [
    ...folderHistory.map((folder, index) => ({
      name: folder.name,
      index,
      isLast: false,
    })),
  ];

  if (currentFolderName) {
    breadcrumbItems.push({
      name: currentFolderName,
      index: folderHistory.length,
      isLast: true,
    });
  }

  return (
    <nav className="flex items-center px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 overflow-x-auto scrollbar-hide">
      <ol className="flex items-center text-xs sm:text-sm text-gray-600 min-w-0 flex-nowrap">
        {/* Home - Toujours visible */}
        <li className="flex-shrink-0">
          <button
            onClick={onHome}
            className="text-gray-500 hover:text-gray-700 flex items-center p-1"
            aria-label="Retour à l'accueil"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </li>

 
        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, idx) => (
  <li key={idx} className="flex items-center">
    {idx > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
    {item.isLast ? (
      <span className="font-medium text-gray-900 truncate">{item.name}</span>
    ) : (
      <button
        onClick={() => onBreadcrumbClick?.(item.index)}
        className="hover:text-gray-900 truncate"
      >
        {item.name}
      </button>
    )}
  </li>
))}
      </ol>
    </nav>
  );
}














