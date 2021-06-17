import { writable } from 'svelte/store';
export const auth = writable(localStorage.getItem('isDAuth'));
