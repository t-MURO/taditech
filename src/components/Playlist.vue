<template>
    <div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Playlist',
    props:{
        
    },
    data(){
        return {
            playlists: []
        }
    },
    created(){
        if(token) getPlaylsits()
    },
    methods:{
        getPlaylsits(href){
            let url = href || 'https://api.spotify.com/v1/me/playlists?limit=50'
            axios.get(url)
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