<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { searchQuery } from './../utils/queryHandler';
  import { auth } from './../utils/auth';
  import { params } from './../utils/queryParams';
  import { authorizeSession } from './../utils/authorizeSession';
  import { navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { getContext, onMount } from 'svelte';
  let { theme } = getContext('theme');

  onMount(() => {
    let element: HTMLBodyElement = document.querySelector('.navbar');
    if (!element) element = document.querySelector('.appbar');
    element.style.display = 'none';
    authorizeSession.set(true);
    let finalParams = searchQuery();
    if ($auth == 'true') {
      axiosInstance({
        method: 'get',
        url: `${config.backendurl}/oauth/authorize`,
        headers: { 'Content-Type': 'application/json' },
        params: $params
      })
        .then(result => {
          const isAuthorized = result.data.isAuthorized;
          if (isAuthorized == true) {
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
          } else
            navigate(`/authorize?${finalParams}&clientName=${result.data.client.name}`, {
              replace: true
            });
        })
        .catch(error => {
          toasts.add({
            title: 'Oops',
            description:
              error.response.data.message ||
              error.response.data.errors[1].msg ||
              'Something went wrong, please try again!',
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'error',
            showProgress: true,
            theme: $theme.name
          });
          navigate(`/`,{replace:true});
        });
    } else {
      navigate(`/?${finalParams}`, { replace: true });
    }
  });
</script>

<main>
  <div class="redirectContainer">
    <h1>You are being redirected to authorization page. Please wait!</h1>
    <div class="loader" role="status" />
  </div>
</main>
