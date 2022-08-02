<template>
  <div>
    <div>
      <div v-if="showModal">
        <div class="modal is-active">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
              <input type="datetime-local" v-model="theDate" />
              <star-rating :increment="0.5" v-model="rate"></star-rating>
              <textarea v-model="message" placeholder="Add comment"></textarea>
              <button v-on:click="save">save</button>
            </div>
          </div>
          <button v-on:click="showModal = false" class="modal-close is-large" aria-label="close"></button>
        </div>
      </div>
    </div>
    <b-button v-on:click="showModal = true">Rate</b-button>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import axios from "axios";
import config from "../../postcss.config";

export default {
  data() {
    return {
      message: "",
      rate: 0,
      theDate: "",
      showModal: false,
    };
  },
  props: ["idResto"],
  methods: {
    save() {
      this.showModal = false;
      let data = {
        restaurant_id: this.idResto, // a recup
        comment: this.message,
        rating: this.rate,
        date: this.thedate,
      };
      axios.post(
        config.uFoodApi.baseUrl +
          "/unsecure" +
          "/users/" +
          "6234c6ea6959dc0004f3f106" + // id du user a recup autrement
          "/restaurants/visits",
        (data = data)
      );
    },
  },
};
</script>
