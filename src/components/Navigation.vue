<template>
  <b-navbar class="bar">
    <template #start>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">Home</b-navbar-item>
        <search-bar></search-bar>
    </template>
    <template #end>
      <div class="navbar-end" v-if="isConnected==true">
        <b-navbar-item tag="router-link" :to="{ path: '/user' }">
          {{name}}
        </b-navbar-item>
        <button class="button navbar-button" v-on:click="disconnect()">Disconnect</button>
      </div>
      <div class="navbar-end" v-else>
        <router-link class="button navbar-button is-primary" :to="{ path: '/login' }">Connect</router-link>
      </div>
    </template>
  </b-navbar>
</template>


<script>
import SearchBar from './SearchBar.vue';
import config from "../../postcss.config";
export default {
  components: { SearchBar },
  data() {
    return {
      name: localStorage.getItem("name"),
      isConnected: localStorage.getItem("token") !== "",
    }
  },
  methods: {
    disconnect() {
      this.isConnected=false;
      localStorage.setItem("token", "");
    }
  }
}

</script>


<style>
.navbar-end .navbar-button {
  margin: auto;
}
.bar {
  position: sticky !important;
  top: 0;
}
</style>
