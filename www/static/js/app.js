// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
};
firebase.initializeApp(config);

var version = "1.0.0";


var app = angular.module('app', ['ngRoute', 'firebase']);


app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: 'templates/default.html'
    })
    .when('/signin', {
      controller: 'SigninCtrl',
      templateUrl: 'templates/signin.html'
    })
    .when('/logout', {
      controller: 'LogoutCtrl',
      templateUrl: 'templates/signin.html'
    })
    .when('/reset-password', {
      controller: 'PasswordCtrl',
      templateUrl: 'templates/reset-password.html'
    })
    .when('/error', {
      controller: 'ErrorCtrl',
      templateUrl: 'templates/error.html'
    })
    .when('/users', {
      controller: 'UserManagementCtrl',
      templateUrl: 'templates/users/management.html'
    })
    .when('/profile', {
      controller: 'UserProfileCtrl',
      templateUrl: 'templates/users/profile.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
