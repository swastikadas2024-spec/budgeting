import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function WelcomeScreen({ hasSavedGame, onStart, onContinue }) {
  const [char, setChar] = useState('Gamer')

  const steps = [
    'Step 1: Start with pocket money, happiness, and savings.',
    'Step 2: Make one real-life decision each day.',
    'Step 3: Face consequences from spending or saving choices.',
    'Step 4: Build strong money habits for real life.',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl glass-panel p-6 md:p-8"
    >
      <h1 className="kid-heading text-4xl md:text-5xl mb-2">Welcome to Budget Hero 💰</h1>
      <p className="text-lg md:text-2xl mb-5 text-slate-700 font-semibold">Survive 30 days, stay happy, and become a money champion.</p>

      <div className="rounded-2xl bg-white/70 p-4 md:p-5 mb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">How The Simulation Works</h2>
        {steps.map((step) => (
          <p key={step} className="text-base md:text-xl text-slate-700 mb-2">• {step}</p>
        ))}
      </div>

      <div className="mb-5">
        <label className="block text-lg md:text-xl font-bold text-slate-700">Choose Character</label>
        <select className="mt-2 p-3 rounded-xl w-full text-lg md:text-xl border-2 border-orange-200" value={char} onChange={(e) => setChar(e.target.value)}>
          <option>Gamer</option>
          <option>Athlete</option>
          <option>Artist</option>
        </select>
      </div>

      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 pulse-btn text-white py-3 rounded-xl text-lg md:text-xl font-extrabold" onClick={() => onStart({ type: char })}>Start Game</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 border-2 border-orange-200 bg-white/80 rounded-xl py-3 text-lg md:text-xl font-bold text-slate-700" onClick={() => alert('Gamer = risky with temptations, Athlete = strong on social choices, Artist = better at positive rewards.')}>Character Tips</motion.button>
      </div>

      {hasSavedGame && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3 w-full rounded-xl border-2 border-sky-200 bg-white/85 py-3 text-lg md:text-xl font-extrabold text-slate-700" onClick={onContinue}>
          Continue Saved Game
        </motion.button>
      )}
    </motion.div>
  )
}
