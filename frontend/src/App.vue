<template >
  <div id="app" class="container-fluid d-flex">

      <Navbar/>
      <div class="col justify-content-center">
        <h3>Bonjour, bienvenue à Groupomania</h3>
        <!-- <connexion/> -->
      </div>
    
  </div>
</template>>

<script>
// import connexion from './components/connexion'
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    // connexion
    Navbar
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
