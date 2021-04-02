<template>
    <div class="container mt-5 m-auto text-center">
        <!-- Afficher les erreurs -->
        <div class="text-danger mx-auto mt-5 mb-5" v-if="errors.length">
            <ul>
                <li v-for= "error in errors" :key="error">{{error}}</li>
            </ul>
        </div>

        <!-- Afficher template signup avec toggle = on -->
        <div> 
            
            <div class="col-md-6 col-lg-6 mt-5 m-auto col">
                <Logo />
            </div>

            <h5 class="mb-5 font-weight-bolder pink fs-3">Indentifiez-vous</h5>

            <form class="form-group mt-5 mb-5 col col-md-8 col-lg-8 m-auto connexion text-center"  @submit.prevent = "login">
                <div class="form-group row ">
                    <label for="email" class="col col-form-label text-left pink font-weight-bolder fs-3">Email</label>
                    <div class="col-8">
                        <input type="email" class="form-control" id="email" v-model="email" placeholder="email">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="password" class="col col-form-label text-left pink font-weight-bolder fs-3">Mot de passe</label>
                    <div class="col-8">
                        <input type="password" class="form-control" id="password" v-model="password" placeholder="mot de passe">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary text-center" id="button">Connexion</button>
            </form>
            <!-- <div class="mt-3">
                <p class="pink font-weight-bolder">Vous n'avez pas encore de compte?</p>
                <button class="btn pink font-weight-bolder mt-2 fs-3 mb-5" @click="switchToggle">S'incrire</button>
            </div> -->

        </div>

        
    </div> 
</template>

<script>
// les components
import Logo from '../components/Logo';
// import user from '../store/user'

// pour connexion avec backend et serveur
import axios from '../axios'

export default {
    name: "Login",
    components: {
        Logo,
    },
    data () {
        return {
            email:"",
            password: "",
            errors: [],
            // store
        }
    },

    methods: {

        // fonction gérer le login
        async login() {
            let user = {                    //créer user
                email: this.email,
                password: this.password
            }
            await axios.post('api/auth/login', user)   // post au serveur
               .then((response) => {
                    // récupérer token dans localStorage pour maintenir la session
                    localStorage.setItem('token', response.data.token);
                    // console.log(this.$store.userId) 

                    // this.$store.commit('user/getToken', response.data.token)    // mettre user dans store
                    // this.$store.commit('user/getUserId', response.data.userId)
                    // this.$store.commit('user/getCurrentUser', response.data.currentUser)
                    // aller sur la page Home une fois connecté
                    this.$router.push('/home')
               } )
               .catch(error => console.log(error))
        }
    },
    // computed: {
    //     currentUser() {
    //         console.log($store.state.currentUser)
    //     }
    // }
}

</script>

<style scoped>

.pink {
    color: #16265e!important;
    font-weight:900;
    
}
</style>




