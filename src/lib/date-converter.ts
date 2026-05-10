/**
 * @fileoverview Date Converter Utilities
 *
 * Provides functions to convert between Bikram Sambat (BS) and Gregorian (AD) calendars.
 * This implementation relies on a reference data mapping (BS_CALENDAR_DATA) for accuracy,
 * as the Nepali calendar does not follow a fixed leap year rule like the Gregorian calendar.
 */
import {
  AD_REFERENCE,
  BS_CALENDAR_DATA,
  BS_MAX_YEAR,
  BS_MIN_YEAR,
  BS_REFERENCE,
} from '@/lib/nepali-date-data'

/**
 * Represents a date in the Bikram Sambat (BS) calendar system.
 */
export interface NepaliDate {
  /** The year in Bikram Sambat (e.g., 2082) */
  year: number
  /** The month (1-indexed, 1-12) */
  month: number
  /** The day of the month (1-indexed, up to 32) */
  day: number
}

/**
 * Represents a date in the Gregorian (AD) calendar system.
 */
export interface EnglishDate {
  /** The year in Gregorian (e.g., 2026) */
  year: number
  /** The month (1-indexed, 1-12) */
  month: number
  /** The day of the month (1-indexed, up to 31) */
  day: number
}

/**
 * Calculates the total number of days in a specific Bikram Sambat year.
 *
 * @param year - The BS year to check
 * @returns Total number of days in the specified year
 * @throws Error if the year is outside the supported range
 */
export function getTotalDaysInBsYear(year: number): number {
  const monthDays = BS_CALENDAR_DATA[year]
  if (!monthDays) {
    throw new Error(
      `BS year ${year} is not supported. Supported range: ${BS_MIN_YEAR}-${BS_MAX_YEAR}`
    )
  }
  return monthDays.reduce((sum, days) => sum + days, 0)
}

/**
 * Gets the number of days in a specific month of a Bikram Sambat year.
 *
 * @param year - The BS year
 * @param month - The BS month (1-12)
 * @returns Number of days in the specified month
 * @throws Error if the year or month is invalid
 */
export function getDaysInBsMonth(year: number, month: number): number {
  const monthDays = BS_CALENDAR_DATA[year]
  if (!monthDays) {
    throw new Error(
      `BS year ${year} is not supported. Supported range: ${BS_MIN_YEAR}-${BS_MAX_YEAR}`
    )
  }
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be between 1-12`)
  }
  return monthDays[month - 1]
}

/**
 * Validates if the given Bikram Sambat date is a real date.
 *
 * @param year - The BS year
 * @param month - The BS month
 * @param day - The BS day
 * @returns True if the date exists in the BS calendar, false otherwise
 */
export function isValidBsDate(year: number, month: number, day: number): boolean {
  if (year < BS_MIN_YEAR || year > BS_MAX_YEAR) return false
  if (month < 1 || month > 12) return false

  try {
    const maxDays = getDaysInBsMonth(year, month)
    return day >= 1 && day <= maxDays
  } catch {
    return false
  }
}

/**
 * Determines the day of the week (0-6) for the first day of a BS month.
 * 0 is Sunday, 6 is Saturday.
 *
 * @param year - The BS year
 * @param month - The BS month
 * @returns The weekday index (0-6)
 */
export function getFirstDayOfBsMonth(year: number, month: number): number {
  const adDate = bsToAd(year, month, 1)
  const date = new Date(adDate.year, adDate.month - 1, adDate.day)
  return date.getDay()
}

/**
 * Internal helper to count total days elapsed from the package's BS reference date.
 *
 * @param year - Target BS year
 * @param month - Target BS month
 * @param day - Target BS day
 * @returns Total number of days from reference to target
 */
function countDaysFromBsReference(year: number, month: number, day: number): number {
  let totalDays = 0

  // Add days for complete years
  for (let y = BS_REFERENCE.year; y < year; y++) {
    totalDays += getTotalDaysInBsYear(y)
  }

  // Add days for complete months in the target year
  const monthDays = BS_CALENDAR_DATA[year]
  for (let m = 0; m < month - 1; m++) {
    totalDays += monthDays[m]
  }

  // Add remaining days (offset by 1 as reference starts at day 1)
  totalDays += day - 1

  return totalDays
}

/**
 * Checks if a Gregorian year is a leap year.
 *
 * @param year - The AD year
 * @returns True if it's a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Gets the number of days in a specific Gregorian month.
 *
 * @param year - The AD year
 * @param month - The AD month (1-12)
 * @returns Number of days in the month
 */
function getDaysInAdMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month - 1]
}

/**
 * Converts a Bikram Sambat (BS) date to a Gregorian (AD) date.
 *
 * @param year - BS Year
 * @param month - BS Month
 * @param day - BS Day
 * @returns EnglishDate object containing AD year, month, and day
 * @throws Error if the BS date is invalid
 */
export function bsToAd(year: number, month: number, day: number): EnglishDate {
  if (!isValidBsDate(year, month, day)) {
    throw new Error(`Invalid BS date: ${year}-${month}-${day}`)
  }

  const totalDays = countDaysFromBsReference(year, month, day)

  let adYear = AD_REFERENCE.year
  let adMonth = AD_REFERENCE.month
  let adDay = AD_REFERENCE.day

  let remainingDays = totalDays

  while (remainingDays > 0) {
    const daysInCurrentMonth = getDaysInAdMonth(adYear, adMonth)
    const daysLeftInMonth = daysInCurrentMonth - adDay

    if (remainingDays <= daysLeftInMonth) {
      adDay += remainingDays
      remainingDays = 0
    } else {
      remainingDays -= daysLeftInMonth + 1
      adMonth++
      adDay = 1

      if (adMonth > 12) {
        adMonth = 1
        adYear++
      }
    }
  }

  return { year: adYear, month: adMonth, day: adDay }
}

/**
 * Converts a Gregorian (AD) date to a Bikram Sambat (BS) date.
 *
 * @param year - AD Year
 * @param month - AD Month
 * @param day - AD Day
 * @returns NepaliDate object containing BS year, month, and day
 * @throws Error if the AD date is invalid or outside supported range
 */
export function adToBs(year: number, month: number, day: number): NepaliDate {
  const adDate = new Date(year, month - 1, day)
  if (
    adDate.getFullYear() !== year ||
    adDate.getMonth() !== month - 1 ||
    adDate.getDate() !== day
  ) {
    throw new Error(`Invalid AD date: ${year}-${month}-${day}`)
  }

  const refDateUTC = Date.UTC(AD_REFERENCE.year, AD_REFERENCE.month - 1, AD_REFERENCE.day)
  const targetDateUTC = Date.UTC(year, month - 1, day)

  const diffTime = targetDateUTC - refDateUTC
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    throw new Error(`Date ${year}-${month}-${day} is before the supported range`)
  }

  let bsYear = BS_REFERENCE.year
  let bsMonth = BS_REFERENCE.month
  let bsDay = BS_REFERENCE.day

  let remainingDays = diffDays

  while (remainingDays > 0) {
    const daysInCurrentMonth = getDaysInBsMonth(bsYear, bsMonth)
    const daysLeftInMonth = daysInCurrentMonth - bsDay

    if (remainingDays <= daysLeftInMonth) {
      bsDay += remainingDays
      remainingDays = 0
    } else {
      remainingDays -= daysLeftInMonth + 1
      bsMonth++
      bsDay = 1

      if (bsMonth > 12) {
        bsMonth = 1
        bsYear++

        if (bsYear > BS_MAX_YEAR) {
          throw new Error(`Date exceeds supported BS year range (max: ${BS_MAX_YEAR})`)
        }
      }
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay }
}

/**
 * Gets today's date in Bikram Sambat calendar.
 *
 * @returns NepaliDate object representing today
 */
export function getTodayBs(): NepaliDate {
  const today = new Date()
  return adToBs(today.getFullYear(), today.getMonth() + 1, today.getDate())
}

/**
 * Compares two Bikram Sambat dates.
 *
 * @param a - First date
 * @param b - Second date
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareBsDates(a: NepaliDate, b: NepaliDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1
  if (a.month !== b.month) return a.month < b.month ? -1 : 1
  if (a.day !== b.day) return a.day < b.day ? -1 : 1
  return 0
}

/**
 * Check if a Bikram Sambat date is within a specific range (inclusive).
 *
 * @param date - The date to check
 * @param minDate - Minimum date of the range
 * @param maxDate - Maximum date of the range
 * @returns True if date is within [minDate, maxDate]
 */
export function isBsDateInRange(
  date: NepaliDate,
  minDate?: NepaliDate,
  maxDate?: NepaliDate
): boolean {
  if (minDate && compareBsDates(date, minDate) < 0) return false
  if (maxDate && compareBsDates(date, maxDate) > 0) return false
  return true
}

/**
 * Adds a specific number of days to a Nepali date.
 *
 * @param date - The starting date
 * @param days - Number of days to add
 * @returns A new NepaliDate object
 */
export function addDays(date: NepaliDate, days: number): NepaliDate {
  const adDate = bsToAd(date.year, date.month, date.day)
  const newAdDate = new Date(adDate.year, adDate.month - 1, adDate.day + days)
  return adToBs(newAdDate.getFullYear(), newAdDate.getMonth() + 1, newAdDate.getDate())
}

/**
 * Subtracts a specific number of days from a Nepali date.
 *
 * @param date - The starting date
 * @param days - Number of days to subtract
 * @returns A new NepaliDate object
 */
export function subDays(date: NepaliDate, days: number): NepaliDate {
  return addDays(date, -days)
}

/**
 * Adds a specific number of months to a Nepali date.
 * Caps the day to the maximum days in the resulting month.
 *
 * @param date - The starting date
 * @param months - Number of months to add
 * @returns A new NepaliDate object
 */
export function addMonths(date: NepaliDate, months: number): NepaliDate {
  let newYear = date.year
  let newMonth = date.month + months
  
  while (newMonth > 12) {
    newYear++
    newMonth -= 12
  }
  while (newMonth < 1) {
    newYear--
    newMonth += 12
  }
  
  const maxDaysInNewMonth = getDaysInBsMonth(newYear, newMonth)
  const newDay = Math.min(date.day, maxDaysInNewMonth)
  
  return { year: newYear, month: newMonth, day: newDay }
}

/**
 * Subtracts a specific number of months from a Nepali date.
 *
 * @param date - The starting date
 * @param months - Number of months to subtract
 * @returns A new NepaliDate object
 */
export function subMonths(date: NepaliDate, months: number): NepaliDate {
  return addMonths(date, -months)
}

/**
 * Adds a specific number of years to a Nepali date.
 * Caps the day to the maximum days in the resulting month if needed.
 *
 * @param date - The starting date
 * @param years - Number of years to add
 * @returns A new NepaliDate object
 */
export function addYears(date: NepaliDate, years: number): NepaliDate {
  const newYear = date.year + years
  const maxDays = getDaysInBsMonth(newYear, date.month)
  return { year: newYear, month: date.month, day: Math.min(date.day, maxDays) }
}

/**
 * Subtracts a specific number of years from a Nepali date.
 *
 * @param date - The starting date
 * @param years - Number of years to subtract
 * @returns A new NepaliDate object
 */
export function subYears(date: NepaliDate, years: number): NepaliDate {
  return addYears(date, -years)
}

/**
 * Gets the first day of the month for the given date.
 *
 * @param date - The target date
 * @returns A new NepaliDate set to the 1st of the month
 */
export function startOfMonth(date: NepaliDate): NepaliDate {
  return { year: date.year, month: date.month, day: 1 }
}

/**
 * Gets the last day of the month for the given date.
 *
 * @param date - The target date
 * @returns A new NepaliDate set to the last day of the month
 */
export function endOfMonth(date: NepaliDate): NepaliDate {
  return { year: date.year, month: date.month, day: getDaysInBsMonth(date.year, date.month) }
}

/**
 * Gets the first day of the year for the given date.
 *
 * @param date - The target date
 * @returns A new NepaliDate set to Baisakh 1st
 */
export function startOfYear(date: NepaliDate): NepaliDate {
  return { year: date.year, month: 1, day: 1 }
}

/**
 * Gets the last day of the year for the given date.
 *
 * @param date - The target date
 * @returns A new NepaliDate set to Chaitra's last day
 */
export function endOfYear(date: NepaliDate): NepaliDate {
  return { year: date.year, month: 12, day: getDaysInBsMonth(date.year, 12) }
}

/**
 * Checks if two dates are exactly the same.
 */
export function isSameDate(date1: NepaliDate, date2: NepaliDate): boolean {
  return compareBsDates(date1, date2) === 0
}

/**
 * Checks if the first date is strictly before the second date.
 */
export function isBefore(date1: NepaliDate, date2: NepaliDate): boolean {
  return compareBsDates(date1, date2) < 0
}

/**
 * Checks if the first date is strictly after the second date.
 */
export function isAfter(date1: NepaliDate, date2: NepaliDate): boolean {
  return compareBsDates(date1, date2) > 0
}

/**
 * Checks if the given date is today.
 */
export function isToday(date: NepaliDate): boolean {
  return isSameDate(date, getTodayBs())
}

/**
 * Checks if the given date is in the future.
 */
export function isFuture(date: NepaliDate): boolean {
  return isAfter(date, getTodayBs())
}

/**
 * Checks if the given date is in the past.
 */
export function isPast(date: NepaliDate): boolean {
  return isBefore(date, getTodayBs())
}

/**
 * Calculates the exact difference in days between two dates.
 *
 * @returns The number of days. Positive if date1 is after date2.
 */
export function differenceInDays(date1: NepaliDate, date2: NepaliDate): number {
  const ad1 = bsToAd(date1.year, date1.month, date1.day)
  const ad2 = bsToAd(date2.year, date2.month, date2.day)
  
  const utc1 = Date.UTC(ad1.year, ad1.month - 1, ad1.day)
  const utc2 = Date.UTC(ad2.year, ad2.month - 1, ad2.day)
  
  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24))
}

/**
 * Calculates the difference in months between two dates.
 */
export function differenceInMonths(date1: NepaliDate, date2: NepaliDate): number {
  return (date1.year - date2.year) * 12 + (date1.month - date2.month)
}

/**
 * Calculates the difference in years between two dates.
 */
export function differenceInYears(date1: NepaliDate, date2: NepaliDate): number {
  return date1.year - date2.year
}

/**
 * Determines the day of the week (0-6) for a specific date.
 * 0 is Sunday, 6 is Saturday.
 */
export function getDayOfWeek(date: NepaliDate): number {
  const ad = bsToAd(date.year, date.month, date.day)
  return new Date(ad.year, ad.month - 1, ad.day).getDay()
}

/**
 * Checks if the date falls on a weekend.
 * In Nepal, Saturday (6) is considered the weekend.
 */
export function isWeekend(date: NepaliDate): boolean {
  return getDayOfWeek(date) === 6
}
