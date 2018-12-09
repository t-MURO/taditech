<template>
<v-card class="playlist-container elevation-10">
    <v-card-title>
        <img @click="expand()" class="cover-img" :src="playlist.images[0].url" :alt="playlist.name">
        <div @click="expand()" class="title-container">
            <h1>{{ playlist.name }}</h1>
            <p>{{ playlist.tracks.total }} Songs</p>
        </div>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
        ></v-text-field>

        <v-btn icon @click="fetchTracks(null, true)">
            <v-icon>refresh</v-icon>
        </v-btn>

        <v-menu open-on-hover bottom offset-y>
            <v-btn
                slot="activator"
                flat
            >
                <v-icon left>sort_by_alpha</v-icon>
                filters
            </v-btn>

            <v-list>
                <v-list-tile
                v-for="(header, index) in extraHeaders"
                :key="index"
                @click="replaceLastHeader(header)"
                >
                <v-list-tile-title>{{ header.text }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>

        <v-btn flat @click="shuffle()"><v-icon left>shuffle</v-icon>shuffle</v-btn>
        <v-btn outline :disabled="!showTracks || search.length > 0" @click="reorder()">
            <v-icon left class="upside-down">low_priority</v-icon>
            reorder
        </v-btn>

    </v-card-title>
        <v-data-table
            v-if="showTracks"
            :headers="headers"
            :items="tracks"
            :loading="reorderingProgressPercentage > 0 || !tracksAreLoaded"
            class="elevation-1"
            disable-initial-sort
            no-data-text="Playlist is empty"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            ref="sorted-tracks"
            >

            <v-progress-linear slot="progress" color="blue" v-model="reorderingProgressPercentage" :indeterminate="!tracksAreLoaded"></v-progress-linear>

            <template slot="items" slot-scope="props">
                <td class="text-xs-right" value="index">{{ props.index + 1 }}</td>
                <td>{{ props.item.track.name }}</td>
                <td class="text-xs-right">{{ millisToMinutesAndSeconds(props.item.track.duration_ms) || '' }}</td>
                <td>{{ props.item.dataTableData ? props.item.dataTableData.artists : '' }}</td>
                <td>{{ props.item.track.album.name || '' }}</td>
                <td class="text-xs-right">{{ props.item | getKeyValue }}</td>
                <td class="text-xs-right">{{ props.item | getBpm }}</td>
                <td class="text-xs-right">{{ props.item.added_at || '' }}</td>
                <td class="text-xs-right">{{ getLastHeaderData(props.item) }}</td>
                <td></td>
            </template>

        </v-data-table>
</v-card>
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
            reorderingProgressPercentage: 0,
            search: '',
            pagination: {
                sortBy: 'index'
            },
            headers: [
                {
                    text: '#',
                    align: 'right',
                    value: 'index',
                    sortable: false
                },
                {
                    text: 'Name',
                    align: 'left',
                    value: 'track.name'
                },
                {
                    text: 'Time',
                    align: 'center',
                    value: 'track.duration_ms'
                },
                {
                    text: 'Artist',
                    align: 'left',
                    value: 'dataTableData.artists'
                },
                {
                    text: 'Album',
                    align: 'left',
                    value: 'track.album.name'
                },
                {
                    text: 'Key',
                    align: 'center',
                    value: 'features.key'
                },
                {
                    text: 'BPM',
                    align: 'center',
                    value: 'features.tempo'
                },
                {
                    text: 'Added',
                    align: 'center',
                    value: 'added_at'
                },
                {
                    text: 'Popularity',
                    align: 'center',
                    value: 'track.popularity'
                },

            ],
            extraHeaders: {
                releaseDate: {
                    text: 'Release Date',
                    align: 'center',
                    value: 'track.album.release_date'
                },
                popularity: {
                    text: 'Popularity',
                    align: 'center',
                    value: 'features.popularity'
                },
                acousticness: {
                    text: 'Acousticness',
                    align: 'center',
                    value: 'features.acousticness'
                },
                danceability: {
                    text: 'Danceability',
                    align: 'center',
                    value: 'features.danceability'
                },
                energy: {
                    text: 'Energy',
                    align: 'center',
                    value: 'features.energy'
                },
                instrumentalness: {
                    text: 'Instrumentalness',
                    align: 'center',
                    value: 'features.instrumentalness'
                },
                liveness: {
                    text: 'Liveness',
                    align: 'center',
                    value: 'features.liveness'
                },
                loudness: {
                    text: 'Loudness',
                    align: 'center',
                    value: 'features.loudness'
                },
                speechiness: {
                    text: 'Speechiness',
                    align: 'center',
                    value: 'features.speechiness'
                },
                valence: {
                    text: 'Valence',
                    align: 'center',
                    value: 'features.valence'
                },
            },
            rowsPerPageItems: [{ "text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1 } ]
        }
    },
    methods:{
        expand(){
            if(!this.tracksAreLoaded) this.fetchTracks();
            this.showTracks = !this.showTracks;
        },
        getLastHeaderData(item){
            const header = this.headers[this.headers.length - 1];
            const objKeys = header.value.split('.');
            if(objKeys.length === 1) return item[objKeys[0]];
            let output = {...item}
            if(!output) return '';
            objKeys.forEach(key => {
                output = output[key];
            });
            return output;
        },
        fetchTracks(href, refresh){
            if(refresh) {
                this.tracksAreLoaded = false;
                this.tracks = [];
            }
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
                        let currentTrack = this.tracks[index];
                        currentTrack.features = tracksAudioFeatures;
                        currentTrack.dataTableData = {
                            artists: this.displayArtists(currentTrack.track.artists),

                        }
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
            const minutes = Math.floor(millis / 60000);
            const seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        },
        reorder(sortedTracks, pos){
            sortedTracks = sortedTracks || [...this.$refs['sorted-tracks'].filteredItems];
            pos = pos || 0;

            // recursion ending condition
            if(pos >= this.tracks.length) {
                this.reorderingProgressPercentage = 0;
                return;
            };

            // find the position of the sorted track in original order
            const originalIndex = this.tracks.findIndex(track => track.track.id === sortedTracks[pos].track.id && track.added_at === sortedTracks[pos].added_at);

            // if both values are equal the song is already in the correct position
            if(pos === originalIndex) return this.reorder(sortedTracks, pos+1);

            axios.put(`https://api.spotify.com/v1/playlists/${this.playlist.id}/tracks`,
                {
                    range_start: originalIndex,
                    insert_before: pos,
                    snapshot_id: this.playlist.snapshot_id 
                },
                this.$store.getters.header)
                .then(res => {
                    console.log(`put song at index ${originalIndex} to index ${pos}`, ((pos + 1) / sortedTracks.length) * 100, sortedTracks.length);

                    this.reorderingProgressPercentage = ((pos + 1) / sortedTracks.length) * 100;

                    // apply reorder locally to keep track of the changing positions for the next reorder step
                    this.tracks.splice(pos, 0, this.tracks.splice(originalIndex, 1)[0]);

                    this.playlist.snapshot_id = res.data.snapshot_id;
                    return this.reorder(sortedTracks, pos);
                })
                .catch(err => this.handleError(err, () => this.reorder(sortedTracks, pos)));
        },
        shuffle(){
            this.tracks.sort(() => .5 - Math.random());
            this.resetSort();
        },
        resetSort(){
            this.pagination.sortBy = "index"
            this.pagination.descending = true;
        },
        replaceLastHeader(header){
            this.headers[this.headers.length - 1] = header;
            this.$forceUpdate();
        }
    },
    filters: {
        getBpm(track){
            return track.features ? Math.round(track.features.tempo) : null;
        },
        getKeyValue(track){
            if(!track.features) return;
            const key = track.features.key
            switch(key){
                case 0: return `(${key}) C`
                case 1: return `(${key}) C#/Db`
                case 2: return `(${key}) D`
                case 3: return `(${key}) D#/Eb`
                case 4: return `(${key}) E`
                case 5: return `(${key}) F`
                case 6: return `(${key}) F#/Gb`
                case 7: return `(${key}) G`
                case 8: return `(${key}) G#/Ab`
                case 9: return `(${key}) A`
                case 10: return `(${key}) A#/Ab`
                case 11: return `(${key}) B`
            }
        }
    }
}
</script>

<style scoped>

.playlist-container{
    margin-bottom: 1.75em;
}

.playlist-container .v-text-field{
    max-width: 12em;
}

.playlist{
    display: flex;
    width: 100%;
}

.playlist:hover{
    cursor: pointer;
}

.playlist .metadata{
    margin-left: 1em;
}

.v-input{
  margin-top: 0;
}

.cover-img{
  object-fit: cover;
  height: 12em;
  width: 12em;
  cursor: pointer;
}

.title-container{
  margin: 2em;
  text-align: left;
  max-width: 40em;;
  cursor: pointer;
}

.upside-down{
  transform: rotateX(180deg);
}
</style>
