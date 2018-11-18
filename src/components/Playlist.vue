<template>
    <div class="playlist-container">
    <div class="playlist" @click="getTracks()">
        <img :src="playlist.images[0].url" alt="">
        <div class="metadata">
            <h1>{{playlist.name}}</h1>
            {{playlist.tracks.total}} songs
        </div>
    </div>
        <table v-if="showTracks">
            <thead>
                <th>Nr</th>
                <th>Name</th>
                <th>Artists</th>
                <th>Album</th>
                <th>Duration</th>
                <!-- <th>BPM</th> -->
                <th>Added</th>
            </thead>
            <tr v-for="(track, index) in tracks" :key="track.id" @click="openTrack(track.track.uri)">
                <td>{{ index + 1 }}</td>
                <td>{{track.track.name || 'test'}}</td>
                <td>{{displayArtists(track.track.artists) || 'test'}}</td>
                <td>{{track.track.album.name || 'test'}}</td>
                <td>{{millisToMinutesAndSeconds(track.track.duration_ms) || 'test'}}</td>
                <!-- <td>{{ track.track. }}</td> -->
                <td>{{track.added_at || 'test'}}</td>
            </tr>
        </table>
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
        }
    },
    methods:{
        getTracks(){
            if(!this.tracksAreLoaded) this.fetchTracks()
            this.showTracks = !this.showTracks
        },
        fetchTracks(href){
            const url = href || `https://api.spotify.com/v1/playlists/${this.playlist.id}/tracks`
            axios.get(url, this.$store.getters.header)
                .then(res => {
                    this.tracks.push(...res.data.items)
                    if(res.data.next) this.fetchTracks(res.data.next)
                    else this.tracksAreLoaded = true
                })
                .catch(err => this.handleError(err, () => this.fetchTracks(url)));
        },
        displayArtists(artists){
            const out = ''
            artists.forEach(artist => out.concat(artist.name+', '))
            return out.substring(0, out.length-2)
        },
        openTrack(uri){
            window.open(uri, '_parent')
        },
        millisToMinutesAndSeconds(millis) {
            let minutes = Math.floor(millis / 60000);
            let seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
    },
}
</script>

<style scoped>

.playlist-container{
    margin-bottom: 3em;
}

.playlist-container:hover{
    box-shadow: 0 0 30px rgba(255,255,255,0.25), 0 0 30px rgba(255,255,255,0.22);
}

.playlist{
    display: flex;
    width: 100%;
}

.playlist:hover{
    cursor: pointer;
}

.playlist img{
    object-fit: cover;
    height: 8em;
    width: 8em;
}

.playlist .metadata{
    margin-left: 1em;
}

table{
    width: 100%;
    padding: 1em;
}

td{
    padding: .5em;
    border-bottom: solid black 1px;
}

th:hover{
    cursor: pointer;
    background-color: rgba(255, 255, 255, .3);
}

tr:hover{
    cursor: pointer;
    background-color: rgba(255, 255, 255, .3);
}

</style>
