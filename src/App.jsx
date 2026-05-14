import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WelcomeScreen from './screens/WelcomeScreen'
import GameScreen from './screens/GameScreen'
import EndScreen from './screens/EndScreen'

const SAVE_KEY = 'budget-hero-save-v2'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [profile, setProfile] = useState({ type: 'Gamer' })
  const [result, setResult] = useState(null)
  const [savedGame, setSavedGame] = useState(null)
  const [showTransition, setShowTransition] = useState(false)

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
    setShowTransition(true)
    // Transition to game after animation completes
    setTimeout(() => {
      setScreen('game')
      setShowTransition(false)
    }, 3000)
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
      
      <AnimatePresence mode="wait">
        {showTransition && (
          <motion.div
            key="transition"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <motion.h1
                className="kid-heading text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
              >
                🚀
              </motion.h1>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                Start Your Journey
              </h2>
              <p className="text-xl md:text-3xl text-white/90 drop-shadow-md">
                {profile.type === 'Gamer'
                  ? 'Survive 30 days and master your money skills! 💰'
                  : profile.type === 'Athlete'
                  ? 'Train your financial discipline! 💪'
                  : 'Express your money creativity! 🎨'}
              </p>
              <motion.div
                className="mt-8 text-white text-lg font-bold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Get Ready...
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {screen === 'welcome' && !showTransition && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WelcomeScreen hasSavedGame={!!savedGame} onStart={startNewGame} onContinue={continueGame} />
          </motion.div>
        )}
        {screen === 'game' && !showTransition && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameScreen profile={profile} resumeData={savedGame} onSaveGame={setSavedGame} onEnd={(res) => { setResult(res); setScreen('end') }} />
          </motion.div>
        )}
        {screen === 'end' && !showTransition && (
          <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EndScreen result={result} onReplay={replayGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
