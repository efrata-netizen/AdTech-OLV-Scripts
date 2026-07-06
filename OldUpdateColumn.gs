// Not currently used

function onOpen2() {
  SpreadsheetApp.getUi()
    .createMenu("Custom Menu")
    .addItem("Show prompt", "showPrompt")
    .addToUi();
}

function updateStatus() {
  // Get the active spreadsheet and sheet
  var activeSheet = SpreadsheetApp.getActive().getSheetByName("NewDomains23");

  var ui = SpreadsheetApp.getUi(); // Same variations.

  var answer = ui.prompt(
    "Stop! You are going to make major changes to the file! If you do not want this please cancel immediately.!",
    "which column to update? (insert the letter) Use capital letters eg: AB",
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  var button = answer.getSelectedButton();
  var sspColumn = answer.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    // Get the range of the table with domain names and statuses
    var lastRow = activeSheet.getLastRow();
    var sspRange = `A2:${sspColumn}` + lastRow;
    var tableRange = activeSheet.getRange(sspRange);
  
    // Get the values from the table range

    var tableValues = tableRange.getValues();
    var columnNumber = columnToNumber(sspColumn);

    // Get the link to the user's spreadsheet from the user
    var userSpreadsheetLink = Browser.inputBox(
      "Enter the link to your SSP spreadsheet:"
    );

     // approved is live?
    var aproOrLive = Browser.msgBox('approved is live?', 'Do you want to write "live" where the status is "approved" instead?', Browser.Buttons.YES_NO);
    
    // Open the user's spreadsheet and sheet
    var userSpreadsheet = SpreadsheetApp.openByUrl(userSpreadsheetLink);
    // var userSheet = userSpreadsheet.getActiveSheet();
    var gid = userSpreadsheetLink.match(/gid=(\d+)/);
    // var userSheet = getSheetById(userSpreadsheet, gid)
    var sheets = userSpreadsheet.getSheets();
    var userSheet = sheets.filter(function(s) { return s.getSheetId() == gid[1]; })[0];  


    // Get the range of the table in the user's sheet
    var userTableRange = userSheet.getRange("A2:B" + userSheet.getLastRow());

    // Get the values from the user's table range
    var userTableValues = userTableRange.getValues();

    // Loop through the user's table values
    for (var i = 0; i < userTableValues.length; i++) {
      // Get the domain name and status from the user's table
      var userDomain = userTableValues[i][0];
      var userStatus = userTableValues[i][1];

      // Loop through the main table values
      for (var j = 0; j < tableValues.length; j++) {
        // Get the domain name and status from the main table

        var mainDomain = tableValues[j][1];
        var mainStatus = tableValues[j][columnNumber - 1];
        // var cell = activeSheet.getRange(j+2, columnNumber);
        var newStatus;
        // If the domain names match, update the status in the main table
        if (userDomain.toLowerCase() === mainDomain.toLowerCase() && (mainStatus.toLowerCase() == "sent for approval" || mainStatus.toLowerCase() == "ads.txt found")) {
          if(userStatus ==""){
            newStatus = "sent for approval";
          }
          if (aproOrLive == "yes") {
             newStatus = ((userStatus.toLowerCase() === "approved" )? "live" : userStatus)
           } else {
             newStatus = ((userStatus.toLowerCase() == "yes")? "approved" : userStatus);
            } 
         
          tableValues[j][columnNumber - 1] = newStatus;
          // Update the cell
          // cell.setValue(userStatus);
          var updateCell= tableRange.getCell(j+1,columnNumber).setValue(newStatus)
          break;
        }
      }
    }
    // Update the table in the main sheet with the updated status values
    //  tableRange.setValues(tableValues);
    // return ui.alert('done');

  } else if (button == ui.Button.CANCEL) {
    return;
  } else if (button == ui.Button.CLOSE) {
    // User clicked X
    return;
  }
}

function columnToNumber(str) {
  str = str.toLowerCase();
  var anum = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
    aa: 27,
    ab: 28,
    ac: 29,
    ad: 30,
    ae: 31,
    af: 32,
    ag: 33,
    ah: 34,
    ai: 35,
    aj: 36,
    ak: 37,
    al: 38,
    am: 39,
    an: 40,
    ao: 41,
    ap: 42,
    aq: 43,
    ar: 44,
    as: 45,
    at: 46,
    au: 47,
    av: 48,
    aw: 49,
    ax: 50,
    ay: 51,
    az: 52,
    ba: 53,
    bb: 54,
    bc: 55,
    bd: 56,
    be: 57,
    bf: 58,
    bg: 59,
    bh: 60,
    bi: 61,
    bj: 62,
    bk: 63,
    bl: 64,
    bm: 65,
    bn: 66,
    bo: 67,
    bp: 68,
     bq: 69,
  br: 70,
  bs: 71,
  bt: 72,
  bu: 73,
  bv: 74,
  bw: 75,
  bx: 76,
  by: 77,
  bz: 78,
  ca: 79,
  cb: 80,
  cc: 81,
  cd: 82,
  ce: 83,
  cf: 84,
  cg: 85,
  ch: 86,
  ci: 87,
  cj: 88,
  ck: 89,
  cl: 90,
  cm: 91,
  cn: 92,
  co: 93,
  cq: 95, cr: 96, cs: 97, ct: 98, cu: 99, cv: 100, cw: 101, cx: 102, cy: 103, cz: 104, da: 105, db: 106, dc: 107, dd: 108, de: 109, df: 110, dg: 111, dh: 112, di: 113, dj: 114, dk: 115, dl: 116, dm: 117, dn: 118, do: 119, dp: 120
  };
  return anum[str];
}