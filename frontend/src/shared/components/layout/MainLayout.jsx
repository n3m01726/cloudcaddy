import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <Sidebar 
        currentPath={location.pathname}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userId={userId} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    
  );
};

export default MainLayout;