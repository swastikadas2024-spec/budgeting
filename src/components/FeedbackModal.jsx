import React from 'react'
import { motion } from 'framer-motion'

export default function FeedbackModal({ isOpen, impact, feedback, onNext }) {
  if (!isOpen) return null
  const borderColor = feedback?.type === 'save' ? 'border-green-500' : feedback?.type === 'warning' ? 'border-red-500' : 'border-yellow-400'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/70" />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} className={`relative glass-panel rounded-3xl p-6 max-w-lg w-full ${borderColor}`}>
        <div className="text-center mb-3 animate-pop-in">
          <div className="text-6xl">{feedback?.emoji || '✨'}</div>
          <div className="font-display text-lg mt-2 text-shadow-gold">{feedback?.title || 'Result'}</div>
          <div className="text-ui text-sm mt-1">{feedback?.text}</div>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          {impact && Object.entries(impact).map(([k, v]) => (
            <div key={k} className={`px-3 py-2 rounded-full font-display text-xs ${v > 0 ? 'bg-green-600/20 border border-green-600' : v < 0 ? 'bg-red-600/12 border border-red-600' : 'bg-blue-600/12 border border-blue-600'}`}>
              {k.toUpperCase()}: {v > 0 ? '+' : ''}{v}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onNext} className="gold-3d font-display px-6 py-3 rounded-2xl">NEXT DAY ▶</button>
        </div>
      </motion.div>
    </div>
  )
}
