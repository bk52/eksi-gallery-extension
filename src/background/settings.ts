export const getSetting = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.session.get(key, function (result) {
      resolve(result)
    })
  })
}

export const setSetting = (key: string, value: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.session.set({ [key]: value }).then(() => {
      resolve(true)
    })
  })
}
