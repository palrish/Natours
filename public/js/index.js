const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg} </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.status === 200) {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.status === 200) {
      showAlert('success', 'Logged out successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out!! Please try again.');
  }
};

const form = document.querySelector('.form--login');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// UPDATE

const update = async (data, type) => {
  try {
    const url =
      type === 'Password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.status === 200) {
      showAlert('success', `${type} updated successfully!!`);
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (error) {
    showAlert('error', `Error updating ${type}!!`);
    console.log(error.response.data.message);
  }
};

const updateForm = document.querySelector('.form-user-data');

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    update(form, 'Data');
  });
}

const updatePasswordForm = document.querySelector('.form-user-settings');
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    const data = {
      password,
      newPassword,
      newPasswordConfirm,
    };
    update(data, 'Password');
  });
}

// STRIPE

const stripe = Stripe(
  'pk_test_51NURsUSD2uZglrSZo1DmFwfBkbgV4KkKh9Rdnk0Z6mMkX4Qkcz5eUBi28jMULHnBFveNt3dyAwq3VIAa3TYbvmQb001J7eLxAR'
);

const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};

const bookTourBtn = document.getElementById('tour-book-now');
if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

// Signup Page

const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data,
    });
    // console.log(res.status);
    if (res.status === 201) {
      showAlert('success', 'Account Created Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

const signupForm = document.getElementById('signup');

console.log(signupForm);
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const data = {
      name,
      email,
      password,
      passwordConfirm,
    };
    signup(data);
  });
}
