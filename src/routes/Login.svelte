<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { auth } from 'src/utils/auth';
  import { navigate } from 'svelte-routing';
  import { axiosInstance } from 'src/utils/axios';
  import { toasts, ToastContainer } from 'svelte-toasts';
  import config from '../../env';
  import { getContext } from 'svelte';
  let { theme } = getContext('theme');
  export let isauth = localStorage.getItem('isDAuth');
  if (isauth && isauth == 'true') navigate('/dashboard', { replace: true });
  let rollno = '';
  let password = '';
  function handlechange(e) {
    if (e.target.name == 'rollno') rollno = e.target.value;
    else password = e.target.value;
  }
  function verify() {
    let value = Number(rollno);
    if (value && value > 99999999 && value < 1000000000 && !isNaN(value)) {
      let email = rollno + '@nitt.edu';
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/login`,
        data: {
          email: email.toString(),
          password: password
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          localStorage.setItem('isDAuth', 'true');
          auth.set('true');
          navigate('/dashboard', { replace: true });
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
            theme: $theme.name
          });
        });
    } else {
      toasts.add({
        title: 'Oops',
        description: 'Invalid roll number!',
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
  <div class="logo_div" />
  <img
    class="delta_logo"
    src="https://delta.nitt.edu/images/deltaLogoGreen.png"
    alt="Delta logo"
  />
  <h2 class="Dauth_title">DAuth</h2>
  <br />
  <input
    type="text"
    class="input_details"
    name="rollno"
    placeholder="Roll Number"
    on:change={e => {
      handlechange(e);
    }}
  />
  <br />
  <br />
  <input
    type="password"
    class="input_details"
    name="password"
    placeholder="Password"
    on:change={e => {
      handlechange(e);
    }}
  />
  <br />
  <button id="submit_button" type="submit" on:click={verify}>Submit</button>
  <ToastContainer />
</main>
