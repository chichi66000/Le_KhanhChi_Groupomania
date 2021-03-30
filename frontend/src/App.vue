<template >
  <div id="app" class="container-fluid">
      <Navbar/>
      <router-view></router-view>

      <div class="col justify-content-center">
        <!-- <h3 >Bonjour, bienvenue à Groupomania, c'est App. Veuillez connecter</h3> -->
      </div>
  </div>
</template>>

<script>
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar,
  }
}
</script>
<style scope lang="scss">
text-right {
  text-align: right!important;
}
#app{
  background: url(./assets/images/background_2.jpg);
  background-size: cover;
  min-height: 100vh;
}

</style>
