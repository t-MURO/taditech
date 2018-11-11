<template>
    <div>
        <h1>Welcome to Tadi Tech</h1>
        <v-btn @click="redirectTo('new-releases')">New Releases</v-btn>
        <v-btn @click="redirectTo('playlists')">Reorder Playlists</v-btn>        
    </div>
</template>

<script>
export default {
    created(){

    },
    methods:{
        redirectTo(page){
            this.$router.push(page);
        }
    }
}
</script>
