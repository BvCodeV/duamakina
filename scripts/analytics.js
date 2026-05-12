(function () {
  if (window.__vercelAnalyticsLoaded) return;
  window.__vercelAnalyticsLoaded = true;

  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };

  const script = document.createElement("script");
  script.defer = true;
  script.src = "/_vercel/insights/script.js";

  document.head.appendChild(script);
})();

document.getElementById('viewDetailsBtn').addEventListener('click', () => {
    va("event", {
    name: "view_details_button_clicked",
  });
});

document.getElementById('searchBtn').addEventListener('click', () => {
    va("event", {
    name: "search_button_clicked",
  });
});

document.getElementById('bookNow').addEventListener('click', () => {
    va("event", {
    name: "next_to_form_button_clicked",
  });
});

document.getElementById('formSendBtn').addEventListener('click', () => {
    va("event", {
    name: "form_send_button_clicked",
  });
});