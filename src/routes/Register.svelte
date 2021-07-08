<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { Button } from 'svelte-materialify';
  export let isauth = localStorage.getItem('isDAuth');
  import { getContext, onMount } from 'svelte';
  let { theme } = getContext('theme');
  if (isauth) {
    navigate('/dashboard', { replace: true });
  }
  onMount(() => {
    document
      .querySelector('.form')
      .addEventListener('keypress', function (e: KeyboardEvent) {
        if (e.key === 'Enter') {
          verify();
        }
      });
  });
  let webmailId = '';
  function handleChange(e) {
    webmailId = e.target.value;
  }
  function verify() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/start`,
      data: {
        email: webmailId
      },
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        navigate(`/verify?webmailId=${webmailId}`, { replace: true });
        toasts.add({
          title: 'Success',
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
  <h6>Please enter your webmail username to get started with DAuth!</h6>
  <div class="form">
    <label for="webmailId">Webmail</label><br />
    <input
      type="text"
      class="input_details"
      name="webmailId"
      on:change={e => {
        handleChange(e);
      }}
    />
    <br />
    <Button Tile id="submit_button" type="submit" on:click={verify}>Submit</Button>
  </div>
</main>
