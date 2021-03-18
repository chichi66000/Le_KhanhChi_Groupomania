<template >
  <div id="app" class="container-fluid d-flex justify-between align-content-center">
      <div class="col align-self-center">
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
  background: url(./assets/images/background_1.jpg);
  background-size: cover;
  // height: 100vh;
}

</style>
