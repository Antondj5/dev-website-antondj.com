// Output Component
// Renders command output based on type

import { useEffect } from 'react';
import { banner, welcomeMessage } from '../../data/ascii';
import Prompt from './Prompt';
import styles from './Output.module.css';

export default function Output({ data }) {
  const { type, content, directory, animate, metadata, displayMessage } = data;

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
    // Trigger download using useEffect
    useEffect(() => {
      if (metadata) {
        const link = document.createElement('a');

        if (metadata.downloadUrl) {
          // Use the provided download URL
          link.href = metadata.downloadUrl;
          link.download = metadata.name || 'download';
        } else {
          // Create a Blob from content for files without downloadUrl
          const fileContent = content || '';
          const blob = new Blob([fileContent], {
            type: metadata.mimeType || 'text/plain'
          });
          link.href = URL.createObjectURL(blob);
          link.download = metadata.name || 'download';
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up blob URL if it was created
        if (!metadata.downloadUrl) {
          URL.revokeObjectURL(link.href);
        }
      }
    }, [metadata, content]);

    return (
      <div className={styles.output}>
        <pre>{displayMessage || content}</pre>
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
