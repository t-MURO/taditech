<script>
export default {
    created(){
        const url = new URL(window.location.href);
        const token = url.searchParams.get('access_token');
        if(token) {}
        this.$router.push('index');
    }
}
</script>
