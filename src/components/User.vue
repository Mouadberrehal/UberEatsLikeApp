<template>
  <div class="columns">
    <div class="column is-12">
      <div class="title">User Profile</div>
      <div class="columns">
        <div class="column is-6">
          <p class="info-left" id="name">Name :</p>
          <p class="info-left" id="email">Email :</p>
          <p class="info-left" id="score">Score :</p>
        </div>
        <div class="column is-6">
          <div class="col-right">Restaurant visited :</div>
          <div
            class="visoted-restaurant"
            id="visited_restaurants"
            v-for="restaurant in restaurants"
            :key="restaurant.restaurant.id"
          >
            <li class="visited-restaurant">
              <b-select placeholder="Select a topic" v-model="selectAdd">
                <option v-for="item in favorites" :key="item.id">
                  {{ item.id }}
                </option>
              </b-select>
              <b-button
                type="is-primary is-light"
                v-on:click="addRestaurantToFavList(restaurant.restaurant.id)"
              >
                Add to a list of favorites
              </b-button>
            </li>
          </div>
          <Visited></Visited>
        </div>
      </div>
      <div>
        <div class="favorite">
          <b-input
            type="text"
            placeholder="Favorite list name"
            v-model="favNameAdd"
          />
          <b-button
            type="is-primary is-light"
            class="marginLeft"
            v-on:click="this.createFavorites"
          >
            Create new favorites list
          </b-button>
        </div>
        <div class="favorite">
          <b-select placeholder="Select a Favorite list" v-model="selectChange">
            <option v-for="item in favorites" :key="item.id">
              {{ item.id }}
            </option>
          </b-select>
          <b-input
            class="marginLeft"
            type="text"
            placeholder="change favorite name"
            v-model="favNameChange"
          />
          <b-button
            type="is-primary is-light"
            class="marginLeft"
            v-on:click="this.changeNameFavorites"
          >
            Change favorite name list
          </b-button>
        </div>
        <div class="favorite">
          <b-select placeholder="Select a topic" v-model="select">
            <option v-for="item in favorites" :key="item.id">
              {{ item.id }}
            </option>
          </b-select>
          <b-button
            type="is-primary is-light"
            class="marginLeft"
            v-on:click="this.deleteFavorites"
          >
            Delete favorites list
          </b-button>
        </div>
        <div v-for="item in favorites" :key="item.name">
          <li class="listFavoriteTitle">
            {{ item.name }}
            :
          </li>
          <div
            class="listFavorite"
            v-for="restaurant in item.restaurants"
            :key="restaurant.id"
          >
            <router-link
              :to="{
                path: '/restaurant',
                query: { restaurantId: restaurant.id },
              }"
            >
              {{ getRestaurantName(restaurant.id) }}</router-link
            >
            <b-button
              type="is-primary is-light"
              class="marginLeft"
              v-on:click="deleteRestaurantFromFavList(item.id, restaurant.id)"
            >
              Delete Restaurant from favorite list
            </b-button>
          </div>
        </div>
        <div class="favorite">
          <div class="column is-6">
            <h1 class="UsersTitle">Users UFood</h1>
            <b-input
              class="marginLeft"
              type="text"
              placeholder="Search Users"
              v-model="userName"
            />
            <b-button
              class="marginLeft"
              type="is-primary is-light"
              v-on:click="this.getUsers"
            >
              Search Users
            </b-button>
            <div v-for="item in listUsers" :key="item.name">
              <li class="listFavoriteTitle">
                {{ item.name }}
              </li>
              <b-button
                class="marginLeft"
                type="is-primary is-light"
                v-on:click="addUsersFollow(item.id)"
              >
                Follow Users
              </b-button>
            </div>
          </div>
          <div class="column is-6">
            <h1 class="UsersTitle">Users Followed</h1>
            <div v-for="item in listUsersFollowed" :key="item.name">
              <li class="listFavoriteTitle">
                {{ item.name }}
              </li>
              <b-button
                class="marginLeft"
                type="is-primary is-light"
                v-on:click="deleteUsersFollow(item.id)"
              >
                Unfollow Users
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../postcss.config";

export default {
  data() {
    return {
      user: null,
      visites: null,
      favorites: null,
      restaurants: [],
      favNameAdd: "",
      favNameChange: "",
      select: "",
      selectChange: "",
      selectAdd: "",
      listFavName: [],
      listUsers: [],
      listUsersFollowed: [],
      userName: "",
    };
  },
  methods: {
    setInformations() {
      document.getElementById("name").innerHTML = "Name : " + this.user.name;
      document.getElementById("email").innerHTML = "Email : " + this.user.email;
      document.getElementById("score").innerHTML =
        "Score : " + this.user.rating + " Points";
    },
    setVisites() {
      // document.getElementById("visited-restaurants").innerHTML +=
    },
    createFavorites(event) {
      let data = {
        name: this.favNameAdd,
        owner: this.user.email,
      };
      axios
        .post(
          config.uFoodApi.baseUrl + "/unsecure" + "/favorites",
          (data = data)
        )
        .then((response) => {
          this.getFavorites();
        });
    },
    deleteFavorites(event) {
      console.log("Select = " + this.select);

      axios
        .delete(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/favorites" +
            "/" +
            this.select
        )
        .then((response) => {
          this.getFavorites();
        });
    },
    getUsersFollowed(event) {
      const token = localStorage.getItem("token");
      const id = this.user.id;
      axios
        .get(config.uFoodApi.baseUrl + `/users/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          this.listUsersFollowed = response.data;
          console.log("followed = ", response);
        });
    },
    getUsers(event) {
      const token = localStorage.getItem("token");
      console.log("user = " + this.user);
      console.log("token  = " + token);

      const name = this.userName;
      axios
        .get(config.uFoodApi.baseUrl + `/users?q=${name}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          this.listUsers = response.data.items;
          console.log(response);
        });
    },
    addUsersFollow(id) {
      const token = localStorage.getItem("token");
      let data = {
        id: id.toString(),
      };
      axios
        .post(config.uFoodApi.baseUrl + `/follow`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          this.getUsersFollowed();
          console.log(response);
        });
    },
    deleteUsersFollow(id) {
      const token = localStorage.getItem("token");
      console.log("id  = " + id);

      axios
        .post(config.uFoodApi.baseUrl + `/unsecure/follow/${id}`)
        .then((response) => {
          this.getUsersFollowed();
          console.log(response);
        });
    },
    changeNameFavorites(event) {
      console.log(event);

      let data = {
        name: this.favNameChange,
        owner: this.user.email,
      };
      axios
        .put(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/favorites" +
            "/" +
            this.selectChange,
          (data = data)
        )
        .then((response) => {
          this.getFavorites();
        });
    },
    addRestaurantToFavList(event) {
      console.log("event =" + event);
      let data = {
        id: event,
      };
      axios
        .post(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/favorites" +
            "/" +
            this.selectAdd +
            "/restaurants",
          (data = data)
        )
        .then((response) => {
          this.getFavorites();
        });
    },
    deleteRestaurantFromFavList(favId, restaurantId) {
      console.log("favID" + favId);
      console.log("restpID" + restaurantId);
      axios
        .delete(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/favorites" +
            "/" +
            favId +
            "/restaurants" +
            "/" +
            restaurantId
        )
        .then((response) => {
          this.getFavorites();
        });
    },
    getUser() {
      axios
        .get(
          config.uFoodApi.baseUrl + "/unsecure" + "/users" + `/${config.userId}`
        )
        .then((response) => {
          this.user = response.data;
          this.setInformations();
          console.log("user", this.user);
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
          console.log("visites = ", this.visites);
          this.visites.forEach((element) => {
            this.getRestaurant(element.restaurant_id).then((restaurant) => {
              {
                this.getNbVisites(restaurant.id).then((len) => {
                  if (
                    this.restaurants.findIndex(
                      (elem) => elem.restaurant.id == restaurant.id
                    ) == -1
                  )
                    this.restaurants.push({
                      restaurant: restaurant,
                      nb_visites: len,
                    });
                });
              }
            });
          });
          console.log("restaurants visités = ", this.restaurants);
        });
    },
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
    getRestaurantName(restaurantId) {
      for (var i = 0; i < this.restaurants.length; i++) {
        if (this.restaurants[i].restaurant.id == restaurantId) {
          return this.restaurants[i].restaurant.name;
        }
      }
    },
    getSingleVisite() {
      // Pour afficher une visite en read only
      axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/users" +
            `/${config.userId}` +
            "/restaurants/visits" +
            "/visitID" // Visit ID à récupérer
        )
        .then((response) => {
          console.log("single visite", this.response.data);
        });
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
  },
  beforeMount() {
    this.getUser();
    this.getFavorites();
    this.getVisites();
    this.getUsersFollowed();
  },
};
</script>

<style>
.col-right {
  font-size: 1.5em;
  margin-bottom: 1em;
  margin-top: 1em;
  text-align: center;
}

.info-left {
  margin-top: 1em;
  font-size: 1.5em;
  margin-bottom: 1em;
  text-align: center;
}

.title {
  font-size: 2em;
  font-weight: bold;
  padding: 0.5em;
  text-decoration: underline;
  text-align: center;
  background-color: rgb(120, 218, 218);
}

.visited-restaurant {
  margin: 0.5em;
  font-size: 1.2em;
  padding-left: 1em;
  text-align: center;
}

.favorite {
  display: flex;
  align-items: center;
  padding: 1em;
}

.listFavorite {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  padding: 0.5em;
}

.marginLeft {
  margin-left: 2em;
}

.listFavoriteTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  text-decoration: underline;
  font-size: 20px;
  font-weight: bold;
}

.UsersTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
  text-decoration: underline;
  font-size: 30px;
  font-weight: bold;
}
</style>
