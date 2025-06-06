import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProgressProvider } from './contexts/ProgressContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <ProgressProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </ProgressProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
)