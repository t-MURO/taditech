<template>
<div>
  <div class="custom-grid">
    <h1>August 2018</h1>
      <album-tile v-for="(album, index) in albumsSorted" :key="Math.random(index)" :album="album">
      </album-tile>
  </div>
</div>
</template>

<script>
import AlbumTile from '../components/AlbumTile'
import axios from 'axios'

export default {
  name: 'Home',
  components:{
    AlbumTile
  },
  data(){
    return {
        token: null,
        artists:[],
        artistsCounterAlbum: 0,
        artistsCounterSingle: 0,
        simples:[],
        completes:[],
        albumsSorted: [],
        timeframeStart: '2018-06'
    }
  },
  created(){
    const url = new URL(window.location.href)
    this.token = url.searchParams.get('access_token')
        console.log('home component loaded')

    if(this.token){
      this.$ls.set('token', this.token)
        // this.getFollowedArtists()
    }
      

  },
  methods:{
    getFollowedArtists(href){
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
        .catch(err => console.log(err))
    },
    getArtistsReleases(){
      this.simples = []
      this.artistsCounterAlbum = 0
      this.artistsCounterSingle = 0
      console.log(this.artists.length)
      this.artists.forEach((artist, index) => {
        axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums?limit=3&include_groups=album`, this.reqHeader())
          .then(res =>{
            this.simples.push(...res.data.items)
            this.artistsCounterAlbum++
            console.log(`${index+1}/${this.artists.length} artists | ${this.simples.length} album count | artistsCounterAlbum: ${this.artistsCounterAlbum}`)
          })
          .catch(err => console.log(err))

        axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums?limit=3&include_groups=single`, this.reqHeader())
          .then(res =>{
            this.simples.push(...res.data.items)
            this.artistsCounterSingle++
            console.log(`${index+1}/${this.artists.length} artists | ${this.simples.length} album count | artistsCounterSingle: ${this.artistsCounterSingle}`)
          })
          .catch(err => console.log(err))
      })
    },
    getFullAlbums(){
      let batch = []
      console.log(`rest is ${this.simples.length % 20}`)
      this.simples.forEach(simple => {
        if(batch.length >= 20){
          if(batch.length > 20 ) console.log('we have a problem')
          axios.get(`https://api.spotify.com/v1/albums?ids=${batch.toString()}`, this.reqHeader())
            .then(res => {
              this.completes.push(...res.data.albums)
              console.log(`${this.completes.length} out of ${this.simples.length} albums loaded | artistsCounter: ${this.artistsCounterAlbum}`)
            })
            .catch(err => console.log(err))
            batch = []
        } 
        batch.push(simple.id)
        
      })
      if(batch.length > 0) {
        axios.get(`https://api.spotify.com/v1/albums?ids=${batch.toString()}`, this.reqHeader())
          .then(res => {
            this.completes.push(...res.data.albums)
            console.log(`${this.completes.length} out of ${this.simples.length} albums loaded`)
          })
          .catch(err => console.log(err))
      }
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
        const date = new Date('2018-07-01')
        this.albumsSorted.some(sortedAlbum =>{
            if(new Date(sortedAlbum.release_date) > date){
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
*{
  /* z-index: inherit; */
}
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
