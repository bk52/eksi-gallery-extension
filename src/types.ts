type MessageType =
  | "ON"
  | "OFF"
  | "GET_CONTENT"
  | "GET_CONTENT_RESULT"
  | "CHANGE_MODE"
export type ViewMode = "INLINE" | "GALLERY"

export enum UploadSites {
  Eksi = "https://soz.lk",
  EksiUp = "https://eksiup.com/",
  Ibb = "https://ibb.co",
}

export interface IMessage {
  message: MessageType
  data?: any
  error?: boolean
}

export interface ILink {
  [origin: string]: {
    target?: string
  }
}

export interface IScrapLink {
  entryId: number
  url: string
  html?: string
}

export interface IEntry {
  entryId: number
  author: string
  authorId?: number
  isPinned?: boolean
  isPinnedonProfile?: boolean
  content?: string
  isFavorite?: boolean
  favoriteCount?: number
  commentCount?: number
  avatarUrl?: string
  entryDateStr?: string
  createdDate?: Date
  editedDate?: Date
  links?: ILink
}

export const ON_ICON = "images/eksi48.png"
export const OFF_ICON = "images/eksi48off.png"
export const TARGET_SITES = [
  "https://eksisozluk.com/",
  "https://eksisozluk2023.com/",
]
