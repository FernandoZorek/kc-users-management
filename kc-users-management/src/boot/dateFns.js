import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.provide('formatDate', format)
  app.provide('subDays', subDays)
});
