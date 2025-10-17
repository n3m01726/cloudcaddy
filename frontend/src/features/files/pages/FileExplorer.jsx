// Page qui appelle le composant FileExplorer
import FileExplorer from '../components/FileExplorer';

function FileExplorerPage({ userId, filter, pageTitle }) {
  return (
    <div className="p-6"> {/* Padding pour respecter le design du dashboard */}
      <FileExplorer userId={userId} filter={filter} pageTitle="Mes fichiers"  />
    </div>
  );
}

export default FileExplorerPage;