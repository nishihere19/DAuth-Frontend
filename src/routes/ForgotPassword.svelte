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
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  let { theme } = getContext('theme');

  let webmailId = '';

  function handleChange(e) {
    webmailId = e.target.value;
  }

  function forgotPassword() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/forgotPassword`,
      data: {
        email: webmailId
      },
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        toasts.add({
          title: 'Success',
          description: response.data.message + '. Kindly check your webmail!',
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          showProgress: true,
          theme: $theme.name
        });
        navigate('/', { replace: true });
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
  <div class="form">
    <h6>Please enter your webmail address to get password reset link!</h6>
    <input
      type="text"
      class="input_details"
      name="webmailId"
      placeholder="Your_roll_number@nitt.edu"
      on:change={e => {
        handleChange(e);
      }}
    />
    <br />
    <div class="registerContainer">
      <button class="submit_button" type="submit" on:click={forgotPassword}>Submit</button
      >
    </div>
  </div>
</main>
