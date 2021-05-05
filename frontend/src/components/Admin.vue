<template>
    <div>
        <error v-if="error" :error = "error"/>

        <h3 class="text-center pink my-5">Liste les utilitasateurs du site</h3>
        <table class="table table-striped table-responsive  mx-auto my-5">
            <thead>
                <tr class="text-center text-primary font-weight-bold mx-auto px-auto" >
                    <td scope="col" class="col" >Id</td>
                    <td scope="col" class="col">Nom</td>
                    <td scope="col" class="col">Prénom</td>
                    <td scope="col" class="col">Pseudo</td>
                    <td scope="col" class="col-2">Email</td>
                    <td scope="col" class="col-3">Date entrée</td>
                    <td scope="col" class="col">Admin</td>
                    <td scope="col" class="col-2">Delete</td>
                </tr>
    
            </thead>

            <tbody>
        
                <tr :key="user" v-for="(user, index) in users"  class="text-center  ">
                    <td  class="col">{{user.id}}</td>
                    <td  class="col">{{user.nom}}</td>
                    <td  class="col">{{user.prenom}}</td>
                    <td  class="col">{{user.pseudo}}</td>
                    <td class="col-2">{{user.email}}</td>
                    <td  class="col-3">{{user.createdAt}}</td>
                    <td  class="col btn-danger" @click = "adminChange(index)">{{user.isAdmin}}</td>
                    <td  class="col-2 btn-danger" @click = "adminDelete(index)">Supprimer</td>

                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from '../axios'
import Error from './Error'
import Swal from 'sweetalert2'

export default {
    name:"Admin",
    components: {
        Error,
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            users: [],
            error: '',
        }
    },
    async created () {
        
            await axios.get(`api/auth/admin/${this.id}`)
                .then (response => {
                    // console.log(response.data.users[0].id);     //OK
                    this.users = response.data.users
                    // console.log(this.users)                 //OK
                    // console.log(this.users[0].nom)          //OK       
                })
                .catch ( err => {
                    console.log(err);
                    this.error = "Problème pour récupérer les utilisateurs. Réessayer plus tard"
                }) 
    },

    methods: {
        // supprimer user par admin
        async adminDelete (index) {
            await Swal.fire({
                title: 'Vous êtes sûr?',
                text: "Vous ne pouvez pas revenir en arrière!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {
                    let id = this.users[index].id;
                    console.log(id);        //OK
                    axios.delete(`api/auth/adminDelete/${id}`)
                        .then(response => {
                            console.log(response);
                            this.users.splice(index,1)
                            Swal.fire(
                                'Supprimé!',
                                'Utilisateur supprimé.',
                                'success'
                            )
                        })
                        .catch( err => { console.log(err);
                        this.error = "Problème pour supprimer utilisateur. Réessayer plus tard"})
                    
                }
            })
        },

        // changer le status admin pour les users
        async adminChange(index) {
            if ( this.users[index].isAdmin == true) {
                Swal.fire("Cet utilisateur est déjà admin du site")
            }
            else {
                await Swal.fire({
                    title: 'Vous êtes sûr de passer cet utilsateur en admin?',
                    text: "Il aura tous les pouvoirs du admin!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                    }).then((result) => {
                    if (result.isConfirmed) {
                        let id = this.users[index].id;
                        console.log(id);        //OK
                        axios.put(`api/auth/adminChange/${id}`)
                            .then(response => {
                                console.log(response);
                                Swal.fire(
                                    'Changé en admin!',
                                    'Admin ajouté.',
                                    'success'
                                )
                                if ( this.users[index].isAdmin == false) { this.users[index].isAdmin = true; console.log(this.users[index].isAdmin);}    
                                
                            })
                            .catch( err => { console.log(err);
                            this.error = "Problème pour attribuer le rôle admin pour utilisateur. Réessayer plus tard"})
                        
                    }
                }) 
            }
        }
    }

}
</script>

<style scoped>
    .text-primary {
        color: #0000FF !important;
    }
    .btn-danger {
        cursor: pointer;
    }
</style>