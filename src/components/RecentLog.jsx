import React from 'react'
import { motion } from 'framer-motion'

export default function RecentLog({ entries = [] }) {
  const slice = entries.slice(0, 4)
  return (
    <div>
      <div className="text-xs uppercase tracking-wider mb-2">Recent Choices</div>
      <div className="space-y-2">
        {slice.map((entry, idx) => (
          <motion.div key={entry + idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`p-3 rounded-lg bg-[rgba(37,37,80,0.9)] border-l-4 ${entry.includes('saved') || entry.includes('protected') ? 'border-green-500' : entry.includes('spent') || entry.includes('credit') ? 'border-red-500' : 'border-blue-400'}`}>
            <div className="font-display text-xxs text-white/70">{entry.split(':')[0]}</div>
            <div className="text-sm text-white">{entry}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
