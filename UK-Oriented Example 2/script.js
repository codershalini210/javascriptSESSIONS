console.log("hi")
class CouncilTaxForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.successMessage = document.getElementById('successMessage');
    this.clearButton = document.getElementById('clearForm');
    
    // UK Postcode validation pattern
    this.postcodePattern = /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
    
    // UK Phone validation pattern (basic)
    this.phonePattern = /^(\+44\s?|0)(\d{2,3}\s?\d{3,4}\s?\d{3,4}|\d{10,11})$/;
    
    this.init();
  }

  init() {
    // Attach event listeners
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.clearButton.addEventListener('click', () => this.clearForm());
    
    // Real-time validation for key fields
    this.attachRealTimeValidation();
    
    // Set max date for occupancy (today)
    document.getElementById('occupancyDate').max = new Date().toISOString().split('T')[0];
  }

  attachRealTimeValidation() {
    // Postcode validation on input
    const postcodeField = document.getElementById('postcode');
    postcodeField.addEventListener('input', (e) => {
      this.validateField('postcode', e.target.value);
    });

    // Email validation on blur
    const emailField = document.getElementById('email');
    emailField.addEventListener('blur', (e) => {
      this.validateField('email', e.target.value);
    });

    // Phone validation on blur
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('blur', (e) => {
      if (e.target.value) { // Only validate if not empty (optional field)
        this.validateField('phone', e.target.value);
      }
    });

    // Format postcode on input
    postcodeField.addEventListener('input', (e) => {
      e.target.value = this.formatPostcode(e.target.value);
    });
  }

  formatPostcode(postcode) {
    // Remove all spaces and convert to uppercase
    let formatted = postcode.replace(/\s/g, '').toUpperCase();
    
    // Add space before the last 3 characters if length > 3
    if (formatted.length > 3) {
      formatted = formatted.slice(0, -3) + ' ' + formatted.slice(-3);
    }
    
    return formatted;
  }

  validateField(fieldName, value) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'postcode':
        if (!value.trim()) {
          isValid = false;
          errorMessage = 'Postcode is required';
        } else if (!this.postcodePattern.test(value.trim())) {
          isValid = false;
          errorMessage = 'Please enter a valid UK postcode (e.g., SW1A 0AA)';
        }
        break;

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          isValid = false;
          errorMessage = 'Email address is required';
        } else if (!emailPattern.test(value.trim())) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!this.phonePattern.test(value.trim())) {
          isValid = false;
          errorMessage = 'Please enter a valid UK phone number (e.g., 020 7946 0958)';
        }
        break;

      default:
        if (!value.trim()) {
          isValid = false;
          errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        break;
    }

    // Update field styling and error message
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('success');
      errorElement.textContent = '';
    } else {
      field.classList.remove('success');
      field.classList.add('error');
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  getFieldLabel(fieldName) {
    const labels = {
      title: 'Title',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      houseNumber: 'House Number/Name',
      street: 'Street Name',
      city: 'City',
      postcode: 'Postcode',
      propertyType: 'Property Type',
      bedrooms: 'Number of Bedrooms',
      occupancyDate: 'Occupancy Date'
    };
    return labels[fieldName] || fieldName;
  }

  validateForm() {
    let isFormValid = true;
    const requiredFields = [
      'title', 'firstName', 'lastName', 'email',
      'houseNumber', 'street', 'city', 'postcode',
      'propertyType', 'bedrooms', 'occupancyDate'
    ];

    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('error', 'success');
    });

    // Validate each required field
    requiredFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      const isValid = this.validateField(fieldName, field.value);
      if (!isValid) {
        isFormValid = false;
      }
    });

    // Validate optional phone if provided
    const phoneField = document.getElementById('phone');
    if (phoneField.value.trim()) {
      const isPhoneValid = this.validateField('phone', phoneField.value);
      if (!isPhoneValid) {
        isFormValid = false;
      }
    }

    // Custom validation for occupancy date
    const occupancyDate = document.getElementById('occupancyDate').value;
    if (occupancyDate) {
      const selectedDate = new Date(occupancyDate);
      const today = new Date();
      if (selectedDate > today) {
        this.showFieldError('occupancyDate', 'Occupancy date cannot be in the future');
        isFormValid = false;
      }
    }

    return isFormValid;
  }

  showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    field.classList.add('error');
    field.classList.remove('success');
    errorElement.textContent = message;
  }

  async handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Validate form
    if (!this.validateForm()) {
      this.scrollToFirstError();
      return;
    }

    // Get submit button and show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    try {
      // Collect form data
      const formData = this.collectFormData();
      
      // Simulate API call with fetch
      const response = await this.submitToServer(formData);
      
      if (response.success) {
        this.showSuccessMessage();
        this.form.reset();
        this.clearAllValidationStates();
      } else {
        throw new Error(response.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
    }
  }

  collectFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    // Convert FormData to plain object
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Add checkbox values explicitly (they're not included if unchecked)
    data.singleOccupancy = document.getElementById('singleOccupancy').checked;
    data.studentExemption = document.getElementById('studentExemption').checked;
    
    // Add submission timestamp
    data.submittedAt = new Date().toISOString();
    
    return data;
  }

  async submitToServer(data) {
    // Simulate server API call
    // In a real application, this would be your actual API endpoint
    try {
      const response = await fetch('/api/council-tax/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      // For demo purposes, simulate successful submission
      console.log('Simulated form submission:', data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        message: 'Council tax details submitted successfully',
        reference: `CT${Date.now()}`
      };
    }
  }

  showSuccessMessage() {
    this.successMessage.classList.remove('hidden');
    this.form.style.display = 'none';
    
    // Scroll to success message
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Auto-hide success message and show form again after 10 seconds
    setTimeout(() => {
      this.successMessage.classList.add('hidden');
      this.form.style.display = 'block';
    }, 10000);
  }

  clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
      this.form.reset();
      this.clearAllValidationStates();
      
      // Reset city to London
      document.getElementById('city').value = 'London';
      
      // Focus on first field
      document.getElementById('title').focus();
    }
  }

  clearAllValidationStates() {
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('error', 'success');
    });
  }

  scrollToFirstError() {
    const firstError = document.querySelector('.form-input.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CouncilTaxForm('councilTaxForm');
  
  // Add some interactive enhancements
  addFormEnhancements();
});

function addFormEnhancements() {
  // Auto-format phone numbers as user types
  const phoneField = document.getElementById('phone');
  phoneField.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.startsWith('44')) {
      value = '+44 ' + value.substring(2);
    } else if (value.startsWith('0')) {
      // Format as UK landline/mobile
      if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
      }
      if (value.length > 8) {
        value = value.substring(0, 8) + ' ' + value.substring(8);
      }
    }
    
    e.target.value = value;
  });

  // Capitalize names as user types
  ['firstName', 'lastName', 'street', 'area'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
    });
  });

  // Add character counter for comments
  const commentsField = document.getElementById('comments');
  const maxLength = 500;
  
  // Create character counter
  const counter = document.createElement('div');
  counter.className = 'character-counter';
  counter.style.cssText = 'font-size: 0.875rem; color: #626a6e; margin-top: 4px; text-align: right;';
  counter.textContent = `0 / ${maxLength}`;
  
  commentsField.parentNode.appendChild(counter);
  commentsField.setAttribute('maxlength', maxLength);
  
  commentsField.addEventListener('input', (e) => {
    const length = e.target.value.length;
    counter.textContent = `${length} / ${maxLength}`;
    
    if (length > maxLength * 0.9) {
      counter.style.color = '#d4351c';
    } else {
      counter.style.color = '#626a6e';
    }
  });
}