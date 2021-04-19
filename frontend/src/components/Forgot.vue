<template>
    <div class="text-center">
        <error v-if="error" :error ="error" class="mx-auto text-center my-5 col col-md-5 col-lg-4 col-xl-4" />

        <form class="mx-auto text-center my-5 col col-md-5 col-lg-4 col-xl-4" @submit.prevent = "handleSubmit">
            <h3 class="text-primary my-5">
                Forgot password
            </h3>
            <div class="form-group">
                <input id="email" required type="email" class="form-control" placeholder="Email" v-model="email">
            </div>
            <button class="btn btn-primary">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios'
import Error from './Error'
import Swal from 'sweetalert2'

export default {
    name: 'Forgot',
    components: {
        Error
    },
    data() {
        return { 
            email:"",
            error:""
        }
    },
    methods: {
        async handleSubmit() {
            try{
                await axios.post('api/auth/forgot', { email: this.email })
                    .then( (response) => {console.log(response);
                    /* this.error="Vérifier votre email et suivre instruction"*/ 
                    Swal.fire("Email envoyé, veuillez suivre les instructions!")
                    // alert ("")
                    })
                    .catch( (err) => {
                        console.log(err);
                        this.error = "Email non trouvé, veuillez réessayer"
                        })
            }
            catch (e) { console.log(e); this.error = "Email non trouvé, veuillez réessayer!!!"}
        }
    }
}

</script>