import { ArrowRight } from 'lucide-react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

const WelcomeBanner = ({ userId, onViewActivity }) => {
  const { userInfo } = useUserInfo(userId);
  const userName = userInfo?.name?.split(' ')[0] || 'there'; // Premier prénom seulement

  return (
    <div className="bg-gradient-to-r from-[#3B82F6] to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-blue-100">
            You have 3 new shared files and 2 file requests pending.
          </p>
        </div>
        <button 
          onClick={onViewActivity}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg 
            text-sm font-medium transition flex items-center space-x-2"
        >
          <span>View Activity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;