import { Notify } from "quasar";
import _ from "lodash";

const MIN_DELAY_SEC = 1;
const MAX_DELAY_SEC = 20;

const NOTIFICATIONS = [
  {
    message: 'Необходимо согласование ОТК',
    caption: 'Нагладная <b>123-456789/220</b> отработана. Пожалуйста, согласуйте.',
  },
  {
    message: 'Заказ поступил в работу',
    caption: 'В систему добавлен новый заказ <b>ЗИП-500</b>.',
  },
  {
    message: 'Заказ завершён!',
    caption: 'Завершены работы по заказу <b>ЗИП-500</b>.',
  },
  {
    message: 'Накладная согласована!',
    caption: 'Нагладная <b>123-456789/220</b> согласована ОТК.',
  },
]

function sendNotification() {
  const notification = _.sample(NOTIFICATIONS)
  Notify.create({
    ...notification,
    progress: true,
    position: 'bottom-right',
    color: 'deep-orange-10',
    icon: 'info',
    iconSize: 'md',
    multiLine: true,
    html: true,
    actions: [{label: 'Открыть', color: 'deep-orange-2',}]
  });

  setTimeout(sendNotification, getDelay());
}

function getDelay() {
  return _.random(MIN_DELAY_SEC, MAX_DELAY_SEC) * 1000;
}

export function runNotifications() {
  // sendNotification() ////////////
  // setTimeout(sendNotification, getDelay());
}
