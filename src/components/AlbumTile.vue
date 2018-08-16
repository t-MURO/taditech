<template>
  <div class="tile">
    <div class="img-container">
      <div>
        <img :src="album.img">
      </div>
    </div>
    <div class="album-info">
      <div class="album-title">{{album.title}}</div>
      <div class="artist">{{album.artist}}</div>
    </div>
  </div>
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
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
.tile:hover{
  cursor: pointer;
  box-shadow: 0 0 30px rgba(255,255,255,0.25), 0 0 30px rgba(255,255,255,0.22);
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
  text-align: center;
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
