<template>
  <div class="login-wrapper">

    <!-- Panel principal -->
    <div class="login-box">

      <!-- Logo -->
      <div class="text-center mb-3">
        <img 
          src="/src/assets/logo.png" 
          alt="Logo" 
          class="login-logo"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Correo</label>
        <div class="input-group login-input">
          <span class="input-group-text">
            <i class="bi bi-envelope"></i>
          </span>
          <input 
            v-model="email"
            type="email"
            class="form-control"
            placeholder="usuario@ejemplo.com"
          />
        </div>
      </div>

     <div class="mb-4">
        <label class="form-label fw-semibold">Contraseña</label>
        <div class="input-group login-input">
          <span class="input-group-text">
            <i class="bi bi-lock"></i>
          </span>

          <input 
            :type="mostrarPass ? 'text' : 'password'"
            v-model="password"
            class="form-control"
            placeholder="••••••••"
          />

          <button 
            class="btn btn-outline-secondary" 
            type="button"
            @click="mostrarPass = !mostrarPass"
          >
            <i :class="mostrarPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>


      <button class="btn btn-primary w-100 btn-lg rounded-3 fw-semibold" @click="login">
        Ingresar
      </button>
      <p 
        class="text-center mt-3" 
        style="cursor:pointer; color:#2e6cf6;" 
        @click="resetPassword"
      >
        ¿Olvidaste tu contraseña?
      </p>

      <p class="text-danger text-center mt-2" v-if="error">{{ error }}</p>
      <p class="text-success text-center mt-2" v-if="mensaje">{{ mensaje }}</p>


      <p class="text-danger text-center mt-3" v-if="error">{{ error }}</p>

    </div>

    <!-- Ilustración lateral -->
    <div class="side-illustration"></div>

  </div>
</template>



<script>
import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "../auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      mensaje: "",
      mostrarPass: false
    };
  },

  methods: {

    /* =============================================
       🔐 RESTABLECER CONTRASEÑA
    ===============================================*/
    async resetPassword() {
      this.error = "";
      this.mensaje = "";

      if (!this.email) {
        this.error = "Ingrese su correo para restablecer la contraseña.";
        return;
      }

      try {
        await sendPasswordResetEmail(auth, this.email);
        this.mensaje = "Se envió un enlace para restablecer la contraseña.";
      } catch (err) {
        this.error = "No se pudo enviar el enlace. Verifique el correo.";
      }
    },

    /* =============================================
       🔑 LOGIN NORMAL
    ===============================================*/
    async login() {
      this.error = "";
      this.mensaje = "";

      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Leer perfil desde Firestore
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          this.error = "El usuario no tiene perfil asignado.";
          return;
        }

        const userData = snap.data();

        // Validar si está activo
        if (userData.activo === false) {
          this.error = "Este usuario está desactivado.";
          return;
        }

        // Guardar sesión local
        const sessionUser = {
          uid: user.uid,
          name: userData.name,
          email: user.email,
          role: userData.role,
          permisos: userData.permisos
        };

        localStorage.setItem("doctorUser", JSON.stringify(sessionUser));
        setUser(sessionUser);

        // Redirigir
        this.$router.push("/");

      } catch (err) {
        this.error = "Credenciales incorrectas";
      }
    }
  }
};
</script>


<style scoped>
/* Layout general */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;  /* ← centra horizontal */
  align-items: center;       /* ← centra vertical */
  background: #f9fafc;
  position: relative;
  padding: 20px;
}

/* Tarjeta login */
.login-box {
  width: 100%;
  max-width: 420px;
  margin: auto;
  padding: 40px 35px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.08);
  border: 1px solid #e5e9f2;
}

/* Logo */
.login-logo {
  width: 180px;
  border-radius: 10px;
}

/* Inputs */
.login-input .input-group-text {
  background: #f3f6fa;
  border: 1px solid #dce3ec;
  border-right: none;
}

.login-input .form-control {
  border: 1px solid #dce3ec;
  border-left: none;
  padding: 10px;
}

.form-control:focus {
  border-color: #5a8dee;
  box-shadow: 0 0 0 2px rgba(90, 141, 238, 0.2);
}

/* Botón */
.btn-primary {
  background-color: #2e6cf6;
  border: none;
  padding: 12px;
  transition: 0.2s;
}

.btn-primary:hover {
  background-color: #1d55d4;
  transform: translateY(-1px);
}

/* Panel derecho (solo desktop) */
.side-illustration {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 320px;
  opacity: 0.15;
  background-image: url("https://cdn.pixabay.com/photo/2017/06/06/00/24/tooth-2374849_1280.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  display: none;
}

@media (min-width: 900px) {
  .side-illustration {
    display: block;
  }
}

@media (min-width: 900px) {
  .side-illustration {
    display: block;
  }
}



</style>
