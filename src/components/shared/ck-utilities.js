export const getUrlParameter = (name, url = "") => {
  if (!url && typeof window !== "undefined") {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
    results = regex.exec(url);

  if (!results || !results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
