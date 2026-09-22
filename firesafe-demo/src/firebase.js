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

export let appCheck = undefined;

// Local `vite` only. Production builds must use reCAPTCHA, never a debug token.
// `import.meta.env.DEV` is false in `vite build`, so this block is stripped
// and the debug token is not shipped.
if (import.meta.env.DEV && typeof window !== "undefined") {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const rawDebugToken = isLocal
    ? (import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || "").trim()
    : "";

  if (rawDebugToken) {
    const lower = rawDebugToken.toLowerCase();
    const auto = lower === "true" || lower === "1" || lower === "auto";
    const debugValue = auto ? true : rawDebugToken;
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugValue;
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugValue;
    console.info(
      "[App Check] Local debug token on. Production uses reCAPTCHA.",
    );
  }
}

if (typeof window !== "undefined") {

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const enterpriseKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY || "";

  if (!enterpriseKey && !recaptchaSiteKey) {
    console.error(
      "[App Check] Missing VITE_RECAPTCHA_SITE_KEY (and no VITE_RECAPTCHA_ENTERPRISE_KEY). " +
        "App Check is NOT initialized, so enforced Firebase AI Logic calls will 401. " +
        "Add the key to .env and rebuild.",
    );
  }

  try {
    if (enterpriseKey) {
      appCheck = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaEnterpriseProvider(enterpriseKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else if (recaptchaSiteKey) {
      appCheck = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (err) {
    // initializeAppCheck throws on HMR / StrictMode double-init — safe to ignore.
    console.warn("App Check initialization notice:", err);
  }

  console.info(
    `[App Check] init done. debug=${window.FIREBASE_APPCHECK_DEBUG_TOKEN ? "on" : "off"}, ` +
      `provider=${enterpriseKey ? "enterprise" : recaptchaSiteKey ? "v3" : "NONE — 401s expected"}.`,
  );
}
