app.service('firestorage', function($firebaseObject, $firebaseArray, util){

  // Create firebase storage object.
   var storage = firebase.storage();

   /**
   * Upload file to firebase storage.
   * @params File file - file object.
   * @params string filename - name of the file, if not given, it will use
   *                           the default name of the file.
   * @returns firebase ref for the file.
   */
   this.upload_file = function(ref, file, filename){
     if(filename == undefined){
       filename = file.name;
     }
     return ref.child(filename).put(file);
   };

    /**
    * Upload image to firebase storage.
    * @params File file - file object.
    * @params string filename - name of the file, if not given, it will use
    *                           the default name of the file.
    * @returns firebase ref for the file.
    */
   this.upload_image = function(file, filename){
       var imageRef = storage.ref("images");
       return this.upload_file(imageRef, file, filename);
   };

   /**
   * Upload profile image to firebase storage.
   * @params object $scope - Angular Scope for the current user.
   * @params string filename - name of the file, if not given, it will use
   *                           the default name of the file.
   */
   this.upload_profile_photo = function($scope, filename){
       var imageRef = storage.ref("images");
       if([undefined, null].indexOf($scope.file) != -1){
           return null;
       }
       var uploadTask = this.upload_file(imageRef, $scope.file, filename);
       // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function(error) {
          // Handle unsuccessful uploads
          util.flash(error.message, "danger");
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            $scope.current_user.profile["photoURL"] = downloadURL;
            $scope.current_user.profile.$save();
            firebase.auth().currentUser.updateProfile({photoURL: downloadURL
            }).then(function() {
                // Update successful.
                util.flash("Image has been uploaded successful");
            }, function(error) {
                // An error happened.
                util.flash("Could not set user profile", "danger");
            });
        });
   }
});
