<template>
  <div>
    <h1>Selecciona una sucursal</h1>
    <button @click="seleccionar('sucursal1')">Sucursal 1</button>
    <button @click="seleccionar('sucursal2')">Sucursal 2</button>
  </div>
</template>

<script>
export default {
  methods: {
    seleccionar(sucursal) {
      localStorage.setItem("sucursal", sucursal); // ahora coincide con firebase.js
      this.$router.push("/login");
    }
  }
}
</script>
