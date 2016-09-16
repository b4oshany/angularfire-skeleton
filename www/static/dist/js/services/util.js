app.service('util', function(){

    this.on_obj_load = function(bool_fn, callback){
        var $this = this;
        console.log("kk");
        if(bool_fn()){
            callback();
        }else{
            setTimeout(function(){
                $this.on_obj_load(bool_fn, callback);
            }, 1000);
        }
    };

    this.validate_email = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    this.slugify = function(text, delimiter){
        if(delimiter == undefined){
            delimiter = "-"
        }
        return text.replace(/[^a-zA-Z\d:]/g, delimiter).toLowerCase();
    };

    this.unslugify = function(slugified, delimiter){
        if(delimiter == undefined){
            delimiter = "-"
        }
        unslugified = slugified.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        return unslugified;
    };

    this.flash = function(message, status, option){
        _option = {
            "target": (typeof(option) == "object" && option.target != undefined)? option.target : (window.flash_target != undefined)? window.flash_target : "body",
            "seconds": (typeof(option) == "object" && option.seconds != undefined)? option.seconds : 10
        };
        if(status == undefined){
            status = "success";
        }
        $(_option.target).prepend('<div class="flash-alerts alert fade in alert-'+status+' alert-dismissable">'
                                  +'<button type="button" class="close" data-dismiss="alert"'
                                  +' aria-hidden="true">&times;</button>'
                                  +message+'</div>');
        setTimeout(function(){
            $(".alert").alert('close');
        }, _option.seconds * 1000);
    };

    this.goTo = function(){
        var url = "#/";
        for(x in arguments){
            url += arguments[x] + "/"
        }
        location.href = url;
    };

    this.getTraversal = function(){
        var paths = location.hash.split("/");
        var traversal = [];
        var title, path;
        for(x in paths){
            path = paths[x];
            title = this.unslugify(path);
            path = paths.slice(0, parseInt(x) + 1);
            traversal.push({
                path: path.join("/")+"/",
                title: title
            });
        }
        return traversal;
    };

    /**
  * Create a file object from dataurl string.
  * @param string dataurl - Dataurl string, e.g. string capture from a webcam image.
  * @param string filename - Name of the file.
  * @return File object.
  */
    this.dataURItoFile = function(dataurl, filename){
        // Get the data (in array format), the mime type, byte string and uniary string.
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        // Get the encode each character in ASCII
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        // Create a file object with the uinary ASCII code, the filename and file mime type.
        return new File([u8arr], filename, {type:mime});
    };

    this.jsonToCSV = function(JSONData, ReportTitle, ShowLabel, level) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        // set level to iterate over.
        if(level == undefined){
            level = 1;
        }

        var CSV = '';
        var HEADINGS = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        var dataTraverse = function(data){
            var columns = '', rows = '', datum;
            for(index in data){
                datum = data[index];
                if(typeof datum == 'object'){
                    columns = getHeadings(datum) + ',';

                    rows += getDataRow(datum);
                }else{
                    columns += index + ',';
                    rows += datum + ',';
                }
            }
            columns = columns.slice(0, -1);
            return {columns: columns, rows: rows};
        }

        var getHeadings = function(data){
            var headings = "";
            //This loop will extract the label from 1st index of on array
            for (index in data) {
                //Now convert each value to string and comma-seprated
                headings += index + ',';
            }
            headings = headings.slice(0, -1);
            return headings;
        };

        var getDataRow = function(data){
            var row = '';
            //1st loop is to extract each row
            for (i in data) {
                row += '"' + data[i] + '",';
            };
            //add a line break after each row
            row = row.slice(0, -1); + '\r\n';
            return row;
        };

        //This condition will generate the Label/Header
        var results = dataTraverse(arrData);
        if (ShowLabel) {
            //append Label row with line break
            CSV += results.columns + '\r\n';
        }
        CSV += results.rows  + '\r\n';

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

});


app.factory('fileReader', function ($q, $log) {

    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                             {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
});
