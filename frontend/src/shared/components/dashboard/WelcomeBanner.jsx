import { ArrowRight, HandMetal } from 'lucide-react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

const WelcomeBanner = ({ userId, onViewActivity }) => {
  const { userInfo } = useUserInfo(userId);
  const userName = userInfo?.name?.split(' ')[0] || 'there'; // Premier prénom seulement

  return (
    <div className="bg-gradient-to-r from-[#3B82F6] to-blue-600 rounded-xl p-4 text-white">
    <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-4">
          
            <div>
                <HandMetal className='h-8 w-8'/>
            </div>
        
            <div>
                          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {userName}! 
          </h2>
                         <p className="text-blue-100">
            You have 3 new shared files and 2 file requests pending.
          </p>
            </div>
        </div>
      
        <div>
         <button 
          onClick={onViewActivity}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg 
            text-sm font-medium transition flex items-center space-x-2"
        >
          <span className='justify-self-end'>View Activity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        </div>
    </div>
</div>


  );
};

export default WelcomeBanner;