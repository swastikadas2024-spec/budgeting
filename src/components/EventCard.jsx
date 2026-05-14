import React from 'react'
import { motion } from 'framer-motion'

export default function EventCard({ event, onChoose }) {
  const isPositive = event.amount < 0

  return (
    <motion.div
      initial={{ x: 120, opacity: 0, scale: 0.98 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -120, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className="rounded-3xl p-5 md:p-6 shadow-xl bg-white/85 border border-white/70"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">{event.title}</h3>
        <span className={`rounded-full px-3 py-1 text-sm md:text-base font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isPositive ? `+₹${Math.abs(event.amount)}` : `₹${event.amount}`}
        </span>
      </div>

      <p className="text-lg md:text-xl text-slate-700 mb-5 leading-snug">{event.text}</p>

      <div className="grid grid-cols-2 gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => onChoose('spend')} className="choice-btn choice-spend">
          Spend Now
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => onChoose('save')} className="choice-btn choice-save">
          Save Instead
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => onChoose('skip')} className="choice-btn choice-skip">
          Skip Today
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => onChoose('credit')} className="choice-btn choice-credit">
          Use Credit Card
        </motion.button>
      </div>
    </motion.div>
  )
}
