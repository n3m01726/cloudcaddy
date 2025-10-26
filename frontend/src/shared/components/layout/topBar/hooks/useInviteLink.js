import { useState } from 'react';

export const useInviteLink = () => {
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const createInvite = async () => {
    if (inviteUrl) return;
    setLoading(true);
    try {
      const res = await fetch('/api/invite', { method: 'POST' });
      const data = await res.json();
      setInviteUrl(data.inviteUrl || '');
      setCopied(false);
    } catch (err) {
      console.error('Erreur création invitation :', err);
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Échec copie :', err);
    }
  };

  return { inviteUrl, copied, loading, createInvite, copyInvite };
};
