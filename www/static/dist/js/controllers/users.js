
app.controller('PasswordCtrl', function($scope, fireauth, jtafire, util){
    $scope.email = "";

    $scope.reset_password = function(){
        fireauth.send_password_reset_email($scope.email);
    }
});


app.controller('UserProfileCtrl', function($scope, fireauth, jtastorage, util, fileReader){
    fireauth.require_login();
    $scope.user_submission_status = "Add User";
    $scope.enable_key_edits = true;

    $scope.setFile = function (file) {
        $scope.file = file;
    };

    $scope.upload_image = function(){
        jtastorage.upload_profile_photo($scope);
        $scope.hide_profile_pic_modal();
    };

    $scope.show_profile_pic_modal = function(){
      $("#upload-profile-pic-modal").modal("show");
    };

    $scope.hide_profile_pic_modal = function(){
      $("#upload-profile-pic-modal").modal("hide");
    };


    var user = {
        "firstname": "",
        "lastname": "",
        "is_admin": false,
        "role": "",
        "uid": "",
        "email": "",
        "password": "",
        "contact_num": ""
    };

    $scope.show_user_modal = function(){
      $("#add-user-modal").modal("show");
      $scope.user_submission_status = "Add User";
      $scope.enable_key_edits = true;
    };

    $scope.hide_user_modal = function(){
      $("#add-user-modal").modal("hide");
    };

    $scope.update_user = function(user){
        fireauth.update_user($scope.new_user);
        $scope.hide_user_modal()
        $scope.reset_user_fields();
    };

    $scope.add_user = function(){
        fireauth.create_normal_acc($scope.new_user);
        $scope.hide_user_modal()
        $scope.reset_user_fields();
    };

    $scope.remove_user = function(user){
        fireauth.remove_user(user);
    };

    $scope.edit_user = function(data){
      $scope.new_user = angular.copy(data);
      $scope.show_user_modal();
      $scope.user_submission_status = "Update";
      $scope.enable_key_edits = false;
    };

    $scope.reset_user_fields = function(){
        $scope.new_user = angular.copy(user);
    };

    $scope.reset_user_fields();
});


app.controller('UserManagementCtrl', function($scope, $controller, fireauth, util, vocab){
    $controller('UserProfileCtrl', {$scope: $scope});
    $scope.users = fireauth.get_users();

    var count_error = 0;
    $scope.users.$loaded().catch(function(err) {
        if(err.code == "PERMISSION_DENIED"){
            count_error += 1;
            if(count_error < 2){
                util.flash(
                  "Permission denied, you do not have access to the requested resource",
                  "danger"
                );
            }
        }
        location.hash = "error";
        console.error(err);
    });

});
