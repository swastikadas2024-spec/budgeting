import React from 'react'
import { motion } from 'framer-motion'
import FinancialDashboard from '../components/FinancialDashboard'

export default function EndScreen({ result, onReplay }) {
  const rating = (result.money / 5000 + result.savings / 5000 + result.happiness / 100 + result.credit / 1000) / 4
  const title = result.personality ? `🏆 ${result.personality}` : rating > 0.6 ? '🏆 Smart Planner' : rating > 0.35 ? '🙂 Learning Budgeteer' : '⚠️ Needs Practice'
  const recap = result.money > 0 && result.savings > 1500
    ? 'You finished the month with money left and a strong savings habit.'
    : result.money <= 0
      ? 'The month was tough, and overspending made survival harder.'
      : 'You survived the month while learning how money choices change outcomes.'

  const lessons = []
  if (result.savings < 1500) lessons.push('Build emergency savings early to stay safe in surprise events.')
  if (result.credit < 650) lessons.push('Use credit carefully and pay it back quickly to protect your score.')
  if (result.happiness < 60) lessons.push('Balanced spending keeps both your wallet and mood healthy.')
  if (lessons.length === 0) lessons.push('Amazing balance! You used budgeting, saving, and patience very well.')

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl glass-panel p-6 md:p-8">
      <h2 className="kid-heading text-4xl md:text-5xl mb-2">{title}</h2>
      <p className="mb-4 text-lg md:text-2xl text-slate-700 font-semibold">Month Completed! Here is your money story.</p>
      <p className="mb-4 text-base md:text-xl text-slate-700">{recap}</p>

      {/* Financial Dashboard Visualizations */}
      <div className="mb-6">
        <FinancialDashboard result={result} />
      </div>

      <div className="rounded-2xl bg-white/70 p-4 mb-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Lessons Learned</h3>
        {lessons.map((lesson) => (
          <p key={lesson} className="text-base md:text-xl text-slate-700 mb-2">• {lesson}</p>
        ))}
      </div>

      <div className="rounded-2xl bg-white/70 p-4 mb-5">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Badges</h3>
        {result.achievements && result.achievements.length > 0 ? result.achievements.map((badge) => (
          <p key={badge} className="text-base md:text-xl text-slate-700 mb-1">🏅 {badge}</p>
        )) : <p className="text-base md:text-xl text-slate-600">Keep playing to unlock achievement badges.</p>}
      </div>

      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 pulse-btn text-white py-3 rounded-xl text-lg md:text-xl font-extrabold" onClick={onReplay}>Replay Month</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 border-2 border-orange-200 bg-white/80 py-3 rounded-xl text-lg md:text-xl font-bold text-slate-700" onClick={() => alert('Share feature coming soon!')}>Share Result</motion.button>
      </div>
    </motion.div>
  )
}
