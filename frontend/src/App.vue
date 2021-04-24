<template >
  <div id="app" class="container-fluid">
      <Navbar />
      <router-view ></router-view>

      <div class="col justify-content-center">
        <!-- <h3 >Bonjour, bienvenue à Groupomania, c'est App. Veuillez connecter</h3> -->
      </div>

      <Footer/>
  </div>
</template>>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import axios from './axios';
// import store from './store'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },

  data() {
      return {
        id: localStorage.getItem('id'),
        // user: null
        // store
        // commentaires : [],
        // likes: [],
        // posts: [],
        currentUserId:localStorage.getItem('id')
      }   
    },
    // props: ['commentaires', 'likes', 'posts'],

    async created() {
      await axios.get(`api/auth/${this.id}`,
        // {
        // headers: { Authorization: "Bearer " + localStorage.getItem('token')}
        // }
      )
        .then( response => {
          // this.user = response.data.currentUser
          console.log("nom" + response.data.currentUser.userNom)
          console.log("currentuser" + response.data.currentUser);
          this.$store.dispatch ('user/setCurrentUser', response.data.currentUser)
          
        })
        .catch(error => console.log(error));

      
        // await axios.get('api/post/')
        //     .then( response => {
        //         // console.log(response);
        //         // let currentUserId = localStorage.getItem('Id');
        //         this.posts = response.data;
        //         console.log(response.data.length);    //OK
        //         for ( let i=0; i< response.data.length; i++) {
        //             this.commentaires.push (response.data[i].commentaires);
        //             this.likes.push(response.data[i].likes);
        //             // this.user_postId.push(response.data[i].userId);
        //             // console.log("admin" + this.$store.state.user.user.isAdmin);     //OK
        //             // if ( currentUserId === this.user_postId[i]) {
        //             //     this.meOrAdmin = true; console.log("meOrAdmin" + this.meOrAdmin);
        //             // }
        //         }
        //         // console.log("commentaire" + this.commentaires);   //OK
        //         // console.log("likes" + this.likes);      //OK

        //         // console.log(response.data);    // OK
        //         this.$store.dispatch ('post/getAllPosts', response.data)
        //     })
        //     .catch( err => {
        //         console.log(err);
        //         this.error = "Problème connexion avec server"
        //     })

    },
}
</script>
<style scope lang="scss">
text-right {
  text-align: right!important;
}
#app{
  background: url(./assets/images/bg_grey.png);
  background-size: cover;
  min-height: 100vh;
}

</style>
