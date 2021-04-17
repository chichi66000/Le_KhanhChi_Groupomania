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

import { mapState } from 'vuex'

export default {
    name: "Home",
    components: {
     
    },
    data () {
    
    },
    
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>