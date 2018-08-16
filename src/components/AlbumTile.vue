<template>
    <!-- <div class="tile">
      <img :src="albumUrl" alt="">
    </div> -->
    <!-- <v-flex xs2> -->
      <div class="tile">
        <img :src="album.img">
        <div>{{album.title}}</div>
        <div class="artist">{{album.artist}}</div>
      </div>
    <!-- </v-flex> -->
</template>

<script>
export default {
  name: 'AlbumTile',
  props:{
    album:Object,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.artist{
  /* position: relative;
  bottom: 0;
  height: 100%; */
}
.tile{
  margin: .5em;
  width: 125px;
  /* height: 200px; */
  /* font-size: .8em; */
}

img{
  width: 125px;
  height: 125px;
}
</style>
