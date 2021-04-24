<template>
    <div>
        <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">

                <error v-if="error" :error = "error"/>

                <AddPost/>
                <h3 class="text-center mx-auto my-3 text-danger">Les actualités </h3>

                <hr class="text-primary">

                <!-- Partie pour afficher les actualité  -->
                <div :key="post" v-for="( post, index) in posts" class="border text-justify p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>{{post.title}}</h4>

                        <!-- Si currentUser est author de l'artile, il peut le modifier et supprimer -->
                        <div v-if="currentUserId==post.userId" class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li @click="modifyPost (index)"><a class="dropdown-item" href="#">Modifier</a></li>
                                <li @click="deletePost (index)"><a class="dropdown-item" href="#">Supprimer</a></li>
                            </ul>
                        </div>

                    </div>

                    <div class="text-justify p-3">
                        <p >{{post.content}}</p>
                    </div>

                    <div class="embed-responsive">
                        <iframe class="embed-responsive-item" src="" width="300" height="150"></iframe>
                        
                    </div>
                    <hr>

                    <div class="mx-auto my-1">
                        <button @click="ajouteLike(index)" class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-up"></i>{{post.likes.length}}</button>
                        <!-- <button class="btn fs-4 font-weight-bolder">{{post.likes.length}}<i class="bi bi-hand-thumbs-down"></i></button> -->

                    </div>

                    <div>
                        <input class="form-control " type="text" id="commentaire" name="commentaire" placeholder="Ecrivez une commentaire" />

                        <div class="rounded-pill border text-center my-3 py-3 ">
                            {{post.commentaires}}
                        </div>
                    </div>
                </div>

            </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '../axios'
import Swal from 'sweetalert2'
import AddPost from './AddPost'
import Error from './Error'

export default {
    name: "AllPost",
    components : {
        AddPost,
        Error
    },
    data () {
        return {
            commentaires : [],
            likes: [],
            posts: [],
            // meOrAdmin:false,
            // user_postId: []
            currentUserId:localStorage.getItem('id'),
            error: ''
        }
    },
    // props: ['likes', 'commentaires', 'posts'],

    async created () {
        await axios.get('api/post/')
            .then( response => {
                // console.log(response);
                // let currentUserId = localStorage.getItem('Id');
                this.posts = response.data;
                console.log(response.data.length);    //OK
                for ( let i=0; i< response.data.length; i++) {
                    this.commentaires.push (response.data[i].commentaires);
                    this.likes.push(response.data[i].likes);
                    // this.user_postId.push(response.data[i].userId);
                    // console.log("admin" + this.$store.state.user.user.isAdmin);     //OK
                    // if ( currentUserId === this.user_postId[i]) {
                    //     this.meOrAdmin = true; console.log("meOrAdmin" + this.meOrAdmin);
                    // }
                }
                // console.log("commentaire" + this.commentaires);   //OK
                // console.log("likes" + this.likes);      //OK

                // console.log(response.data);    // OK
                this.$store.dispatch ('post/getAllPosts', response.data)
            })
            .catch( err => {
                console.log(err);
                this.error = "Problème connexion avec server"
            })
    },
    mounted() {
        
    },
    methods: {
        async deletePost (index) {
            let postId = this.posts[index].id;
            await axios.delete(`api/post/${postId}`)
                .then( response => {
                    console.log(response);
                    Swal.fire('Votre publication a été supprimé')
                })
                .catch (err => {
                    console.log(err);
                    this.error = "Problème server pour supprimer post. Réessayer plus tard"
                })
        },

        // modify post par user
        modifyPost () {

        },
        
        // ajouter/ delete like du post
        async ajouteLike (index) {
            let userId = this.currentUserId;
            let postId = this.posts[index].id;
            console.log({postId}); console.log({userId});       //OK
            await axios.post(`api/post/${postId}/${userId}/like`, {
                userId: userId, postId: postId
            })
                .then( response => {
                    console.log(response);
                    // mettre à jour tableau likes sans rafraichir la page
                    })
                .catch( err => {
                    console.log(err);
                    this.error = "Problème pour ajouter like"
                })
        },
    },
    computed: {
      ...mapState ( {
            user: state => state.user,
            post: state => state.all_posts
      } ),

    },

    
}
</script>

<style scoped>
    
    .bi-hand-thumbs-up {
        color: red;
    }
    .bi-hand-thumbs-down {
        color: blue
    }

</style>