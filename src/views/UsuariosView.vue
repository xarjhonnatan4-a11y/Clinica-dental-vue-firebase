<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-3">Gestión de Usuarios</h2>

    <button 
        v-if="usuarioActual?.role === 'admin'"
        class="btn btn-primary mb-3" 
        @click="abrirCrear"
        >
        <i class="bi bi-plus-lg"></i> Crear Usuario
        </button>


    <!-- ============================= -->
    <!--   TABLA: USUARIOS ACTIVOS    -->
    <!-- ============================= -->
    <h4 class="mt-4">Usuarios Activos</h4>

    <div class="d-none d-md-block">
  <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuariosActivos" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>
            <button 
                v-if="usuarioActual?.role === 'admin'"
                class="btn btn-sm btn-warning me-2" 
                @click="abrirEditar(u)"
                >
                Editar
                </button>

            <button 
            v-if="usuarioActual?.role === 'admin'"
            class="btn btn-sm btn-danger" 
            @click="desactivar(u)"
            >
            Desactivar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <!-- VERSION MOVIL -->
<div class="d-md-none">
  <div 
    v-for="u in usuariosActivos" 
    :key="u.id"
    class="user-card mb-3 p-3 shadow-sm"
  >
    <div class="fw-bold fs-5">{{ u.name }}</div>
    <div class="text-muted small">{{ u.email }}</div>

    <span 
      class="badge mt-2"
      :class="u.role === 'admin' ? 'bg-danger' : 'bg-primary'"
    >
      {{ u.role }}
    </span>

    <div 
      v-if="usuarioActual?.role === 'admin'"
      class="d-flex gap-2 mt-3"
    >
      <button 
        class="btn btn-sm btn-warning flex-fill"
        @click="abrirEditar(u)"
      >
        Editar
      </button>

      <button 
        class="btn btn-sm btn-danger flex-fill"
        @click="desactivar(u)"
      >
        Desactivar
      </button>
    </div>
  </div>
</div>

    <!-- ============================= -->
    <!--  TABLA: USUARIOS INACTIVOS   -->
    <!-- ============================= -->
    <h4 class="mt-5">Usuarios Desactivados</h4>

    <!-- DESKTOP -->
<div class="d-none d-md-block">
  <table class="table table-bordered">
    <thead class="table-light">
      <tr>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Reactivar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="u in usuariosInactivos" :key="u.id">
        <td>{{ u.name }}</td>
        <td>{{ u.email }}</td>
        <td>{{ u.role }}</td>
        <td>
          <button 
            v-if="usuarioActual?.role === 'admin'"
            class="btn btn-sm btn-success" 
            @click="reactivar(u)"
          >
            Reactivar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- MOVIL -->
<div class="d-md-none">
  <div 
    v-for="u in usuariosInactivos" 
    :key="u.id"
    class="user-card mb-3 p-3 shadow-sm"
  >
    <div class="fw-bold fs-5">{{ u.name }}</div>
    <div class="text-muted small">{{ u.email }}</div>

    <span class="badge bg-secondary mt-2">
      {{ u.role }}
    </span>

    <div 
      v-if="usuarioActual?.role === 'admin'"
      class="d-flex gap-2 mt-3"
    >
      <button 
        class="btn btn-sm btn-success flex-fill"
        @click="reactivar(u)"
      >
        Reactivar
      </button>
    </div>
  </div>
</div>

    <!-- ============================= -->
    <!--          MODAL USUARIO        -->
    <!-- ============================= -->
    <div class="modal fade" id="modalUser" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? "Editar Usuario" : "Crear Usuario" }}</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row">
              
              <div class="col-md-6">
                <label>Nombre</label>
                <input 
                    v-model="form.name" 
                    type="text" 
                    class="form-control mb-2" 
                    :readonly="usuarioActual?.role !== 'admin'"
                />


                <label>Correo</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="form-control mb-2" 
                  :readonly="usuarioActual?.role !== 'admin'"
                />

                <!-- CONTRASEÑA -->
                <div v-if="!editando">
                  <label>Contraseña</label>
                  <input 
                    v-model="form.password" 
                    type="password" 
                    class="form-control mb-2"
                    placeholder="Contraseña"
                  />
                </div>

                <div v-else>
                  <label>Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control mb-2"
                    value="********"
                    disabled
                  />
                </div>

                <label>Rol</label>
                <select 
                  v-model="form.role" 
                  class="form-control mb-2"
                  :disabled="usuarioActual?.role !== 'admin'"
                >
                  <option value="admin">Administrador</option>
                  <option value="colaborador">Colaborador</option>
                </select>
              </div>

              <div class="col-md-6">
                <h5>Permisos</h5>

                <div 
  v-for="permiso in permisosVisibles" 
  :key="permiso" 
  class="form-check"
>
  <input 
    type="checkbox" 
    v-model="form.permisos[permiso]"
    class="form-check-input"
    :disabled="usuarioActual?.role !== 'admin'"
  />

  <label class="form-check-label">
    {{ permisoLabels[permiso] }}
  </label>
</div>

              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
                class="btn btn-primary" 
                @click="guardar"
                :disabled="loading"
                >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editando ? "Actualizar" : "Crear" }}
                </button>

          </div>

        </div>
      </div>
    </div>

  </div>

  <!-- TOAST (Mensajes flotantes) -->
<div 
  class="toast-container position-fixed top-0 end-0 p-3" 
  style="z-index: 9999"
>
  <div 
    id="toastSuccess" 
    class="toast align-items-center text-bg-success border-0" 
    role="alert" 
    aria-live="assertive" 
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">
        ✔ Cambios guardados correctamente.
      </div>
      <button 
        type="button" 
        class="btn-close btn-close-white me-2 m-auto" 
        data-bs-dismiss="toast">
      </button>
    </div>
  </div>
</div>

</template>


<script>
import { db, functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { collection, getDocs, setDoc, doc, updateDoc, addDoc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Modal, Toast } from "bootstrap";
import { onAuthStateChanged } from "firebase/auth";

const permisosBase = () => ({
  home: true,
  clientes: false,
  clienteDetalle: false,
  doctores: false,
  usuarios: false,
  espora: false,
  report: false,
  editarMovimientoFinanciero: false,
  eliminarMovimientoFinanciero: false
});

export default {
  data() {
    return {
      usuarios: [],
      editando: false,
      usuarioActual: null, // 👈 ROL DEL USUARIO LOGUEADO
      loading: false, // 👈 NUEVO
      permisoLabels: {
        clientes: "Módulo de Pacientes",
        clienteDetalle: "Estado de Cuenta",
        doctores: "Registro de Doctores",
        usuarios: "Registro de Usuarios",
        espora: "Registro de Tratamientos",
        report: "Módulo de Reportes",
        editarMovimientoFinanciero: "Editar movimientos financieros",
        eliminarMovimientoFinanciero: "Eliminar movimientos financieros"
      },

      form: {
        id: null,
        name: "",
        email: "",
        emailOriginal: "",
        password: "",
        role: "colaborador",
        permisos: permisosBase(),
        activo: true
      }
    };
  },

  async mounted() {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        this.usuarioActual = snap.data();
        await this.cargarUsuarios();
      }
    });
  },

  computed: {
    permisosVisibles() {
      if (this.form.role === 'admin') {
        return Object.keys(this.form.permisos).filter(k => k !== 'home');
      }

      return [
        'clientes',
        'clienteDetalle',
        'report'
      ];
    },
    usuariosActivos() {
      return this.usuarios.filter(u => u.activo !== false);
    },
    usuariosInactivos() {
      return this.usuarios.filter(u => u.activo === false);
    }
  },

  methods: {

    normalizarPermisos(permisos = {}) {
      return {
        ...permisosBase(),
        ...(permisos || {}),
        home: true
      };
    },

    permisosPorDefectoSegunRol(role = 'colaborador') {
      const permisos = this.normalizarPermisos();

      if (role === 'colaborador') {
        permisos.clientes = true;
        permisos.clienteDetalle = true;
        permisos.report = true;
      }

      return permisos;
    },

    aplicarRestriccionesPorRol() {
  this.form.permisos = this.normalizarPermisos(this.form.permisos);

  if (this.form.role !== 'admin') {
    // Permisos que NO debe conservar un colaborador
    this.form.permisos.usuarios = false;
    this.form.permisos.doctores = false;
    this.form.permisos.espora = false;
    this.form.permisos.editarMovimientoFinanciero = false;
    this.form.permisos.eliminarMovimientoFinanciero = false;
  }

  this.form.permisos.home = true;
},

    mostrarToast() {
  const el = document.getElementById("toastSuccess");
  const toast = new Toast(el);
  toast.show();
},

    async registrarAuditoria(accion, usuarioAfectado, antes = null, despues = null) {
      const admin = JSON.parse(localStorage.getItem("doctorUser"));

      await addDoc(collection(db, "auditoria_usuarios"), {
        accion,
        usuarioAfectadoId: usuarioAfectado.id,
        usuarioAfectadoNombre: usuarioAfectado.name,
        usuarioAfectadoEmail: usuarioAfectado.email,
        antes,
        despues,
        realizadoPor: admin?.name || "Desconocido",
        realizadoPorUid: admin?.uid || null,
        timestamp: new Date()
      });
    },

    async cargarUsuarios() {
      const snap = await getDocs(collection(db, "users"));
      this.usuarios = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    abrirCrear() {
      this.editando = false;
      this.form = {
        id: null,
        name: "",
        email: "",
        emailOriginal: "",
        password: "",
        role: "colaborador",
        permisos: this.permisosPorDefectoSegunRol('colaborador'),
        activo: true
      };
      new Modal(document.getElementById("modalUser")).show();
    },

    abrirEditar(user) {
      this.editando = true;
      this.form = {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        emailOriginal: user.email || "",
        password: "",
        role: user.role || "colaborador",
        permisos: this.normalizarPermisos(user.permisos),
        activo: user.activo !== false
      };
      new Modal(document.getElementById("modalUser")).show();
    },

    async guardar() {
  try {
    this.loading = true;

    const modal = Modal.getInstance(document.getElementById("modalUser"));

    // 👉 Cerrar modal inmediatamente (mejor UX)
    modal.hide();

    this.aplicarRestriccionesPorRol();
    if (!this.editando) {
      // CREAR USUARIO
      const cred = await createUserWithEmailAndPassword(auth, this.form.email, this.form.password);
      const uid = cred.user.uid;
      this.form.permisos.home = true;
      await setDoc(doc(db, "users", uid), {
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
        permisos: this.form.permisos,
        activo: true
      });

      await this.registrarAuditoria("crear", { id: uid, name: this.form.name, email: this.form.email }, null, { ...this.form });

    } else {
      // EDITAR USUARIO
      const antes = this.usuarios.find(u => u.id === this.form.id);

      // 👉 Si el correo cambió: actualizar en Auth
      if (this.form.email !== this.form.emailOriginal) {
        const fn = httpsCallable(functions, "updateUserEmail");
        await fn({
          uid: this.form.id,
          newEmail: this.form.email
        });
      }

      // 👉 Actualizar en Firestore
      await updateDoc(doc(db, "users", this.form.id), {
        name: this.form.name,
        role: this.form.role,
        permisos: this.form.permisos
      });

      await this.registrarAuditoria("editar", this.form, antes, this.form);
    }

    // Recargar usuarios al final
    await this.cargarUsuarios();
    this.mostrarToast();
  } catch (err) {
    console.error(err);
    alert("Error al guardar los cambios.");
  } finally {
    this.loading = false; // 👈 liberar botón
    
  }
},

    async actualizarCorreo() {
      if (!confirm("¿Actualizar correo del usuario en Firebase Authentication?")) return;

      try {
        const fn = httpsCallable(functions, "updateUserEmail");
        await fn({
          uid: this.form.id,
          newEmail: this.form.email
        });

        await this.registrarAuditoria(
          "actualizar_correo",
          this.form,
          { emailAnterior: this.form.emailOriginal },
          { emailNuevo: this.form.email }
        );

        alert("Correo actualizado correctamente.");
        await this.cargarUsuarios();

      } catch (err) {
        console.error(err);
        alert("Error al actualizar el correo.");
      }
    },

   async desactivar(user) {
  if (!user || !user.id) {
    console.error("UID inválido:", user);
    return;
  }

  if (!confirm("¿Desactivar este usuario?")) return;

  await updateDoc(doc(db, "users", user.id), { activo: false });

  const fn = httpsCallable(functions, "revokeUserSessions");

  await fn({ uid: user.id });

  await this.cargarUsuarios();
},

    async reactivar(user) {
      await updateDoc(doc(db, "users", user.id), { activo: true });

      await this.registrarAuditoria(
        "reactivar",
        user,
        { activo: false },
        { activo: true }
      );

      await this.cargarUsuarios();
    },

    
  },

  watch: {
    'form.role'(nuevoRol, rolAnterior) {
      if (!nuevoRol || nuevoRol === rolAnterior) return;

      this.aplicarRestriccionesPorRol();
    }
  }
};

</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
.user-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #eef1f4;
  transition: all 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}
</style>
