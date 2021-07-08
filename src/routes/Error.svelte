<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  onMount(() => {
    let element: HTMLBodyElement = document.querySelector('.navbar');
    element.style.display = 'none';
  });
</script>

<main>
  <div class="noise" />
  <div class="overlay" />
  <div class="terminal">
    <h1>Error <span class="errorcode">404</span></h1>
    <p class="output">Sorry, the page you requested is unavailable!</p>
    <p class="output">
      Please <a href="/" class="errorLink">return to the homepage</a>.
    </p>
    <p class="output">Good luck.</p>
  </div>
</main>
