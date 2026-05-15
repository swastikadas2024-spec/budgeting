export function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = 600
    g.gain.setValueAtTime(0.1, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    o.start(); o.stop(ctx.currentTime + 0.1)
  } catch (e) {
    // silent
  }
}

export function spawnCoinBurst(emoji = '💰') {
  if (typeof document === 'undefined') return
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed; font-size:24px; left:${40 + Math.random() * 20}%; top:40%; z-index:200; pointer-events:none;` +
      `--tx:${(Math.random() - 0.5) * 200}px; --ty:-${100 + Math.random() * 100}px;`
    el.className = 'coin-fly'
    el.textContent = emoji
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 900 + i * 80)
  }
}
