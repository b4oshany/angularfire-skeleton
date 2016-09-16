app.run(function($rootScope, fireauth){
  $rootScope.version = version;
  $rootScope.bs_container_class = "container";


  $rootScope.page_title = "Welcome to Firebase Initial App";
  $rootScope.app_config = {
    company_name: "Alteroo",
    author_name: "Oshane Bailey",
    author_email: "oshane@osoobe.com",
    site_name: "Test App",
    site_desc: "Test App."
  };

  $rootScope.page_url = location.hash;
  $rootScope.current_user = null;
  $rootScope.current_profile_user = null;
  $rootScope.hidenav = false;
  fireauth.set_current_user($rootScope);
});
