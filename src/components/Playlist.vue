<template>
    <div class="playlist-container">
        <v-btn @click="sort()" @contextmenu="sort(true)">sort locally</v-btn> 
        <v-btn @click="reorder()">reorder all</v-btn> 
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
                <th>BPM</th>
                <th>Key</th>
                <th>Added</th>
            </thead>
            <tr v-for="(track, index) in tracks" :key="track.id" @click="openTrack(track.track.uri)">
                <td>{{ index + 1 }}</td>
                <td>{{track.track.name || 'test'}}</td>
                <td>{{displayArtists(track.track.artists) || 'test'}}</td>
                <td>{{track.track.album.name || 'test'}}</td>
                <td>{{millisToMinutesAndSeconds(track.track.duration_ms) || 'test'}}</td>
                <td>{{ getBpm(track) }}</td>
                <td>{{ getKey(track) }}</td>
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
            tracksCopyForSorting: [],
            index: 0
        }
    },
    methods:{
        getTracks(){
            if(!this.tracksAreLoaded) this.fetchTracks();
            this.showTracks = !this.showTracks;
        },
        fetchTracks(href){
            const url = href || `https://api.spotify.com/v1/playlists/${this.playlist.id}/tracks`;
            axios.get(url, this.$store.getters.header)
                .then(res => {
                    this.tracks.push(...res.data.items);
                    this.fetchAudioFeatures(res.data.items);
                    if(res.data.next) this.fetchTracks(res.data.next);
                    else this.tracksAreLoaded = true;
                })
                .catch(err => this.handleError(err, () => this.fetchTracks(url)));
        },
        fetchAudioFeatures(tracks){
            const ids = [];
            tracks.forEach(track => ids.push(track.track.id));
            axios.get(`https://api.spotify.com/v1/audio-features/?ids=${ids.toString()}`, this.$store.getters.header)
                .then(res => {
                    res.data.audio_features.forEach( tracksAudioFeatures => {
                        const index = this.tracks.findIndex(track => track.track.id === tracksAudioFeatures.id);
                        this.tracks[index].features = tracksAudioFeatures;
                    });
                    this.$forceUpdate();
                })
                .catch(err => this.handleError(err, () => this.fetchAudioFeatures(tracks)))
        },
        displayArtists(artists){
            let out = '';
            artists.forEach(artist => out += artist.name+', ');
            return out.substring(0, out.length-2);
        },
        openTrack(uri){
            window.open(uri, '_parent')
        },
        millisToMinutesAndSeconds(millis) {
            let minutes = Math.floor(millis / 60000);
            let seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        },
        reorder(sortedTracks, pos){
            sortedTracks = sortedTracks || [...this.tracksCopyForSorting];
            pos = pos || 0;
            const originalIndex = this.tracks.findIndex(track => track === sortedTracks[pos]);
            if(pos >= this.tracks.length) return;
            if(pos === originalIndex) return this.reorder(sortedTracks, pos+1);
            axios.put(`https://api.spotify.com/v1/playlists/${this.playlist.id}/tracks`,
                {
                    range_start: originalIndex,
                    insert_before: pos,
                    snapshot_id: this.playlist.snapshot_id 
                },
                this.$store.getters.header)
                .then(res => {
                    console.log(`put song at index ${originalIndex} to index ${pos}`)
                    this.tracks.splice(pos, 0, this.tracks.splice(originalIndex, 1)[0]);
                    this.playlist.snapshot_id = res.data.snapshot_id;
                    if(pos < sortedTracks.length) this.reorder(sortedTracks, pos+1);
                })
                .catch(err => this.handleError(err, () => this.reorder(sortedTracks, pos)));
        },
        sort(bool){
            if(bool) this.tracksCopyForSorting.sort((a,b) => a.added_at < b.added_at ? -1 : 1);
            else this.tracksCopyForSorting.sort((a,b) => a.added_at > b.added_at ? -1 : 1);
            let test1 = '';
            let test2 = '';
            this.tracksCopyForSorting.forEach(track => test1 += track.track.name + ' | ')
            this.tracks.forEach(track => test2 += track.track.name + ' | ')
            console.log(test1)
            console.log(test2)
        },
        getBpm(track){
            return track.features ? Math.round(track.features.tempo) : '';
        },
        getKey(track){
            return track.features ? Math.round(track.features.key) : '';
        },
    },
    watch:{
        tracks: function() {
            this.tracksCopyForSorting = [...this.tracks];
        }
    }
}
</script>

<style scoped>

.playlist-container{
    margin-bottom: 1.75em;
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
