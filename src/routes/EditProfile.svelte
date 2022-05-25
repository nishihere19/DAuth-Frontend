<style>
  main {
    width: 100%;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .card {
    overflow: hidden;
    display: inline-block;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
    padding: 4rem;
    margin: 2rem;
  }
  @media only screen and (min-width: 300px) and (max-width: 600px) {
    .card {
      padding: 1.5rem;
      margin: 1rem;
    }
  }
  @media only screen and (max-width: 300px) {
    .card {
      padding: 1rem;
      margin: 1rem;
    }
  }
</style>

<script lang="ts">
  import user from 'src/utils/user';
  import { fetchUserData } from '../utils/user';
  import { getContext, onMount } from 'svelte';
  import { auth } from '../utils/auth';
  import { navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import { axiosInstance } from '../utils/axios';
  import config from '../../env';
  import { searchQuery } from './../utils/queryHandler';

  let isauth = 'false';

  let { theme } = getContext('theme');
  let userInfo: any = {};
  const items = [
    { name: 'MALE', value: 'MALE' },
    { name: 'FEMALE', value: 'FEMALE' }
  ];

  let batches = [];
  async function getBatches() {
    let result = await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/batches`
    });
    batches = result.data;
    return batches;
  }

  onMount(() => {
    let element: HTMLBodyElement = document.querySelector('.navbar');
    if (!element) element = document.querySelector('.appbar');
    element.style.display = 'flex';
    auth.subscribe(is_auth => {
      isauth = is_auth;
      if (isauth == 'false') {
        navigate('/', { replace: true });
      }
    });
    user.subscribe(userDetails => {
      userInfo = userDetails;
    });
    fetchUserData();
  });

  function save() {
    if (
      userInfo.name &&
      userInfo.name.length != 0 &&
      userInfo.phoneNumber &&
      userInfo.phoneNumber.length != 0 &&
      userInfo.gender &&
      userInfo.gender.length != 0 &&
      userInfo.gender != 'NONE' &&
      userInfo.batch &&
      userInfo.batch.toString().length != 0
    ) {
      let phno = userInfo.phoneNumber.toString();
      let number: number = phno.substring(1, phno.length);
      if (phno[0] != '+' || isNaN(number)) {
        toasts.add({
          title: 'Oops!',
          description: 'Make sure to add country code and valid phone number',
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'error',
          showProgress: true,
          theme: $theme.name
        });
        return;
      }
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/editProfile`,
        data: {
          name: userInfo.name.toString(),
          gender: userInfo.gender.toString(),
          phoneNumber: userInfo.phoneNumber.toString(),
          batch: userInfo.batch.toString()
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          // user is redirected back to the oauth flow , if they're pushed here to updated thier profile forcefully
          let params = new URLSearchParams(window.location.search);
          if (params.get('client_id')) {
            navigate(`/redirect?${params}`, { replace: true });
            return;
          }
          navigate('/dashboard', { replace: true });
          toasts.add({
            title: 'Success',
            description: `${response.data.message}`,
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
    } else {
      toasts.add({
        title: 'Something is missing!',
        description: 'Please fill all details',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'error',
        showProgress: true,
        theme: $theme.name
      });
    }
  }

  function discard() {
    navigate('/dashboard', { replace: true });
  }
</script>

<main>
  {#await getBatches()}
    <div>Loading..</div>
  {:then batches}
    <div class="card">
      <div class="form">
        <h6>Please enter your profile details completely!</h6>
        <br />
        <label for="name">Full Name</label><br />
        <input
          type="text"
          class="input_details"
          id="input_name"
          name="name"
          bind:value={userInfo.name}
        /><br />
        <br />
        <!--Phone number-->
        <label for="phone">Phone Number</label><br />
        <input
          type="tel"
          class="input_details"
          id="input_phone"
          name="phone"
          bind:value={userInfo.phoneNumber}
        /><br />
        <br />
        <!-- Batch -->
        <label for="batches">Batches</label><br />
        <select
          class="input_details"
          id="input_batches"
          name="batch"
          bind:value={userInfo.batch}
        >
          <!-- <option disabled selected value> -- select an option -- </option> -->
          {#each batches as batch}
            {#if $theme.name == 'dark'}
              <option value={batch} style="background:#212121; color:#f1f1f1"
                >{batch}</option
              >
            {/if}
            {#if $theme.name == 'light'}
              <option value={batch} style="background:#f1f1f1; color:#282230"
                >{batch.batch}</option
              >
            {/if}
          {/each}
        </select><br />
        <!--Gender-->
        <label for="gender">Gender</label><br />
        <select
          class="input_details"
          id="input_gender"
          name="gender"
          bind:value={userInfo.gender}
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
        <!--Save & discard buttons-->
        {#if $theme.name == 'dark'}
          <button class="appdetails-button-dark" style="color:#3bbf3b" on:click={save}
            >Save</button
          >
        {:else}
          <button class="appdetails-button-light" style="color:#3bbf3b" on:click={save}
            >Save</button
          >
        {/if}
        {#if $theme.name == 'dark'}
          <button class="appdetails-button-dark" on:click={discard}>Discard</button>
        {:else}
          <button class="appdetails-button-light" on:click={discard}>Discard</button>
        {/if}
      </div>
    </div>
  {/await}
</main>