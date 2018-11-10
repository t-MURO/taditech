<template>
<div>
    <h1>Playlists</h1>
    <playlist v-for="playlist in filteredPlaylists" :key="playlist.id" :playlist="playlist"></playlist>
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
        this.token = this.$ls.get('token')
        if(this.token) this.getPlaylists()
    },
    methods:{
        getPlaylists(href){
            const url = href || 'https://api.spotify.com/v1/me/playlists?limit=50'
            axios.get(url,  {headers: {Authorization: 'Bearer ' + this.token}})
                .then(res => {
                    this.playlists.push(...res.data.items)
                    console.log(`${this.playlists.length} playlists out of ${res.data.total} fetched`)
                    if(res.data.next) this.getPlaylists(res.data.next)
                })
                .catch(err => console.log(err))
        }
    },
    computed: {
        filteredPlaylists: function(){
            return this.playlists.filter(playlist => playlist.images.length > 0)
        }
    }
}
</script>

<style scoped>
h1{
    color: white;
}
</style>
