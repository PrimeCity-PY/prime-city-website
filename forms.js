// Apply Form Handler
(() => {
  const form = document.getElementById('applyForm');
  if (!form) return;

  const nameInput = document.getElementById('applyName');
  const discordInput = document.getElementById('applyDiscord');
  const ageInput = document.getElementById('applyAge');
  const bioTextarea = document.getElementById('applyBio');
  const bioCounter = document.getElementById('bio-count');
  const submitBtn = document.getElementById('applySubmit');
  const errorMsg = document.getElementById('applyError');
  const successMsg = document.getElementById('applySuccess');

  // Character counter for bio
  if (bioTextarea && bioCounter) {
    const updateCounter = () => {
      const count = bioTextarea.value.length;
      bioCounter.textContent = count;
      if (count > 450) {
        bioCounter.parentElement.classList.add('form__counter--warning');
      } else {
        bioCounter.parentElement.classList.remove('form__counter--warning');
      }
    };
    bioTextarea.addEventListener('input', updateCounter);
    updateCounter();
  }

  // Validation functions
  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'يرجى إدخال الاسم الكامل';
    }
    if (trimmed.length < 3) {
      return 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }
    if (trimmed.length > 50) {
      return 'الاسم طويل جداً (الحد الأقصى 50 حرف)';
    }
    // Check for English names (not allowed)
    if (/^[A-Za-z\s]+$/.test(trimmed) && !trimmed.includes(' ')) {
      return 'يرجى استخدام الاسم العربي';
    }
    return '';
  };

  const validateDiscord = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'يرجى إدخال Discord Username';
    }
    const discordRegex = /^.{3,32}#[0-9]{4}$/;
    if (!discordRegex.test(trimmed)) {
      return 'يجب أن يكون بصيغة: username#1234';
    }
    return '';
  };

  const validateAge = (value) => {
    if (!value) return ''; // Optional
    const age = parseInt(value, 10);
    if (isNaN(age) || age < 18) {
      return 'يجب أن يكون العمر 18 سنة فما فوق';
    }
    if (age > 100) {
      return 'يرجى إدخال عمر صحيح';
    }
    return '';
  };

  // Show/Clear error helpers
  const showError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    if (input && errorEl) {
      input.classList.add('form__input--error');
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  };

  const clearError = (inputId) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    if (input && errorEl) {
      input.classList.remove('form__input--error');
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  };

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

  // Real-time validation
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      const error = validateName(nameInput.value);
      if (error) {
        showError('applyName', error);
      } else {
        clearError('applyName');
      }
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('form__input--error')) {
        const error = validateName(nameInput.value);
        if (!error) clearError('applyName');
      }
    });
  }

  if (discordInput) {
    discordInput.addEventListener('blur', () => {
      const error = validateDiscord(discordInput.value);
      if (error) {
        showError('applyDiscord', error);
      } else {
        clearError('applyDiscord');
      }
    });
    discordInput.addEventListener('input', () => {
      if (discordInput.classList.contains('form__input--error')) {
        const error = validateDiscord(discordInput.value);
        if (!error) clearError('applyDiscord');
      }
    });
  }

  if (ageInput) {
    ageInput.addEventListener('blur', () => {
      const error = validateAge(ageInput.value);
      if (error) {
        showError('applyAge', error);
      } else {
        clearError('applyAge');
      }
    });
  }

  // Terms checkbox validation
  const termsCheckbox = form.querySelector('[name="terms"]');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      clearError('terms');
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous messages
    errorMsg.hidden = true;
    successMsg.hidden = true;
    clearError('applyName');
    clearError('applyDiscord');
    clearError('applyAge');
    clearError('terms');

    const name = nameInput?.value.trim() || '';
    const discord = discordInput?.value.trim() || '';
    const age = ageInput?.value || '';
    const bio = bioTextarea?.value.trim() || '';
    const terms = termsCheckbox?.checked || false;

    // Validate
    const nameError = validateName(name);
    const discordError = validateDiscord(discord);
    const ageError = validateAge(age);

    if (nameError) {
      showError('applyName', nameError);
      nameInput?.focus();
      return;
    }

    if (discordError) {
      showError('applyDiscord', discordError);
      discordInput?.focus();
      return;
    }

    if (ageError) {
      showError('applyAge', ageError);
      ageInput?.focus();
      return;
    }

    if (!terms) {
      showError('terms', 'يجب الموافقة على القوانين والشروط');
      termsCheckbox?.focus();
      return;
    }

    // Set loading
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save to localStorage (demo)
      const applications = JSON.parse(localStorage.getItem('primeCityApplications') || '[]');
      const application = {
        id: Date.now().toString(),
        name,
        discord,
        age: age || null,
        role: 'citizen', // كل جديد بيكون مواطن
        bio: bio || null,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      applications.push(application);
      localStorage.setItem('primeCityApplications', JSON.stringify(applications));

      // Log to console for admin viewing
      console.log('📝 طلب تقديم جديد:', application);
      console.log('📊 إجمالي الطلبات:', applications.length);
      console.log('💾 جميع الطلبات:', applications);

      // Show detailed success message
      showMessage('success', `✅ تم إرسال طلبك بنجاح!\n\nالاسم: ${name}\nDiscord: ${discord}\n\n📋 تم حفظ الطلب بنجاح. سنتواصل معك قريباً عبر Discord.`);
      
      form.reset();
      if (bioCounter) bioCounter.textContent = '0';

      // Scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setLoading(false);

      // Alert for immediate visibility
      setTimeout(() => {
        alert(`✅ تم إرسال طلبك بنجاح!\n\nالاسم: ${name}\nDiscord: ${discord}\n\n📋 سنتواصل معك قريباً عبر Discord.`);
      }, 500);

      // Optional: Redirect after 3 seconds
      // setTimeout(() => {
      //   window.location.href = 'index.html';
      // }, 3000);
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  });
})();
