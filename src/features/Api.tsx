import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7079",
});

export default api;