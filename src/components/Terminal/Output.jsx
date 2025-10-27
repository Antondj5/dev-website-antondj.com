// Output Component
// Renders command output based on type

import { banner, welcomeMessage } from '../../data/ascii';
import Prompt from './Prompt';
import styles from './Output.module.css';

export default function Output({ data }) {
  const { type, content, directory, animate } = data;

  // Welcome message
  if (type === 'welcome') {
    return (
      <div className={styles.welcome}>
        <pre className={styles.banner}>{banner}</pre>
        <pre className={styles.welcomeText}>{welcomeMessage}</pre>
      </div>
    );
  }

  // Command echo
  if (type === 'command') {
    return (
      <div className={styles.command}>
        <Prompt directory={directory} />
        <span className={styles.commandText}>{content}</span>
      </div>
    );
  }

  // Error output
  if (type === 'error') {
    return (
      <div className={styles.error}>
        <pre>{content}</pre>
      </div>
    );
  }

  // HTML output (for colored ls output, etc.)
  if (type === 'html') {
    return (
      <div
        className={styles.output}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Text output
  if (type === 'text') {
    return (
      <div className={`${styles.output} ${animate ? styles.animate : ''}`}>
        <pre>{content}</pre>
      </div>
    );
  }

  // Download notification
  if (type === 'download') {
    return (
      <div className={styles.output}>
        <pre>{content}</pre>
      </div>
    );
  }

  // Open file (this would trigger modal in parent)
  if (type === 'open') {
    return (
      <div className={styles.output}>
        <pre>Opening {content}...</pre>
      </div>
    );
  }

  // Default
  return (
    <div className={styles.output}>
      <pre>{content}</pre>
    </div>
  );
}
