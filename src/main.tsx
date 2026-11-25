import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App.tsx';
import UserProvider from './contexts/UserProvider.tsx';
import ScreenNavigationProvider from './contexts/ScreenNavigationProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ScreenNavigationProvider>
        <App />
      </ScreenNavigationProvider>
    </UserProvider>
  </StrictMode>,
);
