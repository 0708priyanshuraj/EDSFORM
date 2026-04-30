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
      data[key] = data[key].join(",");
    }
  });
  globals.functions.submitForm(data, true, "application/json");
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

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
    return "";
  }
  const value = mobileNumber.toString();

  // Mask first 5 digits and keep the rest
  return ` ${"*".repeat(5)}${value.substring(5)}`;
}


let otpTimerInterval;
/**
 * Start OTP timer - counts down from 30 seconds
 * Disables resend button during countdown
 */
function startOtpTimer() {
  const timerInput = document.querySelector('input[name="timer"]');
  const resendBtn = document.querySelector('.field-resend-otp button');

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
        timerInput.value = "0s";
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
  const onePlusRPowerN = Math.pow(onePlusR, tenureMonths);

  const emi =
    (principal * monthlyRate * onePlusRPowerN) /
    (onePlusRPowerN - 1);

  return Math.round(emi);
}

/**
 * INIT EMI CALCULATOR
 */
function initEMICalculator() {
  // ✅ CORRECT SELECTORS (based on your HTML)

  const loanAmountInput = document.querySelector("#numberinput-b5966ec03e");
  const loanTenureInput = document.querySelector("#numberinput-0340fd7e24");

  const xpressField = document.querySelector("#textinput-378a51dc47");
  const emiAmountField = document.querySelector("#textinput-b5b7374de8");
  const roiField = document.querySelector("#textinput-1c459dc1b4");
  const taxField = document.querySelector("#textinput-ec3ebad510");

  const loanAmountBubble = loanAmountInput
    ?.closest(".range-widget-wrapper")
    ?.querySelector(".range-bubble");

  const tenureBubble = loanTenureInput
    ?.closest(".range-widget-wrapper")
    ?.querySelector(".range-bubble");

  if (!loanAmountInput || !loanTenureInput || !xpressField || !emiAmountField) {
    console.log("Required elements missing ❌");
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
  loanAmountInput.addEventListener("input", updateEMICalculation);
  loanTenureInput.addEventListener("input", updateEMICalculation);

  // ✅ INITIAL RUN
  updateEMICalculation();
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
  calculateEMI,
  formatIndianCurrency,
  initEMICalculator,
  startOtpTimer,
  stopOtpTimer,
};
