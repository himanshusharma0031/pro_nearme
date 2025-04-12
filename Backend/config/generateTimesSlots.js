function generateTimeSlots(startTime = "09:00", endTime = "17:00", interval = 30) {
    const slots = [];
    let [hour, minute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    while (hour < endHour || (hour === endHour && minute < endMinute)) {
        let formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(formattedTime);

        minute += interval;
        if (minute >= 60) {
            hour += 1;
            minute -= 60;
        }
    }

    return slots;
}

module.exports = generateTimeSlots;
