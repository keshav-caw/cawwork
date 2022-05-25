const ical = require('ical-generator');

export function icalGenerator(title,description,location,startTime,endTime){

    const calendar = ical({name: 'iCal-generation'});

    calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: title,
        description: description,
        location:location
    });
    return calendar;
}