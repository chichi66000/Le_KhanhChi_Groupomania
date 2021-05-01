<template>
    <div>
        <div :key="componentKey" class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <!-- afficher error -->
                <error v-if="error" :error = "error"/>
                <!-- Component pour créer nouveau publication -->
                <AddPost :method="getAllPosts"/>

                <h3 class="text-center mx-auto my-3 text-danger">Les actualités </h3>

                <hr class="text-primary">

                <!-- Partie pour afficher les actualité  -->
                <div :key="post.id" v-for="( post, index ) in posts" class="border  p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <div>
                            <img class="b-avatar rounded-circle mx-2" :src="`http://localhost:5000/images/${post.User.avatar}`" />
                            <p >{{post.User.pseudo}}</p>
                            <p class="font_light"> publié {{post.updatedAt}}</p>   
                        </div>

                        <div>
                            <h4 class="mx-2 px-2">{{post.title}}</h4>
                        </div>
                        

                        <!-- Si currentUser est auteur de l'article, il peut le modifier et supprimer -->
                        <div v-if="currentUserId==post.userId || user.user.isAdmin===true" class="dropdown">
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
                                        
                                                    <input v-on="post.img_url" ref="file" type="file" class="form-control-file" :id="`inputFile${post.id}`" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie">

                                                    <label class="form-group"  :for="`inputFile${post.id}`">
                                                        <i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video
                                                    </label>
                                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie; taille: 15Mo )</span>

                                                </div>
                                            </form>
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button @click="modifyPost (index)" :id="`submitModify${post.id}`" type="submit" class="btn btn-primary">Enregistrer</button>
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
                    <div v-if="post.img_url !='' "  class="">
                        <!-- image -->
                        <div v-if="post.img_url.split('.')[1] == ('jpg' || 'png' || 'jpeg' || 'gif')">
                            <img class="img img-fluid" :src="getImage(index)" />
                        </div>

                        <!-- video -->
                        <div v-else class="embed-responsive embed-responsive-16by9">
                            <iframe class="embed-responsive-item" :src="getImage (index)" allowfullscreen></iframe>
                        </div>
                        
                    </div>

                    <hr>
                    <!-- bouton ajouter/ delete like -->
                    <div class="mx-auto my-1">
                        <button @click="ajouteLike(index)" class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-up"></i>{{post.likes.length}}</button>
                        
                    </div>

                    <!-- afficher les commentaires -->
                    <div>
                        <!-- ajouter commentaire -->
                        <input  @change="loadComment(index)" class="form-control " type="text" :id="`commentaire${post.id}`" name="commentaire" placeholder="Ecrivez une commentaire" />

                        <!-- afficher commentaires -->
                        
                            

                            <div :key="commentaire.id" v-for="commentaire in post.commentaires" class="d-flex rounded-pill border text-center my-3 py-1 ">
                                <div class="align-self-center">
                                    <img class="b-avatar rounded-circle ml-3 my-2" :src="`http://localhost:5000/images/${commentaire.userAvatar}`" />
                                    <p class="text-primary font_light ">{{commentaire.userPseudo}}</p>
                                </div>
                                
                                <p class="px-3 align-self-center">{{commentaire.commentaires}}</p>
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
            posts: [],
            currentUserId:localStorage.getItem('id'),
            error: '',
            // video: false,
            // image: false,
            // files: []
        }
    },
    // props: ['likes', 'commentaires', 'posts'],

// récupérer tous les publications => OK, (enregistrer dans store de vuex: pas OK)
     created () {
        //récupérer tous les publications dès début
        this.getAllPosts()
            
    },

    methods: {
        // récupérer tous les publications
        async getAllPosts () {
            await axios.get('api/post/')
            .then( response => {
                this.posts = response.data;
            })
            .catch( err => {
                console.log(err);
                this.error = "Problème connexion avec server"
            });
        },

        // supprimer post par user
        async deletePost (index) {
            let postId = this.posts[index].id;
            await axios.delete(`api/post/${postId}`)
                .then( response => {
                    console.log(response);
                    Swal.fire('Votre publication a été supprimé');
                    this.getAllPosts()
                })
                .catch (err => {
                    console.log(err);
                    this.error = "Problème server pour supprimer post. Réessayer plus tard"
                })
        },

        // modify post par user
        async modifyPost (index) {
            let postId = this.posts[index].id 
            let inputFile = document.getElementById(`inputFile${postId}`).files[0]
            console.log(inputFile)
            let form = new FormData();
            form.append('image', inputFile)
                
                form.append('title', this.posts[index].title)
                form.append('content', this.posts[index].content)

                // envoyer formulaire par axios, recevoir la response
                await axios.put(`/api/post/${postId}/${this.currentUserId}/update`, form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        this.$store.dispatch ('post/getAllPosts', response.data)
                        Swal.fire("Votre article a été modifié")
                        this.error=""
                        this.getAllPosts()
                        
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                    })
                
                    // fermer manuellement la modal
                    // document.getElementById(`modify${postId}`).modal('hide')
                        
 
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
                    this.getAllPosts()
                    })
                .catch( err => {
                    console.log(err);
                    this.error = "Problème pour ajouter like"
                })
        },

        // récupérer value de input commentaire et créer commentaire
        loadComment (index) {
            
            let postId = this.posts[index].id 
            let userId = this.currentUserId;
            // récupérer la value de champs input choisi
            let saisie = document.getElementById(`commentaire${postId}`).value
            console.log(this.$store.state.user.user.avatar)
            console.log(this.$store.state.user.user.userPseudo)

            // ajouter commentaire avec la touche enter puis envoyer au server
                axios.post('/api/post/commentaire', {
                    commentaire: saisie,
                    userId: userId,
                    postId: postId,
                    userAvatar: this.$store.state.user.user.avatar,
                    userPseudo: this.$store.state.user.user.userPseudo
                })
                // récupérer le reponse OK du server puis update les commentaires
                    .then( response => {
                        console.log(response)
                        // ajouter ce commentaire dans le tableau commentaire du post
                        this.posts[index].commentaires.unshift(saisie)
                        // update/reload la page
                        this.getAllPosts()
                        // réinitialiser la champs input => vide
                        document.getElementById(`commentaire${postId}`).value=""   
                    })
                    .catch( err => {
                        console.log(err);
                        this.error="Problème pour enregistrer votre commentaire"
                    })
                
            
        },

        // récupérer le nom de image pour afficher
        getImage(index) {
            let url = this.posts[index].img_url
            console.log(url);
            if (url.split('.')[1] == ('jpg' || 'png' || 'jpeg' || 'gif')) {
                console.log("c'est image")
                // this.image = true
                return `http://localhost:5000/images/${url}`
            }
            else {
                return `http://localhost:5000/images/${url}`
            }
            // console.log(url)
        },

        getVideo(index) {
            let url = this.posts[index].img_url
            if (url.split('.')[1] == ('avi' || 'mp4' || 'wav' || 'flv' || 'mov' || 'wmv' || 'movie' )) {
                console.log("c'est video")
                console.log(url);

                // this.video = true
                return `http://localhost:5000/images/${url}`
            }
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
    .font_light {
        font-size: 0.7rem !important;
        opacity: 0.5 !important;
    }

</style>