# Terminal Portfolio Website - Project Specification

## 1. Project Overview

A React-based personal portfolio website styled as an interactive terminal emulator. Users navigate through a virtual file system using standard Unix commands to explore content about you, your projects, resume, and other materials.

---

## 2. Technical Stack

- **Framework:** Vite + React 18+
- **Styling:** CSS Modules with CSS Variables (for easy theming)
- **Build Tool:** Vite
- **Package Manager:** npm/yarn
- **Deployment:** Static hosting (Vercel, Netlify, GitHub Pages)

---

## 3. Core Features

### 3.1 Supported Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List directory contents | `ls`, `ls /projects` |
| `cd` | Change directory | `cd projects`, `cd ..`, `cd ~` |
| `cat` | Display file contents | `cat resume.txt` |
| `pwd` | Print working directory | `pwd` |
| `help` | Show available commands | `help` |
| `whoami` | Display user information | `whoami` |
| `date` | Show current date/time | `date` |
| `echo` | Print text to terminal | `echo Hello World` |
| `head` | Show first 10 lines of file | `head -n 5 file.txt` |
| `tail` | Show last 10 lines of file | `tail -n 5 file.txt` |
| `less` | Paginated file viewer | `less file.txt` |
| `open` | Open media files (images/PDFs) | `open photo.jpg` |
| `wget` | Download files | `wget resume.pdf` |
| `history` | Show command history | `history` |
| `clear` | Clear terminal screen | `clear` |

### 3.2 File System Structure

```
/home/antondj/
├── About/
│   ├── bio.txt
│   ├── skills.txt
│   └── interests.txt
├── projects/
│   ├── project1/
│   │   ├── description.txt
│   │   ├── screenshot.png
│   │   └── demo.txt
│   ├── project2/
│   │   └── ...
│   └── README.txt
├── resume/
│   ├── resume.txt
│   ├── resume.pdf
│   └── experience.txt
├── misc/
│   ├── contact.txt
│   ├── hobbies.txt
│   └── fun-facts.txt
└── README.txt (welcome message)
```

### 3.3 Advanced Features

#### Command History
- Store all executed commands in memory
- Navigate history with ↑ (up arrow) and ↓ (down arrow)
- Persist history in localStorage (optional)

#### Tab Completion
- Press TAB to autocomplete:
  - Command names
  - File paths
  - Directory names
- Show multiple matches if ambiguous

#### ASCII Art
- Display ASCII banner on initial load
- Optional ASCII art in specific files
- Use for visual flair in welcome message

#### Animated Typing
- Simulate typing effect for:
  - Welcome message on load
  - File contents when using `cat`
  - Help text
- Adjustable speed (fast/normal/slow)

#### File Operations
- **Text files:** Display inline with syntax highlighting (optional)
- **Images:** Open in modal overlay
- **PDFs:** Open in modal with PDF viewer or new tab
- **Downloads:** Trigger browser download with `wget`

#### Modal System
- Overlay for images/PDFs opened with `open` command
- Close with ESC key or click outside
- Navigation controls for multiple files

---

## 4. User Interface Design

### 4.1 Terminal Layout

```
┌─────────────────────────────────────────────────┐
│  Terminal - antondj@portfolio                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ASCII Art Banner]                             │
│                                                 │
│  Welcome to Anton's Portfolio Terminal!         │
│  Type 'help' for available commands.            │
│                                                 │
│  antondj@portfolio:~$ ls                        │
│  About  projects  resume  misc  README.txt      │
│                                                 │
│  antondj@portfolio:~$ █                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2 Prompt Format

```
username@hostname:current_directory$ 
```

Example: `antondj@portfolio:~/projects$`

### 4.3 Theming System

CSS Variables for easy theme switching:

```css
:root {
  --bg-color: #000000;
  --text-color: #00ff00;
  --prompt-color: #00ff00;
  --error-color: #ff0000;
  --cursor-color: #00ff00;
  --link-color: #0099ff;
  --font-family: 'Courier New', monospace;
}
```

Future themes: Matrix, Dracula, Monokai, Solarized, etc.

---

## 5. Component Architecture

### 5.1 Component Structure

```
src/
├── components/
│   ├── Terminal/
│   │   ├── Terminal.jsx          # Main terminal container
│   │   ├── Terminal.module.css
│   │   ├── Output.jsx             # Command output display
│   │   ├── Input.jsx              # Command input line
│   │   └── Prompt.jsx             # Terminal prompt
│   ├── Modal/
│   │   ├── Modal.jsx              # Generic modal overlay
│   │   ├── ImageViewer.jsx        # Image display
│   │   └── PDFViewer.jsx          # PDF display
│   └── ASCII/
│       └── Banner.jsx             # ASCII art banner
├── contexts/
│   ├── TerminalContext.jsx        # Terminal state management
│   └── ThemeContext.jsx           # Theme management
├── hooks/
│   ├── useCommandHistory.js       # Command history logic
│   ├── useTabCompletion.js        # Tab completion logic
│   └── useFileSystem.js           # File system operations
├── utils/
│   ├── commands.js                # Command implementations
│   ├── fileSystem.js              # Virtual file system
│   └── parser.js                  # Command parsing
├── data/
│   ├── fileSystem.json            # File system structure & content
│   └── ascii.js                   # ASCII art assets
├── assets/
│   ├── images/                    # Project images
│   └── pdfs/                      # Downloadable PDFs
├── styles/
│   ├── global.css                 # Global styles & CSS variables
│   └── themes/                    # Theme definitions
├── App.jsx
└── main.jsx
```

### 5.2 Key Components

#### Terminal Component
- Manages terminal state (output history, current directory)
- Handles command execution
- Renders output and input line
- Auto-scrolls to bottom on new output

#### Command Parser
- Parses user input into command + arguments
- Validates commands
- Returns structured command object

#### File System Manager
- Virtual file system in JavaScript object/JSON
- Methods: `readFile()`, `listDir()`, `changeDir()`, `fileExists()`
- Path resolution with support for `.`, `..`, `~`, `/`

#### Command Executor
- Maps commands to handler functions
- Each command returns output object: `{ type: 'text'|'error'|'file', content: string }`

---

## 6. Detailed Command Specifications

### 6.1 Navigation Commands

**`ls [path]`**
- List contents of current or specified directory
- Show directories in one color, files in another
- Support flags: `-a` (show hidden), `-l` (long format)

**`cd <path>`**
- Change to specified directory
- Support: `cd ..` (parent), `cd ~` (home), `cd /` (root), `cd -` (previous)
- Error: "Directory not found" if invalid

**`pwd`**
- Print full path of current working directory

### 6.2 File Display Commands

**`cat <file>`**
- Display entire file contents
- Animated typing effect
- Error if file doesn't exist or is binary

**`head [-n num] <file>`**
- Show first 10 lines (default) or specified number
- Support `-n` flag for custom line count

**`tail [-n num] <file>`**
- Show last 10 lines (default) or specified number
- Support `-n` flag for custom line count

**`less <file>`**
- Paginated file viewer
- Controls: Space (next page), b (previous), q (quit), / (search)
- Show progress indicator: "Line 1-20 of 100"

### 6.3 System Commands

**`help`**
- Display all available commands with brief descriptions
- Format as table or categorized list
- Include examples

**`whoami`**
- Display user information: name, role, location
- Can include ASCII art avatar

**`date`**
- Show current date and time
- Format: "Mon Oct 27 2025 14:30:45 GMT+0100"

**`echo <text>`**
- Print arguments to terminal
- Support variable expansion if desired (e.g., `$PWD`)

**`history`**
- Show numbered list of previous commands
- Support `!n` to re-execute command n (optional enhancement)

**`clear`**
- Clear all terminal output
- Keep prompt at top

### 6.4 File Operations

**`open <file>`**
- Open images in modal overlay
- Open PDFs in modal or new tab
- Error for text files: "Use 'cat' for text files"

**`wget <file>`**
- Trigger browser download
- Show progress animation (optional)
- Works for PDFs, images, resume, etc.

---

## 7. Implementation Details

### 7.1 Virtual File System

Structure stored as nested JavaScript object:

```javascript
const fileSystem = {
  type: 'directory',
  name: 'antondj',
  path: '/home/antondj',
  children: {
    'About': {
      type: 'directory',
      children: {
        'bio.txt': {
          type: 'file',
          content: 'Hi! I\'m Anton...',
          size: 250
        },
        // ...
      }
    },
    'projects': { /* ... */ },
    'README.txt': {
      type: 'file',
      content: 'Welcome message...'
    }
  }
};
```

### 7.2 Command History

```javascript
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

// On command execution
setHistory([...history, command]);

// On arrow key up/down
const handleKeyDown = (e) => {
  if (e.key === 'ArrowUp') {
    // Load previous command
  } else if (e.key === 'ArrowDown') {
    // Load next command
  }
};
```

### 7.3 Tab Completion

```javascript
const handleTab = (e) => {
  e.preventDefault();
  const input = e.target.value;
  const matches = findMatches(input);
  
  if (matches.length === 1) {
    // Complete with the match
    setInput(matches[0]);
  } else if (matches.length > 1) {
    // Show all matches
    displayMatches(matches);
  }
};
```

### 7.4 Animated Typing

```javascript
const typeText = async (text, delay = 30) => {
  for (let i = 0; i < text.length; i++) {
    await sleep(delay);
    // Update displayed text character by character
  }
};
```

---

## 8. Mobile Responsiveness

### Current Scope: Same as Desktop
- Full terminal functionality on mobile
- Touch-optimized input field
- Software keyboard support
- Landscape mode recommended for better experience

### Future Enhancements:
- Swipe gestures for history navigation
- Custom mobile keyboard with common commands
- Responsive font sizing
- Hamburger menu for quick command access

---

## 9. Welcome Experience

### Initial Load Sequence:
1. Show ASCII art banner with typing animation
2. Display welcome message:
   ```
   Welcome to Anton's Portfolio Terminal!
   
   Type 'help' to see available commands.
   Type 'ls' to explore the file system.
   
   Hint: Try 'cat README.txt' to get started!
   ```
3. Show ready prompt

### README.txt Content:
- Brief introduction
- Navigation tips
- Suggested commands to try
- Easter egg hint (optional)

---

## 10. Error Handling

### Command Not Found
```
bash: command-name: command not found
Type 'help' for available commands.
```

### File Not Found
```
cat: file.txt: No such file or directory
```

### Invalid Arguments
```
cd: too many arguments
```

### Permission Denied (for future features)
```
cat: secret.txt: Permission denied
```

---

## 11. Performance Considerations

- Lazy load file content (don't load all content upfront)
- Limit terminal history to prevent memory issues (e.g., last 1000 lines)
- Optimize re-renders with React.memo and useCallback
- Virtual scrolling for very long outputs (optional)

---

## 12. Content Guidelines

### File Content Best Practices:
- **bio.txt**: 200-300 words, personal introduction
- **skills.txt**: Categorized list of technical skills
- **project descriptions**: Include tech stack, challenges, outcomes
- **resume.txt**: Formatted plaintext version of resume
- **contact.txt**: Email, LinkedIn, GitHub, etc.

### Tone:
- Professional but approachable
- Show personality through content
- Use humor sparingly in misc/ directory

---

## 13. Testing Checklist

- [ ] All commands work as expected
- [ ] Path navigation (relative and absolute)
- [ ] Tab completion accuracy
- [ ] Command history navigation
- [ ] Modal open/close functionality
- [ ] File downloads work
- [ ] Mobile touch input
- [ ] Theme switching
- [ ] Error messages display correctly
- [ ] Typing animations are smooth
- [ ] Terminal scrolls to bottom on new output
- [ ] Keyboard shortcuts work (ESC to close modal, etc.)

---

## 14. Future Enhancements

### Phase 2 Features:
- Multiple theme presets
- Customizable typing speed
- Sound effects (optional)
- `grep` command for searching
- `find` command for file search
- Session persistence (save state in localStorage)
- Visitor analytics (command usage tracking)

### Phase 3 Features:
- Backend integration for dynamic content
- Contact form command: `mail`
- Blog system with date-sorted entries
- Visitor guestbook: `sign-guestbook`
- Real-time chat: `talk-to-anton`

---

## 15. Development Phases

### Phase 1: Core Terminal (Week 1-2)
- Basic terminal UI
- Command parser and executor
- File system implementation
- Navigation commands (ls, cd, pwd)
- File display commands (cat, head, tail)
- Help system

### Phase 2: Advanced Features (Week 3)
- Command history
- Tab completion
- Typing animations
- ASCII art integration
- Modal system for images/PDFs
- Download functionality

### Phase 3: Polish & Content (Week 4)
- Theme system setup
- Add all content
- Mobile testing and optimization
- Error handling improvements
- Welcome sequence
- Performance optimization

### Phase 4: Deployment
- Build optimization
- Deploy to hosting platform
- SEO optimization (meta tags, etc.)
- Analytics setup (optional)

---

## 16. File Naming Conventions

- **Text files**: lowercase with `.txt` extension
- **Markdown files**: lowercase with `.md` extension (if using markdown)
- **Images**: lowercase with descriptive names, e.g., `project-screenshot.png`
- **PDFs**: lowercase with descriptive names, e.g., `anton-resume.pdf`
- **Directories**: PascalCase or lowercase

---

## 17. Accessibility Considerations

- Ensure keyboard navigation works perfectly
- ARIA labels for screen readers
- High contrast theme option for visibility
- Focus indicators on interactive elements
- Semantic HTML structure

---

## End of Specification

This document serves as the complete blueprint for development. Refer back to this as needed during implementation. Update this document if requirements change.
