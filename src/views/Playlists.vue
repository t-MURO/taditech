<template>
<div>
    <h1>Playlists</h1>
    <playlist v-for="playlist in playlists" :key="playlist.id" :playlist="playlist"></playlist>
</div>    
</template>

<script>
import axios from 'axios'
import Playlist from '../components/Playlist'

export default {
    name: 'Playlists',
    data(){
        return {
            playlists: [],
            token: null
        }
    },
    components: {
        Playlist
    },
    created(){
        console.log('hi')
        this.token = this.$ls.get('token')
        if(this.token) this.getPlaylsits()
    },
    methods:{
        getPlaylsits(href){
            const url = href || 'https://api.spotify.com/v1/me/playlists?limit=50'
            axios.get(url,  {headers: {Authorization: 'Bearer ' + this.token}})
                .then(res => {
                    this.playlists.push(...res.data.items)
                    console.log(`${this.playlists.length} playlists out of ${res.data.total} fetched`)
                    if(res.data.next) this.getPlaylsits(res.data.next)
                })
                .catch(err => console.log(err))
        }
    }
}
</script>

<style scoped>
*{
  z-index: inherit;
}

h1{
color: white;
}
</style>
