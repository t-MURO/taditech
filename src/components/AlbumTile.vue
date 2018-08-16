<template>
    <!-- <div class="tile">
      <img :src="albumUrl" alt="">
    </div> -->
    <!-- <v-flex xs2> -->
      <div class="tile">
        <div class="img-container">
          <div class="img-container-inner">
            <img :src="album.img">
          </div>
        </div>
        <div class="album-info">
          <div class="album-title">{{album.title}}</div>
          <div class="artist">{{album.artist}}</div>
        </div>
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
.tile{
  margin-bottom: 1em;
}
.tile:hover{
  cursor: pointer;
  box-shadow: 20px;
}

.img-container{
  position: relative;
  width: 100%;
}

.img-container::before{
  content: "";
  display: block;
  padding-top: 100%;
}

.img-container div{
  overflow-y: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

img{
  width: 100%;
}

.album-info{
  margin-top: .5em;
  display: flex;
  flex-wrap: nowrap;
  flex-flow: row;
  flex-direction: column;
  justify-content: flex-end;
}

.album-title{
  font-weight: 400;
}
.artist{
  font-weight: 200;
}
</style>
