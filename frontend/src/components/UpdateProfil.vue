<template>
    <div class="container-fluid">

        <!-- Formulaire pour modifier profil -->
        <form class="form-group  mt-5 mb-5 col col-sm-12 col-md-8 col-lg-6 mx-auto text-center" method="post" enctype="multipart/form-data" action="http://localhost:5000/api/auth/signup" @submit.prevent="inscriptionSubmit">

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
                <label class="form-text" for="avatar">Image profil (jpg, png, jpeg) </label>
                <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="avatar" @input="loadAvatar">
                <span id="error_file" class="text-center text-danger fw-bold"></span>

            </div>
            <button type="submit" class="btn btn-primary text-center mb-5" id="button" >Confirmer</button>
    
        </form>

    </div>
    
</template>

<script>

export default {
    name: "UpdateProfil",
    
}
</script>

<style scoped>

</style>