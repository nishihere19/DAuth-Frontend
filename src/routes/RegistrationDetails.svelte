<style>
  main {
    font-family: sans-serif;
    text-align: center;
    overflow-x: hidden;
    display: flex;
    min-height: 80vh;
    align-items: center;
  }
  .main-container {
    min-width: 0;
  }
  /* .content{
    text-align: center;
  } */
</style>

<script lang="ts">
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import 'intl-tel-input/build/js/utils';
  import { navigate } from 'svelte-routing';
  import intlTelInput from 'intl-tel-input';
  import { onMount, getContext } from 'svelte';
  import logo from '../statics/dauth-full.png';
  import '../../node_modules/intl-tel-input/build/css/intlTelInput.css';

  let { theme } = getContext('theme');
  let phoneInputField;
  let phoneInput;
  export let token;
  // let departments = [];
  // async function getDepartments() {
  //   let result = await axiosInstance({
  //     method: 'get',
  //     url: `${config.backendurl}/auth/departments`
  //   });
  //   departments = result.data;
  //   return departments;
  // }
  onMount(() => {
    axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/email/verify/${token}`
    }).catch(error => {
      navigate('/error', { replace: true });
    });
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
    phone: `+91`,
    gender: '',
    password: '',
    confirmPassword: ''
  };
  const items = [
    { name: 'MALE', value: 'MALE' },
    { name: 'FEMALE', value: 'FEMALE' }
  ];
  function handleChange(e) {
    let val = e.target.name;
    state[val] = e.target.value;
  }
  function handleSubmit() {
    if (
      state.name.length == 0 ||
      state.phone.length == 0 ||
      state.password.length == 0 ||
      state.confirmPassword.length == 0 ||
      state.gender.length == 0
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
          gender: state.gender.toString(),
          password: state.password.toString(),
          repeatPassword: state.confirmPassword.toString(),
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
    <!-- {#await getDepartments()}
      <div>Loading..</div>
    {:then departments} -->
    <div class="logo_div">
      <img class="dauth_logo" src={logo} alt="Delta logo" />
      <!-- <h2 class="Dauth_title">DAuth</h2> -->
    </div>
    <div class="content">
      <h6>Please enter the details to create an account!</h6>
    </div>
    <div class="center">
      <div class="form" />
      <label for="name">Full Name</label><br />
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
      <!-- <label for="department">Department</label><br />
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
        <br /> -->
      <!-- <label for="batch">Year of Graduation</label><br />
        <input
          type="number"
          class="input_details"
          id="input_year"
          name="batch"
          bind:value={state.batch}
          on:change={handleChange}
        /><br />
        <br /> -->
      <label for="phone">Phone Number</label><br />
      <input
        type="tel"
        class="input_details"
        bind:this={phoneInputField}
        id="input_phone"
        name="phone"
        bind:value={state.phone}
        on:change={handleChange}
      />
      <br />
      <label for="gender">Gender</label><br />
      <select
        class="input_details"
        id="input_gender"
        name="gender"
        bind:value={state.gender}
      >
        <option disabled selected value> -- select an option -- </option>
        {#each items as gender}
          {#if $theme.name == 'dark'}
            <option value={gender.value} style="background:#212121; color:#f1f1f1"
              >{gender.name}</option
            >
          {/if}
          {#if $theme.name == 'light'}
            <option value={gender.value} style="background:#f1f1f1; color:#282230"
              >{gender.name}</option
            >
          {/if}
        {/each}
      </select><br />
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
    <button class="submit_button" type="submit" on:click={handleSubmit}>Register</button>
    <!-- {/await} -->
  </div>
</main>
