<template>
<div>
    <div v-if="loading">
      <h2>Loading data from Spotify <span v-if="limitHit"> API limit hit, loading can take longer</span></h2>
      <v-progress-linear :indeterminate="loading"></v-progress-linear>
    </div>
      <album-tiles-container :albums="albumsSorted">
      </album-tiles-container>
</div>
</template>

<script>
import AlbumTilesContainer from '../components/AlbumTilesContainer'
import loginCheck from '../mixins/loginCheck'
import axios from 'axios'

export default {
  name: 'NewReleases',
  components:{
    AlbumTilesContainer
  },
  mixins: [loginCheck],
  data(){
    return {
        token: null,
        artists:[],
        artistsCounterAlbum: 0,
        artistsCounterSingle: 0,
        simples:[],
        completes:[],
        albumsSorted: [],
        timeframeStart: '2018-08',
        loading: false,
        limitHit: false
    }
  },
  created(){
    const url = new URL(window.location.href)
    this.token = url.searchParams.get('access_token')

    if(this.token){
      this.$ls.set('token', this.token)
        this.getFollowedArtists()
    }
      

  },
  methods:{
    getFollowedArtists(href){
      this.loading = true
      const limit = 50
      const type = 'artist'
      const params = `?type=${type}&limit=${limit}`
      const url = href || `https://api.spotify.com/v1/me/following${params}`
      console.log(url)
      
      axios.get(url, this.reqHeader())
        .then(res =>{
          console.log(`fetched ${res.data.artists.items.length} out of ${res.data.artists.total} artists`)
          this.artists.push(...res.data.artists.items)
          if(res.data.artists.next) this.getFollowedArtists(res.data.artists.next)
          else this.getArtistsReleases()
        })
        .catch(err => {
          if(err.response.status === 429){
            setTimeout(() => this.getFollowedArtists(url),
            parseInt(err.response.headers['retry-after']) * 1010)
          } else if(err.response.status === 401){
            this.limitHit = true
            window.location.replace('https://taditech-backend.herokuapp.com/login')
          }
        })
    },

    getArtistsReleases(){
      this.simples = []
      this.artistsCounterAlbum = 0
      this.artistsCounterSingle = 0
      console.log(this.artists.length)
      this.artists.forEach((artist, index) => {
        this.fetchArtistsReleases(artist.id, 'album')
        this.fetchArtistsReleases(artist.id, 'single')
      })
    },

    fetchArtistsReleases(artistId, group, customLimit){
      if(group !== 'album' && group !== 'single'){
        console.log(`invalid group: ${group}`)
      }
      const limit = customLimit || 2;
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&include_groups=${group}`, this.reqHeader())
        .then(res =>{
          this.simples.push(...res.data.items)

          if(group === 'album'){
            this.artistsCounterAlbum++
            console.log(`${this.artists.length} artists | ${this.simples.length} album count | artistsCounterAlbum: ${this.artistsCounterAlbum}`)
          } else if(group === 'single'){
            this.artistsCounterSingle++
            console.log(`${this.artists.length} artists | ${this.simples.length} album count | artistsCounterSingle: ${this.artistsCounterSingle}`)
          }
        })
        .catch(err =>{
          if(err.response.status === 429){
            this.limitHit = true
            setTimeout(() => this.fetchArtistsReleases(artistId, group, limit),
            parseInt(err.response.headers['retry-after']) * 1010)
          }
        })
    },

    getFullAlbums(){
      let batch = []
      console.log(`rest is ${this.simples.length % 20}`)
      this.simples.forEach(simple => {
        if(batch.length >= 20){
          if(batch.length > 20 ) console.log('we have a problem')
            this.fetchFullAlbums(batch.toString())
            batch = []
        } 
        batch.push(simple.id)
        
      })
      if(batch.length > 0) {
        this.fetchFullAlbums(batch.toString())
      }
    },

    fetchFullAlbums(idsBatchString){
      axios.get(`https://api.spotify.com/v1/albums?ids=${idsBatchString}`, this.reqHeader())
        .then(res => {
          this.completes.push(...res.data.albums)
          console.log(`${this.completes.length} out of ${this.simples.length} albums loaded | artistsCounter: ${this.artistsCounterAlbum}`)
        })
        .catch(err =>{
          if(err.response.status === 429){
            this.limitHit = true
            setTimeout(() => this.fetchFullAlbums(idsBatchString),
            parseInt(err.response.headers['retry-after']) * 1010)
          }
        })
    },

    reqHeader(){
      return {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
    },
    uniqueAlbum(album){
      return this.albums.length === 0 || !this.albums.findIndex(existingAlbum => existingAlbum.id === album.id)
    },
    albumsToDisplay(){
      let albums = []
      this.albumsSorted.some(sortedAlbum =>{
        if(sortedAlbum.release_date > this.timeframeStart){
          albums.push(sortedAlbum)
        } else return true
      })
      console.log(albums.length)
      return albums
    },
  },
  watch: {
    completes: function(){
        if(this.completes < this.simples) return []
        this.limitHit = false
        this.loading = false
        let temp = []
        this.completes.forEach(album => {
          if(album.release_date > this.timeframeStart
              && temp.findIndex(existingAlbum => existingAlbum.id === album.id) === -1) temp.push(album)
        })
        temp.sort((a,b)=> b.release_date > a.release_date)
        this.albumsSorted = temp
        console.log(this.albumsSorted.length)
    },
    artistsCounterSingle: function() {
      if (this.artistsCounterSingle === this.artists.length && this.artistsCounterAlbum === this.artists.length){
        console.log('getting full albums now')
        this.getFullAlbums()
      }
    },
    artistsCounterAlbum: function() {
      if (this.artistsCounterSingle === this.artists.length && this.artistsCounterAlbum === this.artists.length){
        console.log('getting full albums now')
        this.getFullAlbums()
      }
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
