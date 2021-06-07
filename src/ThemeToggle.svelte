<script>
  import { getContext } from 'svelte';
  const { toggle } = getContext('theme');
</script>

<label class="switch">
  <input type="checkbox" id="theme_toggler" on:change={toggle} />
  <span class="slider round" />
</label>
