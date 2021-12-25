<style>
  a {
    font-family: sans-serif;
    color: #3bbf3b;
    text-decoration: none;
    word-break: break-all;
  }
</style>

<script>
  import { axiosInstance } from '../../src/utils/axios';
  import { fetchUserData } from '../utils/user';
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { getContext } from 'svelte';
  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    CardText,
    CardActions
  } from 'svelte-materialify';

  export let accessGivenOn;
  export let homePageUrl;
  export let clientId;
  export let clientName;
  export let description;

  let active = false; //dialog
  let { theme } = getContext('theme');

  function removeAccess() {
    active = false;
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/user/remove-access`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        clientId: clientId
      }
    })
      .then(response => {
        toasts.add({
          description: response.data.message,
          duration: 10000,
          placement: 'bottom-right',
          type: 'success',
          showProgress: true,
          theme: $theme.name
        });
        fetchUserData();
      })
      .catch(error => {
        toasts.add({
          title: 'Oops',
          description: error.response.data.message,
          duration: 10000,
          placement: 'bottom-right',
          type: 'error',
          showProgress: true,
          theme: $theme.name
        });
      });
  }

  function open() {
    active = true;
  }
</script>

{#if $theme.name == 'dark'}
  <Card class="appdetails-card" style="background: #101010a3;">
    <CardTitle class="appdetails-title-dark"><b>{clientName}</b></CardTitle>
    <CardText class="appdetails-cardtext">
      Access given on<br />{accessGivenOn}
      <br />
      <a href={homePageUrl} class="navigateLink">{homePageUrl}</a>
      <br />
      {description}
      <br />
      <button class="appdetails-button-dark" on:click={open}>Remove access</button>
    </CardText>
  </Card>
{:else}
  <Card class="appdetails-card">
    <CardTitle class="appdetails-title-light"><b>{clientName}</b></CardTitle>
    <CardText class="appdetails-cardtext">
      Access given on<br />{accessGivenOn}
      <br />
      <a href={homePageUrl} class="navigateLink">{homePageUrl}</a>
      <br />
      {description}
      <br />
      <button class="appdetails-button-light" on:click={open}><b>Remove access</b></button
      >
    </CardText>
  </Card>
{/if}

{#if $theme.name == 'dark'}
  <Dialog bind:active>
    <Card class="appdetails-dialog-card-dark">
      <CardTitle color:crimson><b>Remove access?</b></CardTitle>
      <CardText class="appdetails-cardtext">
        {clientName} will no longer have access to your DAuth account. You'll have to grant
        permission if you want to use the service again.
      </CardText>
      <CardActions class="appdetails-card-actions">
        <Button on:click={removeAccess} text class="appdetails-dialog-button-dark"
          >Remove</Button
        >
      </CardActions>
    </Card>
  </Dialog>
{:else}
  <Dialog bind:active>
    <Card class="appdetails-dialog-card-light">
      <CardTitle color:crimson><b>Remove access?</b></CardTitle>
      <CardText class="appdetails-cardtext">
        {clientName} will no longer have access to your DAuth account. You'll have to grant
        permission if you want to use the service again.
      </CardText>
      <CardActions class="appdetails-card-actions">
        <Button on:click={removeAccess} text class="appdetails-dialog-button-light"
          >Remove</Button
        >
      </CardActions>
    </Card>
  </Dialog>
{/if}
