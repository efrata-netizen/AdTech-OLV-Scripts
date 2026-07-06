// Not currently used

function getAdsTxtInApp(url, searchText) {
 
   try{
     var response =  UrlFetchApp.fetch(url);  
   } catch(err){
       return error.toString();
   }
  var fileContent = response.getContentText();
  return searchAdsTxtInApp(fileContent, searchText);
}

function searchAdsTxtInApp(fileContent, searchText) { 
  if(fileContent.indexOf("Access Denied") > 0){
      return "error site block crawler, do manually check ";

    }
  if (fileContent.indexOf(searchText) > -1) {
    return 'Ads.txt found';
  } else {
    return 'ads.txt NOT found';
  }
}
