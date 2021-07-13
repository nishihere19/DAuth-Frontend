<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { axiosInstance } from 'src/utils/axios';
  import { getContext, onMount } from 'svelte';
  import { Button, Icon } from 'svelte-materialify';
  import { mdiPlus } from '@mdi/js';
  import { Link } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  let { theme } = getContext('theme');
  let myClients = [
    {
      name: '',
      description: '',
      clientId: ''
    }
  ];
  async function getClients() {
    await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/client/list`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        myClients = response.data;
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
    return myClients;
  }
  onMount(async () => {
    await getClients();
  });
</script>

<main>
  {#await getClients()}
    <div>Loading...please wait!</div>
  {:then myClients}
    {#if myClients.length}
      <div class="clientManager-container">
        <div class="client-header">
          <h1>Oauth Apps</h1>
          <Link to="/new-client">
            <Button fab size="small" class="addNewApp blue white-text">
              <Icon path={mdiPlus} />
            </Button></Link
          >
        </div>
        {#each myClients as client}
          <div class="client-container">
            <img
              class="avatar"
              src={'https://ui-avatars.com/api/?background=random&name=' + client.name}
              alt="client-avatar"
            />
            <div>
              <Link to={'/client-details/' + client.clientId}
                ><h3 class="client-name">{client.name}</h3></Link
              >
              <p class="client-description">{client.description}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    {#if !myClients.length}
      <div>You have not registered any applications yet!</div>
    {/if}
  {/await}
</main>
