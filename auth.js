// Login Form Handler
(() => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('[data-password-toggle]');
  const submitBtn = document.getElementById('loginSubmit');
  const errorMsg = document.getElementById('loginError');
  const successMsg = document.getElementById('loginSuccess');
  const forgotPasswordLink = document.getElementById('forgotPassword');

  // Password toggle
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      const icon = passwordToggle.querySelector('.form__password-icon');
      if (icon) {
        icon.textContent = type === 'password' ? '👁️' : '🙈';
      }
    });
  }

  // Real-time validation
  const validateUsername = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني';
    }
    if (trimmed.length < 3) {
      return 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    }
    // Email validation (optional)
    if (trimmed.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return 'البريد الإلكتروني غير صحيح';
      }
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'يرجى إدخال كلمة المرور';
    }
    if (value.length < 6) {
      return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    return '';
  };

  // Show error
  const showError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    if (input && errorEl) {
      input.classList.add('form__input--error');
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  };

  // Clear error
  const clearError = (inputId) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    if (input && errorEl) {
      input.classList.remove('form__input--error');
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  };

  // Show message
  const showMessage = (type, message) => {
    if (type === 'error') {
      errorMsg.textContent = message;
      errorMsg.hidden = false;
      successMsg.hidden = true;
    } else {
      successMsg.textContent = message;
      successMsg.hidden = false;
      errorMsg.hidden = true;
    }
  };

  // Set loading state
  const setLoading = (loading) => {
    if (!submitBtn) return;
    const text = submitBtn.querySelector('.btn__text');
    const loader = submitBtn.querySelector('.btn__loader');
    if (text && loader) {
      text.hidden = loading;
      loader.hidden = !loading;
      submitBtn.disabled = loading;
    }
  };

  // Real-time validation on input
  if (usernameInput) {
    usernameInput.addEventListener('blur', () => {
      const error = validateUsername(usernameInput.value);
      if (error) {
        showError('username', error);
      } else {
        clearError('username');
      }
    });
    usernameInput.addEventListener('input', () => {
      if (usernameInput.classList.contains('form__input--error')) {
        const error = validateUsername(usernameInput.value);
        if (!error) clearError('username');
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('blur', () => {
      const error = validatePassword(passwordInput.value);
      if (error) {
        showError('password', error);
      } else {
        clearError('password');
      }
    });
    passwordInput.addEventListener('input', () => {
      if (passwordInput.classList.contains('form__input--error')) {
        const error = validatePassword(passwordInput.value);
        if (!error) clearError('password');
      }
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    errorMsg.hidden = true;
    successMsg.hidden = true;
    clearError('username');
    clearError('password');

    const username = usernameInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const remember = form.querySelector('[name="remember"]')?.checked || false;

    // Validate
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) {
      showError('username', usernameError);
      usernameInput?.focus();
      return;
    }

    if (passwordError) {
      showError('password', passwordError);
      passwordInput?.focus();
      return;
    }

    // Set loading
    setLoading(true);

    try {
      // Simulate API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if credentials exist in localStorage (demo)
      const storedUsers = JSON.parse(localStorage.getItem('primeCityUsers') || '[]');
      const user = storedUsers.find(
        (u) => (u.username === username || u.email === username) && u.password === password
      );

      if (user) {
        // Success
        if (remember) {
          localStorage.setItem('primeCityRemember', JSON.stringify({ username, remember: true }));
        }
        localStorage.setItem('primeCityLoggedIn', 'true');
        localStorage.setItem('primeCityUser', JSON.stringify(user));

        showMessage('success', 'تم تسجيل الدخول بنجاح! جاري التوجيه...');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        // Error
        showMessage('error', 'اسم المستخدم أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  });

  // Forgot password
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      showMessage('info', 'لإعادة تعيين كلمة المرور، يرجى التواصل معنا عبر Discord.');
    });
  }

  // Check if user is already logged in
  if (localStorage.getItem('primeCityLoggedIn') === 'true') {
    const storedUser = localStorage.getItem('primeCityUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (usernameInput) usernameInput.value = user.username || user.email || '';
    }
  }

  // Check remember me
  const remembered = JSON.parse(localStorage.getItem('primeCityRemember') || 'null');
  if (remembered && remembered.remember && usernameInput) {
    usernameInput.value = remembered.username || '';
    form.querySelector('[name="remember"]').checked = true;
  }
})();
