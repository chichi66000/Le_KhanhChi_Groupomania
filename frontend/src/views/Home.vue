<template>
  <div class="home">
    <div>
      <h1 class="bg-primary">Mon titre</h1>
    </div>
    <Logo/>
  </div>
</template>

<script>
// @ is an alias to /src
import Logo from '../components/Logo.vue'

export default {
  name: 'Home',
  components: {
    Logo
  }
}
</script>
