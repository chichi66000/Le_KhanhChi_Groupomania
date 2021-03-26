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
                        <input type="text"  id="nom" name="nom" placeholder="nom" v-model="userForm.nom" required pattern="[A-Za-z][A-Za-z' -]+" class="form-control" 
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.nom.$error }"/>
                        <div v-if="isSubmitted && !$v.userForm.name.required" class="invalid-feedback">Veuillez remplir votre nom</div>
                    </div>

                    <div class="form-group row ">
                        <input type="text"  id="prenom" name="prenom" v-model="userForm.prenom" placeholder="prénom" required pattern="[A-Za-z][A-Za-z' -]+" class="form-control"
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.prenom.$error }"/>
                        <div v-if="isSubmitted && !$v.userForm.prenom.required" class="invalid-feedback">Veuillez remplir votre prénom</div>
                    </div>

                    <div class="form-group row ">
                        <input type="text" id="pseudo" name="pseudo" v-model="userForm.pseudo" placeholder="Votre pseudo" required class="form-control"
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.pseudo.$error }"/>
                        <div v-if="isSubmitted && !$v.userForm.pseudo.required" class="invalid-feedback">Veuillez remplir votre pseudo</div>
                    </div>

                    <div class="form-group row ">
                        <input type="text"  id="fonction" name="fonction" v-model="userForm.fonction" placeholder="fonction" pattern="[A-Za-z][A-Za-z' -]+" class="form-control"/>  
                    </div>

                    <div class="form-group row ">
                        <input type="email"  id="email" name="email" v-model="userForm.email" placeholder="email" required class="form-control"
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.email.$error }" />
                        <div v-if="isSubmitted && $v.userForm.email.$error" class="invalid-feedback">
                            <span v-if="!$v.userForm.email.required">Email est demandé</span>
                            <span v-if="!$v.userForm.email.email">Invalid email</span>
                        </div>
                    </div>

                    <div class="form-group row ">
                        <input type="password" id="password" name="password" v-model="userForm.password" placeholder="password" required class="form-control"
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.password.$error }"/>
                        <div v-if="isSubmitted && $v.userForm.password.$error" class="invalid-feedback">
                            <span v-if="!$v.userForm.password.required">Veuillez remplir votre password</span>
                            <span v-if="!$v.userForm.password.minLength">Password doit avoir au moins 8 charactères</span>
                            <span v-if="!$v.userForm.password.maxLength">Password ne peut pas dépasser 20 charactères</span>
                        </div>
                    </div>

                    <div class="form-group row ">
                        <input type="password" id="passwordCheck" name="passwordCheck" v-model="userForm.passwordCheck" placeholder="confirmer password" required class="form-control"
                            :class="{ 'is-invalid': isSubmitted && $v.userForm.passwordCheck.$error }" />
                        <div v-if="isSubmitted && $v.userForm.passwordCheck.$error" class="invalid-feedback">
                            <span v-if="!$v.userForm.passwordCheck.required">Veuillez confirmer votre password</span>
                            <span v-else-if="!$v.userForm.passwordCheck.sameAsPassword">Votre mot de passe doit être le même pour les 2 champs </span>
                        </div>
                    </div>
            
                    <div class="form-group row ">
                        <label class="form-text pink" for="avatar">Image profil (jpg, png, jpeg) </label>
                        <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="avatar" @input="loadAvatar">
                        <span id="error_file" class="text-center text-danger fw-bold"></span>

                    </div>

                     <div class="form-group form-check">
                        <input type="checkbox" v-model="userForm.accept" @change="$v.userForm.accept.$touch()" id="accept" class="form-check-input">
                        <label class="form-check-label" :class="{ 'is-invalid': isSubmitted && $v.userForm.accept.$error }" for="accept">Accept terms &nbsp; conditions</label>

                        <div v-if="isSubmitted && $v.userForm.accept.$error" class="invalid-feedback">
                            <span v-if="!$v.userForm.accept.required">Accept terms and conditions</span>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary text-center mb-5" id="button" @submit="inscriptionSubmit">Valider</button>
            
                </form>

            </div>
                
        </div>
    </div> 
</template>

<script>
import Logo from '../components/Logo.vue';
// import { validationMixin } from 'vuelidate'
import {
        required,
        email,
        minLength,
        maxLength,
        sameAs
    } from "vuelidate/lib/validators";
// var Component = Vue.extend({
//     mixins: [validationMixin],
//     validations: {}
// })
export default {
    name: "connexion",
    components: {
        Logo,
    },
    data () {
        return {
            userForm: {
                nom:'',
                prenom:'',
                email:'',
                pseudo:'',
                fonction:'',
                password:'',
                passwordCheck:'',
                avatar:'',
                // errors: [],
                accept: ""
            },
            toggle: false,
            isSubmitted: false
        }
    },
    validations: {
            userForm: {
                nom: {
                    required
                },
                prenom: {
                    required
                },
                pseudo: {
                    required
                },
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8),
                    maxLength: maxLength(20)
                },
                confirmPassword: {
                    required,
                    sameAsPassword: sameAs('password')
                },
                accept: {
                    required (val) {
                      return val
                    }
                }
            }
        },
    methods: {
        // fonction pour switcher entre template login et signup
        switchToggle () {
            if (this.toggle) { return this.toggle=false}
            if(this.toggle ==false) { return this.toggle = true}
        },

        // fonction pour envoyer le formulaire et signup
        inscriptionSubmit: function () {
            // si les champs required sont vide 
            // if(this.nom==null || this.prenom == null || this.email==null || this.password == null || this.pseudo == null || this.passwordCheck == null) {
            //     e.preventDefault();
            //     this.errors.push("Veuillez remplir les informations manquantes")
            // } 
            // si password n'est pas le même dans 2 champs
            //     e.preventDefault();
            //     this.errors = []
            // if(this.password!== this.passwordCheck) {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     this.errors.push("Votre mot de passe doit être le même pour les 2 champs")
            //     console.log("Votre mot de passe doit être le même pour les 2 champs")
            // }
            // else if () {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     this.errors.push("Password doit comprendre entre 8 et 20 charactères")
            // }
            // si tout est OK, créer user
            
                let user = {
                    nom: this.userForm.nom,
                    prenom: this.userForm.prenom,
                    email: this.userForm.email,
                    password: this.userForm.password,
                    fonction: this.userForm.fonction,
                    avatar: this.userForm.avatar
                    };
                let form = new FormData();
                form.append("user", JSON.stringify(user));

                //envoyer le formulaire
            
                let optionFetch = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'},
                    body:form
                    };
                let promise = fetch('http://localhost:5000/api/auth/signup', optionFetch); 
                promise.then((response) => {  
                        console.log(response);
                        console.log("Utilisateur crée")
                        })
                        .catch((error) => console.log(error))
                    // faire login pour utilisateur
                let that = this;
                let response = promise;
                    return (response,
                        setTimeout(function() {
                            that.login();
                        }, 500))
        },

        // fonction gérer le login
        login: function () {},

        // fonction pour upload file pour avatar
        loadAvatar(e) {
            let error_file = document.getElementById('error_file');
            let avatar = document.getElementById('avatar').files[0];
            if(avatar.type!==("png" ||"jpg" || "jpeg")) { 
                e.stopPropagation();
                error_file.innerHTML = "Veuillez choisir le bon format de l'image"
            }
            else { 
                this.avatar = avatar
            }
        }
    }
}
</script>

<style scope>

.pink {
    color: #16265e!important;
    font-weight:900;
    
}
</style>




