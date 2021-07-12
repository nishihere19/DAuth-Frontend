import { writable } from 'svelte/store';
import { axiosInstance } from './axios';
import config from '../../../DAuth-Frontend/env';

const user = writable({});

export function fetchUserData(): void {
  axiosInstance({
    method: 'get',
    url: `${config.backendurl}/user/apps`,
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      user.set(response.data);
    })
    .catch(error => {
      user.set({});
    });
}

export default user;
