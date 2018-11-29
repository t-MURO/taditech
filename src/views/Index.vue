<template>
    <div>
        <h1>Welcome to Tadi Tech</h1>
        <v-btn router to="new-releases">New Releases</v-btn>
        <v-btn router to="playlists">Reorder Playlists</v-btn>        
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
}
</script>
