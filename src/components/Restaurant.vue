<head>
  <link href='https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css' rel='stylesheet' />
</head>
<template>
  <div class="container">
    <div class="columns is-multiline is-vcentered is-desktop">
      <div class="column is-half title-container">
        <div class="column">
          <div class="restaurant-title" id="restaurantTitle"></div>
          <div class="additional-informations" id="adress"></div>
          <div class="additional-informations" id="number"></div>
          <div class="additional-informations" id="typeOfFood"></div>
          <div class="additional-informations" id="price"></div>
          <Visit :idResto="this.$route.query.restaurantId"></Visit>
        </div>
      </div>

      <div class="column is-half">
        <template>
          <b-carousel>
            <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
              <section class="hero">
                <img :src="`${carousel.src}`" class="img-wrapper" />
              </section>
            </b-carousel-item>
          </b-carousel>
        </template>
      </div>
      <div class="column is-half">
        <div class="schedule columns is-start is-mobile title-container">
          <ul class="column is-narrow">
            <li>Monday:</li>
            <li>Tuesday:</li>
            <li>Wednesday:</li>
            <li>Thursday:</li>
            <li>Friday:</li>
            <li>Saturday:</li>
            <li>Sunday:</li>
          </ul>
          <ul class="column is-narrow">
            <li id="monday">12am - 3pm</li>
            <li id="tuesday">12am - 3pm</li>
            <li id="wednesday">12am - 3pm</li>
            <li id="thursday">12am - 3pm</li>
            <li id="friday">12am - 3pm</li>
            <li id="saturday">12am - 3pm</li>
            <li id="sunday">12am - 3pm</li>
          </ul>
        </div>
      </div>
      <div class="column is-half map">
        <div class="button-map">
          <button>Direction</button>
        </div>
        <div id="mapContainer" class="basemap"></div>
      </div>
    </div>
    <div class="favorite">
      <b-select placeholder="Select a list" v-model="selectAdd">
        <option v-for="item in favorites" :key="item.id">
          {{ item.id }}
        </option>
      </b-select>
      <b-button
        type="is-primary is-light"
        v-on:click="addRestaurantToFavList(restaurant.id)"
      >
        Add to favorite
      </b-button>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import config from "../../postcss.config";

export default {
  name: "BaseMap",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoidGFsc29yIiwiYSI6ImNremFkN2Y0ajE1cnMycG1taTh3NGh5MHMifQ.RPbSmvA-pDpTABYROCReQQ",
      carousels: [],
      restaurant: null,
      favorites: null,
      selectAdd: null,
    };
  },

  methods: {
    addRestaurantToFavList(event) {
      console.log(event);
      const restaurantId = event;
      let data = {
        id: event,
      };
      axios.post(
        config.uFoodApi.baseUrl +
          "/unsecure" +
          "/favorites" +
          "/" +
          this.selectAdd +
          "/restaurants",
        (data = data)
      );
    },
    getFavorites() {
      axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/users/" +
            config.userId +
            "/favorites"
        )
        .then((response) => {
          this.favorites = response.data.items;
          console.log("favs =", this.favorites);
        });
    },
    getPriceRange(priceRange) {
      let i = 0;
      let priceRangeStr = "$";
      while (i < priceRange) {
        priceRangeStr = priceRangeStr + "$";
        i++;
      }
      return priceRangeStr;
    },
    setInformations() {
      document.getElementById("restaurantTitle").innerHTML =
        this.restaurant.name;
      document.getElementById("adress").innerHTML =
        "Adress : " + this.restaurant.address;
      document.getElementById("number").innerHTML =
        "Number : " + this.restaurant.tel;
      document.getElementById("price").innerHTML =
        "Price : " + this.getPriceRange(this.restaurant.price_range);
      document.getElementById("typeOfFood").innerHTML =
        "Type of food : " + this.restaurant.genres[0];
    },

    setOpeningHours() {
      Object.keys(this.restaurant.opening_hours).forEach((key) => {
        document.getElementById(key).innerHTML =
          this.restaurant.opening_hours[key];
      });
    },

    setPictures() {
      this.restaurant.pictures.forEach((picture) => {
        this.carousels.push({ src: picture });
      });
    },

    getLocation() {
      return [
        this.restaurant.location.coordinates[0],
        this.restaurant.location.coordinates[1],
      ];
    },
  },

  mounted() {
    mapboxgl.accessToken = this.accessToken;

    // Fetching restaurant with restaurantId data if restaurantId is present
    axios
      .get(
        config.uFoodApi.baseUrl +
          "/unsecure" +
          "/restaurants" +
          `/${this.$route.query.restaurantId}`
      )
      .then((response) => {
        this.restaurant = response.data;

        this.setInformations();
        this.setOpeningHours();
        this.setPictures();
        this.getFavorites();
        const location = this.getLocation();

        const map = new mapboxgl.Map({
          container: "mapContainer",
          style: "mapbox://styles/mapbox/streets-v11",
          center: location,
          zoom: 8,
          position: "relative",
        });
        const marker = new mapboxgl.Marker().setLngLat(location).addTo(map);
      });
  },
};
</script>

<style>
.container {
  display: block;
}

.img-wrapper {
  object-fit: .contain;
  width: 100%;
  height: 45vh;
}

.upper-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imaged {
  display: flex;
  align-items: center;
  justify-content: center;
}

.restaurant-title {
  font-size: 50px;
  font-weight: bold;
  font-style: oblique;
  /* background-color: aqua; */
}

.lower-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.title-container {
  display: flex;
  justify-content: center;
  text-align: center;
}

.additional-informations {
  font-size: 18px;
}

#mapContainer {
  position: relative;
  display: block;
  background-color: rgb(0, 255, 76);
  justify-content: center;
  align-items: center;
  height: 330px;
}
.button-map {
  position: relative;
  left: 0;
  top: 0;
  margin: 4px;
}
.schedule {
  align-self: flex-start;
  font-size: 19px;
}

.horaires {
  font-size: 19px;
  /* margin-right: 100px; */
  margin-left: 20px;
}

.favorite {
  display: flex;
  align-items: center;
}
</style>
