<template>
  <div class="control has-icons-left has-icons-right search-bar">
    <input class="input" placeholder="Rechercher">
    <span class="icon is-left search-icon">
      <img src="../assets/search.svg" alt="">
    </span>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.search-bar {
  margin: auto;
}

.search-bar:hover > .search-icon {
  transform: rotate(360deg);
  transition: all 1s;
}

.search-icon {
  transition: all 0s;
}
</style>
