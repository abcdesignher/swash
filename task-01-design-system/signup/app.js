/**
 * Swash Signup Screen Interaction Logic
 * Handles client-side accessible validation and feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitBtn = document.getElementById('submitBtn');

  // Fields and error mapping
  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your full name.';
        if (val.trim().length < 3) return 'Full name must be at least 3 characters.';
        return null;
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
        return null;
      }
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phoneError'),
      validate: (val) => {
        if (!val.trim()) return 'Please enter your phone number for collection notices.';
        const cleaned = val.replace(/\s+/g, '');
        if (cleaned.length < 10) return 'Please enter a valid phone number (at least 10 digits).';
        return null;
      }
    },
    city: {
      input: document.getElementById('city'),
      error: document.getElementById('cityError'),
      validate: (val) => {
        if (!val) return 'Please select your pickup city.';
        return null;
      }
    },
    planTier: {
      input: document.getElementById('planTier'),
      error: document.getElementById('planTierError'),
      validate: (val) => {
        if (!val) return 'Please choose a monthly laundry subscription plan.';
        return null;
      }
    },
    password: {
      input: document.getElementById('password'),
      error: document.getElementById('passwordError'),
      validate: (val) => {
        if (!val) return 'Please create a secure password.';
        if (val.length < 8) return 'Password must be at least 8 characters long.';
        return null;
      }
    },
    agreeTerms: {
      input: document.getElementById('agreeTerms'),
      error: document.getElementById('termsError'),
      validate: (input) => {
        if (!input.checked) return 'You must agree to the Terms of Service and Privacy Policy.';
        return null;
      }
    }
  };

  // Real-time clearance of errors on user input
  Object.keys(fields).forEach((key) => {
    const item = fields[key];
    const eventType = item.input.type === 'checkbox' || item.input.tagName === 'SELECT' ? 'change' : 'input';

    item.input.addEventListener(eventType, () => {
      clearFieldError(item);
    });
  });

  function clearFieldError(item) {
    item.input.classList.remove('is-invalid');
    item.input.removeAttribute('aria-invalid');
    if (item.error) {
      item.error.textContent = '';
      item.error.classList.remove('is-visible');
    }
  }

  function setFieldError(item, message) {
    item.input.classList.add('is-invalid');
    item.input.setAttribute('aria-invalid', 'true');
    if (item.error) {
      item.error.textContent = message;
      item.error.classList.add('is-visible');
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset status message
    statusMessage.hidden = true;
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';

    let hasError = false;
    let firstErrorField = null;

    // Validate all fields
    Object.keys(fields).forEach((key) => {
      const item = fields[key];
      const val = item.input.type === 'checkbox' ? item.input : item.input.value;
      const errorMsg = item.validate(val);

      if (errorMsg) {
        setFieldError(item, errorMsg);
        hasError = true;
        if (!firstErrorField) {
          firstErrorField = item.input;
        }
      } else {
        clearFieldError(item);
      }
    });

    if (hasError) {
      statusMessage.className = 'status-message is-error';
      statusMessage.textContent = 'Please correct the highlighted fields before submitting.';
      statusMessage.hidden = false;
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // Simulate successful account creation
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Swash Account';

      statusMessage.className = 'status-message is-success';
      statusMessage.textContent = 'Account created successfully! Welcome to Swash laundry subscription.';
      statusMessage.hidden = false;

      // Optional: clear non-essential fields after submission
      form.reset();
    }, 700);
  });
});
