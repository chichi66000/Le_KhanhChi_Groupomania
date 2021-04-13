<template>
    <div>
        <h3 class="text-center my-5 mx-auto">Modifier votre password</h3>
        
        <error v-if="error" :error = "error"/>

        <form @submit.prevent="changePass" class="form-group my-5 text-center col col-md-5 col-lg-4 col-xl-4 mx-auto">
            <div class="form-group">

                <input type="password" class="form-control col-sm-10" id="oldPass" name="oldPass" v-model="oldPass" placeholder="ancien password" min="8" max="20">
            </div>

            <div class="form-group">

                <input type="password" class="form-control col-sm-10" id="newPass" name="newPass" v-model="newPass" placeholder="nouveau password" min="8" max="20">
                <span>{{newpassError}}</span>
            </div>

            <button class="btn btn-primary my-2">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios'
import Error from './Error'
import {  useField, useForm } from 'vee-validate';
import { ref, } from 'vue'
import * as yup from 'yup';     

export default {
    name: "UpdatePass",
    components: {
        Error
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            oldPass:"",
            // newPass:"",
            // error:""
        }
    },
    setup() {
        // Define a validation schema
        const error = ref([])
        const schema = yup.object({ 
            newPass: yup.string()
                .min(8, 'Password doit avoir au minimum 8 characters')
                .max(20, 'Password doit avoir au maximum 20 characters')
                .required('Password is required')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Password doit avoir au minimum 1 majuscule, 1 minucule, 1 chiffre, 1 charactère spécial")
                ,
        })
        // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        const { value:newPass, errorMessage: newpassError } = useField('newPass');
        return {
            error,
            newPass,
            newpassError
        };
    },
    methods: {
        async changePass () {
            await axios.patch(`api/auth/updatepassword/${this.id}`, {
                oldPass: this.oldPass,
                newPass: this.newPass
            })
                .then( response => {
                    console.log(response);
                })
                .catch( e => {
                    console.log(e);
                    this.error= "Password incorrect"
                })
        }
    }
    
}
</script>