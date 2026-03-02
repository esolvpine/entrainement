const ArrayUtilities = {
  findItemById(arrObj, id) {
    const parsedId = parseInt(id);
    const index = arrObj.findIndex(value => value._id === parsedId);
    if (index === -1) return null;
    const theItem = arrObj[index];
    theItem.arrIndex = index;
    return theItem;
  },
  findItemIndexById(arrObj, id) {
    const parsedId = parseInt(id);
    const index = arrObj.findIndex(value => value.id === parsedId);
    return index === -1 ? null : index;
  },
  findObjByProp(arrObj, prop, value) {
    /**
     *
     * @param {array} arrObj The array to parse
     * @param {string} prop The property name
     * @param {string} value The value to find
     */
    return arrObj.find(obj => obj[prop] === value) || null;
  },
  sortByName(objs) {
    return objs.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()) === 1
        ? 1
        : b.name.toLowerCase().localeCompare(a.name.toLowerCase()) === 1
        ? -1
        : 0
    );
  },
  sortByPropName(objs, propName) {
    return objs.sort((a, b) =>
      a[propName] > b[propName] ? 1 : a[propName] < b[propName] ? -1 : 0
    );
  },
  fetchNextID(arrObj, id) {
    const currentIndex = arrObj.findIndex(value => value._id === id);
    if (currentIndex === -1 || currentIndex === arrObj.length - 1) {
      return undefined;
    }
    return arrObj[currentIndex + 1]._id;
  },
  fetchLast(objArr) {
    return objArr[objArr.length - 1];
  },
  fetchNext(arr, current) {
    return arr[arr.indexOf(current) + 1];
  },
  fetchIndexByName(arrObj, name) {
    const lowerName = name.toLowerCase();
    const index = arrObj.findIndex(value => value.name.toLowerCase() === lowerName);
    return index === -1 ? null : index;
  },
};

function truncateText(name) {
  if (name.indexOf("@") > -1) return name.substr(0, name.indexOf("@"));
  else return name;
}

function currentDate() {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const currentDate = new Date();
  const cDay = currentDate.getDate();
  const cMonth = months[currentDate.getMonth()];
  const cYear = currentDate.getFullYear();
  return cDay + "-" + cMonth + "-" + cYear;
}

const currentDay = () => {
  const now = new Date();
  const fullDaysSinceEpoch = Math.floor(now / 8.64e7);
  return fullDaysSinceEpoch;
};

/**
 *
 * @param {string} id the id of the select element
 * @param {Array} options the list of options
 * @param {string} label the label value
 * @param {string} onchange the callback in string format with parameters
 */
const buildSelect = (id, options, label, onchange) => {
  const onChangeCTA = onchange !== null ? "onchange=" + onchange : "";
  let ct = "";
  if (label !== "")
    ct += `<label class='form__label' for= '${id}' > ${label}</label>`;
  ct += `<select id='select-${id}' ${onChangeCTA}>`;
  $.each(options, (y, opt) => {
    ct += `<p><option value='${opt}'>&nbsp;${opt}</option></p>`;
  });
  ct += "</select>";
  return ct;
};

/**
 *
 * @param {string} id the id of the input element
 * @param {string} label the label value
 * @param {string} value the value of the input
 * @param {string} onchange the callback in string format with parameters
 * @return {string} the select element in string
 */
const buildInput = (id, value, label, onchange) => {
  const onChangeCTA = onchange !== null ? "onchange=" + onchange : "";
  const ct = `<div class='inputContainer'><label class='form__label' for='${id}'>${label}</label>
     <input type='text' id='input-${id}'  propname='${id}' propType='input' ${onChangeCTA} value='${value}' autocomplete='off'/></div>`;
  return ct;
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Formats an ISO date string to YYYY-MM-DD format
 * @param {string} isoDateString - ISO date string (e.g., "2026-02-10T05:00:00.000Z")
 * @return {string} - Formatted date string (e.g., "2026-02-10")
 */
function formatDate(isoDateString) {
  if (!isoDateString) return '';
  return isoDateString.split('T')[0];
}
