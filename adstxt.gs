function adsTxt(url, theType, sheet) {
  var output, outputAlt1 = '', outputAlt2 = '', failed = false, debug = false, countHowMany = "Yes", countHowManyThreshold = 0.7;
  var result = [], res,req;
  var rows = []; // push result into 2D array
  // var mp_adstxt = getLinesList(sheet, rangeTxt, "video");
  var options = {
          'muteHttpExceptions': true,
          'followRedirects': true,
          headers : {'Cache-Control' : 'max-age=0'}
  }
  theType = (theType == '') ? 'ads.txt' : 'app-ads.txt';
    try{
     req =  UrlFetchApp.fetch('https://' + url + '/' + theType, options);  
  } catch(err){
    try{
     req =  UrlFetchApp.fetch('http://' + url + '/' + theType, options);  
  } catch(error){
    failed = true;
    output = "Error: " + error.toString();
    if (debug) Logger.log(output);
    }
  }

  if (!failed) {
    res = req.getContentText();
    if(req.getResponseCode() != 200 || req.getHeaders()['Content-Type'].split(';')[0].trim() != 'text/plain' || res.indexOf("Access Denied") > 0 || res.indexOf("Forbidden") > 0 || res.length < 15) {
      failed = true;
      output = "Error: blocking crawlers, alert client";
      if (debug) Logger.log(output);
    } else
      output = res;
  }

    return output;
}

function crawlAppStore(os, bundle, appUrl_android, appUrl_ios, actualUrl_ios) {
  try {
    var output, response, content, store = '';
    os = os.toLowerCase();
    if (os == 'android') {
      store = appUrl_android.replace('{id}', bundle);
      response = UrlFetchApp.fetch(store);
      content = response.getContentText();
      var match = /"author":{"@type":"Person","name":"[^"]+","url":"([^"]+)"/.exec(content);
      if (match && match[1]) {
        output = match[1];
      }
    } else if (os == 'ios') {
      store = appUrl_ios.replace('{id}', bundle);
      response = UrlFetchApp.fetch(store);
      content = response.getContentText();
      var data = JSON.parse(content);
      if (data && data.resultCount && data.resultCount == 0) {
        store = appUrl_ios.replace('/ca/', '/us/').replace('{id}', bundle);
        response = UrlFetchApp.fetch(store);
        content = response.getContentText();
        data = JSON.parse(content);
      }
      if (data && data.results && data.results.length > 0) {
        var sellerUrl = data.results[0].sellerUrl;
        if (sellerUrl) {
          output = sellerUrl;
        }
      }
    } else {
      output = 'Unsupported OS';
    }
  } catch (e) {
    // Handle errors, e.g., couldn't be accessed
    output = "Couldn't access " + store;
  }
  return output.includes(' ') ? output : output.split('://').pop().split('/')[0];
}

function crawlAppStore(os, bundle, appUrl_android, appUrl_ios, actualUrl_ios) {
  try {
    var output, response, content, store = '';
    if (isNaN(bundle)) {
      // Parse HTML for Android
      store = appUrl_android.replace('{id}', bundle);
      response = UrlFetchApp.fetch(store);
      content = response.getContentText();
      var match = /"author":{"@type":"Person","name":"[^"]+","url":"([^"]+)"/.exec(content);
      if (match && match[1]) {
        output = match[1];
      }
    } else {
      // Parse JSON for iOS
      store = appUrl_ios.replace('{id}', bundle);
      response = UrlFetchApp.fetch(store);
      content = response.getContentText();
      var data = JSON.parse(content);
      if (data && data.results && data.results.length == 0) {
        store = appUrl_ios.replace('/ca/', '/us/').replace('{id}', bundle);
        response = UrlFetchApp.fetch(store);
        content = response.getContentText();
        data = JSON.parse(content);
      }
      if (data && data.results && data.results.length > 0) {
        var sellerUrl = data.results[0].sellerUrl;
        if (sellerUrl) {
          output = sellerUrl;
        }
      }
    }
  } catch (e) {
    // Handle errors, e.g., couldn't be accessed
    output = "Couldn't access " + store;
  }
  return output.includes(' ') ? output : output.split('://').pop().split('/')[0];
}

function getLinesList(sheet, rangeTxt, thetype) {
  var data = sheet.getRange(rangeTxt).getValues(), results1 = [], results2 = [], results3 = [];
  data.forEach(function(row) {
    if (typeof row[1] === 'string' && row[1].toLowerCase().indexOf(thetype.toLowerCase()) !== -1) {
      results1.push(row[0]);
      results2.push(row[2]);
      results3.push(row[3]);
    }
  });

  return [results1, results2, results3]; // Return the results array if needed
}

function checkHowMany(intersect, orig, yesValues, which) {
  var debug = true;
  var totalCount = yesValues.filter(value => value.trim().toLowerCase() === which.toLowerCase()).length;

  var matchedLines = [], unmatchedLines = [];
  var intersectCount = intersect.reduce((count, item) => {
    var originalIndex = orig.indexOf(item);
    if (originalIndex !== -1 && yesValues[originalIndex] && yesValues[originalIndex].trim().toLowerCase() === which.toLowerCase()) {
      matchedLines.push(item);
      return count + 1;
    }
    return count;
  }, 0);

  orig.forEach((item, index) => {
    if (yesValues[index] && yesValues[index].trim().toLowerCase() === which.toLowerCase() && !matchedLines.includes(item)) {
      unmatchedLines.push(item);
    }
  });

  return [intersectCount, totalCount, matchedLines, unmatchedLines];
}

function array_udiff(arr1, ...arrays) {
  const retArr = [];
  const cb = arrays.pop(); // The last argument is the comparator function

  if (typeof cb !== 'function') {
    throw new TypeError('The last argument must be a function');
  }

  for (let k1 in arr1) {
    let found = false;
    for (let i = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      for (let k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    if (!found) {
      retArr.push(arr1[k1]);
    }
  }

  return retArr;
}

function array_uintersect(arr1, ...arrays) {
  const retArr = [];
  const cb = arrays.pop(); // The last argument is the comparator function

  if (typeof cb !== 'function') {
    throw new TypeError('The last argument must be a function');
  }

  for (let k1 in arr1) {
    let foundInAll = true;
    for (let i = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      let foundInThisArray = false;
      for (let k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          foundInThisArray = true;
          break;
        }
      }
      if (!foundInThisArray) {
        foundInAll = false;
        break;
      }
    }
    if (foundInAll) {
      retArr.push(arr1[k1]);
    }
  }

  return retArr;
}

function comparePartial(str1, str2) {
  var containsComma = true, checkTagId = false;

  // Remove comments
  str1 = removeParts(str1, 'comments');
  str2 = removeParts(str2, 'comments');

  // Keep just base part (before any commas)
  if (!containsComma) {
    str2 = removeParts(str2, 'commas', (str1.indexOf('=') !== -1) ? '=' : ',');
  }
  // Remove last part (after last comma)
  else if (!checkTagId) {
    str1 = removeParts(str1, 'comma');
    str2 = removeParts(str2, 'comma');
  }

  return str1.localeCompare(str2, undefined, { sensitivity: 'base' });
}

function removeParts(str, type, char = ',') {
  switch (type) {
    case 'comments':
      return str.split('#')[0].trim();
    case 'commas':
      return str.split(char)[0].trim() + ((char === '=') ? char : '');
    case 'comma':
      return splitNth(str, char, 3)[0];
    default:
      return str;
  }
}

function splitNth(str, delim, n) {
  return str.split(delim).reduce((acc, part, index) => {
    if (index % n === 0) {
      acc.push(part);
    } else {
      acc[acc.length - 1] += delim + part;
    }
    return acc;
  }, []);
}