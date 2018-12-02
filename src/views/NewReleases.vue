<template>
<div>
    <div v-if="loading">
      <h2>Loading data from Spotify</h2>
      <v-progress-linear :value="loadingProgress"></v-progress-linear>
    </div>
      <album-tiles-container :albums="albums">
      </album-tiles-container>
</div>
</template>

<script>
import AlbumTilesContainer from '../components/AlbumTilesContainer';
import axios from 'axios';
import config from '../config';

export default {
  name: 'NewReleases',
  components:{
    AlbumTilesContainer
  },
  data(){
    return {
        artists:[],
        artistsCounterAlbum: 0,
        artistsCounterSingle: 0,
        fetchedAblums:[],
        loading: false,
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
      const url = href || `${config.FOLLOWED_ARTISTS_URL}${params}`;
      
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
      this.fetchedAblums = [];
      this.artistsCounterAlbum = 0;
      this.artistsCounterSingle = 0;
      this.artists.forEach((artist, index) => {
        this.fetchArtistsReleases(artist.id, 'album');
        this.fetchArtistsReleases(artist.id, 'single');
      })
    },

    fetchArtistsReleases(artistId, group, customLimit){
      const limit = customLimit || 2;
      axios.get(`${config.ARTISTS_URL}${artistId}/albums?limit=${limit}&include_groups=${group}`, this.reqHeader)
        .then(res =>{
          this.fetchedAblums.push(...res.data.items);

          if(group === 'album'){
            this.artistsCounterAlbum++;
            console.log(`${this.artists.length} artists | ${this.fetchedAblums.length} album count | artistsCounterAlbum: ${this.artistsCounterAlbum}`);
          } else if(group === 'single'){
            this.artistsCounterSingle++
            console.log(`${this.artists.length} artists | ${this.fetchedAblums.length} album count | artistsCounterSingle: ${this.artistsCounterSingle}`);
          }
        })
        .catch(err => this.handleError(err, () => this.fetchArtistsReleases(artistId, group, limit)));
    },
    checkIfFetchingCompleteAndSetAlbums(){
      if (this.artistsCounterSingle === this.artists.length && this.artistsCounterAlbum === this.artists.length){
        this.loading = false;
        this.$store.dispatch('setAlbums', this.fetchedAblums);
      }
    }
  },
  watch: {
    // fetchedAblums: function(){
    //   this.$store.dispatch('setAlbums', this.fetchedAblums);
    // },
    artistsCounterSingle: function() {
      this.checkIfFetchingCompleteAndSetAlbums();
    },
    artistsCounterAlbum: function() {
      this.checkIfFetchingCompleteAndSetAlbums();
    }

  },
  computed: {
    albums: function(){
      return this.$store.getters.albums;
    },
    loadingProgress: function(){
      return (this.artistsCounterSingle + this.artistsCounterAlbum) / ((this.artists.length || 1) * 2) * 100; // or operator fixes initial full loading bar
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
