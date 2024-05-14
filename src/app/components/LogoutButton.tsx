"use client";

import { FC } from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: FC<LogoutButtonProps> = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('selectedFriend');
    onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '15px 30px',
        border: '3px solid black', 
        borderRadius: '10px',
        backgroundColor: 'white',
        color: 'black',
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
