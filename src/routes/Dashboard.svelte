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
  header {
    margin-top: 1rem;
    font-size: 2rem;
    color: #3bbf3b;
  }
  .name {
    font-size: 2rem;
  }
  .info {
    font-size: 1.25rem;
  }
</style>

<script lang="ts">
  import { navigate, Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import user from '../utils/user';
  import { fetchUserData } from '../utils/user';
  import { auth } from '../utils/auth';
  import { mdiAccountEdit } from '@mdi/js';
  import { Icon } from 'svelte-materialify';

  let isauth = 'false';
  let userInfo: any = {};

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
</script>

<main>
  <div class="card">
    <img
      class="dashboardImage"
      src={'https://ui-avatars.com/api/?background=random&size=200&name=' + userInfo.name}
      alt="Profile"
    />
    <header>
      {#if userInfo && userInfo.email}
        <p>{userInfo.email.email.substring(0, userInfo.email.email.length - 9)}</p>
      {/if}
    </header>
    <div class="name">
      {userInfo.name}
    </div>
    <br />
    <div class="info">
      {userInfo.phoneNumber}<br />
      {#if userInfo.gender && userInfo.gender != 'NONE'}
        {userInfo.gender}
      {/if}
    </div>
    <br />
    <Link to="/editProfile" class="appbar-link"><Icon path={mdiAccountEdit} /></Link>
  </div>
</main>
