import axios from "axios"
var tough = require('tough-cookie');
// var Cookie = tough.Cookie;
var cookiejar = new tough.CookieJar();
// import { refreshToken } from "../../backend/controllers/user"
import router from './router/index'
// import createAuthRefreshInterceptor from 'axios-auth-refresh';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/" ,
    withCredentials: true ,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
    });

// Add a response interceptor
axiosInstance.interceptors.response.use (
    (response) => {
        return response;
    },
    // si error dans la response
    (error) => {         
       
        const id = localStorage.getItem('id')
        const originalRequest = error.config;
        // originalRequest._retry = true;
        const status = error.response ? error.response.status : null;
        // si le status = 401 , unauthorization
        if (status === 401) {
            originalRequest._retry = true;

            // envoyer au server le cookie refreshToken pour demander 1 nouveau token
            return axiosInstance.post(`http://localhost:5000/api/auth/refresh/${id}`, { withCredentials: true, credentials: 'include'}
            )
                .then( response => {
                    // recevoir le token du server, et stocker dans localstorage pour authentifier 
                    if(response.status === 201) {
                        console.log('newtoken ', response.data )
                        localStorage.setItem('token', response.data);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
                        return axiosInstance(originalRequest);
                    }
                    // si refreshtoken est invalide ou expiré;
                    if(response.status=== 401 || response.status === 403) {
                        alert('votre session est expiré. Veuillez connecter')
                        router.push('/login')   // demander login  
                    }
                })
                .catch( e => {
                    console.log(e)
                    
                })
        }
        return Promise.reject(error);
    }
)


// Add a request interceptor
axiosInstance.interceptors.request.use(
    // function config
    (config) => {
        const token = localStorage.getItem('token')
        if( token ) {

            config.headers.Authorization = `Bearer ${token}`;
        }
        cookiejar.getCookies(config.url, function(err, cookies) {
            config.headers.cookie = cookies.join('; ');console.log("err ", err) ; console.log('cookie ', cookies) })
        // config.headers = {
        //     'Authorization': `Bearer ${token}`,
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
        console.log({config})
        

        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    // function error
    error => {
        Promise.reject(error)
    }
)

export default axiosInstance
