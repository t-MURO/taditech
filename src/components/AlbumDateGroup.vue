<template>
    <div class="custom-grid">
        <h1 @click="showDateGroup = !showDateGroup">{{dateToYearAndMonth(albums[0]) | formatDate}}</h1>
        <album-tile v-if="showDateGroup" v-for="album in albums" :key="album.id" :album="album">
        </album-tile>
        <hr v-if="!showDateGroup">
    </div>
</template>

<script>
import AlbumTile from './AlbumTile';

export default {
    name: 'AlbumDateGroup',
    components:{AlbumTile},
    props: ['albums', 'showDateGroup'],
    methods: {
      dateToYearAndMonth(album){
          // transforms '2018-12-29' to '2018-12'
          return album['release_date'].slice(0,7);
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
    font-weight: 200;
    grid-column: 1/-1;
    cursor: pointer;
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


