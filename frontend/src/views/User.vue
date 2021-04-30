<template>
    <div class="container">
   
        <div class="container mx-auto mt-5 mb-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10">
            <error v-if="error" :error = "error"/>
    <!-- Profil user-->

            <!-- Partie afficher avatar -->
            <div class="row shadow rounded col d-flex mx-auto px-5 my-5 float-none">
                <img class="img-fluid m-2 text-left " alt="avatar" :src= "`http://localhost:5000/images/${user.user.avatar}`" />
                <p class="m-2 p-2 text-left font-weight-bold"> {{user.user.userPseudo }} </p>

            </div>

            <!-- Partie afficher le profil et modifier -->
            <div class="col shadow rounded mx-auto mt-3 mb-3 px-5 py-5">
                <h3 class="">A propos de moi</h3>
                <p class="">Nom et prenom : <strong>{{ user.user.userNom }}</strong>  </p>
                <p class="">Pseudo : <strong>{{ user.user.userPseudo }}</strong>  </p>
                <!-- <p class="">Avatar : <strong>{{ user.user.avatar }}</strong>  </p> -->

                <div class="text-center">
                    <button class="col col-md-6 col-lg-6 mx-1 btn btn-primary mb-3 text-center" @click.prevent = "updateUser">MODIFIER PROFIL</button> 
                    <button class="col col-md-6 col-lg-6 mx-1 btn btn-primary mb-3 text-center" @click.prevent = "updatePass">MODIFIER PASSWORD</button>
                </div>
            </div>

            <!-- Ce bloc est pour admin récupérer tous les user et delete 1 user -->
            <div v-if="user.user.isAdmin===true" class="text-center col shadow rounded mx-auto mt-3 mb-3 px-5 py-5">
                <button class="btn col col-md-6 col-lg-6 mx-auto btn btn-primary mb-3 text-center" @click.prevent = "admin">Gérer les utilisateurs</button>
            </div>

            <!-- Mes publications, quand on click, les articles s'affichent -->
            <div class="accordion col shadow rounded mx-auto my-3 px-5 py-5" id="accordionExample">

                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button @click="getUserPosts" class="accordion-button btn-primary fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Mes publications
                        </button>
                    </h2>

                    <div :key="userPost" v-for="(userPost, index) in userPosts"  id="collapseOne" class="accordion-collapse collapse show " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body shadow my-5">

                            <div class="d-flex justify-content-between">

                                <!-- Le titre -->
                                <h4 class="font-weight-bold">{{userPost.title}}</h4>

                                <!-- Si currentUser est auteur de l'article, il peut le modifier et supprimer -->
                                <div v-if="id==userPost.userId || user.user.isAdmin===true" class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li :key="userPost.id"><button type="button"   :data-bs-target="`#modify${userPost.id}`" data-bs-toggle="modal" class="btn dropdown-item" >Modifier</button></li>
                                        <li @click="deletePost (index)"><a class="dropdown-item" href="#">Supprimer</a></li>
                                    
                                    </ul>

                                </div>
                            </div>
                            
                            <!-- Modal formulaire pour modify publication -->
                            <div class="modal fade"  :id="`modify${userPost.id}`" tabindex="-1" aria-labelledby="modify" aria-hidden="true">
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
                                                    <input v-model="userPost.title" type="text" class="form-control" id="titre" max="50" />
                                                        
                                                    
                                                    <p class="flou"> Ne pas utiliser les caracters spéciaux, max 50 characters</p>
                                                </div>

                                                <div class="mb-3">
                                                    <label for="message-text" class="col-form-label">Contenu</label>
                                                    <textarea v-model="userPost.content" class="form-control" id="message-text" ></textarea>
                                                </div>

                                            <!-- Zone pour modifier image et video -->
                                                <!-- <div v-if="userPost.img_url !=''">
                                                    <img class="img" :src="`${post.img_url}`">
                                                </div> -->

                                                <div class="input-group">
                                        
                                                    <input v-on="userPost.img_url" multiple ref="file" type="file" class="form-control-file" :id="`inputFile${userPost.id}`" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie">

                                                    <label class="form-group"  :for="`inputFile${userPost.id}`"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label>
                                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie; taille: 15Mo )</span>

                                                </div>
                                            </form>
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button @click="modifyPost (index)" :id="`submitModify${userPost.id}`" type="submit" class="btn btn-primary">Enregistrer</button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- Le contenu -->
                            <div>
                                <p class="p-2 "> {{userPost.content}}</p>
                                
                            </div>

                            <!-- Les images -->
                            <div v-if="url_img[index] !=='' ">
                                <img :key="url" v-for="url in lien[index]" class="img" :src="getUrl(index)" />
                            </div>

                            <hr class="text-primary">

                            <!-- Les likes -->
                            <div>
                                <i class="bi bi-hand-thumbs-up"></i> {{userPost.likes.length}}
                            </div>

                            <!-- Les commentaires -->
                            <div>
                                <p class="text-right font-italic"> Commentaires</p>
                                <!-- Les commentaires -->
                                <div :key="commentaire.id" v-for="commentaire in userPost.commentaires" class="rounded-pill border text-center my-3 py-3 ">
                                    {{commentaire.commentaires}}
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>


            <!-- Supprimer le compte user -->
            <div class="col shadow border border-danger rounded m-auto mt-3 mb-3 px-5 py-5">
                <h3 class="text-danger">Supprimer le compte</h3>
                <p>Si vous souhaitez supprimer votre compte, cliquez sur le button et confirmer</p>
                <button class="btn btn-danger" @click.prevent = "deleteUser">Supprimer mon compte</button>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '../axios'
import Swal from 'sweetalert2'
import Error from '../components/Error';

export default {
    name: "User",
    components: {
        Error
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            // url:'',
            error: '',
            userPosts: [],
            url_img: [],
            lien: []
        }
    },
    computed: {
      ...mapState ( { user: state => state.user} ),
    },
    
    async created () {
        this.getUserPosts()
    },
    methods: {
        // user supprimer son compte 
        async deleteUser () {
            console.log(this.id)        //OK
            // Utiliser sweatalert2 pour demander confirmation du password avant tout 
            const { value: password } = await Swal.fire({
                title: 'Entrer votre password pour supprimer votre compte',
                input: 'password',
                inputLabel: 'Password',
                inputPlaceholder: 'Password',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true,
                })
                // si user confirmer password, envoyer au server
                if (password) {
                    console.log(password);          //OK
                    axios.post(`api/auth/delete/${this.id}`,
                        {password : password })
                    // recevoir la reponse OK du server, effacer token dans mémoire, et vuex
                    .then((response) => {
                        console.log(response)
                        localStorage.removeItem('token');
                        this.$store.dispatch('user/setCurrentUser', null)
                        // revenir au Home
                        Swal.fire("Votre compte a été supprimé. Retour à Home")
                        this.$router.push("/home")
                    })
                    // En cas d'erreur du password, envoyer message
                    .catch (error => {
                        console.log(error);
                        Swal.fire("Password incorrect, veuillez réessayer")
                        })        
            }
        },

        //aller sur page update profil
        async updateUser () {
            this.$router.push("/updateProfil")
        },

        // aller sur page update password
        async updatePass () {
            this.$router.push("/updatePass")
        },

        // aller sur page admin
        admin () {
            this.$router.push("/admin")
        },

        // récupérer tous les post du User
        async getUserPosts () {
            await axios.get(`api/post/${this.id}`)      //demander les posts du server
            .then( response => {
                // console.log(response.data);
                this.$store.dispatch('post/setCurrentUserPosts', response.data)     //pas OK
                this.error=""
                this.userPosts = response.data;         //mettre la reponse du server dans data
                
                // mettre les photos du publications dans url_img
                for (let i =0; i< this.userPosts.length; i++) {
                    this.url_img.push(this.userPosts[i].img_url) 
                }
                // console.log("url_img" + this.url_img);      //OK 
            })
            .catch( err => {
                console.log(err);
                this.error = "Problème server, impossible récupérer vos publications"
            })
        },

        // modify post par user
        async modifyPost (index) {
            let postId = this.userPosts[index].id 
            let inputFile = document.getElementById(`inputFile${postId}`).files
            let form = new FormData();
            for( var i = 0; i < inputFile.length; i++ ) {
                let file = inputFile[i];
                form.append('files[' + i + ']', file);
            }
                
                form.append('title', this.userPosts[index].title)
                form.append('content', this.userPosts[index].content)

                // envoyer formulaire par axios, recevoir la response
                await axios.put(`/api/post/${postId}/${this.id}/update`, form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        Swal.fire("Votre article a été modifié")
                        this.error=""
                        this.getUserPost()
                        
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                    })
                
                    // fermer manuellement la modal
                    // document.getElementById(`modify${postId}`).modal('hide')
                        
 
        },

        // supprimer post par user
        async deletePost (index) {
            let postId = this.userPosts[index].id;
            await axios.delete(`api/post/${postId}`)
                .then( response => {
                    console.log(response);
                    Swal.fire('Votre publication a été supprimé');
                    this.getUserPosts()
                })
                .catch (err => {
                    console.log(err);
                    this.error = "Problème server pour supprimer post. Réessayer plus tard"
                })
        },

        // Récupérer le lien de l'images 
        getUrl(index) {
            if (this.url_img[index].split(' ') != "") {
                this.lien[index] = this.url_img[index].split(' ');
                // for ( let i=0; i< this.lien[index].length; i++) {
                //     let url = this.lien[index][i]
                //     if ( url !== "") {

                //         return `http://localhost:5000/images/${url}`
                //     }
                // } 
                
            }
            
        }
            
    }
  
}
</script>

<style scoped>
    img {
        width: 10rem !important
    }
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

