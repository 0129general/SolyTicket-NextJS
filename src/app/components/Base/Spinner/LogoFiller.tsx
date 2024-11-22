import React from 'react';
import Image from 'next/image';
import Logo from '../../../assets/svg/solyticket_logo.svg';
import styles from './LogoFiller.module.css';

const LogoFiller = () => {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.logoWrapper}>
        <Image src={Logo} alt="Logo" className={styles.logo} />
        <div className={styles.circle}>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
        </div>
      </div>
    </div>
  );
};

export default LogoFiller;
