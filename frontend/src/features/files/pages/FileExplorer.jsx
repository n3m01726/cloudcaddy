// pages/FileExplorer.jsx
// Page qui appelle le composant FileExplorer
import FileExplorer from '../components/FileExplorer';

function FileExplorerPage({ userId }) {
  return (
    <div className="max-w-7xl mx-auto">
      <FileExplorer userId={userId} />
    </div>
  );
}

export default FileExplorerPage;