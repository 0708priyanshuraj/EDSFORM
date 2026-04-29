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

/**
 * Starts OTP countdown timer
 * - Shows countdown in timer field
 * - Disables resend button during countdown
 * - Enables resend button after timer ends
 * @param {scope} globals
 */
function startOtpTimer(globals) {
  console.log(globals.form);
  const timerField = globals?.form?.otp_input?.timer;
  const resendBtn = globals?.form?.otp_input?.resend_button;

  let seconds = 45;

  if (!timerField || !resendBtn) {
    console.log("Timer elements missing ❌");
    return "";
  }

  globals.functions.setProperty(resendBtn, { enabled: false });

  if (globals.otpTimerInterval) {
    clearTimeout(globals.otpTimerInterval);
  }

  function updateTimer() {
    if (seconds > 0) {
      globals.functions.setProperty(timerField, {
        value: `${seconds}s`,
      });
      seconds--;
      globals.otpTimerInterval = setTimeout(updateTimer, 1000);
    } else {
      globals.functions.setProperty(resendBtn, { enabled: true });
      globals.functions.setProperty(timerField, {
        value: "Resend OTP",
      });
    }
  }

  updateTimer();

  return "";
}
// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
};
