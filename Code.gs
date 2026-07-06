var RelationsCol = "M";
var SellersCol = "N";
var OSCol = "I";
var PartnerFirstCol = "O";
var PartnerLastCol = "ER";
var LinesCol = 2;

function onEdit_temp(e) {
  onEdit();
}

function onEditTrigger(e) {
  if (arguments.length > 0) {
     range = e.range;
     if (range.getSheet().getName() === "NewDomains26" && containsClickedCheckbox(range))
       handleCheckboxClick(range, "L", "Web");
  }
}

function containsClickedCheckbox(range) {
  var validations = range.getDataValidations();
  return validations[0][0] != null
        && validations[0][0].getCriteriaType() === SpreadsheetApp.DataValidationCriteria.CHECKBOX
        && range.isChecked();
}

function handleCheckboxClick(range, sellerCol, theEnv) {
  var simulate = false, simulateDeep = false;
  var domainCol = "B";
  var storesSheet = range.getSheet().getName();
  var appUrl_android = "q1", appUrl_ios = "q2", appUrl_ios_alt = "r2";
  var noSellerID = 'Seller ID not entered';
  var failed = false, output = '', outputDate = '', outputAlt1 = '', outputAlt2 = '';
  var sheet = range.getSheet();
  var row = range.getRow(), rowHeight = 42;
  var theDomain = sheet.getRange(domainCol + row).getValue();
  if (theEnv == "")
    var theEnv = sheet.getRange(envCol + row).getValue();

  if (theEnv != 'Web') {
    storesSheet = range.getSheet().getParent().getSheetByName(storesSheet);
    appUrl_android = storesSheet.getRange(appUrl_android).getValue();
    appUrl_ios = storesSheet.getRange(appUrl_ios).getValue();
    appUrl_ios_alt = storesSheet.getRange(appUrl_ios_alt).getValue();
  }

  if (simulate)
    Logger.log(domainCol + row + ' ' + theDomain + ' will be scanned for changes in columns ' + RelationsCol + ' until ' + PartnerLastCol);
  var errorStr = "";
  if (theDomain == '') {
    SpreadsheetApp.getUi().alert('Please fill domain/bundle first in ' + domainCol + row);
    sheet.setActiveRange(sheet.getRange(domainCol + row));
    return range.uncheck();
  } else if (theEnv == '') {
    SpreadsheetApp.getUi().alert('Please fill environment first in ' + envCol + row);
    sheet.setActiveRange(sheet.getRange(envCol + row));
    return range.uncheck();
  } else {
    if (theEnv != 'Web') {
      theDomain = crawlAppStore(sheet.getRange(OSCol + row).getValue(), theDomain, appUrl_android, appUrl_ios, appUrl_ios_alt);
      if (theDomain.includes(" ")) {
        failed = true;
        SpreadsheetApp.getUi().alert(theDomain + ' - please check the bundle in ' + domainCol + row);
        sheet.setActiveRange(sheet.getRange(domainCol + row));
        return range.uncheck();
      }
    }
    var firstLines, firstLine, firstLinesHowMuch = 50;
 if (!failed) {
  try {
    output = adsTxt(theDomain, (theEnv == 'Web') ? '' : 'inapp', sheet);
    firstLines = output.split(/[\r\n]+/);
    firstLine = firstLines[0];

    if (/^Error:/.test(firstLine)) {
      errorStr = output;
    } else {
      output = output.replace(/[^\S\r\n]/g, ''); 
    }
  } catch (err) {
     errorStr = "Error: " + err.message;
     output = ""; // Prevent undefined errors downstream
  }
}
  }

  var startCell = sheet.getRange(RelationsCol + row);
  var endCell = sheet.getRange(PartnerLastCol + row);
  var startRow = startCell.getRow();
  var endRow = endCell.getRow();
  var startColumn = startCell.getColumn();
  var endColumn = endCell.getColumn();

  var sellerValues = sheet.getRange(sellerCol + startRow + ":" + sellerCol + endRow).getValues().flat();
  var cellValues = sheet.getRange(startRow, startColumn, endRow - startRow + 1, endColumn - startColumn + 1).getValues();
  var linesValues = sheet.getRange(LinesCol, startColumn, 1, endColumn - startColumn + 1).getValues()[0];

  var count = 0;
  var changes = [];
  var relationship = '';

  cellValues.forEach((rowValues, rowIndex) => {
    var row = startRow + rowIndex;
    var sellerVal = sellerValues[rowIndex];
    rowValues.forEach((cellValue, colIndex) => {
      var col = startColumn + colIndex;
      var outputTemp = '';
      var theline = '';
      if (col == startColumn) {
        if (sellerVal == '') {
          outputTemp = noSellerID;
        } else {
          outputTemp = findSellerRelationshipById(sellerVal);
        }
        relationship = outputTemp;
        if (simulate)
          Logger.log('Relationship is ' + outputTemp);
      } else {
        if (col == startColumn + 1) {
          theline = (sellerVal == noSellerID) ? sellerVal : additionalUniqueLine(sellerVal, relationship);
        } else if (!/^Error:/.test(cellValue) && ['', 'ads.txt NOT found', 'Ads.txt found'].indexOf(cellValue) == -1) {
          return; // No change needed
        } else {
          theline = removeParts(linesValues[colIndex], "comma");
        }
        if (theline == noSellerID)
          outputTemp = noSellerID;
        else {
          theline = theline.replace(/\s/g, ''); // remove all whitespaces
          var regex = new RegExp("^" + preg_quote(theline, '') + "(,|(\s|)$|(\s|)#)", 'mi'); // matches beginning of any (m) line optionally followed by comma, whitespace and end line, or whitespace and #
          outputTemp = (errorStr != '') ? errorStr : (regex.test(output) ? 'Ads.txt found' : 'ads.txt NOT found');
        }
      }
      if (cellValue != outputTemp) {
        count++;
        if (simulate) {
          Logger.log(sheet.getRange(row, col).getA1Notation() + ((theline == '' || theline == noSellerID) ? '' : (' ' + theline.replace(/,/g, "$& "))) + ' will be changed from "' + cellValue + '" to "' + outputTemp + '"');
        } else {
          changes.push({ row: row, col: col, value: outputTemp });
        }
      } else {
        if (simulate && simulateDeep) {
          Logger.log(sheet.getRange(row, col).getA1Notation() + ((theline == '' || theline == noSellerID) ? '' : (' ' + theline.replace(/,/g, "$& "))) + ' needs no changing from ' + cellValue);
        }
      }
    });
  });

  changes.forEach(change => {
    if (!simulate) {
      sheet.getRange(change.row, change.col).setValue(change.value);
    } else {
      Logger.log(change.a1Notation + ' will be changed to "' + change.value + '"');
    }
  });

  if (simulate) {
    Logger.log('Finished doing ' + count + ' changes in rows ' + startRow + ' until ' + endRow + ' columns ' + RelationsCol + ' until ' + PartnerLastCol);
  }

  range.uncheck();
}

function preg_quote(str, delimiter) {
  //  discuss at: https://locutus.io/php/preg_quote/
  // original by: booeyOH
  // improved by: Ates Goral (https://magnetiq.com)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: preg_quote("$40")
  //   returns 1: '\\$40'
  //   example 2: preg_quote("*RRRING* Hello?")
  //   returns 2: '\\*RRRING\\* Hello\\?'
  //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
  //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

  return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&')
}

function updateConditionalFormattingSet() {
  updateConditionalFormatting('', 5, '', 1, false);
  // updateConditionalFormatting('aa', 6, 'cr', "ByPriorities");
}

function updateConditionalFormatting(firstCol, firstRow, lastCol, sheet, add) {
  if (firstCol == '') 
    firstCol = SellersCol;
  if (lastCol == '')
    lastCol = PartnerLastCol;
  const range = firstCol + firstRow + ':' + lastCol;
  
  sheet = isNaN(sheet) ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet) : SpreadsheetApp.getActiveSpreadsheet().getSheets()[sheet];
  
  if (!add) {
    const existingRules = sheet.getConditionalFormatRules();
    Logger.log("Existing Conditional Formatting Rules for columns between " + firstCol + " and " + lastCol + ":");

    // Loop through each rule and log details if the rule applies to columns within the specified range
    existingRules.forEach((rule, index) => {
      const ruleRanges = rule.getRanges().map(r => r.getA1Notation());
      
      ruleRanges.forEach((ruleRange) => {
        // Extract column from the range (e.g., "A1:B10" -> "A" and "B")
        const [startCol, endCol] = ruleRange.split(":").map(cell => cell.match(/[A-Z]+/)[0]);
        
        // Check if the rule range is within the target column range
        if (startCol >= firstCol && endCol <= lastCol) {
          const condition = rule.getBooleanCondition();
          
          if (condition) {
            Logger.log("Rule " + (index + 1) + ": " +
                      "Range(s): " + ruleRanges.join(", ") +
                      ", Condition Type: " + condition.getCriteriaType() +
                      ", Condition Values: " + condition.getCriteriaValues());
          } else {
            Logger.log("Rule " + (index + 1) + ": " +
                      "Range(s): " + ruleRanges.join(", ") +
                      ", No specific condition set, possible gradient or custom formatting.");
          }
        }
      });
    });
  } else {
    // Remove all existing conditional formatting in the specified range
    sheet.getRange(range).clearFormat();
    
    // Define the color rules
    const rules = [
      { text: "Live", color: "#00FF00" },           // Green
      { text: "Rejected", color: "#FF0000" },       // Red
      { text: "Ads.txt found", color: "#90EE90" },  // Light Green
      { text: "Ads.txt NOT found", color: "#FFC0CB" }, // Pink
      { text: "Sent for Approval", color: "#FFA500" }, // Orange
      { text: "Not Relevant", color: "#800080" },   // Purple
      { text: "Not Sent", color: "#FF00FF" },       // Light Magenta
      { text: "Not MCM", color: "#0000FF" },        // Blue
      { text: "Paused", color: "#A52A2A" }          // Brown
    ];

    const conditionalRules = rules.map(rule => {
      return SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(rule.text)
        .setBackground(rule.color)
        .setRanges([sheet.getRange(range)])
        .build();
    });
    sheet.setConditionalFormatRules(conditionalRules);
  }
}