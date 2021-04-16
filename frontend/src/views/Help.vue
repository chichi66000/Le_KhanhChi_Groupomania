<template>
  <div class="container">

    <h1 class="text-center">FAQ</h1>

    <!-- Foire au question -->
    <div class="shadow rounded col  mx-auto mt-3 mb-3">
        <details>
          <summary class="text-primary">
            Comment supprimer une publication ?
          </summary>
          <p class="">Si vous êtes auteur: cliquez sur icon poubelle et confirmer</p>
          <p class="">Si vous n'êtes auteur et vous trouvez que le contenu n'est pas approprié: veuillez signaler au admin en cliquant 
            <a class="text-danger font-weight-bold" href="mailto:admin@groupomania@fr">admin@groupomania@fr</a>
          </p>

        </details>

        <details>
          <summary class="text-primary">
            Comment modifier une publication ?
          </summary>
            Cliquez sur icon crayon à côté du titre de publication
        </details>

        <details>
          <summary class="text-primary">
            Comment modifier utilisateur?
          </summary>
            Allez dans votre espace profil, choisissez icon crayon pour modifier les informations, puis confirmer les changements.
        </details>

        <details>
          <summary class="text-primary">
            Comment nous contacter?
          </summary>
            En cas de problème ou pour plus d'informations, envoyer un mail au:
            <a class="text-danger font-weight-bold" href="mailto:admin@groupomania.fr">admin@groupomania.fr</a>
        </details>
    </div>

  </div>
</template>

<script>

export default {
  name: "Help",
}
</script>

<style lang="scss" scoped>
  summary{
    font-size: 1.5rem
  }
</style>
