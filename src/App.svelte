<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import Registrationdetails from './routes/Registrationdetails.svelte';
  import { Router, Link, Route } from 'svelte-routing';
  import Register from './routes/Register.svelte';
  import Login from './routes/Login.svelte';
  import ThemeContext from './ThemeContext.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
  import { axiosInstance } from 'src/utils/axios';
  import Dashboard from './routes/Dashboard.svelte';
  import config from '../env';
  import { onMount } from 'svelte';
  let url = '/';
  import { auth } from './utils/auth';
  let isauth;
  if ($auth) {
    const unsubscribe = auth.subscribe(value => {
      isauth = value;
    });
  }
  console.log($auth);
  onMount(() => {
    axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/is-auth`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log(response);
        localStorage.setItem('isDAuth', 'true');
        auth.set(localStorage.getItem('isDAuth'));
      })
      .catch(error => {
        console.log(error.message);
        localStorage.clear();
        auth.set(localStorage.getItem('isDAuth'));
      });
  });
  function logout() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/logout`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        localStorage.setItem('isDAuth', 'false');
        auth.set('false');
        navigate('/');
        toasts.add({
          title: 'Success!',
          description: response.data.message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          theme: localStorage.getItem('DAuth-theme')
        });
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

<Router {url}>
  <ThemeContext>
    {#if !isauth || isauth == 'false'}
      <nav class="navbar">
        <Link to="/login">Login</Link>
        <Link to="/">Register</Link>
      </nav>
    {/if}
    {#if isauth == 'true'}
      <nav class="navbar">
        <a as="button" on:click={logout} href="/">Logout</a>
      </nav>
    {/if}
    <div>
      <Route path="/login" component={Login} bind:isauth />
      <Route path="/dashboard" component={Dashboard} bind:isauth />
      <Route path="/registerdetails" component={Registrationdetails} bind:isauth />
      <Route exact path="/" component={Register} bind:isauth />
    </div>
    <ThemeToggle />
    <ToastContainer let:data
    ><FlatToast {data} /></ToastContainer
  >
  </ThemeContext>
</Router>
