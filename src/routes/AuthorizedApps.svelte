<style>
  main{
    margin:0.25rem;
    text-align: center;
  }
  section {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    margin-top: 1rem;
  }

  @media only screen and (max-width: 768px) {
    section {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  @media only screen and (max-width: 1024px) and (min-width: 768px)  {
    section {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media only screen and (min-width: 1024px){
    section {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

<script>
  import AppDetails from '../routes/AppDetails.svelte';
  import user from '../utils/user';
  import { fetchUserData } from '../utils/user';
  import { navigate } from 'svelte-routing';

  let apps = [];
  export let isauth = localStorage.getItem('isDAuth');
  if (isauth == 'false') {
    navigate('/', { replace: true });
  }
  user.subscribe(userDetails => {
    apps = userDetails.authorizedApps;
  });
  if (!apps) {
    fetchUserData();
  }
</script>

<main>
  {#if apps && apps.length}
    <section>
      {#each apps as app}
        <AppDetails
          accessGivenOn={app.createdAt.substr(0, 10)}
          homePageUrl={app.client.homePageUrl}
          clientId={app.client.id}
          clientName={app.client.name}
          description={app.client.description}
        />
      {/each}
    </section>
  {:else}
    <p>You haven't authorized any apps yet!</p>
  {/if}
</main>
