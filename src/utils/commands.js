// Command Implementations
// Each command returns an output object: { type: 'text'|'error'|'html', content: string }

import * as fs from './fileSystem';
import { resolvePath } from './parser';

/**
 * ls - List directory contents
 */
export function ls(args, flags, currentDir) {
  const targetPath = args.length > 0
    ? resolvePath(args[0], currentDir)
    : currentDir;

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `ls: cannot access '${args[0]}': No such file or directory`
    };
  }

  if (!fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `ls: ${args[0]}: Not a directory`
    };
  }

  const contents = fs.listDirectory(targetPath);

  if (contents.length === 0) {
    return { type: 'text', content: '' };
  }

  // Sort: directories first, then files
  contents.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });

  // Format output
  let output = contents.map(item => {
    const className = item.type === 'directory' ? 'directory' : 'file';
    return `<span class="${className}">${item.name}</span>`;
  }).join('  ');

  return { type: 'html', content: output };
}

/**
 * cd - Change directory
 */
export function cd(args, flags, currentDir) {
  if (args.length === 0) {
    // cd with no args goes to home
    return { type: 'cd', content: '/home/antondj' };
  }

  if (args.length > 1) {
    return { type: 'error', content: 'cd: too many arguments' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `cd: ${args[0]}: No such file or directory`
    };
  }

  if (!fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `cd: ${args[0]}: Not a directory`
    };
  }

  return { type: 'cd', content: targetPath };
}

/**
 * pwd - Print working directory
 */
export function pwd(args, flags, currentDir) {
  return { type: 'text', content: currentDir };
}

/**
 * cat - Display file contents
 */
export function cat(args, flags, currentDir) {
  if (args.length === 0) {
    return { type: 'error', content: 'cat: missing file operand' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `cat: ${args[0]}: No such file or directory`
    };
  }

  if (fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `cat: ${args[0]}: Is a directory`
    };
  }

  const content = fs.readFile(targetPath);
  return { type: 'text', content, animate: true };
}

/**
 * help - Display available commands
 */
export function help() {
  const helpText = `
Available Commands:
===================

Navigation:
  ls [path]              List directory contents
  cd <path>              Change directory
  pwd                    Print working directory

File Operations:
  cat <file>             Display file contents
  head [-n num] <file>   Show first lines of file
  tail [-n num] <file>   Show last lines of file
  less <file>            View file with pagination
  open <file>            Open images/PDFs
  wget <file>            Download file

System:
  help                   Show this help message
  whoami                 Display user information
  date                   Show current date/time
  echo <text>            Print text to terminal
  history                Show command history
  clear                  Clear terminal screen

Tips:
• Use TAB for autocompletion
• Use ↑/↓ arrows for command history
• Type 'cat README.txt' to get started
`;

  return { type: 'text', content: helpText.trim() };
}

/**
 * whoami - Display user information
 */
export function whoami() {
  const info = `
antondj

Full Name: Anton DJ
Role: Software Developer
Location: [Your Location]
Website: [Your Website]

"Building the web, one terminal command at a time."
`;

  return { type: 'text', content: info.trim() };
}

/**
 * date - Show current date/time
 */
export function date() {
  const now = new Date();
  return { type: 'text', content: now.toString() };
}

/**
 * echo - Print text
 */
export function echo(args) {
  return { type: 'text', content: args.join(' ') };
}

/**
 * clear - Clear terminal (handled in Terminal component)
 */
export function clear() {
  return { type: 'clear', content: '' };
}

/**
 * history - Show command history
 */
export function history(args, flags, currentDir, commandHistory) {
  if (!commandHistory || commandHistory.length === 0) {
    return { type: 'text', content: '' };
  }

  const output = commandHistory
    .map((cmd, index) => `  ${index + 1}  ${cmd}`)
    .join('\n');

  return { type: 'text', content: output };
}

/**
 * head - Show first lines of file
 */
export function head(args, flags, currentDir) {
  const lineCount = parseInt(flags.n) || 10;

  if (args.length === 0) {
    return { type: 'error', content: 'head: missing file operand' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `head: ${args[0]}: No such file or directory`
    };
  }

  if (fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `head: ${args[0]}: Is a directory`
    };
  }

  const content = fs.readFile(targetPath);
  const lines = content.split('\n').slice(0, lineCount).join('\n');

  return { type: 'text', content: lines };
}

/**
 * tail - Show last lines of file
 */
export function tail(args, flags, currentDir) {
  const lineCount = parseInt(flags.n) || 10;

  if (args.length === 0) {
    return { type: 'error', content: 'tail: missing file operand' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `tail: ${args[0]}: No such file or directory`
    };
  }

  if (fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `tail: ${args[0]}: Is a directory`
    };
  }

  const content = fs.readFile(targetPath);
  const lines = content.split('\n');
  const result = lines.slice(Math.max(0, lines.length - lineCount)).join('\n');

  return { type: 'text', content: result };
}

/**
 * open - Open images/PDFs in modal
 */
export function open(args, flags, currentDir) {
  if (args.length === 0) {
    return { type: 'error', content: 'open: missing file operand' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `open: ${args[0]}: No such file or directory`
    };
  }

  if (fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `open: ${args[0]}: Is a directory`
    };
  }

  const metadata = fs.getFileMetadata(targetPath);

  // Check if it's an openable file (image or PDF)
  const fileName = metadata.name.toLowerCase();
  const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/.test(fileName);
  const isPdf = /\.pdf$/.test(fileName);

  if (!isImage && !isPdf) {
    return {
      type: 'error',
      content: `open: ${args[0]}: Cannot open this file type. Use 'cat' for text files.`
    };
  }

  return {
    type: 'open',
    content: targetPath,
    metadata
  };
}

/**
 * wget - Download file
 */
export function wget(args, flags, currentDir) {
  if (args.length === 0) {
    return { type: 'error', content: 'wget: missing file operand' };
  }

  const targetPath = resolvePath(args[0], currentDir);

  if (!fs.pathExists(targetPath)) {
    return {
      type: 'error',
      content: `wget: ${args[0]}: No such file or directory`
    };
  }

  if (fs.isDirectory(targetPath)) {
    return {
      type: 'error',
      content: `wget: ${args[0]}: Is a directory`
    };
  }

  const metadata = fs.getFileMetadata(targetPath);

  return {
    type: 'download',
    content: `Downloading ${metadata.name}...`,
    metadata
  };
}

/**
 * less - Paginated file viewer (placeholder for now)
 */
export function less(args, flags, currentDir) {
  // For now, just display like cat
  // TODO: Implement proper pagination
  return cat(args, flags, currentDir);
}

// Export command registry
export const commands = {
  ls,
  cd,
  pwd,
  cat,
  help,
  whoami,
  date,
  echo,
  clear,
  history,
  head,
  tail,
  open,
  wget,
  less
};

export const commandList = Object.keys(commands);

export default commands;
