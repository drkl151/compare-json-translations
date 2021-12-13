<template>
  <div class="header">
    <div class="logo">
      <img class="logo__img" src="../../assets/logo.png" alt="logo" />
      <h1 class="logo__title">compare-json-translations</h1>
    </div>

    <div class="search-input">
      <input
        placeholder="Search"
        type="text"
        v-model="searchValue"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";
export default {
  props: {
    searchKeys: {
      type: String,
      default: "",
    },
  },

  computed: {
    searchValue: {
      get() {
        return this.searchKeys;
      },
      set: debounce(function (val) {
        this.$emit("search-input", val);
      }, 600),
    },
  },
};
</script>

<style lang="scss">
@import "Header.scss";
</style>