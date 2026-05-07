/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import { updateRangeEligibility } from './components/range/range.js';
/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are invalid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}
/**
 * Validate DOB age between 18 and 59
 */
function validateDOB() {
  // DOB input
  const dobInput = document.getElementById(
    'datepicker-2e2ea3b883',
  );

  const dobValue = dobInput?.value;

  if (!dobValue) {
    return false;
  }

  // Convert DOB
  const dob = new Date(dobValue);

  // Today's date
  const today = new Date();

  // Calculate age
  let age = today.getFullYear()
    - dob.getFullYear();

  const monthDiff = today.getMonth()
    - dob.getMonth();

  // Adjust age
  if (
    monthDiff < 0
    || (
      monthDiff === 0
      && today.getDate() < dob.getDate()
    )
  ) {
    age -= 1;
  }

  // Remove old error
  let errorEl = document.getElementById(
    'dob-age-error',
  );

  if (errorEl) {
    errorEl.remove();
  }

  // Invalid age
  if (age < 18 || age > 59) {
    errorEl = document.createElement('div');

    errorEl.id = 'dob-age-error';

    errorEl.style.color = 'red';

    errorEl.style.fontSize = '12px';

    errorEl.style.marginTop = '5px';

    errorEl.textContent = 'Age must be between 18 and 59 years';

    dobInput.parentElement.appendChild(errorEl);

    return false;
  }

  return true;
}
/**
 * Masks the first 5 digits of the mobile number with *
 * @param {*} mobileNumber
 * @returns {string} returns the mobile number with first 5 digits masked
 */
function maskMobileNumber(mobileNumber) {
  if (!mobileNumber) {
    return '';
  }
  const value = mobileNumber.toString();

  // Mask first 5 digits and keep the rest
  return ` ${'*'.repeat(5)}${value.substring(5)}`;
}

let otpTimerInterval;

const OTP_API_BASE = 'https://dimmer-headroom-feed.ngrok-free.dev';

let attemptsLeft = 3;

/**
 * Start OTP timer - counts down from 30 seconds
 * Disables resend button during countdown
 */
function startOtpTimer() {
  const timerInput = document.querySelector('input[name="timer"]');
  const resendBtn = document.querySelector('.field-resend-button button');

  let timeLeft = 30;

  // Clear any existing timer
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
  }

  // Disable resend button
  if (resendBtn) {
    resendBtn.disabled = true;
  }

  // Set initial timer value
  if (timerInput) {
    timerInput.value = `${timeLeft}s`;
  }

  // Start countdown
  otpTimerInterval = setInterval(() => {
    timeLeft -= 1;

    if (timerInput) {
      timerInput.value = `${timeLeft}s`;
    }

    // When timer reaches 0
    if (timeLeft <= 0) {
      clearInterval(otpTimerInterval);

      // Enable resend button
      if (resendBtn) {
        resendBtn.disabled = false;
      }

      if (timerInput) {
        timerInput.value = '0s';
      }
    }
  }, 1000);
}

/**
 * Stop OTP timer
 */
function stopOtpTimer() {
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
    otpTimerInterval = null;
  }
}

/**
 * Generate OTP
 */
/**
 * Generate OTP
 */
async function generateOtp(e) {
  // Prevent form refresh
  if (e) e.preventDefault();

  try {
    const isDobValid = validateDOB();

    if (!isDobValid) {
      return;
    }
    // Mobile number
    const mobile = document.getElementById(
      'textinput-ab0417d81c',
    )?.value;

    // DOB
    const dob = document.getElementById(
      'datepicker-2e2ea3b883',
    )?.value;

    // OTP input
    const otpInput = document.getElementById(
      'textinput-824653b80f',
    );

    // Validation field
    const validationField = document.getElementById(
      'textinput-249c33fc5d',
    );

    // Submit button
    const submitBtn = document.getElementById(
      'submit-aff44386ed',
    );

    // API call
    const res = await fetch(
      `${OTP_API_BASE}/api/generate-otp`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          mobile,
          dob,
        }),
      },
    );

    const data = await res.json();

    console.log('Generate OTP:', data);

    // SUCCESS
    if (res.ok) {
      // Reset attempts
      attemptsLeft = 3;

      // Disable submit button initially
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      // Reset validation field
      if (validationField) {
        validationField.style.color = '#000';

        validationField.value = `Attempts Left: ${attemptsLeft}/3`;
      }

      // Auto fill OTP for testing
      if (otpInput && data.otp) {
        otpInput.value = data.otp;
      }

      // Start timer
      startOtpTimer();
    }
  } catch (err) {
    console.error(
      'Generate OTP Error:',
      err,
    );
  }
}

/**
 * Validate OTP
 */
/**
 * Validate OTP
 */
/**
 * Validate OTP
 */
async function validateOtp(e) {
  // Prevent form refresh
  if (e) e.preventDefault();

  try {
    // Mobile number
    const mobile = document.getElementById(
      'textinput-ab0417d81c',
    )?.value;

    // OTP
    const otp = document.getElementById(
      'textinput-824653b80f',
    )?.value;

    // Validation field
    const validationField = document.getElementById(
      'textinput-249c33fc5d',
    );

    // Submit button
    const submitBtn = document.getElementById(
      'submit-aff44386ed',
    );

    // Resend button
    const resendBtn = document.querySelector(
      '.field-resend-button button',
    );

    // Timer input
    const timerInput = document.querySelector(
      'input[name="timer"]',
    );

    // API call
    const res = await fetch(
      `${OTP_API_BASE}/api/validate-otp`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          mobile,
          otp,
        }),
      },
    );

    const data = await res.json();

    console.log('Validate OTP:', data);

    // SUCCESS
    if (res.ok) {
      // Success message
      if (validationField) {
        validationField.value = '✔ OTP Verified Successfully';

        validationField.style.color = 'green';
      }

      // Enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
      }

      // Stop timer
      stopOtpTimer();

      // Clear timer text
      if (timerInput) {
        timerInput.value = '';
      }
    }

    // FAILED
    else {
      // Decrease attempts
      attemptsLeft -= 1;

      // Prevent negative values
      if (attemptsLeft < 0) {
        attemptsLeft = 0;
      }

      // Stop timer immediately
      stopOtpTimer();

      // Clear timer text
      if (timerInput) {
        timerInput.value = '';
      }

      // Attempts remaining
      if (attemptsLeft > 0) {
        // Enable resend button
        if (resendBtn) {
          resendBtn.disabled = false;
        }

        if (validationField) {
          validationField.value = `❌ Incorrect OTP. Attempts Left: ${attemptsLeft}/3`;

          validationField.style.color = 'red';
        }
      }

      // Attempts exhausted
      else {
        if (validationField) {
          validationField.value = '❌ Too many failed attempts. Try again after 24 hours';

          validationField.style.color = 'red';
        }

        // Disable resend button permanently
        if (resendBtn) {
          resendBtn.disabled = true;
        }
      }

      // Keep submit disabled
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      // Backend log
      if (data.message) {
        console.log(data.message);
      }
    }
  } catch (err) {
    console.error(
      'Validate OTP Error:',
      err,
    );
  }
}
/**
 * Format number to Indian currency format
 */
function formatIndianCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function generateReferenceNumber() {
  const refInput = document.querySelector('input[name="reference_number"]');

  const refNo = Math.floor(1000000000 + Math.random() * 9000000000);

  if (refInput) {
    refInput.value = refNo;
  }

  return refNo.toString();
}
/**
 * EMI Calculation
 */
function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / (12 * 100);

  if (monthlyRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const onePlusR = 1 + monthlyRate;
  const onePlusRPowerN = onePlusR ** tenureMonths;

  const emi = (principal * monthlyRate * onePlusRPowerN) / (onePlusRPowerN - 1);

  return Math.round(emi);
}

/**
 * Calculate eligible loan amount
 */
function calculateEligibleLoan(monthlySalary) {
  const multiplier = 20;

  let eligibleLoan = monthlySalary * multiplier;

  // Minimum limit
  if (eligibleLoan < 50000) {
    eligibleLoan = 50000;
  }

  // Maximum limit
  if (eligibleLoan > 1500000) {
    eligibleLoan = 1500000;
  }

  return Math.round(eligibleLoan);
}

/**
 * Calculate eligible tenure
 */
function calculateEligibleTenure(monthlySalary) {
  if (monthlySalary <= 25000) {
    return 24;
  }

  if (monthlySalary <= 40000) {
    return 48;
  }

  if (monthlySalary <= 60000) {
    return 60;
  }

  return 84;
}
/**
 * INIT EMI CALCULATOR
 */
/**
 * INIT EMI CALCULATOR
 */
function initEMICalculator() {
  // ✅ SELECTORS
  const loanAmountInput = document.querySelector('#numberinput-b5966ec03e');

  const loanTenureInput = document.querySelector('#numberinput-0340fd7e24');

  const salaryInput = document.querySelector('#numberinput-37414d3da4');

  const xpressField = document.querySelector('#textinput-378a51dc47');

  const emiAmountField = document.querySelector('#textinput-b5b7374de8');

  const roiField = document.querySelector('#textinput-1c459dc1b4');

  const taxField = document.querySelector('#textinput-ec3ebad510');

  const loanOfferText = document.querySelector('#text-d9d56d62ae');

  // ✅ RANGE BUBBLES
  const loanAmountBubble = loanAmountInput
    ?.closest('.range-widget-wrapper')
    ?.querySelector('.range-bubble');

  const tenureBubble = loanTenureInput
    ?.closest('.range-widget-wrapper')
    ?.querySelector('.range-bubble');

  // ✅ VALIDATION
  if (
    !loanAmountInput
    || !loanTenureInput
    || !salaryInput
    || !xpressField
    || !emiAmountField
  ) {
    console.log('Required elements missing ❌');
    return;
  }

  // ✅ FIXED VALUES
  const annualRate = 10.97;
  const taxPercent = 18;

  /**
   * UPDATE EMI CALCULATION
   */
  function updateEMICalculation() {
    // ✅ Salary
    const salaryValue = salaryInput.value;

    const salary = Number(salaryValue);

    // ✅ Default open sliders
    let eligibleLoanAmount = 1500000;
    let eligibleTenure = 84;

    // ✅ Apply eligibility only if salary entered
    if (salaryValue !== '') {
      eligibleLoanAmount = Math.min(
        calculateEligibleLoan(salary),
        1500000,
      );

      eligibleTenure = calculateEligibleTenure(salary);
    }

    // ✅ Update offer text
    if (loanOfferText) {
      loanOfferText.innerHTML = `<p>You can get a loan up to ${formatIndianCurrency(eligibleLoanAmount)}!</p>`;
    }

    loanAmountInput.max = eligibleLoanAmount;
    // Update slider markers dynamically
    const loanFieldDiv = loanAmountInput.closest('.field-wrapper');

    if (loanFieldDiv?.rangeWrapper) {
      updateRangeEligibility(
        loanFieldDiv.rangeWrapper,
        loanFieldDiv.rangeInput,
        eligibleLoanAmount,
        loanFieldDiv.rangeFormatType,
      );
    }

    // ✅ Set current loan amount properly
    if (
      Number(loanAmountInput.value)
  > eligibleLoanAmount
  || Number(loanAmountInput.value) === 50000
    ) {
      loanAmountInput.value = eligibleLoanAmount;
    }
    loanTenureInput.max = eligibleTenure;
    const tenureFieldDiv = loanTenureInput.closest('.field-wrapper');

    if (tenureFieldDiv?.rangeWrapper) {
      updateRangeEligibility(
        tenureFieldDiv.rangeWrapper,
        tenureFieldDiv.rangeInput,
        eligibleTenure,
        tenureFieldDiv.rangeFormatType,
      );
    }
    // ✅ Set current tenure properly
    if (
      Number(loanTenureInput.value)
  > eligibleTenure
  || Number(loanTenureInput.value) === 12
    ) {
      loanTenureInput.value = eligibleTenure;
    }

    // ✅ Prevent exceeding loan amount
    if (
      Number(loanAmountInput.value)
      > eligibleLoanAmount
    ) {
      loanAmountInput.value = eligibleLoanAmount;
    }

    // ✅ Prevent exceeding tenure
    if (
      Number(loanTenureInput.value)
      > eligibleTenure
    ) {
      loanTenureInput.value = eligibleTenure;
    }

    // ✅ Current values
    const loanAmount = Number(loanAmountInput.value)
      || eligibleLoanAmount;

    const tenure = Number(loanTenureInput.value) || 12;

    // ✅ Display loan amount
    xpressField.value = formatIndianCurrency(loanAmount);

    // ✅ EMI
    const emi = calculateEMI(
      loanAmount,
      annualRate,
      tenure,
    );

    emiAmountField.value = formatIndianCurrency(emi);

    // ✅ ROI
    if (roiField) {
      roiField.value = `${annualRate}% p.a.`;
    }

    // ✅ TAX
    if (taxField) {
      const tax = Math.round(
        (emi * taxPercent) / 100,
      );

      taxField.value = formatIndianCurrency(tax);
    }

    // ✅ Loan bubble
    if (loanAmountBubble) {
      loanAmountBubble.textContent = formatIndianCurrency(loanAmount);
    }

    // ✅ Tenure bubble
    if (tenureBubble) {
      tenureBubble.textContent = `${Math.round(tenure)} months`;
    }
  }

  // ✅ EVENTS
  loanAmountInput.addEventListener(
    'input',
    updateEMICalculation,
  );

  loanTenureInput.addEventListener(
    'input',
    updateEMICalculation,
  );

  salaryInput.addEventListener(
    'input',
    updateEMICalculation,
  );

  // ✅ INITIAL RUN
  updateEMICalculation();
}
setTimeout(() => {
  initEMICalculator();
}, 2000);

function mapFormFieldsToReview() {
  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Get value from the FIRST matching element with this name.
   * For radio groups returns the value of the checked option.
   */
  const getVal = (name) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (!el) return '';
    if (el.type === 'radio') {
      const checked = document.querySelector(`[name="${name}"]:checked`);
      return checked ? checked.value : '';
    }
    return el.value || '';
  };

  /**
   * Get value from a specific element by its unique id.
   */
  const getValById = (id) => {
    const el = document.getElementById(id);
    return el ? (el.value || '') : '';
  };

  /**
   * Set value on a specific element by its unique id.
   */
  const setValById = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  };

  /**
   * Return the visible label text for the checked radio in a group.
   */
  const getRadioLabel = (name) => {
    const checked = document.querySelector(`[name="${name}"]:checked`);
    if (!checked) return '';
    const label = document.querySelector(`label[for="${checked.id}"]`);
    return label ? label.textContent.trim() : checked.value;
  };

  // ─── 1. Loan Details ────────────────────────────────────────────────────────
  // Loan amount comes from the range slider (numberinput-b5966ec03e)
  const rawLoanAmount = getValById('numberinput-b5966ec03e');
  // Tenure comes from the tenure range slider (numberinput-0340fd7e24)
  const rawTenure = getValById('numberinput-0340fd7e24');
  // EMI Amount display field (textinput-b5b7374de8 — label "EMI Amount")
  const emiAmountDisplay = getValById('textinput-b5b7374de8');
  // Rate of Interest display field (textinput-1c459dc1b4)
  const roiDisplay = getValById('textinput-1c459dc1b4');
  // Taxes display field (textinput-ec3ebad510)
  const taxesDisplay = getValById('textinput-ec3ebad510');
  // Employer name: prefer free-text entry; fall back to dropdown label
  const enterEmployerName = getVal('textinput-3a2473bd28');
  const employerDropdownVal = getVal('employer_company_name');
  const resolvedEmployerName = enterEmployerName || (employerDropdownVal !== 'others' ? employerDropdownVal : '');
  // Loan type dropdown
  const selectLoanType = getVal('select_loan_type');

  // Format loan amount for display if it is a raw number
  let loanAmountForDisplay = rawLoanAmount;
  if (rawLoanAmount && !rawLoanAmount.includes('₹')) {
    const num = parseFloat(rawLoanAmount);
    if (!Number.isNaN(num)) loanAmountForDisplay = formatIndianCurrency(num);
  }

  // Format tenure for display if it is a raw number
  let tenureForDisplay = rawTenure;
  if (rawTenure && !/months/.test(rawTenure)) {
    const num = parseFloat(rawTenure);
    if (!Number.isNaN(num)) tenureForDisplay = `${Math.round(num)} months`;
  }

  setValById('textinput-ca40938a70', loanAmountForDisplay); // loan_amount
  setValById('textinput-955c226224', loanAmountForDisplay); // second mapping
  setValById('textinput-faa35cc00c', emiAmountDisplay); // emi_amount
  setValById('textinput-5ac96d3c9f', tenureForDisplay);
  setValById('textinput-2775dad98d', taxesDisplay); // processing_fee
  setValById('textinput-40ebd5a0e2', roiDisplay); // rate_of_interest
  setValById('textinput-44ecd4a77b', resolvedEmployerName);// employer_name
  // schedule_of_charges (textinput-0295f6b473) — no direct source field; leave unchanged
  setValById('textinput-efee62d637', selectLoanType); // type_of_loan
  // ─── 2. Personal Details ────────────────────────────────────────────────────
  // Full name: concatenate first + middle + last from the PAN name panel
  const firstName = getVal('first_name');
  const middleName = getVal('middle_name');
  const lastName = getVal('last_name');
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();

  // Mobile number from the welcome panel (textinput-ab0417d81c)
  const mobileNumber = getValById('textinput-ab0417d81c');

  // Date of birth from the welcome panel (datepicker-2e2ea3b883)
  const dobSource = document.getElementById('datepicker-2e2ea3b883');
  const dobDisplayValue = dobSource ? (dobSource.getAttribute('display-value') || dobSource.value || '') : '';
  const dobEditValue = dobSource ? (dobSource.getAttribute('edit-value') || dobSource.value || '') : '';

  // PAN number
  const panNumber = getVal('pan_number');

  // Address from Aadhaar records
  const aadhaarAddress = getVal('address_as_per_aadhaar_records');

  // Residence type: label of the selected "is_customers_aadhaar_address" radio
  const residenceType = getRadioLabel('is_customers_aadhaar_address');

  setValById('textinput-73aef4c181', fullName); // full_name
  setValById('textinput-48f479429a', mobileNumber); // mobile_number

  // Date of birth target (datepicker-a8de48027a)
  const dobTarget = document.getElementById('datepicker-a8de48027a');
  if (dobTarget) {
    dobTarget.value = dobDisplayValue;
    dobTarget.setAttribute('display-value', dobDisplayValue);
    dobTarget.setAttribute('edit-value', dobEditValue);
  }

  setValById('textinput-4e73ae7b41', panNumber); // pan
  setValById('textinput-1e826e3496', aadhaarAddress); // current_address
  setValById('textinput-2a6ea8b0d8', residenceType); // residence_type

  // ─── 3. Salary Account Details ──────────────────────────────────────────────
  // Salary account number (textinput-6cd7d23dbf → name="salary_account")
  const salaryAccountNumber = getVal('salary_account');
  // IFSC (textinput-31c9044207 → name="ifsc") — source panel has one ifsc field
  const ifscSource = getValById('textinput-31c9044207');
  // Bank name: prefer "Other" text; otherwise use the radio button label
  const salaryBankOther = getVal('salary_bank_other');
  const salaryBankLabel = getRadioLabel('salary_bank');
  const bankName = salaryBankOther.trim() || salaryBankLabel;

  setValById('textinput-86936ede94', salaryAccountNumber); // salary_account_number
  setValById('textinput-7c948823f5', ifscSource); // ifsc
  setValById('textinput-99ee84213a', bankName); // bank_name

  // ─── 4. Office Address ──────────────────────────────────────────────────────
  // No explicit "office address" source field in the provided HTML.
  // The employer name is already mapped above; industry type is available if needed.
  // current_employer_address (textinput-76f014ea9b) — leave unchanged unless a source
  // field is added later; map employer name as a fallback label.
  // (no-op — placeholder for future source field)

  // ─── 5. Verify Email ID ─────────────────────────────────────────────────────
  // Personal email: emailinput-d61e9efa6c (name="enter_email_id" inside personal_details panel)
  const personalEmail = getValById('emailinput-d61e9efa6c');
  // Work email: emailinput-20d267620a (name="enter_email_id" inside work_email_id_panel)
  const workEmail = getValById('emailinput-20d267620a');

  setValById('emailinput-7caf42d1f8', personalEmail); // personal_email_id // personal_email_id
  setValById('emailinput-2a658c4c9f', workEmail); // work_email_id
}

/**
 * Initialize form field mapping.
 * Attaches input/change listeners to all source fields so the review section
 * stays in sync as the user fills in the form.
 * Also wires the "Proceed >" button (button-5e47e6952d) to trigger a final sync.
 */
function initFormFieldMapping() {
  const fieldsToMonitor = [
    'mobile_number',
    'date_of_birth',
    'income_source',
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'pan_number',
    'address_as_per_aadhaar_records',
    'is_customers_aadhaar_address',
    'employer_company_name',
    'enter_employer_company_name',
    'industry_type',
    'monthly_net_income_salary',
    'ongoing_emis_if_any',
    'select_loan_type',
    'salary_bank',
    'salary_bank_other',
    'salary_account',
    'ifsc',
  ];

  // Named-field listeners
  fieldsToMonitor.forEach((fieldName) => {
    const fields = document.querySelectorAll(`[name="${fieldName}"]`);

    fields.forEach((field) => {
      const eventType = field.type === 'radio' || field.tagName === 'SELECT'
        ? 'change'
        : 'input';

      field.addEventListener(eventType, () => {
        setTimeout(mapFormFieldsToReview, 100);
      });
    });
  });

  // ID-based listeners
  const idsToMonitor = [
    'numberinput-b5966ec03e',
    'numberinput-0340fd7e24',
    'textinput-b5b7374de8',
    'textinput-1c459dc1b4',
    'textinput-ec3ebad510',
    'emailinput-d61e9efa6c',
    'emailinput-20d267620a',
  ];

  idsToMonitor.forEach((id) => {
    const el = document.getElementById(id);

    if (el) {
      el.addEventListener('input', () => {
        setTimeout(mapFormFieldsToReview, 100);
      });
    }
  });

  // Proceed button
  const proceedButton = document.getElementById('button-5e47e6952d');

  if (proceedButton) {
    proceedButton.addEventListener('click', mapFormFieldsToReview);
  }

  // =============================================
  // VIEW LOAN ELIGIBILITY BUTTON
  // =============================================
  const eligibilityButton = document.getElementById(
    'submit-52b8213e98',
  );

  if (eligibilityButton) {
    eligibilityButton.addEventListener('click', (e) => {
      // Prevent form refresh
      e.preventDefault();

      // Generate OTP
      generateOtp(e);
    });
  }

  // =============================================
  // RESEND OTP BUTTON
  // =============================================
  const resendButton = document.getElementById(
    'button-c8e85fa9d2',
  );

  if (resendButton) {
    resendButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Generate OTP again
      generateOtp(e);
    });
  }

  // =============================================
  // VERIFY OTP BUTTON
  // =============================================
  const verifyOtpButton = document.getElementById(
    'button-b40e691afc',
  );

  if (verifyOtpButton) {
    verifyOtpButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Validate OTP
      validateOtp(e);
    });
  }

  // Initial run
  mapFormFieldsToReview();
}
// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
  stopOtpTimer,
  calculateEMI,
  formatIndianCurrency,
  initEMICalculator,
  mapFormFieldsToReview,
  initFormFieldMapping,
  generateReferenceNumber,
  generateOtp,
  validateOtp,
  validateDOB,
};
