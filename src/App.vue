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
      <v-container>
          <router-view></router-view>
      </v-container>
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
