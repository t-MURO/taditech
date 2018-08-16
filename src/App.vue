<template>
  <v-app id="inspire" dark>

    <v-navigation-drawer
      disable-resize-watcher
      v-model="drawer"
      clipped
      fixed
      app>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Tadi Tech</v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <div class="fullscreen-video-wrap">
        <video src="./assets/ink.mp4" autoplay="true" loop="true" muted="true">
        </video>
      </div>
        <div class="video-overlay"></div>
        <div class="main-content">
        <v-container>
            <router-view></router-view>
        </v-container>
      </div>
    </v-content>
</v-app>
</template>

<script>
import Home from './views/Home';

export default {
  name: 'App',
  components:{
    Home
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      right: true,
      title: 'Vuetify.js'
    };
  }
};
</script>

<style scoped>
.fullscreen-video-wrap{
  z-index: 0;
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100vh;
  overflow:hidden;
  background-color: antiquewhite;
}
.fullscreen-video-wrap video{
  z-index: 1;
  min-height:100%;
  min-width:100%;
}
.video-overlay{
  height:100vh;
  position: fixed;
  top:0;
  left:0;
  width:100vw;
  z-index:0;
  background:#111;
  opacity:0.85;
}
.main-content{
  z-index: 2;
}
</style>
