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
  import { Link, navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { getContext, onMount } from 'svelte';
  import logo from '../statics/deltaLogoGreen.png';
  let { theme } = getContext('theme');
  // if (isauth) {
  //   navigate('/dashboard', { replace: true });
  // }
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
    <h6>Please enter your webmail username to get started with DAuth!</h6>
    <div class="form">
      <label for="webmailId">Webmail</label><br />
      <input
        type="text"
        class="input_details"
        name="webmailId"
        placeholder="Your_roll_number@nitt.edu"
        bind:value={webmailId}
        on:change={e => {
          handleChange(e);
        }}
      />
      <br />
      <div class="registerContainer">
        <button class="submit_button" type="submit" on:click={verify}>Submit</button>
        <div class="navigateOption">
          <p>Already have an account?</p>
          <Link to="/" class="navigateLink">Login Now</Link>
        </div>
      </div>
    </div>
  </div>
</main>
