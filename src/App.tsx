import { ThemeProvider } from './context/ThemeContext';
import './styles/themes.css';

function App() {
  return (
    <ThemeProvider>
      {/* Your existing app content */}
      <ThemeToggle />
    </ThemeProvider>
  );
}
