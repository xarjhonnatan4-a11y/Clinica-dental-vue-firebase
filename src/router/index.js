import { createRouter, createWebHistory } from 'vue-router'

// Tus vistas
import HomeView from '../views/HomeView.vue'
import ClientesView from '../views/ClientesView.vue'
import ClienteDetalleView from '../views/ClienteDetalleView.vue'
import DatosDoctores from '@/views/DatosDoctores.vue'
import LoginView from '@/views/LoginView.vue'
import UsuariosView from "@/views/UsuariosView.vue";
import ClienteEsporadicoView from '@/views/ClienteEsporadicoView.vue'
import ReporteEsporadicosView from '@/views/ReporteEsporadicosView.vue'
// Crear router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },

    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true, permiso: "home" }},
    { path: '/clientes', name: 'clientes', component: ClientesView, meta: { requiresAuth: true, permiso: "clientes" }},
    { path: '/cliente/:id', name: 'cliente-detalle', component: ClienteDetalleView, meta: { requiresAuth: true }},
    { path: '/doctores', name: 'doctores', component: DatosDoctores, meta: { requiresAuth: true, permiso: "doctores" }},
    { path: '/espora', name: 'espora', component: ClienteEsporadicoView, meta: { requiresAuth: true, permiso: "espora" }},
    { path: '/report', name: 'report', component: ReporteEsporadicosView, meta: { requiresAuth: true, permiso: "report" }},
    { 
  path: "/usuarios",
  name: "usuarios",
  component: UsuariosView,
  meta: { requiresAuth: true, permiso: "usuarios" }
}
  ]
})

// 🛡️ --- GUARD DE AUTENTICACIÓN + PERMISOS ---
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('doctorUser'));

  // 🔐 No logueado
  if (to.meta.requiresAuth && !user) {
    return next('/login');
  }

  // 🔥 Rutas con permisos
  if (to.meta.permiso) {
    const tienePermiso = user?.permisos?.[to.meta.permiso];

    if (!tienePermiso) {
      return next('/'); // O podrías enviarlo a una vista de “No autorizado”
    }
  }

  next(); // todo OK
})

export default router
