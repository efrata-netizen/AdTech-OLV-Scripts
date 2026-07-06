// Not currently used

var aniviewDomain= "aniview.com";
var aniviewId= "78b21b97965ec3f8";
var combinedString;
var scriptProperties = PropertiesService.getScriptProperties();
var avSellersJson = scriptProperties.getProperty("avSellersJson");


function apiToAVSellersOld() {
  var url = "https://sellers.aniview.com/59c9148628a0612da3689288/sellers.json";
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  var sellers= data.sellers
  scriptProperties.setProperty("avSellersJson", JSON.stringify(sellers));
  return sellers;
}
function direcrResellerOld(){
     var sheet = SpreadsheetApp.getActive().getSheetByName("NewDomains23");
     var lastRow = getLastRowWithValues(sheet);
     var range = sheet.getRange("E5:F" + lastRow);
     var rowData=range.getValues();
     var r;
     debugger
     Logger.log(rowData[0].length)
  for (var i = 2111; i < rowData.length; i++) {
    Logger.log(rowData[0][0])
      if(rowData[0][0] != ""){
        r=findSellerRelationshipById(rowData[0][0]) 
        debugger
        rowData[0][1] == drRelationship(r)
      }
  }

}

function findSellerRelationshipByIdOld(sellerId) {
  var avsellers= JSON.parse(avSellersJson)
  for (var i = 0; i < avsellers.length; i++) {
    var seller = avsellers[i];
    if (seller.seller_id === sellerId) {
      return drRelationship(seller.seller_type);
    }
  }
  return ("Seller id not found in aniview.com/sellers.json");
}

function drRelationshipOld(relationship) {
  var rd="";
  switch (relationship)
    {
        case "INTERMEDIARY":
            rd= "RESELLER";
            break;
        case "PUBLISHER":
            rd="DIRECT";
            break;
        case "BOTH":
            rd="BOTH";
            break;    
        default:
            rd="";
            break;
    }
 
   return rd;
}
function checkChainOld(url, sellerId) {
  var results = [];
  var rows = []; // push result into 2D array
  var data, tagId, sellersObj;
    try{
      var response = UrlFetchApp.fetch(url);
      data = JSON.parse(response.getContentText());
    } catch (error) {
        return `Error occurred while fetching or parsing JSON:  + ${error}`;
      }
 
 sellersObj= data.sellers;
 tagId = "";
 if (data.hasOwnProperty('identifiers'))
    tagId = data.identifiers[0].value;
 var isId=false, r="Seller id not found",accountName="",domainName="", seller;
  for (var i = 0; i < sellersObj.length; i++) {
    seller = sellersObj[i];
    if (seller.seller_id == sellerId) {
      isId= true;
      r=seller.seller_type;
      accountName=seller.name;
      domainName=seller.domain;
    }
  }
 results.push(isId, r, tagId,accountName,domainName );

 rows.push(results);
 return rows;


}
function testtestOld(){
  scriptProperties.deleteAllProperties();
  // var a= "https://www.gannett.com/wp-content/uploads/2023/04/sellers.json";
  // var b= "22652678936";
  // Logger.log(checkChain(a, b)) 
}

