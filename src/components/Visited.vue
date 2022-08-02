<template>
  <div>
    <div v-for="restaurant in restaurants" :key="restaurant.visite.id">
      <visited-date :restaurant="restaurant"></visited-date>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../postcss.config";
import VisitedDate from './VisitedDate.vue';

export default {
  components: { VisitedDate },
  data() {
    return {
      visites: null,
      restaurants: [],
    };
  },
  methods: {
    getNbVisites(restaurantId) {
      return axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/users" +
            `/${config.userId}` +
            "/restaurants" +
            `/${restaurantId}` +
            "/visits"
        )
        .then((response) => {
          return response.data.items.length;
        });
    },
    getRestaurant(restaurantId) {
      return axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/restaurants" +
            `/${restaurantId}`
        )
        .then((response) => {
          return response.data;
        });
    },
    getVisites() {
      axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/users" +
            `/${config.userId}` +
            "/restaurants/visits"
        )
        .then((response) => {
          this.visites = response.data.items;
          this.visites.forEach((element) => {
            this.getRestaurant(element.restaurant_id).then((restaurant) => {
              {
                this.restaurants.push({
                  visite: element,
                  restaurant: restaurant,
                });
              }
            });
          });
        });
    },
  },
  mounted: function mounted() {
    this.getVisites();
  },
};
</script>
