<template>
    <div class="navbar navbar-expand navbar-expand-sm">
        <div class="img-fluid text-left">
            <img src="../assets/images/icon-above-font.png" alt="icon entreprise Groupomania"/>
        </div>

        <div class="col font-weight-bolder fs-4">
            <router-link to="/">Home</router-link> |
            <router-link to="/help">FAQ</router-link> |
            <router-link to="/user">Profile</router-link> | -->
        </div>

        <div class="col text-right font-weight-bolder fs-4">
            <a class="" href="#">Déconnexion</a>
        </div>
    <router-view/>

    </div>
</template>
    
<script>

export default {
    name: "Navbar"
}
</script>

<style scoped>

</style>