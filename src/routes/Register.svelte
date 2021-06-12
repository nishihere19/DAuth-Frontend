<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { router } from '@spaceavocado/svelte-router';
  import { toast, ToastContainer } from 'svelte-toastify';
  import { Roll_Number } from '../stores';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';

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
        url: `${config.backendurl}/auth/start`,
        data: {
          email: email.toString()
        },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
        .then(response => {
          $router.push('/registrationdetails');
          toast.success(response.data.message);
        })
        .catch(error => {
          //console.log(error);
          toast.error('Something went wrong, please try again!');
        });
    } else toast.error('Invalid roll number');
  }
</script>

<main>
  <div class="logo_div" />
  <img
    class="delta_logo"
    src="https://delta.nitt.edu/images/deltaLogoGreen.png"
    alt="Delta logo"
  />
  <h1 class="Dauth_title">DAuth</h1>
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
  <button id="submit_rollnumber" type="submit" on:click={verify}>Submit</button>
  <ToastContainer />
</main>
