import moment from 'moment'

export const convertSlots = (data) => {
    return data.map(slot => {
        const { start, end } = slot
        return {
            ...slot,
            start: moment(start).toDate(),
            end: moment(end).toDate(),
        }
    })
}

export const convertStatusToText = (status) => {
    return status.split('_').map(status => status.charAt(0) + status.slice(1).toLowerCase()).join(" ")
}

// check if the slot will overlaps with existing slots
export const isOverlapped = (slots, start, end, id = undefined) => {
    return slots.some(slot => {
        if (id && slot.id === id) {
            return false;
        }
        const range1 = moment.range(start, end);
        const range2 = moment.range(moment(slot.start), moment(slot.end));
        return range1.overlaps(range2)
    })
}