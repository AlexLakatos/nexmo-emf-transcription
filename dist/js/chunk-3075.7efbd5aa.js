(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3075"],{"087b":function(t,a,n){"use strict";n.r(a);var e=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",[t.loading?n("div",[n("h1",{staticClass:"mdl-typography--display-1"},[t._v("Loading...")]),n("div",{staticClass:"mdl-progress mdl-js-progress mdl-progress__indeterminate"})]):t._e(),t.showDialog?n("div",{staticClass:"mdl-dialog"},[n("h4",{staticClass:"mdl-dialog__title"},[t._v("Something is wrong with the media stream!")]),t._m(0),n("div",{staticClass:"mdl-dialog__actions"},[n("button",{staticClass:"mdl-button close",attrs:{type:"button"},on:{click:t.startStreaming}},[t._v("Restart")]),n("button",{staticClass:"mdl-button close",attrs:{type:"button"},on:{click:function(a){t.showDialog=!t.showDialog}}},[t._v("Ignore")])])]):t._e(),t.loading?t._e():n("div",{staticClass:"audio-controls"},[t._m(1),t.streaming?n("div",[n("h2",{staticClass:"mdl-typography--display-1"},[t._v("You're streaming live")]),t._m(2),n("button",{staticClass:"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored",on:{click:t.stopStreaming}},[n("i",{staticClass:"material-icons"},[t._v("stop")])])]):t._e(),t.streaming?t._e():n("div",[n("h2",{staticClass:"mdl-typography--display-1"},[t._v("You're not streaming")]),n("button",{staticClass:"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored",on:{click:t.startStreaming}},[n("i",{staticClass:"material-icons"},[t._v("play_arrow")])]),t._m(3)])])])},s=[function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"mdl-dialog__content"},[n("p",[t._v("\n        Please restart media stream.\n      ")])])},function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("audio",{attrs:{id:"audio",src:""}},[n("source")])},function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("button",{staticClass:"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored",attrs:{disabled:""}},[n("i",{staticClass:"material-icons"},[t._v("play_arrow")])])},function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("button",{staticClass:"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored",attrs:{disabled:""}},[n("i",{staticClass:"material-icons"},[t._v("stop")])])}],o=(n("7f7f"),n("cadf"),n("551c"),n("097d"),n("bc3a")),i=n.n(o),r=n("e578"),l={name:"stage",data:function(){return{conversation:void 0,streaming:!1,showDialog:!1,loading:!0}},created:function(){var t=this;this.$route.params.conversation?this.loginAndGetConversation():i.a.get("https://nexmo-emf-transcription.herokuapp.com/api/data/stages").then(function(a){t.$route.params.conversation=a.data.filter(function(a){if(a.name===t.$route.params.id)return a})[0].id}).then(this.loginAndGetConversation).catch(console.error)},methods:{getConversation:function(t){return console.log("*** Logged into app",t),t.getConversation(this.$route.params.conversation)},setConversation:function(t){this.conversation=t,this.loading=!1},loginAndGetConversation:function(){var t=this;i.a.get("https://nexmo-emf-transcription.herokuapp.com/api/jwt/stage".concat(this.$route.params.id)).then(function(a){new r({debug:!1}).login(a.data.user_jwt).then(t.getConversation).then(t.setConversation)}).catch(console.error)},startStreaming:function(){var t=this;this.showDialog=!1,this.conversation.media.enable().then(function(a){var n=document.getElementById("audio");"srcObject"in n?n.srcObject=a:n.src=window.URL.createObjectURL(a),n.onloadedmetadata=function(){n.play(),t.streaming=!0}})},stopStreaming:function(){this.conversation.media.disable();var t=document.getElementById("audio");t.pause(),this.streaming=!1}}},c=l,d=(n("3c02"),n("2877")),m=Object(d["a"])(c,e,s,!1,null,null,null);m.options.__file="Stage.vue";a["default"]=m.exports},"3c02":function(t,a,n){"use strict";var e=n("845f"),s=n.n(e);s.a},"845f":function(t,a,n){}}]);
//# sourceMappingURL=chunk-3075.7efbd5aa.js.map