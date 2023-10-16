export default function dateTime(date?: Date) {
  const currentDateTime: Date = date || new Date();

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = currentDateTime.getDate();
  const month = currentDateTime.getMonth() + 1;
  const monthIndex = currentDateTime.getMonth();
  const year = currentDateTime.getFullYear();
  const currentTime = currentDateTime.toLocaleTimeString();

  const formattedDatetime =
    day + " " + monthNames[monthIndex] + " " + year + ", " + currentTime;

  return formattedDatetime;
}
