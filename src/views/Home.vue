<template>
    <div>
        <div class="custom-grid">
        <h1>August 2018</h1>
            <album-tile v-for="(album, index) in albums" :key="Math.random(index)" :album="album">
            </album-tile>
            <album-tile v-for="(album, index) in albums" :key="Math.random(index)" :album="album">
            </album-tile>
            <album-tile v-for="(album, index) in albums" :key="Math.random(index)" :album="album">
            </album-tile>
        </div>
    </div>
</template>

<script>
import AlbumTile from '../components/AlbumTile';

export default {
  name: 'Home',
  components:{
    AlbumTile
  },
  data(){
    return {
      albums: [
    {
        img: 'https://i.scdn.co/image/65fd944b95c86869b311cd066d1666f34a3bc573',
        title: 'Save Me',
        artist: 'Balthazar & JackRock'
    },
    {
        img: 'https://i.scdn.co/image/6b603231783f57bedd403a79ea3c63896548663b',
        title: 'Biomorph',
        artist: 'Enrico Sangiuliano'
    },
    {
        img: 'https://i.scdn.co/image/a105be1ef55f88a3013b7f9aff843c75f5cbe7b9',
        title: 'Offending Public Morality',
        artist: 'Dax J'
    },
    {
        img: 'https://i.scdn.co/image/ff7cfe963ba76e785e1a2cf98de986d8002d308d',
        title: 'EXILE 007',
        artist: 'Johannes Heil'
    },
    {
        img: 'https://i.scdn.co/image/b24620823183cc05ea0c74fb40f18d2e582d8f63',
        title: 'EXILE 007',
        artist: 'Johannes Heil'
    },
    {
        img: 'https://i.scdn.co/image/8d04f463c83a267daf4abca2b95a7bbd170d2723',
        title: 'XY',
        artist: 'Exilles'
    },
    {
        img: 'https://i.scdn.co/image/3016bf6b2ff86e92bffb57d41d145f86941ed8a9',
        title: 'Alliance EP',
        artist: 'Exilles'
    },
    {
        img: 'https://i.scdn.co/image/62191f43fd445efcc623dede3786ba071af057cb',
        title: 'Waterfall EP',
        artist: 'Exilles'
    },
    {
        img: 'https://i.scdn.co/image/6b603231783f57bedd403a79ea3c63896548663b',
        title: 'Biomorph',
        artist: 'Enrico Sangiuliano'
    },
        {
        img: 'https://i.scdn.co/image/3016bf6b2ff86e92bffb57d41d145f86941ed8a9',
        title: 'Alliance EP',
        artist: 'Exilles'
    },
    {
        img: 'https://i.scdn.co/image/ff7cfe963ba76e785e1a2cf98de986d8002d308d',
        title: 'EXILE 007',
        artist: 'Johannes Heil'
    },
]
    }
  },
};
</script>

<style>
*{
  z-index: inherit;
}
.custom-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, 175px);
  grid-gap: 1em;
  justify-content: space-around;
}

h1{
    font-weight: 300;
    grid-column: 1/-1;
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
