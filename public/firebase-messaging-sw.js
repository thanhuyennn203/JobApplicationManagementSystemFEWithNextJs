importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyBV_iL72XDAei_kHKZhQ-_iMAJYA8kR6MQ",
  authDomain: "jobapplicationmanagementsys.firebaseapp.com",
  projectId: "jobapplicationmanagementsys",
  storageBucket: "jobapplicationmanagementsys.firebasestorage.app",
  messagingSenderId: "861780248380",
  appId: "1:861780248380:web:2d7ca0131d497c6bc54039",
  measurementId: "G-6ELX8W01S9"
});

const messaging = firebase.messaging();

function getNotificationUrl(data) {
  const type = data.type;
  const relatedId = data.relatedId;
  const role = (data.receiverRole || "").toUpperCase();

  switch (type) {
    case "JOB_POSTED":
      return relatedId ? `/candidate/jobs/${relatedId}` : "/candidate/jobs";
    case "APPLICATION_STATUS_CHANGED":
      return relatedId
        ? `/candidate/jobs/applied?applicationId=${relatedId}`
        : "/candidate/jobs/applied";
    case "SAVED_JOB_EXPIRING":
    case "SAVED_JOB_EXPIRED":
    case "SAVED_JOB_CLOSED":
      return relatedId ? `/candidate/jobs/${relatedId}` : "/candidate/jobs/saved";
    case "APPLICATION_SUBMITTED":
      return relatedId
        ? `/recruiter/application?applicationId=${relatedId}`
        : "/recruiter/application";
    case "JOB_EXPIRED":
      return relatedId ? `/recruiter/jobs/edit/${relatedId}` : "/recruiter/jobs";
    case "COMPANY_VERIFICATION":
      if (role === "ADMIN") {
        return relatedId ? `/admin/company?companyId=${relatedId}` : "/admin/company";
      }
      return "/recruiter/company/verify";
    default:
      return "/";
  }
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || payload.notification?.title || "New notification";
  const options = {
    body: data.message || payload.notification?.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      url: getNotificationUrl(data),
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || "/", self.location.origin)
    .href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        return clients.openWindow(targetUrl);
      })
  );
});
