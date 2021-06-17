<script>
  import { getContext } from 'svelte';
  const { toggle } = getContext('theme');
  import { Switch } from 'svelte-materialify';
</script>

<label as="checkbox" on:change={toggle} class="switch">
  <input type="checkbox" id="theme_toggler" />
  <Switch color="#3bbf3beb" />
</label>
