import { useAuthStore } from '@/store/authStore'

const MOCK_TEST_KEY = 'sn_mock_test_usage'
const GUEST_DAILY_LIMIT = 5

type UsageRecord = { date: string; count: number }

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getGuestUsage(): UsageRecord {
  try {
    const raw = localStorage.getItem(MOCK_TEST_KEY)
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
    localStorage.setItem(MOCK_TEST_KEY, JSON.stringify(record))
  } catch {}
}

export function getMockTestGuestRemaining(): number {
  const usage = getGuestUsage()
  return Math.max(0, GUEST_DAILY_LIMIT - usage.count)
}

export function canGenerateMockTest(): { allowed: boolean; reason?: string } {
  const { user, isGuest } = useAuthStore.getState()

  if (isGuest || !user) {
    const remaining = getMockTestGuestRemaining()
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: 'You have used all 5 free mock tests for today. Sign up to unlock unlimited mock tests.',
      }
    }
    return { allowed: true }
  }

  // Logged-in free users: 1 per minute cooldown
  if (user.plan !== 'premium') {
    const lastTestKey = 'sn_mock_test_last_' + user.id
    const lastTest = localStorage.getItem(lastTestKey)
    if (lastTest) {
      const elapsed = (Date.now() - parseInt(lastTest, 10)) / 1000
      if (elapsed < 60) {
        return {
          allowed: false,
          reason: `Please wait ${Math.ceil(60 - elapsed)} seconds before generating another test.`,
        }
      }
    }
  }

  return { allowed: true }
}

export function recordMockTestUsage(): { allowed: boolean; remaining: number } {
  const { isGuest, user } = useAuthStore.getState()

  // Premium users: no limits
  if (!isGuest && user?.plan === 'premium') {
    return { allowed: true, remaining: 999 }
  }

  // Logged-in free users: record timestamp for cooldown
  if (!isGuest && user) {
    const lastTestKey = 'sn_mock_test_last_' + user.id
    localStorage.setItem(lastTestKey, String(Date.now()))
    return { allowed: true, remaining: 999 }
  }

  // Guest users: daily limit
  const usage = getGuestUsage()
  if (usage.count >= GUEST_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  const next = { date: todayKey(), count: usage.count + 1 }
  setGuestUsage(next)
  return { allowed: true, remaining: GUEST_DAILY_LIMIT - next.count }
}
