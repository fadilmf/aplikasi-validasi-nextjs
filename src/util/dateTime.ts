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

  let hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();

  // Menentukan AM atau PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Ubah ke format 12
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}
    ${ampm}`;

  const formattedDatetime =
    day + " " + monthNames[monthIndex] + " " + year + ", " + formattedTime;

  return formattedDatetime;
}
