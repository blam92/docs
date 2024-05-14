"use client";

import { useEffect, useState } from 'react';
import { friends, Friend } from '../app/lib/data';
import ProfileCard from '../app/components/ProfileCard';
import SelectFriend from '../app/components/SelectFriend';
import LogoutButton from '../app/components/LogoutButton';
import styles from '../app/styles/Home.module.css';

interface FriendWithStatus extends Friend {
  status: 'available' | 'unavailable';
}

export default function Home() {
  const [selectedFriend, setSelectedFriend] = useState<FriendWithStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFriend = localStorage.getItem('selectedFriend');
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }
    setLoading(false);
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

  const handleStatusChange = (status: 'available' | 'unavailable') => {
    if (selectedFriend) {
      const updatedFriend = { ...selectedFriend, status };
      setSelectedFriend(updatedFriend);
      localStorage.setItem('selectedFriend', JSON.stringify(updatedFriend));
    }
  };

  if (loading) {
    return null;
  }

  if (!selectedFriend) {
    return <SelectFriend onSelect={handleSelectFriend} />;
  }

  return (
    <div className={styles.container}>
      <LogoutButton onLogout={handleLogout} />
      <h1 className="text-6xl font-bold mb-10">DOCS</h1>
      <h2 className="text-6xl font-bold mb-10">Dictos On Call System</h2>
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
      <div className={styles.grid}>
        {friends.map(friend => (
          <ProfileCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            image={friend.image}
            status={selectedFriend.id === friend.id ? selectedFriend.status : 'available'}
          />
        ))}
      </div>
      <div className={styles.buttonsContainer}>
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
