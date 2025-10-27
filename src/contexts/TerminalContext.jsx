// Terminal Context
// Manages terminal state (output, current directory, command execution)

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { parseCommand, validateCommand } from '../utils/parser';
import { commands, commandList } from '../utils/commands';
import { useFileSystem } from '../hooks/useFileSystem';
import { useCommandHistory } from '../hooks/useCommandHistory';

const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef(null);

  const fileSystem = useFileSystem();
  const commandHistory = useCommandHistory();

  // Add welcome message on mount
  useState(() => {
    setOutput([{
      type: 'welcome',
      content: 'welcome'
    }]);
  });

  // Execute command
  const executeCommand = useCallback(async (input) => {
    if (!input || !input.trim()) {
      // Empty command - just show prompt again
      setOutput(prev => [...prev, { type: 'command', content: '', directory: fileSystem.currentDirectory }]);
      return;
    }

    // Add to command history
    commandHistory.addCommand(input);

    // Add command to output
    setOutput(prev => [
      ...prev,
      { type: 'command', content: input, directory: fileSystem.currentDirectory }
    ]);

    // Parse command
    const parsed = parseCommand(input);

    // Validate command
    const validation = validateCommand(parsed, commandList);
    if (!validation.valid) {
      setOutput(prev => [
        ...prev,
        { type: 'error', content: validation.error }
      ]);
      return;
    }

    // Handle empty command
    if (!parsed.command) {
      return;
    }

    // Execute command
    try {
      setIsLoading(true);

      const commandFn = commands[parsed.command];
      const result = await commandFn(
        parsed.args,
        parsed.flags,
        fileSystem.currentDirectory,
        commandHistory.history
      );

      // Handle different result types
      if (result.type === 'cd') {
        // Change directory
        fileSystem.changeDirectory(result.content);
      } else if (result.type === 'clear') {
        // Clear output
        setOutput([]);
      } else {
        // Add result to output
        setOutput(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Command execution error:', error);
      setOutput(prev => [
        ...prev,
        { type: 'error', content: `Error executing command: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [fileSystem, commandHistory]);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setOutput([]);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const value = {
    output,
    isLoading,
    executeCommand,
    clearTerminal,
    currentDirectory: fileSystem.currentDirectory,
    commandHistory: commandHistory.history,
    terminalRef,
    scrollToBottom,
    ...commandHistory
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within TerminalProvider');
  }
  return context;
}

export default TerminalContext;
