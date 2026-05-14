import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function SpendingHeatmap({ result }) {
  // Generate daily spending data based on result
  const dailyData = useMemo(() => {
    const startMoney = 5000
    const endMoney = result.money
    const totalSpent = startMoney + (result.savings - 500) - endMoney
    
    // Estimate daily spending (simplified - distribute across 30 days)
    // For a proper implementation, you'd track this during gameplay
    const avgDailySpending = totalSpent / 30
    const days = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      spending: Math.max(0, Math.round(avgDailySpending + (Math.random() - 0.5) * avgDailySpending)),
    }))
    
    return days
  }, [result])

  const maxSpending = Math.max(...dailyData.map(d => d.spending), 1)
  const weeks = [
    dailyData.slice(0, 7),
    dailyData.slice(7, 14),
    dailyData.slice(14, 21),
    dailyData.slice(21, 30),
  ]

  const getColor = (spending) => {
    if (spending === 0) return 'bg-slate-100'
    const intensity = spending / maxSpending
    if (intensity < 0.25) return 'bg-emerald-100'
    if (intensity < 0.5) return 'bg-emerald-300'
    if (intensity < 0.75) return 'bg-orange-300'
    return 'bg-red-400'
  }

  const weeklyTotals = weeks.map((week, idx) => ({
    week: `W${idx + 1}`,
    total: week.reduce((sum, day) => sum + day.spending, 0),
  }))

  const maxWeekly = Math.max(...weeklyTotals.map(w => w.total), 1)

  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4">📊 Spending Patterns</h3>
      
      {/* Weekly Summary */}
      <div className="mb-6">
        <p className="text-lg font-bold text-slate-700 mb-3">Weekly Spending Summary</p>
        <div className="flex items-end gap-2 h-32 bg-slate-50 p-4 rounded-xl">
          {weeklyTotals.map((week) => (
            <motion.div
              key={week.week}
              className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg flex flex-col items-center justify-end"
              initial={{ height: 0 }}
              animate={{ height: `${(week.total / maxWeekly) * 100}%` }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-xs font-bold text-white mb-1">{week.week}</div>
              <div className="text-xs font-bold text-slate-700 bg-white/80 px-2 py-1 rounded mb-1">
                ₹{week.total}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Heatmap */}
      <div>
        <p className="text-lg font-bold text-slate-700 mb-3">Daily Spending Heatmap (30-Day View)</p>
        <div className="space-y-2">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex gap-1 items-center">
              <span className="text-xs font-bold text-slate-600 w-12">W{weekIdx + 1}:</span>
              <div className="flex gap-1 flex-wrap">
                {week.map((day) => (
                  <motion.div
                    key={day.day}
                    className={`w-8 h-8 rounded-md ${getColor(day.spending)} border border-slate-300 flex items-center justify-center cursor-pointer group relative`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: day.day * 0.02 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="text-xs font-bold text-slate-700">{day.day}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      Day {day.day}: ₹{day.spending}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 rounded border border-slate-300" />
            <span className="text-slate-700">No spending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 rounded border border-slate-300" />
            <span className="text-slate-700">Low (0-25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-300 rounded border border-slate-300" />
            <span className="text-slate-700">Medium (25-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-300 rounded border border-slate-300" />
            <span className="text-slate-700">High (50-75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-400 rounded border border-slate-300" />
            <span className="text-slate-700">Very High (75%+)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
