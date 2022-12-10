import { getSetting, setSetting } from "../background/settings"
import { ViewMode, ON_ICON, OFF_ICON, TARGET_SITE, IMessage } from "../types"
let activeTabId = -1

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const { id, url } = tabs[0]
  if (url && url.indexOf(TARGET_SITE) > -1) {
    url.indexOf("https://eksisozluk.com/biri") > -1 ? hideExtension() : init(id)
  } else {
    hideExtension()
  }
})

const init = async (tabId?: number) => {
  if (tabId) {
    activeTabId = tabId
    const prevState = await getSetting(tabId.toString())
    const mode = await getSetting("mode")
    setStatus(prevState[tabId])
    mode["mode"] === "INLINE" ? setMode("INLINE") : setMode("GALLERY")
  }
}

const setStatus = (status: "ON" | "OFF") => {
  const onOffButton = document.getElementById("activeButton")
  if (onOffButton) {
    status === "ON"
      ? onOffButton.classList.add("active")
      : onOffButton.classList.remove("active")
  }
}

const setMode = (mode: ViewMode) => {
  const galleryButton = document.getElementById("galleryMode")
  const inlineMode = document.getElementById("inlineMode")
  if (mode === "GALLERY") {
    inlineMode!.style.display = "none"
    galleryButton!.style.display = "flex"
  } else if (mode === "INLINE") {
    galleryButton!.style.display = "none"
    inlineMode!.style.display = "flex"
  }
}

const hideExtension = () => {
  const extensionDiv = document.getElementById("extension")
  const noExtensionDiv = document.getElementById("no-extension")
  if (extensionDiv) extensionDiv.style.display = "none"
  if (noExtensionDiv) noExtensionDiv.style.display = "flex"
}

const onActiveClick = async () => {
  if (activeTabId > 0) {
    const prevState = await getSetting(activeTabId.toString())
    const nextState = prevState[activeTabId] === "ON" ? "OFF" : "ON"
    await setSetting(activeTabId.toString(), nextState)
    //Change extension icon
    const path = nextState === "ON" ? ON_ICON : OFF_ICON
    chrome.action.setIcon({ tabId: activeTabId, path })
    setStatus(nextState)
    // Send to content script
    const message: IMessage = {
      message: nextState,
    }
    chrome.tabs.sendMessage(activeTabId, message)
  }
}

const onModeClick = () => {}

document
  .getElementById("activeButton")!
  .addEventListener("click", onActiveClick)

export {}
