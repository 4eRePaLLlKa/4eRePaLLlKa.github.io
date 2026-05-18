// Імпортуємо головну функцію ініціалізації
import { initializeApp } from "firebase/app";
// Додаємо імпорти для Авторизації та Бази Даних
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Твої секретні ключі Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAACcdogG91COTXuDGOZGkr0y__4gkdjas",
  authDomain: "jobfinder-lab4.firebaseapp.com",
  projectId: "jobfinder-lab4",
  storageBucket: "jobfinder-lab4.firebasestorage.app",
  messagingSenderId: "714986977912",
  appId: "1:714986977912:web:f4c2f48941d73a6edd8b8d"
};

// Запускаємо Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо авторизацію та базу даних, щоб інші файли могли ними користуватися
export const auth = getAuth(app);
export const db = getFirestore(app);