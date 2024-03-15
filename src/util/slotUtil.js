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