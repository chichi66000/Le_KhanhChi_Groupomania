import axios from "axios"
axios.default.baseURL ="http://localhost:5000/"
axios.default.header.common["Authorization"] = "Bearer" + localStorageGetItem('token')