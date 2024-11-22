// import { DateTime } from "luxon";

// export const dateFormat = (date: DateTime) => {

//   if (!date || !date.isValid) {
//     return '';
//   }

//   return date.toFormat('dd LLLL yyyy HH:mm', { locale: 'tr-TR' });

// }
// export const relativeTimeFormatting = (isoDate: string | DateTime): string => {
//   if (typeof isoDate === 'string') {
//     return DateTime.fromISO(isoDate).toRelative({ locale: 'tr-TR' }) ?? '';
//   } else if (typeof isoDate === 'object') {
//     return isoDate.toRelative({ locale: 'tr-TR' }) ?? '';
//   }

//   return '';

// };
