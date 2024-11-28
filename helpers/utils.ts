const moment = require('moment')
const { DateTime } = require('luxon')

export const convertDateString = (dateString: string | null, options: {}) => {
  if (dateString === null) {
    return null
  }

  const dateObj = new Date(dateString)
  const formattedDate = dateObj.toLocaleString(undefined, options)

  return formattedDate
}

export const calculateTimeForHackathon = (
  startDate: string,
  endDate: string,
  hackathonTimeZone: string,
  localTimeZone: string
) => {

  const startTimeUTCDateString = convertToUTCDateTimeString(
    startDate,
    hackathonTimeZone
  )

  const deadlineUTCDateString = convertToUTCDateTimeString(
    endDate,
    hackathonTimeZone
  )

  const utcStartTimeDateUTC = DateTime.fromISO(startTimeUTCDateString, {
    zone: 'utc',
  })

  const utcDeadlineDateUTC = DateTime.fromISO(deadlineUTCDateString, {
    zone: 'utc',
  })

  const currentDate = DateTime.now().setZone(localTimeZone)
  const userTimeZoneStartTimeDate = utcStartTimeDateUTC.setZone(localTimeZone)
  const userTimeZoneDeadlineDate = utcDeadlineDateUTC.setZone(localTimeZone)

  const startTimeDaysDifference = userTimeZoneStartTimeDate.diff(
    currentDate,
    'days'
  ).days

  const deadlineDaysDifference = userTimeZoneDeadlineDate.diff(
    currentDate,
    'days'
  ).days

  let progress = {
    isRunning: true,
    status: '',
  }
  let formattedString = ''

  if (startTimeDaysDifference > 0) {
    if (startTimeDaysDifference > 1) {
      const roundedTime = Math.floor(startTimeDaysDifference)
      formattedString =
        roundedTime === 1
          ? 'starting in 1 day'
          : `starting in ${roundedTime} days`
    } else {
      const hoursDifference = userTimeZoneStartTimeDate.diff(
        currentDate,
        'hours'
      ).hours
      const roundedTime = Math.floor(hoursDifference)
      formattedString =
        roundedTime === 1
          ? 'starting in 1 hour'
          : `starting in ${roundedTime} hours`
    }
    progress = {
      isRunning: false,
      status: formattedString,
    }
  } else if (deadlineDaysDifference > 0) {
    if (deadlineDaysDifference > 1) {
      const roundedTime = Math.floor(deadlineDaysDifference)
      formattedString =
        roundedTime === 1 ? 'about 1 day left' : `${roundedTime} days left`
    } else {
      const hoursDifference = userTimeZoneDeadlineDate.diff(
        currentDate,
        'hours'
      ).hours
      const roundedTime = Math.floor(hoursDifference)
      formattedString =
        roundedTime === 1 ? 'about 1 hour left' : `${roundedTime} hours left`
    }
    progress = {
      isRunning: true,
      status: formattedString,
    }
  } else {
    formattedString = 'hackathon has ended'
    progress = {
      isRunning: false,
      status: formattedString,
    }
  }

  return {
    progress,
    userStartTime: userTimeZoneStartTimeDate,
    userEndTime: userTimeZoneDeadlineDate,
  }
}

export const calculateTotalPrize = (prizesArr: any[]) => {
  if (!prizesArr) return 0
  let total = 0
  prizesArr.map((prize) => (total += parseInt(prize.value)))
  return total
}

export const convertToUTCDateTimeString = (
  dateStr: string,
  timeZone: string
) => {
  const dateTimeString = `${dateStr}T00:00:00`
  const dateTime = DateTime.fromISO(dateTimeString, { zone: timeZone })

  const utcDateTime = dateTime.toUTC()
  const utcDateTimeString = utcDateTime.toISO({ suppressMilliseconds: true })

  return utcDateTimeString
}

export const convertDateStringToFormattedString = (
  startDate: string,
  endDate: string
) => {
  const newStartDate = new Date(startDate)
  const newEndDate = new Date(endDate)

  const formattedStartDate = newStartDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const formattedEndDate = newEndDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return `${formattedStartDate} - ${formattedEndDate}, ${newStartDate.getFullYear()}`
}

export const timeAgo = (dateString: string) => {
  const pastDate = moment(dateString)
  const currentDate = moment()
  const duration = moment.duration(currentDate.diff(pastDate))
  if (duration.asMinutes() < 1) {
    return 'Just now'
  } else if (duration.asHours() < 1) {
    return `${Math.floor(duration.asMinutes())} minute${duration.asMinutes() >= 2 ? 's' : ''
      } ago`
  } else if (duration.asDays() < 1) {
    return `${Math.floor(duration.asHours())} hour${duration.asHours() >= 2 ? 's' : ''
      } ago`
  } else if (duration.asWeeks() < 1) {
    return `${Math.floor(duration.asDays())} day${duration.asDays() >= 2 ? 's' : ''
      } ago`
  } else if (duration.asMonths() < 1) {
    return `${Math.floor(duration.asWeeks())} week${duration.asWeeks() >= 2 ? 's' : ''
      } ago`
  } else if (duration.asYears() < 1) {
    return `${Math.floor(duration.asMonths())} month${duration.asMonths() >= 2 ? 's' : ''
      } ago`
  } else {
    return `${Math.floor(duration.asYears())} year${duration.asYears() >= 2 ? 's' : ''
      } ago`
  }
}

export const Youtube = (function () {
  'use strict'

  let video, results

  let getThumb = function (url: string, size: string) {
    if (url === null) {
      return ''
    }
    size = size === null ? 'big' : size
    results = url.match('[\\?&]v=([^&#]*)')
    video = results === null ? url : results[1]

    if (size === 'small') {
      return 'http://img.youtube.com/vi/' + video + '/2.jpg'
    }
    return 'http://img.youtube.com/vi/' + video + '/0.jpg'
  }

  return {
    thumb: getThumb,
  }
})()

export const getVimeoThumbnailUrl = async (url: string) => {
  let result: string = ''
  const res = await fetch(`https://vimeo.com/api/oembed.json?url=${url}`)
  if (res.ok) {
    const data = await res.json()
    result = data.thumbnail_url
  }
  return result
}

export const checkIsEndDatePassed = (
  hackathonEndDate: string,
  hackathonTimeZone: string
) => {
  const endDate = DateTime.fromISO(hackathonEndDate, {
    zone: hackathonTimeZone,
  })
  const currentDate = DateTime.now().setZone(hackathonTimeZone)

  if (currentDate > endDate) {
    return true
  }
  return false
}
