import { IMessage, ON_ICON, OFF_ICON, TARGET_SITE } from "../types"
import { getSetting, setSetting } from "./settings"
import getHtml from "./getHtml"

const initExtension = async (tabId: number) => {
  const prevState = await getSetting(tabId.toString())
  if (prevState[tabId] === "ON") {
    const message: IMessage = {
      message: prevState[tabId],
    }
    chrome.action.setIcon({ tabId, path: ON_ICON })
    chrome.tabs.sendMessage(tabId, message)
  }
}

const changeExtensionStatus = async (tabId: number) => {
  // const prevState = await getSetting(tabId.toString())
  // const nextState = prevState[tabId] === "ON" ? "OFF" : "ON"
  // const path = nextState === "ON" ? ON_ICON : OFF_ICON
  // await setSetting(tabId.toString(), nextState)
  // chrome.action.setIcon({ tabId, path })
  // const message: IMessage = {
  //   message: nextState,
  // }
  // chrome.tabs.sendMessage(tabId, message)
}

// Set all extension's badge to OFF in the target websites when extension installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: TARGET_SITE }, function (tabs) {
    tabs.forEach(async (tab) => {
      const tabId = tab.id!
      await setSetting(tabId.toString(), "OFF")
      chrome.action.setIcon({ tabId, path: OFF_ICON })
    })
  })
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
