<template>
    <div class="container">

      <div>
        <!-- <Navbar/> -->
      </div>

      <!-- Afficher les actualités des postes -->
      <div v-if="user">
          <p>Bonjour {{user}} </p>
      </div>
      <div v-else>
          <p>This is the page HOME </p>
      </div>

      <div>
        <Footer/>
      </div>
      
    </div>
</template>

<script>
// import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import { mapGetters } from 'vuex'

export default {
    name: "Home",
    components: {
      // Navbar,
      Footer
    },
    // props: [ 'user'],
    computed: {
      ...mapGetters (["user/user"])
    }
}
</script>