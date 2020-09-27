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
    if (!pickedDate) {
      var firstDay = UtilsService.getIsosDate (0)
      var secondDay = UtilsService.getIsosDate (1)
      var thirdDay = UtilsService.getIsosDate (2)
    } else {
      firstDay = UtilsService.getIsosDate (-1, pickedDate)
      secondDay = UtilsService.getIsosDate (0,  pickedDate)
      thirdDay = UtilsService.getIsosDate (1, pickedDate ) 
    }
  return async dispatch => {
    try {
      const timeSlots = {
      firstDaySlots: await CalendarService.getAvailbleDailySlots(`${firstDay}T05:00:00`, `${firstDay}T17:00:00`, '1H'),
      secondDaySlots: await CalendarService.getAvailbleDailySlots(`${secondDay}T05:00:00`, `${secondDay}T17:00:00`, '1H'),
      thirdDaySlots : await CalendarService.getAvailbleDailySlots(`${thirdDay}T05:00:00`, `${thirdDay}T17:00:00`, '1H')
      }
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

// export async function loadTimeSlots(pickedDate = null){
//   if (!pickedDate) {
//       var firstDay = getIsosDate (0)
//       var secondDay = getIsosDate (1)
//       var thirdDay = getIsosDate (2)
//   } else {
//       firstDay = getIsosDate (-1, pickedDate)
//       secondDay = getIsosDate (0,  pickedDate)
//       thirdDay = getIsosDate (1, pickedDate ) 
//   }
//   const firstDaySlots = await CalendarService.getAvailbleDailySlots(`${firstDay}T05:00:00`, `${firstDay}T17:00:00`, '1H')
//   const secondDaySlots = await CalendarService.getAvailbleDailySlots(`${secondDay}T05:00:00`, `${secondDay}T17:00:00`, '1H')
//   const thirdDaySlots = await CalendarService.getAvailbleDailySlots(`${thirdDay}T05:00:00`, `${thirdDay}T17:00:00`, '1H')
//   const timeSlots = {
//       first:firstDaySlots,
//       second:secondDaySlots,
//       third:thirdDaySlots
//   }
//   return timeSlots
// }
