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
