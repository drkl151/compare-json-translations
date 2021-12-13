<template>
  <div id="app">
    <MainTable />
  </div>
</template>

<script>
import MainTable from "@/containers/MainTable/MainTable";
export default {
  name: "App",
  components: {
    MainTable,
  },
};
</script>

<style lang="scss">
body {
  * {
    box-sizing: border-box;
  }

  min-width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  color: rgb(20, 20, 20);
  background-repeat: no-repeat;
  background: rgba(146, 93, 182, 0.726);
  background: linear-gradient(
    90deg,
    rgba(146, 93, 182, 0.726) 0%,
    rgba(199, 80, 80, 0.795) 50%,
    rgba(233, 230, 67, 0.788) 100%
  );
  background-attachment: fixed;
}
</style>