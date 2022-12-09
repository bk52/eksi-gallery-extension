import { IMessage } from "../types"
import { getSetting, setSetting } from "./settings"
import getHtml from "./getHtml"

const TARGET_SITE = "https://eksisozluk.com/"

const initExtension = async (tabId: number) => {
  const prevState = await getSetting(tabId.toString())
  await chrome.action.setBadgeText({
    tabId,
    text: prevState[tabId] === "ON" ? "😎" : "",
  })
  await chrome.action.setBadgeBackgroundColor({ color: "#ffffff00" })
  if (prevState[tabId] === "ON") {
    const message: IMessage = {
      message: prevState[tabId],
    }
    chrome.tabs.sendMessage(tabId, message)
  }
}

const changeExtensionStatus = async (tabId: number) => {
  const prevState = await getSetting(tabId.toString())
  const nextState = prevState[tabId] === "ON" ? "OFF" : "ON"
  await setSetting(tabId.toString(), nextState)
  await chrome.action.setBadgeText({
    tabId,
    text: nextState === "ON" ? "😎" : "",
  })
  await chrome.action.setBadgeBackgroundColor({ color: "#ffffff00" })
  const message: IMessage = {
    message: nextState,
  }
  chrome.tabs.sendMessage(tabId, message)
}

// Set all extension's badge to OFF in the target websites when extension installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: TARGET_SITE }, function (tabs) {
    tabs.forEach(async (tab) => {
      const tabId = tab.id!
      await setSetting(tabId.toString(), "OFF")
      await chrome.action.setBadgeText({
        tabId,
        text: "",
      })
    })
  })
})

// When extension button clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url!.startsWith(TARGET_SITE)) {
    changeExtensionStatus(tab.id!)
  }
})

// When page loaded
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url!.startsWith(TARGET_SITE) && changeInfo.status === "complete") {
    initExtension(tab.id!)
  }
})

chrome.runtime.onMessage.addListener(function (
  request: IMessage,
  sender,
  sendResponse
) {
  if (request.message === "GET_CONTENT") {
    getHtml(request.data)
      .then((res) => {
        chrome.tabs.sendMessage(sender.tab!.id!, {
          message: "GET_CONTENT_RESULT",
          data: res,
        })
      })
      .catch((err) =>
        chrome.tabs.sendMessage(sender.tab!.id!, {
          message: "GET_CONTENT_RESULT",
          data: { err },
          error: true,
        })
      )
  }
  return true
})

export {}
