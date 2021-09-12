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
  import { axiosInstance } from 'src/utils/axios';
  import { getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';

  let { theme } = getContext('theme');
  const parameter = new URLSearchParams(window.location.search);
  let webmailId: string = parameter.get('webmailId');
  let token: string = parameter.get('token');
  let p1 = '';
  let p2 = '';

  function handleChange1(e) {
    p1 = e.target.value;
  }
  function handleChange2(e) {
    p2 = e.target.value;
  }
  function submit() {
    if (p1.length >= 6 && p2.length >= 6) {
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/resetPassword`,
        data: {
          email: webmailId,
          token: token,
          password: p1,
          repeatPassword: p2
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          toasts.add({
            title: 'Success',
            description: response.data.message,
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
              error.response.data.errors[0].msg ||
              'Something went wrong, please try again!',
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'error',
            showProgress: true,
            theme: $theme.name
          });
          navigate('/', { replace: true });
        });
    } else {
      toasts.add({
        title: 'Oops',
        description: 'Passwords should be atleast 6 characters!',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        showProgress: true,
        theme: $theme.name
      });
    }
  }
</script>

<main>
  <div class="form">
    <h6>Set your new password!</h6>
    <input
      type="password"
      class="input_details"
      name="Password"
      placeholder="*********"
      on:change={e => {
        handleChange1(e);
      }}
    />
    <input
      type="password"
      class="input_details"
      name="Re-enter password"
      placeholder="*********"
      on:change={e => {
        handleChange2(e);
      }}
    />
    <br />
    <div class="registerContainer">
      <button class="submit_button" type="submit" on:click={submit}>Submit</button>
    </div>
  </div>
</main>
