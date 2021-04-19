<template>
    <div class="container">

      <div v-if="user.user">
          <p>Bonjour {{user.user.userNom}} </p>
      </div>
      <div v-else class="text-center d-flex align-self-center my-5 mx-auto">
          <h3>Bienvenue au Groupomania, connectez - vous pour commencer </h3>
      </div>

      <AllPost/>
      
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