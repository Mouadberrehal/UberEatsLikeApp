<template>
  <div>
    <div v-if="showModal">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <div>{{ restaurant.visite.date }}</div>
            <div>{{ restaurant.visite.rating }}</div>
            <div>{{ restaurant.visite.comment }}</div>
          </div>
        </div>
        <button v-on:click="showModal = false" class="modal-close is-large" aria-label="close"></button>
      </div>
    </div>
    <li class="visited-restaurant">
      <router-link
        :to="{
          path: '/restaurant',
          query: { restaurantId: restaurant.restaurant.id },
        }"
      >
        {{ restaurant.restaurant.name }} visits
      </router-link>
      <b-button v-on:click="showModal = true">
        View rate
      </b-button>
    </li>
  </div>
</template>
<script>
export default {
  props: ["restaurant"],
  data() {
    return {
      showModal: false,
    };
  },
}
</script>
