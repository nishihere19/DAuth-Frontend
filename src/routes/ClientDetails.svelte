<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { axiosInstance } from 'src/utils/axios';
  import { getContext, onMount } from 'svelte';
  import { Button } from 'svelte-materialify';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  export let id;
  let clientSecret;
  let { theme } = getContext('theme');
  let myClient;
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
  async function getClients() {
    await axiosInstance({
      method: 'post',
      url: `${config.backendurl}/client/details`,
      data: {
        clientId: id
      },
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        myClient = response.data;
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
    state.name = myClient.name;
    state.description = myClient.description;
    state.homepageUrl = myClient.homePageUrl;
    state.callbackUrl = myClient.redirectUri;
    myClient.createdAt = myClient.createdAt.slice(0, 10);
    return myClient;
  }
  onMount(async () => {
    await getClients();
  });
  function updateClient() {
    axiosInstance({
      method: 'put',
      url: '/client/update',
      data: {
        clientId: id,
        homePageUrl: state.homepageUrl,
        callbackUrl: state.callbackUrl,
        name: state.name,
        description: state.description
      }
    })
      .then(response => {
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
  function generateSecret() {
    axiosInstance({
      method: 'post',
      url: '/client/generate-secret',
      data: {
        clientId: id
      }
    })
      .then(response => {
        clientSecret = response.data.secret;
        console.log(clientSecret);
        let el: HTMLBodyElement = document.querySelector('.clientSecret');
        el.style.display = 'block';
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

  function deleteClient() {
    axiosInstance({
      method: 'delete',
      url: '/client/delete',
      data: {
        clientId: id
      }
    })
      .then(response => {
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
</script>

<main>
  {#await getClients()}
    <div>Loading...please wait!</div>
  {:then myClient}
    <div class="clientDetailsContainer">
      <div class="headerMain">
        <div class="clientDetails-main">
          <div class="clientDetails-header">
            <img
              class="avatar"
              src={'https://ui-avatars.com/api/?background=random&name=' + myClient.name}
              alt="client-avatar"
            />
            <div>
              <a href={myClient.homePageUrl}
                ><h2 class="clientName">{myClient.name}</h2></a
              >
              <!-- <p class="client-description">{myClient.description}</p> -->
            </div>
          </div>
          <hr />
          <div class="clientDetails-container">
            <ul class="clientDetails-list">
              <li>
                <span class="listTitle">Registered On </span>
                <hr />
                {myClient.createdAt}
              </li>
              <li>
                <span class="listTitle">Client Id </span>
                <hr />
                {myClient.clientId}
              </li>
              <li>
                <span class="listTitle">Client Secret </span>
                <Button Tile id="generateSecret" on:click={generateSecret}
                  >Generate</Button
                >
                <div class="clientSecret">
                  <br />
                  {clientSecret}
                  <hr />
                </div>
              </li>
            </ul>
            <div class="form">
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
            <div class="accessButtons">
              <Button Tile id="updateBtn" on:click={updateClient}>Update</Button>
              <Button Tile id="deleteBtn" on:click={deleteClient}>Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
