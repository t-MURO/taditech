<template>
    <div>
        <img :src="playlist.images[0].url" alt="" @click="getTracks()">
        <span>{{playlist.name}} {{playlist.tracks.total}}</span>
        <ul v-if="showTracks">
            <li v-for="track in tracks" :key="track.id">{{track.track.name}}</li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Playlist',
    props:['playlist'],
    data(){
        return {
            tracks: [],
            showTracks: false,
            tracksAreLoaded: false,
            token: null
        }
    },
    created(){
        this.token = this.$ls.get('token')
    },
    methods:{
        getTracks(){
            if(!this.tracksAreLoaded) this.fetchTracks()
            this.showTracks = !this.showTracks
        },
        fetchTracks(href){
            const url = href || `https://api.spotify.com/v1/playlists/${this.playlist.id}/tracks`
            axios.get(url, {headers: {Authorization: 'Bearer ' + this.token}})
                .then(res => {
                    this.tracks.push(...res.data.items)
                    if(res.data.next) this.fetchTracks(res.data.next)
                    else this.tracksAreLoaded = true
                })
                .catch(err => console.log(err))

        },
    },
}
</script>