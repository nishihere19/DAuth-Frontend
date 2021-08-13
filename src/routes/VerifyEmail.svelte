<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { axiosInstance } from 'src/utils/axios';
  import { getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  let { theme } = getContext('theme');

  const parameter = new URLSearchParams(window.location.search);
  let webmailId: string;
  let token: string;
  function initialize() {
    webmailId = parameter.get('webmailId');
    token = parameter.get('token');
    if (webmailId) return webmailId;
    else {
      axiosInstance({
        method: 'get',
        url: `${config.backendurl}/auth/email/verify/${token}`
      })
        .then(result => {
          navigate(`/registerdetails/${token}`, { replace: true });
          toasts.add({
            title: 'Success',
            description: result.data.message,
            duration: 10000,
            placement: 'bottom-right',
            type: 'success',
            showProgress: true,
            theme: $theme.name
          });
        })
        .catch(error => {
          navigate('/error', { replace: true });
          toasts.add({
            title: 'Oops',
            description:
              error.response.data.message ||
              error.response.data.errors[1].msg ||
              'Something went wrong, please try again!',
            duration: 10000,
            placement: 'bottom-right',
            type: 'error',
            showProgress: true,
            theme: $theme.name
          });
        });
      return;
    }
  }
</script>

<main>
  {#await initialize()}
    <p>Loading...</p>
  {:then webmailId}
    <div class="verifyContainer">
      <h2 class="verifyTitle">Verification Link Sent!</h2>
      <p class="verifyContent">
        Kindly check <span class="webmailId">{webmailId}</span> for the confirmation link.<br
        /> You need to confirm your webmail account in order to complete the signing up process.
      </p>
    </div>
  {/await}
</main>
