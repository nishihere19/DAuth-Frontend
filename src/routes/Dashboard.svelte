<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { navigate } from 'svelte-routing';
  export let isauth = localStorage.getItem('isDAuth');
  console.log(isauth);
  if (isauth == 'false') {
    navigate('/',{replace:true});
  }
</script>

<main>
  <p>Dashboard</p>
</main>
