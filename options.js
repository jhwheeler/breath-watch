function saveOptions () {
  const interval = document.getElementById('interval').value
  const duration = document.getElementById('duration').value

  chrome.storage.sync.set({
    awarenessReminderInterval: interval,
    awarenessReminderDuration: duration,
  }, () => {
    const status = document.getElementById('status')
    status.textContent = 'Options saved'

    setTimeout(() => {
      status.textContent = ''
    }, 2000)
  });
}

function restoreOptions () {
  const defaultInterval = 60
  const defaultDuration = 1

  chrome.storage.sync.get({
    awarenessReminderInterval: defaultInterval,
    awarenessReminderDuration: defaultDuration,
  }, items => {
    document.getElementById('interval').value = items.awarenessReminderInterval
    document.getElementById('duration').value = items.awarenessReminderDuration
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
