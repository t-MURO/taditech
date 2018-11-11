<template>
<div>
    <div v-for="(albumGroup, index) in albumsSortedByMonth" :key="index">
        <album-date-group :albums="albumGroup" :showDateGroup="showDateGroup(index)"></album-date-group>
    </div>
</div>
</template>

<script>
import AlbumTile from './AlbumTile';
import AlbumDateGroup from './AlbumDateGroup';

export default {
  name: 'AlbumTilesContainer',
  components:{
    AlbumTile,
    AlbumDateGroup
  },
  data(){
      return {
          amountOfDisplayedMonths: 3,
      }
  },
  props: ['albums'],
  methods:{
      dateToYearAndMonth(album){
          // transforms '2018-12-29' to '2018-12'
          return album['release_date'].slice(0,7);
      },

      showDateGroup(index){
          return index < this.amountOfDisplayedMonths;
      }

  },
  computed:{
      albumsSortedByMonth(){
            const temp = [...this.albums];
            const releaseMonthGroups = temp.reduce((groups, item) => {
                const val = this.dateToYearAndMonth(item);
                groups[val] = groups[val] || [];
                groups[val].push(item);
                return groups;
            }, {});

            const sortedAlbums = [];
            const realeaseMonths = Object.keys(releaseMonthGroups).sort((a, b) => a > b ? -1 : 1);
            realeaseMonths.forEach(releaseMonth => sortedAlbums.push(releaseMonthGroups[releaseMonth]))
            sortedAlbums.forEach(albums => albums.sort((a, b) => a.release_date > b.release_date ? -1 : 1));
            return sortedAlbums
      }
  },
}
</script>

<style scoped>

</style>
