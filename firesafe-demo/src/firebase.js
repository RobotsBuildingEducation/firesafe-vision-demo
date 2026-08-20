import { getApp, getApps, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: 'AIzaSyCFqYoTJKZ3Ju7TUD_PZbGSsRpi9e_W27E',
  authDomain: 'firesafe-vision-demo.firebaseapp.com',
  projectId: 'firesafe-vision-demo',
  storageBucket: 'firesafe-vision-demo.firebasestorage.app',
  messagingSenderId: '264218464416',
  appId: '1:264218464416:web:812c7435de334ebc38b9c5',
  measurementId: 'G-T8SY75Z53C',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase App Check
if (typeof window !== 'undefined') {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0'

  if (isLocalhost) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

  try {
    if (recaptchaSiteKey) {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    } else if (isLocalhost) {
      initializeAppCheck(firebaseApp, {
        provider: new CustomProvider({
          getToken: () => Promise.resolve({ token: '', expireTimeMillis: Date.now() + 3600000 }),
        }),
        isTokenAutoRefreshEnabled: true,
      })
    }
  } catch {
    // Prevent errors if already initialized during HMR
  }
}
