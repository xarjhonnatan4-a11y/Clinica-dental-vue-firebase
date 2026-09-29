import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { setUser } from "./auth";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const saved = localStorage.getItem("doctorUser");
if (saved) {
  setUser(JSON.parse(saved));
}

// 🔐 CONTROL GLOBAL DE SESIÓN
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // 🔥 Forzar refresh (detecta disabled / revoke)
      await user.getIdToken(true);

      const userRef = doc(db, "users", user.uid);

      // 🔥 Listener en tiempo real
      onSnapshot(userRef, async (snap) => {
        if (!snap.exists() || snap.data().activo === false) {
          await signOut(auth);
          localStorage.removeItem("doctorUser");
          router.push("/login");
        }
      });

    } catch (error) {
      await signOut(auth);
      localStorage.removeItem("doctorUser");
      router.push("/login");
    }
  }
});

const app = createApp(App)

app.use(router)

app.mount('#app')