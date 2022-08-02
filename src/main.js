import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
import Visit from "./components/ModalVisit.vue";
import "buefy/dist/buefy.css";
import StarRating from "vue-star-rating";
import Visited from "./components/Visited.vue";
import VisitedDate from "./components/VisitedDate.vue";
import GAuth from 'vue-google-oauth2'

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.component("Visit", Visit);
Vue.component("StarRating", StarRating);
Vue.component("Visited", Visited);
Vue.component("VisitedDate", VisitedDate);

const gauthOption = {
  clientId: '941286274305-8s211plg3f1hnscoqufagurc5sf0gm79.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
