export default {
  mounted() {
    this.checkIfUserLoggedIn()
  },
  methods: {
    checkIfUserLoggedIn() {
      
      console.log('hello from mixin!')
    }
  }
}
