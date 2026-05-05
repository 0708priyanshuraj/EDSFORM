/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */

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
 * Format number to Indian currency format
 */
function formatIndianCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
 * INIT EMI CALCULATOR
 */
function initEMICalculator() {
  // ✅ CORRECT SELECTORS (based on your HTML)

  const loanAmountInput = document.querySelector('#numberinput-b5966ec03e');
  const loanTenureInput = document.querySelector('#numberinput-0340fd7e24');

  const xpressField = document.querySelector('#textinput-378a51dc47');
  const emiAmountField = document.querySelector('#textinput-b5b7374de8');
  const roiField = document.querySelector('#textinput-1c459dc1b4');
  const taxField = document.querySelector('#textinput-ec3ebad510');

  const loanAmountBubble = loanAmountInput
    ?.closest('.range-widget-wrapper')
    ?.querySelector('.range-bubble');

  const tenureBubble = loanTenureInput
    ?.closest('.range-widget-wrapper')
    ?.querySelector('.range-bubble');

  if (!loanAmountInput || !loanTenureInput || !xpressField || !emiAmountField) {
    console.log('Required elements missing ❌');
    return;
  }

  const annualRate = 10.97;
  const taxPercent = 18; // GST example

  function updateEMICalculation() {
    const loanAmount = parseFloat(loanAmountInput.value) || 50000;
    const tenure = parseFloat(loanTenureInput.value) || 12;

    // ✅ Loan display
    xpressField.value = formatIndianCurrency(loanAmount);

    // ✅ EMI calculation
    const emi = calculateEMI(loanAmount, annualRate, tenure);
    emiAmountField.value = formatIndianCurrency(emi);

    // ✅ ROI display
    if (roiField) {
      roiField.value = `${annualRate}% p.a.`;
    }

    // ✅ TAX calculation (optional logic)
    if (taxField) {
      const tax = Math.round((emi * taxPercent) / 100);
      taxField.value = formatIndianCurrency(tax);
    }

    // ✅ Update bubbles
    if (loanAmountBubble) {
      loanAmountBubble.textContent = formatIndianCurrency(loanAmount);
    }

    if (tenureBubble) {
      tenureBubble.textContent = `${Math.round(tenure)} months`;
    }
  }

  // ✅ EVENTS
  loanAmountInput.addEventListener('input', updateEMICalculation);
  loanTenureInput.addEventListener('input', updateEMICalculation);

  // ✅ INITIAL RUN
  updateEMICalculation();
}
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
  const enterEmployerName = getVal('enter_employer_company_name');
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
  setValById('textinput-faa35cc00c', emiAmountDisplay); // emi_amount 
  setValById('textinput-5f4d136d28', tenureForDisplay); // tenure
  setValById('textinput-22b1e701b9', taxesDisplay); // processing_fee (Taxes)
  setValById('textinput-721bf835c1', roiDisplay); // rate_of_interest
  setValById('textinput-db68d340ff', resolvedEmployerName); // employer_name
  // schedule_of_charges (textinput-0295f6b473) — no direct source field; leave unchanged
  setValById('textinput-41298e8cd6', selectLoanType); // type_of_loan

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

  setValById('textinput-338c537319', fullName); // full_name
  setValById('textinput-48f479429a', mobileNumber); // mobile_number

  // Date of birth target (datepicker-a8de48027a)
  const dobTarget = document.getElementById('datepicker-a8de48027a');
  if (dobTarget) {
    dobTarget.value = dobDisplayValue;
    dobTarget.setAttribute('display-value', dobDisplayValue);
    dobTarget.setAttribute('edit-value', dobEditValue);
  }

  setValById('textinput-f7cb1ba930', panNumber); // pan
  setValById('textinput-0f232dc804', aadhaarAddress); // current_address
  setValById('textinput-322734dd37', residenceType); // residence_type

  // ─── 3. Salary Account Details ──────────────────────────────────────────────
  // Salary account number (textinput-6cd7d23dbf → name="salary_account")
  const salaryAccountNumber = getVal('salary_account');
  // IFSC (textinput-31c9044207 → name="ifsc") — source panel has one ifsc field
  const ifscSource = getValById('textinput-31c9044207');
  // Bank name: prefer "Other" text; otherwise use the radio button label
  const salaryBankOther = getVal('salary_bank_other');
  const salaryBankLabel = getRadioLabel('salary_bank');
  const bankName = salaryBankOther.trim() || salaryBankLabel;

  setValById('textinput-c06ffc5b00', salaryAccountNumber); // salary_account_number
  setValById('textinput-321a9f6344', ifscSource); // ifsc
  setValById('textinput-e294a4225e', bankName); // bank_name

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

  setValById('emailinput-a406431806', personalEmail); // personal_email_id
  setValById('emailinput-eecc41b376', workEmail); // work_email_id
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
};
