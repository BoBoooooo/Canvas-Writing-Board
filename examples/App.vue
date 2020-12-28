<template>
  <div id="app">
    <CanvasWritingBoard></CanvasWritingBoard>
  </div>
</template>

<script>
export default {
  name: "app",

  methods: {
    clickEvent(event) {
      // eslint-disable-next-line no-console
      console.log(event);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
