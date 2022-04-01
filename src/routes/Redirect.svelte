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

  let userInfo: any = {};

  const getUserDetails = async () => {
    await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/user/apps`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(
        (response: {
          data: {
            apps: {
              id: string;
              name: string;
              description: string;
              icon: string;
              redirect_url: string;
              created_at: string;
              updated_at: string;
            }[];
          };
        }) => {
          userInfo = response.data;
        }
      )
      .catch(error => {
        return {};
      });
    return userInfo;
  };

  //get all fields from query params
  let finalParams = searchQuery();

  onMount(async () => {
    //handle nav bar visibility depending on screen size (hiding nav bar because loader page)
    let element: HTMLBodyElement = document.querySelector('.navbar');
    if (!element) element = document.querySelector('.appbar');
    element.style.display = 'none';

    authorizeSession.set(true);

    //in case the user is logged in
    if ($auth == 'true') {
      userInfo = await getUserDetails();

      //check if the batch details exist or not, if not, redirect to edit profile page.
      if (
        userInfo.batch == 'NULL' ||
        userInfo.batch == null ||
        userInfo.batch == 'null' ||
        userInfo.batch.length == 0
      ) {
        localStorage.setItem('Dauth_params', finalParams);
        navigate(`/editProfile?${finalParams}`, { replace: true });
        localStorage.removeItem('Dauth_params');
      } else {
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
              navigate(
                `/authorize?${finalParams}&clientName=${result.data.client.name}`,
                {
                  replace: true
                }
              );
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
            navigate(`/`, { replace: true });
          });
      }
    } else {
      localStorage.setItem('Dauth_params', finalParams);
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
