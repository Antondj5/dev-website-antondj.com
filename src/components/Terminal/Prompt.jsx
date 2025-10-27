// Prompt Component
// Displays the terminal prompt (username@hostname:directory$)

import styles from './Prompt.module.css';

export default function Prompt({ directory = '/home/antondj' }) {
  // Simplify directory path for display
  const getDisplayPath = (path) => {
    if (path === '/home/antondj') return '~';
    if (path.startsWith('/home/antondj/')) {
      return '~/' + path.slice('/home/antondj/'.length);
    }
    return path;
  };

  const displayPath = getDisplayPath(directory);

  return (
    <span className={styles.prompt}>
      <span className={styles.user}>antondj@portfolio</span>
      <span className={styles.separator}>:</span>
      <span className={styles.directory}>{displayPath}</span>
      <span className={styles.dollar}>$ </span>
    </span>
  );
}
