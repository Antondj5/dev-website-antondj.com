// Virtual File System Utility
// Manages the virtual file system operations

import fileSystemData from '../data/fileSystem.json';

/**
 * Get node (file or directory) at given path
 * @param {string} path - Absolute path
 * @returns {Object|null} File/directory object or null if not found
 */
export function getNode(path) {
  if (!path) return null;

  // Normalize path
  path = path.replace(/\/+/g, '/').replace(/\/$/, '');

  // Root case
  if (path === '' || path === '/' || path === '/home/antondj') {
    return fileSystemData;
  }

  // Split path and traverse
  const parts = path.split('/').filter(Boolean);
  let current = fileSystemData;

  // Skip 'home' and 'antondj' if present
  const startIndex = parts[0] === 'home' ? (parts[1] === 'antondj' ? 2 : 1) : 0;

  for (let i = startIndex; i < parts.length; i++) {
    const part = parts[i];

    if (!current.children || !current.children[part]) {
      return null;
    }

    current = current.children[part];
  }

  return current;
}

/**
 * Check if path exists
 * @param {string} path - Absolute path
 * @returns {boolean} True if exists
 */
export function pathExists(path) {
  return getNode(path) !== null;
}

/**
 * Check if path is a directory
 * @param {string} path - Absolute path
 * @returns {boolean} True if directory
 */
export function isDirectory(path) {
  const node = getNode(path);
  return node !== null && node.type === 'directory';
}

/**
 * Check if path is a file
 * @param {string} path - Absolute path
 * @returns {boolean} True if file
 */
export function isFile(path) {
  const node = getNode(path);
  return node !== null && node.type === 'file';
}

/**
 * List directory contents
 * @param {string} path - Absolute path to directory
 * @returns {Array} Array of {name, type} objects
 */
export function listDirectory(path) {
  const node = getNode(path);

  if (!node || node.type !== 'directory') {
    return null;
  }

  if (!node.children) {
    return [];
  }

  return Object.entries(node.children).map(([name, child]) => ({
    name,
    type: child.type,
    size: child.size || 0
  }));
}

/**
 * Read file contents
 * @param {string} path - Absolute path to file
 * @returns {string|null} File contents or null if not found
 */
export function readFile(path) {
  const node = getNode(path);

  if (!node || node.type !== 'file') {
    return null;
  }

  return node.content || '';
}

/**
 * Get file metadata
 * @param {string} path - Absolute path to file
 * @returns {Object|null} File metadata
 */
export function getFileMetadata(path) {
  const node = getNode(path);

  if (!node) {
    return null;
  }

  return {
    name: node.name,
    type: node.type,
    size: node.size || 0,
    downloadUrl: node.downloadUrl,
    mimeType: node.mimeType
  };
}

/**
 * Search for files/directories matching pattern
 * @param {string} pattern - Search pattern (supports partial matching)
 * @param {string} searchPath - Path to search in (default: root)
 * @returns {Array} Array of matching paths
 */
export function search(pattern, searchPath = '/home/antondj') {
  const results = [];
  const regex = new RegExp(pattern, 'i'); // Case-insensitive

  function traverse(node, currentPath) {
    if (!node) return;

    // Check if current node matches
    if (node.name && regex.test(node.name)) {
      results.push(currentPath);
    }

    // Traverse children
    if (node.children) {
      Object.entries(node.children).forEach(([name, child]) => {
        const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
        traverse(child, newPath);
      });
    }
  }

  const startNode = getNode(searchPath);
  traverse(startNode, searchPath);

  return results;
}

/**
 * Get all files in directory (recursive)
 * @param {string} path - Directory path
 * @returns {Array} Array of file paths
 */
export function getAllFiles(path = '/home/antondj') {
  const files = [];

  function traverse(node, currentPath) {
    if (!node) return;

    if (node.type === 'file') {
      files.push(currentPath);
    }

    if (node.children) {
      Object.entries(node.children).forEach(([name, child]) => {
        const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
        traverse(child, newPath);
      });
    }
  }

  const startNode = getNode(path);
  traverse(startNode, path);

  return files;
}

/**
 * Get autocomplete suggestions
 * @param {string} partial - Partial path/filename
 * @param {string} currentDir - Current directory
 * @returns {Array} Array of suggestions
 */
export function getAutocompleteSuggestions(partial, currentDir) {
  const node = getNode(currentDir);

  if (!node || !node.children) {
    return [];
  }

  const suggestions = Object.keys(node.children).filter(name =>
    name.toLowerCase().startsWith(partial.toLowerCase())
  );

  return suggestions;
}

export default {
  getNode,
  pathExists,
  isDirectory,
  isFile,
  listDirectory,
  readFile,
  getFileMetadata,
  search,
  getAllFiles,
  getAutocompleteSuggestions
};
