<template>
    <div class="container-fluid">

        <!-- Formulaire pour modifier profil -->
        <form class="form-group  mt-5 mb-5 col col-sm-12 col-md-8 col-lg-6 mx-auto text-center" method="post" enctype="multipart/form-data"  @submit.prevent = "changeProfil">

            <div class="form-group row ">
                <label for="pseudo" class="col-form-label col-sm-2">Pseudo</label>

                <input type="text" class="form-control col-sm-10" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo">
                <span>{{pseudoError}}</span>
            </div>

            <div class="form-group row ">
                <label for="fonction" class="col-form-label col-sm-2">Fonction</label>

                <input type="text" class="form-control col-sm-10" id="fonction" name="fonction" v-model="fonction" placeholder="fonction" pattern="[A-Za-z][A-Za-z' -]+">
                <span>{{fonctionError}}</span>
            </div>

            <div class="form-group row ">
                <label for="email" class="col-form-label col-sm-2">Email</label>

                <input type="email" class="form-control col-sm-10" id="email" name="email" v-model="email" placeholder="email">
                <span>{{emailError}}</span>
            </div>

            <div class="form-group row ">
                <label class="form-text" for="image">Image profil (jpg, png, jpeg) </label>
                <input type="file" class="form-control-file pink" id="image" accept=".jpg, .png, .jpeg" name="image" @change="onChangeFile">
                <span id="error_file" class="text-center text-danger fw-bold"></span>

            </div>
            <button type="submit" class="btn btn-primary text-center mb-5" id="button" >Confirmer</button>
    
        </form>

    </div>
    
</template>

<script>
import {  useField, useForm } from 'vee-validate';
import { ref, } from 'vue'
import * as yup from 'yup'; 
import axios from '../axios';
import Swal from 'sweetalert2'

export default {
    name: "UpdateProfil",
    
    setup(){
        // Define a validation schema
        const error = ref([])
        const schema = yup.object({ 
            email: yup.string()
                .required('Veuillez remplir votre email')
                .email('Email invalid'),
            pseudo: yup.string(),
            fonction: yup.string(),

        })
        // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        // No need to define rules for fields
        const { value: email, errorMessage: emailError } = useField('email');
        const { value: pseudo, errorMessage: pseudoError } = useField('pseudo');
        const { value: fonction, errorMessage: fonctionError } = useField('fonction');
        return {
            fonction,
            fonctionError,
            pseudo,
            pseudoError,
            email,
            emailError,

            error
        }
    },
    data () {
        return {
            avatar: '',
            id: localStorage.getItem('id')
        }
    },
    methods: {
        // fonction pour upload photo dans avatar
        onChangeFile(e) {
            this.avatar = e.target.files[0];
            console.log(this.avatar);
        },

        async changeProfil () {
            let email= this.email;
            let fonction = this.fonction;
            let pseudo = this.pseudo;

            let form = new FormData();
            form.append("email", email);
            form.append("fonction", fonction);
            form.append("pseudo", pseudo);
            form.append("image", this.avatar)

            await axios.put(`/api/auth/updateUser/${this.id}`, form)
                .then( response => {
                    console.log(response);
                    Swal.fire("Votre profil a été modifié.")
                    
                    this.$router.push('/home')
                })
                .catch( err => {
                    console.log(err);
                })
        }
    }
}
</script>

<style scoped>

</style>