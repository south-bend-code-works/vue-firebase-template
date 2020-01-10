const MONTHS = [
  {
    short: 'Jan',
    long: 'January',
  },
  {
    short: 'Feb',
    long: 'February',
  },
  {
    short: 'Mar',
    long: 'March',
  },
  {
    short: 'Apr',
    long: 'April',
  },
  {
    short: 'May',
    long: 'May',
  },
  {
    short: 'Jun',
    long: 'June',
  },
  {
    short: 'Jul',
    long: 'July',
  },
  {
    short: 'Aug',
    long: 'August',
  },
  {
    short: 'Sep',
    long: 'September',
  },
  {
    short: 'Oct',
    long: 'October',
  },
  {
    short: 'Nov',
    long: 'November',
  },
  {
    short: 'Dec',
    long: 'December',
  },
]

export const breakApartAndFormatTime = (time) => {
  let [hours, minutes] = time.split(':')
  minutes = minutes === '00' ? '0' : minutes
  return formatTime(hours, minutes)
}

const formatTime = (hours, minutes) => {
  let displayHours = hours % 12
  displayHours = displayHours === 0 ? 12 : displayHours
  const displayMinutes = minutes < 10 ? '0' + minutes : minutes
  const displayMeridian = hours > 12 ? 'PM' : 'AM'
  const output = `${displayHours}:${displayMinutes} ${displayMeridian}`
  return output.indexOf('undefined') !== -1 ? 'Not a time' : output
}

export const getMonthName = (idx, isLong = true) => {
  const monthObj = MONTHS[idx]
  if (monthObj) return monthObj[isLong ? 'long' : 'short']
  
  console.debug('Month could not be determined due to invalid date.')
}

export const toShortTime = (ts) => {
  const d = new Date(ts)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const year = d.getFullYear()
  const time = formatTime(d.getHours(), d.getMinutes())
  return `${month}/${day}/${year} ${time}`
}

export const toHumanTime = (ts, includeTime = true, short = true) => {
  const d = new Date(Number(ts))
  const month = MONTHS[d.getMonth()][short ? 'short' : 'long']
  const day = d.getDate()
  const year = d.getFullYear()
  const time = formatTime(d.getHours(), d.getMinutes())
  return `${month} ${day}, ${year}${includeTime ? ', ' + time : ''}`
}