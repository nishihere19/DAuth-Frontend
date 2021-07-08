<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { searchQuery } from './../utils/queryHandler';
  import { navigate } from 'svelte-routing';
  import config from '../../env';
  import { Button } from 'svelte-materialify';
  import { onMount } from 'svelte';
  import { authorizeSession } from 'src/utils/authorizeSession';
  import { params } from 'src/utils/queryParams';

  onMount(() => {
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
            id="userProfileIcon"
            src="https://gravatar.com/avatar/c9b235a9c585af737b7f4ba185ea27df.jpg?d=retro"
            alt="profileImage"
          />
          <span id="userGreeting">Hi User!</span>
          <p>user@gmail.com</p>
        </div>
      </div>
      <div class="mainContent">
        <div class="allowAccess">
          <p>
            <a href="/" id="thirdPartApp">Festember</a> want to access your profile info.
          </p>
        </div>
        <div class="accessInfo">
          <p>
            By clicking allow button, you are allowing them to access your DAuth profile
            information. You can revoke the access to this or any other app in <a
              href="/"
              id="userDashboard">My Account</a
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
</main>
