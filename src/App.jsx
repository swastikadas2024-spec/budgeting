import React, { useEffect, useState } from 'react'
import WelcomeScreen from './screens/WelcomeScreen'
import GameScreen from './screens/GameScreen'
import EndScreen from './screens/EndScreen'

const SAVE_KEY = 'budget-hero-save-v2'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [profile, setProfile] = useState({ type: 'Gamer' })
  const [result, setResult] = useState(null)
  const [savedGame, setSavedGame] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      setSavedGame(raw ? JSON.parse(raw) : null)
    } catch {
      setSavedGame(null)
    }
  }, [])

  function startNewGame(nextProfile) {
    setProfile(nextProfile)
    setScreen('game')
    setResult(null)
  }

  function continueGame() {
    if (!savedGame) return
    setProfile({ type: savedGame.profileType || 'Gamer' })
    setScreen('game')
    setResult(null)
  }

  function replayGame() {
    localStorage.removeItem(SAVE_KEY)
    setSavedGame(null)
    setScreen('welcome')
    setResult(null)
  }

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 pointer-events-none floating-shapes" />
      {screen === 'welcome' && (
        <WelcomeScreen hasSavedGame={!!savedGame} onStart={startNewGame} onContinue={continueGame} />
      )}
      {screen === 'game' && (
        <GameScreen profile={profile} resumeData={savedGame} onSaveGame={setSavedGame} onEnd={(res) => { setResult(res); setScreen('end') }} />
      )}
      {screen === 'end' && (
        <EndScreen result={result} onReplay={replayGame} />
      )}
    </div>
  )
}
