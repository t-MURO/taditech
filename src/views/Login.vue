<template>
    <div>
        <h1>Login with your Spotify account</h1>
        <v-btn @click="redirectToAuth()">Login</v-btn>
    </div>
</template>

<script>
import config from '../config';

export default {
    name: 'login',
    methods: {
        redirectToAuth(){
            window.location.replace(config.AUTH_URL);
        }
    }
}

</script>

<style scoped>

div{
    text-align: center;
}

</style>

