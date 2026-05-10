# @munatech/nepali-datepicker 🇳🇵

A modern, lightweight, and highly customizable React component library for selecting **Nepali (Bikram Sambat)** dates. Built for **React 19** with **Tailwind CSS v4** and full **TypeScript** support.

[![NPM Version](https://img.shields.io/npm/v/@munatech/nepali-datepicker?style=flat-square)](https://www.npmjs.com/package/@munatech/nepali-datepicker)
[![Build Status](https://img.shields.io/github/actions/workflow/status/munatech/nepali-datepicker/release.yml?style=flat-square)](https://github.com/munatech/nepali-datepicker/actions)
[![License](https://img.shields.io/npm/l/@munatech/nepali-datepicker?style=flat-square)](https://github.com/munatech/nepali-datepicker/blob/main/LICENSE)

## ✨ Features

- 🗓️ **Complete BS Calendar** — Full support for Bikram Sambat (2000-2100 BS).
- 🔄 **Bidirectional Conversion** — Seamlessly convert between BS and AD (Gregorian).
- 🌐 **Fully Bilingual** — Switch between English and Nepali (माघ / Magh) with one prop.
- 🔢 **Native Numerals** — Toggle between standard (1, 2, 3) and Nepali (१, २, ३) numerals.
- ⚛️ **Modern Architecture** — Optimized for React 19 and Vite 7.
- 🎨 **Tailwind CSS v4** — Built-in design system with namespaced tokens to avoid conflicts.
- 📋 **Form Ready** — Native `<input type="hidden">` support for standard forms and **React Hook Form**.
- 📱 **Responsive & Accessible** — Mobile-friendly touch support and keyboard navigation.

---

## 🚀 Quick Start

### 1. Install

```bash
npm install @munatech/nepali-datepicker
```

### 2. Import Styles

Add this to your `main.tsx` or `App.tsx`:

```tsx
import '@munatech/nepali-datepicker/dist/style.css'
```

### 3. Basic Usage

```tsx
import { useState } from 'react'
import { Picker } from '@munatech/nepali-datepicker'

function MyComponent() {
  const [date, setDate] = useState()

  return (
    <Picker 
      value={date} 
      onChange={setDate} 
      placeholder="Pick a Nepali Date" 
    />
  )
}
```

---

## 🛠️ Components

### `Picker` (Standard Date Picker)
The primary selection component featuring a trigger button and a calendar popover.

```tsx
import { Picker } from '@munatech/nepali-datepicker'

<Picker
  language="ne"               // 'en' | 'ne'
  captionLayout="dropdown"    // 'buttons' | 'dropdown'
  dateFormat="YYYY-MM-DD"     // Format for view
  minDate={{ year: 2080, month: 1, day: 1 }}
  maxDate={{ year: 2085, month: 12, day: 30 }}
/>
```

### `DateRangePicker`
Perfect for booking systems or date-range filtering.

```tsx
import { DateRangePicker } from '@munatech/nepali-datepicker'

const [range, setRange] = useState({ from: undefined, to: undefined });

<DateRangePicker
  value={range}
  onChange={setRange}
  placeholder="Select date range"
/>
```

### `Calendar` (Standalone)
Use the calendar grid directly on your page without a popover.

```tsx
import { Calendar } from '@munatech/nepali-datepicker'

<Calendar
  selected={date}
  onSelect={setDate}
  language="ne"
  className="border p-4 rounded-xl shadow-lg"
/>
```

---

## 📋 Form Integration

### Native HTML Forms
The picker includes a hidden input field, making it work out-of-the-box with standard form submissions.

```tsx
<form action="/api/submit" method="POST">
  <Picker name="birth_date" />
  <button type="submit">Submit</button>
</form>
// Submits: birth_date=2082-10-06 (in standard YYYY-MM-DD format)
```

### React Hook Form (RHF)
The components support `forwardRef`, allowing seamless integration with `Controller`.

```tsx
import { useForm, Controller } from 'react-hook-form'
import { Picker } from '@munatech/nepali-datepicker'

const { control, handleSubmit } = useForm();

<Controller
  name="appointmentDate"
  control={control}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <Picker
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur} // Support for validation triggers
      ref={field.ref}       // Support for focusing on error
    />
  )}
/>
```

---

## 📚 API Reference

### Component Props (Picker & DateRangePicker)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `NepaliDate` | — | Current date selection |
| `onChange` | `Function` | — | Triggered when selection changes |
| `language` | `'en' \| 'ne'` | `'en'` | Display language for labels and numbers |
| `dateFormat` | `string` | `'YYYY-MM-DD'` | Display format in the trigger button |
| `name` | `string` | — | Input name for native form submission |
| `captionLayout` | `'buttons' \| 'dropdown'` | `'buttons'` | Navigation interface style |
| `minDate` | `NepaliDate` | — | Earliest selectable date |
| `maxDate` | `NepaliDate` | — | Latest selectable date |
| `closeOnSelect` | `boolean` | `true` | Auto-close popover after choosing |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `className` | `string` | — | Additional CSS classes for the trigger button |
| `calendarClassName` | `string` | — | Additional CSS classes for the calendar popover |

### `PickerWithToday` Specific Props
Includes all `Picker` props plus:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `containerClassName` | `string` | — | Classes for the outer wrapper `div` |
| `todayButtonClassName` | `string` | — | Classes for the "Today" shortcut button |

### Date Utility Functions

The library comes with a rich set of native Bikram Sambat date manipulation utilities:

**Core Conversions**
| Function | Description |
| :--- | :--- |
| `bsToAd(y, m, d)` | Returns `{ year, month, day }` in Gregorian. |
| `adToBs(y, m, d)` | Returns `{ year, month, day }` in Bikram Sambat. |
| `getTodayBs()` | Returns the current date as a BS object. |
| `isValidBsDate(y, m, d)` | Validates if a BS date exists in history. |

**Date Manipulation & Math**
| Function | Description |
| :--- | :--- |
| `addDays(date, n) / subDays(date, n)` | Add or subtract days. |
| `addMonths(date, n) / subMonths(date, n)` | Add or subtract months. |
| `addYears(date, n) / subYears(date, n)` | Add or subtract years. |
| `startOfMonth(date) / endOfMonth(date)` | Returns the first/last day of the BS month. |

**Date Comparisons & Differences**
| Function | Description |
| :--- | :--- |
| `isSameDate(d1, d2)` | Returns true if dates match. |
| `isBefore(d1, d2) / isAfter(d1, d2)` | Compares chronological order. |
| `differenceInDays(d1, d2)` | Number of days between two dates. |
| `isWeekend(date)` | Checks if date falls on Saturday. |

**Formatting & Parsing**
| Function | Description |
| :--- | :--- |
| `formatBsDate(date, str, lang)` | Formats a BS date using tokens (YYYY, MMMM, D). |
| `timeAgo(date, lang)` | Relative time string (e.g., "2 days ago", "२ दिन अगाडि"). |
| `toNepaliNumeral(num) / toEnglishNumeral(str)` | Numeral conversions. |

#### 💡 Utility Examples

```tsx
import { 
  addDays, 
  getTodayBs, 
  formatBsDate, 
  timeAgo,
  isWeekend
} from '@munatech/nepali-datepicker'

// Math & Formatting
const today = getTodayBs() // { year: 2082, month: 10, day: 6 }
const nextWeek = addDays(today, 7)
console.log(formatBsDate(nextWeek, 'MMMM D, YYYY', 'en')) 
// Output: "Magh 13, 2082"

// Relative Time
const pastDate = { year: 2082, month: 10, day: 1 }
console.log(timeAgo(pastDate)) 
// Output: "5 days ago"

// Weekend Check
if (isWeekend(today)) {
  console.log("It's Saturday! 🎉")
}
```

---

## 🎨 Customization (Tailwind v4)

The Date Picker is designed to be highly customizable and minimal. Since it’s built with standard React and Tailwind CSS v4, you have a lot of flexibility. 

### 1. Minimal Layout using Props
Use `className` and `calendarClassName` to strip away defaults and make the trigger ultra-minimal.

```tsx
<Picker
  value={date}
  onChange={setDate}
  // Remove borders and background to make the trigger ultra-minimal
  className="border-none bg-transparent shadow-none hover:bg-gray-100 text-gray-700"
  // Style the popup calendar container
  calendarClassName="rounded-2xl shadow-sm border border-gray-100"
  captionLayout="buttons" // Keeps the minimal text + arrows header
/>
```

### 2. Standalone Calendar for Custom UI
If you don't want the default popover trigger, you can use the barebones `Calendar` component and build your own wrapper (like a custom modal, sliding drawer, or inline display).

```tsx
<div className="p-4 bg-white rounded-xl max-w-sm">
  <h3 className="text-sm font-medium text-gray-500 mb-2">Pick a date</h3>
  <Calendar 
    selected={date} 
    onSelect={setDate}
    className="w-full" // Minimal barebones calendar
  />
</div>
```

### 3. Overriding Theme Variables
This library uses the **NDP Namespace** (`-ndp`) for all Tailwind classes to ensure zero CSS conflicts. To globally change colors or border radius, override these CSS variables in your global CSS:

```css
:root {
  /* Core Backgrounds */
  --background-ndp: #ffffff;
  
  /* Make the primary selection color a minimal dark gray */
  --primary-ndp: #171717; 
  --primary-foreground-ndp: #ffffff;
  
  /* Make hover states subtle */
  --accent-ndp: #f5f5f5;
  --accent-foreground-ndp: #171717;
  
  /* Make borders softer */
  --border-ndp: #f0f0f0;
  
  /* Round the calendar corners heavily */
  --radius-ndp: 1rem; 
}
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/cool-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## 📄 License

MIT © 2026. Built with ❤️ for the Nepali dev community.
