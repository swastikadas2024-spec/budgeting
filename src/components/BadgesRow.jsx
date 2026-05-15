import React from 'react'
import { motion } from 'framer-motion'

const BADGES = [
  { key: 'firstSave', emoji: '💰', label: 'First Save', check: (s) => s.savings >= 1 },
  { key: 'bankBaby', emoji: '🏦', label: 'Bank Baby', check: (s) => s.savings >= 500 },
  { key: 'hotStreak', emoji: '🔥', label: 'Hot Streak', check: (s) => s.goodStreak >= 3 },
  { key: 'creditFree', emoji: '💳', label: 'Credit Free', check: (s) => s.creditUsed === 0 || s.credit >= 760 },
  { key: 'superHappy', emoji: '😄', label: 'Super Happy', check: (s) => s.happiness >= 90 },
  { key: 'patientHero', emoji: '⏭️', label: 'Patient Hero', check: (s) => s.skipCount >= 3 },
  { key: 'hero', emoji: '🏆', label: 'Hero!', check: (s) => s.day >= 30 },
]

export default function BadgesRow({ state }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {BADGES.map((b) => {
        const unlocked = b.check(state)
        return (
          <motion.div key={b.key} className={`flex-none w-14 h-14 rounded-xl flex items-center justify-center ${unlocked ? 'border border-yellow-400 bg-yellow-200/6 shadow-[0_6px_0_rgb(90,62,0)]' : 'filter grayscale opacity-40 border border-white/6'}`} whileHover={unlocked ? { scale: 1.15 } : {}}>
            <div className="text-2xl">{b.emoji}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
