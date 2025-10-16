import { Bell, Grid3x3, UserPlus } from 'lucide-react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

const Topbar = () => {
  const { userInfo } = useUserInfo();
  const userName = userInfo?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 
      flex items-center justify-between px-6">
      
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-xs text-[#999999] mt-0.5">
          Welcome back, {userName}!
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        
        {/* Invite Button */}
        <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm 
          font-medium hover:bg-blue-600 transition flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Invite People</span>
        </button>
        
        {/* All Apps */}
        <button className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition 
          flex items-center justify-center text-[#666666]">
          <Grid3x3 className="w-5 h-5" />
        </button>
        
        {/* Notifications */}
        <button className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition 
          flex items-center justify-center text-[#666666] relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] 
          to-blue-600 flex items-center justify-center text-white font-medium 
          cursor-pointer hover:shadow-lg transition">
          {userInitial}
        </div>
      </div>
    </header>
  );
};

export default Topbar;