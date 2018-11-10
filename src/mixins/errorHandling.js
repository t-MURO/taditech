export default {
    methods: {
        handleError: function(err, cb) {
            if(err.response.status === 429){
                setTimeout(() => {
                    cb();
                }, parseInt(err.response.headers['retry-after']) * 1000);
            } else if(err.response.status === 401){
                console.log(err);
                this.router.push('login');
            }
        }
    }
}
  