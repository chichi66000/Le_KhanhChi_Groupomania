<template >
  <div id="app" class=" d-flex row justify-between h-100">
    <div class="container d-flex">
      <div class="col align-self-center">
        <connexion/>
      </div>
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
#app {
  background: url(./assets/images/background_1.jpg) no-repeat;
  background-size: cover;
  height: 100vh;
}
</style>
