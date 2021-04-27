<template>
    <div>
        <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <!-- afficher error -->
                <error v-if="error" :error = "error"/>
                <!-- Component pour créer nouveau publication -->
                <AddPost/>

                <h3 class="text-center mx-auto my-3 text-danger">Les actualités </h3>

                <hr class="text-primary">

                <!-- Partie pour afficher les actualité  -->
                <div :key="post.id" v-for="( post, index) in posts" class="border text-justify p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>{{post.title}}</h4>

                        <!-- Si currentUser est auteur de l'article, il peut le modifier et supprimer -->
                        <div v-if="currentUserId==post.userId" class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li :key="post.id"><button type="button"   :data-bs-target="`#modify${post.id}`" data-bs-toggle="modal" class="btn dropdown-item" >Modifier</button></li>
                                <li @click="deletePost (index)"><a class="dropdown-item" href="#">Supprimer</a></li>
                            
                            </ul>

                        </div>

                        <!-- Modal formulaire pour modify publication -->
                            <div class="modal fade"  :id="`modify${post.id}`" tabindex="-1" aria-labelledby="modify" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-scrollable">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Modifier votre publication</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="modifyPost (index)" method="POST" enctype="multipart/form-data">
                                                <div class="mb-3">
                                                    <label for="recipient-name" class="col-form-label">Titre</label>
                                                    <input v-model="post.title" type="text" class="form-control" id="titre" max="50" />
                                                        
                                                    
                                                    <p class="flou"> Ne pas utiliser les caracters spéciaux, max 50 characters</p>
                                                </div>

                                                <div class="mb-3">
                                                    <label for="message-text" class="col-form-label">Contenu</label>
                                                    <textarea v-model="post.content" class="form-control" id="message-text" ></textarea>
                                                </div>

                                            <!-- Zone pour modifier image et video -->
                                                <div v-if="post.img_url !=''">
                                                    <img class="img" :src="`${post.img_url}`">
                                                </div>

                                                <div class="input-group">
                                        
                                                    <input @change="loadImage" multiple ref="file" type="file" class="form-control-file" id="inputGroupFile03" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie">

                                                    <label class="form-group"  id="inputGroupFileAddon03"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label>
                                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie; taille: 15Mo )</span>

                                                </div>
                                            </form>
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button @click="modifyPost(index)" type="button" class="btn btn-primary">Enregistrer</button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                    </div>

                    <!-- afficher le corps de l'article -->
                    <div class="text-justify p-3">
                        <p >{{post.content}}</p>
                    </div>

                    <!-- afficher image et vidéo    -->
                    <div class="embed-responsive">
                        <iframe class="embed-responsive-item" src="" width="300" height="150"></iframe>
                        
                    </div>

                    <hr>
                    <!-- bouton ajouter/ delete like -->
                    <div class="mx-auto my-1">
                        <button @click="ajouteLike(index)" class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-up"></i>{{post.likes.length}}</button>
                        

                    </div>

                    <!-- afficher les commentaires -->
                    <div>
                            <input  @change="loadComment(index)" class="form-control " type="text" :id="`commentaire${post.id}`" name="commentaire" placeholder="Ecrivez une commentaire" />

                        <div :key="commentaire" v-for="commentaire in post.commentaires" class="rounded-pill border text-center my-3 py-3 ">
                            {{commentaire.commentaires}}
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
    // props: {
    //     value: {type: Object, required: true}
    // },
    data () {
        return {
            // commentaires : [],
            // likes: [],
            posts: [],
            // meOrAdmin:false,
            // user_postId: []
            currentUserId:localStorage.getItem('id'),
            error: '',
            // title: '',
            // content:'',
            comment:'',
            intervall: null
        }
    },
    // props: ['likes', 'commentaires', 'posts'],

// récupérer tous les publications => OK, (enregistrer dans store de vuex: pas OK)
    async created () {
        // update automatique tous les 30s
        // this.interval = setInterval(this.getAllPosts, 10000)
        await axios.get('api/post/')
            .then( response => {
                // console.log(response);
                // let currentUserId = localStorage.getItem('Id');
                this.posts = response.data;
                // console.log(response.data.length);    //OK
                // for ( let i=0; i< response.data.length; i++) {
                //     this.commentaires.push (response.data[i].commentaires);
                //     this.likes.push(response.data[i].likes);
                    // this.user_postId.push(response.data[i].userId);
                    // console.log("admin" + this.$store.state.user.user.isAdmin);     //OK
                    // if ( currentUserId === this.user_postId[i]) {
                    //     this.meOrAdmin = true; console.log("meOrAdmin" + this.meOrAdmin);
                    // }
                // }
                // console.log("commentaire" + this.commentaires);   //OK
                // console.log("likes" + this.likes);      //OK

                // console.log(response.data);    // OK
                this.$store.dispatch ('post/getAllPosts', response.data)        //not OK
            })
            
            
            .catch( err => {
                console.log(err);
                this.error = "Problème connexion avec server"
            });
            
    },
    mounted() {
        
    },
    beforeUnmount () {
         clearInterval(this.interval)
    },

    methods: {
        // récupérer tous les publications
        async getAllPosts () {
            // await axios.get('api/post/')
            // .then( response => {
            //     // console.log(response);
            //     // let currentUserId = localStorage.getItem('Id');
            //     this.posts = response.data;
            //     // console.log(response.data.length);    //OK
            //     // for ( let i=0; i< response.data.length; i++) {
            //     //     this.commentaires.push (response.data[i].commentaires);
            //     //     this.likes.push(response.data[i].likes);
            //         // this.user_postId.push(response.data[i].userId);
            //         // console.log("admin" + this.$store.state.user.user.isAdmin);     //OK
            //         // if ( currentUserId === this.user_postId[i]) {
            //         //     this.meOrAdmin = true; console.log("meOrAdmin" + this.meOrAdmin);
            //         // }
            //     // }
            //     // console.log("commentaire" + this.commentaires);   //OK
            //     // console.log("likes" + this.likes);      //OK

            //     // console.log(response.data);    // OK
            //     this.$store.dispatch ('post/getAllPosts', response.data)        //not OK
            // })
            
            
            // .catch( err => {
            //     console.log(err);
            //     this.error = "Problème connexion avec server"
            // });
        },

        // supprimer post par user
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
        modifyPost (index) {
            let postId = this.posts[index].id 
            console.log(postId)
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

        // récupérer value de input commentaire
        loadComment (index) {
            // console.log(this.posts[index])      //OK
            let postId = this.posts[index].id 
            let userId = this.currentUserId;
            // let input = document.getElementById(`commentaire${postId}`)
            let saisie = document.getElementById(`commentaire${postId}`).value
            console.log({saisie})
            console.log({postId})                   //OK
            // this.posts[index].commentaires.push(saisie)
            // ajouter commentaire avec la touche enter
            
                axios.post('/api/post/commentaire', {
                    comment: saisie,
                    userId: userId,
                    postId: postId
                })
                    .then( response => {
                        console.log(response)
                    })
                    .catch( err => {
                        console.log(err);
                        this.error="Problème pour enregistrer votre commentaire"
                    })
                
            
        },

        //ajouter commentaire
        // async setCommentaire(index, saisie) {
            
        //     let postId = this.posts[index].id;
        //     let userId = this.currentUserId;
        //     console.log( {postId}); console.log( {userId});     //OK
        //     // console.log("commentaire " + this.commentaires[index]);     //OK
        //     console.log({saisie});
        //     // await axios.post('/api/post/commentaire', {
        //     //     comment: this.commentaires[index],
        //     //     userId: userId,
        //     //     postId: postId
        //     // })
        //     //     .then( (response) => {
        //     //         console.log(response);
        //     //         this.error=""
        //     //     })
        //     //     .catch ( err => {
        //     //         console.log(err);
        //     //         this.error = "Problème pour enregistrer votre commentaire"
        //     //         Swal.fire("Veuillez ne pas utiliser les characters spéciaux")
        //     //     })
        // },

        // updateComment(key, value) {
        //     this.$emit("input", {... this.value, [key]:value})
        //     console.log(this.value); console.log(this.comment);
        // }
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
    .bi-camera-reels-fill {
        color: #e42645
    }
    .bi-card-image {
        color: #41b35d !important
    }
    .gray {
        color: #e4e6e9 !important
    }
    .flou {
        opacity: 0.5;
    }

</style>