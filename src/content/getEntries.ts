import { IEntry, ILink, UploadSites } from "../types"

const getEntries = (): IEntry[] => {
  const entries: IEntry[] = []
  try {
    // Get page content
    const domEntryList = document.getElementById("entry-item-list")?.children

    if (domEntryList) {
      for (const domEntry of domEntryList) {
        // scrap every entry in the page
        if (domEntry.tagName.toUpperCase() === "LI")
          entries.push(getEntry(domEntry))
      }
    }
  } catch (e) {
    console.error(e)
  }
  return entries
}

const supportedWebsites = Object.values(UploadSites)

const getEntry = (domEntry: Element): IEntry => {
  const content = domEntry.getElementsByClassName("content")[0].innerHTML
  const linksInEntry = domEntry.querySelectorAll(".content > a")
  let links: ILink | undefined
  if (linksInEntry.length > 0) {
    links = {}
    Array.from(linksInEntry).forEach((link) => {
      // if (link instanceof HTMLAnchorElement) links![link.href] = {}
      if (link instanceof HTMLAnchorElement)
        supportedWebsites.forEach((website) => {
          if (link.href.includes(website)) links![link.href] = {}
        })
    })
  }

  // let createdDate: Date | undefined, editedDate: Date | undefined
  let entryDateStr = ""
  try {
    entryDateStr = domEntry.querySelector(".entry-date")?.innerHTML ?? ""

    // if (entryDate?.includes("~")) {
    //   const [created, updated] = entryDate.split("~")
    //   createdDate = dateTimeConverter(created)
    //   if (updated.includes(".")) editedDate = dateTimeConverter(updated)
    //   else {
    //     const dateStr = created.split(" ")[0]
    //     editedDate = dateTimeConverter(`${dateStr.trim()} ${updated.trim()}`)
    //   }
    // }
  } catch (e) {
    console.error(e)
  }

  const entry: IEntry = {
    entryId: parseInt(domEntry.getAttribute("data-id") ?? "-1"),
    author: domEntry.getAttribute("data-author") ?? "",
    avatarUrl: domEntry.querySelector("img")?.src,
    authorId: parseInt(domEntry.getAttribute("data-author-id") ?? "-1"),
    links,
    entryDateStr,
    content,
    // createdDate,
    // editedDate,
    // isFavorite: domEntry.getAttribute("data-isfavorite") === "true",
    // favoriteCount: parseInt(
    //   domEntry.getAttribute("data-favorite-count") ?? "0"
    // ),
    // commentCount: parseInt(domEntry.getAttribute("data-comment-count") ?? "0"),
    // isPinnedonProfile:
    //   domEntry.getAttribute("data-ispinnedonprofile") === "true",
    // isPinned: domEntry.getAttribute("data-ispinned") === "true",

    // avatarUrl?: string
    // createdDate?: Date
    // editedDate?: Date
  }

  return entry
}

export default getEntries
