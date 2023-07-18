export const formatNumber = (number, maximumFractionDigits = 0) => {
  return Number(number).toLocaleString("en-In", {
    maximumFractionDigits,
  });
};

export const getCurrencySymbol = (currency) => {
  switch (currency.toLowerCase()) {
    case "inr":
      return "₹";
    case "eur":
      return "€";
    case "gbp":
      return "£";
    case "aud":
      return "A$";
    case "cad":
      return "C$";
    case "aed":
      return "د.إ";
    case "sar":
      return "ر.س";
    case "myr":
      return "RM";
    case "omr":
      return "﷼";
    default:
      return "$";
  }
};

export const getFormDataSize = (formData) => {
  let totalSize = 0;
  for (let pair of formData.entries()) {
    switch (typeof pair[0]) {
      case "string":
        totalSize += pair[1].length || 0;
        break;
      case "object":
        totalSize += pair[1].size || 8;
        break;
      default:
        totalSize += 8;
    }
  }
  return totalSize / 1000000;
};

export const userAgent =
  typeof window !== "undefined" ? window.navigator.userAgent : "";

export const isMobileDevice = {
  Android: function () {
    return userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (
      isMobileDevice.Android() ||
      isMobileDevice.BlackBerry() ||
      isMobileDevice.iOS() ||
      isMobileDevice.Opera() ||
      isMobileDevice.Windows()
    );
  },
};
