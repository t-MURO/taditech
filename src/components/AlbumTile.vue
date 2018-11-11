<template>
  <a :href="'spotify:album:'+album.id" class="tile" @click="debugging()">
    <div class="img-container">
      <div>
        <img :src="album.images[0].url">
      </div>
    </div>
    <div class="album-info">
      <div class="album-title">{{album.name}}</div>
      <div class="artist">{{album.artists[0].name}}</div>
      <div class="release-date">{{album.release_date | formatDate}}</div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'AlbumTile',
  props:{
    album:Object,
  },
  methods:{
    debugging(){
      this.album.artists.forEach((artist,index) => console.log(`Artist: ${this.album.artists[index].name} ID: ${this.album.artists[0].id} URL: ${this.album.artists[0].href}`));
      console.log(`Album: ${this.album.name} ID: ${this.album.id}`);
      console.log('~~~~~~~~~~~~~~~~~~~~~~');
    }
  },
  filters: {
    formatDate(dateString){
        const date = new Date(dateString)
        const day = date.getDate();
        const year = date.getFullYear()
        switch(date.getMonth()){
            case 0: return `${day} January ${year}`
            case 1: return `${day} February ${year}`
            case 2: return `${day} March ${year}`
            case 3: return `${day} April ${year}`
            case 4: return `${day} May ${year}`
            case 5: return `${day} June ${year}`
            case 6: return `${day} July ${year}`
            case 7: return `${day} August ${year}`
            case 8: return `${day} September ${year}`
            case 9: return `${day} October ${year}`
            case 10: return `${day} November ${year}`
            case 11: return `${day} December ${year}`
        }

    }
  }
};
</script>

<style scoped>
.tile{
  color: white;
  text-decoration: none;
  margin-bottom: 1em;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  padding-bottom: 1em;
}
.tile:hover{
  /* cursor: pointer; */
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
  /* flex-flow: row; */
  flex-direction: column;
  justify-content: flex-end;
}

.album-title{
  font-weight: 400;
}

.artist{
  font-weight: 200;
}

.release-date{
  font-weight: 200;
  font-size: .8em;
}
</style>
