<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { router } from '@spaceavocado/svelte-router';
  import auth from 'src/utils/auth';
  import { axiosInstance } from 'src/utils/axios';
  import { toasts, ToastContainer } from 'svelte-toasts';
  import config from '../../env';
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
          $router.push('/dashboard');
          toasts.add({
            title: 'Success!',
            description: response.data.message,
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'success',
            theme: localStorage.getItem('DAuth-theme')
          });
          location.reload();
          //toast.success(response.data.message);
        })
        .catch(error => {
          toasts.add({
            title: 'Oops',
            description: 'Invalid roll number or password!',
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'error',
            theme: localStorage.getItem('DAuth-theme')
          });
          //toast.error('Invalid roll number or password!');
        });
    } else {
      toasts.add({
        title: 'Oops',
        description: 'Invalid roll number!',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        theme: localStorage.getItem('DAuth-theme')
      });

      // toast.error('Invalid roll number');
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
  <h1 class="Dauth_title">DAuth</h1>
  <!--<label for="rollno">Roll Number</label><br />-->
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
  <!--<label for="password">Password</label><br />-->
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
  <button id="submit_rollnumber" type="submit" on:click={verify}>Submit</button>
  <ToastContainer />
</main>
