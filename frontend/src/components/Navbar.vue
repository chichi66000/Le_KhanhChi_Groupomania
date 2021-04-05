<template>
    <div>
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
                <!-- <div class=" navbar-brand text-left col-1 col-sm-2 col-md-1 col-lg-1">
                    <img class=" logo" src="../assets/images/icon-above-font.png" alt="icon entreprise Groupomania"/>
                </div> -->

                <button class="navbar-toggle" type = "button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls = "navbarContent" aria-expanded="false" aria-label = "Toggle navigation">
                    <!-- <span class ="navbar-toggle-icon"></span> -->
                </button>

                <div id="navbarContent" class="collapse navbar-collapse col col-sm-8 col-md-8 col-lg-8 mx-auto text-center font-weight-bolder justify-self-center dropdown-menu-lg-right justify-content-between text-light">
                    <div class=" ">
                        <router-link to="/home">HOME</router-link>
                    </div>
                    <div class=" collape navbar-collapse ">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item px-5">
                                <router-link to="/login">Login</router-link>
                            </li>
                            <li class="nav-item px-5">
                                <router-link to="/signup">Signup</router-link>
                            </li>
                        </ul>

                    </div>

                    <!-- <router-link to="/">Home  </router-link> 
                    <router-link to="/help">FAQ  </router-link> 
                    <router-link to="/user">Profile  </router-link> 
                    <a class="" href="#">Déconnexion</a> -->
                </div>

        </nav>

        <!-- <router-view></router-view> -->

    </div>
</template>
    
<script>

export default {
    name: "Navbar"
}
</script>

<style scoped>

</style>