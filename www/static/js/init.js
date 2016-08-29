app.run(function($rootScope, fireauth){
  $rootScope.version = version;
  $rootScope.page_title = "Welcome to Firebase Initial App";
  $rootScope.page_url = location.hash;
  $rootScope.current_user = null;
  $rootScope.schools = [];
  $rootScope.hidenav = false;
  fireauth.set_current_user($rootScope);
});
