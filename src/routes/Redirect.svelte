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
          if (isAuthorized == true) location.replace(result.data.client.redirectUri);
          else navigate(`/authorize?${finalParams}`, { replace: true });
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
