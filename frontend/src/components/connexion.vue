<template>
    <div class="container mt-5 m-auto text-center">
        <div v-if="toggle">
            <div class="col-md-6 col-lg-6 mt-5 m-auto col">
                <Logo />
            </div>

            <h5 class="mb-5 font-weight-bolder pink fs-3">Indentifiez-vous</h5>

            <form class="form-group mt-5 mb-5 col col-md-8 col-lg-8 m-auto connexion text-center">
                <div class="form-group row ">
                    <label for="email" class="col col-form-label text-left pink font-weight-bolder fs-3">Email</label>
                    <div class="col-8">
                        <input type="email" class="form-control" id="email" placeholder="email">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="password" class="col col-form-label text-left pink font-weight-bolder fs-3">Mot de passe</label>
                    <div class="col-8">
                        <input type="text" class="form-control" id="password" placeholder="mot de passe">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary text-center" id="button">Connexion</button>
            </form>
            <div class="mt-3">
                <p class="pink font-weight-bolder">Vous n'avez pas encore de compte?</p>
                <button class="btn pink font-weight-bolder mt-2 fs-3 mb-5" @click="switchToggle">S'incrire</button>
            </div>
        </div>

        <div v-else >
            <div>
                <button class="btn d-flex col-1 col-md-1 col-lg-1  pink font-weight-bolder" @click="switchToggle">Login</button>
            </div>
            <div id="inscription" class="container mt-5 m-auto text-center">

                <div class="col-md-6 col-lg-6 mt-5 m-auto col justify-content-center">
                        <Logo />
                </div>

                <h5 class="pink mb-5 fw-bold fs-3 m-auto text-center">Inscription</h5>

                <form class="form-group  mt-5 mb-5 col col-sm-8 col-md-6 col-lg-4 m-auto text-center">
                    <div class="form-group row ">
                        <input type="text" class="form-control" id="nom" placeholder="nom" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="prenom" placeholder="prénom" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="pseudo" placeholder="Votre pseudo" required>
                    </div>

                    <div class="form-group row ">
                        <input type="text" class="form-control" id="fonction" placeholder="fonction">
                    </div>

                    <div class="form-group row ">
                        <input type="email" class="form-control" id="email" placeholder="email" required>
                    </div>

                    <div class="form-group row ">
                        <input type=password class="form-control" id="password" placeholder="password" required>
                    </div>

                    <div class="form-group row ">
                        <input type="password" class="form-control" id="re_password" placeholder="confirmer password" required>
                    </div>
            
                    <div class="form-group row ">
                        <label class="form-text pink" for="avatar">Image profil</label>
                        <input type="file" class="form-control-file pink" id="avatar">

                    </div>
                    <button type="submit" class="btn btn-primary text-center mb-5" id="button">Valider</button>
            
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
            avatar:'',
        }
    },
    methods: {
        switchToggle () {
            if (this.toggle) { return this.toggle=false}
            if(this.toggle ==false) { return this.toggle = true}
        }
    }
}
</script>

<style scope>

.pink {
    color: #ea315f!important;
    font-weight:900;
     /* process.env.NODE_ENV ||  */
}
</style>




