import { writable } from 'svelte/store';
import config from '../../env';
import { axiosInstance } from './axios';
import { router } from '@spaceavocado/svelte-router';

let val = false;

const auth = writable(val);

axiosInstance({
  method: 'get',
  url: `${config.backendurl}/auth/is-auth`,
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => {
    console.log(response);
    val=true;
    auth.set(val);
    localStorage.setItem('isDAuth', 'true');
  })
  .catch(error => {
    console.log(error.message);
    val=false;
    auth.set(val);
    localStorage.setItem('isDAuth', 'false');
  });

auth.set(val);
console.log(auth);
export default auth;
