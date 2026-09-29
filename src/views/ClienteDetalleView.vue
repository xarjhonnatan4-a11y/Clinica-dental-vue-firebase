<template>
  <div class="container-fluid px-4">

  <!-- PANEL DEL PACIENTE -->
<div class="card cliente-card shadow-lg border-0 mb-4">
  <div class="card-body p-4">

    <div class="row g-4 align-items-start">

      <!-- ========================= -->
      <!-- COLUMNA IZQUIERDA -->
      <!-- ========================= -->
      <div class="col-md-4 izquierda-panel p-3">

  <!-- ========================= -->
  <!-- PERFIL -->
  <!-- ========================= -->
  <div class="mb-3">

    <div class="d-flex align-items-center gap-3">
      <div class="cliente-avatar">👤</div>

      <div>
        <h5 class="fw-semibold mb-0">
          {{ cliente?.nombre }}
        </h5>

        <small class="text-muted d-block" v-if="cliente?.dpi">
          NIT: {{ cliente?.dpi || 'Sin identificación' }}
        </small>

        <small class="text-muted d-block" v-if="cliente?.codigo">
          Código: {{ cliente?.codigo || 'Sin código' }}
        </small>
      </div>
      <button 
  class="btn btn-outline-primary fw-bold ms-auto"
  @click="imprimirEstadoCuenta"
>
  🖨 Imprimir Datos
</button>

    </div>

    <div class="mt-3 print-options-card">
      <div class="row g-2 align-items-end">
        <div class="col-md-7">
          <label class="form-label small text-muted mb-1">Tratamiento a imprimir</label>
          <select
            v-model="tratamientoSeleccionadoImpresion"
            class="form-select form-select-sm"
          >
            <option value="__TODOS__">Todos los tratamientos</option>
            <option
              v-for="opcion in opcionesTratamientosImpresion"
              :key="opcion"
              :value="opcion"
            >
              {{ opcion }}
            </option>
          </select>
        </div>

        <div class="col-md-5">
          <div class="form-check mt-4 pt-1">
            <input
              id="checkImprimirPrecios"
              v-model="imprimirTratamientosConPrecio"
              class="form-check-input"
              type="checkbox"
            >
            <label class="form-check-label small" for="checkImprimirPrecios">
              Imprimir con precios
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hayCambios" class="mt-2">
      <span class="badge bg-warning-subtle text-dark">
        ⚠ Cambios sin guardar
      </span>
    </div>

  </div>

  <!-- ========================= -->
  <!-- KPI -->
  <!-- ========================= -->
  <div class="row g-2 mb-3">

    <!-- SALDO -->
    <div class="col-6">
      <div class="p-3 bg-white rounded-4 shadow-sm h-100">

        <small class="text-muted d-block">Saldo </small>
        
        <div
          class="fw-bold fs-5"
          :class="cliente?.saldo >= 0 ? 'text-success' : 'text-danger'"
        >
          Q {{ cliente?.saldo }}
        </div>

        <small>
          {{ cliente?.saldo >= 0 ? 'A favor' : 'Pendiente' }}
        </small>

        
<p></p>
<button 
          class="btn btn-outline-success fw-bold ms-2"
          @click="imprimirEstadoCuentaFinanciero"
        >
          🖨 
        </button>
        
      </div>
      
    </div>

    <!-- RIESGO -->
    <div class="col-6">
      <div class="p-3 bg-white rounded-4 shadow-sm h-100">

         <div class="small d-flex flex-column gap-2">

      <div>
        <span class="text-muted">Teléfono</span><br>
        <span class="fw-medium">{{ cliente?.telefono || '—' }}</span>
      </div>

      <div>
        <span class="text-muted">Dirección</span><br>
        <span class="fw-medium">{{ cliente?.direccion || '—' }}</span>
      </div>

      <div>
        <span class="text-muted">Notas</span><br>
        <span class="fw-medium">
          {{ cliente?.notas || 'Sin notas' }}
        </span>
      </div>

      <div class="panel-seccion panel-constancia">
  <div class="panel-seccion-header">

    <button
      class="btn btn-outline-danger btn-sm"
      @click="abrirModalConstancia"
    >
      {{ form.constancia?.texto ? 'Ver / editar' : 'Agregar constancia' }}
    </button>
  </div>

  <div class="panel-seccion-body">
    <div v-if="form.constancia?.texto?.trim()">
      <div class="d-flex flex-wrap gap-2 mb-2">
        <span class="badge text-bg-success">Constancia registrada</span>
        <span
          class="badge"
          :class="form.constancia.imprimir ? 'text-bg-primary' : 'text-bg-secondary'"
        >
          {{ form.constancia.imprimir ? 'Se imprimirá' : 'No se imprimirá' }}
        </span>
      </div>
    </div>
  </div>
</div>

    </div>

      </div>
    </div>

  </div>

  <!-- ========================= -->
  <!-- WIDGET MÉDICO -->
  <!-- ========================= -->
  <div class="p-3 bg-white rounded-4 shadow-sm">

    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="fw-semibold mb-0">Condiciones médicas</h6>

      <button
        class="btn btn-sm btn-light border"
        data-bs-toggle="modal"
        data-bs-target="#modalAnamnesis"
      >
        Editar
      </button>
    </div>

    <div v-if="anamnesisSeleccionadas.length">

      <!-- BADGES LIMPIOS -->
      <div class="d-flex flex-wrap gap-2">

        <span
          v-for="item in anamnesisSeleccionadas"
          :key="item.key"
          class="px-2 py-1 rounded small border"
          :class="{
            'border-danger text-danger': item.riesgo === 'alto',
            'border-warning text-warning': item.riesgo === 'medio',
            'border-success text-success': item.riesgo === 'bajo'
          }"
        >
          {{ item.label }}
        </span>

      </div>

    </div>

    <div v-else class="text-muted small">
      Sin registros médicos
    </div>

    <!-- OTRAS -->
    <div v-if="otrasCondicionesVista.length" class="mt-3">
  <small class="text-muted d-block mb-1">Otras</small>

  <div class="d-flex flex-wrap gap-2">
    <span
      v-for="(item, index) in otrasCondicionesVista"
      :key="index"
      class="px-2 py-1 rounded small border border-secondary text-secondary"
    >
      {{ item }}
    </span>
  </div>
</div>

  </div>

</div>
      <!-- ========================= -->
      <!-- COLUMNA DERECHA -->
      <!-- ========================= -->
      <div class="col-md-8 derecha-panel p-3">
        <div class="card border-0 mb-2">
          
  <div class="card-body p-2 d-flex justify-content-end">
    
    <button
      class="btn btn-outline-primary btn-sm fw-semibold"
      data-bs-toggle="modal"
      data-bs-target="#modalTratamientos"
      @click="abrirModalTratamientos"
    >
      <i class="bi bi-clipboard2-pulse me-1"></i>
      Ver / Editar Tratamientos
    </button>
    <button
  class="btn btn-outline-warning btn-sm fw-semibold ms-2"
  data-bs-toggle="modal"
  data-bs-target="#modalTrabajos"
>
  🧪 Trabajos
</button>
<button
  class="btn btn-outline-success btn-sm fw-semibold ms-2"
  data-bs-toggle="modal"
  data-bs-target="#modalMedicinas"
>
  💊 Medicinas
</button>

  </div>
</div>
        <div class="row g-3">

  <!-- 🦷 ODONTOGRAMA (tu bloque intacto) -->
  <div class="col-md-6">

    <div
      class="d-flex justify-content-center p-2 odontograma-bloqueado"
      style="max-height: 560px; overflow-y: auto;"
    >
    <div ref="odontogramaPrint">
      <Odontograma

        v-model:seleccion="form.dientes"
        :tratamientos="form.tratamientos"
        :tratamientosGenerales="form.tratamientosGenerales"
        :catalogoTratamientos="tratamientosLista"
        :soloVista="true"
        style="width:100%; min-width:260px;"
      />
      </div>
    </div>

  </div>

 <!-- 📝 RESUMEN MODERNO -->
<div class="col-md-6">

  <div class="tratamientos-panel">

    <!-- HEADER -->
    <div class="tratamientos-header d-flex justify-content-between align-items-center">
      <div>
        <h6 class="mb-0 fw-bold">Tratamientos actuales</h6>
        <small class="text-muted">
          {{ tratamientosVistaPrevia.length }} registrados
        </small>
      </div>
      <i class="bi bi-clipboard2-pulse fs-5 text-primary"></i>
    </div>

    <!-- FILTROS -->
    <div class="tratamientos-filtros d-flex gap-2 mt-3 mb-2 flex-wrap">
      <button
        class="btn btn-sm"
        :class="filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'"
        @click="filtro='todos'"
      >
        Todos
      </button>

      <button
        class="btn btn-sm"
        :class="filtro === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'"
        @click="filtro='pendiente'"
      >
        Pendientes
      </button>

      <button
        class="btn btn-sm"
        :class="filtro === 'realizado' ? 'btn-success' : 'btn-outline-success'"
        @click="filtro='realizado'"
      >
        Realizados
      </button>

      <button
        class="btn btn-sm"
        :class="filtro === 'sumar' ? 'btn-dark' : 'btn-outline-dark'"
        @click="filtro='sumar'"
      >
        SUMAR
      </button>
    </div>

    <!-- RESUMEN SUMA -->
    <div
      v-if="filtro === 'sumar'"
      class="alert alert-success rounded-4 py-2 px-3 mb-3"
    >
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong>Seleccionados:</strong>
          {{ cantidadTratamientosMarcadosParaSumar }}
        </div>

        <div>
          <strong>Total:</strong>
          Q {{ totalTratamientosMarcadosParaSumar.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="tratamientos-body">

      <div
        v-if="!tratamientosVistaPrevia.length"
        class="empty-state"
      >
        <i class="bi bi-inbox fs-3 mb-2"></i>
        <div>No hay tratamientos registrados</div>
      </div>

      <div
        v-for="t in tratamientosFiltrados"
        :key="getKeySumaTratamiento(t)"
        class="tratamiento-item"
        :class="[
          t.tipo === 'diente'
            ? 'tratamiento-diente'
            : 'tratamiento-general',
          t.estado === 'realizado' ? 'estado-realizado' : 'estado-pendiente',
          filtro === 'sumar' && seleccionadosParaSumar[getKeySumaTratamiento(t)]
            ? 'seleccion-suma-activa'
            : ''
        ]"
        :style="t.tipo === 'general'
          ? { backgroundColor: colorSegunTipo(t.tipoTratamiento) }
          : {}"
      >

        <div class="d-flex justify-content-between align-items-start gap-3">

          <!-- CHECKBOX SUMAR -->
          <div v-if="filtro === 'sumar'" class="pt-1">
            <input
              type="checkbox"
              class="form-check-input"
              :checked="!!seleccionadosParaSumar[getKeySumaTratamiento(t)]"
              @change="toggleSeleccionSuma(t)"
            />
          </div>

          <!-- CONTENIDO -->
          <div class="flex-grow-1">
            <div
              class="fw-semibold mt-1"
              :class="{ 'text-decoration-line-through text-success': t.estado === 'realizado' }"
            >
              🦷 {{ t.titulo }}
            </div>

            <small class="text-muted d-block">
              {{ t.descripcion }}
            </small>
          </div>

          <!-- CHECK REALIZADO -->
          <div v-if="filtro !== 'sumar'">
            <input
              type="checkbox"
              class="form-check-input"
              :checked="t.estado === 'realizado'"
              @change="cambiarEstado(t); guardarTratamientoDental()"
            />
          </div>

        </div>

      </div>

      <div v-if="filtro === 'sumar'" class="mt-3">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="limpiarSeleccionSuma"
        >
          Limpiar selección
        </button>
      </div>

    </div>

  </div>

</div>

</div>
      </div>

    </div>
  </div>
</div>

<div v-if="usuarioActual?.permisos?.clienteDetalle">
<div 
  class="finanzas-header"
  :class="{ 'abierto': mostrarFinanciero }"
  @click="mostrarFinanciero = !mostrarFinanciero"
>
  <div class="d-flex align-items-center gap-2">
    <i class="bi bi-cash-stack fs-5"></i>
    <h5 class="mb-0 fw-bold">
      Área Financiera
    </h5>
  </div>

  <i 
    class="bi bi-chevron-down toggle-icon"
    :class="{ 'rotado': mostrarFinanciero }"
  ></i>
</div>

<transition name="fade-slide">
  <div v-show="mostrarFinanciero">

 <!-- FINANZAS -->
<div
  class="card shadow-sm  rounded-4 mb-4 movimiento-card"
  :class="tipo === 'cargo' ? 'movimiento-cargo' : 'movimiento-abono'"
>
 <!-- HEADER DEL PANEL -->
  <div class="movimiento-header px-3 py-2 rounded-top-4">
    <strong>💰 {{ editandoMovimientoId ? 'Editar movimiento de cargo / abono' : 'Movimiento de cargo / abono' }}</strong>
    <small class="d-block text-muted">
      {{ editandoMovimientoId ? 'Está editando un registro existente.' : 'Esta acción afecta el saldo del paciente' }}
    </small>
  </div>

      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="btn-group w-100 movimiento-toggle">
  <button
    type="button"
    class="btn btn-sm"
    :class="tipo === 'cargo' ? 'btn-danger active' : 'btn-outline-danger'"
    @click="tipo = 'cargo'"
  >
   Cargo
  </button>

  <button
    type="button"
     class="btn btn-sm"
    :class="tipo === 'abono' ? 'btn-success active' : 'btn-outline-success'"
    @click="tipo = 'abono'"
  >
    Abono
  </button>
</div>

          </div>

          <div class="col-md-4">
            <input 
              v-model.number="monto" 
              type="number" 
              class="form-control form-control-lg rounded-3" 
              placeholder="Monto (Q)" 
            />
          </div>

          <div class="col-md-4">
          <select
            v-model="doctorSeleccionado"
            class="form-select form-select-lg rounded-3"
          >
             <option :value="null" disabled>
    doctor
  </option>

            <option
              v-for="d in doctores"
              :key="d.id"
              :value="d"
            >
              {{ d.nombre }}
            </option>
          </select>
        </div>


          <!-- MÉTODO DE PAGO SOLO SI ES ABONO -->
          <div class="col-md-4" v-if="tipo === 'abono'">
            <select 
              v-model="metodoPago" 
              class="form-select form-select-lg rounded-3"
              required
            >
              <option value="" disabled selected>método de pago</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

        <!-- OPCIÓN FACTURAR (SOLO ABONO) -->
            <div
              class="col-md-4 d-flex align-items-center"
              v-if="tipo === 'abono'"
            >

          <div class="form-check mt-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="facturarCheck"
              v-model="facturar"
              :disabled="metodoPago === 'Transferencia'"
            />
            <label class="form-check-label fw-semibold" for="facturarCheck">
              🧾 Facturar este movimiento
            </label>

            <div
              v-if="metodoPago === 'Transferencia'"
              class="text-danger small mt-1"
            >
              Obligatorio facturar en pagos por transferencia
            </div>
          </div>
          </div>

        </div>

        <div class="row g-3 mt-3">
          <div class="col-12">
            <input 
              v-model="descripcion" 
              type="text" 
              class="form-control form-control-lg rounded-3" 
              placeholder="Descripción del servicio / detalle del movimiento"
            />
          </div>
        </div>

      <div class="d-flex flex-wrap gap-2 mt-4">
      <button
        @click="confirmarMovimiento"
        :disabled="guardandoMovimiento"
        class="btn btn-info btn-lg text-white rounded-3 fw-bold flex-grow-1"
        style="background-color:#42c9db;"
      >
        {{ editandoMovimientoId ? 'Actualizar movimiento' : 'Guardar movimiento' }}
      </button>

      <button
        v-if="editandoMovimientoId"
        @click="cancelarEdicionMovimiento"
        type="button"
        class="btn btn-outline-secondary btn-lg rounded-3 fw-bold"
      >
        Cancelar edición
      </button>
      </div>

      </div>
    </div>


    <!-- FORMULARIO DE MOVIMIENTO -->
    
    


    <!-- HISTORIAL - LÍNEA DE TIEMPO -->
    <div class="timeline position-relative mt-5">

      <div
        v-for="m in movimientos"
        :key="m.id"
        class="timeline-item d-flex mb-5 position-relative"
        :class="m.tipo === 'cargo' ? 'flex-row' : 'flex-row-reverse'"
      >
        
        <!-- Línea central + punto -->
        <div class="timeline-line position-relative mx-3">
          <div
            class="timeline-dot"
            :class="m.tipo === 'cargo' ? 'bg-danger' : 'bg-success'"
          ></div>
        </div>

        <!-- TARJETA -->
        <div
          class="card shadow-sm px-4 py-3"
          :class="m.tipo === 'cargo'
                  ? 'border-danger bg-danger bg-opacity-10'
                  : 'border-success bg-success bg-opacity-10'"
          style="width: 70%; border-radius: 20px;"
        >
          <div class="d-flex justify-content-between align-items-start gap-3">
            <div>
              <h5
                class="fw-bold mb-1"
                :class="m.tipo === 'cargo' ? 'text-danger' : 'text-success'"
              >
                {{ m.tipo.toUpperCase() }}
              </h5>

              <span
                v-if="editandoMovimientoId === m.id"
                class="badge text-bg-warning"
              >
                Editando
              </span>
            </div>

            <div class="text-end">
              <small class="text-muted d-block">
                {{ new Date(m.fecha?.seconds * 1000).toLocaleString() }}
              </small>

              <div
                v-if="puedeEditarMovimientoItem(m) || puedeEliminarMovimientoItem(m)"
                class="d-flex flex-wrap justify-content-end gap-2 mt-2"
              >
                <button
                  v-if="puedeEditarMovimientoItem(m)"
                  type="button"
                  class="btn btn-outline-primary btn-sm fw-semibold"
                  @click="iniciarEdicionMovimiento(m)"
                >
                  Editar
                </button>

                <button
                  v-if="puedeEliminarMovimientoItem(m)"
                  type="button"
                  class="btn btn-outline-danger btn-sm fw-semibold"
                  @click="confirmarEliminarMovimiento(m)"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <p class="fs-4 fw-semibold mt-1">
            Q {{ m.monto }}
          </p>

          <p class="text-muted mb-1">
            <small class="fst-italic">
            {{ m.descripcion || 'Sin descripción' }}</small>
          </p>

          <p v-if="m.metodoPago" class="text-muted mb-0">
            <small class="text-muted">💳 Pago:  {{ m.metodoPago }} </small>
          </p>
          <p v-if="m.doctor" class="text-muted mb-0">
            <small class="text-dark fw-semibold">👨‍⚕️ Atendió:
            {{ m.doctor.nombre }}</small>
          </p>
         <p v-if="m.facturar === true" class="text-muted mb-0">
            <small>🧾 Facturado</small>
          </p>

          <p v-else-if="m.facturar === false" class="text-warning mb-0">
            <small>⚠ No facturado</small>
          </p>


        </div>

      </div>

    </div>

      </div>
</transition>
</div>

    <!-- ❤️ SECCIÓN ESPECIAL PARA IMPRESIÓN -->
<div id="printArea" class="print-only">

  <!-- ===================== -->
  <!-- BLOQUE SUPERIOR -->
  <!-- ===================== -->
  <div class="bloque-superior">

    <!-- IZQUIERDA -->
    <div class="col-izquierda">
      <h5>Datos del Paciente</h5>
      <div class="datos">
        <p><strong>Nombre:</strong> {{ cliente?.nombre }}</p>
        <p><strong>DPI/NIT:</strong> {{ cliente?.dpi }}</p>
        <p><strong>Código:</strong> {{ cliente?.codigo || 'Sin código' }}</p>
        <p><strong>Teléfono:</strong> {{ cliente?.telefono }}</p>
        <p><strong>Dirección:</strong> {{ cliente?.direccion }}</p>
        <p><strong>Notas:</strong> {{ cliente?.notas || 'Sin notas' }}</p>
      </div>
    </div>

    <!-- DERECHA -->
    <div class="col-derecha">

      <h5>Condiciones Médicas</h5>
      <div class="condiciones-grid">
        <ul>
          <li v-for="item in anamnesisSeleccionadas" :key="item.key">
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div 
        class="otras-condiciones" 
        v-if="otrasCondicionesVista.length"
      >
        <ul>
          <li 
            v-for="(item, index) in otrasCondicionesVista" 
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>

    </div>

  </div>

  <hr />

  <!-- ===================== -->
  <!-- ODONTOGRAMA + TRATAMIENTOS -->
  <!-- ===================== -->
  <div class="print-flex">

    <!-- IZQUIERDA -->
    <div class="print-odontograma" ref="odontogramaPrint">
      <Odontograma
        :seleccion="seleccionDientesImpresion"
        :tratamientos="tratamientosOdontogramaImpresion"
        :tratamientosGenerales="tratamientosGeneralesImpresion"
        :catalogoTratamientos="tratamientosLista"
        style="width:100%;"
      />
    </div>

    <!-- DERECHA -->
    <div class="print-tratamientos">
      <h5>Tratamientos</h5>
      <ul style="padding-left: 15px; margin-top: 0; margin-bottom: 0;">
        <li 
          v-for="t in tratamientosVistaPrevia" 
          :key="t.titulo + t.descripcion"
          style="margin-bottom: 8px; font-size: 5px;"
        >
          <strong>{{ t.titulo }}</strong><br>
          {{ t.descripcion }}
        </li>
      </ul>
    </div>

  </div>

</div>

<!-- MODAL TRATAMIENTOS -->
<div
  class="modal fade"
  id="modalTratamientos"
  tabindex="-1"
>
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content rounded-4">

      <!-- HEADER -->
      <div class="modal-header border-bottom-0">
        <h5 class="modal-title fw-bold text-primary">
          🦷 Tratamientos dentales de {{ cliente?.nombre }}
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- BODY -->
      <div class="modal-body p-4" style="max-height:70vh; overflow-y:auto;">

        <div class="row g-4">

          <!-- ODONTOGRAMA -->
          <div class="col-lg-4 border-end pe-4 modal-odontograma-col">
            <div class="odontograma-sticky-card">
              <p class="fw-semibold text-muted mb-3 text-center">Odontograma</p>

              <div class="d-flex justify-content-center">
                <Odontograma
                  v-model:seleccion="form.dientes"
                  :tratamientos="form.tratamientos"
                  :tratamientosGenerales="form.tratamientosGenerales"
                  :catalogoTratamientos="tratamientosLista"
                  @eliminar-tratamiento="eliminarTratamiento"
                  @diente-click="manejarClickDiente"
                  style="width:100%; min-width:260px;"
                />
              </div>

              <p class="text-muted text-center mt-3 mb-0" style="font-size:0.85rem">
                Dientes seleccionados: {{ form.dientes.join(', ') || '—' }}
              </p>
            </div>
          </div>

          <!-- TRATAMIENTOS POR DIENTE -->
<div class="col-lg-8 ps-4 modal-tratamientos-col">

  <div class="d-flex flex-column gap-4">

    <p class="text-muted text-center mt-1 mb-0" style="font-size:0.85rem">
      ⚠️ Los cambios solo se guardan al presionar <strong>Guardar Cambios</strong>
    </p>

    <!-- ========================= -->
    <!-- DIENTES SELECCIONADOS -->
    <!-- ========================= -->
    <div class="panel-seccion">
      <div class="panel-seccion-header">
        <h6 class="fw-bold text-primary mb-0">Dientes seleccionados</h6>
        <small class="text-muted">
          {{ form.dientes.length }} diente(s)
        </small>
      </div>

      <div class="panel-seccion-body">
        <div v-if="form.dientes.length" class="dientes-grid">
          <button
            v-for="diente in form.dientes"
            :key="diente"
            type="button"
            class="diente-selector-card"
            :class="{ activo: dienteActivo === diente }"
            @click="seleccionarDienteActivo(diente)"
          >
            <div class="diente-selector-top">
              <span class="diente-selector-numero">🦷 {{ diente }}</span>
              <span
                v-if="cantidadTratamientosDiente(diente)"
                class="diente-selector-badge"
              >
                {{ cantidadTratamientosDiente(diente) }}
              </span>
            </div>

            <small class="text-muted">
              {{ cantidadTratamientosDiente(diente) }} tratamiento(s)
            </small>
          </button>
        </div>

        <div v-else class="text-center text-muted py-3">
          No hay dientes seleccionados.
        </div>
      </div>
    </div>

    <!-- ========================= -->
    <!-- CONFIGURACIÓN DIENTE ACTIVO -->
    <!-- ========================= -->
    <div v-if="dienteActivo" class="panel-seccion panel-dientes">
      <div class="panel-seccion-header">
        <div>
          <h6 class="fw-bold text-primary mb-0">
            🦷 Configuración del diente {{ dienteActivo }}
          </h6>
          <small class="text-muted">
            Tratamientos individuales del diente seleccionado
          </small>
        </div>

        <div style="min-width: 220px;">
          <select
            class="form-select form-select-sm"
            @change="agregarTratamientoADiente(dienteActivo, $event.target.value); $event.target.value=''"
          >
            <option value="">+ Agregar tratamiento</option>
            <option
              v-for="(t, index) in tratamientosLista"
              :key="index"
              :value="t.nombre"
            >
              {{ t.nombre }}
            </option>
          </select>
        </div>
      </div>

      <div class="panel-seccion-body">
        <div
          v-if="obtenerTratamientosDiente(dienteActivo).length"
          class="d-flex flex-column gap-3"
        >
          <div
            v-for="(tratamiento, idx) in obtenerTratamientosDiente(dienteActivo)"
            :key="tratamiento._uid || `${dienteActivo}-${idx}`"
            class="tratamiento-editor-card"
          >
            <div class="tratamiento-editor-top">
              <div class="tratamiento-editor-title">
                {{ tratamiento.tipo || "Tratamiento" }}
              </div>

              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="quitarTratamientoDiente(dienteActivo, idx)"
              >
                ✕
              </button>
            </div>

            <div class="tratamiento-editor-grid">
              <div
                v-if="tratamientoUsaMaterial(tratamiento.tipo)"
                class="mini-field"
              >
                <label>Material</label>
                <select
                  v-model="form.tratamientos[dienteActivo][idx].material"
                  class="form-select"
                >
                  <option value="">Seleccione material</option>
                  <option
                    v-for="(m, mIndex) in materialesLista"
                    :key="mIndex"
                    :value="m.nombre"
                  >
                    {{ m.nombre }}
                  </option>
                </select>
              </div>

              <div class="mini-field">
                <label>Precio</label>
                <input
                  v-model.number="form.tratamientos[dienteActivo][idx].precio"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                  placeholder="Q 0.00"
                />
              </div>
            </div>

            <small class="text-muted d-block mt-2">
              {{ formatearTratamientoVista(tratamiento) || "Complete material y precio" }}
            </small>
          </div>
        </div>

        <div v-else class="text-muted">
          Este diente aún no tiene tratamientos agregados.
        </div>
      </div>
    </div>

    <div v-else class="panel-seccion panel-dientes">
      <div class="panel-seccion-body text-center text-muted py-4">
        Selecciona un diente para ver su configuración.
      </div>
    </div>

    <!-- ========================= -->
    <!-- ACORDEÓN GENERALES -->
    <!-- ========================= -->
    <div class="separador-bloques">
      <span>Tratamientos generales</span>
    </div>

    <div class="panel-seccion panel-generales">
      <div
        class="panel-seccion-header acordeon-header"
        @click="mostrarGenerales = !mostrarGenerales"
      >
        <div>
          <h6 class="fw-bold mb-0" style="color:#6d28d9;">
            🧩 Tratamientos generales
          </h6>
          <small class="text-muted">
            Aplican a un rango de dientes, no a uno solo
          </small>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-primary btn-sm"
            @click.stop="agregarTratamientoGeneral(); mostrarGenerales = true"
          >
            + Agregar
          </button>

          <span class="acordeon-icono" :class="{ abierto: mostrarGenerales }">
            ▾
          </span>
        </div>
      </div>

      <transition name="fade-slide">
        <div v-show="mostrarGenerales" class="panel-seccion-body">
          <div
            v-for="(t, index) in form.tratamientosGenerales"
            :key="t._uid || index"
            class="general-card"
            :style="{ backgroundColor: colorSegunTipo(t.tipo) }"
          >
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="general-chip">
                🧩 Rango general
              </span>
              <div class="general-actions">
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="eliminarTratamientoGeneral(index)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="general-grid">

              <div class="mini-field">
                <label>Tratamiento</label>
                <select v-model="t.tipo" class="form-select form-select-sm">
                  <option value="">Seleccione</option>
                  <option
                    v-for="(item, tIndex) in tratamientosLista"
                    :key="tIndex"
                    :value="item.nombre"
                  >
                    {{ item.nombre }}
                  </option>
                </select>
              </div>

              <div class="mini-field">
                <label>Desde</label>
                <input
                  v-model.number="t.desde"
                  type="number"
                  class="form-control form-control-sm"
                  placeholder="Desde"
                />
              </div>

              <div class="mini-field">
                <label>Hasta</label>
                <input
                  v-model.number="t.hasta"
                  type="number"
                  class="form-control form-control-sm"
                  placeholder="Hasta"
                />
              </div>

              <div
                v-if="tratamientoUsaMaterial(t.tipo)"
                class="mini-field"
              >
                <label>Material</label>
                <select v-model="t.material" class="form-select form-select-sm">
                  <option value="">Seleccione</option>
                  <option
                    v-for="(m, mIndex) in materialesLista"
                    :key="mIndex"
                    :value="m.nombre"
                  >
                    {{ m.nombre }}
                  </option>
                </select>
              </div>

              <div class="mini-field">
                <label>Precio</label>
                <input
                  v-model.number="t.precio"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control form-control-sm"
                  placeholder="Q 0.00"
                />
              </div>

              
            </div>
          </div>

          <div v-if="!form.tratamientosGenerales.length" class="text-muted">
            No hay tratamientos generales agregados.
          </div>
        </div>
      </transition>
    </div>

  </div>
</div>
        </div>
      </div>
      <!-- ========================= -->
      <!-- FOOTER -->
      <!-- ========================= -->
      <div class="modal-footer border-top-0">
        <button
          class="btn btn-outline-secondary"
          @click="cancelarCambiosModal"
          data-bs-dismiss="modal"
        >
          Cancelar
        </button>

        <button
          class="btn fw-bold"
          :class="puedeGuardarTratamiento ? 'btn-primary' : 'btn-secondary'"
          :disabled="!puedeGuardarTratamiento"
          @click="guardarTratamientoDental"
          data-bs-dismiss="modal"
        >
          💾 Guardar Cambios
        </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="modalTrabajos" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content rounded-4">

      <div class="modal-header">
        <h5 class="modal-title fw-bold text-warning">
          🧪 Trabajos entregados a {{ cliente?.nombre }}
        </h5>
      </div>

      <div class="modal-body">

        <!-- FORM -->
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <select v-model="trabajo.tipo" class="form-select">
              <option disabled value="">Tipo de trabajo</option>
              <option>Placa</option>
              <option>Prótesis</option>
              <option>Dientes postizos</option>
              <option>Laboratorio</option>
              <option>Otro</option>
            </select>
          </div>

          <div class="col-md-6">
            <input
              v-model.number="trabajo.monto"
              type="number"
              class="form-control"
              placeholder="Costo del trabajo (Q)"
            />
          </div>

          <div class="col-md-12">
            <select
              v-model="doctorSeleccionado"
              class="form-select"
            >
              <option disabled :value="null">
                Seleccione doctor que atendió
              </option>

              <option
                v-for="d in doctores"
                :key="d.id"
                :value="d"
              >
                {{ d.nombre }}
              </option>
            </select>
          </div>


          <div class="col-12">
            <input
              v-model="trabajo.descripcion"
              class="form-control"
              placeholder="Descripción / detalle"
            />
          </div>
        </div>

        <!-- HISTORIAL -->
        <h6 class="fw-bold mb-2">Historial</h6>
        <ul class="list-group">
          <li
              v-for="t in trabajos"
              :key="t.id"
              class="list-group-item d-flex justify-content-between"
            >
              <div>
                <strong>{{ t.tipo }}</strong><br />
                <small class="text-muted">{{ t.descripcion }}</small><br />
                <small v-if="t.doctor?.nombre" class="text-dark">
                  👨‍⚕️ {{ t.doctor.nombre }}
                </small>
              </div>
              <span class="fw-bold text-danger">
                Q {{ t.monto }}
              </span>
            </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
          Cerrar
        </button>
        <button class="btn btn-warning fw-bold" @click="confirmarTrabajo">
          💾 Guardar trabajo
        </button>
      </div>

    </div>
  </div>
</div>

<!-- ========================= -->
<!-- MODAL ANAMNESIS -->
<!-- ========================= -->
<div class="modal fade" id="modalAnamnesis" tabindex="-1">
  <div class="modal-dialog modal-fullscreen-sm-down modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

      <!-- HEADER -->
      <div class="modal-header bg-primary bg-gradient text-white border-0">
        <div>
          <h5 class="modal-title fw-bold mb-0">🩺 Anamnesis médica</h5>
          <small class="opacity-75 d-block">
            Paciente: {{ cliente?.nombre }}
          </small>
        </div>
      </div>

      <!-- BODY -->
      <div class="modal-body bg-light">

        <!-- RESUMEN -->
        <div v-if="totalSeleccionadas > 0" class="alert alert-info d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ totalSeleccionadas }}</strong> condiciones seleccionadas
          </div>
          <div v-if="conteoAlto > 0" class="text-danger fw-semibold">
            ⚠ Riesgo alto detectado
          </div>
        </div>

        <!-- 🔴 ALTO RIESGO -->
        <div v-if="Object.keys(preguntasAlto).length" class="mb-4">
          <h6 class="fw-bold text-danger mb-3">🔴 Alto riesgo</h6>

          <div class="row g-3 g-md-4">
            <div
              class="col-12 col-md-6 col-xl-4"
              v-for="(label,key) in preguntasAlto"
              :key="key"
            >
              <div
                class="card anamnesis-card-item alto h-100 rounded-4"
                :class="{ 'activo': anamnesis[key] }"
              >
                <div
                  class="card-body p-3 p-md-4"
                  @click="anamnesis[key] = !anamnesis[key]"
                  style="cursor:pointer"
                >
                  <div class="form-check form-switch mb-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="anamnesis[key]"
                      :id="'modal_'+key"
                      @click.stop
                    />
                    <label
                      class="form-check-label fw-semibold"
                      :for="'modal_'+key"
                    >
                      {{ label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🟡 MEDIO -->
        <div v-if="Object.keys(preguntasMedio).length" class="mb-4">
          <h6 class="fw-bold text-warning mb-3">🟡 Riesgo medio</h6>

          <div class="row g-3 g-md-4">
            <div
              class="col-12 col-md-6 col-xl-4"
              v-for="(label,key) in preguntasMedio"
              :key="key"
            >
              <div
                class="card anamnesis-card-item medio h-100 rounded-4"
                :class="{ 'activo': anamnesis[key] }"
              >
                <div
                  class="card-body p-3 p-md-4"
                  @click="anamnesis[key] = !anamnesis[key]"
                  style="cursor:pointer"
                >
                  <div class="form-check form-switch mb-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="anamnesis[key]"
                      :id="'modal_'+key"
                      @click.stop
                    />
                    <label
                      class="form-check-label fw-semibold"
                      :for="'modal_'+key"
                    >
                      {{ label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🟢 BAJO -->
        <div v-if="Object.keys(preguntasBajo).length" class="mb-4">
          <h6 class="fw-bold text-success mb-3">🟢 Bajo riesgo</h6>

          <div class="row g-3 g-md-4">
            <div
              class="col-12 col-md-6 col-xl-4"
              v-for="(label,key) in preguntasBajo"
              :key="key"
            >
              <div
                class="card anamnesis-card-item bajo h-100 rounded-4"
                :class="{ 'activo': anamnesis[key] }"
              >
                <div
                  class="card-body p-3 p-md-4"
                  @click="anamnesis[key] = !anamnesis[key]"
                  style="cursor:pointer"
                >
                  <div class="form-check form-switch mb-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="anamnesis[key]"
                      :id="'modal_'+key"
                      @click.stop
                    />
                    <label
                      class="form-check-label fw-semibold"
                      :for="'modal_'+key"
                    >
                      {{ label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🧾 OTRAS CONDICIONES -->
<div class="mb-4">
  <h6 class="fw-bold text-secondary mb-3">🧾 Otras condiciones médicas</h6>

  <div
    v-for="(condicion, index) in otrasCondiciones"
    :key="index"
    class="d-flex gap-2 mb-2"
  >
    <input
      v-model="otrasCondiciones[index]"
      type="text"
      class="form-control"
      placeholder="Ej: Hipotiroidismo, VIH, etc..."
    />

    <button
      class="btn btn-outline-danger"
      @click="eliminarCondicion(index)"
      v-if="otrasCondiciones.length > 1"
    >
      ✕
    </button>
  </div>

  <button
  type="button"
  class="btn btn-outline-primary btn-sm mt-2"
  @click="agregarCondicion"
>
  + Agregar otra condición
</button>
</div>
      </div>
      <!-- FOOTER -->
      <div class="modal-footer bg-white border-0 shadow-sm flex-column flex-sm-row gap-2">
        <button
          class="btn btn-light border rounded-pill px-4 w-100 w-sm-auto"
          data-bs-dismiss="modal"
        >
          Cancelar
        </button>
        <button
          class="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm w-100 w-sm-auto"
          @click="guardarAnamnesis"
          data-bs-dismiss="modal"
        >
          💾 Guardar información
        </button>
      </div>
    </div>
  </div>
</div>
</div>

  <!-- 🔔 TOAST O MENSAJES CON ESTILO -->
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

<!-- ✅ CONFIRM (Toast-style modal) -->
<div
  v-if="confirm.open"
  class="confirm-toast-backdrop"
  @click.self="confirmResolve(false)"
>
  <div class="confirm-toast-card">
    <div class="confirm-toast-head">
      <div class="confirm-toast-title">
        {{ confirm.title }}
      </div>
      <button class="confirm-x" @click="confirmResolve(false)">✕</button>
    </div>

    <div class="confirm-toast-body">
      <div class="confirm-lines">
        <div v-for="(line,i) in confirm.lines" :key="i">
          {{ line }}
        </div>
      </div>
    </div>

    <div class="confirm-toast-actions">
      <button class="btn btn-light border fw-bold" @click="confirmResolve(false)">
        Cancelar
      </button>
      <button class="btn btn-primary fw-bold" @click="confirmResolve(true)">
        Confirmar
      </button>
    </div>
  </div>
</div>

<div
  class="modal fade"
  :class="{ show: mostrarModalConstancia }"
  tabindex="-1"
  style="display: block;"
  v-if="mostrarModalConstancia"
>
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content rounded-4 shadow-lg">

      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold text-danger">
          📝 Constancia clínica
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="cerrarModalConstancia"
        ></button>
      </div>

      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label fw-semibold">
            Texto de constancia 
          </label>
          <div></div>
          <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="cargarMachoteConstancia"
        >
          Cargar machote
        </button>
          <textarea
            v-model="form.constancia.texto"
            class="form-control"
            rows="7"
            placeholder="Escriba aquí la constancia o declaración..."
          ></textarea>
        </div>

        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="imprimirConstancia"
            v-model="form.constancia.imprimir"
          />
          <label class="form-check-label fw-semibold" for="imprimirConstancia">
            Incluir esta constancia en la impresión
          </label>
        </div>
      </div>

      <div class="modal-footer border-0">
        <button
          class="btn btn-outline-secondary"
          @click="cerrarModalConstancia"
        >
          Cerrar
        </button>

        <button
          class="btn btn-danger fw-bold"
          @click="guardarConstancia"
        >
          Guardar constancia
        </button>
      </div>

    </div>
  </div>
</div>

<div
  v-if="mostrarModalConstancia"
  class="modal-backdrop fade show"
></div>

<div class="modal fade" id="modalMedicinas" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content rounded-4">

      <div class="modal-header">
        <h5 class="modal-title fw-bold text-success">
          💊 Medicinas usadas en {{ cliente?.nombre }}
        </h5>
      </div>

      <div class="modal-body">

        <!-- FORM -->
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <input
              v-model="medicina.nombre"
              type="text"
              class="form-control"
              placeholder="Nombre de la medicina"
            />
          </div>

          <div class="col-md-3">
            <input
              v-model.number="medicina.cantidad"
              type="number"
              min="1"
              step="1"
              class="form-control"
              placeholder="Cantidad"
            />
          </div>

          <div class="col-md-3">
            <select v-model="medicina.unidad" class="form-select">
              <option value="">Unidad</option>
              <option>Tableta(s)</option>
              <option>Cápsula(s)</option>
              <option>Ampolla(s)</option>
              <option>Frasco(s)</option>
              <option>ml</option>
              <option>mg</option>
              <option>Otro</option>
            </select>
          </div>

          <div class="col-md-6">
            <input
              v-model.number="medicina.costo"
              type="number"
              min="0"
              step="0.01"
              class="form-control"
              placeholder="Costo (Q)"
            />
          </div>

          <div class="col-md-6">
            <select v-model="doctorMedicamento" class="form-select">
              <option disabled :value="null">
                Seleccione doctor que atendió
              </option>

              <option
                v-for="d in doctores"
                :key="d.id"
                :value="d"
              >
                {{ d.nombre }}
              </option>
            </select>
          </div>

          <div class="col-12">
            <input
              v-model="medicina.descripcion"
              type="text"
              class="form-control"
              placeholder="Descripción / observación"
            />
          </div>
        </div>

        <!-- HISTORIAL -->
        <h6 class="fw-bold mb-2">Historial de medicinas</h6>

        <ul class="list-group" v-if="medicinas.length">
          <li
            v-for="m in medicinas"
            :key="m.id"
            class="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <strong>{{ m.nombre }}</strong><br />

              <small class="text-muted">
                Cantidad: {{ m.cantidad }} {{ m.unidad || '' }}
              </small><br />

              <small class="text-muted" v-if="m.descripcion">
                {{ m.descripcion }}
              </small><br />

              <small v-if="m.doctor?.nombre" class="text-dark">
                👨‍⚕️ {{ m.doctor.nombre }}
              </small>
            </div>

            <span class="fw-bold text-success">
              Q {{ Number(m.costo || 0).toFixed(2) }}
            </span>
          </li>
        </ul>

        <div v-else class="text-muted">
          No hay medicinas registradas todavía.
        </div>

      </div>

      <div class="modal-footer">
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
          Cerrar
        </button>

        <button
          class="btn btn-success fw-bold"
          @click="guardarMedicamento"
          :disabled="guardandoMedicamento"
        >
          💾 Guardar medicina
        </button>
      </div>

    </div>
  </div>
</div>

</template>

<style>


.estado-pendiente {
  background: #fff8e1;
}
.tratamientos-panel {
  background: white;
  border-radius: 20px;
  padding: 20px;
  height: 100%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 25px rgba(0,0,0,0.05);
}

.tratamientos-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #eef2f7;
}

.tratamientos-body {
  overflow-y: auto;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ITEM */
.tratamiento-item {
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
}

.tratamiento-item:hover {
  transform: translateY(-2px);
  background: #eef4ff;
}

/* BADGE */
.tratamiento-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 50px;
  width: fit-content;
  background: #e9ecef;
}

/* VARIANTES */
.tratamiento-diente {
  border-left: 4px solid #0d6efd;
}

.tratamiento-general {
  border-left: 4px solid #ffc107;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 40px 10px;
  color: #adb5bd;
}
/* Tarjeta de CARGO */
.tarjeta-cargo {
  background: #ffe5e5 !important;
  border: 2px solid #ffb3b3 !important;
}

/* Tarjeta de ABONO */
.tarjeta-abono {
  background: #e9ffe9 !important;
  border: 2px solid #b7ffb7 !important;
}

/* Iconos */
.icono-cargo {
  background: #ffb3b3;
  color: white;
}

.icono-abono {
  background: #8cff8c;
  color: white;
}

.timeline {
  margin-left: 20px;
  border-left: 3px solid #d0d7de;
  padding-left: 20px;
}

.timeline-line {
  width: 3px;
  background-color: #d0d7de;
  min-height: 100%;
  position: relative;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 3px solid #0d6efd;
  border-radius: 50%;
  position: absolute;
  left: -7px;
  top: 0;
}

/* ===== TARJETA CLIENTE ===== */
.cliente-card {
  border-radius: 24px;
  background: linear-gradient(135deg, #f8fbff, #ffffff);
  transition: all 0.3s ease;
}

.cliente-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(13, 110, 253, 0.15);
}

/* Avatar circular */
.cliente-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd, #4dabf7);
  color: white;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Datos en línea */
.cliente-datos {
  display: flex;
  flex-direction: column; /* ← CLAVE */
  gap: 6px;
  font-size: 0.9rem;
  color: #555;
}


/* Notas */
.cliente-notas {
  font-size: 0.9rem;
  color: #6c757d;
  background: #ebf2f9;
  padding: 8px 12px;
  border-radius: 10px;
}

.movimiento-toggle .btn {
  font-size: 1.1rem;
  font-weight: 700;
  padding: 14px;
}

.movimiento-card {
  transition: all 0.3s ease;
}

.movimiento-cargo {
  background: linear-gradient(135deg, #f7d9d9, #ffffff);
  border-left: 6px solid #dc3545;
}

.movimiento-abono {
  background: linear-gradient(135deg, #ddf7e1, #ffffff);
  border-left: 6px solid #198754;
}

.bg-white.border {
  border: 1px dashed #cfe2ff;
}
.modal .odontograma {
  transform: scale(0.9);
}

.sensibilidad-lista{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.sensibilidad-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px 14px;
  border-radius:12px;
  border:1px solid #e9ecef;
  background:white;
}

/* SOLO desktop empieza columnas */
@media (min-width:1200px){
  .sensibilidad-lista{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:12px;
  }
}

/* Pantallas muy grandes */
@media (min-width:1600px){
  .sensibilidad-lista{
    grid-template-columns:repeat(3,1fr);
  }
}

.anamnesis-card-item {
  border: 2px solid transparent;
  background: #f8f9fa;
  transition: all 0.25s ease;
  position: relative;
}

.anamnesis-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.anamnesis-card-item.activo {
  transform: scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

/* COLORES POR RIESGO */
.anamnesis-card-item.alto.activo {
  background: #ffe5e5;
  border-color: #dc3545;
}

.anamnesis-card-item.medio.activo {
  background: #fff4db;
  border-color: #ffc107;
}

.anamnesis-card-item.bajo.activo {
  background: #e9fbe9;
  border-color: #198754;
}

/* CHECK VISUAL */
.anamnesis-card-item.activo::after {
  content: "✔";
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #198754;
}

.izquierda-panel {
  background-color: #f1f3f5; /* gris claro un poco más oscuro */
  box-shadow: inset -5px 0 15px rgba(0,0,0,0.1); /* sombra más intensa */
  border-radius: 20px 0 0 20px;

   height: 560px;        /* 🔥 misma altura que derecha */
  overflow-y: auto;     /* 🔥 scroll interno */
}

.derecha-panel {
  background-color: #ffffff; /* blanco puro */
  border-radius: 0 20px 20px 0;
}

.cliente-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.rounded-4 {
  border-radius: 12px;
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}
.print-flex {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.print-tratamientos {
  flex: 0 0 65%;
  max-width: 65%;
}

/* ============================= */
/* RESPONSIVE MOVIL */
/* ============================= */
@media (max-width: 991px) {

  .izquierda-panel {
    height: auto;              /* 🔥 quitar altura fija */
    overflow: visible;
    border-radius: 20px 20px 0 0;
    box-shadow: none;
  }

  .derecha-panel {
    border-radius: 0 0 20px 20px;
  }

  .cliente-card:hover {
    transform: none; /* quitar animación en móvil */
  }

}

@media (max-width: 768px) {

  .timeline {
    margin-left: 0;
    border-left: none;
    padding-left: 0;
  }

  .timeline-item {
    flex-direction: column !important;
  }

  .timeline-line {
    display: none;
  }

  .timeline-dot {
    display: none;
  }

  .timeline-item .card {
    width: 100% !important;
  }

}
@media (max-width: 768px) {

  .tratamientos-panel {
    max-height: none;
  }

}
/* Oculto en pantalla normal */
.print-only {
  display: none;
}

/* Visible SOLO al imprimir */
@media print {
  .print-only {
    display: block;
  }
  #printArea,
  #printArea * {
    visibility: visible;
  }

  #printArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.finanzas-header {
  background: #f8fafc;
  border-radius: 16px;
  padding: 14px 18px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.finanzas-header:hover {
  background: #eef2f7;
}

.finanzas-header.abierto {
  background: #e6f9fc;
  border-left: 5px solid #42c9db;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.toggle-icon {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.rotado {
  transform: rotate(180deg);
}

.confirm-toast-backdrop{
  position: fixed;
  inset: 0;
  z-index: 1200;
  pointer-events: auto;
}

.confirm-toast-card{
  position: fixed;
  top: 16px;
  right: 16px;
  width: min(420px, calc(100vw - 32px));
  background: #0f172a;
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 22px 70px rgba(0,0,0,.35);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.10);
}

.confirm-toast-head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255,255,255,.06);
}

.confirm-toast-title{
  font-weight: 900;
  letter-spacing: .2px;
}

.confirm-x{
  border: 0;
  background: transparent;
  color: rgba(255,255,255,.85);
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.confirm-toast-body{
  padding: 12px 14px;
}

.confirm-lines{
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,.88);
}

.confirm-toast-actions{
  display:flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 14px 14px;
  background: rgba(255,255,255,.04);
}

.diente-box {
  position: relative;
  display: inline-block;
}

.badge-tratamientos {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #dc3545;
  color: white;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 2;
}

.panel-seccion {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

.panel-seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8fbff;
  border-bottom: 1px solid #e9ecef;
}

.panel-seccion-body {
  padding: 14px;
}

.diente-card {
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 14px;
  background: #fcfcfd;
  margin-bottom: 14px;
}

.diente-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.diente-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eef4ff;
  color: #1d4ed8;
  border: 1px solid #cfe0ff;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.diente-add {
  min-width: 220px;
  flex: 1;
  max-width: 280px;
}

.diente-tratamientos-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tratamiento-mini-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
}

.tratamiento-mini-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.tratamiento-mini-title {
  font-weight: 700;
  color: #0f172a;
}

.tratamiento-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.mini-field label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}

.general-card {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
}

.general-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr 0.7fr 1fr 0.9fr 1.4fr auto;
  gap: 10px;
  align-items: end;
}

.descripcion-field {
  min-width: 180px;
}

.general-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

@media (max-width: 992px) {
  .general-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .general-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .tratamiento-mini-grid,
  .general-grid {
    grid-template-columns: 1fr;
  }

  .diente-add {
    min-width: 100%;
    max-width: 100%;
  }
}

.panel-seccion {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

.panel-seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f8fbff;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.panel-seccion-body {
  padding: 14px;
}

.dientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.diente-selector-card {
  border: 1px solid #dbe4f0;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  text-align: left;
  transition: 0.2s ease;
  cursor: pointer;
}

.diente-selector-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 8px 20px rgba(59,130,246,0.12);
}

.diente-selector-card.activo {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 8px 20px rgba(37,99,235,0.15);
}

.diente-selector-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 8px;
}

.diente-selector-numero {
  font-weight: 700;
  color: #1e3a8a;
}

.diente-selector-badge {
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tratamiento-editor-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fcfcfd;
  padding: 14px;
}

.tratamiento-editor-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.tratamiento-editor-title {
  font-weight: 700;
  color: #0f172a;
}

.tratamiento-editor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.mini-field label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 5px;
}

.general-card {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
}

.general-grid {
  display: grid;
  grid-template-columns: 3fr 0.7fr 0.7fr 2.3fr 0.9fr auto;
  gap: 10px;
  align-items: end;
}

.descripcion-field {
  min-width: 180px;
}

.general-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

.modal-tratamientos-col {
  max-height: 72vh;
  overflow-y: auto;
  padding-right: 8px;
}

.modal-tratamientos-col::-webkit-scrollbar {
  width: 8px;
}

.modal-tratamientos-col::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}



@media (max-width: 991.98px) {
  .modal-tratamientos-col {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }

  .odontograma-sticky-card {
    position: static;
  }

  .general-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .general-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .tratamiento-editor-grid,
  .general-grid,
  .dientes-grid {
    grid-template-columns: 1fr;
  }
}

.panel-dientes {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
}

.panel-dientes .panel-seccion-header {
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-bottom: 1px solid #dbeafe;
}

.panel-generales {
  background: #ffffff;
  border: 1px solid #ede9fe;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.08);
}

.panel-generales .panel-seccion-header {
  background: linear-gradient(180deg, #f5f3ff 0%, #faf8ff 100%);
  border-bottom: 1px solid #e9d5ff;
}

.panel-generales .panel-seccion-body {
  background: #fcfbff;
}

.separador-bloques {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 2px;
}

.separador-bloques::before,
.separador-bloques::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
}

.separador-bloques span {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}

.general-card {
  border: 1px dashed rgba(124, 58, 237, 0.25);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
}

.general-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.78rem;
  font-weight: 700;
}
.panel-dientes {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
}

.panel-dientes .panel-seccion-header {
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-bottom: 1px solid #dbeafe;
}

.panel-generales {
  background: #ffffff;
  border: 1px solid #ede9fe;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.08);
}

.panel-generales .panel-seccion-header {
  background: linear-gradient(180deg, #f5f3ff 0%, #faf8ff 100%);
  border-bottom: 1px solid #e9d5ff;
}

.panel-generales .panel-seccion-body {
  background: #fcfbff;
}

.separador-bloques {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 2px;
}

.separador-bloques::before,
.separador-bloques::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
}

.separador-bloques span {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}

.general-card {
  border: 1px dashed rgba(124, 58, 237, 0.25);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
}

.general-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.78rem;
  font-weight: 700;
}

.acordeon-header {
  cursor: pointer;
  user-select: none;
}

.acordeon-icono {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
  color: #6d28d9;
  display: inline-flex;
  align-items: center;
}

.acordeon-icono.abierto {
  transform: rotate(180deg);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.panel-constancia {
  border: 1px solid #fecaca;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.08);
}

.panel-constancia .panel-seccion-header {
  background: linear-gradient(180deg, #fff1f2 0%, #fff7f7 100%);
  border-bottom: 1px solid #fecaca;
}



.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.print-options-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 12px;
}

</style>

<script>
import html2canvas from "html2canvas";
import Odontograma from "@/components/OdontogramaVista.vue";
import { db } from "@/firebase";
import { query, orderBy, getDocs, limit, writeBatch } from "firebase/firestore";
import { 
  doc, updateDoc, increment, collection, addDoc, onSnapshot, getDoc, serverTimestamp, setDoc, deleteDoc
} from "firebase/firestore";


export default {
  components: { Odontograma },
  data() {
    return {
      doctorMedicamento: null,
      medicina: {
        nombre: "",
        cantidad: 1,
        unidad: "",
        costo: 0,
        descripcion: ""
      },
      medicinas: [],
      guardandoMedicamento: false,
      seleccionadosParaSumar: {},
      mostrarModalConstancia: false,
      mostrarGenerales: false,
      dienteActivo: null,
      confirm: {
        open: false,
        title: "",
        lines: [],
        _resolve: null
      },
      guardandoMovimiento: false,
      editandoMovimientoId: null,
      movimientoEditandoOriginal: null,
      guardandoTrabajo: false,
      mostrarFinanciero: false,
      filtro: "todos",
      imprimirTratamientosConPrecio: true,
      tratamientoSeleccionadoImpresion: "__TODOS__",
      otrasCondicionesVista: [],
      tratamientosLista: [],
      materialesLista: [],
      otrasCondiciones: [""], // array dinámico
      anamnesisDetalles: {
      sensibilidadOral: [],
},


opcionesSensibilidadOral: [
  "Frío",
  "Calor",
  "Dulces",
  "Ácidos",
  "Aire",
  "Masticación"
],



      riesgoCondiciones: {
      problemasCardiacos: "alto",
      diabetes: "alto",
      anticoagulantes: "alto",

      Presionalta: "alto",
      Presionbaja: "alto",
      epilepsia: "alto",
      asma: "alto",

      embarazo: "alto",
      sensibilidadOral: "bajo",
      dificultadTragar: "medio",

      alergiaAnestesia: "alto",
      alergiaMedicamentos: "alto",

      primeraVisita: "bajo",

        protusionlingual: "alto",
        onicofagia: "medio",
        respiracionbucal: "medio",
        problemascirulatorio: "alto",
        problemanervioso: "alto",
        dolorregionauditiva: "alto",
        excesivosangramiento: "alto",
        sangramientodeencillas: "medio",
        anemia: "alto",
        artritis: "medio",
        amigdalitis: "alto",
    },

    ordenRiesgo: {
      alto: 1,
      medio: 2,
      bajo: 3
    },


      preguntasMedicasVista: {
      primeraVisita: "Primera visita",
      embarazo: "Embarazo",
      sensibilidadOral: "Sensibilidad oral",
      dificultadTragar: "Dificultad para tragar",
      problemasCardiacos: "Problemas cardíacos",
      diabetes: "Diabetes",
      Presionalta: "Presión alta",
      Presionbaja: "Presión baja",
      anticoagulantes: "Uso de anticoagulantes",
      alergiaAnestesia: "Alergia a anestesia",
      alergiaMedicamentos: "Alergic@ al antibiotico",
      epilepsia: "Epilepsia",
      asma: "Asma",
       protusionlingual: "Protusión Lingual",
        onicofagia: "Onicofagia",
        respiracionbucal: "Respiración Bucal",
        problemascirulatorio: "Problema Circulatorio",
        problemanervioso: "Problema nervioso",
        dolorregionauditiva: "Dolor en región Auditiva",
        excesivosangramiento: "Excesivo sangramiento",
        sangramientodeencillas: "Sangramiento de Encías",
        anemia: "Anemia",
        artritis: "Artritis",
        amigdalitis: "Amigdalitis",
    },
            preguntasMedicas: {
        primeraVisita: "¿primera visita?",
        embarazo: "¿embarazada?",
        sensibilidadOral: "¿sensibilidad oral?",
        dificultadTragar: "¿dificultad para tragar?",
        problemasCardiacos: "¿problemas cardíacos?",
        diabetes: "¿diabetes?",
        Presionalta: "¿Presión alta?",
        Presionbaja: "¿Presión baja?",
        anticoagulantes: "¿Toma anticoagulantes?",
        alergiaAnestesia: "¿Alergia a anestesia?",
        alergiaMedicamentos: "¿Alergia a antibioticos?",
        epilepsia: "¿Epilepsia?",
        asma: "¿Asma?",
        protusionlingual: "¿Protusión Lingual?",
        onicofagia: "¿Onicofagia?",
        respiracionbucal: "¿Respiración Bucal?",
        problemascirulatorio: "¿Problema Circulatorio?",
        problemanervioso: "¿Problema nervioso?",
        dolorregionauditiva: "¿Dolor en región Auditiva?",
        excesivosangramiento: "¿Excesivo sangramiento?",
        sangramientodeencillas: "¿Sangramiento de Encías?",
        anemia: "¿Anemia?",
        artritis: "Artritis?",
        amigdalitis: "¿Amigdalitis?",
      },

      anamnesis: {},
      

      trabajo: {
          tipo: "",
          descripcion: "",
          monto: 0
        },
        trabajos: [],

      facturar: true, // 👈 por defecto marcado

      cliente: null,
      movimientos: [],
      tipo: "cargo",
      monto: 0,
      descripcion: "",
      metodoPago: "",

      doctores: [],
      doctorSeleccionado: null,

      ignorarWatch: false, // 👈 NUEVO

      form: {
        constancia: {
        texto: "",
        imprimir: false
      },
      dientes: [],
      tratamientos: {}, 
      tratamientosGenerales: [], // 👈 NUEVO
      estados: {}, // 👈 NUEVO

      respaldoDientes: [],
  respaldoTratamientos: {},

  hayCambiosModal: false,
    },
    hayCambios: false,   // 👈 AQUI

     toastMessage: "",
    toastColor: "bg-danger"
    };
  },

  

computed: {

  totalTratamientosMarcadosParaSumar() {
  let total = 0;

  this.tratamientosVistaPrevia.forEach((item) => {
    const key = this.getKeySumaTratamiento(item);

    if (!this.seleccionadosParaSumar[key]) return;

    let precio = 0;

    if (item.tipo === "diente") {
      precio = Number(item.tratamiento?.precio || 0);
    }

    if (item.tipo === "general") {
      const t = this.form.tratamientosGenerales[item.index];
      precio = Number(t?.precio || 0);
    }

    if (!Number.isNaN(precio) && precio > 0) {
      total += precio;
    }
  });

  return Number(total.toFixed(2));
},

cantidadTratamientosMarcadosParaSumar() {
  return this.tratamientosVistaPrevia.filter((item) => {
    const key = this.getKeySumaTratamiento(item);
    return !!this.seleccionadosParaSumar[key];
  }).length;
},

opcionesTratamientosImpresion() {
  const nombres = this.tratamientosVistaPrevia
    .map((item) => this.obtenerNombreTratamientoImpresion(item))
    .filter(Boolean);

  return Array.from(new Set(nombres)).sort((a, b) => a.localeCompare(b, "es"));
},

tratamientosVistaPreviaImpresion() {
  if (this.tratamientoSeleccionadoImpresion === "__TODOS__") {
    return this.tratamientosVistaPrevia.map((item) => ({
      ...item,
      descripcion: this.obtenerDescripcionTratamientoImpresion(item, this.imprimirTratamientosConPrecio)
    }));
  }

  return this.tratamientosVistaPrevia
    .filter((item) => this.obtenerNombreTratamientoImpresion(item) === this.tratamientoSeleccionadoImpresion)
    .map((item) => ({
      ...item,
      descripcion: this.obtenerDescripcionTratamientoImpresion(item, this.imprimirTratamientosConPrecio)
    }));
},

tratamientosOdontogramaImpresion() {
  if (this.tratamientoSeleccionadoImpresion === "__TODOS__") {
    return this.form.tratamientos;
  }

  const filtrados = {};

  Object.keys(this.form.tratamientos || {}).forEach((diente) => {
    const lista = this.obtenerTratamientosDiente(diente).filter(
      (tratamiento) => (tratamiento?.tipo || "") === this.tratamientoSeleccionadoImpresion
    );

    if (lista.length) {
      filtrados[diente] = lista;
    }
  });

  return filtrados;
},

tratamientosGeneralesImpresion() {
  if (this.tratamientoSeleccionadoImpresion === "__TODOS__") {
    return this.form.tratamientosGenerales;
  }

  return (this.form.tratamientosGenerales || []).filter(
    (tratamiento) => (tratamiento?.tipo || "") === this.tratamientoSeleccionadoImpresion
  );
},

seleccionDientesImpresion() {
  if (this.tratamientoSeleccionadoImpresion === "__TODOS__") {
    return this.form.dientes;
  }

  return Object.keys(this.tratamientosOdontogramaImpresion);
},

   tratamientosFiltrados() {
  if (this.filtro === "pendiente") {
    return this.tratamientosVistaPrevia.filter(t => t.estado !== "realizado");
  }

  if (this.filtro === "realizado") {
    return this.tratamientosVistaPrevia.filter(t => t.estado === "realizado");
  }

  if (this.filtro === "sumar") {
    return this.tratamientosVistaPrevia;
  }

  return this.tratamientosVistaPrevia;
},
  tratamientosVistaPrevia() {
  const lista = [];

  Object.entries(this.form.tratamientos).forEach(([diente, valor]) => {
    const tratamientos = this.obtenerTratamientosDiente(diente);

    tratamientos.forEach((tratamiento, idx) => {
      const estadoKey = this.getEstadoTratamientoKey(diente, tratamiento, idx);

      lista.push({
        tipo: "diente",
        diente,
        tratamiento,
        titulo: `Diente ${diente}`,
        descripcion: this.formatearTratamientoVista(tratamiento),
        estado: this.form.estados?.[estadoKey] || "pendiente",
        estadoKey,
        subindex: idx
      });
    });
  });

  this.form.tratamientosGenerales.forEach((t, index) => {
  if (t.tipo) {
    const rango = (t.desde !== "" && t.hasta !== "" && t.desde != null && t.hasta != null)
      ? `Diente ${t.desde} al ${t.hasta}`
      : "Rango no definido";

    const material = t.material ? ` / ${t.material}` : "";
    const precio =
      t.precio !== null &&
      t.precio !== "" &&
      !Number.isNaN(Number(t.precio))
        ? ` — Q ${Number(t.precio).toFixed(2)}`
        : "";

    const extraDesc = t.descripcion ? ` – ${t.descripcion}` : "";

    lista.push({
      tipo: "general",
      tipoTratamiento: t.tipo,
      index,
      titulo: `${rango}`,
      descripcion: `${t.tipo}${material}${precio}${extraDesc}`,
      estado: t.estado || "pendiente"
    });
  }
});

  return lista;
},
  totalSeleccionadas() {
    return Object.values(this.anamnesis).filter(v => v).length;
  },
  conteoAlto() {
    return Object.keys(this.preguntasAlto)
      .filter(key => this.anamnesis[key]).length;
  },

    
  preguntasAlto() {
    return Object.fromEntries(
      Object.entries(this.preguntasMedicas)
        .filter(([key]) => this.riesgoCondiciones[key] === "alto")
    );
  },

  preguntasMedio() {
    return Object.fromEntries(
      Object.entries(this.preguntasMedicas)
        .filter(([key]) => this.riesgoCondiciones[key] === "medio")
    );
  },

  preguntasBajo() {
    return Object.fromEntries(
      Object.entries(this.preguntasMedicas)
        .filter(([key]) => this.riesgoCondiciones[key] === "bajo")
    );
  },
    anamnesisAgrupadas() {
  const grupos = {
    alto: [],
    medio: [],
    bajo: []
  };

  Object.keys(this.anamnesis).forEach(key => {
    if (this.anamnesis[key]) {
      const riesgo = this.riesgoCondiciones[key] || "bajo";

      grupos[riesgo].push({
  key,
  label: this.preguntasMedicasVista[key],
  detalle: this.anamnesisDetalles[key] || []
});

    }
  });

  return grupos;
},

    anamnesisSeleccionadas() {
  return Object.keys(this.anamnesis)
    .filter(key => this.anamnesis[key])
    .sort((a, b) => {
      return this.ordenRiesgo[this.riesgoCondiciones[a] || "bajo"]
        - this.ordenRiesgo[this.riesgoCondiciones[b] || "bajo"];
    })
    .map(key => ({
      key,
      label: this.preguntasMedicasVista[key],
      riesgo: this.riesgoCondiciones[key] || "bajo"
    }));
},
     movimientosParaImpresion() {
    const ordenados = [...this.movimientos].sort((a, b) => {
      const fa = a.fecha?.seconds || 0;
      const fb = b.fecha?.seconds || 0;
      return fa - fb; // 🔼 del más antiguo al más reciente
    });

    let saldoCorriendo = 0;

    return ordenados.map((m) => {
      const monto = Number(m.monto || 0);

      if (m.tipo === "cargo") {
        saldoCorriendo += monto;
      } else if (m.tipo === "abono") {
        saldoCorriendo -= monto;
      }

      return {
        ...m,
        saldoCalculado: Number(saldoCorriendo.toFixed(2))
      };
    });
  },

  inicioTratamiento() {
  return this.form.dientes.length > 0;
}
,
  usuarioActual() {
    return JSON.parse(localStorage.getItem("doctorUser"));
  },

  puedeEditarMovimiento() {
    return this.tienePermisoMovimiento("editarMovimientoFinanciero");
  },

  puedeEliminarMovimiento() {
    return this.tienePermisoMovimiento("eliminarMovimientoFinanciero");
  },

  // 💡 Computed para habilitar el botón Guardar tratamientos
puedeGuardarTratamiento() {
  const dientesValidos = this.form.dientes.every(diente => {
    const tratamientos = this.obtenerTratamientosDiente(diente);

    if (!tratamientos.length) return false;

    return tratamientos.every(item => {
      if (!item.tipo) return false;
      if (this.tratamientoUsaMaterial(item.tipo) && !item.material) return false;
      if (item.precio == null || item.precio === "" || Number(item.precio) <= 0) return false;
      return true;
    });
  });

  const generalesValidos = this.form.tratamientosGenerales.every(t => {
    if (!t.tipo) return false;
    if (t.desde === "" || t.desde == null) return false;
    if (t.hasta === "" || t.hasta == null) return false;
    if (this.tratamientoUsaMaterial(t.tipo) && !t.material) return false;
    if (t.precio == null || t.precio === "" || Number(t.precio) <= 0) return false;
    return true;
  });

  return dientesValidos && generalesValidos;
}
},


  async mounted() {

    

     this.cargarTratamientos();
     this.cargarAnamnesis();

 const id = this.$route.params.id; // ✅ SIEMPRE PRIMERO
    const trabajosQuery = query(
      collection(db, `clientes/${id}/trabajos`),
      orderBy("fecha", "desc")
    );

    onSnapshot(trabajosQuery, (snap) => {
      this.trabajos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    const medicinasQuery = query(
      collection(db, `clientes/${id}/medicinas`),
      orderBy("fecha", "desc")
    );

    onSnapshot(medicinasQuery, (snap) => {
      this.medicinas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  

    // Escuchar cliente en tiempo real
    onSnapshot(doc(db, "clientes", id), (snap) => {
      this.cliente = { id, ...snap.data() };
    });

    // Escuchar movimientos en tiempo real
    const q = query(
      collection(db, `clientes/${id}/movimientos`),
      orderBy("fecha", "desc")
    );

    const constanciaRef = doc(db, `clientes/${id}/documentos/constancia_clinica`);

onSnapshot(constanciaRef, (snap) => {
  if (snap.exists()) {
    const data = snap.data();
    this.form.constancia = {
      texto: data.texto || "",
      imprimir: !!data.imprimir
    };
  } else {
    this.form.constancia = {
      texto: "",
      imprimir: false
    };
  }
});

    onSnapshot(q, async (snap) => {
  this.movimientos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  let saldoCalculado = 0;

  this.movimientos.forEach(m => {
    const monto = Number(m.monto || 0);
    if (m.tipo === "cargo") {
      saldoCalculado += monto;
    } else if (m.tipo === "abono") {
      saldoCalculado -= monto;
    }
  });

  if (this.cliente) {
    this.cliente.saldo = saldoCalculado;
  }

  await updateDoc(doc(db, "clientes", id), {
    saldo: saldoCalculado
  });
});

    const doctoresSnap = await getDocs(collection(db, "doctores"));

    this.doctores = doctoresSnap.docs.map(d => ({
      id: d.id,
      nombre: d.data().nombre,
      especialidad: d.data().especialidad,
      email: d.data().email,
      telefono: d.data().telefono
    }));

    const tratamientosQuery = query(
  collection(db, `clientes/${id}/tratamientos`),
  orderBy("fecha", "desc"),
  limit(1) // solo el más reciente
);

onSnapshot(tratamientosQuery, (snap) => {
  this.ignorarWatch = true;

  if (!snap.empty) {
    const data = snap.docs[0].data();

    this.form.dientes = data.dientes || [];
    this.form.tratamientos = this.normalizarTratamientos(data.tratamientos || {});
    this.form.tratamientosGenerales = this.normalizarTratamientosGenerales(
      data.tratamientosGenerales || []
    );
    this.form.estados = data.estados || {};
    
  } else {
    this.form.dientes = [];
    this.form.tratamientos = {};
    this.form.tratamientosGenerales = [];
    this.form.estados = {};
  }

  this.$nextTick(() => {
    this.hayCambios = false;
    this.ignorarWatch = false;
  });
});



this.beforeUnloadHandler = (e) => {
  if (!this.hayCambios) return;

  e.preventDefault();
  e.returnValue = "";
};

window.addEventListener("beforeunload", this.beforeUnloadHandler);



  },


  beforeUnmount() {
  window.removeEventListener("beforeunload", this.beforeUnloadHandler);
},

  beforeRouteLeave(to, from, next) {
  if (!this.hayCambios) {
    next();
    return;
  }

  const salir = confirm(
    "Tienes cambios sin guardar. ¿Deseas salir sin guardar?"
  );

  if (salir) {
    next();
  } else {
    next(false);
  }
},


  

    methods: {

      tienePermisoMovimiento(clavePermiso) {
  const usuario = this.usuarioActual || {};
  const permisos = usuario?.permisos || {};

  return permisos?.[clavePermiso] === true;
},

obtenerFechaMovimiento(fecha) {
  if (!fecha) return null;

  if (fecha instanceof Date) {
    return new Date(fecha);
  }

  if (typeof fecha?.toDate === "function") {
    return fecha.toDate();
  }

  if (typeof fecha?.seconds === "number") {
    return new Date(fecha.seconds * 1000);
  }

  const fechaConvertida = new Date(fecha);
  return Number.isNaN(fechaConvertida.getTime()) ? null : fechaConvertida;
},

obtenerFechaLimiteMovimiento() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const limite = new Date(hoy);
  limite.setDate(limite.getDate() - 3);

  return limite;
},

formatearFechaCorta(fecha) {
  const fechaValida = this.obtenerFechaMovimiento(fecha);
  if (!fechaValida) return "";

  return fechaValida.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
},

puedeModificarMovimientoPorFecha(movimiento) {
  const fechaMovimiento = this.obtenerFechaMovimiento(movimiento?.fecha);
  if (!fechaMovimiento) return false;

  fechaMovimiento.setHours(0, 0, 0, 0);
  return fechaMovimiento >= this.obtenerFechaLimiteMovimiento();
},

mensajeLimiteMovimiento() {
  const fechaLimite = this.formatearFechaCorta(this.obtenerFechaLimiteMovimiento());
  return `Solo puede editar o eliminar movimientos desde el ${fechaLimite} en adelante.`;
},

puedeEditarMovimientoItem(movimiento) {
  return this.puedeEditarMovimiento && this.puedeModificarMovimientoPorFecha(movimiento);
},

puedeEliminarMovimientoItem(movimiento) {
  return this.puedeEliminarMovimiento && this.puedeModificarMovimientoPorFecha(movimiento);
},

normalizarMontoMovimiento() {
  if (this.monto === "" || this.monto == null) return null;

  const monto = Number(this.monto);
  return Number.isNaN(monto) ? null : monto;
},

validarMontoMovimiento() {
  const monto = this.normalizarMontoMovimiento();

  if (monto == null) {
    this.showToast("Ingrese un monto válido.", "warning");
    return false;
  }

  if (this.tipo === "abono") {
    if (monto < 0) {
      this.showToast("En abonos puede ingresar 0, pero no valores negativos.", "warning");
      return false;
    }

    return true;
  }

  if (monto <= 0) {
    this.showToast("En cargos el monto debe ser mayor a 0.", "warning");
    return false;
  }

  return true;
},

obtenerDoctorDesdeMovimiento(movimiento) {
  if (!movimiento?.doctor) return null;

  return this.doctores.find((d) => d.id === movimiento.doctor.id) || {
    id: movimiento.doctor.id || null,
    nombre: movimiento.doctor.nombre || "",
    especialidad: movimiento.doctor.especialidad || "",
    email: movimiento.doctor.email || "",
    telefono: movimiento.doctor.telefono || ""
  };
},

limpiarFormularioMovimiento() {
  this.editandoMovimientoId = null;
  this.movimientoEditandoOriginal = null;
  this.monto = 0;
  this.descripcion = "";
  this.metodoPago = "";
  this.tipo = "cargo";
  this.facturar = true;
  this.doctorSeleccionado = null;
},

cancelarEdicionMovimiento() {
  this.limpiarFormularioMovimiento();
  this.showToast("Edición cancelada.", "warning");
},

iniciarEdicionMovimiento(movimiento) {
  if (!this.puedeEditarMovimiento) {
    this.showToast("No tiene permiso para editar movimientos.", "error");
    return;
  }

  if (!this.puedeModificarMovimientoPorFecha(movimiento)) {
    this.showToast(this.mensajeLimiteMovimiento(), "warning");
    return;
  }

  this.editandoMovimientoId = movimiento.id;
  this.movimientoEditandoOriginal = { ...movimiento };
  this.tipo = movimiento.tipo || "cargo";
  this.monto = Number(movimiento.monto || 0);
  this.descripcion = movimiento.descripcion || "";
  this.metodoPago = movimiento.tipo === "abono" ? (movimiento.metodoPago || "") : "";
  this.facturar = movimiento.tipo === "abono" ? movimiento.facturar !== false : true;
  this.doctorSeleccionado = this.obtenerDoctorDesdeMovimiento(movimiento);
  this.mostrarFinanciero = true;

  window.scrollTo({ top: 0, behavior: "smooth" });
},

async recalcularSaldosMovimientos() {
  const id = this.$route.params.id;
  const snap = await getDocs(
    query(collection(db, `clientes/${id}/movimientos`), orderBy("fecha", "asc"))
  );

  let saldo = 0;
  const batch = writeBatch(db);

  snap.docs.forEach((movDoc) => {
    const data = movDoc.data();
    const monto = Number(data.monto || 0);
    const saldoAntes = saldo;

    if (data.tipo === "cargo") {
      saldo += monto;
    } else if (data.tipo === "abono") {
      saldo -= monto;
    }

    batch.update(doc(db, `clientes/${id}/movimientos`, movDoc.id), {
      saldoAntes,
      saldo
    });
  });

  batch.update(doc(db, "clientes", id), { saldo });
  await batch.commit();
},


      async guardarMedicamento() {
  if (!this.medicina.nombre.trim()) {
    this.showToast("Ingrese el nombre de la medicina", "warning");
    return;
  }

  if (!this.medicina.cantidad || Number(this.medicina.cantidad) <= 0) {
    this.showToast("Ingrese una cantidad válida", "warning");
    return;
  }

  if (!this.doctorMedicamento) {
  this.showToast("Seleccione el doctor que atendió al paciente", "warning");
  return;
}

  const id = this.$route.params.id;

  try {
    this.guardandoMedicamento = true;

    await addDoc(collection(db, `clientes/${id}/medicinas`), {
      pacienteId: id,
      pacienteNombre: this.cliente?.nombre || "",
      nombre: this.medicina.nombre.trim(),
      cantidad: Number(this.medicina.cantidad) || 0,
      unidad: this.medicina.unidad || "",
      costo: Number(this.medicina.costo) || 0,
      descripcion: this.medicina.descripcion || "",
      fecha: serverTimestamp(),
      doctor: {
        id: this.doctorMedicamento?.id || null,
        nombre: this.doctorMedicamento?.nombre || ""
      },
      usuario: this.usuarioActual?.name || "",
      deducibleReporte: true
    });

    await addDoc(collection(db, "auditoria_medicinas"), {
      accion: "REGISTRAR_MEDICINA",
      pacienteId: id,
      pacienteNombre: this.cliente?.nombre || "",
      nombre: this.medicina.nombre.trim(),
      cantidad: Number(this.medicina.cantidad) || 0,
      unidad: this.medicina.unidad || "",
      costo: Number(this.medicina.costo) || 0,
      descripcion: this.medicina.descripcion || "",
      doctor: {
        id: this.doctorSeleccionado?.id || null,
        nombre: this.doctorSeleccionado?.nombre || ""
      },
      usuario: this.usuarioActual?.name || "",
      usuarioId: this.usuarioActual?.uid || "",
      timestamp: serverTimestamp()
    });

    this.medicina = {
      nombre: "",
      cantidad: 1,
      unidad: "",
      costo: 0,
      descripcion: ""
    };
    this.doctorMedicamento = null;

    this.showToast("Medicina registrada correctamente 💊", "success");
  } catch (error) {
    console.error(error);
    this.showToast("Error al guardar la medicina", "error");
  } finally {
    this.guardandoMedicamento = false;
  }
},
      getKeySumaTratamiento(item) {
  if (item.tipo === "diente") {
    return `diente__${item.diente}__${item.tratamiento?._uid || item.subindex}`;
  }

  if (item.tipo === "general") {
    return `general__${item.index}__${item.tipoTratamiento || "sin_tipo"}`;
  }

  return `item__${Math.random().toString(36).slice(2, 9)}`;
},

toggleSeleccionSuma(item) {
  const key = this.getKeySumaTratamiento(item);

  if (this.seleccionadosParaSumar[key]) {
    delete this.seleccionadosParaSumar[key];
  } else {
    this.seleccionadosParaSumar[key] = true;
  }

  this.seleccionadosParaSumar = { ...this.seleccionadosParaSumar };
},

limpiarSeleccionSuma() {
  this.seleccionadosParaSumar = {};
},

      agruparTratamientosParaImpresion(opciones = {}) {
  const {
    incluirPrecio = true,
    tratamiento = "__TODOS__"
  } = opciones;

  const grupos = {
    dientes: {},
    generales: []
  };

  this.tratamientosVistaPrevia
    .filter((item) => {
      if (tratamiento === "__TODOS__") return true;
      return this.obtenerNombreTratamientoImpresion(item) === tratamiento;
    })
    .forEach((t) => {
      if (t.tipo === "diente") {
        if (!grupos.dientes[t.diente]) {
          grupos.dientes[t.diente] = [];
        }

        grupos.dientes[t.diente].push(
          this.obtenerDescripcionTratamientoImpresion(t, incluirPrecio)
        );
      }

      if (t.tipo === "general") {
        grupos.generales.push({
          titulo: t.titulo,
          descripcion: this.obtenerDescripcionTratamientoImpresion(t, incluirPrecio)
        });
      }
    });

  return grupos;
},

      cargarMachoteConstancia() {
  const nombre = this.cliente?.nombre || "________________";
  const dpi = this.cliente?.dpi || "________________";
  const telefono = this.cliente?.telefono || "________________";

  const hoy = new Date().toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  this.form.constancia.texto = `Por medio de la presente hago constar que el paciente ${nombre}, identificado con DPI No. ${dpi}, teléfono ${telefono}, se presentó el día de hoy a un tratamiento dental. Por lo anterior, se recomienda reposo absoluto y seguimiento de las indicaciones médicas correspondientes.`;
},

      async guardarSoloConstancia() {
  const id = this.$route.params.id;

  try {
    const ref = doc(db, `clientes/${id}/documentos/constancia_clinica`);

    await setDoc(ref, {
      texto: this.form.constancia?.texto || "",
      imprimir: !!this.form.constancia?.imprimir,
      fechaActualizacion: serverTimestamp(),
      usuario: this.usuarioActual?.name || ""
    });

    this.showToast("Constancia guardada", "success");
  } catch (error) {
    console.error(error);
    this.showToast("Error al guardar la constancia", "error");
  }
},


      abrirModalConstancia() {
        this.mostrarModalConstancia = true;
      },

      cerrarModalConstancia() {
        this.mostrarModalConstancia = false;
      },

      async guardarConstancia() {

  this.mostrarModalConstancia = false;
  await this.guardarSoloConstancia();
},

      manejarClickDiente(diente) {
  const yaSeleccionado = this.form.dientes.includes(diente);

  if (!yaSeleccionado) {
    this.dienteActivo = diente;
    return;
  }

  if (this.dienteActivo === diente) {
    this.dienteActivo = null;
    return;
  }

  this.dienteActivo = diente;
},

      seleccionarDienteActivo(diente) {
  if (this.dienteActivo === diente) {
    this.dienteActivo = null;
    return;
  }

  this.dienteActivo = diente;
},

asegurarDienteActivo() {
  if (!this.form.dientes.length) {
    this.dienteActivo = null;
    return;
  }

  if (this.dienteActivo && !this.form.dientes.includes(this.dienteActivo)) {
    this.dienteActivo = this.form.dientes[0] || null;
  }
},

cantidadTratamientosDiente(diente) {
  return this.obtenerTratamientosDiente(diente).length;
},

      normalizarTratamientosGenerales(lista = []) {
  return (lista || []).map((item, idx) => ({
    _uid: item?._uid || `tg_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
    tipo: item?.tipo || "",
    desde: item?.desde ?? "",
    hasta: item?.hasta ?? "",
    material: item?.material || "",
    precio: item?.precio ?? null,
    descripcion: item?.descripcion || "",
    estado: item?.estado || "pendiente"
  }));
},

      textoTooltip(numero) {
  const valor = this.tratamientos[numero];

  let tratamientos = [];

  if (Array.isArray(valor)) {
    tratamientos = valor;
  } else if (valor) {
    tratamientos = [valor];
  }

  if (!tratamientos.length) return "";

  const lista = tratamientos.map(t => `• ${t}`).join("\n");

  return `Diente ${numero}\n${lista}`;
},

      openConfirm({ title, lines }) {
  this.confirm.title = title;
  this.confirm.lines = lines;
  this.confirm.open = true;

  return new Promise((resolve) => {
    this.confirm._resolve = resolve;
  });
},

confirmResolve(ok) {
  this.confirm.open = false;

  if (this.confirm._resolve) {
    this.confirm._resolve(ok);
    this.confirm._resolve = null;
  }
},

async confirmarMovimiento() {
  if (this.guardandoMovimiento) return;

  if (!this.validarMontoMovimiento()) return;

  if (!this.doctorSeleccionado) {
    this.showToast("Seleccione el doctor que atendió al paciente.", "warning");
    return;
  }
  if (this.tipo === "abono" && !this.metodoPago) {
    this.showToast("Seleccione un método de pago para el abono.", "warning");
    return;
  }

  const paciente = this.cliente?.nombre || "Paciente";
  const tipoTxt = this.tipo === "cargo" ? "CARGO" : "ABONO";
  const montoTxt = `Q ${Number(this.normalizarMontoMovimiento() || 0).toFixed(2)}`;
  const doctorTxt = this.doctorSeleccionado?.nombre || "—";
  const metodoTxt = this.tipo === "abono" ? (this.metodoPago || "—") : "N/A";
  const facturarTxt = this.tipo === "abono" ? (this.facturar ? "Sí" : "No") : "N/A";
  const descTxt = (this.descripcion || "").trim() || "Sin descripción";
  const accionTxt = this.editandoMovimientoId ? "actualización" : "registro";

  const ok = await this.openConfirm({
    title: this.editandoMovimientoId ? `Confirmar actualización de ${tipoTxt}` : `Confirmar ${tipoTxt}`,
    lines: [
      `Paciente: ${paciente}`,
      `Monto: ${montoTxt}`,
      `Doctor: ${doctorTxt}`,
      `Método: ${metodoTxt}`,
      `Facturar: ${facturarTxt}`,
      `Detalle: ${descTxt}`
    ]
  });

  if (!ok) {
    this.showToast("Acción cancelada.", "warning");
    return;
  }

  try {
    this.guardandoMovimiento = true;

    if (this.editandoMovimientoId) {
      await this.actualizarMovimiento();
      this.showToast("Movimiento actualizado ✅", "success");
    } else {
      await this.agregarMovimiento();
      this.showToast("Movimiento registrado ✅", "success");
    }
  } catch (e) {
    console.error(e);
    this.showToast(`Error al confirmar el ${accionTxt}.`, "error");
  } finally {
    this.guardandoMovimiento = false;
  }
},

async confirmarTrabajo() {
  if (this.guardandoTrabajo) return;

  if (!this.trabajo.tipo || !this.trabajo.monto) {
    this.showToast("Complete el tipo y monto del trabajo", "warning");
    return;
  }
  if (!this.doctorSeleccionado) {
    this.showToast("Seleccione el doctor que atendió el trabajo", "warning");
    return;
  }

  const paciente = this.cliente?.nombre || "Paciente";
  const ok = await this.openConfirm({
    title: "Confirmar trabajo",
    lines: [
      `Paciente: ${paciente}`,
      `Tipo: ${this.trabajo.tipo}`,
      `Monto: Q ${Number(this.trabajo.monto || 0).toFixed(2)}`,
      `Doctor: ${this.doctorSeleccionado?.nombre || "—"}`,
      `Detalle: ${(this.trabajo.descripcion || "").trim() || "Sin descripción"}`
    ]
  });

  if (!ok) {
    this.showToast("Acción cancelada.", "warning");
    return;
  }

  try {
    this.guardandoTrabajo = true;
    await this.guardarTrabajo();
    // guardarTrabajo ya muestra toast success, si quieres evitar doble, quítalo allá o aquí
  } catch (e) {
    console.error(e);
    this.showToast("Error al registrar el trabajo.", "error");
  } finally {
    this.guardandoTrabajo = false;
  }
},

normalizarTratamientos(obj = {}) {
  const normalizado = {};

  Object.entries(obj).forEach(([diente, valor]) => {
    const lista = Array.isArray(valor)
      ? valor
      : valor
      ? [valor]
      : [];

    const items = lista
      .map((item, idx) => {
        if (typeof item === "string") {
          return {
            _uid: `legacy_${diente}_${idx}_${item}`,
            tipo: item,
            material: "",
            precio: null
          };
        }

        return {
          _uid: item?._uid || `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          tipo: item?.tipo || item?.nombre || "",
          material: item?.material || "",
          precio: item?.precio ?? null
        };
      })
      .filter(item => item.tipo && String(item.tipo).trim() !== "");

    if (items.length) {
      normalizado[diente] = items;
    }
  });

  return normalizado;
},

obtenerTratamientosDiente(diente) {
  const valor = this.form.tratamientos[diente];

  if (!valor) return [];

  if (Array.isArray(valor)) {
    return valor.map((item, idx) => {
      if (typeof item === "string") {
        return {
          _uid: `legacy_${diente}_${idx}_${item}`,
          tipo: item,
          material: "",
          precio: null
        };
      }

      return {
        _uid: item?._uid || `tmp_${diente}_${idx}`,
        tipo: item?.tipo || "",
        material: item?.material || "",
        precio: item?.precio ?? null
      };
    });
  }

  if (typeof valor === "string" && valor.trim() !== "") {
    return [{
      _uid: `legacy_${diente}_0_${valor}`,
      tipo: valor,
      material: "",
      precio: null
    }];
  }

  return [];
},
crearUid() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
},

tratamientoUsaMaterial(tipo) {
  const encontrado = this.tratamientosLista.find(t => t.nombre === tipo);
  return !!encontrado?.usaMaterial;
},

formatearTratamientoVista(item, incluirPrecio = true) {
  if (!item) return "";

  const tipo = item.tipo || "";
  const material = item.material ? ` / ${item.material}` : "";
  const precio =
    incluirPrecio &&
    item.precio !== null &&
    item.precio !== "" &&
    !Number.isNaN(Number(item.precio))
      ? ` — Q ${Number(item.precio).toFixed(2)}`
      : "";

  return `${tipo}${material}${precio}`.trim();
},

obtenerNombreTratamientoImpresion(item) {
  if (!item) return "";

  if (item.tipo === "diente") {
    return item.tratamiento?.tipo || "";
  }

  if (item.tipo === "general") {
    return item.tipoTratamiento || this.form.tratamientosGenerales[item.index]?.tipo || "";
  }

  return item.tipo || "";
},

obtenerDescripcionTratamientoImpresion(item, incluirPrecio = true) {
  if (!item) return "";

  if (item.tipo === "diente") {
    return this.formatearTratamientoVista(item.tratamiento, incluirPrecio);
  }

  if (item.tipo === "general") {
    const general = this.form.tratamientosGenerales[item.index] || {};
    const descripcionBase = this.formatearTratamientoVista(general, incluirPrecio);
    return general.descripcion ? `${descripcionBase} – ${general.descripcion}` : descripcionBase;
  }

  return item.descripcion || "";
},

getEstadoTratamientoKey(diente, tratamiento, idx = 0) {
  return `${diente}__${tratamiento?._uid || `${idx}_${tratamiento?.tipo || ""}`}`;
},

agregarTratamientoADiente(diente, tipo) {
  if (!tipo) return;

  const actuales = this.obtenerTratamientosDiente(diente);

  this.form.tratamientos[diente] = [
    ...actuales,
    {
      _uid: this.crearUid(),
      tipo,
      material: "",
      precio: null
    }
  ];

  this.form.tratamientos = { ...this.form.tratamientos };
},

quitarTratamientoDiente(diente, index) {
  const actuales = this.obtenerTratamientosDiente(diente);
  const itemEliminado = actuales[index];
  const nuevos = actuales.filter((_, i) => i !== index);

  if (nuevos.length > 0) {
    this.form.tratamientos[diente] = nuevos;
  } else {
    delete this.form.tratamientos[diente];
  }

  if (itemEliminado) {
    delete this.form.estados[this.getEstadoTratamientoKey(diente, itemEliminado, index)];
  }

  this.form.tratamientos = { ...this.form.tratamientos };
  this.form.estados = { ...this.form.estados };
},

      eliminarTratamiento(numero) {
  delete this.form.tratamientos[numero];

  Object.keys(this.form.estados).forEach(key => {
    if (key.startsWith(`${numero}__`)) {
      delete this.form.estados[key];
    }
  });

  this.form.tratamientos = { ...this.form.tratamientos };
  this.form.estados = { ...this.form.estados };
},


      hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
},

      cambiarEstado(tratamiento) {
  if (tratamiento.tipo === "diente") {
    const key = tratamiento.estadoKey;

    this.form.estados[key] =
      this.form.estados[key] === "realizado"
        ? "pendiente"
        : "realizado";

    this.form.estados = { ...this.form.estados };
  }

  if (tratamiento.tipo === "general") {
    const t = this.form.tratamientosGenerales[tratamiento.index];
    t.estado = t.estado === "realizado" ? "pendiente" : "realizado";
  }
},
     
  colorSegunTipo(tipo) {
  const t = this.tratamientosLista.find(x => x.nombre === tipo);
  if (!t || !t.color) return "rgba(200,200,200,0.2)";

  return this.hexToRgba(t.color, 0.3);
},

      colorDiente(diente) {
  const tratamientos = this.obtenerTratamientosDiente(diente);

  if (tratamientos.length) {
    const ultimo = tratamientos[tratamientos.length - 1];
    const t = this.tratamientosLista.find(x => x.nombre === ultimo.tipo);
    if (t && t.color) return t.color;
  }

  for (let t of this.form.tratamientosGenerales) {
    if (t.desde !== "" && t.hasta !== "" && t.desde != null && t.hasta != null) {
      if (this.estaEnRango(diente, t.desde, t.hasta)) {
        const cat = this.tratamientosLista.find(x => x.nombre === t.tipo);
        if (cat && cat.color) return cat.color;
      }
    }
  }

  return "#ffffff";
},

      estaEnRango(diente, desde, hasta) {
  if (diente == null || desde == null || hasta == null || desde === "" || hasta === "") {
    return false;
  }

  const d = Number(diente);
  const a = Number(desde);
  const b = Number(hasta);

  if (Number.isNaN(d) || Number.isNaN(a) || Number.isNaN(b)) {
    return false;
  }

  const arcoSuperior = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const arcoInferior = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

  const enArco = (arco) => {
    const iD = arco.indexOf(d);
    const iA = arco.indexOf(a);
    const iB = arco.indexOf(b);

    if (iD === -1 || iA === -1 || iB === -1) return false;

    const inicio = Math.min(iA, iB);
    const fin = Math.max(iA, iB);

    return iD >= inicio && iD <= fin;
  };

  return enArco(arcoSuperior) || enArco(arcoInferior);
},

      agregarTratamientoGeneral() {
  this.form.tratamientosGenerales.push({
    _uid: `tg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    tipo: "",
    desde: "",
    hasta: "",
    material: "",
    precio: null,
    descripcion: "",
    estado: "pendiente"
  });
},

  eliminarTratamientoGeneral(index) {
    this.form.tratamientosGenerales.splice(index, 1);
  },

      async cargarTratamientos() {
  const snap = await getDocs(collection(db, "tratamientos"));

  let listaTratamientos = [];
  let listaMateriales = [];

  snap.forEach(doc => {
    const data = doc.data();

    if (Array.isArray(data.tratamientos)) {
      listaTratamientos.push(
        ...data.tratamientos.map(t => ({
          nombre: t.nombre || "",
          color: t.color || "#3b82f6",
          usaMaterial: !!t.usaMaterial
        }))
      );
    }

    if (Array.isArray(data.materiales)) {
      listaMateriales.push(
        ...data.materiales.map(m => ({
          nombre: m.nombre || ""
        }))
      );
    }
  });

  const mapaTratamientos = new Map();
  listaTratamientos.forEach(t => {
    if (t.nombre) mapaTratamientos.set(t.nombre.toLowerCase(), t);
  });

  const mapaMateriales = new Map();
  listaMateriales.forEach(m => {
    if (m.nombre) mapaMateriales.set(m.nombre.toLowerCase(), m);
  });

  this.tratamientosLista = Array.from(mapaTratamientos.values());
  this.materialesLista = Array.from(mapaMateriales.values());

  const id = this.$route.params.id;

  try {
    const q = query(
      collection(db, `clientes/${id}/tratamientos`),
      orderBy("fecha", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();

      this.form.dientes = data.dientes || [];
      this.form.tratamientos = this.normalizarTratamientos(data.tratamientos || {});
      this.form.tratamientosGenerales = this.normalizarTratamientosGenerales(
        data.tratamientosGenerales || []
      );
      this.form.estados = data.estados || {};
      

      this.form.respaldoDientes = [...this.form.dientes];
      this.form.respaldoTratamientos = JSON.parse(
        JSON.stringify(this.form.tratamientos)
      );

      this.respaldoTratamientosGenerales = JSON.parse(
        JSON.stringify(this.form.tratamientosGenerales)
      );
    } else {
      this.form.dientes = [];
      this.form.tratamientos = {};
      this.form.tratamientosGenerales = [];
      this.form.estados = {};
      this.form.constancia = { texto: "", imprimir: false };
    }

  } catch (error) {
    console.error("Error cargando tratamientos del paciente:", error);
  }
},

  agregarCondicion() {
    this.otrasCondiciones.push("");
  },

  eliminarCondicion(index) {
    this.otrasCondiciones.splice(index, 1);
  },

  cantidadTratamientos(numero) {
  const valor = this.tratamientos[numero];

  if (Array.isArray(valor)) {
    return valor.filter(Boolean).length;
  }

  if (valor) {
    return 1;
  }

  return 0;
},

    colorRiesgo(riesgo) {
      if (riesgo === "alto") return "bg-danger-subtle text-danger";
      if (riesgo === "medio") return "bg-warning-subtle text-warning";
      return "bg-success-subtle text-success";
    }, 

    async guardarAnamnesis() {
  const id = this.$route.params.id;

  // Limpiar condiciones vacías
  const otrasCondicionesLimpias = this.otrasCondiciones
    .map(c => c.trim())
    .filter(c => c !== "");

  await addDoc(collection(db, `clientes/${id}/anamnesis`), {
    respuestas: { ...this.anamnesis },
    detalles: { ...this.anamnesisDetalles },

    // 🔥 NUEVO
    otrasCondiciones: otrasCondicionesLimpias,

    fecha: serverTimestamp(),

    doctor: {
      id: this.doctorSeleccionado?.id || null,
      nombre: this.doctorSeleccionado?.nombre || ""
    },

    usuario: this.usuarioActual?.name || ""
  });

  this.showToast("Información médica guardada", "success");
},

cargarAnamnesis() {
  const id = this.$route.params.id;

  const q = query(
    collection(db, `clientes/${id}/anamnesis`),
    orderBy("fecha", "desc"),
    limit(1)
  );

  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();

      console.log("🔥 TIEMPO REAL:", data);

      this.anamnesis = data.respuestas || {};
      this.anamnesisDetalles = data.detalles || {};

      // 👇 ESTE ES EL IMPORTANTE
      this.otrasCondicionesVista = data.otrasCondiciones || [];

        // 👇 PARA EDITAR (ESTO TE FALTÓ)
    this.otrasCondiciones = data.otrasCondiciones?.length
      ? [...data.otrasCondiciones]
      : [""];
    }
  });
},

    showToast(mensaje, tipo = "error") {
  this.toastMessage = mensaje;

  this.toastColor =
    tipo === "success"
      ? "bg-success"
      : tipo === "warning"
      ? "bg-warning text-dark"
      : "bg-danger";

  this.$nextTick(() => {
    const toastEl = this.$refs.toast;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
  });
},


    abrirModalTratamientos() {
  this.respaldoDientes = [...this.form.dientes];
  this.respaldoTratamientos = JSON.parse(
    JSON.stringify(this.form.tratamientos)
  );

  this.hayCambiosModal = false;

  this.$nextTick(() => {
  this.asegurarDienteActivo();
});
},


    
async imprimirEstadoCuenta() {

  await this.$nextTick();

  const odontograma = this.$refs.odontogramaPrint;
  const printArea = document.getElementById("printArea");

  // 1️⃣ Mostrar temporalmente
  printArea.style.display = "block";
  await new Promise(resolve => setTimeout(resolve, 100));

  // 🔥 GUARDAR TAMAÑO ORIGINAL
const originalWidth = odontograma.style.width;
const originalMaxWidth = odontograma.style.maxWidth;
const originalTransform = odontograma.style.transform;

// 🔥 FORZAR TAMAÑO ESTABLE
odontograma.style.width = "350px";
odontograma.style.maxWidth = "350px";
odontograma.style.transform = "none";

// esperar reflow real
await this.$nextTick();
await new Promise(resolve => setTimeout(resolve, 150));

  // 2️⃣ Capturar odontograma completo
 const canvas = await html2canvas(odontograma, {
  scale: 3,
  backgroundColor: "#ffffff",
  useCORS: true
});

  const imagen = canvas.toDataURL("image/png");

odontograma.style.width = originalWidth;
odontograma.style.maxWidth = originalMaxWidth;
odontograma.style.transform = originalTransform;

  // 3️⃣ Ocultar nuevamente
  printArea.style.display = "none";

  // 4️⃣ Clonar contenido
  const clon = printArea.cloneNode(true);
  const contenedor = clon.querySelector(".print-odontograma");
  const contenedorTratamientos = clon.querySelector(".print-tratamientos");

  if (contenedor) {
    contenedor.innerHTML = `
      <img src="${imagen}" style="
        width:100%;
        height:auto;
        display:block;
      " />
    `;
  }

 

  // 5️⃣ Ventana impresión
  const ventana = window.open("", "_blank");
  const textoConstancia = (this.form.constancia?.texto || "")
  .replace(/^CONSTANCIA\s*/i, "")
  .trim();

const bloqueConstancia =
  this.form.constancia?.imprimir && this.form.constancia?.texto?.trim()
    ? `
      <div class="constancia-print">
        <div class="constancia-titulo">CONSTANCIA</div>
        <p class="constancia-texto" style="white-space: pre-line;">${textoConstancia}</p>
      </div>
    `
    : "";

    const fechaActual = new Date().toLocaleDateString("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const tratamientosAgrupados = this.agruparTratamientosParaImpresion({
  incluirPrecio: this.imprimirTratamientosConPrecio,
  tratamiento: this.tratamientoSeleccionadoImpresion
});

const htmlTratamientosDientes = Object.entries(tratamientosAgrupados.dientes)
  .map(([diente, lista]) => `
    <li style="margin-bottom: 8px;">
      <strong>Diente ${diente}</strong>
      <ul style="margin-top: 3px; margin-bottom: 0; padding-left: 18px;">
        ${lista.map(t => `<li>${t}</li>`).join("")}
      </ul>
    </li>
  `)
  .join("");

const htmlTratamientosGenerales = tratamientosAgrupados.generales.length
  ? tratamientosAgrupados.generales
      .map(t => `
        <li style="margin-bottom: 8px;">
          <strong>${t.titulo}</strong><br>
          ${t.descripcion}
        </li>
      `)
      .join("")
  : "";

const htmlTratamientosFinal = `
  ${htmlTratamientosDientes}
  ${htmlTratamientosGenerales ? `
    <li style="margin-top: 10px; list-style: none;">
    </li>
    ${htmlTratamientosGenerales}
  ` : ""}
`;

 if (contenedorTratamientos) {
  contenedorTratamientos.innerHTML = `
    <h5>Tratamientos</h5>
    <ul style="padding-left: 15px; margin: 0;">
      ${htmlTratamientosFinal || "<li>Sin tratamientos registrados</li>"}
    </ul>
  `;
}
  ventana.document.write(`
    <html>
      <head>
        <title>Ficha clínica</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <style>
          body {
            padding: 40px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            color: #333;
          }

          /* ===== MEMBRETE ===== */
          .membrete {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }

          .membrete img {
            height: 70px;
          }

          .membrete-info {
            text-align: left;
            line-height: 1.2;
          }

          .membrete-info h2 {
            margin: 0;
            font-size: 20px;
          }

          .membrete-info p {
            margin: 0;
            font-size: 12px;
          }

          /* ===== TITULOS ===== */
          h3, h5 {
          margin-bottom: 0px;
          margin-top: 0;
          font-weight: bold;
          color: #0d6efd;
        }

        hr {
          margin: 0;
        }

          /* ===== DATOS PACIENTE ===== */
          .datos p {
            margin: 2px 0;
            line-height: 1.2;
          }

          /* ===== CONDICIONES ===== */
          .condiciones ul {
            margin: 0;
            padding-left: 18px;
          }

          .condiciones li {
            margin-bottom: 2px;
            line-height: 1.2;
          }

          /* ===== ODONTOGRAMA + TRATAMIENTOS ===== */
          .print-flex {
            display: flex;
            gap: 30px;
            align-items: flex-start;
            margin-top: 10px;
          }

          .print-odontograma {
            flex: 0 0 35%;
          }

          .print-tratamientos {
            flex: 0 0 60%;
            font-size: 12px;
          }

          .print-tratamientos ul {
            padding-left: 18px;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }

          .print-tratamientos li {
            margin-bottom: 6px;
            line-height: 1.2;
          }

          .condiciones-grid ul {
            column-count: 3;
            column-gap: 30px;
            margin: 0;
            padding-left: 18px;
          }

          .condiciones-grid li {
            break-inside: avoid;
            margin-bottom: 3px;
            line-height: 1.2;
          }

          /* ===== LISTAS EN COLUMNAS ===== */

          .condiciones-grid ul,
          .otras-condiciones ul {
            column-count: 3;      /* número de columnas */
            column-gap: 30px;     /* espacio entre columnas */
            margin: 0;
            padding-left: 18px;
          }

          .condiciones-grid li,
          .otras-condiciones li {
            break-inside: avoid;
            margin-bottom: 3px;
            line-height: 1.2;
            font-size: 12px;
          }

          /* ===== FIRMAS ===== */

          .firmas {
          margin-top: 120px; /* aumenta aquí */
          display: flex;
          justify-content: space-between;
          gap: 60px;
        }

          .firma-box {
            flex: 1;
            text-align: center;
          }

          .linea {
            border-top: 1px solid #000;
            margin-bottom: 0;
            height: 0px;
          }

          .firma-label {
            font-size: 12px;
          }
            /* ===== BLOQUE SUPERIOR 2 COLUMNAS ===== */

          .bloque-superior {
            display: flex;
            gap: 30px;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .col-izquierda {
            flex: 0 0 40%;
          }

          .col-derecha {
            flex: 0 0 60%;
          }
            /* ===== DIVISIÓN VERTICAL BLOQUE SUPERIOR ===== */

          .col-izquierda {
            flex: 0 0 40%;
            padding-right: 25px;
            border-right: 1px solid #ccc;
          }

          .col-derecha {
            flex: 0 0 60%;
            padding-left: 25px;
          }
            /* ===== CONDICIONES MÉDICAS ORDENADAS ===== */

          /* ===== LISTAS EN 2 COLUMNAS ESTABLES ===== */

          .condiciones-grid ul,
          .otras-condiciones ul {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px 25px; /* espacio vertical | horizontal */
            margin: 0;
            padding-left: 18px;
          }

          .condiciones-grid li,
          .otras-condiciones li {
            list-style-position: inside;
            margin: 0;
            line-height: 1.2;
            font-size: 12px;
            overflow-wrap: break-word;
          }
            .titulo-clinica{
            font-family: "Times New Roman", Times, serif;
            font-weight: 800;
            font-size: 18px;
            
            text-align: center;
          }

          .print-tratamientos > ul > li {
              margin-bottom: 8px;
            }

            .print-tratamientos ul ul {
              margin-top: 2px;
              margin-bottom: 0;
            }

            .print-tratamientos ul ul li {
              margin-bottom: 2px;
            }

            /* bloques principales */
            .datos,
            .condiciones,
            .otras-condiciones,
            .condiciones-grid {
              margin-top: 0 !important;
              padding-top: 0 !important;
            }

            /* títulos */
            h3, h5 {
              margin: 0 0 4px 0 !important;
              padding: 0 !important;
              line-height: 1.1;
            }

            /* línea debajo del título */
            hr {
              margin: 0 !important;
              padding: 0 !important;
            }

            /* párrafos de datos */
            .datos p,
            .datos-del-paciente p,
            .print-area p {
              margin: 0 !important;
              line-height: 1.15;
            }

            /* listas médicas */
            .condiciones ul,
            .otras-condiciones ul,
            .condiciones-grid ul {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              padding-top: 0 !important;
            }

            /* items */
            .condiciones li,
            .otras-condiciones li,
            .condiciones-grid li {
              margin: 0 !important;
              line-height: 1.15;
            }
              .print-tratamientos li:last-child {
              margin-bottom: 0 !important;
            }
              .separador-constancia {
              margin: 0 !important;
              padding: 0 !important;
              border: 0 !important;
              border-top: 1px solid #999 !important;
              height: 0 !important;
              line-height: 0 !important;
            }
            .constancia-print {
              margin: 0;
            }
            .constancia-print p {
              margin: 0;
              font-size: 12px;
              text-align: justify;
            }
        </style>
      </head>
      <body>

        <!-- ===== MEMBRETE ===== -->
        <div class="membrete">
          <div class="membrete-info">
           <h6 class="titulo-clinica">
            CLINICA DENTAL
          </h6>
            <p> Tecpán Guatemala, Chimaltenango</p>
            <p>Mail: test@gmail.com</p>
            <p><strong>Fecha:</strong> ${fechaActual}</p>
          </div>
          <img src="${window.location.origin}/logo.png" /> 
        </div>

        ${clon.innerHTML}
        <hr class="separador-constancia">
        ${bloqueConstancia}
        <p></p>
        <div class="declaracion">
        Declaro que la información arriba indicada es verídica y completa.
      </div>
        <!-- ===== FIRMAS ===== -->
        <div class="firmas">
          <div class="firma-box">
            <div class="linea"></div>
            <div class="firma-label">Firma del Paciente</div>
          </div>

          <div class="firma-box">
            <div class="linea"></div>
            <div class="firma-label">Firma del Doctor</div>
          </div>
        </div>

      </body>
    </html>
  `);

  ventana.document.close();

  ventana.onload = function() {
    ventana.focus();
    ventana.print();
    ventana.close();
  };
},

async imprimirEstadoCuentaFinanciero() {

  const movimientosOrdenados = this.movimientosParaImpresion;

  const saldoActual = this.cliente?.saldo || 0;

  const ventana = window.open("", "_blank");

  ventana.document.write(`
    <html>
      <head>
        <title>Estado de Cuenta</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <style>
          body {
            padding: 40px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
          }

          h3 {
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 12px;
          }

          th {
            background: #f5f5f5;
            text-align: left;
          }

          .totales {
            margin-top: 20px;
            text-align: right;
            font-weight: bold;
            font-size: 14px;
          }

          .cargo { color: #dc3545; }
          .abono { color: #198754; }

          .membrete {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }

          .membrete img {
            height: 70px;
          }

          .membrete h3 {
            margin: 0;
          }
        </style>
      </head>
      <body>

        <div class="membrete">
        <img src="${window.location.origin}/logo.png" />
        <h3 font-weight:700;">Estado de Cuenta</h3>
        
      </div>

        <p>
          <strong>Paciente:</strong> ${this.cliente?.nombre || ""} 
          &nbsp;&nbsp; | &nbsp;&nbsp;
          <strong>Identificación:</strong> ${this.cliente?.dpi || "N/A"}
        </p>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
          ${movimientosOrdenados.map(m => `
            <tr>
              <td>${m.fecha?.toDate ? m.fecha.toDate().toLocaleDateString() : ""}</td>
              <td>${m.descripcion || ""}</td>
              <td class="${m.tipo === "cargo" ? "cargo" : "abono"}">
                ${m.tipo === "cargo" ? "Cargo" : "Abono"}
              </td>
              <td>Q ${m.monto?.toFixed(2) || "0.00"}</td>
              <td>Q ${Number(m.saldoCalculado || 0).toFixed(2)}</td>
            </tr>
          `).join("")}

          ${Array.from({ length: 22 }).map(() => `
            <tr>
              <td style="height: 28px;"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `).join("")}
        </tbody>
        </table>

        <div class="totales">
          
        </div>

      </body>
    </html>
  `);

  ventana.document.close();

  ventana.onload = function() {
    ventana.print();
    ventana.close();
  };
},


    async actualizarMovimiento() {
      const id = this.$route.params.id;
      const usuario = this.usuarioActual;

      if (!usuario) {
        this.showToast("Error: No hay usuario autenticado.");
        return;
      }

      if (!this.puedeEditarMovimiento) {
        this.showToast("No tiene permiso para editar movimientos.", "error");
        return;
      }

      if (!this.editandoMovimientoId) {
        this.showToast("No hay ningún movimiento seleccionado para editar.", "warning");
        return;
      }

      if (!this.puedeModificarMovimientoPorFecha(this.movimientoEditandoOriginal)) {
        this.showToast(this.mensajeLimiteMovimiento(), "warning");
        this.cancelarEdicionMovimiento();
        return;
      }

      if (!this.validarMontoMovimiento()) return;

      if (this.tipo === "abono" && !this.metodoPago) {
        this.showToast("Seleccione un método de pago para el abono.", "warning");
        return;
      }

      if (!this.doctorSeleccionado) {
        this.showToast("Seleccione el doctor que atendió al paciente.", "warning");
        return;
      }

      const movimientoRef = doc(db, `clientes/${id}/movimientos`, this.editandoMovimientoId);
      const monto = this.normalizarMontoMovimiento();
      const original = this.movimientoEditandoOriginal || {};

      await updateDoc(movimientoRef, {
        tipo: this.tipo,
        monto,
        descripcion: this.descripcion || "",
        metodoPago: this.tipo === "abono" ? this.metodoPago : null,
        doctor: {
          id: this.doctorSeleccionado.id,
          nombre: this.doctorSeleccionado.nombre,
          especialidad: this.doctorSeleccionado.especialidad,
          email: this.doctorSeleccionado.email
        },
        facturar: this.tipo === "abono" ? this.facturar : null,
        editado: true,
        fechaEdicion: new Date(),
        usuarioEdita: usuario.name,
        usuarioEditaId: usuario.uid
      });

      await this.recalcularSaldosMovimientos();

      await addDoc(collection(db, "auditoria_movimientos_cargo_abono"), {
        accion: "editar_movimiento",
        pacienteId: id,
        pacienteNombre: this.cliente?.nombre || "",
        movimientoId: this.editandoMovimientoId,
        usuario: usuario.name,
        usuarioId: usuario.uid,
        antes: {
          tipo: original.tipo || null,
          monto: Number(original.monto || 0),
          descripcion: original.descripcion || "",
          metodoPago: original.metodoPago || null,
          facturar: original.facturar ?? null,
          doctor: original.doctor || null
        },
        despues: {
          tipo: this.tipo,
          monto,
          descripcion: this.descripcion || "",
          metodoPago: this.tipo === "abono" ? this.metodoPago : null,
          facturar: this.tipo === "abono" ? this.facturar : null,
          doctor: {
            id: this.doctorSeleccionado.id,
            nombre: this.doctorSeleccionado.nombre,
            especialidad: this.doctorSeleccionado.especialidad,
            email: this.doctorSeleccionado.email
          }
        },
        timestamp: new Date()
      });

      this.limpiarFormularioMovimiento();
    },

    async confirmarEliminarMovimiento(movimiento) {
      const id = this.$route.params.id;
      const usuario = this.usuarioActual;

      if (!usuario) {
        this.showToast("Error: No hay usuario autenticado.");
        return;
      }

      if (!this.puedeEliminarMovimiento) {
        this.showToast("No tiene permiso para eliminar movimientos.", "error");
        return;
      }

      if (!this.puedeModificarMovimientoPorFecha(movimiento)) {
        this.showToast(this.mensajeLimiteMovimiento(), "warning");
        return;
      }

      const ok = await this.openConfirm({
        title: "Confirmar eliminación",
        lines: [
          `Paciente: ${this.cliente?.nombre || "Paciente"}`,
          `Tipo: ${(movimiento?.tipo || "").toUpperCase()}`,
          `Monto: Q ${Number(movimiento?.monto || 0).toFixed(2)}`,
          `Detalle: ${(movimiento?.descripcion || "").trim() || "Sin descripción"}`,
          "Esta acción eliminará el registro financiero seleccionado."
        ]
      });

      if (!ok) {
        this.showToast("Acción cancelada.", "warning");
        return;
      }

      try {
        await deleteDoc(doc(db, `clientes/${id}/movimientos`, movimiento.id));
        await this.recalcularSaldosMovimientos();

        await addDoc(collection(db, "auditoria_movimientos_cargo_abono"), {
          accion: "eliminar_movimiento",
          pacienteId: id,
          pacienteNombre: this.cliente?.nombre || "",
          movimientoId: movimiento.id,
          usuario: usuario.name,
          usuarioId: usuario.uid,
          movimiento: {
            tipo: movimiento.tipo || null,
            monto: Number(movimiento.monto || 0),
            descripcion: movimiento.descripcion || "",
            metodoPago: movimiento.metodoPago || null,
            facturar: movimiento.facturar ?? null,
            doctor: movimiento.doctor || null,
            fecha: movimiento.fecha || null
          },
          timestamp: new Date()
        });

        if (this.editandoMovimientoId === movimiento.id) {
          this.limpiarFormularioMovimiento();
        }

        this.showToast("Movimiento eliminado ✅", "success");
      } catch (error) {
        console.error(error);
        this.showToast("Error al eliminar el movimiento.", "error");
      }
    },

    async agregarMovimiento() {
      const id = this.$route.params.id;

      const usuario = this.usuarioActual;
      if (!usuario) {
        this.showToast("Error: No hay usuario autenticado.");
        return;
      }

      if (!this.validarMontoMovimiento()) return;

      const monto = this.normalizarMontoMovimiento();

      // Validación del método de pago SOLO si es abono
      if (this.tipo === "abono" && !this.metodoPago) {
        this.showToast("Seleccione un método de pago para el abono.", "warning");
        return;
      }
      if (this.tipo === "abono" && !this.doctorSeleccionado) {
        this.showToast("Seleccione el doctor que atendió al paciente.", "warning");
        return;
      }

      if (this.tipo === "cargo" && !this.doctorSeleccionado) {
        this.showToast("Seleccione el doctor que atendió al paciente.", "warning");
        return;
      }


      const clienteSnap = await getDoc(doc(db, "clientes", id));
      const saldoAntes = clienteSnap.exists() ? (clienteSnap.data().saldo || 0) : 0;

      const saldoDespues =
        this.tipo === "cargo"
          ? saldoAntes + monto
          : saldoAntes - monto;

      // Registrar movimiento
      await addDoc(collection(db, `clientes/${id}/movimientos`), {
        tipo: this.tipo,
        monto,
        descripcion: this.descripcion,
        metodoPago: this.tipo === "abono" ? this.metodoPago : null,

        doctor: {
          id: this.doctorSeleccionado.id,
          nombre: this.doctorSeleccionado.nombre,
          especialidad: this.doctorSeleccionado.especialidad,
          email: this.doctorSeleccionado.email
        },

        fecha: new Date(),
        usuario: usuario.name,
        usuarioId: usuario.uid,

        saldoAntes,        // opcional pero recomendado
        saldo: saldoDespues, // ✅ ESTE ES EL IMPORTANTE

        ...(this.tipo === "abono" && { facturar: this.facturar })
      });


      await this.recalcularSaldosMovimientos();

      // Auditoría
      await addDoc(collection(db, "auditoria_movimientos_cargo_abono"), {
        accion: "movimiento",
        pacienteId: id,
        pacienteNombre: this.cliente?.nombre || "",
        usuario: usuario.name,
        usuarioId: usuario.uid,
        tipo: this.tipo,
        monto,
        descripcion: this.descripcion,
        metodoPago: this.tipo === "abono" ? this.metodoPago : null,
        saldoAntes,
        saldoDespues,
        timestamp: new Date(),
         doctor:
           {
              id: this.doctorSeleccionado.id,
              nombre: this.doctorSeleccionado.nombre,
              especialidad: this.doctorSeleccionado.especialidad,
              email: this.doctorSeleccionado.email
            },

            ...(this.tipo === "abono" && { facturar: this.facturar })
      });

      // Limpiar campos
      this.limpiarFormularioMovimiento()
    },
    async guardarTrabajo() {
  if (!this.trabajo.tipo || !this.trabajo.monto) {
    this.showToast("Complete el tipo y monto del trabajo", "warning");
    return;
  }

  if (!this.doctorSeleccionado) {
    this.showToast("Seleccione el doctor que atendió el trabajo", "warning");
    return;
  }
  const id = this.$route.params.id;

  await addDoc(collection(db, `clientes/${id}/trabajos`), {
    ...this.trabajo,
    fecha: serverTimestamp(),
    doctor: {
      id: this.doctorSeleccionado?.id || null,
      nombre: this.doctorSeleccionado?.nombre || ""
    },
    usuario: this.usuarioActual?.name || "",
    deducibleReporte: true
  });

      // 🔍 AUDITORÍA DE TRABAJOS
    await addDoc(collection(db, "auditoria_trabajos"), {
      accion: "REGISTRAR_TRABAJO",
      pacienteId: id,
      pacienteNombre: this.cliente?.nombre || "",

      tipoTrabajo: this.trabajo.tipo,
      descripcion: this.trabajo.descripcion,
      monto: this.trabajo.monto,

      doctor: {
        id: this.doctorSeleccionado?.id || null,
        nombre: this.doctorSeleccionado?.nombre || ""
      },

      usuario: this.usuarioActual?.name || "",
      usuarioId: this.usuarioActual?.uid || "",
      timestamp: serverTimestamp()
    });


  this.trabajo = { tipo: "", descripcion: "", monto: 0 };

  this.showToast("Trabajo registrado correctamente 🧪", "success");
},

    async guardarTratamientoDental() {
  const id = this.$route.params.id;

  // 🦷 VALIDACIÓN: tratamientos por diente
for (const diente of this.form.dientes) {
  const tratamientos = this.obtenerTratamientosDiente(diente);

  if (!tratamientos.length) {
    this.showToast(`Ingrese al menos un tratamiento para el diente ${diente}`);
    return;
  }

  for (const item of tratamientos) {
    if (!item.tipo) {
      this.showToast(`Complete el tratamiento del diente ${diente}`);
      return;
    }

    if (this.tratamientoUsaMaterial(item.tipo) && !item.material) {
      this.showToast(`Seleccione material para ${item.tipo} en el diente ${diente}`);
      return;
    }

    if (item.precio == null || item.precio === "" || Number(item.precio) <= 0) {
      this.showToast(`Ingrese un precio válido para ${item.tipo} en el diente ${diente}`);
      return;
    }
  }
}

  // 🧩 VALIDACIÓN: tratamientos generales
for (const t of this.form.tratamientosGenerales) {
  if (!t.tipo) {
    this.showToast("Seleccione el tipo de tratamiento general");
    return;
  }

  if (t.desde === "" || t.desde == null || t.hasta === "" || t.hasta == null) {
    this.showToast(`Defina el rango del tratamiento general ${t.tipo}`);
    return;
  }

  if (this.tratamientoUsaMaterial(t.tipo) && !t.material) {
    this.showToast(`Seleccione material para el tratamiento general ${t.tipo}`);
    return;
  }

  if (t.precio == null || t.precio === "" || Number(t.precio) <= 0) {
    this.showToast(`Ingrese un precio válido para el tratamiento general ${t.tipo}`);
    return;
  }
}

  try {
    this.ignorarWatch = true;

    // 💾 GUARDADO PRINCIPAL
    await addDoc(collection(db, `clientes/${id}/tratamientos`), {
      dientes: [...this.form.dientes],
      tratamientos: this.normalizarTratamientos(this.form.tratamientos),
      // 👇 ESTO FALTABA
       estados: { ...this.form.estados },

      // 👇 NUEVO
      tratamientosGenerales: this.normalizarTratamientosGenerales(this.form.tratamientosGenerales),

      doctor: {
        id: this.doctorSeleccionado?.id || null,
        nombre: this.doctorSeleccionado?.nombre || "",
        especialidad: this.doctorSeleccionado?.especialidad || ""
      },

      fecha: serverTimestamp(),
      usuario: this.usuarioActual?.name || ""
    });

    // 🔍 AUDITORÍA
    await addDoc(collection(db, "auditoria_tratamientos"), {
      accion: "GUARDAR_TRATAMIENTO",
      pacienteId: id,
      pacienteNombre: this.cliente?.nombre || "",

      dientes: [...this.form.dientes],
      tratamientos: this.normalizarTratamientos(this.form.tratamientos),

      // 👇 TAMBIÉN AQUÍ
      tratamientosGenerales: this.normalizarTratamientosGenerales(this.form.tratamientosGenerales),

      doctor: {
        id: this.doctorSeleccionado?.id || null,
        nombre: this.doctorSeleccionado?.nombre || "",
        especialidad: this.doctorSeleccionado?.especialidad || ""
      },

      usuario: this.usuarioActual?.name || "",
      usuarioId: this.usuarioActual?.uid || "",
      timestamp: serverTimestamp()
    });

    this.hayCambios = false;
    this.hayCambiosModal = false;

    this.showToast("guardado correctamente 🦷", "success");

  } catch (error) {
    console.error(error);
    this.showToast("Error al guardar el tratamiento", "error");
  } finally {
    this.$nextTick(() => {
      this.ignorarWatch = false;
    });
  }
},
cancelarCambiosModal() {
  this.ignorarWatch = true;

  this.form.dientes = [...this.respaldoDientes];
  this.form.tratamientos = JSON.parse(
    JSON.stringify(this.respaldoTratamientos)
  );
  this.form.tratamientosGenerales = JSON.parse(
    JSON.stringify(this.respaldoTratamientosGenerales)
  );

  this.hayCambios = false;
  this.hayCambiosModal = false;

  this.$nextTick(() => {
    this.ignorarWatch = false;
  });
}

  },

watch: {
  metodoPago(nuevo) {
    if (nuevo === "Transferencia") {
      this.facturar = true;
    }
  },
  'form.dientes': {
  handler() {
    this.asegurarDienteActivo();
  },
  deep: true
},
}
};
</script>
