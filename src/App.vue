<template>
<v-app id="inspire" dark>

  <v-navigation-drawer
    disable-resize-watcher
    v-model="drawer"
    clipped
    fixed
    app>
    <v-list dense>
      <router-link to="/about">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link>
      <router-link to="/playlists">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>library_music</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Playlists</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <a :href="authURL">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>warning</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </a>
    </v-list>
  </v-navigation-drawer>

  <v-toolbar app fixed clipped-left>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>
    <router-link to="/">Tadi Tech</router-link>
    </v-toolbar-title>
  </v-toolbar>
  
  <v-content>
    <!-- <div class="fullscreen-video-wrap">
      <video src="./assets/ink.mp4" autoplay="true" loop="true" muted="true">
      </video>
    </div>
      <div class="video-overlay"></div> -->
      <v-container>
          <router-view></router-view>
      </v-container>
  </v-content>
</v-app>
</template>

<script>
import NewReleases from './views/NewReleases'
import Playlists from './views/Playlists'
import config from './config'

export default {
  name: 'App',
  components:{
    NewReleases,
    Playlists
  },
  data () {
    return {
      authURL: config.AUTH_URL,
      clipped: false,
      drawer: false,
      fixed: false,
      right: true,
      title: 'Vuetify.js'
    }
  },
};
</script>

<style scoped>
a{
  text-decoration: none;
  color:white;
}

.fullscreen-video-wrap{
  /* z-index: 0; */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100vh;
  overflow:hidden;
  background-color: antiquewhite;
}
.fullscreen-video-wrap video{
  /* z-index: 0; */
  min-height:100%;
  min-width:100%;
}
.video-overlay{
  height:100vh;
  position: fixed;
  top:0;
  left:0;
  width:100vw;
  z-index:1;
  background:#111;
  /* background: #1DB954; */
  opacity:0.85;
}
</style>
