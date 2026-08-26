import { useAuthStore } from '@/store/authStore'

const GUEST_AI_KEY = 'sn_ai_learn_usage'
const GUEST_DAILY_LIMIT = 5

type UsageRecord = { date: string; count: number }

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getGuestUsage(): UsageRecord {
  try {
    const raw = localStorage.getItem(GUEST_AI_KEY)
    if (!raw) return { date: todayKey(), count: 0 }
    const parsed = JSON.parse(raw) as UsageRecord
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 }
    return parsed
  } catch {
    return { date: todayKey(), count: 0 }
  }
}

function setGuestUsage(record: UsageRecord): void {
  try {
    localStorage.setItem(GUEST_AI_KEY, JSON.stringify(record))
  } catch {}
}

export function getGuestRemaining(): number {
  const usage = getGuestUsage()
  return Math.max(0, GUEST_DAILY_LIMIT - usage.count)
}

export function canSendAiMessage(): { allowed: boolean; reason?: string; waitSeconds?: number } {
  const { user, isGuest } = useAuthStore.getState()

  if (isGuest || !user) {
    const remaining = getGuestRemaining()
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: 'You have used all your guest trials for today. Sign up to unlock more learning features.',
      }
    }
    return { allowed: true }
  }

  if (user.plan === 'premium') return { allowed: true }

  return { allowed: true }
}

export function recordGuestUsage(): { allowed: boolean; remaining: number; reason?: string } {
  const { isGuest, user } = useAuthStore.getState()

  if (!isGuest && user) {
    if (user.plan === 'premium') return { allowed: true, remaining: 999 }
    return { allowed: true, remaining: 999 }
  }

  const usage = getGuestUsage()
  if (usage.count >= GUEST_DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      reason: 'You have used all your guest trials for today. Sign up to unlock more learning features.',
    }
  }

  const next = { date: todayKey(), count: usage.count + 1 }
  setGuestUsage(next)
  return { allowed: true, remaining: GUEST_DAILY_LIMIT - next.count }
}

export function getFreeUserCooldown(): number {
  return 60
}
