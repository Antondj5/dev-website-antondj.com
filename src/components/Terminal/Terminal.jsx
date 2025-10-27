// Terminal Component
// Main terminal container

import { useEffect } from 'react';
import { useTerminal } from '../../contexts/TerminalContext';
import Output from './Output';
import Input from './Input';
import styles from './Terminal.module.css';

export default function Terminal() {
  const { output, terminalRef, scrollToBottom } = useTerminal();

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

  return (
    <div
      className={styles.terminal}
      ref={terminalRef}
      onClick={handleTerminalClick}
    >
      <div className={styles.header}>
        <div className={styles.title}>Terminal - antondj@portfolio</div>
      </div>

      <div className={styles.content}>
        {output.map((item, index) => (
          <Output key={index} data={item} />
        ))}

        <Input />
      </div>
    </div>
  );
}
