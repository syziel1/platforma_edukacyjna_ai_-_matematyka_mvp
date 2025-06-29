import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProgressProvider } from './contexts/ProgressContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'
import { GameRecordsProvider } from './contexts/GameRecordsContext.jsx'
import { GlobalTimerProvider } from './contexts/GlobalTimerContext.jsx'

// Import i18n configuration
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ProgressProvider>
            <SettingsProvider>
              <GlobalTimerProvider>
                <GameRecordsProvider>
                  <App />
                </GameRecordsProvider>
              </GlobalTimerProvider>
            </SettingsProvider>
          </ProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)