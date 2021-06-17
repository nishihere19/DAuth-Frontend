<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import RegistrationDetails from './routes/RegistrationDetails.svelte';
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
  import { auth } from './utils/auth';
  import { Footer } from 'svelte-materialify';
  let isauth = '';
  let url = '/';
  if ($auth) {
    auth.subscribe(value => {
      isauth = value;
    });
  }
  onMount(() => {
    axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/is-auth`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        localStorage.setItem('isDAuth', 'true');
        auth.set(localStorage.getItem('isDAuth'));
        isauth = $auth;
        navigate('/dashboard', { replace: true });
      })
      .catch(error => {
        localStorage.removeItem('isDAuth');
        isauth = $auth;
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
        localStorage.removeItem('isDAuth');
        auth.set(localStorage.getItem('isDAuth'));
        isauth = $auth;
        if (!localStorage.getItem('isDAuth')) navigate('/', { replace: true });
        toasts.add({
          title: 'Success!',
          description: response.data.message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          showProgress: true,
          theme: localStorage.getItem('DAuth-theme')
        });
      })
      .catch(error => {
        let message;
        if (error.response) {
          message = error.response.data.message;
        } else if (error.request) {
          message = error.request.data.message;
        } else {
          message = 'Something went wrong, please try again!';
        }
        toasts.add({
          title: 'Oops',
          description: message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'error',
          showProgress: true,
          theme: localStorage.getItem('DAuth-theme')
        });
      });
  }
</script>

<svelte:head>
  <title>DAuth</title>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/css/intlTelInput.css"
    integrity="sha512-gxWow8Mo6q6pLa1XH/CcH8JyiSDEtiwJV78E+D+QP0EVasFs8wKXq16G8CLD4CJ2SnonHr4Lm/yY2fSI2+cbmw=="
    crossorigin="anonymous"
  />
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
    integrity="sha512-/b3Hz5C3/9PtjfdAtl9gQhYSkZirvbAOPTkcCT/9ABa4hpyQizp1DILcGZNrsmi1VvRBH3vImPNmaWtaf0IyHA=="
    crossorigin="anonymous"></script>
</svelte:head>
<Router {url}>
  <ThemeContext>
    <div class="main-content">
      {#if !$auth || $auth == 'false'}
        <nav class="navbar">
          <Link to="/login"><div class="text-button">Login</div></Link>
          <Link to="/"><div class="text-button">Register</div></Link>
        </nav>
      {/if}
      {#if $auth == 'true'}
        <nav class="navbar">
          <a as="button" href="/" on:click={logout}
            ><div class="text-button">Logout</div></a
          >
        </nav>
      {/if}

      <Route path="/login" component={Login} bind:isauth />
      <Route path="/dashboard" component={Dashboard} bind:isauth />
      <Route path="/registerdetails" component={RegistrationDetails} bind:isauth />
      <Route path="/" component={Register} bind:isauth />
    </div>
    <ThemeToggle />
    <Footer class="love-footer-dark">Made with ❤ by Delta Force</Footer>
    <ToastContainer let:data><FlatToast {data} /></ToastContainer>
  </ThemeContext>
</Router>
