import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    albums: []
  },
  mutations: {
    setToken(state, token){
      state.token = token;
    },
    setAlbums(state, albums){
      state.albums = albums;
    }
  },
  actions: {
    setToken(context, token){
      context.commit('setToken', token);
    },
    setAlbums(context, albums){
      albums.sort((a, b) => b.release_date > a.release_date);
      context.commit('setAlbums', albums);
    }
  },
  getters: {
    header: state => { headers: { Authorization: 'Bearer ' + state.token } },
    albums: state => state.albums
    // albums: state => [...state.albums].sort((a, b) => b.release_date > a.release_date)
  }
});
