import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function FinancialDashboard({ result }) {
  const safeResult = result || {}
  const money = Number.isFinite(safeResult.money) ? safeResult.money : 0
  const savings = Number.isFinite(safeResult.savings) ? safeResult.savings : 0
  const happiness = Number.isFinite(safeResult.happiness) ? safeResult.happiness : 0
  const credit = Number.isFinite(safeResult.credit) ? safeResult.credit : 720

  // Calculate spending categories based on typical student spending
  const spendingData = useMemo(() => {
    const spent = Math.max(0, 5000 - money)
    const estimatedSpending = {
      'Food & Snacks': Math.round(spent * 0.25),
      'Social & Entertainment': Math.round(spent * 0.20),
      'Emergencies': Math.round(spent * 0.18),
      'Shopping': Math.round(spent * 0.20),
      'Other': Math.round(spent * 0.17),
    }
    return Object.entries(estimatedSpending).map(([name, value]) => ({ name, value }))
  }, [money])

  // Financial health gauge data
  const healthMetrics = [
    { label: 'Money Left', value: money, max: 5000, color: '#10b981', icon: '💰' },
    { label: 'Savings', value: savings, max: 5000, color: '#3b82f6', icon: '🏦' },
    { label: 'Happiness', value: happiness, max: 100, color: '#f59e0b', icon: '😊' },
    { label: 'Credit Score', value: credit, max: 900, color: '#8b5cf6', icon: '⭐' },
  ]

  // Performance comparison
  const performanceData = [
    { metric: 'Money', value: (money / 5000) * 100, target: 60 },
    { metric: 'Savings', value: (savings / 5000) * 100, target: 40 },
    { metric: 'Happiness', value: happiness, target: 70 },
    { metric: 'Credit', value: (credit / 900) * 100, target: 75 },
  ]

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 p-2 rounded shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">₹{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Health Metrics Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {healthMetrics.map((metric, idx) => {
          const percentage = (metric.value / metric.max) * 100
          return (
            <div key={idx} className="bg-gradient-to-br from-white/80 to-white/60 rounded-xl p-4 shadow-sm border border-white/50">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className="text-xs text-gray-600 mb-2">{metric.label}</div>
              <div className="text-xl font-bold text-gray-800 mb-2">{metric.value}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ backgroundColor: metric.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Spending Breakdown Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💸 Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={spendingData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ₹${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance vs Target */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Performance vs Target</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Your Score" />
              <Bar dataKey="target" fill="#10b981" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Financial Health Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-blue-50/70 to-purple-50/70 rounded-2xl p-5 border border-white/50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">📈 Financial Health Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Total Spent</span>
            <span className="font-bold text-lg text-red-600">₹{5000 - money}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Savings Rate</span>
            <span className="font-bold text-lg text-green-600">{((savings / 5000) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Financial Stability</span>
            <span className={`font-bold text-lg ${result.money > 2000 ? 'text-green-600' : result.money > 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
              {money > 2000 ? '✅ Strong' : money > 1000 ? '⚠️ Moderate' : '❌ At Risk'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Overall Score</span>
            <span className="font-bold text-lg text-purple-600">
              {(((money / 5000) + (savings / 5000) + (happiness / 100) + (credit / 900)) / 4 * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
