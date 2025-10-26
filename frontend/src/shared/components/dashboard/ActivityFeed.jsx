import { Share2, Upload, Edit3, Trash2, Star } from 'lucide-react';
import { formatDate} from "@shared/utils/formatters.js";

const ActivityFeed = ({ activities = [] }) => {
  // Mock data
  const mockActivities = [
    {
      id: 1,
      type: 'share',
      user: 'Sarah Chen',
      action: 'shared',
      target: 'Q4_Report.pdf',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: Share2,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      avatar:'../../../../public/assets/image.png',

    },
    {
      id: 2,
      type: 'upload',
      user: 'You',
      action: 'uploaded',
      target: '3 files to Work Documents',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: Upload,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      avatar: 'https://mockmind-api.uifaces.co/content/human/80.jpg'
    },
    {
      id: 3,
      type: 'edit',
      user: 'Mikaela Johnson',
      action: 'edited',
      target: 'Budget_2024.xlsx',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: Edit3,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      avatar:'../../../../public/assets/image-2.png',
    },
    {
      id: 4,
      type: 'delete',
      user: 'You',
      action: 'moved',
      target: '5 files to trash',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: Trash2,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      avatar: 'https://mockmind-api.uifaces.co/content/human/80.jpg'
    },
    {
      id: 5,
      type: 'favorite',
      user: 'You',
      action: 'added',
      target: 'Client Projects to favorites',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: Star,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      avatar: 'https://mockmind-api.uifaces.co/content/human/80.jpg',
    },
  ];

  const displayActivities = activities.length > 10 ? activities : mockActivities;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Activity</h3>
        <button className="text-sm underline underline-offset-4 text-blue-500 hover:text-blue-600">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => {
          const Icon = activity.icon;
          const Avatar = activity.avatar;
          
          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
              
            <img src={activity.avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
     
              </div>
              <div className="flex-1 min-w-0 text-left">
              <p className="text-xs text-[#999999]">
                  {formatDate(activity.time)}
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;