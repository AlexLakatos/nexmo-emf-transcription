<template>
  <div>
    <audio id="audio" src="">
      <source>
    </audio>
    <div v-if="loading">
      <h1 class="mdl-typography--display-1">Loading...</h1>
      <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
    </div>
    <div v-if="!loading">
      <div v-if="streaming" class="mdl-grid">
        <h1 class="mdl-typography--display-4">Audio stream is live</h1>
        <div class="mdl-cell mdl-cell--12-col">
          <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
        </div>
      </div>
      <div v-if="!streaming" class="mdl-grid">
        <h1 class="mdl-typography--display-4">Audio stream is not live</h1>
        <div class="mdl-cell mdl-cell--12-col">
          <div class="mdl-progress mdl-js-progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.mdl-typography--display-4,
.mdl-progress {
  width: 100%;
}
</style>

<script>
import axios from 'axios';
import ConversationClient from 'nexmo-stitch';

export default {
  name: 'stenographer',
  data() {
    return {
      conversation: undefined,
      streaming: false,
      loading: true,
    };
  },
  methods: {
    getConversation(app) {
      console.log('*** Logged into app', app);
      return app.getConversation(this.$route.params.conversation);
    },
    setConversation(conversation) {
      this.conversation = conversation;

      conversation.media.enable().then((stream) => {
        this.conversation.media.mute(true, true, false);
        const media = document.getElementById('audio');

        // Older browsers may not have srcObject
        if ('srcObject' in media) {
          media.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          media.src = window.URL.createObjectURL(stream);
        }
        media.onloadedmetadata = () => {
          media.play();
          this.loading = false;
          this.streaming = true;
        };
      });
    },
    loginAndGetConversation() {
      axios
        .get(`https://nexmo-emf-transcription.herokuapp.com/api/jwt/stenographer${
          this.$route.params.id
        }`)
        .then((response) => {
          // JSON responses are automatically parsed.
          new ConversationClient({ debug: false, rtcstats_enabled: false })
            .login(response.data.user_jwt)
            .then(this.getConversation)
            .then(this.setConversation);
        })
        .catch(console.error);
    },
  },
  mounted() {
    if (!this.$route.params.conversation) {
      axios
        .get('https://nexmo-emf-transcription.herokuapp.com/api/data/stages')
        .then((response) => {
          // JSON responses are automatically parsed.
          this.$route.params.conversation = response.data.filter((stage) => {
            if (stage.name === this.$route.params.id) return stage;
          })[0].id;
        })
        .then(this.loginAndGetConversation)
        .catch(console.error);
    } else {
      this.loginAndGetConversation();
    }
  },
};
</script>

