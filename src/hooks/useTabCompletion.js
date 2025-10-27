// useTabCompletion Hook
// Handles tab completion for commands and file paths

import { useCallback } from 'react';
import { commandList } from '../utils/commands';
import * as fs from '../utils/fileSystem';
import { resolvePath } from '../utils/parser';

export function useTabCompletion(currentDir) {
  /**
   * Get tab completion suggestions
   */
  const getCompletions = useCallback((input) => {
    if (!input || !input.trim()) {
      return { suggestions: [], completed: '' };
    }

    const parts = input.trim().split(' ');

    // Complete command name
    if (parts.length === 1) {
      const matches = commandList.filter(cmd =>
        cmd.startsWith(parts[0].toLowerCase())
      );

      if (matches.length === 1) {
        return { suggestions: [], completed: matches[0] + ' ' };
      } else if (matches.length > 1) {
        return { suggestions: matches, completed: '' };
      }

      return { suggestions: [], completed: '' };
    }

    // Complete file/directory path
    const command = parts[0].toLowerCase();
    const partial = parts[parts.length - 1];

    // Only complete paths for certain commands
    const pathCommands = ['ls', 'cd', 'cat', 'head', 'tail', 'less', 'open', 'wget'];
    if (!pathCommands.includes(command)) {
      return { suggestions: [], completed: '' };
    }

    return getPathCompletions(partial, currentDir);
  }, [currentDir]);

  /**
   * Get path completions
   */
  const getPathCompletions = useCallback((partial, currentDir) => {
    // Determine the directory to search in
    let searchDir = currentDir;
    let searchPattern = partial;

    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/');
      const dirPart = partial.substring(0, lastSlash + 1);
      searchPattern = partial.substring(lastSlash + 1);
      searchDir = resolvePath(dirPart, currentDir);
    }

    // Get directory contents
    const contents = fs.listDirectory(searchDir);
    if (!contents) {
      return { suggestions: [], completed: '' };
    }

    // Filter matches
    const matches = contents
      .filter(item => item.name.toLowerCase().startsWith(searchPattern.toLowerCase()))
      .map(item => ({
        name: item.name,
        type: item.type
      }));

    if (matches.length === 0) {
      return { suggestions: [], completed: '' };
    }

    if (matches.length === 1) {
      // Single match - complete it
      const match = matches[0];
      const prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
      const suffix = match.type === 'directory' ? '/' : ' ';
      return {
        suggestions: [],
        completed: prefix + match.name + suffix
      };
    }

    // Multiple matches - find common prefix
    const commonPrefix = getCommonPrefix(matches.map(m => m.name));

    if (commonPrefix.length > searchPattern.length) {
      const prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
      return {
        suggestions: matches.map(m => m.name),
        completed: prefix + commonPrefix
      };
    }

    // Return all matches
    return {
      suggestions: matches.map(m => m.name),
      completed: ''
    };
  }, []);

  /**
   * Find common prefix among strings
   */
  const getCommonPrefix = (strings) => {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];

    let prefix = strings[0];

    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }

    return prefix;
  };

  return {
    getCompletions
  };
}

export default useTabCompletion;
