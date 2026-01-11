export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  firebaseConfig: {
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: 'livemenu-app.firebaseapp.com',
    projectId: 'livemenu-app',
    storageBucket: 'livemenu-app.firebasestorage.app',
    messagingSenderId: '730032631000',
    appId: '1:730032631000:web:22f6f583845d8e74d43bad',
    measurementId: 'G-MDJ8K4HNHB',
  },
  enableDebugLogs: true,
};
