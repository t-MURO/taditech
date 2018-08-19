<template>
    <div>
        <div class="custom-grid">
            <v-btn color="info" @click="albumsToDisplay()">Test</v-btn>
            <v-btn color="info" @click="debugging()">Debug</v-btn>
            <h1>August 2018</h1>
            <album-tile v-for="(album, index) in albumsToDisplay()" :key="Math.random(index)" :album="album">
            </album-tile>
        </div>
    </div>
</template>

<script>
import AlbumTile from '../components/AlbumTile';

export default {
  name: 'Home',
  components:{
    AlbumTile
  },
  data(){
    return {
        token: null,
        artists: [],
        SPOTIFY_URL: '',
        albumsSimple: [],
        albums: [],
        albumsSorted: [],
        albumCounter: 0,
        artistsLoaded: false,
        simpleAlbumsLoaded: false,
    }
  },
  created(){
    let url = new URL(window.location.href);
    let token = url.searchParams.get('access_token');
    this.token = token;
    if(token){
        this.getFollowedArtists();
    }
      

  },
  methods:{
    getFollowedArtists(url){
        if(!url) url = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';
        fetch(url, {
            headers: {
                Authorization: 'Bearer ' + this.token
            }
        })
        .then(res => res.json())
        .then(data => {
            this.artists.push(...data.artists.items);
            console.log(`itearation has ${data.artists.items.length} artists and artists array is: ${this.artists.length}`);
            // this.artists.forEach(artist => this.getArtistsAlbums(artist.href))
            if(data.artists.next){
                this.getFollowedArtists(data.artists.next);
                console.log('req sent');
            } else {
                this.artistsLoaded = true;    
            }
            
        })
        .catch(err => console.log(err))
    },
    getArtistsAlbums(artistURI){
        fetch(`${artistURI}/albums?limit=5&include_groups=album,single`, {
            headers: {
                Authorization: 'Bearer ' + this.token
            }
        })
        .then(res => res.json())
        .then(data => {
            this.albumCounter += data.items.length;
            this.albumsSimple.push(...data.items);
        })
    },
    getAlbums(queryParams){
        fetch(`https://api.spotify.com/v1/albums${queryParams}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.albums) this.albums.push(...data.albums)
        })
        .catch(err => console.log(err))
    },
    uniqueAlbum(album){
        return this.albums.length === 0 || !this.albums.findIndex(existingAlbum => existingAlbum.id === album.id);
    },
    albumsToDisplay(){
        let albums = [];
        const date = new Date('2018-07-01');
        this.albumsSorted.some(sortedAlbum =>{
            if(new Date(sortedAlbum.release_date) > date){
                albums.push(sortedAlbum);
            } else return true;
        });
        console.log(albums.length);
        return albums;
    },
    debugging(){
        console.log(`albumsSimple: ${this.albumsSimple.length}`);
        console.log(`albums: ${this.albums.length}`);
        console.log(`albumsSorted: ${this.albumsSorted.length}`);
        console.log(`albumCounter: ${this.albumCounter}`);
    }
  },
  watch: {
        artistsLoaded: function() {
            console.log(`arists: ${artists.length}`);
            let counter = 0;
            this.artists.forEach(artist => {
                this.getArtistsAlbums(artist.href)
                counter++;
            });
            console.log(coutner + ' loading fertig');
        },
        albums: function(){
          let temp = new Array(...this.albums);
          temp.sort((a,b)=> new Date(b.release_date) - new Date(a.release_date));
          temp.forEach(album => {
              if (!this.albumsSorted.includes(album)) this.albumsSorted.push(album)
          })
          this.albumsSorted = temp;
      },

  }
};
</script>

<style>
*{
  z-index: inherit;
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
