<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { toasts, ToastContainer } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { Button } from 'svelte-materialify';
  export let isauth = localStorage.getItem('isDAuth');
  import { getContext } from 'svelte';
  let { theme } = getContext('theme');
  if (isauth) {
    navigate('/dashboard', { replace: true });
  }
  let rollno = '';
  function handleChange(e) {
    rollno = e.target.value;
  }
  function verify() {
    let value = Number(rollno);
    if (value && value > 99999999 && value < 1000000000 && !isNaN(value)) {
      let email = rollno + '@nitt.edu';
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/start`,
        data: {
          email: email.toString()
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          navigate('/registerdetails', { replace: true });
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
        description: 'Invalid roll number',
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
  <h6>Please enter your roll number to get started with DAuth!</h6>
  <br />
  <input
    type="text"
    class="input_details"
    name="rollno"
    placeholder="Roll Number"
    on:change={e => {
      handleChange(e);
    }}
  />
  <br />
  <Button Tile id="submit_button" type="submit" on:click={verify}>Submit</Button>
  <ToastContainer />
</main>
