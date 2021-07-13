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
  let departments = [];
  async function getDepartments() {
    let result = await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/departments`
    });
    departments = result.data;
    return departments;
  }
  onMount(async () => {
    await getDepartments();
    phoneInput = intlTelInput(phoneInputField, {
      initialCountry: 'in'
    });
    document
      .querySelector('.center')
      .addEventListener('keypress', function (e: KeyboardEvent) {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
  });
  let state = {
    name: '',
    department: {
      department: ''
    },
    batch: null,
    phone: `+91`,
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
      !state.department.department ||
      state.batch.length == 0 ||
      state.phone.length == 0 ||
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
          department: state.department.department,
          year: state.batch,
          phoneNumber: phoneInput.getNumber()
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          navigate('/', { replace: true });
          toasts.add({
            title: 'Success',
            description: `${response.data.message}. Kindly Login!`,
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
  }
</script>

<main>
  <div class="main-container">
    {#await getDepartments()}
      <div>Loading..</div>
    {:then department}
      <div class="logo_div">
        <img
          class="delta_logo"
          src="https://delta.nitt.edu/images/deltaLogoGreen.png"
          alt="Delta logo"
        />
        <h2 class="Dauth_title">DAuth</h2>
        <h6>Please enter the details to create an account!</h6>
      </div>
      <div class="center">
        <div class="form" />
        <label for="name">Name</label><br />
        <input
          type="text"
          class="input_details"
          id="input_name"
          name="name"
          bind:value={state.name}
          on:change={e => {
            handleChange(e);
          }}
        /><br />
        <br />
        <label for="department">Department</label><br />
        <select
          class="input_details"
          id="input_department"
          name="department"
          bind:value={state.department}
          on:select={handleChange}
        >
          <option disabled selected value> -- select an option -- </option>
          {#each departments as department}
            {#if $theme.name == 'dark'}
              <option value={department} style="background:#212121; color:#f1f1f1"
                >{department.department}</option
              >
            {/if}
            {#if $theme.name == 'light'}
              <option value={department} style="background:#f1f1f1; color:#282230"
                >{department.department}</option
              >
            {/if}
          {/each}
        </select><br />
        <br />
        <label for="batch">Batch</label><br />
        <input
          type="number"
          class="input_details"
          id="input_year"
          name="batch"
          bind:value={state.batch}
          on:change={handleChange}
        /><br />
        <br />
        <label for="phone">Phone Number</label><br />
        <input
          type="tel"
          class="input_details"
          bind:this={phoneInputField}
          id="input_phone"
          name="phone"
          bind:value={state.phone}
          on:change={handleChange}
        /><br />
        <br />
        <label for="password">Password</label><br />
        <input
          type="password"
          class="input_details"
          id="input_password"
          name="password"
          bind:value={state.password}
          on:change={handleChange}
        /><br />
        <br />
        <label for="confirmPassword">Confirm Password</label><br />
        <input
          type="password"
          class="input_details"
          id="input_repeat_password"
          name="confirmPassword"
          bind:value={state.confirmPassword}
          on:change={handleChange}
        /><br />
        <br />
      </div>
      <button class="submit_button" type="submit" on:click={handleSubmit}>Register</button
      >
    {/await}
  </div>
</main>
