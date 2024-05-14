import { FC } from 'react';
import styles from '../styles/ProfileCard.module.css';
import Image from 'next/image';

interface ProfileCardProps {
  id: number;
  name: string;
  image: string;
  status: 'available' | 'unavailable';
}

const ProfileCard: FC<ProfileCardProps> = ({ name, image, status }) => {
  return (
    <div className={`${styles.card} ${status === 'available' ? styles.available : styles.unavailable}`}>
      <Image src={image} alt={name} width={100} height={100} className={styles.image} />
      <p>{name}</p>
      <div className={styles.statusDot} />
    </div>
  );
};

export default ProfileCard;
