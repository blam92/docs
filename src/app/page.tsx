"use client";

import { useEffect, useState } from 'react';
import { friends, Friend } from '../app/lib/data';
import ProfileCard from '../app/components/ProfileCard';
import SelectFriend from '../app/components/SelectFriend';
import LogoutButton from '../app/components/LogoutButton';
import NotificationModal from '../app/components/NotificationModal';
import styles from '../app/styles/Home.module.css';

interface FriendWithStatus extends Friend {
  status: 'available' | 'unavailable';
}

export default function Home() {
  const [selectedFriend, setSelectedFriend] = useState<FriendWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendsStatus, setFriendsStatus] = useState<{ [key: string]: 'available' | 'unavailable' }>({});
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const storedFriend = localStorage.getItem('selectedFriend');
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }
    setLoading(false);

    const eventSource = new EventSource('/api/events');

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
    
    eventSource.onmessage = (event) => {
      console.log('GOT event', event);
      const updatedStatus = JSON.parse(event.data);
      setFriendsStatus(updatedStatus);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSelectFriend = (friend: Friend) => {
    const friendWithStatus = { ...friend, status: 'available' as 'available' | 'unavailable' };
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
      console.log('POST event', { id: selectedFriend.id, status });

      await fetch('/api/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedFriend.id, status }),
      });

      // Show notification
      const msgStatus = status === 'available' ? 'esta manija' : 'nos abandona';
      setNotification(`${selectedFriend.name} ${msgStatus}`);
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
