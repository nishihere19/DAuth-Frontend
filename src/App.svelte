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
  import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
  import { axiosInstance } from 'src/utils/axios';
  import Nav from '../src/routes/Nav.svelte';
  import config from '../env';
  import auth from './utils/auth';
  let isauth;
  const unsubscribe = auth.subscribe(value=>{
    isauth= value;
  })
  console.log($auth);
  createRouter({
    routes: [
      {
        path: '/',
        name: 'REGISTER',
        component: Register,
        props: {
          auth: $auth
        }
      },
      {
        path: '/login',
        name: 'LOGIN',
        component: Login,
        props: {
          auth: $auth
        }
      },
      {
        path: '/registrationdetails',
        name: 'DETAILS',
        component: Registrationdetails,
        props: {
          auth: $auth
        }
      },
      {
        path: '/dashboard',
        name: 'DASHBOARD',
        component: Dashboard,
        props: {
          auth: $auth
        }
      }
    ]
  });
</script>

<ThemeContext>
  <Nav auth={isauth} />
  <RouterView />
  <ThemeToggle />
  <ToastContainer let:data
    ><FlatToast {data} /> <!-- Provider template for your toasts --></ToastContainer
  >
</ThemeContext>
