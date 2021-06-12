<style>
  :global(html) {
    background-color: var(--theme-background);
    color: var(--theme-text);
  }
</style>

<script lang="ts">
  import RouterLink from '@spaceavocado/svelte-router/component/link';
  import createRouter from '@spaceavocado/svelte-router';
  import RouterView from '@spaceavocado/svelte-router/component/view';
  import Registrationdetails from './routes/Registrationdetails.svelte';
  import Register from './routes/Register.svelte';
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import ThemeContext from './ThemeContext.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { toast, ToastContainer } from 'svelte-toastify';
  toast.configure({
    position: 'top-right'
  });

  // export let url = '';
  createRouter({
    routes: [
      {
        path: '/',
        name: 'REGISTER',
        component: Register
      },
      {
        path: '/login',
        name: 'LOGIN',
        component: Login
      },
      {
        path: '/registrationdetails',
        name: 'DETAILS',
        component: Registrationdetails
      },
      {
        path: '/dashboard',
        name: 'DASHBOARD',
        component: Dashboard
      }
    ]
  });
</script>

<ThemeContext>
  <nav class="navbar">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/">Register</RouterLink>
  </nav>
  <RouterView>
    <div>
      <!-- <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/registerdetails" component={Registrationdetails} />
      <Route path="/" component={Register} /> -->
    </div>
  </RouterView>
  <ThemeToggle />
  <ToastContainer />
</ThemeContext>
