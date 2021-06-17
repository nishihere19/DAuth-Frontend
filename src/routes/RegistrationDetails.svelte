<style>
  main {
    font-family: sans-serif;
    text-align: center;
    overflow-x: hidden;
  }
</style>

<script lang="ts">
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from 'src/utils/axios';
  import 'intl-tel-input/build/js/utils';
  import { navigate } from 'svelte-routing';
  import intlTelInput from 'intl-tel-input';
  import { onMount, getContext } from 'svelte';
  import '../../node_modules/intl-tel-input/build/css/intlTelInput.css';
  let { theme } = getContext('theme');
  let phoneInputField;
  let phoneInput;
  onMount(() => {
    phoneInput = intlTelInput(phoneInputField, {
      initialCountry: 'in'
    });
  });
  let state = {
    name: '',
    department: '',
    batch: null,
    phone: `+91`,
    email: '',
    password: '',
    confirmPassword: ''
  };
  function handleChange(e) {
    let val = e.target.name;
    state[val] = e.target.value;
  }
  function handleSubmit() {
    if (
      state.name.length == 0 ||
      state.department.length == 0 ||
      state.batch.length == 0 ||
      state.phone.length == 0 ||
      state.email.length == 0 ||
      state.password.length == 0 ||
      state.confirmPassword.length == 0
    ) {
      toasts.add({
        title: 'Something is missing!',
        description: 'Please fill all details',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        showProgress: true,
        theme: $theme.name
      });
      return;
    }
    if (!phoneInput.isValidNumber()) {
      toasts.add({
        title: 'Oops!',
        description: 'Please check your contact number, it is invalid!',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        showProgress: true,
        theme: $theme.name
      });
      return;
    } else {
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/register`,
        data: {
          name: state.name,
          password: state.password.toString(),
          repeatPassword: state.confirmPassword.toString(),
          department: state.department,
          year: state.batch,
          phoneNumber: phoneInput.getNumber(),
          email: state.email
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          toasts.add({
            title: 'Success',
            description: `${response.data.message}. Kindly Login!`,
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'success',
            showProgress: true,
            theme: $theme.name
          });
          navigate('/login', { replace: true });
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
    }
  }
</script>

<main>
  <div class="logo_div">
    <img
      class="delta_logo"
      src="https://delta.nitt.edu/images/deltaLogoGreen.png"
      alt="Delta logo"
    />
  </div>
  <div class="center">
    <h2 class="Dauth_title">DAuth</h2>
    <h6>Please enter the details to create an account!</h6>
    <br />
    <div class="form" />
    <input
      type="text"
      class="input_details"
      id="input_name"
      name="name"
      placeholder="Name"
      value={state.name}
      on:change={e => {
        handleChange(e);
      }}
    /><br />
    <br />
    <input
      type="text"
      class="input_details"
      id="input_department"
      name="department"
      placeholder="Department"
      value={state.department}
      on:change={handleChange}
    /><br />
    <br />
    <input
      type="number"
      class="input_details"
      id="input_year"
      name="batch"
      placeholder="Batch"
      value={state.batch}
      on:change={handleChange}
    /><br />
    <br />
    <input
      type="tel"
      class="input_details"
      bind:this={phoneInputField}
      id="input_phone"
      name="phone"
      placeholder="Phone Number"
      value={state.phone}
      on:change={handleChange}
    /><br />
    <br />
    <input
      type="email"
      class="input_details"
      id="input_mail"
      name="email"
      placeholder="Alternate Email ID"
      value={state.email}
      on:change={handleChange}
    /><br />
    <br />
    <input
      type="password"
      class="input_details"
      id="input_password"
      name="password"
      placeholder="Password"
      value={state.password}
      on:change={handleChange}
    /><br />
    <br />
    <input
      type="password"
      class="input_details"
      id="input_repeat_password"
      name="confirmPassword"
      placeholder="Confirm Password"
      value={state.confirmPassword}
      on:change={handleChange}
    /><br />
    <br />
  </div>
  <button id="submit_button" type="submit" on:click={handleSubmit}>Submit</button>
</main>
