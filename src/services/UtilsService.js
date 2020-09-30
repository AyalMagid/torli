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
  getDayByHebrewWord
}

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
  var dateCopy = new Date(date.getTime())
  dateCopy.setDate(dateCopy.getDate() + daysAfterOrBefore)
  dateCopy = dateCopy.toISOString().slice(0, 10)
  return dateCopy
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
  const startTime = new Date(year, month - 1, day, hours + 3, min, 0, 0);
  year = timeslot.end.slice(0, 4)
  month = timeslot.end.slice(5, 7)
  day = timeslot.end.slice(8, 10)
  hours = +timeslot.end.slice(11, 13)
  min = timeslot.end.slice(14, 16)
  const endTime = new Date(year, month - 1, day, hours + 3, min, 0, 0);
  let nextTimeSlot = startTime//maby need copy
  hours = nextTimeSlot.getHours()
  min = nextTimeSlot.getMinutes()
  let slotToRender = checkDigitsAndAddZerosIfNeeded(hours) + ':' + checkDigitsAndAddZerosIfNeeded(min);
  if ((nextTimeSlot.getTime() + (duration * 60 * 1000)) < endTime.getTime()) { slotsToRender.push(slotToRender) }
  while ((nextTimeSlot.getTime() + (duration * 60 * 1000)) < endTime.getTime()) {
    nextTimeSlot = new Date(nextTimeSlot.getTime() + ((60 * 60 * 1000) / 2));//adding half an hour
    hours = nextTimeSlot.getHours()
    min = nextTimeSlot.getMinutes()
    slotToRender = checkDigitsAndAddZerosIfNeeded(hours) + ':' + checkDigitsAndAddZerosIfNeeded(min);
    slotsToRender.push(slotToRender)
  }
  return slotsToRender
}

//get an hour and returns full isos date (including the time)
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
  const days = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"]
  return days[idx]
}

