function downloadElement(selector) {
  return document.querySelector(selector);
}

function templateHtml(el, bold) {
  const item = document.createElement("div");
  item.className = "row";
  item.innerHTML = `
                <div class="col col-md-2 ${bold}">${el[0]}</div>
                <div class="col col-md-2 ${bold}">${el[1]}</div>
                <div class="col col-md-4 ${bold}">${el[2]}</div>
                <div class="col col-md-2 ${bold}">${el[3]}</div>
                <div class="col col-md-2 ${bold}">${el[4]}</div>`;
  return item;
}

function sortedBrand(prev, next) {
  return prev[0].localeCompare(next[0]);
}

function clearInputData(arrayData) {
  const notNumber = /[^0-9]+/;
  const newArray = arrayData.map((element, index) => {
    const elementReplaceChar = element.replace(notNumber, "");
    element = element.trim();
    if (index > 4) {
      if (index % 5 === 2) {
        const cutLetters = elementReplaceChar;
        element = Number(cutLetters.substring(cutLetters.length - 4, cutLetters.length));
        if (element == 0) element = "brak danych";
      } else if (index % 5 === 3) {
        element = Number(elementReplaceChar);
      } else if (index % 5 === 4) {
        element = element === "TRUE";
      }
    }
    return element;
  });
  return newArray;
}

function prepareArrayOfArrays(arrayOfArrays) {
  const header = arrayOfArrays.splice(0, 1);
  const firstRow = (table) =>
    header.forEach((el) => {
      const item = templateHtml(el, "font-weight-bold");
      table.appendChild(item);
  });

  arrayOfArrays.forEach((element, index) => {
    if (index === 0) {
      firstRow(allRecords);
      firstRow(isofixTrue);
      firstRow(brandSort);
      firstRow(sortMileageAndIsofixFalse);
    }

    //ALL CARS
    const item = templateHtml(element);
    allRecords.appendChild(item);

    //isofix == TRUE
    const item2 = templateHtml(element);
    (element[4] === true || index === 0) ? isofixTrue.appendChild(item2) : "";

    //sort Brand
    arrayOfArrays.sort(sortedBrand);
    const item3 = templateHtml(element, "font-weight-normal");
    brandSort.appendChild(item3);
  });
  return arrayOfArrays;
}

function loadDocumentCsv() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    const request = this.responseText.toString();
    const allRecords = downloadElement("#allRecords");
    const isofixTrue = downloadElement("#isofixTrue");
    const brandSort = downloadElement("#brandSort");
    const sortMileageAndIsofixFalse = downloadElement("#sortMileageAndIsofixFalse");

    allRecords.innerHTML = "";
    isofixTrue.innerHTML = "";
    brandSort.innerHTML = "";
    sortMileageAndIsofixFalse.innerHTML = "";

    const arrayData = request.replace(/\n/g, ",").split(",");
    newArray = clearInputData(arrayData);

    //I remove 5 elements from the "newArray" array and add the new array to arrayOfArray
    const arrayOfArrays = [];
    while (newArray.length) {
      const addArrayToArrays = newArray.splice(0, 5);
      arrayOfArrays.push(addArrayToArrays);
    }
    prepareArrayOfArrays(arrayOfArrays);

    // sort Mileage And Isofix=False
    arrayOfArrays.sort((prev, next) => prev[3] - next[3]);
    arrayOfArrays.forEach((element) => {
      const item = templateHtml(element, "font-weight-normal");
      element[4] === false ? sortMileageAndIsofixFalse.appendChild(item) : "";
    });
  };

  xhttp.open("GET", "Cars.csv");
  xhttp.send();
}

const button = downloadElement(".loadDocument");
button.addEventListener("click", loadDocumentCsv);