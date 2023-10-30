export const getDownloadLink = (
  fromDate: string,
  toDate: string,
  entityAddress: string
) => {
  return `/api/export/transactions?fromDate=${fromDate}&toDate=${toDate}&entityAddress=${entityAddress}`
}
