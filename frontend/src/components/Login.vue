<template>
    <div class="container mt-3 mb-3 mx-auto text-center">
        <!-- Afficher les erreurs -->
        <error v-if="error" :error = "error"/>

        <div> 
            
            <div class="col-md-6 col-lg-6 mx-auto col">
                <Logo />
            </div>

            <h5 class="mb-3 font-weight-bolder pink fs-3">Indentifiez-vous</h5>

            <form class="form-group col col-md-8 col-lg-6 m-auto connexion text-center col shadow rounded mx-5 my-5 p-3"  @submit.prevent = "login">
                <div class="form-group row ">
                    <label for="email" class="col col-form-label text-left pink font-weight-bolder fs-6">Email</label>
                    <div class="col-8">
                        <input type="email" class="form-control" id="email" v-model="email" placeholder="email">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="password" class="col col-form-label text-left pink font-weight-bolder fs-6">Mot de passe</label>
                    <div class="col-8">
                        <input type="password" class="form-control" id="password" v-model="password" placeholder="mot de passe">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary text-center" id="button">Connexion</button>

                <p class=" forgot-password my-3 text-right">
                    <router-link to="forgot">Forgot password</router-link>
                </p>
            </form>
            

        </div>

        
    </div> 
</template>

<script>
// les components
import Logo from './Logo';
import Error from './Error';
// import user from '../store/user'

// pour connexion avec backend et serveur
import axios from '../axios'
// import store from '../store'

export default {
    name: "Login",
    components: {
        Logo,
        Error
    },
    data () {
        return {
            email:"",
            password: "",
            error: "",
            // store
        }
    },

    methods: {

        // fonction gérer le login
        async login() {
            try {
                let user = {                    //créer user
                    email: this.email,
                    password: this.password
                }
                await axios.post('api/auth/login', user)   // post au serveur
                    .then((response) => {
                        // récupérer token dans localStorage pour maintenir la session
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('id', response.data.currentUser.userId);
                        // localStorage.setItem('nom', response.data.currentUser.nom)
                        // localStorage.setItem('email', response.data.currentUser.email)
                        // localStorage.setItem('pseudo', response.data.currentUser.pseudo)
                        // localStorage.setItem('avatar', response.data.currentUser.avatar)

                        // console.log (response.data.currentUser.userId)   //OK
                        // console.log (response.data.currentUser)         //OK
                        
                        this.$store.dispatch ('user/setCurrentUser', response.data.currentUser)
                        
                        // aller sur la page Home une fois connecté
                        this.$router.push('/')
                    } )
                    .catch( (e) => { 
                        console.log(e);
                        this.error = "Email/password Invalid"
                    })
            } catch (err) { console.log( "err" + err) }
        }
    }
}

</script>

<style scoped>

.pink {
    color: #16265e!important;
    font-weight:900;
    
}
</style>




