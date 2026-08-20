import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_PUBLIC_API_KEY,
  authDomain: "firesafe-vision-demo.firebaseapp.com",
  projectId: "firesafe-vision-demo",
  storageBucket: "firesafe-vision-demo.firebasestorage.app",
  messagingSenderId: "264218464416",
  appId: "1:264218464416:web:812c7435de334ebc38b9c5",
  measurementId: "G-T8SY75Z53C",
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Initialize Firebase App Check with the reCAPTCHA site key
if (typeof window !== "undefined") {
  // Enables debug token in console for localhost dev
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0";

  if (isLocalhost) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const enterpriseKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY || "";

  try {
    if (enterpriseKey) {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaEnterpriseProvider(enterpriseKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else if (recaptchaSiteKey) {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (err) {
    console.warn("App Check initialization notice:", err);
  }
}
