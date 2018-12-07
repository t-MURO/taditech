<template>
<v-app id="inspire" dark>

  <v-navigation-drawer
    disable-resize-watcher
    v-model="drawer"
    clipped
    fixed
    app>
    <v-list dense>
        <v-list-tile v-for="link in links" :key="link.to" router :to="link.to">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      <a href="/login">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
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
import config from './config'

export default {
  name: 'App',
  data () {
    return {
      authURL: config.AUTH_URL,
      clipped: false,
      drawer: false,
      fixed: false,
      right: true,
      links: [
        {
          name: 'New Releases',
          icon: 'new_releases',
          to: 'new-releases'
        },
        {
          name: 'Playlists',
          icon: 'library_music',
          to: 'playlists'
        },
        // {
        //   name: 'Log Out',
        //   icon: 'power_settings_new',
        //   to: 'logout'
        // },

      ]
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
