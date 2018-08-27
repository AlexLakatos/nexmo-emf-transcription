<template>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--4-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp" v-for="stage in stages" :key="stage.id">
      <div class="mdl-card__title mdl-card--expand">
        <h2 class="mdl-card__title-text">Stage {{ stage.name.toUpperCase() }}</h2>
      </div>
      <div class="mdl-card__actions mdl-card--border">
        <router-link class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" :to="{ name: 'stage', params: { id: stage.name, conversation: stage.id } }">Stage</router-link> |
        <router-link class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" :to="{ name: 'stenographer', params: { id: stage.name, conversation: stage.id } }">Stenographer</router-link>
      </div>
    </div>
  </div>
</template>

<style>
.mdl-card__title {
  background:
    url('../assets/logo.png') bottom right no-repeat #46B6AC;
}
</style>

<script>
// @ is an alias to /src
import Notifications from '@/components/Notifications.vue';

import axios from 'axios';

export default {
  name: 'home',
  components: {
    Notifications,
  },
  data() {
    return {
      stages: [],
      error: '',
    };
  },
  created() {
    axios
      .get('/data/stages.json')
      .then((response) => {
        // JSON responses are automatically parsed.
        this.stages = response.data;
      })
      .catch((e) => {
        this.error = e;
      });
  },
};
</script>
