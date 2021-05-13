import axios from "axios"
var tough = require('tough-cookie');
// var Cookie = tough.Cookie;
var cookiejar = new tough.CookieJar();
// import { refreshToken } from "../../backend/controllers/user"
// import router from './router/index'

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


    // function saveToken(token, refreshToken) {
    //     localStorage.setItem('token', token);
    //     this.$cookies.set('refreshToken', refreshToken);
    //   }
    //   function destroyToken() {
    //     localStorage.removeItem('token');
    //     sessionStorage.remove('refreshToken');
    //   }

    // funtion pour envoyer la demande de refreshToken
    // function refresh() {
    //     const refreshToken = this.$cookies.get('refreshToken')
    //     console.log({refreshToken})
    //     return new Promise((resolve, reject) => {
    //       axios.post('/api/auth/refresh',{ 
    //         refreshToken,
    //         credentials: 'include',
    //     }
    //       ).then((response) => {
    //         saveToken(response.data.token, response.data.refreshToken);
    //         return resolve(response.data.token);
    //       }).catch((error) => {
    //         destroyToken();
    //         window.location.replace('/logout');
    //         return reject(error);
    //       });
    //     });
    //   }
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

// Add a response interceptor
axiosInstance.interceptors.response.use (
    (response) => {
        console.log(response)
        return response;
    },
     (error) => {        // si error 
        console.log({error})
        const id = localStorage.getItem('id')
        const originalRequest = error.config;
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
                        return axios(originalRequest);
                    }
                })
                .catch( e => {
                    console.log(e)
                })
            // refresh()
        }
        return Promise.reject(error);
    }
)

export default axiosInstance
