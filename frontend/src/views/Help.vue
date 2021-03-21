<template>
  <div class="container">

    <div>
      <Navbar/>
    </div>

    <h1>FAQ</h1>

    <!-- Foire au question -->
    <div class="text-center mx-auto mt-3 mb-3">
        <details>
          <summary class=" font-weight-bolder">
            Comment supprimer une publication ?
          </summary>
          <p class="">Si vous êtes auteur: cliquez sur icon poubelle et confirmer</p>
          <p class="">Si vous n'êtes auteur et vous trouvez que le contenu n'est pas approprié: veuillez signaler au admin en cliquant 
            <a href="mailto:admin@groupomania@fr"></a>
          </p>

        </details>

        <details>
          <summary>
            Comment modifier une publication ?
          </summary>
            Cliquez sur icon crayon à côté du titre de publication
        </details>

        <details>
          <summary>
            Comment modifier utilisateur?
          </summary>
            Allez dans votre espace profil, choisissez icon crayon pour modifier les informations, puis confirmer les changements.
        </details>

        <details>
          <summary>
            Comment nous contacter?
          </summary>
            En cas de problème ou pour plus d'informations, envoyer un mail au:
            <a href="mailto:admin@groupomania.fr"></a>
        </details>
    </div>

    <div>
      <Footer/>
    </div>

  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

export default {
  name: "Help",
  components: {
    Navbar, Footer
  }
}
</script>

<style lang="scss" scoped>
  summary{
    font-size: 1.5rem
  }
</style>
