
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from './Path';


const api = axios.create({baseURL: BASE_URL});

interface Payload {
    accessToken?: string | null
    refreshToken?: string | null
}


export const setHeaderToken = (token:string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const deleteHeaderToken = () => {
  delete api.defaults.headers.common['Authorization'];
}
export const loadAuthToken = async (cb:(item:Payload) => void) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
  cb({
    accessToken,
    refreshToken,
  });
};


export const setAuthToken = async (accessToken:string, refreshToken:string, cb:()=> void) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  cb()
};

export const logoutUser = async (cb:()=>void) => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('store');
  await AsyncStorage.clear();
  delete api.defaults.headers.common['Authorization'];

  cb && cb();
};





export default api;