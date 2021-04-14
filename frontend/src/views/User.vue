<template>
    <div class="container">
   
        <div class="container mx-auto mt-5 mb-5 col-11 col-sm-11 col-md-10 col-lg-10 col-xl-10">
            
    <!-- Profil user-->

            <div class="row shadow rounded col d-flex mx-5 px-5 my-5 float-none">
                <img class="b-avatar-img" alt="avatar"  />
                <p class="align-self-center m-auto"> {{user.user.pseudo }} </p>

            </div>

            <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <h3 class="">A propos de moi</h3>
                <p class="">Nom et prenom : <strong>{{ user.user.nom }}</strong>  </p>
                <p class="">Pseudo : <strong>{{ user.user.pseudo }}</strong>  </p>
                <p class="">Avatar : <strong>{{ user.user.avatar }}</strong>  </p>

                <div class="text-center">
                    <button class="col col-md-6 col-lg-6 mx-1 btn btn-primary mb-3 text-center" @click.prevent = "updateUser">MODIFIER PROFIL</button> 
                    <button class="col col-md-6 col-lg-6 mx-1 btn btn-primary mb-3 text-center" @click.prevent = "updatePass">MODIFIER PASSWORD</button>
                </div>
            </div>


    <!-- Mes publications -->
            <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <h3> Mes publications </h3>

                <div class="border text-justify p-5">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>Titre du publication</h4><span>Icon crayon</span>
                    </div>

                    <div class=" ">
                        <p>
                        </p>
                    </div>
                    <div>
                        <a class="btn btn-dark">Photo/vidéo
                        </a>
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

export default {
    name: "User",
    data () {
        return {
            id: localStorage.getItem('id'),
            // url:""
        }
    },
    computed: {
      ...mapState ( { user: state => state.user} )
    },
    // created() {
    // // when the instance ist create call the method
    //     this.getUrl();
    // },
    methods: {
        async deleteUser () {
            console.log(this.id)        //OK
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

                if (password) {
                    console.log(password);          //OK
                    axios.delete(`api/auth/delete/${this.id}/${password}`)
                    .then((response) => {
                        console.log(response)
                        localStorage.removeItem('token');
                        this.$store.dispatch('user/setCurrentUser', null)
                        
                        Swal.fire("Votre compte a été supprimé. Retour à Home")
                        this.$router.push("/home")
                    })
                    .catch (error => {
                        console.log(error);
                        alert("Password incorrect, veuillez réessayer")

                        })        
            }
        },

        async updateUser () {
            this.$router.push("/updateProfil")
        },

        async updatePass () {
            this.$router.push("/updatePass")
        }

    },
    // getUrl() {
    //     console.log(this.store.user.avatar);
    //     this.url = `C:/Users/thanh/Desktop/projet7_ocr/backend/images/${this.store.user.avatar}`
    // }
    
}
</script>

<style scoped>
    img {
        width: 5rem
    }
</style>

