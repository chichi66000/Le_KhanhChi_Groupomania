<template>
    <div class="container mt-5 m-auto text-center">
        <!-- Afficher template signup avec toggle = on -->
        <div v-if="toggle"> 
            
            <div class="col-md-6 col-lg-6 mt-5 m-auto col">
                <Logo />
            </div>

            <h5 class="mb-5 font-weight-bolder pink fs-3">Indentifiez-vous</h5>

            <form class="form-group mt-5 mb-5 col col-md-8 col-lg-8 m-auto connexion text-center" method="post" action="http://localhost:3000/api/login">
                <div class="form-group row ">
                    <label for="email" class="col col-form-label text-left pink font-weight-bolder fs-3">Email</label>
                    <div class="col-8">
                        <input type="email" class="form-control" id="email" v-model="email" placeholder="email">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="password" class="col col-form-label text-left pink font-weight-bolder fs-3">Mot de passe</label>
                    <div class="col-8">
                        <input type="text" class="form-control" id="password" v-model="password" placeholder="mot de passe">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary text-center" id="button" @submit="login">Connexion</button>
            </form>
            <div class="mt-3">
                <p class="pink font-weight-bolder">Vous n'avez pas encore de compte?</p>
                <button class="btn pink font-weight-bolder mt-2 fs-3 mb-5" @click="switchToggle">S'incrire</button>
            </div>
        </div>

        <!-- Afficher template Inscription quand toggle = off -->
        <div v-else >
            <div>
                <button class="btn d-flex col-1 col-md-1 col-lg-1  pink font-weight-bolder mt-3" @click="switchToggle">Login</button>
            </div>
            <div id="inscription" class="container m-auto text-center">

                <div class="col-md-6 col-lg-6 col m-auto">
                        <Logo />
                </div>

                <h5 class="pink pb-5 fw-bold fs-3 m-auto text-center">Inscription</h5>

                <form class="form-group  mt-5 mb-5 col col-sm-8 col-md-6 col-lg-4 m-auto text-center" method="post" enctype="multipart/form-data" action="http://localhost:3000/api/signup">
                    <div class="form-group row ">
                        <input type="text" class="form-control" id="nom" name="nom" placeholder="nom" v-model="nom" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="prenom" name="prenom" v-model="prenom" placeholder="prénom" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="fonction" name="fonction" v-model="fonction" placeholder="fonction">
                    </div>

                    <div class="form-group row ">
                        <input type="email" class="form-control" id="email" name="email" v-model="email" placeholder="email" required>
                    </div>

                    <div class="form-group row ">
                        <input type=password class="form-control" id="password" name="password" v-model="password" placeholder="password" required>
                    </div>

                    <div class="form-group row ">
                        <input type="password" class="form-control" id="passwordCheck" name="passwordCheck" v-model="passwordCheck" placeholder="confirmer password" required>
                    </div>
            
                    <div class="form-group row ">
                        <label class="form-text pink" for="avatar">Image profil</label>
                        <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="avatar" @input="loadAvatar">

                    </div>
                    <button type="submit" class="btn btn-primary text-center mb-5" id="button" @submit="inscriptionSubmit">Valider</button>
            
                </form>
            </div>
                
        </div>
    </div> 
</template>

<script>
import Logo from '../components/Logo.vue';
// import Inscription from "./Inscription"
export default {
    name: "connexion",
    components: {
        Logo
    },
    data () {
        return {
            toggle: false,
            nom:'',
            prenom:'',
            email:'',
            pseudo:'',
            fonction:'',
            password:'',
            passwordCheck:'',
            avatar:'',
        }
    },
    methods: {
        // fonction pour switcher entre template login et signup
        switchToggle () {
            if (this.toggle) { return this.toggle=false}
            if(this.toggle ==false) { return this.toggle = true}
        },

        // fonction pour envoyer le formulaire et signup
        inscriptionSubmit () {
            // si les champs required sont vide 
            if( this.nom==null || this.prenom == null || this.email==null || this.password == null || this.pseudo == null || this.passwordCheck == null) {
                window.alert('Veuillez remplir les informations manquantes')
            } 
            // si password n'est pas le même dans 2 champs
            if(this.password!== this.passwordCheck) {
                window.alert('Votre mot de passe doit être le même pour les 2 champs')
            }
            // si tout est OK, créer user
            else {
                const user = {
                    nom: this.nom,
                    prenom: this.prenom,
                    email: this.email,
                    password: this.password,
                    fonction: this.fonction,
                    avatar: ''
                };
                // s'il user n'a pas photo pour avatar
                if(this.avatar==null) {
                    console.log('Avatar absent')
                }
                // s'il user a fourni photo pour avatar
                else { return user.avatar = this.avatar}

                //envoyer le formulaire
                let form = new FormData();
                form.append("user", JSON.stringify(user));
                
                let optionFetch = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'},
                    body:form
                };
                let response = fetch('http://localhost:3000/api/signup', optionFetch); 

                response.then(() => {
                    // reécuperer token et aller sur la page Home???
                })
                        .catch((error) => console.log(error))
            }
        },

        // fonction gérer le login
        login() {},

        // fonction pour upload file pour avatar
        loadAvatar() {}
    }
}
</script>

<style scope>

.pink {
    color: #16265e!important;
    font-weight:900;
    
}
</style>




