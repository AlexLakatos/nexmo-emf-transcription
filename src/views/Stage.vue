<template>
  <div>
    <div v-if="loading">
      <h1 class="mdl-typography--display-1">Loading...</h1>
      <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
    </div>
    <div v-if="showDialog" class="mdl-dialog">
      <h4 class="mdl-dialog__title">Something is wrong with the media stream!</h4>
      <div class="mdl-dialog__content">
        <p>
          Please restart media stream.
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button v-on:click="startStreaming" type="button" class="mdl-button close">Restart</button>
        <button v-on:click="showDialog = !showDialog" type="button" class="mdl-button close">Ignore</button>
      </div>
    </div>
    <div v-if="!loading" class="audio-controls">
      <audio id="audio" src="">
        <source>
      </audio>
      <div v-if="streaming">
        <h2 class="mdl-typography--display-1">You're streaming live</h2>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" disabled>
          <i class="material-icons">play_arrow</i>
        </button>
        <button v-on:click="stopStreaming" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i class="material-icons">stop</i>
        </button>
      </div>
      <div v-if="!streaming">
        <h2 class="mdl-typography--display-1">You're not streaming</h2>
        <button v-on:click="startStreaming" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
        <i class="material-icons">play_arrow</i>
        </button>

        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" disabled>
          <i class="material-icons">stop</i>
        </button>
      </div>

    </div>
  </div>
</template>

<style>
.mdl-dialog {
  width: 100%;
}

.mdl-progress {
  width: 100%;
}

.audio-controls button {
  margin: 150px;
  transform: scale(4);
}
</style>


<script>
import axios from 'axios';
import * as ConversationClient from 'nexmo-stitch';

export default {
  name: 'stage',
  data() {
    return {
      conversation: undefined,
      streaming: false,
      showDialog: false,
      loading: true,
    };
  },
  created() {
    if (!this.$route.params.conversation) {
      axios
        .get('data/stages.json')
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
  methods: {
    getConversation(app) {
      console.log('*** Logged into app', app);
      return app.getConversation(this.$route.params.conversation);
    },
    setConversation(conversation) {
      this.conversation = conversation;
      this.loading = false;
    },
    loginAndGetConversation() {
      axios
        .get(`https://nexmo-in-app-demo.herokuapp.com/api/jwt/stage${
          this.$route.params.id
        }`)
        .then((response) => {
          // JSON responses are automatically parsed.
          new ConversationClient({ debug: false })
            .login(response.data.user_jwt)
            .then(this.getConversation)
            .then(this.setConversation);
        })
        .catch(console.error);
    },
    startStreaming() {
      this.showDialog = false;
      this.conversation.media.enable().then((stream) => {
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
          this.streaming = true;
        };
      });
    },
    stopStreaming() {
      this.conversation.media.disable();
      const media = document.getElementById('audio');
      media.pause();
      this.streaming = false;
    },
  },
};
</script>
