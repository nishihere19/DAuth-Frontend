<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { axiosInstance } from 'src/utils/axios';
  import { getContext, onMount } from 'svelte';
  import { Link, navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  let { theme } = getContext('theme');
  let myClient;
  async function getClients() {
    const parameter = new URLSearchParams(window.location.search);
    console.log(parameter.get('clientId'));
    await axiosInstance({
      method: 'post',
      url: `${config.backendurl}/client/details`,
      data: {
        clientId: parameter.get('clientId')
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
    myClient.createdAt = myClient.createdAt.slice(0, 10);
    console.log(myClient.createdAt);
    return myClient;
  }
  onMount(async () => {
    await getClients();
  });
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
                ><h3 class="client-name">{myClient.name}</h3></a
              >
              <p class="client-description">{myClient.description}</p>
            </div>
          </div>
          <div class="clientDetails-container">
            <ul class="clientDetails-list">
              <li>
                <span class="listTitle">Client Id: </span>
                {myClient.clientId}
              </li>
              <li>
                <span class="listTitle">Client Secret: </span>{myClient.clientSecret}
              </li>
              <li>
                <span class="listTitle">Homepage URL:</span>
                <a href={myClient.homePageUrl}>{myClient.homePageUrl}</a>
              </li>
              <li>
                <span class="listTitle">Registered On: </span>{myClient.createdAt}
              </li>
              <li>
                <span class="listTitle">Callback URL: </span><a
                  href={myClient.redirectUri}>{myClient.redirectUri}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
