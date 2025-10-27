# Terminal Portfolio Website

A React-based personal portfolio website styled as an interactive terminal emulator. Navigate through a virtual file system using Unix commands to explore content.

## Features

- Interactive terminal interface
- Virtual file system with directories and files
- Unix-like commands (ls, cd, cat, pwd, etc.)
- Command history navigation (↑/↓ arrows)
- Tab completion for commands and paths
- Theming system (Matrix, Dracula, Default)
- Modal system for images and PDFs
- Fully responsive design
- localStorage persistence for command history

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Available Commands

### Navigation
- `ls [path]` - List directory contents
- `cd <path>` - Change directory
- `pwd` - Print working directory

### File Operations
- `cat <file>` - Display file contents
- `head [-n num] <file>` - Show first lines of file
- `tail [-n num] <file>` - Show last lines of file
- `less <file>` - View file with pagination
- `open <file>` - Open images/PDFs
- `wget <file>` - Download file

### System
- `help` - Show available commands
- `whoami` - Display user information
- `date` - Show current date/time
- `echo <text>` - Print text to terminal
- `history` - Show command history
- `clear` - Clear terminal screen

## Project Structure

```
src/
├── components/
│   ├── Terminal/       # Terminal UI components
│   ├── Modal/          # Modal components
│   └── ASCII/          # ASCII art components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # File system data and ASCII art
├── assets/             # Static assets
└── styles/             # Global styles and themes
```

## Customization

### Update Your Information

Edit the file system data in `src/data/fileSystem.json` to add your:
- Bio and personal information
- Projects and descriptions
- Resume and experience
- Contact information
- Hobbies and interests

### Add New Themes

1. Create a new CSS file in `src/styles/themes/`
2. Define CSS variables for colors
3. Import the theme in `src/App.jsx`

### Add New Commands

1. Add command implementation in `src/utils/commands.js`
2. Add command name to the `commands` object
3. Export the command

## Technologies Used

- React 18
- Vite
- CSS Modules
- JavaScript ES6+

## Deployment

This project can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## License

MIT License - Feel free to use this template for your own portfolio!

## Credits

Built with React and Vite. Designed and developed by Anton DJ.
