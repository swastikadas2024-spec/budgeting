import React, { useEffect, useState } from 'react'
import { playClick } from '../utils/ui'
import { motion } from 'framer-motion'

export default function WelcomeScreen({ hasSavedGame, onStart, onContinue }) {
  const [char, setChar] = useState('Gamer')
  const [difficulty, setDifficulty] = useState('Normal')

  const steps = [
    'Step 1: Start with pocket money, happiness, and savings.',
    'Step 2: Make one real-life decision each day.',
    'Step 3: Face consequences from spending or saving choices.',
    'Step 4: Build strong money habits for real life.',
  ]

  const difficulties = [
    { name: 'Easy', icon: '🟢', desc: 'Fewer events, smaller amounts. Perfect for learning.' },
    { name: 'Normal', icon: '🟡', desc: 'Balanced challenge. The recommended mode.' },
    { name: 'Hard', icon: '🔴', desc: 'More events, bigger stakes, boss battles. True test!' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl glass-panel p-6 md:p-8"
    >
      <h1 className="kid-heading text-4xl md:text-5xl mb-2">Budget Hero 💰</h1>
      <p className="text-lg md:text-2xl mb-5 text-white/85 font-semibold">30 Days. Real Choices. Build Your Money Superpowers.</p>

      <div className="rounded-2xl bg-white/70 p-4 md:p-5 mb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">How The Game Works</h2>
        {steps.map((step) => (
          <p key={step} className="text-base md:text-xl text-slate-700 mb-2">• {step}</p>
        ))}
        <p className="text-base md:text-xl text-slate-700 mt-3 font-bold">🔥 Unlock achievements, build streaks, survive boss events & reach the end!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-lg md:text-xl font-bold text-white/85 mb-2">Choose Character</label>
          <select className="p-3 rounded-xl w-full text-lg md:text-xl border-2 border-orange-200 bg-transparent text-white" value={char} onChange={(e) => setChar(e.target.value)}>
            <option>Gamer</option>
            <option>Athlete</option>
            <option>Artist</option>
          </select>
        </div>
        <div>
          <label className="block text-lg md:text-xl font-bold text-white/85 mb-2">Select Difficulty</label>
          <select className="p-3 rounded-xl w-full text-lg md:text-xl border-2 border-orange-200 bg-transparent text-white" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficulties.map((d) => (
              <option key={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5 border-2 border-orange-200" style={{ background: 'rgba(37, 37, 80, 0.92)' }}>
        <h3 className="font-bold text-lg text-white mb-2">Difficulty Modes:</h3>
        {difficulties.map((d) => (
          <p key={d.name} className="text-base text-white/85 mb-1">
            <span className="font-bold">{d.icon} {d.name}:</span> {d.desc}
          </p>
        ))}
      </div>

      <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 pulse-btn text-white py-3 rounded-xl text-lg md:text-xl font-extrabold" onClick={() => { playClick(); onStart({ type: char, difficulty }) }}>Start Game</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 border-2 border-orange-200 bg-white/80 rounded-xl py-3 text-lg md:text-xl font-bold text-slate-700" onClick={() => alert('Gamer = risky with temptations, Athlete = strong on social choices, Artist = better at positive rewards.')}>Tips</motion.button>
      </div>

      {hasSavedGame && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3 w-full rounded-xl border-2 border-sky-200 bg-white/85 py-3 text-lg md:text-xl font-extrabold text-slate-700" onClick={() => { playClick(); onContinue() }}>
          Continue Saved Game
        </motion.button>
      )}
    </motion.div>
  )
}
