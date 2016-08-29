app.filter('slugify', function(util){
  return function(text, delimiter){
    return util.slugify(text, delimiter);
  }
});

app.filter('unslugify', function(util){
  return function(text, delimiter){
    return util.unslugify(text, delimiter);
  }
});
