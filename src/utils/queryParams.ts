import { writable } from 'svelte/store';
export const params = writable({
  client_id: '',
  redirect_uri: '',
  response_type: '',
  grant_type: '',
  state: '',
  scope: '',
  nonce: ''
});
