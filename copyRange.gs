function importValuesDomains() {
 // importValuesActual('16G552CAesMe3uIpx4TTcvtI5PtqFCXaN7JfjDI_kj-0', 0, 'NewDomains S', 'Date', 'Manual priority');
  importValuesActual('14Xv07Iq4ej6MJJkdeizJXhDhU4KirJXfNPPrjway86U', 'NewDomains24', 'NewDomains24', 'Date', 'Manual priority');
}

function importValues() {
  // importValuesActual('', 'ByPriorities', 'ByPriorities data', 'Date', 'Revenue Month-Day');
  importValuesActual('14Xv07Iq4ej6MJJkdeizJXhDhU4KirJXfNPPrjway86U', 'NewDomains25', 'NewDomains25', 4, 1);
  importValuesActual('14Xv07Iq4ej6MJJkdeizJXhDhU4KirJXfNPPrjway86U', 'NewDomains24', 'NewDomains24', 4, 1);
}

// function importValuesActual(target, sourceSheetName, targetSheetName, firstRowCellText, lastRowCellText) {
//   var sheet = SpreadsheetApp.getActive();
//   if (target == '')
//     target = SpreadsheetApp.getActive();
//   else
//     target = SpreadsheetApp.openById(target);
//   target = target.getSheetByName(targetSheetName);
//   var source;
//   if (isNaN(sourceSheetName))
//     source = sheet.getSheetByName(sourceSheetName);
//   else
//     source = sheet.getSheets()[sourceSheetName];
//   var dataRange=source.getRange(1, 1, 10, 1000).createTextFinder(firstRowCellText).matchCase(true).findNext();
//   dataRange=dataRange.getA1Notation() + ":" + /[A-Z]+/.exec(source.getRange(1, 1, 10, 1000).createTextFinder(lastRowCellText).matchCase(true).findNext().getA1Notation())[0] + dataRange.getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow()
//   var sourceRange = source.getRange(dataRange);
//   var sourceValues = sourceRange.getValues();
//   var targetRange = target.getRange(1, 1, sourceValues.length, sourceValues[0].length);

//   targetRange.setValues(sourceValues);
//   Logger.log("done with ", sourceSheetName)
//   var sourceRows = sourceRange.getLastRow()-sourceRange.getRow()+1;
//   var targetRows = target.getRange(1, 1).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow();
//   var rowsToDelete = targetRows - sourceRows;
//   if (rowsToDelete>0)
//     target.deleteRows(sourceRows + 1, rowsToDelete);
// }

function importValuesActual(target, sourceSheetName, targetSheetName, startRow, startCol) {
  var sheet = SpreadsheetApp.getActive();

  if (!target)
    target = sheet;
  else
    target = SpreadsheetApp.openById(target);

  var targetSheet = target.getSheetByName(targetSheetName);
  var sourceSheet = isNaN(sourceSheetName)
    ? sheet.getSheetByName(sourceSheetName)
    : sheet.getSheets()[sourceSheetName];


  var numRows = sourceSheet.getLastRow() - startRow + 1;
  var numCols = sourceSheet.getLastColumn();

  if (numRows <= 0) {
    Logger.log("No data found to copy from row 4");
    return;
  }

  var sourceRange = sourceSheet.getRange(startRow, startCol, numRows, numCols);
  var sourceValues = sourceRange.getValues();

  var targetRange = targetSheet.getRange(1, 1, numRows, numCols);
  targetRange.setValues(sourceValues);

  // Optional: delete extra rows in target sheet
  var targetRows = targetSheet.getLastRow();
  var rowsToDelete = targetRows - numRows;
  if (rowsToDelete > 0)
    targetSheet.deleteRows(numRows + 1, rowsToDelete);

  Logger.log(`✅ Copied ${numRows} rows from row 4 to ${targetSheetName}`);
}

