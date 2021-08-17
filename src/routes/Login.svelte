<style>
  main {
    font-family: sans-serif;
    text-align: center;
    display: flex;
    min-height: 80vh;
    align-items: center;
  }
</style>

<script lang="ts">
  import { auth } from 'src/utils/auth';
  import { Link, navigate } from 'svelte-routing';
  import { axiosInstance } from 'src/utils/axios';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { getContext, onMount } from 'svelte';
  import logo from '../statics/deltaLogoGreen.png';

  let { theme } = getContext('theme');
  export let isauth;
  //if (isauth && isauth == 'true') navigate('/dashboard', { replace: true });
  let webmailId = '';
  let password = '';
  onMount(() => {
    document
      .querySelector('.form')
      .addEventListener('keypress', function (e: KeyboardEvent) {
        if (e.key === 'Enter') {
          verify();
        }
      });
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
  function handlechange(e) {
    if (e.target.name == 'webmailId') webmailId = e.target.value;
    else password = e.target.value;
  }
  function verify() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/login`,
      data: {
        email: webmailId,
        password: password
      },
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        localStorage.setItem('isDAuth', 'true');
        auth.set('true');
        let finalParams = localStorage.getItem('Dauth_params');
        localStorage.removeItem('Dauth_params');
        if (!finalParams) navigate('/dashboard', { replace: true });
        else {
          navigate(`/redirect?${finalParams}`, { replace: true });
        }
        toasts.add({
          title: 'Success!',
          description: response.data.message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          showProgress: true,
          theme: $theme.name
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
          theme: $theme.name
        });
      });
  }
</script>

<main>
  <div class="main-container">
    <div class="logo_div">
      <img class="delta_logo" src={logo} alt="Delta logo" />
      <h2 class="Dauth_title">DAuth</h2>
    </div>
    <h6>We do not accept webmail credentials!</h6>
    <div class="form">
      <label for="webmailId">Webmail</label><br />
      <input
        type="text"
        class="input_details"
        name="webmailId"
        id="webmailId"
        placeholder="Your_roll_number@nitt.edu"
        on:change={e => {
          handlechange(e);
        }}
      />
      <br />
      <br />
      <label for="password">Password</label><br />
      <input
        type="password"
        class="input_details"
        id="password"
        name="password"
        bind:value={password}
        on:change={e => {
          handlechange(e);
        }}
      />
      <br />
      <div class="registerContainer">
        <button class="submit_button" type="submit" on:click={verify}>Login</button>
        <div class="navigateOption">
          <p>Don't have an account?</p>
          <Link to="/register" class="navigateLink">Register Now</Link>
        </div>
      </div>
    </div>
  </div>
</main>
