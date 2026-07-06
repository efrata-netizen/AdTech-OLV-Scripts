function checkEmptyDomainsAndSendEmail() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("NewDomains24");
  var data = sheet.getDataRange().getValues();
  var lastRow = getLastRowWithValues(sheet);
  var rowsToInsert = [];

  for (var i = 0; i < lastRow; i++) {
    if (data[i][1] === "insert.domain") { //  column B is index 1 
      rowsToInsert.push(i + 1); // Adding 1 to convert from 0-based index to 1-based row number
    }
  }

  if (rowsToInsert.length > 0) {
    var rowsString = rowsToInsert.join(" , "); // Create a string of row numbers
    var message = "<b><font color='red'>Please Notice </font></b><br><br>Domains can't be approved until you fill missing domains in rows:<br>" + rowsString + "<br><br>in <a href='https://docs.google.com/spreadsheets/d/1IsgwAXVJrwQTkfZpV7ksx1B3eolycuC9LMHxySFswvA/edit#gid=1628334363'> Domain_Approval file</a>";
    var subject = "Warning: Missing domains in Domain Approval";
    var recipient = "avmp@aniview.com";
    var cc = "support@aniview.com";
    var body = "Hi,\n\n" + message;
    var options = {
      name: "Domain Approval",
      replyTo: "pmo@aniview.com" 
    };


    MailApp.sendEmail({
      to: recipient,
      cc: cc,
      subject: subject,
      htmlBody: body,
      name: options.name,
      replyTo: options.replyTo // Use the replyTo field from options
    });
  }
}

 function getLastRowWithValues(sheet) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange("B1:B" + lastRow);
  var values = range.getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] != "") {
      return i + 1;
    }
  }
  return 0;
}





