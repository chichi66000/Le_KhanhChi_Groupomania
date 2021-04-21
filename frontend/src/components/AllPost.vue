<template>
    <div>
        <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
            <error v-if="error" :error = "error"/>

                <h3 class="text-center mx-auto text-danger">Les actualités </h3>

                <!-- Partie pour créer un post -->
                <div class="border text-center p-2 m-auto my-3 bg-white">
                    <button type="button" class="btn btn-primary col col-sm-11 col-md-6 col-lg-4 col-xl-4 gray" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Que voulez vous dire ?
                    </button>

                    <div class="d-flex m--auto col col-sm-11 col-md-6 col-lg-4 col-xl-4">
                        <button class="btn fs-5"><i class="bi bi-card-image"></i> Photo</button>
                        <button class="btn fs-5"><i class="bi bi-camera-reels-fill"></i> Vidéo</button>

                    </div>
                </div>


                    <!-- Modal pour creer post par utilisateur (quand on click sur le button en haut-->
                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                        <div class="modal-content">
                            
                            <form action="/api/post/" class="modal-body px-4 my-1"  method="POST" enctype="multipart/form-data">
                                <div class="modal-header" >

                                    <div>
                                        <input v-model="title" class="form-control fs-5" id="staticBackdropLabel" type="text" placeholder="Titre" max="50"/>
                                        <p class="flou"> Ne pas utiliser les caracters spéciaux, max 50 characters</p>
                                    </div>

                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>

                                </div>

                                <div class="mb-3 row ">
                                    <textarea v-model="content" class="form-control px-1" rows="7" id="text" placeholder = "Votre message"></textarea>
                                </div>
                                    
                                    <div class="input-group">
                                        <!-- <div class="d-flex justify-content-between"> -->
                                            <input @change="loadImage" multiple ref="file" type="file" class="form-control-file" id="inputGroupFile03" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie">

                                            <!-- <button class="btn btn-danger" @click="annuler">X</button> -->
                                        <!-- </div> -->
                                        <label class="form-group"  id="inputGroupFileAddon03"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label>
                                        <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie; taille: 15Mo )</span>
                                    </div>

                                <!-- </div> -->

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>

                                    <button @click="handleSubmit"  id="closeModal"  data-bs-dismiss="modal" type="submit" class="my-4 text-center mx-auto btn-primary" >Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                    
                <hr class="text-primary">

                <!-- Partie pour afficher les actualité  -->
                <div class="border text-justify p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>Titre du publication</h4>

                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" href="#">Modifier</a></li>
                                <li><a class="dropdown-item" href="#">Supprimer</a></li>
                            </ul>
                        </div>

                    </div>

                    <div class="text-justify p-3">
                        <p>voicieiefqfkqefkqefhiehfknkdnksnknqklsnfkqnskfnq</p>
                    </div>

                    <div class="mx-auto my-1">

                    </div>
                </div>

            </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Error from './Error';
import axios from '../axios'
import Swal from 'sweetalert2'


export default {
    name: "AllPost",
    components : {
        Error
    },

    data () {
        return {
            title: '',
            content:'',
            id: localStorage.getItem('id'),
            image: [],
            video: '',
            error:'',
        }
    },

    computed: {
      ...mapState ( { user: state => state.user} ),
    },

    methods: {


        async handleSubmit () {
            // s'il y a rien dans ensemble des champs, on fait rien...
            if (this.title.length==0 && this.content ==0 && this.$refs.file.files.length ==0) {
                Swal.fire("Vous n'avez rien à nous dire ? ")
            }
            else {
            // si non, envoyer les infos par FormData
                let form = new FormData();
                for( var i = 0; i < this.$refs.file.files.length; i++ ){
                        let file = this.$refs.file.files[i];
                        form.append('files[' + i + ']', file);
                    }
                form.append('title', this.title)
                form.append('content', this.content)
                form.append('userId', this.id)

                // envoyer formulaire par axios, recevoir la response
                await axios.post("/api/post/", form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        Swal.fire("Votre article a été enregistré")
                        
                        // fermer manuellement la modal 
                        
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                    }) 
            }
        },
        

    }
}
</script>

<style scoped>
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