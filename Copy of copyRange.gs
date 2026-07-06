// function importValuesDomains() {
//  // importValuesActual('16G552CAesMe3uIpx4TTcvtI5PtqFCXaN7JfjDI_kj-0', 0, 'NewDomains S', 'Date', 'Manual priority');
//   importValuesActual('14Xv07Iq4ej6MJJkdeizJXhDhU4KirJXfNPPrjway86U', 0, 'NewDomains S', 'Date', 'Manual priority');
// }

// function importValues() {
//   importValuesActual('', 'ByPriorities', 'ByPriorities S', 'Date', 'Revenue Month-Day');
//   importValuesActual('14Xv07Iq4ej6MJJkdeizJXhDhU4KirJXfNPPrjway86U', 0, 'NewDomains S', 'Date', 'Manual priority');
// }

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
//   var sourceRows = sourceRange.getLastRow()-sourceRange.getRow()+1;
//   var targetRows = target.getRange(1, 1).getDataRegion(SpreadsheetApp.Dimension.ROWS).getLastRow();
//   var rowsToDelete = targetRows - sourceRows;
//   if (rowsToDelete>0)
//     target.deleteRows(sourceRows + 1, rowsToDelete);
// }
