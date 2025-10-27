// ImageViewer Component
// Displays images in modal

import styles from './ImageViewer.module.css';

export default function ImageViewer({ src, alt = 'Image' }) {
  return (
    <div className={styles.imageViewer}>
      <img
        src={src}
        alt={alt}
        className={styles.image}
      />
    </div>
  );
}
