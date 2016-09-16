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
     if([null, undefined].indexOf(filename) != -1){
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
   this.upload_image = function(file, filename, folder){
       if([undefined, null].indexOf(folder) != -1){
           folder = "images";
       }
       var imageRef = storage.ref(folder);
       return this.upload_file(imageRef, file, filename);
   };

   /**
   * Upload profile image to firebase storage.
   * @params object $scope - Angular Scope for the current user.
   * @params string filename - name of the file, if not given, it will use
   *                           the default name of the file.
   */
   this.upload_profile_photo = function($scope, filename){
       this.upload_file($scope, filename, "images", function(scope, downloadURL){
            scope.current_user["photoURL"] = downloadURL;
            scope.current_user.$save();
            firebase.auth().currentUser.updateProfile({photoURL: downloadURL})
                .then(function() {
                    // Update successful.
                    util.flash("Image has been uploaded successful");
                }, function(error) {
                    // An error happened.
                    util.flash("Could not set user profile", "danger");
            });
       });
   }

   /**
   * Upload image to firebase storage.
   * @params object $scope - Angular Scope for the current user.
   * @params string filename - name of the file, if not given, it will use
   *                           the default name of the file.
   * @params string folder - Name of the folder to storage the file in.
   * @params function callback - Callback function to execute after the image has been
   *                             uploaded. This function has two param, the scope and
   *                             the download url for the photo.
   */
   this.upload_photo = function($scope, filename, folder, callback){
       if([undefined, null].indexOf(folder) != -1){
           folder = "images";
       }
       var imageRef = storage.ref(folder);
       if([undefined, null].indexOf($scope.file) != -1){
           return null;
       }
       var uploadTask = this.upload_file(imageRef, $scope.file, filename);
       // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        return uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function(error) {
          // Handle unsuccessful uploads
          util.flash(error.message, "danger");
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            callback($scope, downloadURL);
        });
   }
});
