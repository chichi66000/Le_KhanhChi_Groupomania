<template>
    <div class="container">

      <div>
        <!-- <Navbar/> -->
      </div>

      <!-- Afficher les actualités des postes -->
      <div>
          <p>Voici la page Home</p>
      </div>

      <div>
        <Footer/>
      </div>
      
    </div>
</template>

<script>
// import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import axios from '../axios';

export default {
    name: "Home",
    components: {
      // Navbar,
      Footer
    },
    data() {
      return {user:null}
        
    },
    async created() {
      await axios.get('api/auth/:id')
        .then( response => {
          this.user = response.data
        })
        .catch(error => console.log(error))

    },
    methods: {
      
    }
}
</script>