import React from 'react'
import { motion } from 'framer-motion'
import FinancialDashboard from '../components/FinancialDashboard'
import SpendingHeatmap from '../components/SpendingHeatmap'

export default function EndScreen({ result, onReplay }) {
  // Ensure all values have defaults to prevent NaN
  const money = result?.money ?? 0
  const savings = result?.savings ?? 0
  const happiness = result?.happiness ?? 0
  const credit = result?.credit ?? 720
  
  const rating = (money / 5000 + savings / 5000 + happiness / 100 + credit / 1000) / 4
  const scorePercent = Math.round(Math.max(0, Math.min(100, rating * 100)))
  
  // Determine rank based on performance and difficulty
  let rankIcon = '🏆'
  let rankTitle = 'MONTH COMPLETE!'
  if (scorePercent >= 85) rankIcon = '👑'
  if (scorePercent >= 85) rankTitle = 'LEGENDARY CHAMPION'
  else if (scorePercent >= 70) rankTitle = 'EXCELLENT BUDGETER'
  else if (scorePercent >= 50) rankTitle = 'GOOD MONEY MANAGER'
  else rankTitle = 'LEARNING JOURNEY'
  
  const title = result?.personality ? `${rankIcon} ${result.personality}` : rankIcon + ' ' + rankTitle
  const recap = money > 0 && savings > 1500
    ? 'You finished the month with money left and a strong savings habit. Excellent money management!'
    : money <= 0
      ? 'The month was tough, and overspending made survival harder. But you learned valuable lessons!'
      : 'You survived the month while learning how money choices change outcomes.'

  const lessons = []
  if (savings < 1500) lessons.push('Build emergency savings early to stay safe in surprise events.')
  if (credit < 650) lessons.push('Use credit carefully and pay it back quickly to protect your score.')
  if (happiness < 60) lessons.push('Balanced spending keeps both your wallet and mood healthy.')
  if (lessons.length === 0) lessons.push('Amazing balance! You used budgeting, saving, and patience very well.')

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl glass-panel p-6 md:p-8">
      <h2 className="kid-heading text-4xl md:text-5xl mb-2">{title}</h2>
      <p className="mb-4 text-lg md:text-2xl text-slate-700 font-semibold">Month Completed! Here is your money story.</p>
      
      {/* Overall Score */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 p-6 border-3 border-purple-300 text-center">
        <p className="text-sm font-bold text-slate-600 mb-2">OVERALL PERFORMANCE</p>
        <div className="text-6xl md:text-7xl font-black text-purple-600 mb-2">{scorePercent}%</div>
        <p className="text-lg md:text-2xl font-bold text-slate-700">{rankTitle}</p>
      </div>

      <p className="mb-6 text-base md:text-xl text-slate-700">{recap}</p>

      {/* Financial Dashboard Visualizations */}
      <div className="mb-6">
        <FinancialDashboard result={result} />
      </div>

      {/* Achievements */}
      <div className="rounded-2xl bg-white/70 p-4 mb-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">🏅 Achievements Unlocked</h3>
        {result.achievements && result.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.achievements.map((achievement) => (
              <div key={achievement} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-300">
                <p className="text-lg font-bold text-slate-700">{achievement}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base md:text-xl text-slate-600">Keep playing to unlock more achievement badges!</p>
        )}
      </div>

      {/* Spending Heatmap */}
      <div className="mb-4">
        <SpendingHeatmap result={result} />
      </div>

      {/* Lessons Learned */}
      <div className="rounded-2xl bg-white/70 p-4 mb-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">📚 Lessons Learned</h3>
        {lessons.map((lesson) => (
          <p key={lesson} className="text-base md:text-xl text-slate-700 mb-2">• {lesson}</p>
        ))}
      </div>

      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 pulse-btn text-white py-3 rounded-xl text-lg md:text-xl font-extrabold" onClick={onReplay}>🎮 Play Again</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 border-2 border-orange-200 bg-white/80 py-3 rounded-xl text-lg md:text-xl font-bold text-slate-700" onClick={() => alert('Share feature coming soon! Tell your friends about Budget Hero 💰')}>📤 Share Score</motion.button>
      </div>
    </motion.div>
  )
}
