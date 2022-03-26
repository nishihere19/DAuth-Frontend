<style>
  main {
    font-family: sans-serif;
    text-align: center;
    display: flex;
    min-height: 80vh;
    align-items: center;
  }
</style>

<script lang="ts">
  import { toasts } from 'svelte-toasts';
  import config from '../../env';
  import { axiosInstance } from '../utils/axios';
  import { getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  let { theme } = getContext('theme');

  let batch = '';
  let batches = [];
  async function getBatches() {
    let result = await axiosInstance({
      method: 'get',
      url: `${config.backendurl}/auth/batches`
    });
    batches = result.data;
    return batches;
  }

  function handleChange(e) {
    batch = e.target.value;
  }

  function addBatchInfo() {
    axiosInstance({
      method: 'post',
      url: `${config.backendurl}/auth/updateBatch`,
      data: {
        batch: batch
      },
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        toasts.add({
          title: 'Success',
          description: response.data.message,
          duration: 10000, // 0 or negative to avoid auto-remove
          placement: 'bottom-right',
          type: 'success',
          showProgress: true,
          theme: $theme.name
        });
        let finalParams = localStorage.getItem('Dauth_params');
        localStorage.removeItem('Dauth_params');
        navigate(`/redirect?${finalParams}`, { replace: true });
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
      });
  }
</script>

<main>
  {#await getBatches()}
    <div>Loading..</div>
  {:then batches}
    <div class="form">
      <h6>Please add your batch details</h6>
      <!-- <label for="batches">Batches</label><br /> -->
      <select
        class="input_details"
        id="input_batches"
        name="batches"
        bind:value={batch}
        on:select={handleChange}
      >
        <option disabled selected value> -- select an option -- </option>
        {#each batches as batch}
          {#if $theme.name == 'dark'}
            <option value={batch} style="background:#212121; color:#f1f1f1"
              >{batch.batch}</option
            >
          {/if}
          {#if $theme.name == 'light'}
            <option value={batch} style="background:#f1f1f1; color:#282230"
              >{batch.batch}</option
            >
          {/if}
        {/each}
      </select><br />
      <br />
      <div class="registerContainer">
        <button class="submit_button" type="submit" on:click={addBatchInfo}>Submit</button
        >
      </div>
    </div>
  {/await}
</main>
