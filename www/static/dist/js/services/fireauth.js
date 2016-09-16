app.service('fireauth', function($firebaseObject, $firebaseArray, util){

  this.get_users = function(){
      var ref = firebase.database().ref("users");
      return $firebaseObject(ref);
  };

  this.get_user_by_id = function(user_id){
      var ref = firebase.database().ref("users/"+user_id);
      return $firebaseObject(ref);
  };

  this.find_user_by_email = function(email){
    var data = {}
    var ref = firebase.database().ref("users")
      .orderByChild("email")
      .equalTo(email);
    return $firebaseArray(ref);
  };

  this.require_login = function($scope){
    try{
      if(firebase.auth().currentUser == null){
        setTimeout(function(){
          if(firebase.auth().currentUser == null){
            location.hash = "signin";
          }
        }, 1000);
      }
    }catch(e){
      location.hash = "signin";
    }
  };

  this.send_password_reset_email = function(email){
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Email sent.
      util.flash("Email has been sent to "+email);
    }, function(error) {
      util.flash(error.message, "danger");
    });
  }

  this.set_current_user = function($scope, callback){
    firebase.auth().onAuthStateChanged(function(user) {
      $scope.current_user_db = user;
      if(user != null){
        var ref = firebase.database().ref(
          "users/"+user.uid
        );
        $scope.current_user = $firebaseObject(ref);

        if(callback != undefined){
          $scope.current_user.$loaded(function(){
            callback($scope);
          });
        }
      }
    });
  };

  this.set_as_admin = function(user){
    if(["dpk-user", "jta-user"].indexOf(user.role) != -1){
      user.is_admin = true;
    }else{
      user.is_admin = false;
    }
  };

  this.update_user = function(user){
    this.set_as_admin(user);
    var ref = firebase.database().ref(
      "users/".concat(user.uid, "/")
    );
      try{
        delete user['password'];
      }catch(err){
        console.log(err);
      }
    ref.set(user);
  };

  this.remove_user = function(user){
    // user.delete().then(function() {
      // User deleted.
      var ref = firebase.database().ref(
        "users/".concat(user.uid, "/")
      );
      ref.remove();
      util.flash("User has been deleted");
    // }, function(error) {
    //   // An error happened.
    // });
  }

  this.create_normal_acc = function(new_user, fn){
    var email = new_user.email;
    var password = new_user.password;
    this.set_as_admin(new_user);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){
      var ref = firebase.database().ref(
        "users/".concat(result.uid, "/")
      );
      new_user["uid"] = result.uid;
      new_user["date_joined"] = new Date().getTime();
      try{
        delete new_user['password'];
      }catch(err){
        console.log(err);
      }
      try{
        ref.once("value", function(snap){
          if(!snap.exists()){
            ref.set(new_user);
          }
        });
      }catch(err){
        ref.set(new_user);
      }
      if(fn != undefined){
        fn(new_user);
      }else{
        location.hash = "/";
      }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      util.flash(errorMessage, "danger");
    });
  };

  this.email_login = function($scope){
    var email = $scope.email;
    var password = $scope.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
      util.flash("Login successful");
      location.hash = "/";
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      util.flash(error.message, "danger");
    });
  };

  this.gplus_login = function(fn){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var google_user = result.user;
      var names = google_user.displayName.split(" ")
      var new_user = {
        "firstname": names[0],
        "lastname": names[names.length - 1],
        "is_admin": false,
        "role": "customer",
        "uid": google_user.uid,
        "email": google_user.email,
        "contact_num": "",
        "photoURL": google_user.photoURL,
        "date_joined": new Date().getTime()
      };
      console.log(new_user);
      var ref = firebase.database().ref(
        "users/".concat(google_user.uid, "/")
      );
      localStorage.setItem("user", JSON.stringify(new_user));
      try{
        ref.once("value", function(snap){
          if(!snap.exists()){
            ref.set(new_user);
          }
        });
      }catch(err){
        ref.set(new_user);
      }
      if(fn != undefined){
        fn(new_user);
      }else{
        location.hash = "/";
      }
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      util.flash(error.message, "danger");
      // ...
    });
  };

  this.logout = function(scope){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      scope.current_user = null;
      location.href = "/#/";
    }, function(error) {
      // An error happened.
    });
  };

});
