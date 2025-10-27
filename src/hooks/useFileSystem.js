// useFileSystem Hook
// Provides file system operations with state management

import { useState, useCallback } from 'react';
import * as fs from '../utils/fileSystem';

export function useFileSystem() {
  const [currentDirectory, setCurrentDirectory] = useState('/home/antondj');

  // Change directory
  const changeDirectory = useCallback((path) => {
    if (fs.isDirectory(path)) {
      setCurrentDirectory(path);
      return { success: true, path };
    }
    return { success: false, error: 'Not a directory' };
  }, []);

  // List directory
  const listDirectory = useCallback((path = currentDirectory) => {
    return fs.listDirectory(path);
  }, [currentDirectory]);

  // Read file
  const readFile = useCallback((path) => {
    return fs.readFile(path);
  }, []);

  // Check if path exists
  const pathExists = useCallback((path) => {
    return fs.pathExists(path);
  }, []);

  // Check if directory
  const isDirectory = useCallback((path) => {
    return fs.isDirectory(path);
  }, []);

  // Check if file
  const isFile = useCallback((path) => {
    return fs.isFile(path);
  }, []);

  // Get file metadata
  const getFileMetadata = useCallback((path) => {
    return fs.getFileMetadata(path);
  }, []);

  // Search
  const search = useCallback((pattern, searchPath) => {
    return fs.search(pattern, searchPath);
  }, []);

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = useCallback((partial) => {
    return fs.getAutocompleteSuggestions(partial, currentDirectory);
  }, [currentDirectory]);

  // Reset to home directory
  const goHome = useCallback(() => {
    setCurrentDirectory('/home/antondj');
  }, []);

  return {
    currentDirectory,
    changeDirectory,
    listDirectory,
    readFile,
    pathExists,
    isDirectory,
    isFile,
    getFileMetadata,
    search,
    getAutocompleteSuggestions,
    goHome
  };
}

export default useFileSystem;
