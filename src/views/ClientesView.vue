<template>
  <div class="container py-4">

   <!-- HEADER -->
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  <div>
    <h2 class="fw-bold mb-0 gradient-title">
  Gestión de Clientes
</h2>
    <small class="text-muted">
      Administra pacientes, historial y saldos de la clínica
    </small>
  </div>

<div class="d-flex gap-2 flex-wrap">
  <button 
    class="btn btn-outline-success btn-lg rounded-3 px-4"
    @click="abrirModalMedicinas"
  >
    <i class="bi bi-capsule-pill me-2"></i>
    Medicinas utilizadas
  </button>

  <button 
    class="btn btn-primary btn-lg rounded-3 px-4"
    @click="abrirCrear"
  >
    <i class="bi bi-person-plus me-2"></i>
    Nuevo Cliente
  </button>
</div>
</div>





    <div class="modal fade" id="modalEditar" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">
          {{ esEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <label>Nombre</label>
        <input v-model="form.nombre" class="form-control mb-2">

        <label>Teléfono</label>
        <input v-model="form.telefono" class="form-control mb-2">

        <label>Código</label>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="codigoAutomatico"
            v-model="form.codigoAutomatico"
            @change="manejarCodigoAutomatico"
            :disabled="esEdicion"
          >
          <label class="form-check-label" for="codigoAutomatico">
            Generar código automático
          </label>
        </div>

        <input
          v-model="form.codigo"
          class="form-control mb-2"
          placeholder="Código generado automáticamente"
          :readonly="true"
          :disabled="!form.codigoAutomatico"
        >

        <label>DPI / NIT</label>
        <input v-model="form.dpi" class="form-control mb-2" placeholder="DPI o NIT si aplica">

        <label>Dirección</label>
        <input v-model="form.direccion" class="form-control mb-2">

        <label>Notas clínicas</label>
        <textarea v-model="form.notas" class="form-control"></textarea>

      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button class="btn btn-primary" @click="guardarCliente">
          {{ esEdicion ? 'Actualizar' : 'Guardar' }}
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="modalMedicinas" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Historial general de medicinas</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <div class="medicinas-toolbar mb-3">
  <div class="row g-2">
    <div class="col-md-4">
      <label class="form-label filtro-label">Medicamento</label>
      <input
        v-model="filtroMedicamento"
        class="form-control form-control-modern"
        placeholder="Buscar medicamento..."
      >
    </div>

    <div class="col-md-3">
      <label class="form-label filtro-label">Paciente</label>
      <input
        v-model="filtroPacienteMedicamento"
        class="form-control form-control-modern"
        placeholder="Buscar..."
      >
    </div>

    <div class="col-md-2">
      <label class="form-label filtro-label">Desde</label>
      <input
        v-model="filtroFechaInicioMedicamento"
        type="date"
        class="form-control form-control-modern"
      >
    </div>

    <div class="col-md-2">
      <label class="form-label filtro-label">Hasta</label>
      <input
        v-model="filtroFechaFinMedicamento"
        type="date"
        class="form-control form-control-modern"
      >
    </div>

    <div class="col-md-1 d-flex align-items-end">
      <button class="btn btn-outline-secondary w-100" @click="limpiarFiltrosMedicinas">
        Limpiar
      </button>
    </div>
  </div>
</div>

<div v-if="medicinasFiltradas.length" class="row g-2 mb-3">
  <div class="col-md-4">
    <div class="resumen-medicina-card">
      <small>Registros</small>
      <h5>{{ medicinasFiltradas.length }}</h5>
    </div>
  </div>
  <div class="col-md-4">
    <div class="resumen-medicina-card">
      <small>Cantidad total</small>
      <h5>{{ cantidadTotalMedicinas }}</h5>
    </div>
  </div>
  <div class="col-md-4">
    <div class="resumen-medicina-card total">
      <small>Total general</small>
      <h5>Q {{ totalGeneralMedicinas.toFixed(2) }}</h5>
    </div>
  </div>
</div>
        <div v-if="medicinasFiltradas.length" class="d-flex justify-content-end mb-2">
          <div class="fw-bold">
            Total general: Q {{ totalGeneralMedicinas.toFixed(2) }}
          </div>
        </div>
        <div v-if="medicinasFiltradas.length" class="table-responsive tabla-medicinas-wrap">
  <table class="table align-middle tabla-medicinas">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Medicamento</th>
        <th>Detalle</th>
        <th>Unidad</th>
        <th class="text-end">Cant.</th>
        <th class="text-end">Costo U.</th>
        <th class="text-end">Total</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="m in medicinasFiltradas" :key="m.id">
        <td class="text-nowrap">
          {{ formatearFechaMedicamento(m.fecha) }}
        </td>

        <td>
          <div class="fw-semibold text-primary-emphasis">
            {{ m.nombre || "Sin medicamento" }}
          </div>
          <small class="text-muted d-block">
            {{ m.pacienteNombre || "-" }}
          </small>
        </td>

        <td>
          <small class="text-muted">
            {{ m.descripcion || "Sin descripción" }}
          </small>
        </td>

        <td>
          <span class="badge text-bg-light rounded-pill px-3 py-2">
            {{ m.unidad || "N/A" }}
          </span>
        </td>

        <td class="text-end fw-semibold">
          {{ Number(m.cantidad || 0) }}
        </td>

        <td class="text-end">
          Q {{ Number(m.costo || 0).toFixed(2) }}
        </td>

        <td class="text-end total-cell">
          Q {{ (Number(m.costo || 0) * Number(m.cantidad || 0)).toFixed(2) }}
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <th colspan="6" class="text-end">Total general</th>
        <th class="text-end total-footer">
          Q {{ totalGeneralMedicinas.toFixed(2) }}
        </th>
      </tr>
    </tfoot>
  </table>
</div>

        <div v-else class="text-center text-muted py-4">
          No hay medicinas registradas.
        </div>

      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">
          Cerrar
        </button>
      </div>

    </div>
  </div>
</div>
    <!-- Buscador -->
<div class="card shadow-sm border-0 rounded-4 mb-4">
  <div class="card-body">
    <div class="search-box mb-4">
  <i class="bi bi-search"></i>
  <input
    v-model="busqueda"
    placeholder="Buscar paciente..."
  />
</div>
  </div>
</div>


    <!-- LISTA DE CLIENTES -->
    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body">

        <h5 class="fw-semibold mb-3">Lista de Clientes</h5>

        <ul class="list-group list-group-flush">
         <li 
  v-for="c in clientesFiltrados" 
  :key="c.id"
  class="cliente-card-item mb-3 p-3 shadow-sm"
  :class="c.saldo >= 0 ? 'cliente-ok' : 'cliente-deuda'"
  @click="$router.push(`/cliente/${c.id}`)"
>

  <div class="cliente-layout">

    <!-- IZQUIERDA -->
    <div class="d-flex align-items-center gap-3">
      <div 
  class="avatar-cliente"
  :style="{ background: generarColor(c.nombre) }"
>
  {{ c.nombre?.charAt(0).toUpperCase() }}
</div>

      <div>
        <h5 class="mb-0 fw-bold text-primary">
          {{ c.nombre }}
        </h5>
        <small class="text-muted d-block">
          📞 {{ c.telefono || 'Sin teléfono' }}
        </small>
        <small class="text-muted d-block">
        🏷️ Código: {{ c.codigo || 'Sin código' }}
      </small>

      <small class="text-muted">
        🆔 DPI / NIT: {{ c.dpi || 'Sin DPI / NIT' }}
      </small>
      </div>
    </div>

    <!-- DERECHA -->
    <div class="text-end">

      <span 
        class="badge fs-6 px-3 py-2 rounded-pill mb-2 d-block"
        :class="c.saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo'"
      >
        Q {{ c.saldo }}
      </span>

      <div class="d-flex gap-2 justify-content-end">
        <button
          class="btn btn-outline-warning btn-sm"
          @click.stop="abrirEditar(c)"
        >
          ✏️ Editar
        </button>

        <button
          class="btn btn-outline-danger btn-sm"
          @click.stop="desactivarCliente(c)"
        >
          🚫 Desactivar
        </button>
      </div>

    </div>

  </div>

</li>


        </ul>

      </div>
    </div>

  </div>

  <!-- TOAST GLOBAL -->
<div class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 9999">

  <div 
    id="toastGlobal" 
    class="toast align-items-center border-0 shadow-lg rounded-4"
    role="alert"
  >
    <div class="d-flex">
      <div class="toast-body fw-semibold" id="toastMensaje"></div>
      <button 
        type="button" 
        class="btn-close me-2 m-auto" 
        data-bs-dismiss="toast">
      </button>
    </div>
  </div>

</div>
</template>
<script>
import { db } from "../firebase";
import { Modal } from "bootstrap";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  query,
  orderBy,
  collectionGroup
} from "firebase/firestore";
import * as bootstrap from "bootstrap";

export default {
  data() {
    return {
      busqueda: "",
      clientes: [],
      modalEditar: null,
      modalMedicinas: null,
      medicinas: [],
      filtroMedicamento: "",
      filtroPacienteMedicamento: "",
      filtroFechaInicioMedicamento: "",
      filtroFechaFinMedicamento: "",

      esEdicion: false,   // 👈 saber si creamos o editamos

      form: {
        id: "",
        nombre: "",
        telefono: "",
        dpi: "",
        codigo: "",
        direccion: "",
        notas: "",
        codigoAutomatico: true
      }
    };
  },
  
  computed: {

  totalGeneralMedicinas() {
  return this.medicinasFiltradas.reduce((acc, m) => {
    return acc + (Number(m.costo || 0) * Number(m.cantidad || 0));
  }, 0);
},
    clientesFiltrados() {
      const b = this.busqueda.toLowerCase();

      return [...this.clientes]
        .filter(c =>
          c.nombre?.toLowerCase().includes(b) ||
          c.codigo?.toLowerCase().includes(b) ||
          c.dpi?.toLowerCase().includes(b) ||
          c.telefono?.toLowerCase().includes(b)
        )
        .sort((a, b) => {
          const codigoA = String(a.codigo || "").trim();
          const codigoB = String(b.codigo || "").trim();

          if (!codigoA && !codigoB) {
            return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es", {
              sensitivity: "base"
            });
          }

          if (!codigoA) return 1;
          if (!codigoB) return -1;

          return codigoA.localeCompare(codigoB, "es", {
            numeric: true,
            sensitivity: "base"
          });
        });
    },
    medicinasFiltradas() {
  const medicamento = (this.filtroMedicamento || "").toLowerCase();
  const paciente = (this.filtroPacienteMedicamento || "").toLowerCase();
  const fechaInicio = this.filtroFechaInicioMedicamento || "";
  const fechaFin = this.filtroFechaFinMedicamento || "";

  return this.medicinas.filter(m => {
    const nombreMedicamento = String(m.nombre || "").toLowerCase();
    const nombrePaciente = String(m.pacienteNombre || m.doctor?.nombre || m.usuario || "").toLowerCase();

    let fechaTexto = "";
    if (m.fecha?.seconds) {
      fechaTexto = new Date(m.fecha.seconds * 1000).toISOString().slice(0, 10);
    }

    const coincideMedicamento =
      !medicamento || nombreMedicamento.includes(medicamento);

    const coincidePaciente =
      !paciente || nombrePaciente.includes(paciente);

    const coincideFechaInicio =
      !fechaInicio || fechaTexto >= fechaInicio;

    const coincideFechaFin =
      !fechaFin || fechaTexto <= fechaFin;

    return (
      coincideMedicamento &&
      coincidePaciente &&
      coincideFechaInicio &&
      coincideFechaFin
    );
  });
},

cantidadTotalMedicinas() {
  return this.medicinasFiltradas.reduce((acc, m) => {
    return acc + Number(m.cantidad || 0);
  }, 0);
},

totalGeneralMedicinas() {
  return this.medicinasFiltradas.reduce((acc, m) => {
    return acc + (Number(m.costo || 0) * Number(m.cantidad || 0));
  }, 0);
},
  },

  mounted() {
    onSnapshot(collection(db, "clientes"), (snap) => {
      this.clientes = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.activo !== false);
    });

    // Crear instancia del modal
    this.$nextTick(() => {
      this.modalEditar = new Modal(document.getElementById("modalEditar"));
    });

    this.$nextTick(() => {
  this.modalMedicinas = new Modal(document.getElementById("modalMedicinas"));
});

const qMedicinas = query(collectionGroup(db, "medicinas"));

onSnapshot(
  qMedicinas,
  (snap) => {
    this.medicinas = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    console.log("Medicinas cargadas:", this.medicinas);
  },
  (error) => {
    console.error("Error cargando medicinas:", error);
  }
);
  },

  methods: {

    mostrarToast(mensaje, tipo = "success") {
  const toastEl = document.getElementById("toastGlobal");
  const mensajeEl = document.getElementById("toastMensaje");

  mensajeEl.innerText = mensaje;

  toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");

  if (tipo === "success") toastEl.classList.add("bg-success", "text-white");
  if (tipo === "error") toastEl.classList.add("bg-danger", "text-white");
  if (tipo === "warning") toastEl.classList.add("bg-warning");

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
},
    generarColor(nombre) {
  const colores = [
    "linear-gradient(135deg,#0d6efd,#4dabf7)",
    "linear-gradient(135deg,#20c997,#0ca678)",
    "linear-gradient(135deg,#f59f00,#f76707)",
    "linear-gradient(135deg,#ae3ec9,#7048e8)",
    "linear-gradient(135deg,#e03131,#c92a2a)"
  ];

  const index = nombre?.charCodeAt(0) % colores.length;
  return colores[index];
},
    irDetalle(id) {
      if (!id) return;
      this.$router.push(`/cliente/${id}`);
    },

    abrirCrear() {
      this.esEdicion = false;
      this.form = {
        id: "",
        nombre: "",
        telefono: "",
        dpi: "",
        codigo: "",
        direccion: "",
        notas: "",
        codigoAutomatico: true
      };

      this.generarCodigoAutomatico();
      this.modalEditar.show();
    },

    abrirEditar(c) {
      this.esEdicion = true;
      this.form = { 
        id: c.id,
        nombre: c.nombre || "",
        telefono: c.telefono || "",
        dpi: c.dpi || "",
        codigo: c.codigo || "",
        direccion: c.direccion || "",
        notas: c.notas || "",
        codigoAutomatico: true
      };
      this.modalEditar.show();
    },


    normalizarCodigo(valor) {
  return String(valor || "").trim().toUpperCase();
},

generarSiguienteCodigo() {
  const usados = this.clientes
    .map(c => this.normalizarCodigo(c.codigo))
    .filter(Boolean);

  let numero = 1;

  while (true) {
    const codigo = `PAC-${String(numero).padStart(4, "0")}`;
    if (!usados.includes(codigo)) {
      return codigo;
    }
    numero++;
  }
},

manejarCodigoAutomatico() {
  if (this.form.codigoAutomatico) {
    this.form.codigo = this.generarSiguienteCodigo();
  } else {
    this.form.codigo = "";
  }
},

generarCodigoAutomatico() {
  this.form.codigo = this.generarSiguienteCodigo();
},
    async guardarCliente() {
      const usuario = JSON.parse(localStorage.getItem("doctorUser"));

      if (this.esEdicion) {
        // 🔵 EDITAR
        const before = this.clientes.find(x => x.id === this.form.id);

        await updateDoc(doc(db, "clientes", this.form.id), {
          nombre: this.form.nombre,
          telefono: this.form.telefono,
          codigo: this.form.codigo,
          dpi: this.form.dpi,
          direccion: this.form.direccion,
          notas: this.form.notas
        });

        await addDoc(collection(db, "auditoria_pacientes"), {
          accion: "editar",
          pacienteId: this.form.id,
          antes: before,
          despues: this.form,
          usuario: usuario?.name,
          usuarioId: usuario?.uid,
          timestamp: new Date()
        });

      } else {
        // 🟢 CREAR
        const codigoGenerado = this.generarSiguienteCodigo();
        this.form.codigo = codigoGenerado;

        const ref = await addDoc(collection(db, "clientes"), {
          nombre: this.form.nombre,
          telefono: this.form.telefono,
          dpi: this.form.dpi,
          codigo: codigoGenerado,
          direccion: this.form.direccion,
          notas: this.form.notas,
          saldo: 0,
          activo: true,
          fecha: serverTimestamp()
        });

        await addDoc(collection(db, "auditoria_pacientes"), {
          accion: "crear",
          pacienteId: ref.id,
          datos: this.form,
          usuario: usuario?.name,
          usuarioId: usuario?.uid,
          timestamp: new Date()
        });
      }

      this.modalEditar.hide();
    },

    async desactivarCliente(c) {

  const confirmar = await this.confirmarAccion(
    `¿Desactivar a ${c.nombre}?`,
    "No se borrará su historial."
  );

  if (!confirmar) return;

  const usuario = JSON.parse(localStorage.getItem("doctorUser"));

  await updateDoc(doc(db, "clientes", c.id), {
    activo: false
  });

  await addDoc(collection(db, "auditoria_pacientes"), {
    accion: "desactivar",
    pacienteId: c.id,
    pacienteNombre: c.nombre,
    usuario: usuario?.name,
    usuarioId: usuario?.uid,
    timestamp: new Date()
  });

  this.mostrarToast("Paciente desactivado correctamente", "success");
},

confirmarAccion(titulo, subtitulo = "") {
  return new Promise((resolve) => {

    const toastEl = document.getElementById("toastGlobal");
    const mensajeEl = document.getElementById("toastMensaje");

    mensajeEl.innerHTML = `
      <div class="fw-bold mb-1">${titulo}</div>
      <div class="small text-muted mb-3">${subtitulo}</div>
      <div class="d-flex gap-2">
        <button id="btnSi" class="btn btn-sm btn-danger">Sí</button>
        <button id="btnNo" class="btn btn-sm btn-secondary">Cancelar</button>
      </div>
    `;

    toastEl.classList.remove("bg-success", "bg-danger");
    toastEl.classList.add("bg-warning");

    const toast = new bootstrap.Toast(toastEl, { autohide: false });
    toast.show();

    setTimeout(() => {
      document.getElementById("btnSi").onclick = () => {
        toast.hide();
        resolve(true);
      };

      document.getElementById("btnNo").onclick = () => {
        toast.hide();
        resolve(false);
      };
    }, 100);
  });
},

abrirModalMedicinas() {
  this.modalMedicinas?.show();
},

formatearFechaMedicamento(fecha) {
  if (!fecha?.seconds) return "-";
  const d = new Date(fecha.seconds * 1000);
  return d.toLocaleDateString("es-GT");
},

limpiarFiltrosMedicinas() {
  this.filtroMedicamento = "";
  this.filtroPacienteMedicamento = "";
  this.filtroFechaInicioMedicamento = "";
  this.filtroFechaFinMedicamento = "";
},
  }
};
</script>


<style scoped>
.cliente-item {
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  border-radius: 10px !important;
}

.cliente-item:hover {
  background: #f4f9ff;
  transform: scale(1.01);
}

/* Animación fade suave */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* TARJETA CLIENTE */
.cliente-card-item {
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #f1f3f5;
}

.cliente-card-item:hover {
  background: #ffffff;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

/* Avatar */
.avatar-cliente {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #4dabf7);
  color: white;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 14px;
  gap: 10px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13,110,253,0.15);
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}
.saldo-positivo {
  background: #e6f4ea;
  color: #1e7e34;
}

.saldo-negativo {
  background: #fdecea;
  color: #b02a37;
}
.cliente-card-item {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #f1f3f5;
  overflow: hidden;
}

.cliente-card-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
}

.cliente-ok::before {
  background: linear-gradient(180deg, #20c997, #198754);
}

.cliente-deuda::before {
  background: linear-gradient(180deg, #ff6b6b, #c92a2a);
}
.cliente-card-item + .cliente-card-item {
  margin-top: 14px;
}
/* Layout general */
.cliente-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* En móvil cambia a vertical */
@media (max-width: 768px) {
  .cliente-layout {
    flex-direction: column;
    align-items: flex-start;
  }

  .cliente-layout .text-end {
    width: 100%;
    text-align: left !important;
    margin-top: 10px;
  }

  .cliente-layout .badge {
    display: inline-block !important;
    margin-bottom: 10px;
  }

  .cliente-layout .d-flex.gap-2 {
    justify-content: flex-start !important;
  }
}
@media (max-width: 768px) {
  .cliente-card-item button {
    flex: 1;
  }

  .cliente-layout .d-flex.gap-2 {
    width: 100%;
  }
}

.form-control-modern {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  min-height: 44px;
}

.form-control-modern:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,.12);
}

.filtro-label {
  font-size: 12px;
  font-weight: 700;
  color: #6c757d;
  margin-bottom: 6px;
}

.medicinas-toolbar {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 14px;
}

.resumen-medicina-card {
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.resumen-medicina-card small {
  display: block;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 600;
}

.resumen-medicina-card h5 {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
}

.resumen-medicina-card.total {
  background: linear-gradient(135deg, #f0fdf4, #ecfeff);
}

.tabla-medicinas-wrap {
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.tabla-medicinas {
  margin-bottom: 0;
}

.tabla-medicinas thead th {
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .03em;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.tabla-medicinas tbody td {
  border-color: #f1f5f9;
  vertical-align: middle;
}

.tabla-medicinas tbody tr:hover {
  background: #f8fbff;
}

.total-cell {
  font-weight: 800;
  color: #198754;
}

.tabla-medicinas tfoot th {
  background: #fcfcfd;
  border-top: 2px solid #dbe4ee;
}

.total-footer {
  font-weight: 800;
  color: #198754;
}
</style>
