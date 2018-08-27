<template>
    <div id="app" class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title"><img src="https://dashboard.nexmo.com/resources/img/nexmo-logo-w-vonage.svg" />EMF Camp Trancription App</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <router-link class="mdl-navigation__link" to="/">Home</router-link>
        </nav>
      </div>
    </header>
    <main class="mdl-layout__content">
      <div class="page-content">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.mdl-layout__header-row {
  padding: 0 40px;
}

.mdl-layout-title img {
  margin-top: -8px;
  margin-right: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
