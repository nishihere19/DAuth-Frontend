<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { params } from 'src/utils/queryParams';
  import { auth } from 'src/utils/auth';
  import { navigate } from 'svelte-routing';
  import { axiosInstance } from 'src/utils/axios';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { getContext, onMount } from 'svelte';
  import { searchQuery } from 'src/utils/queryHandler';
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
        if (!$params.client_id.length) navigate('/dashboard', { replace: true });
        else {
          let finalParams = searchQuery();
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
            error.response.data.errors[0].msg ||
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
  <div class="logo_div" />
  <img
    class="delta_logo"
    src="https://delta.nitt.edu/images/deltaLogoGreen.png"
    alt="Delta logo"
  />
  <h2 class="Dauth_title">DAuth</h2>
  <div class="form">
    <label for="webmailId">Webmail Username</label><br />
    <input
      type="text"
      class="input_details"
      name="webmailId"
      on:change={e => {
        handlechange(e);
      }}
    />
    <br />
    <br />
    <label for="passworc">Password</label><br />
    <input
      type="password"
      class="input_details"
      id="password"
      name="password"
      on:change={e => {
        handlechange(e);
      }}
    />
    <br />
    <button id="submit_button" type="submit" on:click={verify}>Submit</button>
  </div>
</main>
