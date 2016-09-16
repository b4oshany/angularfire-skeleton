
app.controller('MainController', function($scope, fireauth){
});

app.controller('ErrorCrtl', function($scope, fireauth){
});

app.controller('CameraCtrl', function($scope){
        /* jshint validthis: true */
        $scope.vm = this;
        $scope.vm.picture = false; // Initial state
});
