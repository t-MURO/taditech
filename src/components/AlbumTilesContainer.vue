<template>
<div>
    <div v-for="(albumGroup, key) in albumsSortedByMonth" :key="key">
        <div class="custom-grid">
            <h1>{{key | formatDate}}</h1>
            <album-tile v-for="album in albumGroup" :key="album.id" :album="album">
            </album-tile>
            <!-- <hr> -->
        </div>
    </div>
</div>
</template>

<script>
import AlbumTile from './AlbumTile'

export default {
  name: 'AlbumTilesContainer',
  components:{
    AlbumTile
  },
  data(){
      return {
      }
  },
  props: ['albums'],
  methods:{
  },
  computed:{
      albumsSortedByMonth(){
            const temp = [...this.albums]
            return temp.reduce((groups, item) => {
                const val = item['release_date'].slice(0,7)
                groups[val] = groups[val] || []
                groups[val].push(item)
                return groups
            }, {})
      }
  },
  filters: {
      formatDate(dateString){
          const date = new Date(dateString)
          const year = date.getFullYear()
          switch(date.getMonth()){
              case 0: return `January ${year}`
              case 1: return `February ${year}`
              case 2: return `March ${year}`
              case 3: return `April ${year}`
              case 4: return `May ${year}`
              case 5: return `June ${year}`
              case 6: return `July ${year}`
              case 7: return `August ${year}`
              case 8: return `September ${year}`
              case 9: return `October ${year}`
              case 10: return `November ${year}`
              case 11: return `December ${year}`
          }

      }
  }
 
}
</script>

<style scoped>
.custom-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, 175px);
  grid-gap: 1em;
  justify-content: space-around;
}

h1, hr{
    /* font-size: 3em; */
    font-weight: 200;
    grid-column: 1/-1;
}

hr{
    margin-bottom: 2em;
}


@media screen and (max-width: 870px) {
    .custom-grid{
        grid-template-columns: repeat(auto-fill, 150px);
    }
}
@media screen and (max-width: 370px) {
    .custom-grid{
        grid-template-columns: repeat(auto-fill, 120px);
    }
}
</style>
