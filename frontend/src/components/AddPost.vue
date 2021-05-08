<template>
    <div>
        <error v-if="error" :error = "error"/>

    <!-- Partie pour créer un post -->
        <div class="border text-center p-2 m-auto my-3 bg-white">
                    <button type="button" class="btn btn-primary col col-sm-11 col-md-6 col-lg-4 col-xl-4 gray" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Que voulez vous dire ?
                    </button>

                    <div class="d-flex mx-auto col col-sm-11 col-md-6 col-lg-4 col-xl-4">
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

                                    <div class="form-floating">
                                        <input v-model="title" class="form-control fs-5" id="staticBackdropLabel" type="text" placeholder="Titre" max="50"/>
                                        <label for="staticBackdropLabel">Titre</label>
                                        <p class="flou"> Ne pas utiliser les caracters spéciaux, max 50 characters</p>
                                    </div>

                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>

                                </div>

                                <div class="form-group">
                                    <textarea v-model="content" class="form-control px-2" id="text " placeholder = "Votre message"></textarea>
                                    <label for="text"></label>
                                </div>
                                    
                                    <div class="input-group">
                                        
                                            <input @change="onChangeFile" type="file" ref="file" class="form-control-file" id="inputGroupFile03" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie">
                                            
                                            <label class="form-group"  id="inputGroupFileAddon03"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label>

                                            <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .avi, .mp4, .wav, .flv, .mov, .wmv, .movie; taille: 15Mo )</span>
                                    </div>

                                <!-- </div> -->

                                <div class="modal-footer">

                                    <button @click="handleSubmit"  id="closeModal"  data-bs-dismiss="modal" type="submit" class="my-4 text-center mx-auto btn-primary" >Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '../axios'
import Swal from 'sweetalert2'
import Error from './Error';
export default {
    name: "AddPost",
    components: {
        Error,
    },
    data () {
        return {
            title: '',
            content:'',
            id: localStorage.getItem('id'),
            image: '',
            video: '',
            error:'',
        }
    },
    props: {
        // fonction getAllPosts
        method: { type: Function },
    },
    methods: {
        // fonction pour upload photo dans avatar
        onChangeFile(e) {
            this.image = e.target.files[0];
            console.log(this.image)
        },

        async handleSubmit () {
            // s'il y a rien dans ensemble des champs, on fait rien...
            if (this.title.length==0 && this.content ==0 && this.$refs.file.files.length ==0) {
                Swal.fire("Vous n'avez rien à nous dire ? ")
            }
            else {
            // si non, envoyer les infos par FormData
            console.log(this.image)
                let form = new FormData();
                form.append('title', this.title)
                form.append('content', this.content)
                form.append('userId', this.id)
                form.append('image', this.image)

                // envoyer formulaire par axios, recevoir la response
                await axiosInstance.post("/api/post/", form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        this.$store.dispatch ('post/getAllPosts', response.data)
                        Swal.fire("Votre article a été enregistré")
                        // fermer manuellement la modal 
                        // document.querySelector('.modal').hide('modal')           // ne marche pas
                        this.error=""
                        // reload la page des publications
                        this.method()
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                    }) 
            }
        },
        

    },
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
</style>>
