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
    <div v-if="!loading" class="audio-controls mdl-grid">
      <audio id="audio" src="">
        <source>
      </audio>
      <div v-if="callStats && streaming" class="mdl-cell mdl-cell--8-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp">
         <div class="'mdl-card__title mdl-card--expand">
          <h2 class="mdl-card__title-text">Audio Quality: {{ mos }}</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-grid">
          <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone">
            <table v-if="callStats.outbound_rtp_audio_0" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
              <thead>
                <tr>
                  <th></th>
                  <th>Sent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in Object.keys(callStats.outbound_rtp_audio_0)" :key="key">
                  <td>{{key}}</td>
                  <td>{{callStats.outbound_rtp_audio_0[key]}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone">
            <table v-if="callStats.outbound_rtcp_audio_0" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
              <thead>
                <tr>
                  <th></th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in Object.keys(callStats.outbound_rtcp_audio_0)" :key="key">
                  <td>{{key}}</td>
                  <td>{{callStats.outbound_rtcp_audio_0[key]}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="streaming" class="mdl-cell mdl-cell--4-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp streaming">
        <div class="mdl-grid">
          <h2 class="mdl-cell mdl-cell--12-col mdl-typography--display-1">You're streaming live</h2>
        <div class="mdl-cell mdl-cell--6-col">
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" disabled>
            <i class="material-icons">play_arrow</i>
          </button>
        </div>
        <div class="mdl-cell mdl-cell--6-col">
          <button v-on:click="stopStreaming" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
            <i class="material-icons">stop</i>
          </button>
        </div>
        </div>
      </div>
      <div v-if="!streaming" class="not-streaming mdl-cell mdl-cell--12-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp">
        <div class="mdl-grid">
          <h2 class="mdl-typography--display-1 mdl-cell mdl-cell--12-col">You're not streaming</h2>
          <div class="mdl-cell mdl-cell--6-col">
            <button v-on:click="startStreaming" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
              <i class="material-icons">play_arrow</i>
            </button>
          </div>
          <div class="mdl-cell mdl-cell--6-col">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" disabled>
              <i class="material-icons">stop</i>
            </button>
          </div>
        </div>
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
  transform: scale(4);
  margin: 100px;
}

.audio-controls .streaming button {
  transform: scale(2.5);
  margin: 40px auto;
}

.audio-controls .not-streaming .mdl-grid,
.audio-controls .streaming .mdl-grid {
  margin-left: 0;
  margin-right: 0;
}
</style>


<script>
import axios from 'axios';
import ConversationClient from 'nexmo-stitch';

export default {
  name: 'stage',
  data() {
    return {
      conversation: undefined,
      streaming: false,
      showDialog: false,
      loading: true,
      mos: undefined,
      callStats: undefined,
    };
  },
  created() {
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
  methods: {
    getConversation(app) {
      console.log('*** Logged into app', app);

      app.on('rtcstats:report', (mos, report) => {
        this.mos = mos;
        if (mos === 0) {
          this.showDialog = true;
        }
        this.callStats = report;
      });

      return app.getConversation(this.$route.params.conversation);
    },
    setConversation(conversation) {
      this.conversation = conversation;
      this.loading = false;
    },
    loginAndGetConversation() {
      axios
        .get(`https://nexmo-emf-transcription.herokuapp.com/api/jwt/stage${
          this.$route.params.id
        }`)
        .then((response) => {
          // JSON responses are automatically parsed.
          const rtc = new ConversationClient({
            debug: false,
            rtcstats: {
              emit_events: true,
            },
          })
            .login(response.data.user_jwt)
            .then(this.getConversation)
            .then(this.setConversation);
          rtc.on('disconnect', () => {
            console.log('disconnect');
          });
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
