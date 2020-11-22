import HttpService from './HttpService'

export default {
    sendEmail
}

// routim
// function sendEmail(name, date, email='', isConfirmation, phone='', duration='', time='', treatments='', businessName) {
function sendEmail(name, date, email='', isConfirmation, phone='', duration='', time='', treatments='') {
    const businessName='נייל סלון'
    let bodyText = ''
    if (isConfirmation) {
        bodyText =`        שלום ${name} ,

        שמחים שבחרת ${businessName} !
        נקבע לך תור ל${treatments}  
        בתאריך ${date}
        בשעה ${time}
        משך זמן הטיפול מוערך כ- ${duration} דקות
        הטלפון שהתקבל ליצירת קשר הוא - ${phone}
        
        תודה`
    } else {
        bodyText = `
        שלום,
         ${name}
        התור שנקבע לתאריך ${date} בוטל 
        תודה על העדכון `
    }
    let emailObj = {
        email,
        bodyText
    }
    return HttpService.post('email',emailObj)
}