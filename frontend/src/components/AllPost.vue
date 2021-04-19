<template>
    <div>
        <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">
                <h3 class="text-center mx-auto text-danger">Les actualités </h3>

                <!-- Partie pour créer un post -->
                <div class="border text-justify p-5 m-auto my-3 bg-white">
                    <div class="input-group input-group-lg">
                        <input class="form-control" type="text" placeholder= "Que voulez-vous dire?"/>

                    </div>
                    <hr class="text-primary">
                    <div class="my-3 d-flex  m-auto">
                        <button class="btn fs-4"><i class="bi bi-card-image"></i> Photo</button>
                        <button class="btn fs-4"><i class="bi bi-camera-reels-fill"></i> Vidéo</button>

                    </div>
                </div>
                <!-- Partie pour afficher les actualité  -->
                <div class="border text-justify p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>Titre du publication</h4>
                        <button><i class="bi bi-pencil-fill"></i></button>
                    </div>

                    <div class="text-justify p-3">
                        <p>voicieiefqfkqefkqefhiehfknkdnksnknqklsnfkqnskfnq</p>
                    </div>

                    <div class="mx-auto my-1">

                    </div>
                </div>

            </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "AllPost",
    computed: {
      ...mapState ( { user: state => state.user} ),
    },
}
</script>

<style scoped>
    .bi-camera-reels-fill {
        color: #e42645
    }
    .bi-card-image {
        color: #41b35d !important
    }



</style>