<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { toasts, ToastContainer } from 'svelte-toasts';
  import { Roll_Number } from '../stores';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import Button from '@smui/button';
  export let isauth = localStorage.getItem('isDAuth');
  console.log(isauth);
  if (isauth) {
    navigate('/dashboard', { replace: true });
  }
  let rollno = '';
  function handlechange(e) {
    rollno = e.target.value;
  }
  function verify() {
    let value = Number(rollno);
    if (value && value > 99999999 && value < 1000000000 && !isNaN(value)) {
      Roll_Number.set(value);
      let email = rollno + '@nitt.edu';
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/isauth/start`,
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
            theme: localStorage.getItem('DAuth-theme')
          });

          //toast.success(response.data.message);
        })
        .catch(error => {
          //console.log(error);
          toasts.add({
            title: 'Oops',
            description: 'Something went wrong, please try again!',
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'error',
            theme: localStorage.getItem('DAuth-theme')
          });
          // toast.error('Something went wrong, please try again!');
        });
    } else {
      toasts.add({
        title: 'Oops',
        description: 'Invalid roll number',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        theme: localStorage.getItem('DAuth-theme')
      });
      //toast.error('Invalid roll number');
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
  <h1 class="Disauth_title">DAuth</h1>
  <p>Please enter your roll number to get started with DAuth!</p>
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
  <Button id="submit_rollnumber" class="variant-raised" type="submit" on:click={verify}
    >Submit</Button
  >
  <ToastContainer />
</main>
