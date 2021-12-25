<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { themes as _themes } from './themes';
  // expose props for customization and set default values
  export let themes = _themes;
  // set state of current theme's name
  let mytheme = localStorage.getItem('DAuth-theme');
  let _current = '';
  if (!mytheme) _current = themes[0].name;
  else _current = mytheme;

  // utility to get current theme from name
  const getCurrentTheme = name => themes.find(h => h.name === name);
  // set up Theme store, holding current theme object
  const Theme = writable(getCurrentTheme(_current));

  setContext('theme', {
    // providing Theme store through context makes store readonly
    theme: Theme,
    toggle: () => {
      // update internal state
      let _currentIndex = themes.findIndex(h => h.name === _current);
      _current =
        themes[_currentIndex === themes.length - 1 ? 0 : (_currentIndex += 1)].name;
      // update Theme store
      Theme.update(t => ({ ...t, ...getCurrentTheme(_current) }));
      setRootColors(getCurrentTheme(_current));
      localStorage.setItem('DAuth-theme', _current);
    }
  });

  onMount(() => {
    // set CSS vars on mount
    setRootColors(getCurrentTheme(_current));
    localStorage.setItem('DAuth-theme', _current);
  });

  // sets CSS vars for easy use in components
  // ex: var(--theme-background)
  const setRootColors = (theme:{
    colors: {
      text: string,
      background: string,
    }
    name: string,
  }) => {
    for (let [prop, color] of Object.entries(theme.colors)) {
      let varString = `--theme-${prop}`;
      document.documentElement.style.setProperty(varString, color);
    }
    document.documentElement.style.setProperty('--theme-name', theme.name);
  };
</script>

<slot>
  <!-- content will go here -->
</slot>
