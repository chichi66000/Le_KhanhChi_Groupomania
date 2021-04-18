<template>
    <div>
        <error v-if="error" :error = "error"/>

        <h3 class="text-center text-info my-5">Liste les utilitasateurs du site</h3>
        <table class="table table-striped table-responsive  mx-auto my-5">
            <thead>
                <tr class="text-center m-auto text-primary" >
                    <th scope="col" >Id</th>
                    <th scope="col" >Nom</th>
                    <th scope="col" >Prénom</th>
                    <th scope="col" >Pseudo</th>
                    <th scope="col" >Email</th>
                    <th scope="col" >Date entrée</th>
                    <th scope="col" >Admin</th>
                    <th scope="col" >Delete</th>
                </tr>
    
            </thead>

            <tbody>
        
                <tr :key="user" v-for="(user, index) in users"  class=" m-auto">
                    <td  > {{user.id}}</td>
                    <td  >{{user.nom}}</td>
                    <td  >{{user.prenom}}</td>
                    <td  >{{user.pseudo}}</td>
                    <td >{{user.email}}</td>
                    <td  >{{user.createdAt}}</td>
                    <td  class="btn-danger" @click = "adminChange(index)">{{user.isAdmin}}</td>
                    <td  class="btn-danger" @click = "adminDelete(index)">Supprimer</td>

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