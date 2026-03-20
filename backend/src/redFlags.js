const FLAG_PATTERNS = [
  {
    title: 'Upfront payment or fees',
    re: /\b(application fee|processing fee|registration fee|upfront fee|pay(?:ment)?\s+required|deposit)\b/i,
  },
  {
    title: 'Gift cards / crypto / wire transfer',
    re: /\b(gift\s*card|bitcoin|crypto(?:currency)?|usdt|wire\s+transfer|western\s+union|moneygram)\b/i,
  },
  {
    title: '“No interview” / instant hire',
    re: /\b(no\s+interview|without\s+interview|immediate\s+hire|hired\s+today|instant\s+(?:hire|offer))\b/i,
  },
  {
    title: 'Urgency / pressure tactics',
    re: /\b(act\s+now|urgent|immediately|limited\s+time|within\s+24\s*hours|today\s+only)\b/i,
  },
  {
    title: 'Off-platform communication',
    re: /\b(telegram|whatsapp|signal|skype|hangouts|text\s+me|dm\s+me)\b/i,
  },
  {
    title: 'Personal / financial info request',
    re: /\b(ssn|social\s+security|bank\s+account|routing\s+number|credit\s+card|passport|aadhar|pan\s+card)\b/i,
  },
  {
    title: 'Too-good-to-be-true compensation',
    re: /\b(earn\s+\$?\d{3,}\s*(?:per\s*(?:day|week))|guaranteed\s+income|easy\s+money|no\s+experience\s+required)\b/i,
  },
  {
    title: 'Suspicious links or domains',
    re: /\b(bit\.ly|tinyurl|t\.co|goo\.gl|drive\.google\.com\/file|docs\.google\.com)\b/i,
  },
]

function snippetAround(text, index, radius = 70) {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + radius)
  return text.slice(start, end).replace(/\s+/g, ' ').trim()
}

function findFirstIndex(re, text) {
  const m = re.exec(text)
  if (!m) return -1
  return m.index ?? -1
}

function uniqueByTitle(flags) {
  const seen = new Set()
  const out = []
  for (const f of flags) {
    if (seen.has(f.title)) continue
    seen.add(f.title)
    out.push(f)
  }
  return out
}

module.exports = { FLAG_PATTERNS, snippetAround, findFirstIndex, uniqueByTitle }

