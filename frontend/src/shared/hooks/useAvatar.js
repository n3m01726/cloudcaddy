// src/hooks/useAvatar.js
import { useUserInfo } from './useUserInfo';

export function useAvatar(userId) {
  const { userInfo, loading, error } = useUserInfo(userId);

  const avatar =
    userInfo?.avatar ||
    userInfo?.photoURL ||
    (userInfo?.email
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userInfo.email)}`
      : '/images/avatar-placeholder.png');

  return { avatar, loading, error };
}
