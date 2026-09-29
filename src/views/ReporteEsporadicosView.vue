<template>
  <div class="container-fluid py-3">

    <div class="erp-layout" :class="{ 'is-loading': mostrandoCargaReporte }">

      <div v-if="mostrandoCargaReporte" class="reporte-loading" role="status" aria-live="polite">
        <div class="spinner-reporte"></div>
        <span>Cargando reporte...</span>
      </div>

      <!-- ================= LEFT PANEL ================= -->
      <div class="erp-sidebar">

        <!-- ===== FILTROS ===== -->
        <div class="erp-section filtros-compactos">

 <div class="filtro-card">

  <!-- 🔥 FILA: Periodo + Colaborador -->
  <div class="filtro-row">
    <div class="filtro-item">
      <label>Periodo</label>
      <select v-model="tipoReporte" @change="cargarTodo" :disabled="cargandoReporte">
        <option value="dia">Hoy</option>
        <option value="semana">Semana</option>
        <option value="mes">Mes</option>
        <option value="rango">Rango</option>
      </select>
    </div>

    <div class="filtro-item">
      <label>Colaborador</label>
      <select v-model="doctorSeleccionado" @change="indicarFiltradoLocal" :disabled="cargandoReporte">
        <option value="todos">Todos</option>
        <option v-for="d in doctoresEnResultados" :key="d.uid" :value="d.uid">
          {{ d.name }}
        </option>
      </select>
    </div>
  </div>

  <!-- RANGO -->
  <div v-if="tipoReporte === 'rango'" class="filtro-rango">
    <input type="date" v-model="fechaInicioRango" @change="cargarTodo" :disabled="cargandoReporte">
    <input type="date" v-model="fechaFinRango" @change="cargarTodo" :disabled="cargandoReporte">
  </div>

</div>


</div>

        <!-- ===== RESUMEN ===== -->
     <!-- ===== RESUMEN PRINCIPAL ===== -->
<div class="resumen-clean mt-4">

  <!-- 🔥 RESULTADO PRINCIPAL -->
  <div class="neto-main"
       :class="(totalGeneral - totalGastos) >= 0 ? 'positivo' : 'negativo'">

    <div class="titulo">Resultado del periodo</div>

    <div class="monto">
      Q {{ (totalGeneral - totalGastos).toFixed(2) }}
    </div>

    <div class="subinfo">
      <span>Ingresos: Q {{ totalGeneral }}</span>
      <span class="link-gastos" @click="mostrarModalGastos = true">
  Gastos: Q {{ totalGastos }}
</span>
      <span>Facturar: Q {{ totalFacturar }}</span>
    </div>

    <div v-if="faltanteDepositar > 0" class="alerta-mini">
      ⚠ Falta depositar Q {{ faltanteDepositar }}
    </div>

  </div>

  <!-- 💳 MÉTODOS -->
  <div class="metodos-linea">
    <div>Efectivo <strong>Q {{ totalesPago.Efectivo }}</strong></div>
    <div>Transferencia <strong>Q {{ totalesPago.Transferencia }}</strong></div>
    <div>Otros <strong>Q {{ totalesPago.Otro }}</strong></div>
  </div>
</div>

<!-- ===== COMISIONES APARTE ===== -->
<div class="comisiones-card mt-3">
  <div class="comisiones-header">
    <span>Comisiones por colaborador</span>
  </div>

  <div
    v-for="d in gananciasPorDoctor"
    :key="d.nombre"
    class="comision-row"
  >
    <div class="left">
      <span class="nombre">{{ d.nombre }}</span>
      <span class="porcentaje">{{ d.comision }}%</span>
    </div>

    <strong>Q {{ d.gana.toFixed(2) }}</strong>
  </div>
</div>

<p></p>
 <button 
  v-if="usuarioActual?.role === 'admin'"
  class="btn-imprimir"
  @click="imprimirReporte"
>
  🖨️ Imprimir reporte
</button>
      </div>


      <!-- ================= RIGHT PANEL ================= -->
      <div class="erp-main">

  <div class="table-responsive">
    <table class="table erp-table align-middle">

      <thead>
        <tr>
          <th>Cliente</th>
          <th>Detalle</th>
          <th>Atendió</th>
          <th>Método</th>
          <th class="text-end">Monto</th>
          <th>Fecha</th>
        </tr>
      </thead>

      <tbody>

        <tr v-for="e in resultadosOrdenados" :key="e.id">

          <!-- CLIENTE -->
          <td class="cliente-cell">
            <div class="nombre">{{ e.nombre }}</div>
            <div class="telefono" v-if="e.telefono">
              {{ e.telefono }}
            </div>
          </td>

          <!-- DETALLE -->
          <td class="detalle-cell">
            <div class="tipo">{{ e.tipo }}</div>
            <div class="descripcion">
              {{ e.motivo || e.descripcion }}
            </div>

            <div v-if="e.facturar" class="facturar">
              Facturar
            </div>
          </td>

          <!-- DOCTOR -->
          <td class="muted">{{ e.doctorNombre }}</td>

          <!-- MÉTODO -->
          <td class="muted">
            {{ e.metodoPago || 'N/D' }}
          </td>

          <!-- MONTO -->
          <td class="text-end monto">
            Q {{ e.monto }}
          </td>

          <!-- FECHA -->
          <td class="fecha">
            {{ formatearFecha(e.fecha) }}
          </td>

        </tr>

        <tr v-if="resultadosOrdenados.length === 0">
          <td colspan="6" class="empty">
            No hay registros
          </td>
        </tr>

      </tbody>

    </table>
  </div>

</div>

    </div>

  </div>

  <!-- ================= MODAL GASTOS ================= -->
<div v-if="mostrarModalGastos" class="modal-backdrop-custom" @click.self="mostrarModalGastos = false">
  <div class="modal-custom modal-gastos">
    <div class="modal-header">
      <div>
        <strong>Gastos del periodo</strong>
        <div class="modal-sub">
          Total: <strong>Q {{ totalGastos.toFixed(2) }}</strong>
          <span class="pill-mini" v-if="doctorSeleccionado !== 'todos'">Filtrado por colaborador</span>
        </div>
      </div>

      <button class="btn-cerrar" @click="mostrarModalGastos = false">✕</button>
    </div>

    <div class="modal-body">
      <div v-if="gastosDetalle.length === 0" class="empty">
        No hay gastos en el periodo.
      </div>

      <div v-else class="gastos-list">
        <div v-for="g in gastosDetalle" :key="g.uid" class="gasto-item">
          <div class="gasto-top">
            <div class="gasto-desc">
              <div class="gasto-titulo">{{ g.titulo }}</div>
              <div class="gasto-meta">
                <span class="chip-doctor">👤 {{ g.doctorNombre }}</span>
                <span class="chip-fecha">🗓 {{ formatearFecha(g.fecha) }}</span>
                <span class="chip-tipo"># {{ g.origen }}</span>
              </div>
            </div>

            <div class="gasto-monto">
              Q {{ (g.monto || 0).toFixed(2) }}
            </div>
          </div>

          <div v-if="g.detalle" class="gasto-detalle">
            {{ g.detalle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ================= PRINT AREA ================= -->
<div id="printArea" class="print-area">

  <h2 style="margin:0 0 6px;">Reporte</h2>
  <div style="color:#64748b; font-size:12px; margin-bottom:12px;">
    Periodo: <strong>{{ tipoReporte }}</strong> |
    Colaborador: <strong>{{ doctorSeleccionado === 'todos' ? 'Todos' : (doctoresEnResultados.find(d => d.uid === doctorSeleccionado)?.name || '—') }}</strong>
  </div>

  <!-- RESUMEN -->
  <div class="print-kpis">
    <div><span>Ingresos</span><strong>Q {{ Number(totalGeneral || 0).toFixed(2) }}</strong></div>
    <div><span>Gastos</span><strong>Q {{ Number(totalGastos || 0).toFixed(2) }}</strong></div>
    <div><span>Resultado Neto</span><strong>Q {{ Number((totalGeneral - totalGastos) || 0).toFixed(2) }}</strong></div>
    <div><span>Facturar</span><strong>Q {{ Number(totalFacturar || 0).toFixed(2) }}</strong></div>  
  </div>

  <!-- TABLA -->
  <table class="print-table">
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Detalle</th>
        <th>Atendió</th>
        <th>Método</th>
        <th style="text-align:right;">Monto</th>
        <th>Fecha</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="e in resultadosOrdenados" :key="'p-'+e.id">
        <td>
          <div style="font-weight:700;">{{ e.nombre }}</div>
          <div style="color:#64748b; font-size:12px;" v-if="e.telefono">{{ e.telefono }}</div>
        </td>

        <td>
          <div style="font-weight:700; text-transform:capitalize;">{{ e.tipo }}</div>
          <div style="color:#475569; font-size:12px;">{{ e.motivo || e.descripcion }}</div>
          <div v-if="e.facturar" style="color:#92400e; font-size:12px; font-weight:700;">Facturar</div>
        </td>

        <td>{{ e.doctorNombre }}</td>
        <td>{{ e.metodoPago || 'N/D' }}</td>
        <td style="text-align:right; font-weight:800;">Q {{ Number(e.monto || 0).toFixed(2) }}</td>
        <td style="color:#64748b; font-size:12px;">{{ formatearFecha(e.fecha) }}</td>
      </tr>

      <tr v-if="resultadosOrdenados.length === 0">
        <td colspan="6" style="text-align:center; color:#64748b; padding:16px;">
          No hay registros
        </td>
      </tr>
    </tbody>
  </table>

  <!-- COMISIONES (opcional en impresión) -->
  <div style="margin-top:16px;">
    <h3 style="margin:0 0 8px;">Comisiones por colaborador</h3>
    <table class="print-table">
      <thead>
        <tr>
          <th>Colaborador</th>
          <th>%</th>
          <th style="text-align:right;">Gana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in gananciasPorDoctor" :key="'c-'+d.id">
          <td>{{ d.nombre }}</td>
          <td>{{ d.comision }}%</td>
          <td style="text-align:right; font-weight:800;">Q {{ Number(d.gana || 0).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
</template>

<script>
import {
  collection, collectionGroup, documentId, onSnapshot, query, where, getDocs
} from "firebase/firestore";

import { db } from "../firebase";

export default {
  data() {
    return {
      tipoReporte: "dia",
      doctorSeleccionado: "todos",
      doctores: [],
      esporadicos: [],
      movimientos: [],
      fechaInicioRango: "",
      fechaFinRango: "",
      cargandoMovimientos: false,
      cargandoReporte: false,
      cargandoFiltroLocal: false,
      trabajos: [],
      mostrarModalGastos: false,
      unsubscribeDoctores: null,
      unsubscribeEsporadicos: null,
      cargaToken: 0,
    };
  },

  mounted() {
    this.cargarDoctores();
    this.cargarTodo();
  },

  beforeUnmount() {
    if (typeof this.unsubscribeDoctores === "function") {
      this.unsubscribeDoctores();
      this.unsubscribeDoctores = null;
    }

    if (typeof this.unsubscribeEsporadicos === "function") {
      this.unsubscribeEsporadicos();
      this.unsubscribeEsporadicos = null;
    }
  },

  methods: {
    toDate(fecha) {
      if (!fecha) return null;
      return fecha?.toDate ? fecha.toDate() : fecha;
    },

    enRango(fecha) {
      const { inicio, fin } = this.obtenerRango();
      const f = this.toDate(fecha);
      return f >= inicio && f <= fin;
    },

    imprimirReporte() {
      this.mostrarModalGastos = false;
      this.$nextTick(() => {
        setTimeout(() => window.print(), 50);
      });
    },

    cargarDoctores() {
      if (typeof this.unsubscribeDoctores === "function") {
        this.unsubscribeDoctores();
      }

      this.unsubscribeDoctores = onSnapshot(collection(db, "doctores"), snap => {
        this.doctores = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        console.log("Doctores cargados:", this.doctores);
      });
    },

    obtenerRango() {
      const ahora = new Date();
      let inicio = new Date();
      let fin = new Date();

      if (this.tipoReporte === "rango") {
        if (!this.fechaInicioRango || !this.fechaFinRango) {
          inicio.setHours(0, 0, 0, 0);
          fin.setHours(23, 59, 59, 999);
          return { inicio, fin };
        }

        inicio = new Date(this.fechaInicioRango + "T00:00:00");
        fin = new Date(this.fechaFinRango + "T23:59:59.999");
        return { inicio, fin };
      }

      if (this.tipoReporte === "dia") {
        inicio.setHours(0, 0, 0, 0);
        fin.setHours(23, 59, 59, 999);
      }
      else if (this.tipoReporte === "semana") {
        const d = ahora.getDay();
        inicio.setDate(ahora.getDate() - d);
        inicio.setHours(0, 0, 0, 0);
        fin = new Date(inicio);
        fin.setDate(inicio.getDate() + 6);
        fin.setHours(23, 59, 59, 999);
      }
      else {
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
        fin.setHours(23, 59, 59, 999);
      }

      return { inicio, fin };
    },

    async procesarEnLotes(items, loteSize, worker, tokenActual = this.cargaToken) {
      const acumulado = [];

      for (let i = 0; i < items.length; i += loteSize) {
        if (tokenActual !== this.cargaToken) break;

        const lote = items.slice(i, i + loteSize);
        const parciales = await Promise.all(lote.map(worker));
        acumulado.push(...parciales.flat());
      }

      return acumulado;
    },

    async cargarClientesPorIds(ids, tokenActual = this.cargaToken) {
      const idsUnicos = [...new Set(ids.filter(Boolean))];
      const clientes = {};

      if (idsUnicos.length === 0) {
        return clientes;
      }

      for (let i = 0; i < idsUnicos.length; i += 30) {
        if (tokenActual !== this.cargaToken) break;

        const lote = idsUnicos.slice(i, i + 30);
        const q = query(
          collection(db, "clientes"),
          where(documentId(), "in", lote)
        );

        const snap = await getDocs(q);
        snap.docs.forEach(doc => {
          clientes[doc.id] = doc.data();
        });
      }

      return clientes;
    },

    async cargarTodo() {
      const tokenActual = ++this.cargaToken;
      this.cargandoReporte = true;

      try {
        await Promise.all([
          this.cargarEsporadicos(tokenActual),
          this.cargarMovimientos(tokenActual),
          this.cargarTrabajos(tokenActual)
        ]);
      } finally {
        if (tokenActual === this.cargaToken) {
          this.cargandoReporte = false;
        }
      }
    },

    cargarEsporadicos(tokenActual = this.cargaToken) {
      const { inicio, fin } = this.obtenerRango();

      if (typeof this.unsubscribeEsporadicos === "function") {
        this.unsubscribeEsporadicos();
        this.unsubscribeEsporadicos = null;
      }

      const q = query(
        collection(db, "esporadicos"),
        where("fecha", ">=", inicio),
        where("fecha", "<=", fin)
      );

      return new Promise((resolve) => {
        let primeraCarga = true;

        this.unsubscribeEsporadicos = onSnapshot(q, snap => {
          if (tokenActual !== this.cargaToken) {
            if (primeraCarga) resolve();
            primeraCarga = false;
            return;
          }

          this.esporadicos = snap.docs.map(d => ({
            id: d.id,
            tipo: "esporadico",
            nombre: d.data().nombre,
            telefono: d.data().telefono,
            motivo: d.data().motivo,
            monto: d.data().montoCobrado,
            gasto: d.data().gasto || 0,
            metodoPago: d.data().metodoPago,
            facturar: d.data().facturar === true,
            fecha: d.data().fecha,
            doctorId: d.data().doctor?.id || null,
            doctorNombre: d.data().doctor?.nombre || "N/D"
          }));

          if (primeraCarga) resolve();
          primeraCarga = false;
        }, error => {
          console.error("Error cargando esporadicos:", error);
          if (tokenActual === this.cargaToken) {
            this.esporadicos = [];
          }
          resolve();
        });
      });
    },

    indicarFiltradoLocal() {
      this.cargandoFiltroLocal = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.cargandoFiltroLocal = false;
        }, 180);
      });
    },

    requiereIndiceFirestore(error) {
      return error?.code === "failed-precondition" && /index/i.test(error.message || "");
    },

    async cargarMovimientosPorCliente(tokenActual = this.cargaToken) {
      const clientesSnap = await getDocs(collection(db, "clientes"));
      const { inicio, fin } = this.obtenerRango();

      return this.procesarEnLotes(
        clientesSnap.docs,
        15,
        async (cliente) => {
          const movRef = collection(db, "clientes", cliente.id, "movimientos");
          const q = query(
            movRef,
            where("fecha", ">=", inicio),
            where("fecha", "<=", fin)
          );

          const movSnap = await getDocs(q);
          const nombreCliente = cliente.data().nombre;

          return movSnap.docs.map(doc => {
            const d = doc.data();

            return {
              id: doc.id,
              tipo: d.tipo,
              nombre: nombreCliente,
              monto: d.monto,
              metodoPago: d.metodoPago || null,
              fecha: d.fecha,
              facturar: d.facturar === true,
              descripcion: d.descripcion,
              doctorId: d.doctor?.id || null,
              doctorNombre: d.doctor?.nombre || "N/D"
            };
          });
        },
        tokenActual
      );
    },

    async cargarTrabajosPorCliente(tokenActual = this.cargaToken) {
      const clientesSnap = await getDocs(collection(db, "clientes"));
      const { inicio, fin } = this.obtenerRango();

      return this.procesarEnLotes(
        clientesSnap.docs,
        15,
        async (cliente) => {
          const trabajosRef = collection(db, "clientes", cliente.id, "trabajos");
          const q = query(
            trabajosRef,
            where("fecha", ">=", inicio),
            where("fecha", "<=", fin)
          );

          const snap = await getDocs(q);
          const nombreCliente = cliente.data().nombre;

          return snap.docs.map(doc => {
            const d = doc.data();

            return {
              id: doc.id,
              tipo: "trabajo",
              nombre: nombreCliente,
              monto: d.monto,
              descripcion: d.descripcion,
              metodoPago: null,
              fecha: d.fecha,
              doctorId: d.doctor?.id || null,
              doctorNombre: d.doctor?.nombre || "N/D"
            };
          });
        },
        tokenActual
      );
    },

    async cargarMovimientos(tokenActual = this.cargaToken) {
      if (tokenActual === this.cargaToken) {
        this.cargandoMovimientos = true;
      }

      try {
        const { inicio, fin } = this.obtenerRango();

        const q = query(
          collectionGroup(db, "movimientos"),
          where("fecha", ">=", inicio),
          where("fecha", "<=", fin)
        );

        const movSnap = await getDocs(q);
        const docs = movSnap.docs;
        const clienteIds = docs.map(doc => doc.ref.parent.parent?.id).filter(Boolean);
        const clientesPorId = await this.cargarClientesPorIds(clienteIds, tokenActual);

        const movimientos = docs.map(doc => {
          const d = doc.data();
          const clienteId = doc.ref.parent.parent?.id || null;
          const cliente = clientesPorId[clienteId] || {};

          return {
            id: doc.id,
            tipo: d.tipo,
            nombre: cliente.nombre || d.clienteNombre || "N/D",
            monto: d.monto,
            metodoPago: d.metodoPago || null,
            fecha: d.fecha,
            facturar: d.facturar === true,
            descripcion: d.descripcion,
            doctorId: d.doctor?.id || null,
            doctorNombre: d.doctor?.nombre || "N/D"
          };
        });

        if (tokenActual === this.cargaToken) {
          this.movimientos = movimientos;
        }
      } catch (error) {
        if (this.requiereIndiceFirestore(error)) {
          console.warn("Indice de movimientos no disponible; usando carga compatible.", error);
          try {
            const movimientos = await this.cargarMovimientosPorCliente(tokenActual);
            if (tokenActual === this.cargaToken) {
              this.movimientos = movimientos;
            }
            return;
          } catch (fallbackError) {
            console.error("Error cargando movimientos con respaldo:", fallbackError);
          }
        }

        console.error("Error cargando movimientos:", error);
        if (tokenActual === this.cargaToken) {
          this.movimientos = [];
        }
      } finally {
        if (tokenActual === this.cargaToken) {
          this.cargandoMovimientos = false;
        }
      }
    },

    async cargarTrabajos(tokenActual = this.cargaToken) {
      try {
        const { inicio, fin } = this.obtenerRango();

        const q = query(
          collectionGroup(db, "trabajos"),
          where("fecha", ">=", inicio),
          where("fecha", "<=", fin)
        );

        const snap = await getDocs(q);
        const docs = snap.docs;
        const clienteIds = docs.map(doc => doc.ref.parent.parent?.id).filter(Boolean);
        const clientesPorId = await this.cargarClientesPorIds(clienteIds, tokenActual);

        const trabajos = docs.map(doc => {
          const d = doc.data();
          const clienteId = doc.ref.parent.parent?.id || null;
          const cliente = clientesPorId[clienteId] || {};

          return {
            id: doc.id,
            tipo: "trabajo",
            nombre: cliente.nombre || d.clienteNombre || "N/D",
            monto: d.monto,
            descripcion: d.descripcion,
            metodoPago: null,
            fecha: d.fecha,
            doctorId: d.doctor?.id || null,
            doctorNombre: d.doctor?.nombre || "N/D"
          };
        });

        if (tokenActual === this.cargaToken) {
          this.trabajos = trabajos;
        }
      } catch (error) {
        if (this.requiereIndiceFirestore(error)) {
          console.warn("Indice de trabajos no disponible; usando carga compatible.", error);
          try {
            const trabajos = await this.cargarTrabajosPorCliente(tokenActual);
            if (tokenActual === this.cargaToken) {
              this.trabajos = trabajos;
            }
            return;
          } catch (fallbackError) {
            console.error("Error cargando trabajos con respaldo:", fallbackError);
          }
        }

        console.error("Error cargando trabajos:", error);
        if (tokenActual === this.cargaToken) {
          this.trabajos = [];
        }
      }
    },

    formatearFecha(date) {
      const d = this.toDate(date);
      return d ? d.toLocaleString("es-GT") : "";
    }
  },

  computed: {
    mostrandoCargaReporte() {
      return this.cargandoReporte || this.cargandoFiltroLocal;
    },

    gastosDetalle() {
      const { inicio, fin } = this.obtenerRango();

      const lista = [
        ...this.trabajos.map(t => ({
          uid: `trabajo-${t.id}`,
          origen: "trabajo",
          titulo: t.nombre || "Trabajo",
          detalle: t.descripcion || "",
          monto: t.monto || 0,
          fecha: t.fecha,
          doctorId: t.doctorId || null,
          doctorNombre: t.doctorNombre || "N/D",
        })),
        ...this.esporadicos
          .filter(e => (e.gasto || 0) > 0)
          .map(e => ({
            uid: `esporadico-${e.id}`,
            origen: "esporadico",
            titulo: e.nombre || "Esporádico",
            detalle: e.motivo || "",
            monto: e.gasto || 0,
            fecha: e.fecha,
            doctorId: e.doctorId || null,
            doctorNombre: e.doctorNombre || "N/D",
          })),
      ];

      const enRango = lista.filter(x => {
        const f = this.toDate(x.fecha);
        return f >= inicio && f <= fin;
      });

      const filtrada =
        this.doctorSeleccionado === "todos"
          ? enRango
          : enRango.filter(x => x.doctorId === this.doctorSeleccionado);

      return filtrada
        .slice()
        .sort((a, b) => {
          const fa = this.toDate(a.fecha);
          const fb = this.toDate(b.fecha);
          return (fb || 0) - (fa || 0);
        });
    },

    trabajosFiltrados() {
      const { inicio, fin } = this.obtenerRango();

      let lista = [
        ...this.trabajos.map(t => ({
          ...t,
          origen: "trabajo",
          monto: t.monto || 0,
        })),
        ...this.esporadicos
          .filter(e => (e.gasto || 0) > 0)
          .map(e => ({
            ...e,
            origen: "esporadico",
            monto: e.gasto || 0,
          })),
      ];

      lista = lista.filter(x => {
        const f = this.toDate(x.fecha);
        return f >= inicio && f <= fin;
      });

      if (this.doctorSeleccionado !== "todos") {
        lista = lista.filter(x => x.doctorId === this.doctorSeleccionado);
      }

      return lista.filter(x => (x.monto || 0) > 0);
    },

    totalGastos() {
      return this.trabajosFiltrados
        .reduce((sum, t) => sum + (t.monto || 0), 0);
    },

    trabajosOrdenados() {
      return this.trabajosFiltrados
        .slice()
        .sort((a, b) => {
          const fa = this.toDate(a.fecha);
          const fb = this.toDate(b.fecha);
          return fb - fa;
        });
    },

    gananciasPorDoctor() {
      const mapa = {};

      this.resultadosUnificados
        .filter(r => r.tipo === "abono" || r.tipo === "esporadico")
        .forEach(r => {
          if (!r.doctorId) return;

          if (!mapa[r.doctorId]) {
            const doc = this.doctores.find(d => d.id === r.doctorId);

            mapa[r.doctorId] = {
              id: r.doctorId,
              nombre: r.doctorNombre,
              comision: doc?.comision || 0,
              totalCobrado: 0,
              totalGastos: 0,
              baseBruta: 0,
              gana: 0
            };
          }

          mapa[r.doctorId].totalCobrado += r.monto || 0;
        });

      [...this.trabajos, ...this.esporadicos].forEach(t => {
        if (!t.doctorId) return;
        if (!mapa[t.doctorId]) return;

        const gastoReal = t.gasto !== undefined ? t.gasto : t.monto;
        mapa[t.doctorId].totalGastos += gastoReal || 0;
      });

      Object.values(mapa).forEach(d => {
        d.baseBruta = Math.max(d.totalCobrado - d.totalGastos, 0);
        d.gana = d.baseBruta * (d.comision / 100);
      });

      return Object.values(mapa);
    },

    faltanteDepositar() {
      const transferencia = this.totalesPago.Transferencia || 0;
      const facturar = this.totalFacturar || 0;

      const diferencia = facturar - transferencia;

      return diferencia > 0 ? diferencia : 0;
    },

    totalFacturar() {
      return this.resultadosUnificados
        .filter(r =>
          r.facturar === true &&
          (r.tipo === "abono" || r.tipo === "esporadico")
        )
        .reduce((sum, r) => sum + (r.monto || 0), 0);
    },

    doctoresEnResultados() {
      const mapa = {};

      this.resultadosUnificados.forEach(r => {
        if (r.doctorId && r.doctorNombre) {
          mapa[r.doctorId] = r.doctorNombre;
        }
      });

      return Object.entries(mapa).map(([id, nombre]) => ({
        uid: id,
        name: nombre
      }));
    },

    usuarioActual() {
      return JSON.parse(localStorage.getItem("doctorUser"));
    },

    resultadosUnificados() {
      let todo = [
        ...this.esporadicos,
        ...this.movimientos,
        ...this.trabajos
      ];

      todo = todo.filter(r => r.tipo !== "cargo");

      if (this.doctorSeleccionado !== "todos") {
        todo = todo.filter(r => r.doctorId === this.doctorSeleccionado);
      }

      const { inicio, fin } = this.obtenerRango();

      return todo.filter(r => {
        const f = this.toDate(r.fecha);
        return f >= inicio && f <= fin;
      });
    },

    resultadosOrdenados() {
      return this.resultadosUnificados
        .filter(r => r.tipo !== "trabajo")
        .slice()
        .sort((a, b) => this.toDate(b.fecha) - this.toDate(a.fecha));
    },

    totalGeneral() {
      return this.resultadosUnificados
        .filter(r => r.tipo === "abono" || r.tipo === "esporadico")
        .reduce((sum, r) => sum + (r.monto || 0), 0);
    },

    totalCargos() {
      return this.resultadosUnificados
        .filter(r => r.tipo === "cargo")
        .reduce((sum, r) => sum + (r.monto || 0), 0);
    },

    totalesPago() {
      const pagos = { Efectivo: 0, Tarjeta: 0, Transferencia: 0, Otro: 0 };

      this.resultadosUnificados.forEach(r => {
        if ((r.tipo === "abono" || r.tipo === "esporadico") && pagos[r.metodoPago] !== undefined) {
          pagos[r.metodoPago] += r.monto || 0;
        }
      });

      return pagos;
    }
  }
};
</script>

<style scoped>
/* =========================
   BASE
   ========================= */
:root{
  --bg: #f8fafc;
  --panel: #ffffff;
  --border: #e5e7eb;
  --soft: #eef2f7;
  --text: #0f172a;
  --muted: #64748b;
  --muted2: #94a3b8;
  --brand: #2563eb;
  --ok: #22c55e;
  --bad: #ef4444;
  --warn: #f59e0b;
}

.container-fluid{
  background: var(--bg);
  color: var(--text);
}

/* =========================
   LAYOUT ERP
   ========================= */
.erp-layout{
  position: relative;
  display: grid;
  grid-template-columns: 560px 1fr;
  gap: 18px;
  align-items: stretch;
}

.erp-layout.is-loading .erp-sidebar,
.erp-layout.is-loading .erp-main{
  opacity: .48;
  pointer-events: none;
}

.reporte-loading{
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 220px;
  background: rgba(248, 250, 252, .48);
  backdrop-filter: blur(2px);
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
}

.spinner-reporte{
  width: 28px;
  height: 28px;
  border: 3px solid rgba(37, 99, 235, .18);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: girar-reporte .75s linear infinite;
}

@keyframes girar-reporte{
  to{ transform: rotate(360deg); }
}

/* Sidebar */
.erp-sidebar{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  height: calc(100vh - 90px);
  overflow-y: auto;
}

.erp-sidebar::-webkit-scrollbar{ width: 6px; }
.erp-sidebar::-webkit-scrollbar-thumb{
  background: #cbd5e1;
  border-radius: 999px;
}

/* Main */
.erp-main{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  overflow: auto;
}

/* Responsive */
@media (max-width: 1100px){
  .erp-layout{
    grid-template-columns: 1fr;
  }
  .erp-sidebar{
    height: auto;
    max-height: none;
  }
}

/* =========================
   SECCIONES
   ========================= */
.erp-section{ margin-bottom: 12px; }

/* =========================
   FILTROS (card)
   ========================= */
.filtro-card{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
}

.filtro-header{
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 10px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.filtro-item{ margin-bottom: 10px; }

.filtro-item label{
  display: block;
  font-size: 12px;
  color: #475569;
  margin-bottom: 4px;
}

.filtro-item select,
.filtro-rango input{
  width: 100%;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  border-radius: 10px;
  padding: 7px 9px;
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  transition: background .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.filtro-item select:hover,
.filtro-rango input:hover{
  background: #f3f4f6;
}

.filtro-item select:focus,
.filtro-rango input:focus{
  outline: none;
  border-color: var(--brand);
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(37,99,235,0.12);
}

.filtro-rango{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* Compact */
.filtros-compactos{ opacity: 0.92; }
.filtros-compactos:hover{ opacity: 1; }

/* =========================
   RESUMEN (limpio)
   ========================= */
.resumen-clean{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
}

/* Resultado principal */
.neto-main{
  padding: 18px;
  border-radius: 16px;
  background: #f8fafc;
  margin-bottom: 14px;
  border-left: 5px solid #0f172a;
}

.neto-main.positivo{ border-left-color: var(--ok); }
.neto-main.negativo{ border-left-color: var(--bad); }

.neto-main .titulo{
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  opacity: .9;
}

.neto-main .monto{
  font-size: 30px;
  font-weight: 800;
  margin: 6px 0 2px;
  color: var(--text);
}

.neto-main .subinfo{
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.alerta-mini{
  margin-top: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
}

/* Métodos */
.metodos-linea{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.metodos-linea div{
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  padding: 8px;
  font-size: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metodos-linea span{
  font-size: 11px;
  color: #64748b;
}

.metodos-linea strong{
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}
/* Comisiones */
.comisiones-clean{ margin-top: 14px; }

.comisiones-clean .titulo-seccion{
  font-size: 14px;
  font-weight: 800;
  color: #334155;
  margin-bottom: 10px;
}

.comision-clean{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border: 1px solid var(--soft);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.comision-clean .left{
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.comision-clean .left .nombre{
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.comision-clean .left .porcentaje{
  font-size: 12px;
  color: var(--muted2);
  font-weight: 600;
}

.comision-clean strong{
  font-size: 13.5px;
  font-weight: 800;
  color: var(--text);
}

/* =========================
   BOTÓN IMPRIMIR
   ========================= */
.btn-imprimir{
  width: 100%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  font-size: 13px;
  border-radius: 12px;
  color: #334155;
  font-weight: 700;
  transition: background .15s ease, transform .15s ease;
}

.btn-imprimir:hover{
  background: #e2e8f0;
  transform: translateY(-1px);
}
/* =========================
   TABLA - ÚNICO BLOQUE (CON COLOR REAL)
   ========================= */

/* Fondo del panel derecho (para que no sea blanco) */
.erp-main{
  background: linear-gradient(180deg, #eef2ff 0%, #ffffff 65%);
  border: 1px solid #dbe3f3;
  border-radius: 16px;
  padding: 16px;
}

/* Marco del área tabla (tintado) */
.table-responsive{
  max-height: calc(100vh - 130px);
  overflow: auto;

  background: #f4f7ff;              /* 🔥 esto es clave */
  border: 1px solid #dbe3f3;
  border-radius: 16px;
  padding: 10px;
}

/* Tabla como “cards” con separación */
.erp-table{
  width: 100%;
  font-size: 13.5px;
  border-collapse: separate;
  border-spacing: 0 10px;           /* 🔥 separación visible */
}

/* Header con tinte + sticky */
.erp-table thead th{
  position: sticky;
  top: 0;
  z-index: 10;

  background: linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%);
  color: #1f2937;

  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .6px;

  padding: 12px 12px;
  border: 0;
  border-radius: 12px;
}

/* Filas como tarjetas con color */
.erp-table tbody tr{
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe3f3;
  border-left: 8px solid #60a5fa;   /* 🔥 acento fuerte */
  border-radius: 16px;

  transition: transform .15s ease, box-shadow .15s ease, border-left-color .15s ease;
}

/* Zebra */
.erp-table tbody tr:nth-child(even){
  background: linear-gradient(180deg, #8f9cb4 0%, #f8fbff 100%)
}

/* Hover sigue funcionando encima del zebra */
.erp-table tbody tr:hover{
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(15,23,42,0.14);
  border-left-color: #4f46e5;
  background: linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
}


/* Celdas */
.erp-table td{
  padding: 12px 12px;
  border: 0;
  vertical-align: middle;
}

/* Redondeo real por fila */
.erp-table tbody tr td:first-child{
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.erp-table tbody tr td:last-child{
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

/* Cliente */
.erp-table .cliente-cell .nombre{
  font-weight: 850;
  color: #0f172a;
  line-height: 1.1;
}
.erp-table .cliente-cell .telefono{
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}

/* Detalle */
.erp-table .detalle-cell{
  min-width: 260px;
}
.erp-table .detalle-cell .tipo{
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
}
.erp-table .detalle-cell .descripcion{
  font-size: 12.5px;
  color: #475569;
  margin-top: 5px;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.erp-table .detalle-cell .facturar{
  display: inline-block;
  margin-top: 6px;
  font-size: 10.5px;
  font-weight: 900;
  padding: 3px 9px;
  border-radius: 10px;
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

/* Método: chip (para que se note color) */
.erp-table .muted{
  font-size: 12.5px;
  color: #334155;
}
.erp-table .muted .chip{
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #075985;
  font-weight: 800;
  font-size: 11.5px;
}

/* Monto: pill resaltado */
.erp-table .monto{
  font-weight: 950;
  white-space: nowrap;
}
.erp-table .monto .pill{
  display: inline-block;
  padding: 7px 12px;
  border-radius: 12px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
}

/* Fecha */
.erp-table .fecha{
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
}

/* Empty */
.erp-table .empty{
  text-align: center;
  color: #64748b;
  padding: 18px 10px;
}

/* =========================
   MODAL (si lo usás)
   ========================= */
.modal-backdrop-custom{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-custom{
  background: white;
  width: 90%;
  max-width: 800px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.30);
}

.modal-header,
.modal-footer{
  padding: 14px 18px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body{
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
}
/* =========================
   SIDEBAR CON COLOR (ERP)
   ========================= */
.erp-sidebar{
  background: linear-gradient(180deg, #d7e1ef 0%, #cfd8e4 100%);
  border: 1px solid #bfcad9;
}

/* Opcional: que se sienta más “pro” */
.erp-sidebar .filtro-card,
.erp-sidebar .resumen-clean{
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.55);
  backdrop-filter: blur(8px);
}

/* Títulos/labels con más contraste en panel de color */
.erp-sidebar .filtro-header{
  color: #0f172a;
}

.erp-sidebar .filtro-item label{
  color: #1f2937;
}
.filtro-row{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: end;
}

/* en pantallas pequeñas que se apilen */
@media (max-width: 520px){
  .filtro-row{
    grid-template-columns: 1fr;
  }
}
.comisiones-card{
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
}

.comisiones-header{
  font-size: 12px;
  font-weight: 800;
  color: #334155;
  letter-spacing: .4px;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eef2f7;
}

.comision-row{
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 10px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  margin-bottom: 8px;

  transition: transform .15s ease, box-shadow .15s ease;
}

.comision-row:hover{
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15,23,42,0.08);
}

.comision-row .left{
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.comision-row .nombre{
  font-weight: 800;
  color: #0f172a;
  font-size: 13px;
}

.comision-row .porcentaje{
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
}

.link-gastos{
  cursor: pointer;
  font-weight: 800;
  color: #0f172a;
  text-decoration: underline;
  text-decoration-color: rgba(37,99,235,.35);
}

.modal-custom.modal-gastos{
  width: 92%;
  max-width: 980px;
}

.modal-sub{
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.pill-mini{
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  color: #3730a3;
  font-weight: 800;
}

.btn-cerrar{
  border: 0;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
}

.gastos-list{
  display: grid;
  gap: 10px;
}

.gasto-item{
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
}

.gasto-top{
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.gasto-titulo{
  font-weight: 900;
  color: #0f172a;
  font-size: 13.5px;
}

.gasto-meta{
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip-doctor, .chip-fecha, .chip-tipo{
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 800;
}

.gasto-monto{
  white-space: nowrap;
  font-weight: 950;
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 6px 10px;
  border-radius: 12px;
}

.gasto-detalle{
  margin-top: 8px;
  font-size: 12.5px;
  color: #475569;
}

</style>

<style>/* SOLO en pantalla: ocultar el printArea */
/* ================= PRINT ================= */
.print-area{ display:none; } /* en pantalla normal NO se ve */

@media print{
  @page{ margin: 12mm; }
  html, body{ height:auto; }
  body{ margin:0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ✅ Oculta TODO lo normal (y quita el espacio) */
  .erp-layout,
  .modal-backdrop-custom{
    display: none !important;
  }

  /* ✅ Muestra SOLO el printArea */
  #printArea{
    display: block !important;
    position: static !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    color: #111827 !important;
    font-family: Arial, sans-serif;
    font-size: 12px;
  }

  .print-kpis{
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 10px 0 12px;
  }
  .print-kpis > div{
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px;
  }

  .print-table{ width: 100%; border-collapse: collapse; }
  .print-table th, .print-table td{
    border-bottom: 1px solid #e5e7eb;
    padding: 8px 6px;
    vertical-align: top;
  }
  .print-table th{
    text-align: left;
    background: #f3f4f6;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .4px;
  }

  tr{ page-break-inside: avoid; }

  /* Oculta todo el contenido de la app */
  #app *{
    display: none !important;
  }

  /* Muestra solo el printArea y su contenido */
  #printArea,
  #printArea *{
    display: revert !important;
  }

  /* Asegura que el printArea sí sea visible */
  #printArea{
    display: block !important;
    position: static !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Mantener tablas como tabla (porque revert puede cambiar display) */
  #printArea table{ display: table !important; width: 100% !important; }
  #printArea thead{ display: table-header-group !important; }
  #printArea tbody{ display: table-row-group !important; }
  #printArea tr{ display: table-row !important; page-break-inside: avoid; }
  #printArea th, #printArea td{ display: table-cell !important; }
}
</style>
