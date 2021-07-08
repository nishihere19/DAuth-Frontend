<script>
  import { getContext } from 'svelte';
  const { toggle } = getContext('theme');
  import { Switch } from 'svelte-materialify';
  let { theme } = getContext('theme');
</script>

<label as="checkbox" on:change={toggle} checked class="switch">
  <input type="checkbox" checked id="theme_toggler" />
  {#if $theme.name == 'dark'}
    <Switch id="themeToggler" color="#3bbf3beb" checked />
  {/if}
  {#if $theme.name == 'light'}
    <Switch id="themeToggler" color="#3bbf3beb" />
  {/if}
</label>
