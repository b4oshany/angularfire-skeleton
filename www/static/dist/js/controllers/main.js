
app.controller('MainController', function($scope, fireauth){
});

app.controller('ErrorCrtl', function($scope, fireauth){
});


app.controller('SigninCtrl', function($scope, fireauth){

  $scope.hidenav = true;

  if($scope.current_user != null){
    location.hash = "/";
  }

  $scope.email = "";
  $scope.password = "";

  $scope.email_login = function(){
    console.log("Connecting to firebase");
    fireauth.email_login($scope);
  };

});


app.controller('LogoutCtrl', function($scope, $controller, fireauth, util){
  $controller('SigninCtrl', {$scope: $scope});
  fireauth.logout();
});



app.controller('CameraCtrl', function($scope){
        /* jshint validthis: true */
        $scope.vm = this;
        $scope.vm.picture = false; // Initial state
});
