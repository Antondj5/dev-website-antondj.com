// PDFViewer Component
// Displays PDFs in modal (or opens in new tab)

import styles from './PDFViewer.module.css';

export default function PDFViewer({ src, title = 'PDF Document' }) {
  const handleOpenInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <div className={styles.pdfViewer}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.openButton} onClick={handleOpenInNewTab}>
          Open in New Tab
        </button>
      </div>

      <iframe
        src={src}
        className={styles.iframe}
        title={title}
      />

      <div className={styles.fallback}>
        <p>Unable to display PDF?</p>
        <button className={styles.downloadButton} onClick={handleOpenInNewTab}>
          Open in New Tab
        </button>
      </div>
    </div>
  );
}
