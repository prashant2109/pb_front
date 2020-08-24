app.filter('trusted1', function ($sce) {
  return function (value) {
    return $sce.trustAsHtml(value);
  }
});

app.filter('trustedNum', function ($sce) {
  return function (value) {
        if(typeof value == 'number')
                value= String(value);
    return $sce.trustAsHtml(value);
  }
});
