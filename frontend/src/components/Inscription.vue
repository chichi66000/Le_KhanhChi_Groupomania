<template>
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
                <p class="form-text pink" id="avatar">Votre photo</p>
                <input type="file" class="form-control-file pink">

            </div>
            <button type="submit" class="btn btn-primary text-center mb-5" id="button">Valider</button>
    
        </form>
    </div>
</template>

<script>
import Logo from "../components/Logo";
export default {
    name: "Inscription",
    components: {
        Logo
    },
}
</script>

<style scoped lang="scss">
.pink {
    color: #ea315f!important;
    font-weight:900; 
    margin-bottom: 2rem!important;
}
</style>