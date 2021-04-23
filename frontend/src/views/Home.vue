<template>
    <div class="container">
        <!-- I user est connecté -->
      <div v-if="user.user">
            <p >Bonjour {{user.user.userNom}} </p>
            <AllPost/>
      </div>
        <!-- Si user n'est pas connecté, l'inviter à se connecter -->
      <div v-else class="text-center my-5 mx-auto text-danger">
          <h3>Bienvenue au Groupomania, connectez - vous pour commencer </h3>
      </div>

      
    </div>
</template>

<script>
// import axios from '../axios'
import { mapState } from 'vuex'
import AllPost from '../components/AllPost'
export default {
    name: "Home",
    components: {
        AllPost,
    },
    // props: ["commentaires", "posts", "likes"]
        
    // ,
    // data () {
    //     return {
    //         commentaires : [],
    //         likes: [],
    //         posts: []
    //     }
        
    // },

    // async created () {
    //     await axios.get('api/post/')
    //         .then( response => {
    //             // console.log(response);
    //             this.posts = response.data;
    //             console.log(response.data.length);    //OK
    //             for ( let i=0; i< response.data.length; i++) {
    //                 this.commentaires.push (response.data[i].commentaires);
    //                 this.likes.push(response.data[i].likes);
    //             }
    //             // console.log("commentaire" + this.commentaires);   //OK
    //             // console.log("likes" + this.likes);      //OK

    //             // console.log(response.data);    // OK
    //             this.$store.dispatch ('post/getAllPosts', response.data)
    //         })
    //         .catch( err => {
    //             console.log(err);
    //             this.error = "Problème connexion avec server"
    //         })
    // },
    
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>