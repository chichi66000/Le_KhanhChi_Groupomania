<template>
    <div class="container">

      <div>
        <!-- <Navbar/> -->
      </div> 

      <!-- Afficher les actualités des postes -->
      <div v-if="user.user">
          <p>Bonjour {{user.user.pseudo}} </p>
      </div>
      <div v-else class="text-center d-flex align-self-center my-5 mx-auto">
          <h3>Bienvenue au Groupomania, connectez - vous pour commencer </h3>
      </div>

      <!-- <div>
        <Footer/>
      </div> -->
      
    </div>
</template>

<script>
// import Navbar from "../components/Navbar"
// import Footer from "../components/Footer";
import { mapState } from 'vuex'

export default {
    name: "Home",
    components: {
      // Navbar,
      // Footer
    },
    
    mounted () {
      
    },
    computed: {
      ...mapState ( { user: state => state.user } )
    }
}
</script>