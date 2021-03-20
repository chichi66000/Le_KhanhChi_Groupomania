<template >
  <div id="app" class="container-fluid d-flex">
      <div class="col justify-content-center">
        <connexion/>
      </div>
    
  </div>
</template>>

<script>
import connexion from './components/connexion'
export default {
  name: 'App',
  components: {
    connexion
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
