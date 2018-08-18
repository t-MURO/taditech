<template>
    <div>
        <div class="custom-grid">
        <h1>August 2018</h1>
            <album-tile v-for="(album, index) in albums" :key="Math.random(index)" :album="album">
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
    }
  },
  created(){
    let url = new URL(window.location.href);
    let token = url.searchParams.get('access_token');
    this.token = token;
    if(token){
        this.getFollowedArtists(token);
    }
      

  },
  methods:{
    getFollowedArtists(token){
        fetch('https://api.spotify.com/v1/me/following?type=artist', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(data => {
            this.artists = data;
            this.artists.artists.items.forEach(artist => this.getArtistsAlbums(artist.href, token))
        })
        .catch(err => console.log(err))
    },
    getArtistsAlbums(artistURI, token){
        fetch(`${artistURI}/albums`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(data => {
            data.items.forEach(album => this.albumsSimple.push(album));
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

  },
  watch: {
      albumsSimple: function(album) {

          if (this.albumsSimple.length >= 20){
              let temp = new Array(...this.albumsSimple.splice(0, 20));
              this.albumsSimple.splice(0, 20);
              let queryParams = '?ids='
              temp.forEach((album, index) => {
                  if (index > 19) return;
                  queryParams = queryParams + album.id + ','
                  });
              queryParams = queryParams.slice(0, -1);
              this.getAlbums(queryParams);
          }
      },
      albums: function(){
          let temp = new Array(...this.albums);
          temp.sort((a,b)=> new Date(b.release_date) - new Date(a.release_date));
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
