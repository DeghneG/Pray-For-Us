// Demo-only sign-in. The credentials are in the page code, so this protects nothing:
// it exists so the owner can see the login flow. Production uses Supabase Auth (see ARCHITECTURE.md).
const KEY = 'pfu-admin-session'

export const DEMO_USER = 'admin'
export const DEMO_PASS = 'admin123'

export function isAuthed() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function login(user: string, pass: string) {
  const ok = user.trim().toLowerCase() === DEMO_USER && pass === DEMO_PASS
  if (ok) {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private window: session lasts until reload */
    }
  }
  return ok
}

export function logout() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
