import axios from 'axios';

export function request(config){
  const instance = axios.create({
    baseURL: '',
    withCredentials: true
  })
  return instance(config)
}
