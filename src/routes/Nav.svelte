<script lang='ts'>
    import RouterLink from '@spaceavocado/svelte-router/component/link';
    import { axiosInstance } from 'src/utils/axios';
  import config from '../../env';
  import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
  export let auth;
  console.log(auth);
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
        location.reload();
        //toast.success(response.data.message);
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
        //toast.error('Invalid roll number or password!');
      });
  }
</script>

{#if !auth || auth == 'false'}
<nav class="navbar">
  <RouterLink to="/login">Login</RouterLink>
  <RouterLink to="/">Register</RouterLink>
</nav>
{/if}
{#if auth == 'true'}
<nav class="navbar">
  <a as="button" href="/" on:click={logout}>Logout</a>
</nav>
{/if}