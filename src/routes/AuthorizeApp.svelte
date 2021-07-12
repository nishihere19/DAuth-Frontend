<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { searchQuery } from './../utils/queryHandler';
  import { navigate, Link } from 'svelte-routing';
  import config from '../../env';
  import { Button } from 'svelte-materialify';
  import { onMount, getContext } from 'svelte';
  import { authorizeSession } from 'src/utils/authorizeSession';
  import { params } from 'src/utils/queryParams';
  import { axiosInstance } from 'src/utils/axios';
  import { toasts } from 'svelte-toasts';
  let { theme } = getContext('theme');
  let userInfo: any = {};
  let clientName: string;
  let clientUrl: string;
  const parameter = new URLSearchParams(window.location.search);
  clientName = parameter.get('clientName');
  clientUrl = parameter.get('redirect_uri');
  async function getData() {
    await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/user/apps`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        userInfo = response.data;
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
    return userInfo;
  }
  onMount(async () => {
    await getData();
    let element: HTMLBodyElement = document.querySelector('.navbar');
    element.style.display = 'none';
    let finalParams = searchQuery();
    if ($authorizeSession == false) {
      navigate(`/redirect?${finalParams}`, { replace: true });
    }
  });
  function authorizeApp() {
    document.body.innerHTML +=
      '<form id="dynForm" action="' +
      config.backendurl +
      '/oauth/authorize" method="post">\
      <input type="hidden" name="client_id" value="' +
      $params.client_id +
      '">\
      <input type="hidden" name="redirect_uri" value="' +
      $params.redirect_uri +
      '">\
      <input type="hidden" name="response_type" value="' +
      $params.response_type +
      '">\
      <input type="hidden" name="grant_type" value="' +
      $params.grant_type +
      '">\
      <input type="hidden" name="state" value="' +
      $params.state +
      '">\
      <input type="hidden" name="scope" value="' +
      $params.scope +
      '">\
      <input type="hidden" name="nonce" value="' +
      $params.nonce +
      '">\
      </form>';
    let el = <HTMLFormElement>document.getElementById('dynForm');
    el.submit();
  }
  function denyAccess() {
    location.replace($params.redirect_uri);
  }
</script>

<main>
  {#await getData()}
    <div>Loading....</div>
  {:then userInfo}
    <div class="authoriseAppContainer">
      <div class="headerMain">
        <div class="greetingHeader">
          <div id="deltaLogo">
            <img
              class="delta_logo"
              id="authoriseDeltaLogo"
              src="https://delta.nitt.edu/images/deltaLogoGreen.png"
              alt="Delta logo"
            />
            <h6 id="authoriseTitle">DAuth</h6>
          </div>
          <div id="userInfo">
            <img
              class="avatar"
              src={'https://ui-avatars.com/api/?background=random&name=' + userInfo.name}
              alt="client-avatar"
            />
            <div>
              {#if userInfo && userInfo.email}
                <h3 class="user-name">{userInfo.name}</h3>
                <p class="user-email">{userInfo.email.email}</p>
              {/if}
            </div>
          </div>
        </div>
        <div class="mainContent">
          <div class="allowAccess">
            <p>
              <a href={clientUrl} id="thirdPartApp">{clientName}</a> want to access your profile
              info.
            </p>
          </div>
          <div class="accessInfo">
            <p>
              By clicking allow button, you are allowing them to access your DAuth profile
              information. You can revoke the access to this or any other app in <Link
                to="/dashboard"
                id="userDashboard">My Account</Link
              >
            </p>
          </div>
          <div class="accessButtons">
            <Button Tile id="denyButton" on:click={denyAccess}>Deny</Button>
            <Button Tile id="allowButton" on:click={authorizeApp}>Allow</Button>
          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
