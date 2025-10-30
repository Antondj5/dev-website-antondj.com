// App Component
// Main application component

import { ThemeProvider } from './contexts/ThemeContext';
import { TerminalProvider } from './contexts/TerminalContext';
import Terminal from './components/Terminal/Terminal';
import './styles/global.css';
import './styles/themes/macos.css';
import './styles/themes/matrix.css';
import './styles/themes/dracula.css';

function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <Terminal />
      </TerminalProvider>
    </ThemeProvider>
  );
}

export default App;
