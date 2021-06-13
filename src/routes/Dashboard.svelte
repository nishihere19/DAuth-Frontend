<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { axiosInstance } from 'src/utils/axios';
  import config from '../../env';
  import { router } from '@spaceavocado/svelte-router';
  import {onMount} from 'svelte';
 // import auth from '../utils/auth';
  export let auth;
  console.log(auth);
  if (!auth || auth == false) {
    $router.push('/');
  }
</script>

<main>
  <p>Dashboard</p>
</main>
