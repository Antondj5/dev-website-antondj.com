// Command Parser Utility
// Parses user input into structured command objects

/**
 * Parse command string into command object
 * @param {string} input - Raw command input
 * @returns {Object} Parsed command object
 */
export function parseCommand(input) {
  if (!input || typeof input !== 'string') {
    return { command: '', args: [], flags: {} };
  }

  // Trim and split by spaces, but preserve quoted strings
  const parts = input.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

  if (parts.length === 0) {
    return { command: '', args: [], flags: {} };
  }

  const command = parts[0].toLowerCase();
  const args = [];
  const flags = {};

  // Parse arguments and flags
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].replace(/^"|"$/g, ''); // Remove quotes

    if (part.startsWith('-')) {
      // Handle flags
      if (part.startsWith('--')) {
        // Long flag: --flag or --flag=value
        const [key, value] = part.slice(2).split('=');
        flags[key] = value || true;
      } else {
        // Short flag: -a or -n 5
        const flagName = part.slice(1);

        // Check if next part is the value
        if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
          flags[flagName] = parts[i + 1].replace(/^"|"$/g, '');
          i++; // Skip next part as we've consumed it
        } else {
          flags[flagName] = true;
        }
      }
    } else {
      // Regular argument
      args.push(part);
    }
  }

  return {
    command,
    args,
    flags,
    raw: input.trim()
  };
}

/**
 * Validate command
 * @param {Object} parsedCommand - Parsed command object
 * @param {Array} validCommands - List of valid command names
 * @returns {Object} Validation result
 */
export function validateCommand(parsedCommand, validCommands) {
  if (!parsedCommand.command) {
    return { valid: true, error: null }; // Empty command is valid (user just pressed enter)
  }

  if (!validCommands.includes(parsedCommand.command)) {
    return {
      valid: false,
      error: `bash: ${parsedCommand.command}: command not found\nType 'help' for available commands.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Resolve path (handle ~, ., .., /, etc.)
 * @param {string} path - Input path
 * @param {string} currentDir - Current directory
 * @returns {string} Resolved absolute path
 */
export function resolvePath(path, currentDir = '/home/antondj') {
  if (!path) return currentDir;

  const ROOT_DIR = '/home/antondj';

  // Handle home directory
  if (path === '~' || path.startsWith('~/')) {
    path = ROOT_DIR + path.slice(1);
  }

  // Handle absolute path
  if (path.startsWith('/')) {
    return normalizePath(path);
  }

  // Handle relative path
  const parts = currentDir.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  // Track the minimum parts length (root is /home/antondj)
  const rootParts = ROOT_DIR.split('/').filter(Boolean);
  const minLength = rootParts.length;

  for (const part of pathParts) {
    if (part === '.') {
      continue; // Current directory
    } else if (part === '..') {
      // Don't pop if we're at root directory
      if (parts.length > minLength) {
        parts.pop(); // Parent directory
      }
    } else {
      parts.push(part);
    }
  }

  return '/' + parts.join('/');
}

/**
 * Normalize path (remove double slashes, trailing slashes, etc.)
 * @param {string} path - Path to normalize
 * @returns {string} Normalized path
 */
export function normalizePath(path) {
  const ROOT_DIR = '/home/antondj';

  // Split path and filter out empty parts
  const parts = path.split('/').filter(Boolean);

  // Track the minimum parts length (root is /home/antondj)
  const rootParts = ROOT_DIR.split('/').filter(Boolean);
  const minLength = rootParts.length;

  const normalized = [];
  for (const part of parts) {
    if (part === '..') {
      // Don't pop if we're at root directory
      if (normalized.length > minLength) {
        normalized.pop();
      }
    } else if (part !== '.') {
      normalized.push(part);
    }
  }

  return '/' + normalized.join('/');
}

/**
 * Get file/directory name from path
 * @param {string} path - Full path
 * @returns {string} Name of file or directory
 */
export function getFileName(path) {
  if (!path || path === '/') return '';
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

/**
 * Get parent directory path
 * @param {string} path - Full path
 * @returns {string} Parent directory path
 */
export function getParentPath(path) {
  if (!path || path === '/' || path === '/home/antondj') {
    return '/home/antondj';
  }
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

export default {
  parseCommand,
  validateCommand,
  resolvePath,
  normalizePath,
  getFileName,
  getParentPath
};
