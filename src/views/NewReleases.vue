<template>
<div>
    <div v-if="loading">
      <h2>Loading data from Spotify</h2>
      <v-progress-linear :indeterminate="loading"></v-progress-linear>
    </div>
      <album-tiles-container :albums="albums">
      </album-tiles-container>
</div>
</template>

<script>
import AlbumTilesContainer from '../components/AlbumTilesContainer';
// import errorHandling from '../mixins/errorHandling'
import axios from 'axios';
import config from '../config';

export default {
  name: 'NewReleases',
  components:{
    AlbumTilesContainer
  },
  // mixins: [errorHandling],
  data(){
    return {
        artists:[],
        artistsCounterAlbum: 0,
        artistsCounterSingle: 0,
        simples:[],
        completes:[],
        loading: false,
        limitHit: false,
        reqHeader: {}
    }
  },
  created(){
    this.reqHeader = this.$store.getters.header;
    this.getNewReleases();
  },
  methods:{
    getNewReleases(){
      if(this.$store.getters.albums.length <= 0) this.getFollowedArtists();
    },
    getFollowedArtists(href){
      this.loading = true;
      const limit = 50;
      const type = 'artist';
      const params = `?type=${type}&limit=${limit}`;
      const url = href || `https://api.spotify.com/v1/me/following${params}`;
      
      axios.get(url, this.reqHeader)
        .then(res =>{
          console.log(`fetched ${res.data.artists.items.length} out of ${res.data.artists.total} artists`);
          this.artists.push(...res.data.artists.items);
          if(res.data.artists.next) this.getFollowedArtists(res.data.artists.next);
          else this.getArtistsReleases();
        })
        .catch(err => this.handleError(err, () => this.getFollowedArtists(url)));
    },

    getArtistsReleases(){
      this.simples = [];
      this.artistsCounterAlbum = 0;
      this.artistsCounterSingle = 0;
      this.artists.forEach((artist, index) => {
        this.fetchArtistsReleases(artist.id, 'album');
        this.fetchArtistsReleases(artist.id, 'single');
      })
    },

    fetchArtistsReleases(artistId, group, customLimit){
      if(group !== 'album' && group !== 'single'){
        console.log(`invalid group: ${group}`);
      }
      const limit = customLimit || 2;
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&include_groups=${group}`, this.reqHeader)
        .then(res =>{
          this.simples.push(...res.data.items);

          if(group === 'album'){
            this.artistsCounterAlbum++;
            console.log(`${this.artists.length} artists | ${this.simples.length} album count | artistsCounterAlbum: ${this.artistsCounterAlbum}`);
          } else if(group === 'single'){
            this.artistsCounterSingle++
            console.log(`${this.artists.length} artists | ${this.simples.length} album count | artistsCounterSingle: ${this.artistsCounterSingle}`);
          }
        })
        .catch(err => this.handleError(err, () => this.fetchArtistsReleases(artistId, group, limit)));
    },

    getFullAlbums(){
      let batch = [];
      console.log(`rest is ${this.simples.length % 20}`);
      this.simples.forEach(simple => {
        if(batch.length >= 20){
          this.fetchFullAlbums(batch.toString());
          batch = [];
        } 
        batch.push(simple.id);
      })
      if(batch.length > 0) {
        this.fetchFullAlbums(batch.toString());
      }
    },

    fetchFullAlbums(idsBatchString){
      axios.get(`https://api.spotify.com/v1/albums?ids=${idsBatchString}`, this.reqHeader)
        .then(res => {
          this.completes.push(...res.data.albums);
          console.log(`${this.completes.length} out of ${this.simples.length} albums loaded | artistsCounter: ${this.artistsCounterAlbum}`);
        })
        .catch(err => this.handleError(err, () => this.fetchFullAlbums(idsBatchString)));
    },

  },
  watch: {
    completes: function(){
        if(this.completes < this.simples) return [];
        this.limitHit = false;
        this.loading = false;
        const temp = [...this.completes];
        this.$store.dispatch('setAlbums', temp);
    },
    artistsCounterSingle: function() {
      if (this.artistsCounterSingle === this.artists.length && this.artistsCounterAlbum === this.artists.length){
        console.log('getting full albums now');
        this.getFullAlbums();
      }
    },
    artistsCounterAlbum: function() {
      if (this.artistsCounterSingle === this.artists.length && this.artistsCounterAlbum === this.artists.length){
        console.log('getting full albums now');
        this.getFullAlbums();
      }
    }

  },
  computed: {
    albums: function(){
      return this.$store.getters.albums;
    }
  }
}
</script>

<style>
.custom-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, 175px);
  grid-gap: 1em;
  justify-content: space-around;
}

h1{
    font-weight: 300;
    grid-column: 1/-1;
}


@media screen and (max-width: 870px) {
    .custom-grid{
        grid-template-columns: repeat(auto-fill, 150px);
    }
}
@media screen and (max-width: 370px) {
    .custom-grid{
        grid-template-columns: repeat(auto-fill, 120px);
    }
}
</style>
