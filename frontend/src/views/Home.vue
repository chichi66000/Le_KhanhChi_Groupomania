<template>
    <div class="container">
        <!-- I user est connecté -->
      <div v-if="user.user">
            <Logo class="text-left position-fixed my-5"/>
            <p >Bonjour {{user.user.userNom}} </p>
            <AllPost/>
      </div>
        <!-- Si user n'est pas connecté, l'inviter à se connecter -->
      <div v-else class="text-center my-5 mx-auto text-danger">
          <Logo class="my-5"/>
          <h3 class="red my-5 ">Bienvenue au Groupomania, connectez - vous pour commencer </h3>
      </div>

      
    </div>
</template>

<script>
// import axios from '../axios'
import { mapState } from 'vuex'
import Logo from '../components/Logo'
import AllPost from '../components/AllPost'
export default {
    name: "Home",
    components: {
        AllPost,
        Logo
    },
  
    
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>

<style scoped>
  .red {
    color: #C3081A !important;
  }
</style>