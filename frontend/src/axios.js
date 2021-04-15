import axios from "axios"

export default axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        common: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
        }
        
      }
})
// const AUTH_TOKEN = localStorage.getItem('token')
// axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`

