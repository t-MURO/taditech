import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    albums: [],
    user: null
  },
  mutations: {
    setToken(state, token){
      state.token = token;
    },
    setAlbums(state, albums){
      state.albums = albums;
    },
    setUser(state, user){
      state.user = user;
    }
  },
  actions: {
    setToken(context, token){
      axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: 'Bearer ' + token } })
        .then(res => context.commit('setUser', res.data));
      context.commit('setToken', token);
    },
    setAlbums(context, albums){
      const albumsWithoutDoubleEntries = [];
      
      albums.forEach(album => {
        if(!albumsWithoutDoubleEntries.some(item => album.id === item.id)) albumsWithoutDoubleEntries.push(album);
      });

      context.commit('setAlbums', albumsWithoutDoubleEntries);
    }
  },
  getters: {
    header: state =>{ return { headers: { Authorization: 'Bearer ' + state.token } }},
    albums: state => state.albums,
    token: state => state.token
  }
});
