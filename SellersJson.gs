// Look for Very important

var aniviewDomain= "aniview.com";
var aniviewId= "78b21b97965ec3f8";
var combinedString;
var scriptProperties = PropertiesService.getScriptProperties();
var avSellersJson = scriptProperties.getProperty("avSellersJson");
  
function apiToAVSellers() {
  var url = "https://aniview.com/sellers.json";
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  var sellers= data.sellers
  scriptProperties.setProperty("avSellersJson", JSON.stringify(sellers));
  return sellers;
}

function findSellerRelationshipById(sellerId) {
  var avsellers= JSON.parse(avSellersJson)
  for (var i = 0; i < avsellers.length; i++) {
    var seller = avsellers[i];
    if (seller.seller_id === sellerId) {
      return drRelationship(seller.seller_type);
    }
  }
  return ("Seller id not found in aniview.com/sellers.json");
}

function drRelationship(relationship) {
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

function additionalUniqueLine(sellerId, relationship) {
  switch (relationship)
    {
        case "RESELLER":
            combinedString = aniviewDomain + ", " + sellerId + ", RESELLER" + ", " + aniviewId;
            break;
        case "DIRECT":
            combinedString = aniviewDomain + ", " + sellerId + ", DIRECT" + ", " + aniviewId;
            break;
        default:
            combinedString = aniviewDomain + ", " + sellerId+ ",";
            break;
    }
 
   return combinedString;
}