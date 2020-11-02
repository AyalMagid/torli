

export default {
  englishToHebrew,
  getIsosDate,
  getTimeSlotsForPreview,
  getDailySlotsForPreview,
  changeTimeForDisplay,
  idGen,
  calculateEndTime,
  arrayToString,
  convertDateToIsraelisDisplay,
  getDayByHebrewWord,
  getEventReadyForDisplay,
  convertNumberToWords,
  validateEmail,
  getWeekIsosDatesForCalendar,
  checkIfTsInRange,
  getMonthByIdx
}

var gUtcDiff = 2

// for half an hour slots = 2. 15 min slots will be 4 etc...
var gDividedHour = 2 

function englishToHebrew(word) {
  let convertedWord
  switch (word) {
    case ('minutes'):
      convertedWord = 'דק׳';
      break;
    case ('build'):
      convertedWord = 'בנייה';
      break;
    case ('filling'):
      convertedWord = 'מילוי';
      break;
    case ('medical-manicure'):
      convertedWord = 'מניקור רפואי';
      break;
    case ('gel'):
      convertedWord = 'לק ג׳ל';
      break;
    case ('medical-pedicure'):
      convertedWord = 'פדיקור';
      break;
    case ('medical-pedicure-gel'):
      convertedWord = 'פדיקור רפואי עם לק ג׳ל';
      break;
    case ('half-pedicure'):
      convertedWord = 'חצי פדיקור';
      break;
    case ('half-pedicure-gel'):
      convertedWord = 'חצי פדיקור עם ג׳ל';
      break;
    case ('eyebrows-mustache'):
      convertedWord = 'גבות ושפם';
      break;
    default:
      convertedWord = "ברירת מחדל"
  }

  return ' ' + convertedWord
}
//get a date and how many days before/after and returns only the date part by isos convention
function getIsosDate(daysAfterOrBefore, date = new Date()) {
  let dateCopy = new Date(date.getTime())
  dateCopy.setDate(dateCopy.getDate() + daysAfterOrBefore)
  if (dateCopy.getDay() === 6) {
    return ''
  }
  dateCopy = dateCopy.toISOString().slice(0, 10)
  return dateCopy
}

function getWeekIsosDatesForCalendar(dayByNum, date) {
  let weeklyDates =[]
  if (date.getDay()===6){
    date = new Date(date.getTime() + (1000 * 60 * 60 * 24));
    dayByNum = 1
  }
  switch (dayByNum) {
    case 1:
      for (var i = 0; i < 6; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    case 2:
      for (var i = -1; i < 5; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    case 3:
      for (var i = -2; i < 4; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    case 4:
      for (var i = -3; i < 3; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    case 5:
      for (var i = -4; i < 2; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    case 6:
      for (var i = -5; i < 1; i++) {
        weeklyDates.push(getIsosDate(i, date))
      }
      break;
    default:
      console.log('Err with getting week dates')
  }
  return weeklyDates.map(isosDate => {
    return { start: `${isosDate}T06:00:00Z`, end: `${isosDate}T18:00:00Z` }
  })
}

function getDailySlotsForPreview(slotsRanges, duration) {
  const timeslotsByConstraints = slotsRanges.map(sr => getTimeSlotsForPreview(sr, duration))
  const mergedTimeSlotsToRender = [].concat.apply([], timeslotsByConstraints);
  return mergedTimeSlotsToRender
}

function getTimeSlotsForPreview(timeslot, duration) {
  let slotsToRender = [];
  let year = timeslot.start.slice(0, 4)
  let month = timeslot.start.slice(5, 7)
  let day = timeslot.start.slice(8, 10)
  let hours = +timeslot.start.slice(11, 13)
  let min = timeslot.start.slice(14, 16)
  const startTime = new Date(year, month - 1, day, hours +  gUtcDiff, min, 0, 0);
  year = timeslot.end.slice(0, 4)
  month = timeslot.end.slice(5, 7)
  day = timeslot.end.slice(8, 10)
  hours = +timeslot.end.slice(11, 13)
  min = timeslot.end.slice(14, 16)
  const endTime = new Date(year, month - 1, day, hours + gUtcDiff, min, 0, 0);
  let nextTimeSlot = startTime//maby need copy
  hours = nextTimeSlot.getHours()
  min = nextTimeSlot.getMinutes()
  let slotToRender = checkDigitsAndAddZerosIfNeeded(hours) + ':' + checkDigitsAndAddZerosIfNeeded(min);
  if ((nextTimeSlot.getTime() + (duration * 60 * 1000)) <= endTime.getTime()) { slotsToRender.push(slotToRender) }
  while ((nextTimeSlot.getTime() + (duration * 60 * 1000)) < endTime.getTime()) {
    nextTimeSlot = new Date(nextTimeSlot.getTime() + ((60 * 60 * 1000) / gDividedHour));//adding half an hour
    hours = nextTimeSlot.getHours()
    min = nextTimeSlot.getMinutes()
    slotToRender = checkDigitsAndAddZerosIfNeeded(hours) + ':' + checkDigitsAndAddZerosIfNeeded(min);
    slotsToRender.push(slotToRender)
  }
  return slotsToRender
}

//get an hour and returns full isos date (including the time) reducing the diff from the hours
function changeTimeForDisplay(time, diff) {
  let hours = +time.slice(0, 2) - diff
  let minutes = time.slice(3, 5)
  hours = checkDigitsAndAddZerosIfNeeded(hours)
  return hours + ':' + (minutes)
}


function calculateEndTime(time, duration) {
  let hours = +time.slice(0, 2)
  let minutes = +time.slice(3, 5)

  if (duration % 60 === 30) {
    if (minutes === 30) {
      hours += Math.floor(duration / 60) + 1
      minutes = '00'
    }
    else {
      hours += Math.floor(duration / 60)
      minutes = '30'
    }
  }
  else {
    hours += (duration / 60)
    minutes = '00'
  }

  hours = checkDigitsAndAddZerosIfNeeded(hours)
  return hours + ':' + minutes
}

function checkDigitsAndAddZerosIfNeeded(digit) {
  digit = (digit < 10) ? '0' + digit : digit
  return digit
}


function idGen() {
  return '_' + Math.random().toString(36).substr(2, 9);
};


function arrayToString(pickedTreatments) {
  let treatmentsType = ''
  pickedTreatments.forEach((tr, idx) => {
    if (pickedTreatments.length !== idx + 1) treatmentsType += tr.name + ', '
    else treatmentsType += tr.name
  })
  return treatmentsType
}

function convertDateToIsraelisDisplay(date) {
  const dateParts = (date).split('-')
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
}
function getDayByHebrewWord(idx) {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
  return days[idx]
}


function getEventReadyForDisplay(filteredEvents) {
  return filteredEvents.map(event => {
    return {
      id: event._id,
      treatments: event.treatments,
      startTime: changeTimeForDisplay(event.startTime, gUtcDiff*-1),
      endTime: changeTimeForDisplay(event.endTime, gUtcDiff*-1),
      date: convertDateToIsraelisDisplay(event.date),
      email: event.email,
      name: event.name,
    }
  })
}
//returns an object with boolean if time slot match the range and the amount of time slots
function checkIfTsInRange(tsToCompare, startTime, endTime, duration) {

  //adding 3 hours to match the time differnce
  const tsToCompareWithAddedHours = changeTimeForDisplay(tsToCompare, gUtcDiff*-1)
  const timeRangeBySlots = getDailySlotsForPreview([{ start: startTime, end: endTime }], duration)
  if (timeRangeBySlots.length) {
    return { occupied: timeRangeBySlots.includes(tsToCompareWithAddedHours), rowspan: timeRangeBySlots.length }
  }
  else {
    if (startTime.slice(11, 16) === tsToCompare) {
      return { occupied: true, rowspan: 1 }
    } else {
      return { occupied: false, rowspan: 1 }
    }
  }
}

function convertNumberToWords(idx) {
  const words = ['אחד', 'שני', 'שלושה', 'ארבעה', 'חמשה', 'ששה', 'שבעה', 'שמונה', 'תשעה', 'עשרה', 'אחד עשר','שתיים עשר','שלושה עשר','ארבע עשר','חמישה עשר','ששה עשר']
  return words[idx - 1]
}

function getMonthByIdx(idx) {
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
  return months[idx - 1]
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}