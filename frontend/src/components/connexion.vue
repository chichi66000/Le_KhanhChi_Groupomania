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
                <button class="btn d-flex col-1 col-md-1 col-lg-1 justify-content-end pink align-self-center" @click="switchToggle">Login</button>
            </div>
            <div>
                <Inscription/> 
            </div>
            
        </div>
    </div> 
</template>

<script>
import Logo from '../components/Logo.vue';
import Inscription from "./Inscription"
export default {
    name: "connexion",
    components: {
        Logo, Inscription,
    },
    data () {
        return {
            toggle: false,
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
.connexion {
    margin-top: 10rem!important;
}

.pink {
    color: #ea315f!important;
    font-weight:900;
    
}
</style>