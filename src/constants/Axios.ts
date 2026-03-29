
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from './Path';


const api = axios.create({baseURL: BASE_URL, headers: {"Content-Type": 'application/json'}});

export const setHeaderToken = (token:string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const deleteHeaderToken = () => {
  delete api.defaults.headers.common['Authorization'];
}



export default api;