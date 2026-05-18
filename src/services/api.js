import axios from "axios";

//crea una instancia reutilizable de Axios
// evita repetir la URL base del backend en cada petición
//import.meta.env.VITE_API_URL: permite configurarlo luego con .env
//fallback "http://localhost:3000/api": útil en desarrollo
//headers: indica que enviamos JSON
//timeout: evita que una petición se quede indefinidamente colgada

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://44.193.172.139:3000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 5000
});

export default api;
