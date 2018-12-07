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
        this.getPlaylists();
    },
    methods:{
        getPlaylists(href){
            const url = href || 'https://api.spotify.com/v1/me/playlists?limit=50'
            axios.get(url, this.$store.getters.header)
                .then(res => {
                    this.playlists.push(...res.data.items)
                    console.log(`${this.playlists.length} playlists out of ${res.data.total} fetched`)
                    if(res.data.next) this.getPlaylists(res.data.next)
                })
                .catch(err => this.handleError(err, () => this.getPlaylists(url)));
        }
    },
    computed: {
        filteredPlaylists: function(){
            return this.playlists.filter(playlist => playlist.owner.id === this.$store.getters.user.id && playlist.images.length > 0)
        }
    }
}
</script>

<style>
h1{
    margin-bottom: 1em;
}
</style>
