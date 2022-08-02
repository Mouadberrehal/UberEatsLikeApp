<template>
  <div class="vue-tempalte">
    <form action="url">
      <h3>Register</h3>

      <div class="form-group">
        <label>Name</label>
        <b-input v-model="name"/>
      </div>

      <div class="form-group">
        <label>Email</label>
        <b-input type="email" v-model="email"/>
      </div>

      <div class="form-group">
        <label>Password</label>
        <b-input type="password" v-model="password"/>
      </div>
      <div v-if="err">
        <p>impossible de cree le compte</p>
      </div>

      <router-link class="button" :to="{ path: '/login' }">Login</router-link>
      <b-button v-on:click="onLogin" type="submit">Register</b-button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../postcss.config";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      err: false,
    }
  },
  methods: {
    onLogin(event) {
      const params = new URLSearchParams();
      params.append('email', this.email);
      params.append('password', this.password);
      params.append('name', this.name);
      axios.post(`${config.uFoodApi.baseUrl}/signup`, params)
      .then((resp) => {
        window.location.href = "";
        localStorage.setItem("token", resp.data.token);
        localStorage.setItem("name", resp.data.name);
      }).catch((err) => {
        console.log("iic");
        this.err = true;
      });
    }
  }
}
</script>
