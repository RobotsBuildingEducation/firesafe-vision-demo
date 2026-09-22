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

// Initialize Firebase App Check with the reCAPTCHA site key.
//
// IMPORTANT: Do NOT force a debug token on localhost automatically.
// Setting `FIREBASE_APPCHECK_DEBUG_TOKEN = true` makes the SDK mint an
// unregistered debug token, and with enforcement ON for Firebase AI Logic
// (firebasevertexai.googleapis.com) every generateContent call then fails
// with: 401 "Firebase App Check token is invalid."
//
// Correct setup:
// - Local dev: either (a) use the real reCAPTCHA v3 key (add `localhost` to
//   allowed domains in the reCAPTCHA admin console), or (b) opt into a debug
//   token explicitly via `VITE_APPCHECK_DEBUG_TOKEN=<token-from-console>` and
//   register that token in Firebase Console > App Check > Manage debug tokens.
// - Production: never set a debug token; use real reCAPTCHA.
if (typeof window !== "undefined") {
  const rawDebugToken = (import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || "").trim();

  if (rawDebugToken) {
    // "true" (or "1"/"auto") = let SDK auto-generate + log a debug token.
    // Any other string = use it as the debug token value.
    const lower = rawDebugToken.toLowerCase();
    const auto = lower === "true" || lower === "1" || lower === "auto";
    const debugValue = auto ? true : rawDebugToken;
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugValue;
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugValue;
    console.info(
      auto
        ? "[App Check] Debug mode AUTO: copy the 'App Check debug token' from this console into Firebase Console > App Check > Manage debug tokens, then set VITE_APPCHECK_DEBUG_TOKEN to that value and restart."
        : "[App Check] Using explicit debug token from VITE_APPCHECK_DEBUG_TOKEN. " +
            "Make sure it is registered in Firebase Console > App Check > Manage debug tokens.",
    );
  }

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
    `[App Check] init done. debug=${rawDebugToken ? "on" : "off"}, ` +
      `provider=${enterpriseKey ? "enterprise" : recaptchaSiteKey ? "v3" : "NONE — 401s expected"}.`,
  );
}
