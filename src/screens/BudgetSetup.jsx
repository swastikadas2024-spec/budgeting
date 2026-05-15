import React, { useEffect, useState } from 'react'

export default function BudgetSetup({ profile, onConfirm, onCancel }) {
  const TOTAL = 5000
  const [alloc, setAlloc] = useState({ food: 1000, fun: 1000, school: 1000, savings: 1000 })
  const totalAlloc = alloc.food + alloc.fun + alloc.school + alloc.savings
  const remaining = TOTAL - totalAlloc
  const isOverBudget = remaining < 0

  function updateCat(cat, val) {
    setAlloc((s) => ({ ...s, [cat]: Number(val) }))
  }

  return (
    <div className="w-full max-w-2xl glass-panel p-6 md:p-8 font-ui">
      <h1 className="font-display text-2xl mb-2" style={{ color: 'var(--green)' }}>SET YOUR BUDGET</h1>
      <div className="mb-4 text-4xl font-display" style={{ color: 'var(--gold)' }}>₹{TOTAL.toLocaleString()}</div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          ['food', 'Food🍕', '#FFD700'],
          ['fun', 'Fun🎉', '#40C4FF'],
          ['school', 'School📚', '#00E676'],
          ['savings', 'Savings💰', '#CE93D8'],
        ].map(([key, label, color]) => (
          <div key={key} className="p-3 rounded-xl" style={{ background: 'var(--panel)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/85 font-ui">{label}</div>
              <div style={{ color }} className="font-ui font-bold">₹{alloc[key]}</div>
            </div>
            <input aria-label={label} type="range" min="0" max={TOTAL} value={alloc[key]} onChange={(e) => updateCat(key, e.target.value)} style={{ accentColor: color }} className="w-full" />
          </div>
        ))}
      </div>

      <div className="mb-4 p-3 rounded-lg" style={{ background: totalAlloc === TOTAL ? 'rgba(0,230,118,0.06)' : isOverBudget ? 'rgba(255,82,82,0.06)' : 'rgba(255,215,0,0.04)' }}>
        <div className="flex justify-between items-center">
          <div className="text-sm font-bold text-white/85">Remaining</div>
          <div className="font-ui font-bold" style={{ color: isOverBudget ? 'var(--red)' : totalAlloc === TOTAL ? 'var(--green)' : 'var(--gold)' }}>
            {isOverBudget ? `Over by ₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()}`}
          </div>
        </div>
        {isOverBudget && (
          <div className="mt-2 text-sm font-bold" style={{ color: 'var(--red)' }}>
            Cut any slider until you are back within ₹{TOTAL.toLocaleString()}.
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 gold-3d font-display py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => !isOverBudget && onConfirm(alloc)}
          disabled={isOverBudget}
        >
          {isOverBudget ? 'FIX BUDGET FIRST' : "LET'S GO!"}
        </button>
        <button className="flex-1 border rounded-xl py-3" onClick={onCancel}>Back</button>
      </div>
    </div>
  )
}
