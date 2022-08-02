<template>
  <div class="vue-tempalte">
    <form action="url">
      <h3>Login</h3>

      <div class="form-group">
        <label>Email</label>
        <b-input type="email" v-model="email"/>
      </div>

      <div class="form-group">
        <label>Password</label>
        <b-input type="password" v-model="password"/>
      </div>
      <div v-if="err">
        <p>Aucun utilisateur avec cet email et ce mot de passe</p>
      </div>
      <b-button v-on:click="handleClickSignIn">google</b-button>
      <br/>
      <router-link class="button" :to="{ path: '/register' }">register</router-link>
      <b-button v-on:click="onLogin" type="submit">Sign In</b-button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../postcss.config";
export default {
  data() {
    return {
      email: "",
      password: "",
      err: false,
    }
  },
  methods: {
    login(email, password) {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      axios.post(`${config.uFoodApi.baseUrl}/login`, params)
      .then((resp) => {
        window.location.href = "";
        localStorage.setItem("token", resp.data.token);
        localStorage.setItem("name", resp.data.name);
        localStorage.setItem("id", resp.data.id);
      }).catch((err) => {
        console.log("iic");
        this.err = true;
      });
    },
    onLogin(event) {
      this.login(this.email, this.password);
    },

    async handleClickSignIn(){
      try {
        const googleUser = await this.$gAuth.signIn()
        console.log(googleUser);
        const params = new URLSearchParams();
        params.append('email', googleUser.getId());
        params.append('password', googleUser.getBasicProfile().tf);
        params.append('name', googleUser.getBasicProfile().tf);
        axios.post(`${config.uFoodApi.baseUrl}/signup`, params)
        .then((resp) => {
          window.location.href = "";
          localStorage.setItem("token", resp.data.token);
          localStorage.setItem("name", resp.data.name);
        }).catch((err) => {
          this.login(googleUser.getId(), googleUser.getBasicProfile().tf)
          console.log("iic");
          this.err = true;
        });
      } catch (error) {
        return null;
      }
    },

    async handleClickSignOut(){
      try {
        await this.$gAuth.signOut()
        this.isSignIn = this.$gAuth.isAuthorized
      } catch (error) {
      }
    }
  }
}
</script>
