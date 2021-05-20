export const post = ({
    namespaced: true,
    state: { 
        posts: {},
    }
,
    getter: {
        getAllPosts: (state) => { return state.posts},
        // getAllCommentaires : (state) => {return state.all_posts.commentaires}
    },
    mutations: {
        // pour tous les user
        AllPosts(state, posts) {
            state.posts = posts;
          },
        // pour 1 user
        // currentUserPosts(state, posts) {
        //     state.currentUserPosts = posts
        // }
        
    },
    actions: {
        // enregistrer tous les posts de tous les utilisateurs
        async getAllPosts (context, posts) {
            context.commit('AllPosts', posts)
        },
        //enregistrer le post d'un utilisateur
        // async setCurrentUserPosts (context, post) {
        //     context.commit('currentUserPosts', post)
        // }
    }
  })