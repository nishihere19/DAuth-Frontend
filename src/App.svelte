<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
</style>

<script lang="ts">
  import Clients from './routes/Clients.svelte';
  import RegisterClient from './routes/RegisterClient.svelte';
  import AuthorizeApp from './routes/AuthorizeApp.svelte';
  import { navigate } from 'svelte-routing';
  import RegistrationDetails from './routes/RegistrationDetails.svelte';
  import { Router, Link, Route } from 'svelte-routing';
  import Register from './routes/Register.svelte';
  import Login from './routes/Login.svelte';
  import Redirect from './routes/Redirect.svelte';
  import ThemeContext from './ThemeContext.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
  import { axiosInstance } from 'src/utils/axios';
  import Dashboard from './routes/Dashboard.svelte';
  import config from '../env';
  import { onMount } from 'svelte';
  import { auth } from './utils/auth';
  import { Footer } from 'svelte-materialify';
  import Error from './routes/Error.svelte';
  import VerifyEmail from './routes/VerifyEmail.svelte';
  import ClientDetails from './routes/ClientDetails.svelte';
  let isauth = '';
  let url = '';
  if ($auth) {
    auth.subscribe(value => {
      isauth = value;
    });
  }
  onMount(() => {
    let element: HTMLBodyElement = document.querySelector('.navbar');
    element.style.display = 'inline-flex';
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
        navigate('/', { replace: true });
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
        toasts.add({
          title: 'Oops',
          description:
            error.response.data.message ||
            error.response.data.errors[0].msg ||
            'Something went wrong, please try again!',
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
    rel="icon"
    href="https://delta.nitt.edu/images/deltaLogoGreen.png"
    type="image/icon type"
  />
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
          <Link to="/" class="nav-links"><div class="text-button">Login</div></Link>
          <Link to="/register" class="nav-links"
            ><div class="text-button">Register</div></Link
          >
        </nav>
      {/if}
      {#if $auth == 'true'}
        <nav class="navbar">
          <button class="nav-links" id="logoutBtn" on:click={logout}
            ><div class="text-button">Logout</div></button
          >
          <Link to="/client-manager" class="nav-links"
            ><div class="text-button">My Clients</div></Link
          >
        </nav>
      {/if}

      <Route path="register" component={Register} />
      <Route path="dashboard" component={Dashboard} bind:isauth />
      <Route path="registerdetails" component={RegistrationDetails} bind:isauth />
      <Route path="authorize" component={AuthorizeApp} bind:isauth />
      <Route path="redirect" component={Redirect} bind:isauth />
      <Route path="new-client" component={RegisterClient} />
      <Route path="client-manager" component={Clients} />
      <Route path="client-details/:id" let:params>
        <ClientDetails id={params.id} />
      </Route>
      <Route path="/*" component={Error} />
      <Route path="verify" component={VerifyEmail} />
      <Route exact path="/" component={Login} bind:isauth />
    </div>
    <ThemeToggle />
    <Footer class="love-footer-dark">Made with ❤ by Delta Force</Footer>
    <ToastContainer let:data><FlatToast {data} /></ToastContainer>
  </ThemeContext>
</Router>
