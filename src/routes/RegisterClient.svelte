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
  import { navigate, Link } from 'svelte-routing';
  import { onMount, getContext } from 'svelte';
  import logo from '../statics/deltaLogoGreen.png';
  let { theme } = getContext('theme');
  onMount(() => {
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
    description: '',
    homepageUrl: '',
    callbackUrl: ''
  };
  function handleChange(e) {
    let val = e.target.name;
    state[val] = e.target.value;
  }
  function handleSubmit() {
    if (
      state.name.length == 0 ||
      state.homepageUrl.length == 0 ||
      state.callbackUrl.length == 0
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
    } else {
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/client/register`,
        data: {
          name: state.name,
          description: state.description,
          callbackUrl: state.callbackUrl,
          homepageUrl: state.homepageUrl
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          navigate('/client-manager', { replace: true });
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
    }
  }
</script>

<main>
  <div class="main-container">
    <div class="logo_div">
      <img class="delta_logo" src={logo} alt="Delta logo" />
      <h2 class="Dauth_title">DAuth</h2>
      <h6>Please enter the details to register a new application!</h6>
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
      <label for="homepageUrl">Homepage Url</label><br />
      <input
        type="text"
        class="input_details"
        id="input_homepageUrl"
        name="homepageUrl"
        bind:value={state.homepageUrl}
        on:change={handleChange}
      /><br />
      <br />
      <label for="description">Short description</label><br />
      <textarea
        type="text"
        class="input_details"
        id="input_description"
        name="description"
        bind:value={state.description}
        on:change={handleChange}
      /><br />
      <br />
      <label for="callbackUrl">Callback Url</label><br />
      <input
        type="text"
        class="input_details"
        id="input_callbackUrl"
        name="callbackUrl"
        bind:value={state.callbackUrl}
        on:change={handleChange}
      /><br />
      <br />
    </div>
    <button class="submit_button" type="submit" on:click={handleSubmit}>Create</button>
  </div>
</main>
