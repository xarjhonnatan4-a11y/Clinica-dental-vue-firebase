<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 mb-4 rounded-bottom-4">
    <div class="container-fluid">

      <router-link 
        to="/" 
        class="navbar-brand d-flex align-items-center"
        @click="cerrarMenu"
      >
        <img 
          src="/src/assets/LOGITO.png" 
          alt="Logo" 
          class="me-2"
          style="height: 30px; width: 30px; object-fit: cover;"
        />
        <span class="brand-title">Test</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button"
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">

        <!-- Si hay usuario -->
        <ul v-if="user" class="navbar-nav ms-auto align-items-lg-center">

          <li class="nav-item" v-if="permiso('home')">
            <router-link to="/" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-house-door me-2"></i> Inicio
            </router-link>
          </li>

          <li class="nav-item" v-if="permiso('clientes')">
            <router-link to="/clientes" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-people me-2"></i> Pacientes
            </router-link>
          </li>

          <li class="nav-item" v-if="permiso('espora')">
            <router-link to="/espora" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-person me-2"></i> Tratamientos
            </router-link>
          </li>

          <li class="nav-item" v-if="permiso('doctores')">
            <router-link to="/doctores" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-person-badge me-2"></i> Doctores
            </router-link>
          </li>

          <li class="nav-item" v-if="permiso('usuarios')">
            <router-link to="/usuarios" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-people-fill me-2"></i> Usuarios
            </router-link>
          </li>

          <li class="nav-item" v-if="permiso('report')">
            <router-link to="/report" class="nav-link nav-btn d-flex align-items-center" @click="cerrarMenu">
              <i class="bi bi-file-earmark-text me-2"></i> Reportes
            </router-link>
          </li>

          <li class="nav-item ms-3">
            <span class="fw-bold text-primary">
              👨‍⚕️ {{ user.name }}
            </span>
          </li>

          <li class="nav-item ms-3">
            <button class="btn btn-outline-danger" @click="logout">
              <i class="bi bi-box-arrow-right"></i> Salir
            </button>
          </li>

        </ul>

        <!-- Si NO hay usuario -->
        <ul v-else class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/login" class="nav-link fw-bold" @click="cerrarMenu">
              Iniciar sesión
            </router-link>
          </li>
        </ul>

      </div>
    </div>
  </nav>

  <router-view />
</template>

<script>
import { authState, clearUser } from "./auth";
import * as bootstrap from "bootstrap";

export default {
  computed: {
    user() {
      return authState.user;
    }
  },
  methods: {
    permiso(p) {
      return this.user?.permisos?.[p] === true;
    },

    logout() {
      this.cerrarMenu();
      clearUser();
      localStorage.removeItem("doctorUser");
      this.$router.push("/login");
    },

    cerrarMenu() {
      const navbar = document.getElementById("navbarNav");
      if (navbar && navbar.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbar)
          || new bootstrap.Collapse(navbar, { toggle: false });
        bsCollapse.hide();
      }
    }
  }
};
</script>

<style>
.nav-btn:hover {
  background: rgba(13, 110, 253, 0.15);
  border-radius: 8px;
}

.brand-title {
  font-family: "Lucida Calligraphy";
  font-size: 1.8rem;
  letter-spacing: 0px;
  color: #0b55c5;
}

/* Responsive mejorado */
@media (max-width: 991px) {
  .navbar-nav .nav-item {
    margin-bottom: 10px;
  }

  .navbar-nav .btn {
    width: 100%;
  }
  
}

</style>