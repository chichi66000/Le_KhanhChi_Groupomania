<template>
    <div>
        <div class="col shadow rounded mx-5 mt-3 mb-3 px-5 py-5">

                <AddPost/>
                <h3 class="text-center mx-auto my-3 text-danger">Les actualités </h3>

                <hr class="text-primary">

                <!-- Partie pour afficher les actualité  -->
                <div class="border text-justify p-5 my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">
                        <h4>Titre du publication</h4>

                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" href="#">Modifier</a></li>
                                <li><a class="dropdown-item" href="#">Supprimer</a></li>
                            </ul>
                        </div>

                    </div>

                    <div class="text-justify p-3">
                        <p>voicieiefqfkqefkqefhiehfknkdnksnknqklsnfkqnskfnq</p>
                    </div>

                    <hr>

                    <div class="mx-auto my-1">
                        <button class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-up"></i></button>
                        <button class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-down"></i></button>

                    </div>

                    <div>
                        <input class="form-control " type="text" id="commentaire" name="commentaire" placeholder="Ecrivez une commentaire" />
                    </div>
                </div>

            </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import axios from '../axios'
// import Swal from 'sweetalert2'
import AddPost from './AddPost'

export default {
    name: "AllPost",
    components : {
        AddPost
    },
    data () {
        
    },
    computed: {
      ...mapState ( { user: state => state.user} ),
    },

    
}
</script>

<style scoped>
    

</style>