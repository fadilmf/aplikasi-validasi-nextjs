export default function checkIsValidAt(d: any) {
  let lastDate = d?.validAt;
  if (d?.validAt) {
    lastDate = d?.validAt;
  } else {
    lastDate = d?.createdAt;
  }
  return lastDate;
}
