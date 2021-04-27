<template>
    <div class="container">
   
        <div class="container mx-auto mt-5 mb-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10">
            <error v-if="error" :error = "error"/>
    <!-- Profil user-->

            <!-- Partie afficher avatar -->
            <div class="row shadow rounded col d-flex mx-5 px-5 my-5 float-none">
                <img class="img-fluid m-2 text-left " alt="avatar" :src= "`http://localhost:5000/images/${user.user.avatar}`" />
                <p class="m-2 p-2 text-left font-weight-bold"> {{user.user.userPseudo }} </p>

            </div>

            <!-- Partie afficher le profil et modifier -->
            <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
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
            <div v-if="user.user.isAdmin===true" class="text-center col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <button class="btn col col-md-6 col-lg-6 mx-auto btn btn-primary mb-3 text-center" @click.prevent = "admin">Gérer les utilisateurs</button>
            </div>

            <!-- Mes publications -->
            <div class="accordion col shadow rounded mx-5 mt-3 mb-3 px-5 py-5" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button @click="getUserPosts" class="accordion-button btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Mes publications
                        </button>
                    </h2>
                    <div :key="userPost" v-for="(userPost) in userPosts"  id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body shadow my-3">
                            <h4 class="font-weight-bold">{{userPost.title}}</h4>
                            <p class="p-2 text-center"> {{userPost.content}}</p>

                            <!-- <div :key="lien" v-for="(lien) in liens" >
                                {{lien}}
                                <img  :src="getUser_Url_img(index)"/>
                            </div> -->
                            
                        </div>
                    </div>

                </div>
            </div>


            <!-- Supprimer le compte user -->
            <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
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
            url:'',
            error: '',
            userPosts: [],
            url_img: [],
            // liens: []
        }
    },
    computed: {
      ...mapState ( { user: state => state.user} ),
    },
    
    async created () {
        
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
            await axios.get(`api/post/${this.id}`)      //demander le server
            .then( response => {
                console.log(response.data);
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

        // getUser_Url_img (index) {
            
        //     if (this.url_img[index].split(' ') != "") {
        //         this.liens.push(this.url_img[index].split(' '))
        //     }
        //     // for ( let i=0; i<this.liens.length; i++) {
        //     //     console.log(`http://localhost:5000/images/${this.liens[i]}`)
        //     //     return `http://localhost:5000/images/${this.liens[i]}`
        //     // }
        // },
    },

    
    
}
</script>

<style scoped>
    img {
        width: 10rem !important
    }
</style>

