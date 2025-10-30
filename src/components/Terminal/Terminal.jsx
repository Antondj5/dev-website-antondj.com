// Terminal Component
// Main terminal container

import { useEffect, useState, useRef } from 'react';
import { useTerminal } from '../../contexts/TerminalContext';
import Output from './Output';
import Input from './Input';
import styles from './Terminal.module.css';

export default function Terminal() {
  const { output, terminalRef, scrollToBottom } = useTerminal();
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowState, setWindowState] = useState('normal'); // 'normal', 'minimized', 'maximized', 'closed'
  const [savedSize, setSavedSize] = useState(null);
  const [savedPosition, setSavedPosition] = useState(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  // Focus input on terminal click
  const handleTerminalClick = () => {
    const input = document.getElementById('terminal-input');
    if (input) {
      input.focus();
    }
  };

  // Window dragging handlers
  const handleMouseDown = (e) => {
    if (windowState === 'maximized') return; // Can't drag when maximized

    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Window control handlers
  const handleClose = (e) => {
    e.stopPropagation();
    setWindowState('closed');
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (windowState === 'minimized') {
      setWindowState('normal');
    } else {
      setWindowState('minimized');
    }
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    if (windowState === 'maximized') {
      setWindowState('normal');
      if (savedPosition) {
        setPosition(savedPosition);
        setSavedPosition(null);
      }
    } else {
      setSavedPosition(position);
      setPosition({ x: 0, y: 0 });
      setWindowState('maximized');
    }
  };

  const handleReopen = () => {
    setWindowState('normal');
  };

  if (windowState === 'closed') {
    return (
      <div className={styles.closedMessage}>
        <div className={styles.closedContent}>
          <div className={styles.closedIcon}>💤</div>
          <p>Terminal session closed</p>
          <button className={styles.reopenButton} onClick={handleReopen}>
            Reopen Terminal
          </button>
        </div>
      </div>
    );
  }

  const terminalClasses = `${styles.terminal} ${
    windowState === 'minimized' ? styles.minimized : ''
  } ${windowState === 'maximized' ? styles.maximized : ''}`;

  const terminalStyle = {
    transform: windowState === 'normal' ? `translate(${position.x}px, ${position.y}px)` : 'none',
  };

  return (
    <div
      className={terminalClasses}
      ref={windowRef}
      onClick={handleTerminalClick}
      style={terminalStyle}
    >
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
        style={{ cursor: windowState === 'maximized' ? 'default' : 'move' }}
      >
        <div className={styles.windowControls}>
          <button
            className={`${styles.controlButton} ${styles.close}`}
            aria-label="Close"
            onClick={handleClose}
          />
          <button
            className={`${styles.controlButton} ${styles.minimize}`}
            aria-label="Minimize"
            onClick={handleMinimize}
          />
          <button
            className={`${styles.controlButton} ${styles.maximize}`}
            aria-label="Maximize"
            onClick={handleMaximize}
          />
        </div>
        <div className={styles.title}>Terminal - antondj@portfolio</div>
        <div style={{ width: '52px' }}></div> {/* Spacer for centering title */}
      </div>

      {windowState !== 'minimized' && (
        <div className={styles.content} ref={terminalRef}>
          {output.map((item, index) => (
            <Output key={index} data={item} />
          ))}

          <Input />
        </div>
      )}
    </div>
  );
}
