import CalendarService from '../services/CalendarService';
import UtilsService from '../services/UtilsService';

// THUNK
export function loadCalendar() {
  
  return async dispatch => {
    try {
      const calendar = await CalendarService.getCalendar();
      dispatch(setCalendar(calendar));
    } catch (err) {
      console.log('calendarActions: err in loadCalendars', err);
  };
}
}

export function setCalendar(calendar) {
    return {
      type: 'SET_CALENDAR',
      calendar
     };
}


export function loadTimeSlots(pickedDate = null){
  let date
      if (!pickedDate) {
        date = new Date()
        var firstDay = UtilsService.getIsosDate (0)
        var secondDay = UtilsService.getIsosDate (1)
        var thirdDay = UtilsService.getIsosDate (2)
      } else {
      // get day after and day before
      // firstDay = UtilsService.getIsosDate (-1, pickedDate)
      // secondDay = UtilsService.getIsosDate (0,  pickedDate)
      // thirdDay = UtilsService.getIsosDate (1, pickedDate )
      date = pickedDate
        firstDay = UtilsService.getIsosDate (0, pickedDate)
        secondDay = UtilsService.getIsosDate (1, pickedDate)
        thirdDay = UtilsService.getIsosDate (2, pickedDate )
      } 
      // check for saturday (unwroking day), if it was, sending the correction to skip that day
        if (!firstDay) {
          firstDay = UtilsService.getIsosDate (1, date)
          secondDay = UtilsService.getIsosDate (2, date)
          thirdDay = UtilsService.getIsosDate (3, date )
        }
        if (!secondDay) {
          firstDay = UtilsService.getIsosDate (0, date)
          secondDay = UtilsService.getIsosDate (2, date)
          thirdDay = UtilsService.getIsosDate (3, date )
        }
        if (!thirdDay) {
          firstDay = UtilsService.getIsosDate (0, date)
          secondDay = UtilsService.getIsosDate (1, date)
          thirdDay = UtilsService.getIsosDate (3, date )
         }     
  return async dispatch => {
    try {
      const timeSlots = {
        // 30M means the min block time range later to scheduale a meeting
      firstDaySlots: await CalendarService.getAvailbleDailySlots(`${firstDay}T06:00:00`, `${firstDay}T18:00:00`, '1H'),
      secondDaySlots: await CalendarService.getAvailbleDailySlots(`${secondDay}T06:00:00`, `${secondDay}T18:00:00`, '1H'),
      thirdDaySlots : await CalendarService.getAvailbleDailySlots(`${thirdDay}T06:00:00`, `${thirdDay}T18:00:00`, '1H')
      }
      console.log('tssss', timeSlots)
      dispatch(setTimeSlots(timeSlots));
    } catch (err) {
      console.log('Err getting timeslots', err);
    }
  }
}

export function setTimeSlots(timeSlots) {
  return {
    type: 'SET_TIMESLOTS',
    timeSlots
   };
}



export function updateHoursToBlock(slotsRangeToBlock) {
   return  dispatch => { dispatch(_updateHoursToBlock(slotsRangeToBlock))}
}



export function _updateHoursToBlock(slotsRangeToBlock) {
    return {
      type: 'UPDATE_HOURS_TO_BLOCK',
      slotsRangeToBlock
     };
}


export function updateSlotToBlock(slotToBlock) {
   return  dispatch => { dispatch(_updateSlotToBlock(slotToBlock))}
}



export function _updateSlotToBlock(slotToBlock) {
    return {
      type: 'UPDATE_SLOT_TO_BLOCK',
      slotToBlock
     };
}


export function updateIsDayFullyAvailable(isDayFullyAvailable) {
   return  dispatch => { dispatch(_updateIsDayFullyAvailable(isDayFullyAvailable))}
}



export function _updateIsDayFullyAvailable(isDayFullyAvailable) {
    return {
      type: 'UPDATE_IS_DAY_FULLY_AVAILABLE',
      isDayFullyAvailable
     };
}
