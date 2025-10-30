// Input Component
// Command input line with history navigation and tab completion

import { useState, useEffect, useRef } from 'react';
import { useTerminal } from '../../contexts/TerminalContext';
import { useTabCompletion } from '../../hooks/useTabCompletion';
import Prompt from './Prompt';
import styles from './Input.module.css';

export default function Input() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const {
    executeCommand,
    currentDirectory,
    isLoading,
    getPreviousCommand,
    getNextCommand,
    resetIndex
  } = useTerminal();

  const { getCompletions } = useTabCompletion(currentDirectory);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setInput(e.target.value);
    setSuggestions([]);
    resetIndex();
  };

  // Handle key down
  const handleKeyDown = (e) => {
    // Enter - execute command
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        executeCommand(input);
        setInput('');
        setSuggestions([]);
      } else if (!isLoading) {
        executeCommand('');
      }
      return;
    }

    // Arrow Up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = getPreviousCommand();
      if (prev !== null) {
        setInput(prev);
      }
      return;
    }

    // Arrow Down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = getNextCommand();
      if (next !== null) {
        setInput(next);
      }
      return;
    }

    // Tab - autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const { suggestions: matches, completed } = getCompletions(input);

      if (completed) {
        // Parse the input to get the command part
        const parts = input.trim().split(' ');
        if (parts.length === 1) {
          // Completing command name
          setInput(completed);
        } else {
          // Completing file path
          parts[parts.length - 1] = completed;
          setInput(parts.join(' '));
        }
        setSuggestions([]);
      } else if (matches && matches.length > 0) {
        setSuggestions(matches);
      }
      return;
    }

    // Any other key - clear suggestions
    if (suggestions.length > 0) {
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputLine}>
        <Prompt directory={currentDirectory} />
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          className={styles.input}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.join('  ')}
        </div>
      )}
    </div>
  );
}
