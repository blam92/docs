"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabaseClient';
import ProfileCard from '../app/components/ProfileCard';
import SelectFriend from '../app/components/SelectFriend';
import LogoutButton from '../app/components/LogoutButton';
import NotificationModal from '../app/components/NotificationModal';
import styles from '../app/styles/Home.module.css';

interface Friend {
  id: number;
  name: string;
  image: string;
  available: boolean;
}

interface FriendWithStatus extends Friend {
  status: 'available' | 'unavailable';
}

export default function Home() {
  const [selectedFriend, setSelectedFriend] = useState<FriendWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsStatus, setFriendsStatus] = useState<{ [key: string]: 'available' | 'unavailable' }>({});
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const { data, error } = await supabase
        .from('friends')
        .select('*');

      if (error) {
        console.error('Error fetching friends:', error);
      } else {
        setFriends(data || []);
        const initialStatus = data?.reduce((acc, friend) => {
          acc[friend.id] = friend.available ? 'available' : 'unavailable';
          return acc;
        }, {} as { [key: string]: 'available' | 'unavailable' });
        setFriendsStatus(initialStatus || {});
      }
    };

    fetchFriends();

    const storedFriend = localStorage.getItem('selectedFriend');
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }
    setLoading(false);

    // Subscribe to Supabase real-time updates
    const subscription = supabase
      .channel('friends')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'friends' }, (payload) => {
        console.log("UPDATE!", payload)
        const updatedFriend = payload.new;
        setFriendsStatus((prevStatus) => ({
          ...prevStatus,
          [updatedFriend.id]: updatedFriend.available ? 'available' : 'unavailable',
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSelectFriend = (friend: Friend) => {
    const friendWithStatus: FriendWithStatus = { ...friend, status: friend.available ? 'available' : 'unavailable' };
    setSelectedFriend(friendWithStatus);
    localStorage.setItem('selectedFriend', JSON.stringify(friendWithStatus));
  };

  const handleLogout = () => {
    setSelectedFriend(null);
    localStorage.removeItem('selectedFriend');
  };

  const handleStatusChange = async (status: 'available' | 'unavailable') => {
    if (selectedFriend) {
      const updatedFriend = { ...selectedFriend, status };
      setSelectedFriend(updatedFriend);
      localStorage.setItem('selectedFriend', JSON.stringify(updatedFriend));
      console.log('POST event', { id: selectedFriend.id, available: status === 'available' });

      await supabase
        .from('friends')
        .update({ available: status === 'available' })
        .eq('id', selectedFriend.id);

      // Show notification
      setNotification(`${selectedFriend.name} is ${status.toUpperCase()}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) {
    return null; // or a loading spinner if you prefer
  }

  if (!selectedFriend) {
    return <SelectFriend onSelect={handleSelectFriend} />;
  }

  return (
    <div className="p-10 relative text-center">
      {notification && <NotificationModal message={notification} />}
      <LogoutButton onLogout={handleLogout} />
      <h1 className="text-6xl font-bold mb-10">DOCS</h1>
      <h2 className="text-5xl font-bold mb-10">Dictos On Call Service</h2>
      <div className="flex justify-center mb-10">
        <div style={{ width: '250px', height: '250px', position: 'relative' }}>
          <iframe
            src="https://giphy.com/embed/l2Sq70sCn6RnYHCeY"
            width="100%"
            height="100%"
            style={{ position: 'absolute' }}
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {friends.map(friend => (
          <ProfileCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            image={friend.image}
            status={friendsStatus[friend.id] || 'available'}
          />
        ))}
      </div>
      <div className="mt-10 flex justify-center gap-10">
        <button
          className={styles.greenButton}
          onClick={() => handleStatusChange('available')}
        >
          SALIMO
        </button>
        <button
          className={styles.redButton}
          onClick={() => handleStatusChange('unavailable')}
        >
          NO TOY
        </button>
      </div>
    </div>
  );
}
