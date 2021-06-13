<script lang="ts">
  import RouterLink from '@spaceavocado/svelte-router/component/link';
  import { axiosInstance } from 'src/utils/axios';
  import config from '../../env';
  import { toasts } from 'svelte-toasts';
import { navigate } from 'svelte-routing';
  export let isauth;
  console.log(isauth);
  function logout() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/logout`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        localStorage.setItem('isDAuth', 'false');
        toasts.add({
          title: 'Success!',
          description: response.data.message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          theme: localStorage.getItem('DAuth-theme')
        });
        navigate('/',{replace:true});
      })
      .catch(error => {
        toasts.add({
          title: 'Oops',
          description: 'Please try again!!',
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'error',
          theme: localStorage.getItem('DAuth-theme')
        });
      });
  }
</script>

{#if !isauth || isauth == 'false'}
  <nav class="navbar">
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/">Register</RouterLink>
  </nav>
{/if}
{#if isauth == 'true'}
  <nav class="navbar">
    <a as="button" href="/" on:click={logout}>Logout</a>
  </nav>
{/if}
