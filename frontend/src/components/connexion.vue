<template>
    <div class="container mt-5 m-auto text-center">
        <!-- Afficher les erreurs -->
        <div class="text-danger mx-auto mt-5 mb-5" v-if="errors.length">
            <ul>
                <li v-for= "error in errors" :key="error">{{error}}</li>
            </ul>
        </div>

        <!-- Afficher template signup avec toggle = on -->
        <div v-if="toggle"> 
            
            <div class="col-md-6 col-lg-6 mt-5 m-auto col">
                <Logo />
            </div>

            <h5 class="mb-5 font-weight-bolder pink fs-3">Indentifiez-vous</h5>

            <form class="form-group mt-5 mb-5 col col-md-8 col-lg-8 m-auto connexion text-center" method="post" action="http://localhost:5000/api/auth/login">
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

                <form class="form-group  mt-5 mb-5 col col-sm-8 col-md-6 col-lg-4 m-auto text-center" method="post" enctype="multipart/form-data" action="/signup" @submit.prevent = "inscriptionSubmit">

                    <div class="form-group row">
                        <input type="text"  id="nom" name="nom" placeholder="nom" v-model="nom" required pattern="[A-Za-z][A-Za-z' -]+" class="form-control"/>
                    </div>

                    <div class="form-group row ">
                        <input type="text"  id="prenom" name="prenom" v-model="prenom" placeholder="prénom" required pattern="[A-Za-z][A-Za-z' -]+" class="form-control"/>
                    </div>

                    <div class="form-group row ">
                        <input type="text" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo" required class="form-control"/>
                    </div>

                    <div class="form-group row ">
                        <input type="text"  id="fonction" name="fonction" v-model="fonction" placeholder="fonction" pattern="[A-Za-z][A-Za-z' -]+" class="form-control"/>  
                    </div>

                    <div class="form-group row ">
                        <input type="email"  id="email" name="email" v-model="email" placeholder="email" required class="form-control"/>
                        <span>{{emailError}}</span>
                    </div>

                    <div class="form-group row ">
                        <input type="password" id="password" name="password" v-model="password" placeholder="password" required class="form-control"/>
                        <span>{{passwordError}}</span>
                    </div>

                    <div class="form-group row ">
                        <input type="password" id="passwordCheck" name="passwordCheck" v-model="passwordCheck" placeholder="confirmer password" required class="form-control"/>
                        <span>{{passwordCheckError}}</span>
                    </div>
            
                    <div class="form-group row ">
                        <label class="form-text pink" for="avatar">Image profil (jpg, png, jpeg) </label>
                        <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="avatar" @input="loadAvatar">
                        <span id="error_file" class="text-center text-danger fw-bold"></span>

                    </div>

                     <div class="form-group form-check">
                        <input type="checkbox" v-model="accept" id="accept" required class="form-check-input">
                        <label class="form-check-label" for="accept">Accept conditions d'utilisation; </label>
                    </div>

                    <button type="submit" class="btn btn-primary text-center mb-5" id="button" >Valider</button>
            
                </form>

            </div>
                
        </div>
    </div> 
</template>

<script>
import Logo from '../components/Logo.vue';
import {  useField, useForm } from 'vee-validate';
import { ref, } from 'vue'

import * as yup from 'yup';

export default {
    name: "connexion",
    components: {
        Logo,
    },
    data () {
        return {
            nom:'',
            prenom:'',
            pseudo:'',
            fonction:'',
            avatar:'',
            toggle: false,
        }
    },
    setup () {
        // Define a validation schema
        const errors = ref([])
        // const toggle = ref(false);

        const schema = yup.object({
        email: yup.string()
                .required('Veuillez remplir votre email')
                .email('Email invalid'),
        password: yup.string()
                .min(8, 'Password doit avoir au minimum 8 characters')
                .max(20, 'Password doit avoir au maximum 20 characters')
                .required('Password is required')
                ,
        passwordCheck: yup.string()
                .oneOf([yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        });

    // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        // No need to define rules for fields
        const { value: email, errorMessage: emailError } = useField('email');
        const { value: password, errorMessage: passwordError } = useField('password');
        const { value: passwordCheck, errorMessage: passwordCheckError } = useField('passwordCheck');

    // methode switch Toggle pour switcher entre login et signup
        // const switchToggle = () => {
        //     if (toggle.value) { return toggle.value=false}
        //     if(toggle.value ==false) { return toggle.value == true}
        // }
        
        return {
            errors,
            email,
            emailError,
            password,
            passwordError,
            passwordCheck,
            passwordCheckError,
            // switchToggle
        };
    },

    methods: {
        // fonction pour switcher entre template login et signup
        switchToggle () {
            if (this.toggle) { return this.toggle=false}
            if(this.toggle ==false) { return this.toggle = true}
        },

        // fonction pour envoyer le formulaire et signup
        inscriptionSubmit: function () {
                // créer utilisateur
                let user = {
                    nom: this.nom,
                    prenom: this.prenom,
                    email: this.email,
                    password: this.password,
                    fonction: this.fonction,
                    avatar: this.avatar
                    };

                let form = new FormData();
                form.append("user", JSON.stringify(user));

                //envoyer le formulaire
            
                let optionFetch = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'},
                    body: form
                    };
                fetch('http://localhost:5000/api/auth/signup', optionFetch) 
                    .then((user) => {                            // récupérer user créé 
                        console.log("Utilisateur crée")
                        let email = user.email; 
                        let password = user.password;
                        this.login(email, password)              //login avec email, password 
                        })
                    .catch((error) => console.log(error))
                    
        },

        // fonction gérer le login
        login() {
            if(this.email && this.password) {
                let user = {
                    email: this.email,
                    password: this.password
                };

                let option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'},
                    body:JSON.stringify(user)
                    };
                fetch (("http://localhost:5000/api/auth/login"), option)
                    .then( () => {

                    } )  
                             
                    .catch((response) => {
                        if( !response.ok || response.status == 401) {
                            this.error = [];
                            this.error.push("Email ou password incorrect");
                            let err = response.text();
                            console.log(err)
                        }
                    })

                    // function handleResponse(response) {
                    //     return response.text()          // prendre le texte du response
                    //         .then((text) => {
                    //             const data = text;
                    //             if ( !response.ok) {        // si la response pas OK, on envoie message d'erreur email(401), sinon reject error 
                    //                 if (response.status ==401) {
                    //                     this.error = [];
                    //                     this.error.push("Email ou password incorrect")
                    //                 }
                    //                 const error = text || response.statusText();
                    //                 return new Promise.reject(error)
                    //             }
                    //             else {          // si le response est OK, on renvoie la response => data = text et traiter dans une promesse suivante
                    //                 return data
                    //             }
                    //         })
                    //         .catch((error) => response.status(500).json({error}))
                    // }
            }
        },

        // fonction pour upload file pour avatar
        // loadAvatar(e) {
        //     let error_file = document.getElementById('error_file');
        //     let avatar = document.getElementById('avatar').files[0];
        //     if(this.avatar.type!=("png" ||"jpg" || "jpeg")) { 
        //         e.preventDefault();
        //         error_file.innerHTML = "Veuillez choisir le bon format de l'image"
        //     }
        //     else { 
        //         this.avatar = avatar;
        //         error_file.innerHTML=""
        //     }
        // }
    }
}
</script>

<style scoped>

.pink {
    color: #16265e!important;
    font-weight:900;
    
}
</style>




