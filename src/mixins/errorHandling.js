import router from '../router';
export default {
    methods: {
        handleError: function(err, cb) {

            if(err.response && err.response.status){

                if(err.response.status === 429 || err.response.status === 502){
                    setTimeout(() => {
                        cb();
                    }, parseInt(err.response.headers['retry-after']) * 1000);
                } else if(err.response.status === 401 || err.response.status === 400){
                    router.push('login');
                }
            } else {
                console.log(err);
            }

        }
    }
}
  