<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
</style>

<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import Registrationdetails from './routes/Registrationdetails.svelte';
  import Register from './routes/Register.svelte';
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import ThemeContext from './ThemeContext.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  export let url = '';
</script>

<Router {url}>
  <ThemeContext>
    <nav class="navbar">
      <Link to="/dashboard">Dashbaord</Link>
      <Link to="/login">Login</Link>
      <Link to="/">Register</Link>
    </nav>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/registerdetails" component={Registrationdetails} />
      <Route path="/" component={Register} />
    </div>
    <ThemeToggle />
  </ThemeContext>
</Router>
