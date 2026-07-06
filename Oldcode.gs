// Not currently used
// See https://docs.google.com/spreadsheets/d/1kjWghKXHW3Vjs1UnRepuCdy0I-fkjNkQslCXodHMOTs/edit instead

var startCoulmnS = "N";
var endCoulmnS = "CU";


//checkAdsTxt() : Goes through all the domains and runs a check on the cells where ads.txt not found is written (checking whether the SSP has embedded the ads.txt line)
function checkAdsTxtOld() {
 var url,result;
  var startColumn = columnToNumber(startCoulmnS); 
  var timetostop_before = Date.now(), diff, minutes ;
 var sheet = SpreadsheetApp.getActive().getSheetByName("NewDomains23");
  var lastRow = getLastRowWithValues(sheet);
  var range = sheet.getRange("N5:CV" + lastRow);
  var data = range.getValues();

  //use the PropertiesService to store data and retrieve the last processed row from it. If there is no data in the database, we start processing from the first row.
    var scriptProperties = PropertiesService.getScriptProperties();
  var startRow = 5;
  var storedData = scriptProperties.getProperty('lastProcessedRow');
  if (storedData) {
    if(storedData > lastRow){
      startRow = 5;
    }else{
          startRow = parseInt(storedData) + 1;
    }
    
  }
   Logger.log(startRow)
 
  
  for (let row = startRow; row < lastRow; row++) {
     diff = Math.abs(new Date() - timetostop_before);
     minutes = Math.round(((diff/1000)/60)*10)/10;
    if(minutes > 4.8 ){ 
       break;
     
      }
      
      var trow =row-5
     
    for (let col = 0; col < data[trow].length; col++) {
      
      
      
      if (data[trow][col] === "ads.txt NOT found") {
      
        var targetRow = row;
        var targetCol = columnToLetter(col + startColumn);
        var line = sheet.getRange(targetCol+"2").getValue();
        
        if(url==sheet.getRange("B"+""+targetRow).getValue()){
           result= checkAdsTxtMichal(url, line, result[0]);
        } else{
          url= sheet.getRange("B"+""+targetRow).getValue();
          result= checkAdsTxtMichal(url, line, "");
          
        }
        if(result[1]=='Ads.txt found'){
           var value = sheet.getRange(targetCol+""+targetRow).setValue(result[1]);
        }
      }
    }
  //  Update the last processed row in the PropertiesService
         scriptProperties.setProperty('lastProcessedRow', row);

  }
}
function checkAdsTxtOld() {
  var timetostop_before = Date.now(), diff, minutes ;
 var sheet = SpreadsheetApp.getActive().getSheetByName("OldDomains(manually)");
  var lastRow = getLastRowWithValues(sheet);
  var range = sheet.getRange("N5:BN" + lastRow);
  var data = range.getValues();

  //use the PropertiesService to store data and retrieve the last processed row from it. If there is no data in the database, we start processing from the first row.
    var scriptProperties = PropertiesService.getScriptProperties();
  var startRow = 5;
  var storedData = scriptProperties.getProperty('lastProcessedRowOld');
  if (storedData) {
    if(storedData > lastRow){
      startRow = 5;
    }else{
          startRow = parseInt(storedData) + 1;
    }
    
  }
   Logger.log(startRow)
 
  
  for (let row = startRow; row < lastRow; row++) {
     diff = Math.abs(new Date() - timetostop_before);
     minutes = Math.round(((diff/1000)/60)*10)/10;
    if(minutes > 4.8 ){ 
       break;
     
      }
      
      var trow =row-5
      
    for (let col = 0; col < data[trow].length; col++) {
      
      
      
      if (data[trow][col] === "ads.txt NOT found") {
       
        var targetRow = row;
        var targetCol = columnToLetter(col + 13);
        var url= sheet.getRange("B"+""+targetRow).getValue();
        var line = sheet.getRange(targetCol+"2").getValue();
    
        var result= checkAdsTxtMichal(url, line);
       var value = sheet.getRange(targetCol+""+targetRow).setValue(result);
       
      }
    }
  //  Update the last processed row in the PropertiesService
         scriptProperties.setProperty('lastProcessedRowOld', row);

  }
}
function columnToLetterOld(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}


function checkAdsTxtMichalOld(url, searchText, file) {
  var fileContent, response, arr=[];
  if(file ==""){
     var response;
      try{
     response =  UrlFetchApp.fetch('http://' + url + '/ads.txt');  
     } catch(err){
      try{
        response =  UrlFetchApp.fetch('https://' + url + '/ads.txt');  
      } catch(error){
       return error.toString();
        
       }
   }
    fileContent = response.getContentText();
  }else{
    fileContent=file;
  }
  
  arr.push(fileContent);
    if(fileContent.indexOf("Access Denied") > 0){
      arr.push("error site block crawler, do manually check ");

    }
  if (fileContent.indexOf(searchText) > -1) {
    arr.push('Ads.txt found');
  } else {
    arr.push('ads.txt NOT found');
  }
  return arr;
}

function httpfindidOld(url, line) {
  var result = [], res,req;
  if (line=="") {
    result.push('No line to search');
    return result;
  }
  // trim url to prevent (rare) errors
  url.toString().trim();
    // don't break if error, but instead return it as a message, also don't follow redirects
  var options = {
    'muteHttpExceptions': true,
    'followRedirects': true,
  };

  try{
     req =  UrlFetchApp.fetch('http://' + url + '/ads.txt', options);  
  } catch(err){
    try{
     req =  UrlFetchApp.fetch('https://' + url + '/ads.txt', options);  
  } catch(error){
    result.push(error.toString());
    return result;
  }
  }
    res= req.getContentText();
    line = line.replace(/\s/g, '');
    res = res.replace(/[^\S\r\n]/g, '');
    var regex = new RegExp("^" + line + "((\s|)$|(\s|)#)", 'm');
    result.push(regex.test(res) ? 'Ads.txt found' : 'ads.txt NOT found');


   return result;
}


function getLinesListOld(sheet){
  var startColumn = columnToNumber(startCoulmnS); 
  var endColumn = columnToNumber(endCoulmnS); 
  var startRow = 2; // row 2
  var lines = [];


  var rowData = sheet.getRange(startRow, startColumn, 1, endColumn-startColumn+1).getValues();

  for (var i = 0; i < rowData[0].length; i++) {
    lines.push(rowData[0][i]);
  }
  return lines;

}


function missingAdsTxtAlertOld() {
   var sheet = SpreadsheetApp.getActive().getSheetByName("NewDomains23");
   var lastRow = getLastRowWithValues(sheet);
   const range = sheet.getRange("B2:CT" + lastRow);
   const data = range.getValues();
   let list_notFound=[];
   
   for (let row = 0; row < lastRow; row++) {
     debugger
    list_notFound.push({domain:`${data[row][0]}`,client:`${data[row][1]}`,owner:`${data[row][4]}` ,list:[{sspName:"", line:""}]})
     for (let col = 0; col < data[row].length; col++) {
       if (data[row][col] === "ads.txt NOT found") {
         list_notFound[row].list.push({sspName: data[2][col], line:data[0][col]})
       }
     }
   }



      const mailbody = JSON.stringify(list_notFound)
      const regex = /{/g;
      const regex3 = /"/g;
      const regex4 = /]},/g;
      var bosdy2 = mailbody.toString().replace(regex, "\n");
      var bosdy3 = bosdy2.toString().replace(regex3, "  ");
      var bosdy4 = bosdy3.toString().replace(regex4, "\n");
     //  Logger.log(mailbody)
     //  return list_notFound;

    // Create a new  file
      var theFile = DriveApp.createFile("missingAdsTxtFile.doc", mailbody);
   // Get the email address to send the PDF to
      var emailAddress = "michal.h@aniview.com";
      // Compose the email message with the PDF file as attachment
      var message = {
        to: emailAddress,
        subject: "missingAdsTxt report",
        body: "Please find attached missingAdsTxt report file.",
        attachments: [theFile]
      };

      // Send the email
      MailApp.sendEmail(message);

      // Delete the temporary file
      theFile.setTrashed(true);
 }

