<template>
  <div>
    <div class="button-bar">
      <div class="button-type-filter-container">
        <div class="dropdown">
          <div class="dropdown-trigger">
            <button
              class="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu3"
            >
              <span>Category ▼</span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a
                v-for="(type, index) in listGenre"
                :key="index"
                class="dropdown-item"
                v-on:click="foodTypeFilter(type)"
              >
                {{ type }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <input
        class="input is-primary"
        type="text"
        v-model="searchBar"
        placeholder="Search Resto"
      />
      <div class="button-price-filter-container">
        <button
          class="price-filter button is-outlined"
          v-on:click="filterByPriceUp"
        >
          ↑
        </button>
        <button
          class="price-filter button is-outlined"
          v-on:click="filterByPriceDown"
        >
          ↓
        </button>
        <button class="price-filter button is-danger" v-on:click="noFilter">
          No filter
        </button>
      </div>
    </div>
    <div class="container-resto">
      <div
        class="resto card is-clickable resto-other"
        v-for="resto in filteredListResto"
        :key="resto.name"
      >
        <button v-on:click="changeRoute(resto.id)">{{ resto.name }}</button>
        <div class="price-container">
          <div
            class="price"
            v-for="(pr, index) in resto.price"
            :key="index"
            :class="`price-${resto.price}`"
          >
            $
          </div>
          <Visit :idResto="resto.id"></Visit>
        </div>
      </div>
    </div>
    <button class="more-button button is-info" v-on:click="moreResto">
      More
    </button>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../postcss.config";
import "bulma/css/bulma.css";

class Resto {
  constructor({ name, price_range, genres, id }) {
    this.name = name;
    this.price = price_range; // one to three dollars
    this.type = genres;
    this.id = id;
  }

  get restoPrice() {
    return this.price;
  }

  set restoPrice(price) {
    this.price = price;
  }

  get restoId() {
    return this.id;
  }

  set restoId(id) {
    this.id = id;
  }

  get restoName() {
    return this.name;
  }

  set restoName(name) {
    this.name = name;
  }

  get restoType() {
    return this.type;
  }

  set restoType(type) {
    this.type = type;
  }
}

export default {
  name: "list-resto",
  data() {
    return {
      searchBar: "",
      nbRestoDisplay: 10,
      listResto: [],
      listRestoObj: [],
      listGenre: [],
    };
  },
  methods: {
    createListResto() {
      this.listResto.forEach((resto) => {
        if (this.listGenre.indexOf(...resto.genres) === -1) {
          this.listGenre.push(...resto.genres);
        }
        this.listRestoObj.push(new Resto(resto));
      });
      this.listRestoObj.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });
    },

    noFilter() {
      this.searchBar = "";
      this.listRestoObj = [];
      this.createListResto();
    },

    foodTypeFilter(type) {
      this.noFilter();
      let indexDelete = [];
      this.listRestoObj.forEach((resto, index) => {
        let count = false;
        resto.type.forEach((genre) => {
          if (genre.includes(type)) {
            count = true;
          }
        });
        if (!count) {
          indexDelete.push(index);
        }
      });
      indexDelete.forEach((i, index) => {
        this.listRestoObj.splice(i - index, 1);
      });
    },

    filterByPriceUp() {
      this.listRestoObj.sort((a, b) => a.price - b.price);
    },

    filterByPriceDown() {
      this.listRestoObj.sort((b, a) => a.price - b.price);
    },

    getRestaurant() {
      axios
        .get(
          config.uFoodApi.baseUrl +
            "/unsecure" +
            "/restaurants" +
            "?limit=" +
            `${this.nbRestoDisplay}`
        )
        .then((response) => {
          this.listResto = response.data.items;
          this.listRestoObj = [];
          this.createListResto();
        });
    },

    moreResto() {
      this.nbRestoDisplay += 10;
      this.getRestaurant();
    },

    changeRoute(id) {
      this.$router.push({ path: "/restaurant", query: { restaurantId: id } });
    },

    dropDownButton() {
      let dropdown = document.querySelector(".dropdown");
      dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("is-active");
      });
    },
  },

  computed: {
    filteredListResto() {
      return this.listRestoObj.filter((resto) => {
        return resto.name
          .toLowerCase()
          .startsWith(this.searchBar.toLowerCase());
      });
    },
  },

  mounted: function mounted() {
    this.getRestaurant();
    this.dropDownButton();
  },
};
</script>
<style>
.button-bar,
.button-type-filter-container,
.button-price-filter-container {
  display: flex;
  /* justify-content: center; */
  margin: 0em 0.5em 0em 0.5em;
}

.more-button {
  margin-left: 48%;
}

.resto {
  display: flex;
  margin: 0.5em 0em 0.5em 0em;
  justify-content: center;
}

.price-container {
  display: flex;
  margin-left: 0.5em;
}

.resto-fast-food {
  background-color: hsl(347, 90%, 96%) !important;
}

.resto-fast-food:hover {
  background-color: hsl(348, 100%, 61%) !important;
  transform: translateY(0.4em);
}

.resto-other {
  background-color: hsl(206, 70%, 96%) !important;
}

/* .resto-other:hover {
  background-color: hsl(204, 86%, 53%) !important;
  transform: translateY(4px);
} */

.resto-gastronomic {
  background-color: hsl(48, 100%, 96%) !important;
}

.resto-gastronomic:hover {
  background-color: hsl(48, 100%, 67%) !important;
  transform: translateY(4px);
}
</style>
