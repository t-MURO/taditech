<template>
    <div>
    <h1>Playlists</h1>
    fdsafsdfsdafsdfsd
    </div>    
</template>

<script>
import axios from 'axios'

export default {
    name: 'Playlists',
    data(){
        return {
            playlists: []
        }
    },
    created(){
        console.log('hi')
        // if(token) getPlaylsits()
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

<style scoped>
h1{
    z-index: 33;
}
</style>
