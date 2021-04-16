<template>
    <div class="container">

      <div>
        <!-- <Navbar/> -->
      </div> 

      <!-- Afficher les actualités des postes -->
          <!-- <p>This nom from localStorage {{nom}}</p> -->

      <div v-if="user.user">
          <p>Bonjour {{user.user.userNom}} </p>
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
    data () {
      // return {
      //   user
      // }
    },
    // beforeCreated() {
    //   this.userNom = this.$store.state.user.user.nom
    // }
    // beforeMounted () {
      
    //   // return {...mapState ( { user: state => state.user } )}
      
    // },
    // beforeCreated () {
    //   if(localStorage.nom) { this.nom = localStorage.nom}
      
    // },
    // created () {
    //   if(localStorage.nom) { this.nom = localStorage.nom }

    // }
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>