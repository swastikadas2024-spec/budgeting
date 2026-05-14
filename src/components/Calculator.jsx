import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Calculator({ onSaveCalculation }) {
  const [isOpen, setIsOpen] = useState(false)
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [savedCalcs, setSavedCalcs] = useState([])

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (op) => {
    const currentValue = parseFloat(display)
    
    if (prevValue === null) {
      setPrevValue(currentValue)
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(String(result))
      setPrevValue(result)
    }
    
    setOperation(op)
    setWaitingForNewValue(true)
  }

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return current !== 0 ? prev / current : 0
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const currentValue = parseFloat(display)
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(String(Math.round(result * 100) / 100))
      setPrevValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleSave = () => {
    const calc = {
      id: Date.now(),
      result: display,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setSavedCalcs([calc, ...savedCalcs])
    if (onSaveCalculation) {
      onSaveCalculation(display)
    }
  }

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ]

  return (
    <>
      {/* Floating Calculator Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl font-bold shadow-lg hover:shadow-xl z-40"
      >
        🧮
      </motion.button>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-extrabold text-slate-800">Calculator</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Display */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-xl mb-4 text-right">
                <div className="text-sm font-semibold text-slate-400 mb-1">
                  {operation && prevValue !== null ? `${prevValue} ${operation}` : ''}
                </div>
                <div className="text-4xl font-extrabold break-words">{display}</div>
              </div>

              {/* Buttons Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {buttons.map((row) =>
                  row.map((btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === '=') {
                          handleEquals()
                        } else if (btn === '.') {
                          handleDecimal()
                        } else if (['+', '-', '*', '/'].includes(btn)) {
                          handleOperation(btn)
                        } else {
                          handleNumber(parseInt(btn))
                        }
                      }}
                      className={`py-3 rounded-lg font-bold text-lg transition ${
                        btn === '='
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                          : ['+', '-', '*', '/'].includes(btn)
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                          : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      {btn}
                    </button>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleClear}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                >
                  Clear
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>

              {/* Saved Calculations */}
              {savedCalcs.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-slate-200">
                  <p className="text-sm font-bold text-slate-600 mb-2">💾 Saved Calculations</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {savedCalcs.map((calc) => (
                      <div
                        key={calc.id}
                        className="bg-slate-50 p-2 rounded text-sm flex justify-between items-center"
                      >
                        <span className="font-semibold text-slate-700">₹{calc.result}</span>
                        <span className="text-xs text-slate-500">{calc.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
