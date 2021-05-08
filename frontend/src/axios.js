import axios from "axios"
import router from './router/index'
// import state from 'vuex'

const axiosInstance = axios.create(
    { baseURL: "http://localhost:5000/" },
    { withCredentials: true },
);

// Add a request interceptor
axiosInstance.interceptors.request.use(
    // functiont config
    (config) => {
        const token = localStorage.getItem('token')
        if( token ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        
       return config;
    },
    // function error
    error => {
        Promise.reject(error)
    }
)

// Add a response interceptor
axiosInstance.interceptors.response.use (
    // si la requet est OK, prendre la response
    (response) => {   
        console.log({response});
        
        return response},
    // function pour gérer les error du requete
    (error) => {
        console.log({error})
        let id = localStorage.getItem('id')
        const originalRequest = error.config;
        
        // verifier si le refresh token est expired et ce n'est pas la page entrée Home
        //  demander user de login
        if (error.response.status === 401 && originalRequest.url != `api/auth/${id}`) {
            alert("Votre session a été expiré. Connectez vous")
            // this.$store.dispatch(('user/setCurrentUser', null))
            router.push('/login');
            return Promise.reject(error);
           
        }
       
    return Promise.reject(error);
    }
)

export default axiosInstance  ;

