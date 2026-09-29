<template>
  <div class="container py-4">

    <div class="row g-4">

      <!-- ========================= -->
      <!-- TRATAMIENTOS -->
      <!-- ========================= -->
      <div class="col-lg-7">
        <div class="card shadow-lg border-0 rounded-4 h-100">
          <div class="card-body p-4">

            <h4 class="fw-bold mb-4">🦷 Gestión de tratamientos</h4>

            <!-- INPUT -->
            <div class="row g-3 align-items-end mb-4">
              <div class="col-md-5">
                <label class="form-label fw-semibold">Tratamiento</label>
                <input
                  v-model="nuevoTratamiento"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Corona"
                />
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold">Color</label>
                <input
                  type="color"
                  v-model="colorNuevo"
                  class="form-control form-control-color w-100"
                  style="height: 38px;"
                />
              </div>

              <div class="col-md-3">
                <div class="form-check mt-4 pt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="usaMaterialNuevo"
                    v-model="usaMaterialNuevo"
                  />
                  <label class="form-check-label fw-semibold" for="usaMaterialNuevo">
                    Usa material
                  </label>
                </div>
              </div>

              <div class="col-md-2 d-grid">
                <button
                  class="btn btn-primary"
                  @click="agregarTratamiento"
                >
                  ➕ Agregar
                </button>
              </div>
            </div>

            <!-- LISTA -->
            <ul class="list-group">
              <li
                v-for="(t, index) in tratamientosLista"
                :key="`trat-${index}`"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <span
                    class="color-dot"
                    :style="{ backgroundColor: t.color }"
                  ></span>

                  <span class="fw-semibold">
                    {{ t.nombre }}
                  </span>

                  <span
                    class="badge rounded-pill"
                    :class="t.usaMaterial ? 'text-bg-info' : 'text-bg-secondary'"
                  >
                    {{ t.usaMaterial ? 'Con material' : 'Sin material' }}
                  </span>
                </div>

                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="eliminarTratamiento(index)"
                >
                  ✕
                </button>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <!-- ========================= -->
      <!-- MATERIALES -->
      <!-- ========================= -->
      <div class="col-lg-5">
        <div class="card shadow-lg border-0 rounded-4 h-100">
          <div class="card-body p-4">

            <h4 class="fw-bold mb-4">🧪 Gestión de materiales</h4>

            <!-- INPUT -->
            <div class="row g-3 align-items-end mb-4">
              <div class="col-md-9">
                <label class="form-label fw-semibold">Material</label>
                <input
                  v-model="nuevoMaterial"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Zircona"
                />
              </div>

              <div class="col-md-3 d-grid">
                <button
                  class="btn btn-primary"
                  @click="agregarMaterial"
                >
                  ➕ Agregar
                </button>
              </div>
            </div>

            <!-- LISTA -->
            <ul class="list-group">
              <li
                v-for="(m, index) in materialesLista"
                :key="`mat-${index}`"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span class="fw-semibold">
                  {{ m.nombre }}
                </span>

                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="eliminarMaterial(index)"
                >
                  ✕
                </button>
              </li>
            </ul>

          </div>
        </div>
      </div>

    </div>

    <!-- ========================= -->
    <!-- GUARDAR -->
    <!-- ========================= -->
    <div class="mt-4 text-end">
      <button
        class="btn btn-success px-4 fw-semibold"
        @click="guardarCatalogos"
      >
        💾 Guardar catálogos
      </button>
    </div>

  </div>

  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">

  <div
    ref="toast"
    class="toast align-items-center border-0"
    :class="toastColor"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">

      <div class="toast-body fw-semibold text-white">
        {{ toastMessage }}
      </div>

      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
      ></button>

    </div>
  </div>

</div>
</template>

<script>
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";
import { Toast } from "bootstrap";

export default {
  data() {
    return {
      toastMessage: "",
      toastColor: "bg-danger",
      nuevoTratamiento: "",
      colorNuevo: "#3b82f6",
      usaMaterialNuevo: false,

      nuevoMaterial: "",

      tratamientosLista: [],
      materialesLista: [],

      docId: null
    };
  },

  methods: {

    mostrarToast(mensaje, color = "bg-danger") {
  this.toastMessage = mensaje;
  this.toastColor = color;

  const toastEl = this.$refs.toast;
  if (!toastEl) return;

  const toast = Toast.getOrCreateInstance(toastEl);
  toast.show();
},

    normalizarNombre(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, " ")            // espacios dobles -> uno
    .trim()
    .toLowerCase();
},

    // =========================
    // CARGAR DESDE FIRESTORE
    // =========================
    async cargarCatalogos() {
      const snap = await getDocs(collection(db, "tratamientos"));

      if (!snap.empty) {
        const d = snap.docs[0];
        this.docId = d.id;

        const data = d.data();

        // Compatibilidad con datos viejos
        this.tratamientosLista = (data.tratamientos || []).map(t => {
          if (typeof t === "string") {
            return {
              nombre: t,
              color: "#3b82f6",
              usaMaterial: false
            };
          }

          return {
            nombre: t.nombre || "",
            color: t.color || "#3b82f6",
            usaMaterial: !!t.usaMaterial
          };
        });

        this.materialesLista = (data.materiales || []).map(m => {
          if (typeof m === "string") {
            return {
              nombre: m
            };
          }

          return {
            nombre: m.nombre || ""
          };
        });
      }
    },

    // =========================
    // AGREGAR TRATAMIENTO
    // =========================
    agregarTratamiento() {
  const nombre = this.nuevoTratamiento.trim();

  if (!nombre) {
    this.mostrarToast("Ingrese un nombre de tratamiento.");
    return;
  }

  const nombreNormalizado = this.normalizarNombre(nombre);

  const yaExiste = this.tratamientosLista.some(
    t => this.normalizarNombre(t.nombre) === nombreNormalizado
  );

  if (yaExiste) {
    this.mostrarToast(`El tratamiento "${nombre}" ya existe.`);
    return;
  }

  this.tratamientosLista.push({
    nombre,
    color: this.colorNuevo,
    usaMaterial: this.usaMaterialNuevo
  });
  this.mostrarToast(`Tratamiento "${nombre}" agregado.`, "bg-success");

  this.nuevoTratamiento = "";
  this.colorNuevo = "#3b82f6";
  this.usaMaterialNuevo = false;
},

    // =========================
    // ELIMINAR TRATAMIENTO
    // =========================
    eliminarTratamiento(index) {
      this.tratamientosLista.splice(index, 1);
    },

    // =========================
    // AGREGAR MATERIAL
    // =========================
    agregarMaterial() {
  const nombre = this.nuevoMaterial.trim();

  if (!nombre) {
    this.mostrarToast("Ingrese un nombre de material.");
    return;
  }

  const nombreNormalizado = this.normalizarNombre(nombre);

  const yaExiste = this.materialesLista.some(
    m => this.normalizarNombre(m.nombre) === nombreNormalizado
  );

  if (yaExiste) {
    this.mostrarToast(`El material "${nombre}" ya existe.`);
    return;
  }

  this.materialesLista.push({
    nombre
  });

  this.nuevoMaterial = "";
},

    // =========================
    // ELIMINAR MATERIAL
    // =========================
    eliminarMaterial(index) {
      this.materialesLista.splice(index, 1);
    },

    // =========================
    // GUARDAR
    // =========================
    async guardarCatalogos() {
      if (!this.docId) {
        const ref = doc(collection(db, "tratamientos"));
        this.docId = ref.id;
      }

      await setDoc(doc(db, "tratamientos", this.docId), {
        tratamientos: this.tratamientosLista,
        materiales: this.materialesLista
      });

      this.mostrarToast("✅ Catálogos guardados", "bg-success");
    }
  },

  mounted() {
    this.cargarCatalogos();
  }
};
</script>

<style scoped>
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ccc;
}
</style>