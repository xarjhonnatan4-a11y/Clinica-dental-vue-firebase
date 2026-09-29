<template>
  <div class="container py-4">
    <h2 class="fw-bold text-primary mb-3">Doctores</h2>

    <!-- FORMULARIO -->
    <form @submit.prevent="guardarDoctor" class="card p-3 mb-4 shadow-sm">
      <h5 class="mb-3">{{ editId ? "Editar doctor" : "Nuevo doctor" }}</h5>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Nombre</label>
          <input v-model="form.nombre" class="form-control" required>
        </div>

        <div class="col-md-6">
          <label class="form-label">Correo</label>
          <input v-model="form.email" type="email" class="form-control" required>
        </div>

        <div class="col-md-6">
          <label class="form-label">Especialidad</label>
          <input v-model="form.especialidad" class="form-control" placeholder="Opcional">
        </div>

        <div class="col-md-6">
          <label class="form-label">Teléfono</label>
          <input v-model="form.telefono" class="form-control" placeholder="Opcional">
        </div>

        <div class="col-md-6">
          <label class="form-label">Comisión (%)</label>
          <input
            v-model.number="form.comision"
            type="number"
            min="0"
            max="100"
            step="1"
            class="form-control"
            placeholder="Ej: 40"
            required
          >
        </div>

      </div>

      <div class="mt-3">
        <button class="btn btn-primary">{{ editId ? "Guardar cambios" : "Agregar" }}</button>

        <button
          v-if="editId"
          class="btn btn-danger ms-2"
          @click.prevent="eliminarDoctor">
          Eliminar
        </button>

        <button
          v-if="editId"
          class="btn btn-secondary ms-2"
          @click.prevent="cancelarEdicion">
          Cancelar
        </button>
      </div>
    </form>

    <!-- LISTA -->
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="fw-semibold mb-3">Lista de doctores</h5>

        <div v-if="doctores.length === 0" class="text-muted">
          No hay doctores registrados.
        </div>

        <ul class="list-group">
          <li
            v-for="d in doctores"
            :key="d.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ d.nombre }}</strong>
              <span class="badge bg-secondary ms-2">
                {{ d.comision }}%
              </span>
              <br>
              <small class="text-muted">{{ d.email }}</small>
              <div class="small">{{ d.especialidad || "" }}</div>
              
            </div>
            <button class="btn btn-outline-primary btn-sm" @click="editarDoctor(d)">
              Editar
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default {
  data() {
    return {
      doctores: [],
      editId: null,
      form: {
        nombre: "",
        email: "",
        especialidad: "",
        telefono: "",
        comision: 0
      }
    };
  },

  mounted() {
    onSnapshot(collection(db, "doctores"), snap => {
      this.doctores = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  },

  methods: {
    async guardarDoctor() {
      try {
        if (this.editId) {
          await updateDoc(doc(db, "doctores", this.editId), this.form);
        } else {
          await addDoc(collection(db, "doctores"), this.form);
        }

        this.resetForm();
      } catch (e) {
        console.error("Error guardando doctor:", e);
      }
    },

    editarDoctor(d) {
      this.editId = d.id;
      this.form = { ...d };
    },

    async eliminarDoctor() {
      if (!confirm("¿Eliminar este doctor?")) return;

      await deleteDoc(doc(db, "doctores", this.editId));
      this.resetForm();
    },

    cancelarEdicion() {
      this.resetForm();
    },

    resetForm() {
      this.editId = null;
      this.form = {
        nombre: "",
        email: "",
        especialidad: "",
        telefono: "",
        comision: 0
      };
    }
  }
};
</script>
