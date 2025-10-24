// frontend/src/features/files/components/SelectionHeader.jsx
import { Check, Square } from 'lucide-react';
import { useSelection } from '../context/SelectionContext';

const SelectionHeader = ({ files }) => {
  const { selectedCount, selectAll, clearSelection, isSelectionMode } = useSelection();
  
  const allFileIds = files.map(file => file.id);
  const isAllSelected = selectedCount === files.length && files.length > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < files.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(allFileIds);
    }
  };

  return (
    <thead className="bg-gray-50 border-b">
      <tr>
        {/* Select All Checkbox */}
        <th className="px-4 py-3 w-12">
          <div className="flex items-center justify-center">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                className="sr-only peer"
              />
              <div className={`
                w-5 h-5 border-2 rounded transition-all
                ${isAllSelected || isPartiallySelected
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 hover:border-blue-400'}
                flex items-center justify-center
              `}>
                {isAllSelected && <Check size={14} className="text-white" />}
                {isPartiallySelected && !isAllSelected && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
            </label>
          </div>
        </th>

        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Nom
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Taille
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Modifié
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default SelectionHeader;