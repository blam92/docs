import { FC } from 'react';
import styles from '../styles/ProfileCard.module.css';

interface ProfileCardProps {
  id: number;
  name: string;
  image: string;
  status: 'available' | 'unavailable';
}

const ProfileCard: FC<ProfileCardProps> = ({ name, image, status }) => {
  return (
    <div className={`${styles.card} ${status === 'available' ? styles.available : styles.unavailable}`}>
      <img src={image} alt={name} />
      <p>{name}</p>
      <div className={styles.statusDot} />
    </div>
  );
};

export default ProfileCard;
