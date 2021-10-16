<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
  #logoutBtn:hover {
    cursor: pointer;
  }
</style>

<script lang="ts">
  import ClientDetails from './routes/ClientDetails.svelte';
  import Clients from './routes/Clients.svelte';
  import RegisterClient from './routes/RegisterClient.svelte';
  import AuthorizeApp from './routes/AuthorizeApp.svelte';
  import ForgotPassword from './routes/ForgotPassword.svelte';
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
  import { auth } from './utils/auth';
  import { Footer, AppBar, Icon } from 'svelte-materialify';
  import Error from './routes/Error.svelte';
  import VerifyEmail from './routes/VerifyEmail.svelte';
  import AuthorizedApps from './routes/AuthorizedApps.svelte';
  import { mdiLogout, mdiApps, mdiAccount, mdiAccountMultiplePlus, mdiBookOpenVariant } from '@mdi/js';
  import PasswordReset from './routes/PasswordReset.svelte';
  import EditProfile from './routes/EditProfile.svelte';

  let isauth = '';
  let url = '';
  if ($auth) {
    auth.subscribe(value => {
      isauth = value;
    });
  }
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
            error.response.data.errors[1].msg ||
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
  <link rel="icon" href="favicon.ico" type="image/ico" />
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
          <ThemeToggle />
        </nav>
      {/if}
      {#if $auth == 'true'}
        {#if window.matchMedia('(min-width: 540px)').matches}
          <nav class="navbar">
            <Link to="/dashboard" class="nav-links"
              ><div class="text-button">Profile</div></Link
            >
            <Link to="/apps" class="nav-links"><div class="text-button">Apps</div></Link>
            <Link to="/client-manager" class="nav-links"
              ><div class="text-button">Clients</div></Link
            >
            <a class="nav-links" id="logoutBtn" href="https://delta.github.io/DAuth-Docs/"
              ><div class="text-button">Docs</div></a
            >
            <button class="nav-links" id="logoutBtn" on:click={logout}
              ><div class="text-button">Logout</div></button
            >
            <ThemeToggle />
          </nav>
        {:else}
          <AppBar dense class="appbar" flat>
            <div slot="icon">
              <Link to="/dashboard" class="appbar-link"><Icon path={mdiAccount} /></Link>
              <Link to="/apps" class="appbar-link"><Icon path={mdiApps} /></Link>
              <Link to="/client-manager" class="appbar-link"
                ><Icon path={mdiAccountMultiplePlus} /></Link
              >
              <a href="https://delta.github.io/DAuth-Docs/" class="appbar-link"
                ><Icon path={mdiBookOpenVariant} /></a
              >
              <button
                class="appbar-link"
                id="logoutBtn"
                style="border:none;background:none;"
                on:click={logout}
              >
                <Icon path={mdiLogout} />
              </button>
            </div>
            <ThemeToggle />
          </AppBar>
        {/if}
      {/if}

      <Route path="register" component={Register} bind:isauth />
      <Route path="registerdetails/:token" let:params bind:isauth>
        <RegistrationDetails token={params.token} />
      </Route>
      <Route path="authorize" component={AuthorizeApp} bind:isauth />
      <Route path="redirect" component={Redirect} bind:isauth />
      <Route path="/*" component={Error} />
      <Route path="**/" component={Error} />
      <Route path="verify" component={VerifyEmail} />
      <Route path="forgotPassword" component={ForgotPassword} />
      <Route path="/" component={Login} bind:isauth />
      <Route path="/resetPassword" component={PasswordReset} />
      {#if $auth == 'true'}
        <Route path="dashboard" component={Dashboard} bind:isauth />
        <Route path="new-client" component={RegisterClient} bind:isauth />
        <Route path="client-manager" component={Clients} bind:isauth />
        <Route path="client-details/:id" let:params bind:isauth>
          <ClientDetails id={params.id} />
        </Route>
        <Route path="apps" component={AuthorizedApps} bind:isauth />
        <Route path="editProfile" component={EditProfile} bind:isauth/>
      {/if}
    </div>
    <Footer class="love-footer-dark">Made with ❤ by <a href="https://delta.nitt.edu" style="color: #3bbf3b">Delta Force</a></Footer>
    <ToastContainer let:data><FlatToast {data} /></ToastContainer>
  </ThemeContext>
</Router>
