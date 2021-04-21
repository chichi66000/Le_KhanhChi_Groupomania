<template>
    <div class="container">
        <!-- I user est connecté -->
      <div v-if="user.user">
            <p>Bonjour {{user.user.userNom}} </p>
            <AllPost/>
      </div>
        <!-- Si user n'est pas connecté, l'inviter à se connecter -->
      <div v-else class="text-center my-5 mx-auto text-danger">
          <h3>Bienvenue au Groupomania, connectez - vous pour commencer </h3>
      </div>

      
    </div>
</template>

<script>

import { mapState } from 'vuex'
import AllPost from '../components/AllPost'
export default {
    name: "Home",
    components: {
        AllPost,
    },
    // data () {
    
    // },
    
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>