import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import EventCard from '../components/EventCard'

const SAVE_KEY = 'budget-hero-save-v2'
const STARTING_MONEY = 5000
const TOTAL_DAYS = 30

// Boss events that appear at key moments
const bossEvents = [
  {
    id: 'boss1',
    day: 10,
    type: 'challenge',
    title: '🏆 WEEK 2 MILESTONE: Multi-Challenge Day',
    text: 'This week gets intense! You face 2 major events today. Choose wisely!',
    amount: 0,
    isBoss: true,
    challenge: true,
  },
  {
    id: 'boss2',
    day: 20,
    type: 'challenge',
    title: '⚡ FINAL STRETCH: Economy Crisis!',
    text: 'Market crash! Unexpected expense surge. How will you survive?',
    amount: 500,
    isBoss: true,
    challenge: true,
  },
]

// Weekly missions/challenges
const getMissionForWeek = (weekNumber) => {
  const missions = [
    { week: 1, title: '💰 WEEK 1: Save at least ₹400', goal: 400, stat: 'savings' },
    { week: 2, title: '😊 WEEK 2: Keep happiness above 60', goal: 60, stat: 'happiness' },
    { week: 3, title: '🎯 WEEK 3: Skip spending 3+ times', goal: 3, stat: 'skipCount' },
    { week: 4, title: '🔥 WEEK 4: Achieve 5+ combo streak', goal: 5, stat: 'comboStreak' },
  ]
  return missions.find((m) => m.week === weekNumber) || missions[0]
}

const characterMods = {
  Gamer: { temptation: 1.15, social: 1, emergency: 1, positive: 1, creditPenalty: 1.15, saveBoost: 0.95 },
  Athlete: { temptation: 0.95, social: 0.9, emergency: 0.95, positive: 1, creditPenalty: 1, saveBoost: 1.1 },
  Artist: { temptation: 1, social: 1, emergency: 1, positive: 1.2, creditPenalty: 0.95, saveBoost: 1.05 },
}

const baseEvents = [
  { id: 1, type: 'temptation', title: '🎮 FLASH SALE', text: 'Your favorite game is available today for ₹1200.', amount: 1200, spendHappiness: 16, skipHappiness: -3, saveBonus: 220 },
  { id: 2, type: 'social', title: '🍕 Pizza Party', text: 'Friends invite you for pizza tonight. Entry cost is ₹350.', amount: 350, spendHappiness: 12, skipHappiness: -4, saveBonus: 150 },
  { id: 3, type: 'temptation', title: '🛍️ Sneaker Drop', text: 'Limited shoes launched at ₹1800. You really want them.', amount: 1800, spendHappiness: 20, skipHappiness: -6, saveBonus: 280 },
  { id: 4, type: 'emergency', title: '🚲 Broken Bicycle Chain', text: 'Repair needed to get to class. Repair cost is ₹900.', amount: 900, spendHappiness: 4, skipHappiness: -10, saveBonus: 170 },
  { id: 5, type: 'emergency', title: '💊 Medical Bill', text: 'You need medicine today. It costs ₹1400.', amount: 1400, spendHappiness: 2, skipHappiness: -14, saveBonus: 220 },
  { id: 6, type: 'positive', title: '🎁 Cashback Reward', text: 'You receive cashback from a previous purchase. +₹700 today.', amount: -700, spendHappiness: 8, skipHappiness: 0, saveBonus: 300 },
  { id: 7, type: 'social', title: '🎂 Friend Birthday Gift', text: 'A thoughtful gift costs ₹600. What will you do?', amount: 600, spendHappiness: 9, skipHappiness: -5, saveBonus: 180 },
  { id: 8, type: 'positive', title: '📚 Scholarship Bonus', text: 'Great grades unlocked a bonus. +₹1100 earned.', amount: -1100, spendHappiness: 10, skipHappiness: 0, saveBonus: 400 },
  { id: 9, type: 'temptation', title: '🍟 Snack Rush', text: 'A tasty snack combo is tempting you for ₹250.', amount: 250, spendHappiness: 7, skipHappiness: -2, saveBonus: 120 },
  { id: 10, type: 'social', title: '🎬 Movie Invite', text: 'Your friends want to watch a movie. Ticket costs ₹500.', amount: 500, spendHappiness: 11, skipHappiness: -4, saveBonus: 170 },
  { id: 11, type: 'positive', title: '💸 Small Gift From Family', text: 'You get a surprise cash gift of +₹500.', amount: -500, spendHappiness: 6, skipHappiness: 0, saveBonus: 200 },
  { id: 12, type: 'emergency', title: '📱 Phone Recharge', text: 'Your phone needs recharge. It costs ₹300.', amount: 300, spendHappiness: 3, skipHappiness: -6, saveBonus: 100 },
]

function safeParseSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getPersonality(happiness, savings, credit, money) {
  const score = happiness * 0.28 + savings * 0.003 + credit * 0.22 + money * 0.08
  if (score >= 230) return 'Smart Planner'
  if (score >= 185) return 'Balanced Explorer'
  return 'Impulse Learner'
}

function playTone(kind = 'tap') {
  if (typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = kind === 'bad' ? 'sawtooth' : 'triangle'
    oscillator.frequency.value = kind === 'good' ? 660 : kind === 'cash' ? 520 : kind === 'bad' ? 180 : 420
    gain.gain.value = 0.06
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.12)
  } catch {
    // Audio should never block play.
  }
}

function createStateFromSaved(savedData, profileType, difficulty = 'Normal') {
  if (!savedData) {
    return {
      day: 1,
      money: STARTING_MONEY,
      happiness: 70,
      savings: 500,
      credit: 720,
      pendingEffects: [],
      achievements: [],
      recentLog: [],
      goodStreak: 0,
      comboStreak: 0,
      skipCount: 0,
      showGuide: true,
      difficulty,
    }
  }

  return {
    day: savedData.day || 1,
    money: savedData.money ?? STARTING_MONEY,
    happiness: savedData.happiness ?? 70,
    savings: savedData.savings ?? 500,
    credit: savedData.credit ?? 720,
    pendingEffects: savedData.pendingEffects || [],
    achievements: savedData.achievements || [],
    recentLog: savedData.recentLog || [],
    goodStreak: savedData.goodStreak || 0,
    comboStreak: savedData.comboStreak || 0,
    skipCount: savedData.skipCount || 0,
    showGuide: false,
    profileType: savedData.profileType || profileType || 'Gamer',
    difficulty: savedData.difficulty || difficulty || 'Normal',
  }
}

function adjustEvent(event, profileType, difficulty = 'Normal') {
  const mods = characterMods[profileType] || characterMods.Gamer
  
  // Difficulty scaling
  const difficultyMultiplier = difficulty === 'Easy' ? 0.7 : difficulty === 'Hard' ? 1.3 : 1
  
  return {
    ...event,
    amount: event.amount >= 0 ? Math.round(event.amount * (mods[event.type] || 1) * difficultyMultiplier) : event.amount,
    spendHappiness: Math.round(event.spendHappiness * (mods[event.type] || 1)),
    skipHappiness: Math.round(event.skipHappiness * (mods[event.type] || 1)),
    saveBonus: Math.round(event.saveBonus * mods.saveBoost * difficultyMultiplier),
    profileHint: profileType,
  }
}

export default function GameScreen({ profile, resumeData, onSaveGame, onEnd }) {
  const startState = useMemo(() => createStateFromSaved(resumeData || safeParseSaved(), profile.type, profile.difficulty), [profile.type, profile.difficulty, resumeData])
  const [day, setDay] = useState(startState.day)
  const [money, setMoney] = useState(startState.money)
  const [happiness, setHappiness] = useState(startState.happiness)
  const [savings, setSavings] = useState(startState.savings)
  const [credit, setCredit] = useState(startState.credit)
  const [pendingEffects, setPendingEffects] = useState(startState.pendingEffects)
  const [achievements, setAchievements] = useState(startState.achievements)
  const [recentLog, setRecentLog] = useState(startState.recentLog)
  const [goodStreak, setGoodStreak] = useState(startState.goodStreak)
  const [comboStreak, setComboStreak] = useState(startState.comboStreak)
  const [skipCount, setSkipCount] = useState(startState.skipCount)
  const [showGuide, setShowGuide] = useState(startState.showGuide)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [lastImpact, setLastImpact] = useState(null)
  const [floatingText, setFloatingText] = useState('')
  const [clickFeedback, setClickFeedback] = useState(null)
  const [streakCelebration, setStreakCelebration] = useState(false)
  const [difficulty] = useState(startState.difficulty)
  const [isBossEvent, setIsBossEvent] = useState(false)
  const [bossProgress, setBossProgress] = useState(0)

  const financialHealth = useMemo(() => {
    if (money < 800 || happiness < 35) return 'danger'
    if (money < 1800 || happiness < 55) return 'warning'
    return 'good'
  }, [money, happiness])

  function spawnEvent(nextDay = day) {
    // Check for boss events
    const boss = bossEvents.find((b) => b.day === nextDay)
    if (boss) {
      setIsBossEvent(true)
      setBossProgress(0)
      setCurrentEvent({ ...boss, uid: `${boss.id}-${nextDay}` })
      return
    }

    setIsBossEvent(false)
    const profileBias = profile.type === 'Gamer' ? 'temptation' : profile.type === 'Athlete' ? 'social' : 'positive'
    
    // Difficulty affects event frequency
    let eventPool = baseEvents
    if (difficulty === 'Easy' && Math.random() < 0.3) {
      // Less frequent events on Easy
      eventPool = baseEvents.filter((e) => e.type !== 'temptation')
    } else if (difficulty === 'Hard' && Math.random() < 0.4) {
      // More temptation events on Hard
      eventPool = baseEvents.filter((e) => e.type === 'temptation')
    }
    
    const weightedPool = Math.random() < 0.5 ? eventPool.filter((event) => event.type === profileBias) : eventPool
    const event = weightedPool[Math.floor(Math.random() * weightedPool.length)]
    setCurrentEvent({ ...adjustEvent(event, profile.type, difficulty), uid: `${event.id}-${nextDay}-${Date.now()}` })
  }

  useEffect(() => {
    spawnEvent(day)
  }, [])

  useEffect(() => {
    if (savings >= 2000 && !achievements.includes('💾 Smart Saver')) {
      setAchievements((prev) => [...prev, '💾 Smart Saver'])
      playTone('good')
    }
    if (credit >= 760 && !achievements.includes('🛡️ Credit Captain')) {
      setAchievements((prev) => [...prev, '🛡️ Credit Captain'])
    }
    if (goodStreak >= 3 && !achievements.includes('🔥 Decision Streak')) {
      setAchievements((prev) => [...prev, '🔥 Decision Streak'])
    }
    if (comboStreak >= 5 && !achievements.includes('🌟 Combo Master')) {
      setAchievements((prev) => [...prev, '🌟 Combo Master'])
      playTone('good')
    }
    if (skipCount >= 3 && !achievements.includes('⏭️ Master Skipper')) {
      setAchievements((prev) => [...prev, '⏭️ Master Skipper'])
    }
    if (difficulty === 'Hard' && day >= TOTAL_DAYS && money > 0 && !achievements.includes('⚡ Hard Mode Hero')) {
      setAchievements((prev) => [...prev, '⚡ Hard Mode Hero'])
    }
    if (day >= TOTAL_DAYS && money > 0 && !achievements.includes('🏆 Month Survivor')) {
      setAchievements((prev) => [...prev, '🏆 Month Survivor'])
    }
  }, [savings, credit, goodStreak, comboStreak, skipCount, day, money, difficulty, achievements])

  useEffect(() => {
    onSaveGame({
      profileType: profile.type,
      day,
      money,
      happiness,
      savings,
      credit,
      pendingEffects,
      achievements,
      recentLog,
      goodStreak,
      comboStreak,
      skipCount,
      difficulty,
    })

    localStorage.setItem(SAVE_KEY, JSON.stringify({
      profileType: profile.type,
      day,
      money,
      happiness,
      savings,
      credit,
      pendingEffects,
      achievements,
      recentLog,
      goodStreak,
      comboStreak,
      skipCount,
      difficulty,
    }))
  }, [day, money, happiness, savings, credit, pendingEffects, achievements, recentLog, goodStreak, comboStreak, skipCount, difficulty, profile.type, onSaveGame])

  function finishDay(nextMoney, nextHappiness, nextSavings, nextCredit, logText) {
    const nextDay = day + 1
    const dueEffects = pendingEffects.filter((effect) => effect.day === nextDay)
    const keptEffects = pendingEffects.filter((effect) => effect.day !== nextDay)

    let moneyAfter = nextMoney
    let happinessAfter = nextHappiness
    let creditAfter = nextCredit
    const dueTexts = []

    dueEffects.forEach((effect) => {
      moneyAfter += effect.moneyDelta || 0
      happinessAfter += effect.happinessDelta || 0
      creditAfter += effect.creditDelta || 0
      dueTexts.push(effect.text)
      if (effect.kind === 'bad') playTone('bad')
    })

    if (moneyAfter < 700) happinessAfter -= 5
    if (moneyAfter < 0) {
      happinessAfter -= 10
      creditAfter -= 20
      dueTexts.push('⚠️ You ran out of cash and felt financial stress.')
      playTone('bad')
    }

    const safeMoney = Math.round(moneyAfter)
    const safeHappiness = clamp(Math.round(happinessAfter), 0, 100)
    const safeSavings = Math.max(0, Math.round(nextSavings))
    const safeCredit = clamp(Math.round(creditAfter), 300, 900)

    setMoney(safeMoney)
    setHappiness(safeHappiness)
    setSavings(safeSavings)
    setCredit(safeCredit)
    setPendingEffects(keptEffects)

    const summary = [`Day ${day}: ${logText}`, ...dueTexts].join(' ')
    setRecentLog((prev) => [summary, ...prev].slice(0, 5))

    if (logText.includes('saved') || logText.includes('protected')) {
      setGoodStreak((prev) => prev + 1)
      setComboStreak((prev) => prev + 1)
    } else if (logText.includes('credit') || logText.includes('spent')) {
      setGoodStreak(0)
      setComboStreak(0)
    } else {
      setComboStreak(0)
    }

    if (logText.includes('skipped')) {
      setSkipCount((prev) => prev + 1)
    }

    setFloatingText(summary.slice(0, 70))
    setTimeout(() => setFloatingText(''), 1200)

    if (nextDay > TOTAL_DAYS) {
      playTone('good')
      onEnd({
        money: safeMoney,
        happiness: safeHappiness,
        savings: safeSavings,
        credit: safeCredit,
        personality: getPersonality(safeHappiness, safeSavings, safeCredit, safeMoney),
        achievements,
      })
      return
    }

    setDay(nextDay)
    spawnEvent(nextDay)
  }

  function handleChoice(action) {
    if (!currentEvent) return
    playTone(action === 'credit' ? 'bad' : action === 'save' ? 'good' : 'tap')

    const eventAmount = currentEvent.amount
    let nextMoney = money
    let nextHappiness = happiness
    let nextSavings = savings
    let nextCredit = credit
    let logText = ''
    
    // Combo multiplier bonus
    const comboBonus = comboStreak >= 3 ? 1.2 : comboStreak >= 1 ? 1.1 : 1

    if (action === 'spend') {
      nextMoney -= Math.max(0, eventAmount)
      nextHappiness += currentEvent.spendHappiness
      nextCredit += eventAmount > 0 ? 3 : 0
      logText = `You spent ₹${Math.max(0, eventAmount)} and enjoyed the moment.`
    }

    if (action === 'skip') {
      nextHappiness += currentEvent.skipHappiness
      if (currentEvent.type === 'emergency') {
        setPendingEffects((prev) => [...prev, { day: day + 3, moneyDelta: -400, happinessDelta: -5, creditDelta: -6, kind: 'bad', text: '🔧 Skipping earlier repair caused a bigger expense later (₹400).' }])
      }
      nextCredit += 2
      logText = 'You skipped spending and protected your budget.'
    }

    if (action === 'save') {
      const transfer = Math.min(currentEvent.saveBonus, Math.max(0, money))
      nextMoney -= transfer
      nextSavings += Math.round(transfer * (characterMods[profile.type]?.saveBoost || 1) * comboBonus)
      nextHappiness += 4
      nextCredit += 5
      logText = `You saved ₹${transfer}${comboStreak >= 1 ? ' 🔥 COMBO BONUS!' : ''} and grew your future power.`
    }

    if (action === 'credit') {
      if (eventAmount <= 0) {
        nextMoney += Math.abs(eventAmount)
        nextHappiness += 6
        logText = 'A positive reward landed in your pocket.'
      } else {
        nextHappiness += Math.max(2, currentEvent.spendHappiness - 4)
        nextCredit -= Math.round(18 * (characterMods[profile.type]?.creditPenalty || 1))
        setPendingEffects((prev) => [...prev, { day: day + 5, moneyDelta: -Math.round(eventAmount * 1.15), happinessDelta: -6, creditDelta: -8, kind: 'bad', text: `💳 Credit bill arrived: ₹${Math.round(eventAmount * 1.15)} with interest.` }])
        logText = 'You used credit. Fun now, but a bigger bill is coming.'
      }
    }

    setLastImpact({
      money: Math.round(nextMoney - money),
      happiness: Math.round(nextHappiness - happiness),
      savings: Math.round(nextSavings - savings),
      credit: Math.round(nextCredit - credit),
    })

    if (action === 'save') {
      setClickFeedback({ type: 'save', text: comboStreak >= 2 ? `🔥 COMBO x${comboStreak}!` : '✨ Future You Thanks You!' })
      if (comboStreak >= 3) setStreakCelebration(true)
    } else if (action === 'credit') {
      setClickFeedback({ type: 'warning', text: '⚠️ Bill Coming Later!' })
    } else if (action === 'skip') {
      setClickFeedback({ type: 'positive', text: '💪 Smart Choice!' })
    } else {
      setClickFeedback({ type: 'neutral', text: '🎉 Experience Gained!' })
    }

    setTimeout(() => setClickFeedback(null), 1500)
    setTimeout(() => setStreakCelebration(false), 1200)

    finishDay(nextMoney, nextHappiness, nextSavings, nextCredit, logText)
  }

  const guideSteps = [
    'Spend, save, skip, or use credit.',
    'Emergencies hit harder if savings are low.',
    'Credit gives quick relief but a later bill.',
    'Build streaks for combo bonuses! 🔥',
    'Survive boss events at Day 10 & Day 20.',
  ]

  const currentWeek = Math.ceil(day / 7)
  const weekMission = getMissionForWeek(currentWeek)
  const progressPercent = (day / TOTAL_DAYS) * 100

  return (
    <div className={`w-full max-w-5xl glass-panel p-5 md:p-7 ${financialHealth === 'danger' ? 'ring-2 ring-rose-300' : financialHealth === 'warning' ? 'ring-2 ring-amber-300' : 'ring-2 ring-emerald-300'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="kid-heading text-3xl md:text-5xl">Budget Hero Arena</h2>
        <div className="flex gap-2">
          <div className="rounded-2xl bg-white/80 px-4 py-2 text-base md:text-xl font-extrabold text-slate-700">📅 Day {day}/{TOTAL_DAYS}</div>
          <div className={`rounded-2xl px-4 py-2 text-base md:text-xl font-extrabold text-white ${difficulty === 'Easy' ? 'bg-green-500' : difficulty === 'Hard' ? 'bg-red-500' : 'bg-yellow-500'}`}>{difficulty}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold text-slate-700">Month Progress: Week {currentWeek}/4</span>
          <span className="text-sm font-bold text-slate-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Combo Counter & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-r from-orange-100 to-red-100 p-3 border-2 border-orange-300">
          <p className="text-sm font-bold text-slate-600">🔥 Combo Streak</p>
          <p className="text-2xl font-extrabold text-red-600">{comboStreak} Consecutive Good Choices</p>
          <p className="text-xs text-slate-600 mt-1">Keep it going for bonus saves!</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 p-3 border-2 border-blue-300">
          <p className="text-sm font-bold text-slate-600">🎯 Week {currentWeek} Mission</p>
          <p className="text-lg font-extrabold text-blue-600">{weekMission.title}</p>
        </div>
      </div>

      {/* Boss Event Alert */}
      {isBossEvent && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 rounded-xl bg-gradient-to-r from-red-200 to-yellow-200 p-4 border-4 border-red-500 text-center"
        >
          <p className="text-lg md:text-2xl font-extrabold text-red-700">⚡ BOSS CHALLENGE ⚡</p>
          <p className="text-sm text-red-600 mt-1">Make your best choices now! This is a critical test!</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div className="stat-card" layout>
          <div className="stat-label">💰 Money</div>
          <motion.div className="stat-value" key={money} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            ₹{money}
          </motion.div>
        </motion.div>
        <motion.div className="stat-card" layout>
          <div className="stat-label">😊 Happiness</div>
          <motion.div className="stat-value" key={happiness} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            {happiness}
          </motion.div>
        </motion.div>
        <motion.div className="stat-card" layout>
          <div className="stat-label">🏦 Savings</div>
          <motion.div className="stat-value" key={savings} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            ₹{savings}
          </motion.div>
        </motion.div>
        <motion.div className="stat-card" layout>
          <div className="stat-label">⭐ Credit</div>
          <motion.div className="stat-value" key={credit} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
            {credit}
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between text-base md:text-xl font-bold text-slate-700">
        <div>Profile: {profile.type}</div>
        <button className="rounded-xl border-2 border-sky-200 bg-white/80 px-4 py-2" onClick={() => setShowGuide((prev) => !prev)}>{showGuide ? 'Hide Tips' : 'Show Tips'}</button>
      </div>

      {showGuide && (
        <div className="mt-4 rounded-2xl bg-white/75 p-4">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-slate-800">Game Guide</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {guideSteps.map((step) => <p key={step} className="text-base md:text-lg text-slate-700">• {step}</p>)}
          </div>
        </div>
      )}

      <div className="my-5 relative">
        <AnimatePresence mode="wait">
          {currentEvent && <EventCard key={currentEvent.uid} event={currentEvent} onChoose={handleChoice} />}
        </AnimatePresence>

        {/* Click Feedback Animations */}
        <AnimatePresence>
          {clickFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className={`absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold text-lg md:text-xl whitespace-nowrap ${
                clickFeedback.type === 'save' ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' :
                clickFeedback.type === 'warning' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                clickFeedback.type === 'positive' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' :
                'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
              }`}
            >
              {clickFeedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Celebration */}
        <AnimatePresence>
          {streakCelebration && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 1, x: Math.cos((i / 8) * Math.PI * 2) * 60, y: Math.sin((i / 8) * Math.PI * 2) * 60 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
                >
                  ⭐
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Floating Text */}
        <AnimatePresence>
          {floatingText && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="impact-chip mb-4">{floatingText}</motion.div>
          )}
        </AnimatePresence>

        {/* Impact Summary */}
        <AnimatePresence>
          {lastImpact && (
            <motion.div key={`${day}-${lastImpact.money}-${lastImpact.happiness}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="impact-chip">
              {lastImpact.money !== 0 && <span>{lastImpact.money > 0 ? '+' : ''}₹{lastImpact.money} money</span>}
              {lastImpact.happiness !== 0 && <span>{lastImpact.happiness > 0 ? '+' : ''}{lastImpact.happiness} happiness</span>}
              {lastImpact.savings !== 0 && <span>{lastImpact.savings > 0 ? '+' : ''}₹{lastImpact.savings} savings</span>}
              {lastImpact.credit !== 0 && <span>{lastImpact.credit > 0 ? '+' : ''}{lastImpact.credit} credit</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/70 p-4">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Recent Consequences</h3>
          {recentLog.length === 0 && <p className="text-slate-600 text-base md:text-lg">Make a choice to begin your story.</p>}
          {recentLog.map((entry) => <p key={entry} className="text-slate-700 text-base md:text-lg mb-1">• {entry}</p>)}
        </div>

        <div className="rounded-2xl bg-white/70 p-4">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Achievements</h3>
          {achievements.length === 0 && <p className="text-slate-600 text-base md:text-lg">No badges yet. Smart choices unlock them.</p>}
          {achievements.map((badge) => <p key={badge} className="text-slate-700 text-base md:text-lg mb-1">🏅 {badge}</p>)}
        </div>
      </div>
    </div>
  )
}