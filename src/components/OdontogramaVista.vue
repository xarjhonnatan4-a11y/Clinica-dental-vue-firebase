<template>
  <div class="odontograma-container">
    <!-- Imagen + hotspots -->
    <div class="odontograma-wrapper">
      <img src="@/assets/odontograma.png" class="odontograma-img" />

      <svg class="odontograma-overlay" viewBox="0 0 192 300">
  <g v-for="d in dientes" :key="d.numero">
    
    <!-- Tooltip -->
    <title v-if="textoTooltip(d.numero)">
      {{ textoTooltip(d.numero) }}
    </title>

    <circle
      :cx="d.x"
      :cy="d.y"
      :r="d.r"
      class="hotspot"
      :style="{ fill: colorPorDiente(d.numero) }"
      @click="toggle(d.numero)"
    />

    <!-- Badge de cantidad -->
    <circle
      v-if="cantidadTratamientos(d.numero) > 1"
      :cx="d.x + d.r - 2"
      :cy="d.y - d.r + 2"
      r="5"
      class="badge-circle"
    />

    <text
      v-if="cantidadTratamientos(d.numero) > 1"
      :x="d.x + d.r - 2"
      :y="d.y - d.r + 3.2"
      class="badge-text"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ cantidadTratamientos(d.numero) }}
    </text>

  </g>
</svg>
    </div>

  </div>
</template>


<script>
export default {
  emits: ["update:seleccion", "diente-click", "eliminar-tratamiento"],
  props: {
     // 🔥 NUEVO
  catalogoTratamientos: {
    type: Array,
    default: () => []
  },
    seleccion: {
      type: Array,
      default: () => []
    },
    tratamientos: { // 👈 individuales
    type: Object,
    default: () => ({})
  },
  tratamientosGenerales: { // 👈 globales (brackets, etc)
    type: Array,
    default: () => []
  },
    soloVista: {
    type: Boolean,
    default: false
  }
  },
  data() {
    return {
      seleccionados: [],

      /** 
       * 🔥 Mapa de HOTSPOTS exactos para tu imagen 192x300 
       * Cada diente tiene:
       *  - número FDI
       *  - x,y = posición del hotspot
       *  - r = tamaño del círculo invisible
       */
      dientes: [
        // ----- SUPERIORES IZQUIERDA -----
        { numero: 18, x: 25, y: 138, r: 13 },
        { numero: 17, x: 31, y: 116, r: 13 },
        { numero: 16, x: 37, y: 93, r: 13 },
        { numero: 15, x: 43, y: 72, r: 10 },
        { numero: 14, x: 49, y: 55, r: 9 },
        { numero: 13, x: 55, y: 43, r: 8 },
        { numero: 12, x: 70, y: 31, r: 8 },
        { numero: 11, x: 85, y: 25, r: 8 },

        // ----- SUPERIORES DERECHA -----
        { numero: 21, x: 108, y: 25, r: 8 },
        { numero: 22, x: 123, y: 31, r: 8 },
        { numero: 23, x: 138, y: 43, r: 8 },
        { numero: 24, x: 146, y: 55, r: 9 },
        { numero: 25, x: 156, y: 72, r: 9 },
        { numero: 26, x: 160, y: 93, r: 13 },
        { numero: 27, x: 164, y: 116, r: 13 },
        { numero: 28, x: 168, y: 138, r: 13 },

        // ----- INFERIORES DERECHA -----
        { numero: 38, x: 167, y: 168, r: 13 },
        { numero: 37, x: 165, y: 192, r: 13 },
        { numero: 36, x: 160, y: 216, r: 13 },
        { numero: 35, x: 152, y: 238, r: 9 },
        { numero: 34, x: 142, y: 252, r: 9 },
        { numero: 33, x: 132, y: 264, r: 8 },
        { numero: 32, x: 118, y: 272, r: 8 },
        { numero: 31, x: 105, y: 275, r: 6 },

        // ----- INFERIORES IZQUIERDA -----
        { numero: 41, x: 89, y: 275, r: 6 },
        { numero: 42, x: 75, y: 272, r: 8 },
        { numero: 43, x: 65, y: 264, r: 8 },
        { numero: 44, x: 52, y: 252, r: 9 },
        { numero: 45, x: 42, y: 238, r: 9 },
        { numero: 46, x: 35, y: 216, r: 13 },
        { numero: 47, x: 30, y: 192, r: 13 },
        { numero: 48, x: 28, y: 168, r: 13 }
      ]
    };
  },
  mounted() {
    this.seleccionados = [...this.seleccion];
  },
  watch: {
  seleccion(newVal) {
    // Cuando el padre limpia los dientes, también limpiar el componente
    this.seleccionados = [...newVal];
  }
},

  methods: {

    textoTooltip(numero) {
  let lista = [];

  const valor = this.tratamientos[numero];

  let tratamientos = [];

  if (Array.isArray(valor)) {
    tratamientos = valor;
  } else if (valor) {
    tratamientos = [valor];
  }

  tratamientos.forEach(item => {
    if (typeof item === "string") {
      lista.push(`• ${item}`);
      return;
    }

    const tipo = item?.tipo || "";
    const material = item?.material ? ` / ${item.material}` : "";
    const precio =
      item?.precio !== null &&
      item?.precio !== "" &&
      !Number.isNaN(Number(item?.precio))
        ? ` — Q ${Number(item.precio).toFixed(2)}`
        : "";

    if (tipo) {
      lista.push(`• ${tipo}${material}${precio}`);
    }
  });

  for (let t of this.tratamientosGenerales) {
    if (
      t.desde !== "" &&
      t.hasta !== "" &&
      t.desde != null &&
      t.hasta != null &&
      this.estaEnRango(numero, t.desde, t.hasta)
    ) {
      const material = t.material ? ` / ${t.material}` : "";
const precio =
  t.precio !== null &&
  t.precio !== "" &&
  !Number.isNaN(Number(t.precio))
    ? ` — Q ${Number(t.precio).toFixed(2)}`
    : "";

lista.push(`• ${t.tipo}${material}${precio} (general)`);
    }
  }

  if (!lista.length) return "";

  return `Diente ${numero}\n${lista.join("\n")}`;
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

    toggle(numero) {
  this.$emit("diente-click", numero);

  if (this.soloVista) return;

  if (this.seleccionados.includes(numero)) {
    this.seleccionados = this.seleccionados.filter(n => n !== numero);

    if (this.tratamientos[numero]) {
      this.$emit("eliminar-tratamiento", numero);
    }
  } else {
    this.seleccionados.push(numero);
  }

  this.$emit("update:seleccion", this.seleccionados);
},


colorPorDiente(numero) {
  // 🔹 1. GENERALES
  for (let t of this.tratamientosGenerales) {
    if (t.desde !== "" && t.hasta !== "" && t.desde != null && t.hasta != null) {
      if (this.estaEnRango(numero, t.desde, t.hasta)) {
        const encontrado = this.catalogoTratamientos.find(
          ct => ct.nombre === t.tipo
        );

        if (encontrado) {
          return this.hexToRgba(encontrado.color, 0.35);
        }

        return "rgba(150,150,150,0.3)";
      }
    }
  }

  // 🔹 2. INDIVIDUALES
const valor = this.tratamientos[numero];

let tratamientos = [];
if (Array.isArray(valor)) {
  tratamientos = valor;
} else if (valor) {
  tratamientos = [valor];
}

if (tratamientos.length) {
  const ultimo = tratamientos[tratamientos.length - 1];
  const nombreTratamiento =
    typeof ultimo === "string" ? ultimo : ultimo?.tipo;

  const encontrado = this.catalogoTratamientos.find(
    ct => ct.nombre === nombreTratamiento
  );

    if (encontrado) {
      return this.hexToRgba(encontrado.color, 0.4);
    }

    return "rgba(200,200,200,0.3)";
  }

  // 🔹 3. SELECCIÓN
  if (this.seleccionados.includes(numero)) {
    return "rgba(0,150,255,0.25)";
  }

  return "transparent";
},


hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
  }
};

</script>

<style scoped>

.odontograma-wrapper {
  position: relative;
  width: 350px;   
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .odontograma-wrapper {
   width: 70vw;
    max-width: 350px;
}
}
@media print {
  .odontograma-wrapper {
    width: 350px !important;
  }
}

.odontograma-img {
  width: 100%;
  display: block;
}

/* Hotspots */
.odontograma-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hotspot {
  fill: transparent;
  cursor: pointer;
  transition: 0.2s;
}

.hotspot.selected {
  fill: rgba(0, 150, 255, 0.25);
  stroke: #0095ff;
  stroke-width: 2;
  filter: drop-shadow(0 0 4px #0095ff);
}

.badge-circle {
  fill: #dc3545;
  pointer-events: none;
}

.badge-text {
  fill: #ffffff;
  font-size: 5px;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}
</style>
