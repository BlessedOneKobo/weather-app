function validateCountryCode(data, val, errorPropName) {
  if (!validate(data, val, errorPropName)) {
    return false;
  }

  if (val.length !== 2) {
    data[errorPropName] = "Invalid country code";
    return false;
  }

  return true;
}

function validate(data, val, errorPropName) {
  if (!val) {
    data[errorPropName] = "Required";
    return false;
  }

  data[errorPropName] = "";
  return true;
}

function checkForErrors(inputData) {
  const { apiKey, city, countryCode } = inputData;

  const apiKeyValid = validate(templateData, apiKey, "apiKeyError");
  const countryCodeValid = validateCountryCode(
    templateData,
    countryCode,
    "countryCodeError"
  );
  const cityValid = validate(templateData, city, "cityError");

  return !apiKeyValid || !countryCodeValid || !cityValid;
}
