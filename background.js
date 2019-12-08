const defaultInterval = 60
const defaultDuration = 1

const useOptions = callback => chrome.storage.sync.get({
    awarenessReminderInterval: defaultInterval,
    awarenessReminderDuration: defaultDuration,
  }, options => callback(options))

function clearPreviousNotifications () {
  chrome.notifications.getAll(notifications => {
    const ids = Object.keys(notifications)
    ids.forEach(id => {
      if (id.includes('breath_watch_reminder')) {
        chrome.notifications.clear(id)
      }
    })
  })
}

function createNotification ({ id, requireInteraction }) {
  clearPreviousNotifications()

  const notificationOptions = {
    type: "basic",
    title: "Watch your breath",
    message: "It's time to become mindful of your breath.",
    iconUrl: "images/get_started128.png",
    requireInteraction,
  }

  chrome.notifications.create(id, notificationOptions)
}

function triggerReminder () {
  const timeNow = Date.now()
  const id = `breath_watch_reminder_${timeNow}`
  let timeToPersist = defaultDuration * 60000

  useOptions(options => {
    if (options) timeToPersist = parseInt(options.awarenessReminderDuration, 10)

    const requireInteraction = timeToPersist !== 0
    createNotification({ id, requireInteraction })

    if (timeToPersist < 1) return
    setTimeout(() => chrome.notifications.clear(id), timeToPersist)
  })
}

function createInterval ({ trigger }) {
  let periodInMinutes = defaultInterval
  useOptions(options => {
    if (options) periodInMinutes = parseInt(options.awarenessReminderInterval, 10)
    chrome.alarms.create("BreathWatch Alert", { periodInMinutes })

    if (trigger) triggerReminder()
  })
}

chrome.runtime.onInstalled.addListener(() => createInterval({ trigger: true }))
chrome.runtime.onStartup.addListener(() => createInterval({ trigger: true}))
chrome.alarms.onAlarm.addListener(() => triggerReminder())

chrome.storage.onChanged.addListener(changes => {
  const valuesToWatch = ['awarenessReminderInterval', 'awarenessReminderDuration']

  const filteredChanges = valuesToWatch.reduce((obj, key) => {
    const filtered = {
      ...obj,
      [key]: changes[key]
    }

    return changes[key] ? filtered : obj
  }, {})

  if (filteredChanges) {
    createInterval({ trigger: false })
  }
})
