<template>
    <div class="container">

      <div>
        <!-- <Navbar/> -->
      </div>

      <!-- Afficher les actualités des postes -->
      <div v-if="user">
          <p>Bonjour {{user.userNom}} </p>
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
import axios from '../axios';

export default {
    name: "Home",
    components: {
      // Navbar,
      Footer
    },
    data() {
      return {
        id: localStorage.getItem('id'),
        user: null
      }
        
    },
    async created() {
      // let id = localStorage.getItem('id');
      await axios.get(`api/auth/${this.id}`,{
        headers: { Authorization: "Bearer " + localStorage.getItem('token')}
      })
        .then( response => {
          this.user = response.data.currentUser
          
          console.log( this.user);   // OK
        })
        .catch(error => console.log(error))

    },
    methods: {
      
    }
}
</script>