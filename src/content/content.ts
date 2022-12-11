import { IEntry, IMessage, IScrapLink, ViewMode } from "../types"
import getEntries from "./getEntries"
import Alert from "./components/Alert"
import PreviewImage from "./components/PreviewImage"
import parser from "./parser"
import EksiGallery from "./components/Gallery"

let entries: IEntry[] | undefined
let mode: ViewMode = "GALLERY"
let sendedLink = 0
let receivedLink = 0
let prevPageButton: HTMLAnchorElement | undefined,
  nextPageButton: HTMLAnchorElement | undefined

try {
  prevPageButton = document.querySelectorAll(
    ".pager > .prev"
  )[0] as HTMLAnchorElement
  nextPageButton = document.querySelectorAll(
    ".pager > .next"
  )[0] as HTMLAnchorElement
} catch (e) {
  console.error(e)
}

const goNextPage = () => nextPageButton && nextPageButton.click()
const goPrevPage = () => prevPageButton && prevPageButton.click()

chrome.runtime.onMessage.addListener(function (
  request: IMessage,
  sender,
  sendResponse
) {
  if (request.message === "ON") {
    mode = request.data
    sendedLink = 0

    Alert.show("🚀 Resimler yükleniyor...")

    entries = getEntries()

    entries.forEach((entry) => {
      const { links, entryId } = entry
      if (links) {
        Object.entries(links).forEach((link) => {
          const message: IMessage = {
            message: "GET_CONTENT",
            data: {
              entryId,
              url: link[0],
            },
          }
          chrome.runtime.sendMessage(message)
          sendedLink += 1
        })
      }
    })
  } else if (request.message === "OFF") {
    window.location.reload()
  } else if (request.message === "CHANGE_MODE") {
    window.location.reload()
  }
})

chrome.runtime.onMessage.addListener(function (
  request: IMessage,
  sender,
  sendResponse
) {
  if (request.message === "GET_CONTENT_RESULT") {
    if (request.error) {
      console.error(request.message)
    } else {
      receivedLink += 1
      const scrapLink: IScrapLink = request.data
      const entry = entries?.filter((e) => e.entryId === scrapLink.entryId)[0]
      if (entry) {
        const targetLink = parser(scrapLink)
        entry.links![scrapLink.url].target = targetLink

        if (mode === "INLINE") {
          const ENTRYDIV = document.querySelector(
            `li[data-id="${entry.entryId}"]`
          )
          if (ENTRYDIV) {
            ENTRYDIV.insertBefore(PreviewImage(targetLink), ENTRYDIV.firstChild)
          }
        } else if (
          entries &&
          mode === "GALLERY" &&
          receivedLink === sendedLink
        ) {
          let GalleryDiv = document.getElementById("eg-gallery-modal")
          if (!GalleryDiv) {
            GalleryDiv = document.createElement("div")
            GalleryDiv.id = "eg-gallery-modal"
            document.body.appendChild(GalleryDiv)
          }
          const MainPageDiv = document.getElementsByTagName("body")[0]
          if (MainPageDiv) {
            MainPageDiv.style.height = "100vh"
            MainPageDiv.style.overflow = "hidden"
          }
          EksiGallery({
            entryList: entries,
            visible: true,
            goNextPage,
            goPrevPage,
          })
        }
      }
    }
  }
})

export {}
