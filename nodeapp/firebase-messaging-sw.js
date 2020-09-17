importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyBzh3wW-C3vjA0ARQfy1hWUn5_HSVScuJs",
    authDomain: "pushnotificationnginxnode.firebaseapp.com",
    databaseURL: "https://pushnotificationnginxnode.firebaseio.com",
    projectId: "pushnotificationnginxnode",
    storageBucket: "pushnotificationnginxnode.appspot.com",
    messagingSenderId: "769426444179",
    appId: "1:769426444179:web:31a693ad4f1476ec672266",
    measurementId: "G-ZTGP9HQ4YX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});