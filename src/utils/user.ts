import { writable } from 'svelte/store';
import { axiosInstance } from './axios';
import config from '../../env';

const user = writable({});

export function fetchUserData(): void {
  axiosInstance({
    method: 'get',
    url: `${config.backendurl}/user/apps`,
    headers: { 'Content-Type': 'application/json' }
  })
    .then(
      (response: {
        data: {
          apps: {
            id: string;
            name: string;
            description: string;
            icon: string;
            redirect_url: string;
            created_at: string;
            updated_at: string;
          }[];
        };
      }) => {
        user.set(response.data);
      }
    )
    .catch(error => {
      user.set({});
    });
}

export default user;
