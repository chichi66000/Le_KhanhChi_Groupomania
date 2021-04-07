<template>
    <div class="container-fluid">

        <!-- Formulaire pour modifier profil -->
        <form class="form-group  mt-5 mb-5 col col-sm-12 col-md-8 col-lg-6 mx-auto text-center" method="post" enctype="multipart/form-data" action="http://localhost:5000/api/auth/signup">
            <div class="form-group row ">
                <label for="nom" class="col-form-label col-sm-2">Nom</label>
                <input type="text" class="form-control col-sm-10" id="nom" name="nom" placeholder="nom" v-model="nom" pattern="[A-Za-z][A-Za-z' -]+">
            </div>

            <div class="form-group row ">
                <label for="prenom" class="col-form-label col-sm-2">Prénom</label>

                <input type="text" class="form-control col-sm-10" id="prenom" name="prenom" v-model="prenom" placeholder="prénom" pattern="[A-Za-z][A-Za-z' -]+">
            </div>

            <div class="form-group row ">
                <label for="pseudo" class="col-form-label col-sm-2">Pseudo</label>

                <input type="text" class="form-control col-sm-10" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo">
            </div>

            <div class="form-group row ">
                <label for="fonction" class="col-form-label col-sm-2">Fonction</label>

                <input type="text" class="form-control col-sm-10" id="fonction" name="fonction" v-model="fonction" placeholder="fonction" pattern="[A-Za-z][A-Za-z' -]+">
            </div>

            <div class="form-group row ">
                <label for="email" class="col-form-label col-sm-2">Email</label>

                <input type="email" class="form-control col-sm-10" id="email" name="email" v-model="email" placeholder="email">
            </div>

            <div class="form-group row ">
                <label for="password" class="col-form-label col-sm-2">Ancien Password</label>

                <input type="password" class="form-control col-sm-10" id="password" name="password" v-model="password" placeholder="ancien password" min="8" max="20">
            </div>

            <div class="form-group row ">
                <label for="passwordCheck" class="col-form-label col-sm-2">Nouveau Password</label>

                <input type="password" class="form-control col-sm-10" id="passwordCheck" name="passwordCheck" v-model="passwordCheck" placeholder="nouveau password" min="8" max="20">
            </div>
    
            <div class="form-group row ">
                <label class="form-text" for="avatar">Image profil (jpg, png, jpeg) </label>
                <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="avatar" @input="loadAvatar">
                <span id="error_file" class="text-center text-danger fw-bold"></span>

            </div>
            <button type="submit" class="btn btn-primary text-center mb-5" id="button" @submit="inscriptionSubmit">Confirmer</button>
    
        </form>

        <!-- Footer -->
        <Footer/>

    </div>
    
</template>

<script>
import Footer from "../components/Footer";

export default {
    name: "ModiProfil",
    components: {
       Footer
    }
}
</script>

<style scoped>

</style>