<template>
    <div>
        <h1>Login with your Spotify account</h1>
        <a :href="authUrl">
            <v-btn>Login</v-btn>
        </a>
    </div>
</template>

<script>
import config from '../config';

export default {
    name: 'login',
    data(){
        return {
            authUrl: config.AUTH_URL
        }
    },
}

</script>

<style scoped>

div{
    text-align: center;
}

</style>

