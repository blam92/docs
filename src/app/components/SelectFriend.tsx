"use client";

import { FC, useState } from 'react';
import { friends, Friend } from '../lib/data';
import styles from '../styles/SelectFriend.module.css';

interface SelectFriendProps {
  onSelect: (friend: Friend) => void;
}

const SelectFriend: FC<SelectFriendProps> = ({ onSelect }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleSelect = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleConfirm = () => {
    if (selectedFriend) {
      onSelect(selectedFriend);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Select who you are</h2>
        <div className={styles.friendsList}>
          {friends.map(friend => (
            <div key={friend.id} className={`${styles.friendCard} ${selectedFriend?.id === friend.id ? styles.selected : ''}`} onClick={() => handleSelect(friend)}>
              <img src={friend.image} alt={friend.name} />
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm} disabled={!selectedFriend}>Confirm</button>
      </div>
    </div>
  );
};

export default SelectFriend;
