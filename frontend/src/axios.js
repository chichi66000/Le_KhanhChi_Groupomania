import axios from "axios"
// import { refreshToken } from "../../backend/controllers/user"
// import router from './router/index'

// export default axios.create({
//     baseURL: "http://localhost:5000/",
//     // headers: {
//     //     common: {
//     //         Authorization: `Bearer ${localStorage.getItem('token')}`  
//     //     }
        
//     //   }
// })



const axiosInstance = axios.create(
    { baseURL: "http://localhost:5000/" },
    { withCredentials: true },
    {credentials: 'include'}
);

// axiosInstance.defaults.baseURL = "http://localhost:5000/";
// axiosInstance.defaults.withCredentials = true;

// export default axios.create(
//     { baseURL: "http://localhost:5000/" },
//     { withCredentials: true },

//     );

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
    // functiont config
    (config) => {
        const token = localStorage.getItem('token')
        if( token ) {

            config.headers.Authorization = `Bearer ${token}`;
        }
        // config.headers = {
        //     'Authorization': `Bearer ${token}`,
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
        console.log({token})
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
        console.log({response})
        return response
    },
    (error) => {        // si error 
        console.log({error})
        const id = localStorage.getItem('id')
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;
        // si le status = 401 , unauthorization
        if (status == 401) {
            originalRequest._retry = true;
            // envoyer au server le cookie refreshToken pour demander 1 nouveau token
            return axios.post(`http://localhost:5000/api/auth/refresh/${id}`, {
                credentials: 'include'
            })
                .then( res => {
                    // recevoir le token du server, et stocker dans localstorage pour authentifier 
                    if(res.status === 201) {
                        localStorage.setItem('token', res.data.token);
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

export default axiosInstance  ;