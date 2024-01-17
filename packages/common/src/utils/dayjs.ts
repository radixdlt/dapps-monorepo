import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import localeData from 'dayjs/plugin/localeData'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc)
dayjs.extend(localeData)
dayjs.extend(customParseFormat)

export default dayjs
