import React from 'react'
import { motion } from 'framer-motion'
import FinancialDashboard from '../components/FinancialDashboard'
import SpendingHeatmap from '../components/SpendingHeatmap'

export default function EndScreen({ result, onReplay }) {
  const safeResult = result || {}
  const money = Number.isFinite(safeResult.money) ? safeResult.money : 0
  const savings = Number.isFinite(safeResult.savings) ? safeResult.savings : 0
  const happiness = Number.isFinite(safeResult.happiness) ? safeResult.happiness : 0
  const credit = Number.isFinite(safeResult.credit) ? safeResult.credit : 720
  const maxStreak = Number.isFinite(safeResult.maxStreak) ? safeResult.maxStreak : Number.isFinite(safeResult.comboStreak) ? safeResult.comboStreak : 0
  const creditUsed = Number.isFinite(safeResult.creditUsed) ? safeResult.creditUsed : 0
  const skipCount = Number.isFinite(safeResult.skipCount) ? safeResult.skipCount : 0

  const score = Math.round(savings + happiness * 5 + credit - creditUsed * 50 + maxStreak * 10)

  let grade = 'D'
  let gradeEmoji = '📚'
  if (score >= 2000) { grade = 'S'; gradeEmoji = '🌟' }
  else if (score >= 1500) { grade = 'A+'; gradeEmoji = '🏆' }
  else if (score >= 1000) { grade = 'A'; gradeEmoji = '⭐' }
  else if (score >= 700) { grade = 'B'; gradeEmoji = '👍' }
  else if (score >= 400) { grade = 'C'; gradeEmoji = '😊' }

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl p-6 md:p-8">
      <div className="glass-panel p-6 text-center" style={{ background: 'radial-gradient(circle at 40% 20%, rgba(206,147,216,0.08), transparent 40%)' }}>
        <div className="text-6xl font-display text-shadow-gold text-yellow-300">{grade}</div>
        <div className="text-4xl font-display text-shadow-gold">{gradeEmoji}</div>
        <h2 className="font-display text-3xl mt-4">{grade} RESULT</h2>
        <p className="mt-2 text-sm text-white/80">Final Score: <span className="font-display text-gold-400">{score}</span></p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4" style={{ background: 'rgba(26,26,62,0.9)', border: '1px solid rgba(255,215,0,0.08)' }}>
            <div className="flex justify-between py-2"><div className="text-white/70">💰 Total Saved</div><div className="font-display text-gold-400">₹{savings}</div></div>
            <div className="flex justify-between py-2"><div className="text-white/70">😊 Final Happiness</div><div className="font-display text-gold-400">{happiness}</div></div>
            <div className="flex justify-between py-2"><div className="text-white/70">💳 Credit Score</div><div className="font-display text-gold-400">{credit}</div></div>
            <div className="flex justify-between py-2"><div className="text-white/70">🔥 Best Streak</div><div className="font-display text-gold-400">{maxStreak}</div></div>
            <div className="flex justify-between py-2"><div className="text-white/70">⏭️ Smart Skips</div><div className="font-display text-gold-400">{skipCount}</div></div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'rgba(26,26,62,0.9)', border: '1px solid rgba(255,215,0,0.08)' }}>
            <h3 className="text-sm text-white/70 mb-3">Unlocked Badges</h3>
            <div className="flex gap-3 items-center justify-center text-3xl">
              {(safeResult.achievements || []).map((a) => (<div key={a}>{a.split(' ')[0]}</div>))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="rounded-2xl p-4 text-left" style={{ background: 'rgba(26,26,62,0.9)', border: '1px solid rgba(255,215,0,0.08)' }}>
            <h3 className="font-display text-lg mb-3">Dashboard</h3>
            <FinancialDashboard result={safeResult} />
          </div>

          <div className="rounded-2xl p-4 text-left" style={{ background: 'rgba(26,26,62,0.9)', border: '1px solid rgba(255,215,0,0.08)' }}>
            <h3 className="font-display text-lg mb-3">Spending Heatmap</h3>
            <SpendingHeatmap result={safeResult} />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="gold-3d font-display px-6 py-3 rounded-2xl" onClick={onReplay}>🔄 PLAY AGAIN</motion.button>
        </div>
      </div>
    </motion.div>
  )
}
