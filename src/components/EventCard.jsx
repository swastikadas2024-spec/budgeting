import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function EventCard({ event, onChoose }) {
  const isPositive = event.amount < 0
  const [hoveredButton, setHoveredButton] = useState(null)
  const [ripples, setRipples] = useState([])

  const handleButtonClick = (choice, e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples([newRipple])
    
    setTimeout(() => setRipples([]), 600)
    onChoose(choice)
  }

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
        <motion.span
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`rounded-full px-3 py-1 text-sm md:text-base font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
        >
          {isPositive ? `+₹${Math.abs(event.amount)}` : `₹${event.amount}`}
        </motion.span>
      </div>

      <p className="text-lg md:text-xl text-slate-700 mb-5 leading-snug">{event.text}</p>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredButton('spend')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={(e) => handleButtonClick('spend', e)}
            className="w-full relative overflow-hidden choice-btn choice-spend bg-orange-400 transition-all duration-300 font-bold text-white shadow-lg hover:shadow-xl"
          >
            <motion.div animate={hoveredButton === 'spend' ? { scale: 1.1 } : { scale: 1 }} className="flex items-center justify-center gap-2">
              <span>🛍️</span>
              <span className="hidden sm:inline">Spend Now</span>
              <span className="sm:hidden">Spend</span>
            </motion.div>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  width: 40,
                  height: 40,
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                }}
              />
            ))}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredButton('save')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={(e) => handleButtonClick('save', e)}
            className="w-full relative overflow-hidden choice-btn choice-save bg-emerald-400 transition-all duration-300 font-bold text-white shadow-lg hover:shadow-xl"
          >
            <motion.div animate={hoveredButton === 'save' ? { scale: 1.1 } : { scale: 1 }} className="flex items-center justify-center gap-2">
              <span>🏦</span>
              <span className="hidden sm:inline">Save Instead</span>
              <span className="sm:hidden">Save</span>
            </motion.div>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  width: 40,
                  height: 40,
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                }}
              />
            ))}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredButton('skip')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={(e) => handleButtonClick('skip', e)}
            className="w-full relative overflow-hidden choice-btn choice-skip bg-blue-400 transition-all duration-300 font-bold text-white shadow-lg hover:shadow-xl"
          >
            <motion.div animate={hoveredButton === 'skip' ? { scale: 1.1 } : { scale: 1 }} className="flex items-center justify-center gap-2">
              <span>⏭️</span>
              <span className="hidden sm:inline">Skip Today</span>
              <span className="sm:hidden">Skip</span>
            </motion.div>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  width: 40,
                  height: 40,
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                }}
              />
            ))}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredButton('credit')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={(e) => handleButtonClick('credit', e)}
            className="w-full relative overflow-hidden choice-btn choice-credit bg-rose-400 transition-all duration-300 font-bold text-white shadow-lg hover:shadow-xl"
          >
            <motion.div animate={hoveredButton === 'credit' ? { scale: 1.1 } : { scale: 1 }} className="flex items-center justify-center gap-2">
              <span>💳</span>
              <span className="hidden sm:inline">Use Credit</span>
              <span className="sm:hidden">Credit</span>
            </motion.div>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  width: 40,
                  height: 40,
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                }}
              />
            ))}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
