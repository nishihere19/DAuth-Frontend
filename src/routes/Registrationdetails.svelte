<style>
  main {
    font-family: sans-serif;
    text-align: center;
    overflow-x: hidden;
  }
</style>

<script lang="ts">
  import { toasts } from 'svelte-toasts';
  //import { Roll_Number } from '../stores';
  import config from '../../env';
  import { axiosInstance } from 'src/utils/axios';
  let state = {
    name: '',
    department: '',
    batch: null,
    phone: null,
    email: '',
    password: '',
    confirmpass: ''
  };
  function handlechange(e) {
    let val = e.target.name;
    if (val == 'name') state.name = e.target.value;
    else if (val == 'department') state.department = e.target.value;
    else if (val == 'batch') state.batch = e.target.value;
    else if (val == 'phone') state.phone = e.target.value;
    else if (val == 'email') state.email = e.target.value;
    else if (val == 'password') state.password = e.target.value;
    else state.confirmpass = e.target.value;
  }
  function handlesubmit() {
    if (
      state.name.length == 0 ||
      state.department.length == 0 ||
      state.batch.length == 0 ||
      state.phone.length == 0 ||
      state.email.length == 0 ||
      state.password.length == 0 ||
      state.confirmpass.length == 0
    )
      toasts.add({
        title: 'Something is missing!',
        description: 'Please fill all details',
        duration: 10000, // 0 or negative to avoid auto-remove
        placement: 'bottom-right',
        type: 'info',
        theme: localStorage.getItem('DAuth-theme')
      });
    //toast.error('Something went wrong, please try again!');
    else {
      let newphone = `+91${state.phone}`;
      axiosInstance({
        method: 'post',
        url: `${config.backendurl}/auth/register`,
        data: {
          name: state.name,
          password: state.password.toString(),
          repeatPassword: state.confirmpass.toString(),
          department: state.department,
          year: state.batch,
          phoneNumber: newphone,
          email: state.email
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
            theme: localStorage.getItem('DAuth-theme')
          });
          //toast.success(response.data.message);
          //$router.push('/registrationdetails');
        })
        .catch(error => {
          //console.log(error);
          toasts.add({
            title: 'Oops',
            description: 'Something went wrong, please try again!',
            duration: 10000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'error',
            theme: localStorage.getItem('DAuth-theme')
          });
          //toast.error('Something went wrong, please try again!');
        });
    }
  }
</script>

<main>
  <div class="logo_div">
    <img
      class="delta_logo"
      src="https://delta.nitt.edu/images/deltaLogoGreen.png"
      alt="Delta logo"
    />
  </div>
  <div class="center">
    <h1 class="Dauth_title">DAuth</h1>
    <p>Please enter the details to create an account!</p>
    <div class="form">
      <!--<label for="input_name">Name</label><br /> -->
    </div>
    <input
      type="text"
      class="input_details"
      id="input_name"
      name="name"
      placeholder="Name"
      value={state.name}
      on:change={e => {
        handlechange(e);
      }}
    /><br />
    <br />
    <!--<label for="input_department">Department</label><br /> -->
    <input
      type="text"
      class="input_details"
      id="input_department"
      name="department"
      placeholder="Department"
      value={state.department}
      on:change={handlechange}
    /><br />
    <br />
    <!--<label for="input_year">Batch</label><br /> -->
    <input
      type="number"
      class="input_details"
      id="input_year"
      name="batch"
      placeholder="Batch"
      value={state.batch}
      on:change={handlechange}
    /><br />
    <br />
    <!--<label for="input_phone">Phone Number</label><br />-->
    <input
      type="telephone"
      class="input_details"
      id="input_phone"
      name="phone"
      placeholder="Phone Number"
      value={state.phone}
      on:change={handlechange}
    /><br />
    <br />
    <!--<label for="input_mail">Alternate Email ID</label><br />-->
    <input
      type="email"
      class="input_details"
      id="input_mail"
      name="email"
      placeholder="Alternate Email ID"
      value={state.email}
      on:change={handlechange}
    /><br />
    <br />
    <!--<label for="input_password">Password</label><br />-->
    <input
      type="password"
      class="input_details"
      id="input_password"
      name="password"
      placeholder="Password"
      value={state.password}
      on:change={handlechange}
    /><br />
    <br />
    <!--<label for="input_repeat_password">Confirm Password</label><br />-->
    <input
      type="password"
      class="input_details"
      id="input_repeat_password"
      name="confirmpass"
      placeholder="Confirm Password"
      value={state.confirmpass}
      on:change={handlechange}
    /><br />
    <br />
  </div>
  <button id="submit_rollnumber" type="submit" on:click={handlesubmit}>Submit</button>
</main>
