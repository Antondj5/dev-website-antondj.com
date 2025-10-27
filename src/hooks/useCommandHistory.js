// useCommandHistory Hook
// Manages command history with localStorage persistence and navigation

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'terminal_command_history';
const MAX_HISTORY_SIZE = 1000;

export function useCommandHistory() {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load command history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  }, [history]);

  // Add command to history
  const addCommand = useCallback((command) => {
    if (!command || !command.trim()) return;

    setHistory(prev => {
      // Don't add duplicate consecutive commands
      if (prev.length > 0 && prev[prev.length - 1] === command) {
        return prev;
      }

      const newHistory = [...prev, command];

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }

      return newHistory;
    });

    // Reset index
    setHistoryIndex(-1);
  }, []);

  // Navigate to previous command
  const getPreviousCommand = useCallback(() => {
    if (history.length === 0) return null;

    const newIndex = historyIndex === -1
      ? history.length - 1
      : Math.max(0, historyIndex - 1);

    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [history, historyIndex]);

  // Navigate to next command
  const getNextCommand = useCallback(() => {
    if (history.length === 0 || historyIndex === -1) return '';

    const newIndex = Math.min(history.length - 1, historyIndex + 1);

    // If we've reached the end, return empty string
    if (newIndex === history.length - 1 && historyIndex === history.length - 1) {
      setHistoryIndex(-1);
      return '';
    }

    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [history, historyIndex]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear command history:', error);
    }
  }, []);

  // Reset index (call when user types)
  const resetIndex = useCallback(() => {
    setHistoryIndex(-1);
  }, []);

  return {
    history,
    addCommand,
    getPreviousCommand,
    getNextCommand,
    clearHistory,
    resetIndex
  };
}

export default useCommandHistory;
