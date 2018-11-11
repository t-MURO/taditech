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
        if(!this.$store.getters.token){
            const url = new URL(window.location.href);
            const token = url.searchParams.get('access_token');
            if(!token) this.$router.push('login');
            else {
                this.$store.dispatch('setToken', token)
                this.$router.push('/');
            };
        }
    },
    methods:{
        redirectTo(page){
            this.$router.push(page);
        }
    }
}
</script>
