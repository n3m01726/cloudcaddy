// src/components/Avatar.jsx
import React from 'react';
import { useAvatar } from '@/shared/hooks/useAvatar';

export default function Avatar({ userId, size = 8, className = '' }) {
  const { avatar, loading } = useAvatar(userId);

  if (loading)
    return <div className={`w-${size} h-${size} rounded-full bg-gray-200 animate-pulse`} />;

  return (
    <img
      src={avatar}
      alt="avatar"
      className={`w-${size} h-${size} rounded-full object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/avatar-placeholder.png';
      }}
    />
  );
}
