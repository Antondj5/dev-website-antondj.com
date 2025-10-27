// Banner Component
// Displays ASCII art banner

import { banner } from '../../data/ascii';
import styles from './Banner.module.css';

export default function Banner() {
  return (
    <div className={styles.banner}>
      <pre className={styles.ascii}>{banner}</pre>
    </div>
  );
}
