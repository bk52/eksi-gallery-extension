import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { IEntry } from "../../types"

interface IGallery {
  entryList: IEntry[]
  visible?: boolean
  goPrevPage?: () => void
  goNextPage?: () => void
}

const formatNick = (nick: string | undefined) =>
  nick ? nick.replaceAll(" ", "-") : ""

const Gallery: React.FC<IGallery> = ({
  entryList,
  visible,
  goPrevPage,
  goNextPage,
}) => {
  const [entry, setEntry] = useState<IEntry | undefined>()
  const [entryImages, setEntryImages] = useState<string[] | undefined>()
  const [activeEntry, setActiveEntry] = useState(0)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (entryList.length > 0) setEntry(entryList[0])
  }, [])

  useEffect(() => {
    getEntryImages()
  }, [entry])

  useEffect(() => {
    if (activeEntry > -1 && activeEntry < entryList.length)
      setEntry(entryList[activeEntry])
  }, [activeEntry])

  const getEntryImages = () => {
    setActiveImage(0)
    if (entry && entry.links) {
      const links: string[] = []
      Object.entries(entry.links).forEach(([k, v]) => {
        v.target && v.target != "" ? links.push(v.target) : links.push(k)
      })
      setEntryImages(links)
    } else {
      setEntryImages(undefined)
    }
  }

  const changeEntry = (step: number) => {
    if (activeEntry + step >= entryList.length) goNextPage && goNextPage()
    else if (activeEntry + step < 0) goPrevPage && goPrevPage()
    else setActiveEntry(activeEntry + step)
  }

  const changeImage = (step: number) => {
    if (entryImages) {
      if (activeImage + step >= entryImages.length) setActiveImage(0)
      else if (activeImage + step < 0) setActiveImage(entryImages.length - 1)
      else setActiveImage(activeImage + step)
    }
  }

  return (
    <div className="eg-gallery-modal">
      <div className="eg-gallery-layout">
        {/* Prev Entry Button */}
        <div
          className="eg-gallery-entry-buttons top"
          onClick={() => changeEntry(-1)}
        >
          <i className="fa fa-arrow-up"></i>
        </div>
        {/* Next Entry Button */}
        <div
          className="eg-gallery-entry-buttons bottom"
          onClick={() => changeEntry(1)}
        >
          <i className="fa fa-arrow-down"></i>
        </div>
        {/* Entry Info */}
        {entry && <EntryInfo entry={entry} />}
        {/* Image */}
        {entryImages ? (
          <EntryImage
            imageUrl={entryImages[activeImage]}
            onNextClick={() => changeImage(1)}
            onPrevClick={() => changeImage(-1)}
          />
        ) : (
          <div className="eg-gallery-no-image">
            <div className="eg-gallery-active-image-loading">
              <i className="fa fa-file-image-o fa-2x"></i>
              <div>Bu entry görsel içermiyor</div>
            </div>
          </div>
        )}
        {/* Image Steps */}
        <div className="eg-gallery-image-steps">
          {entryImages &&
            entryImages.map((item, index) => (
              <div
                key={index}
                className={`step ${index === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
              ></div>
            ))}
        </div>
        {/* Entry Content */}
        <div
          className="eg-gallery-entry-container"
          dangerouslySetInnerHTML={{ __html: entry?.content ?? "" }}
        ></div>
      </div>
    </div>
  )
}

const EntryInfo: React.FC<{ entry: IEntry }> = ({ entry }) => {
  const getProfileLink = (author: string): string => {
    return `https://${window.location.hostname}/biri/${formatNick(author)}`
  }

  return (
    <div className="eg-gallery-entry-detail">
      <img className="eg-gallery-author-avatar" src={entry?.avatarUrl} />
      <div>
        <a
          href={getProfileLink(entry?.author)}
          target={"_blank"}
          rel="noopener noreferrer"
          className="eg-gallery-entry-author"
        >
          {entry?.author}
        </a>
        <div className="eg-gallery-entry-date">
          <i className="fa fa-calendar"></i> {`${" "} ${entry?.entryDateStr}`}
        </div>
      </div>
    </div>
  )
}

const EntryImage: React.FC<{
  imageUrl: string
  onNextClick?: () => void
  onPrevClick?: () => void
}> = ({ imageUrl, onNextClick, onPrevClick }) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  )

  useEffect(() => {
    setStatus("loading")
  }, [imageUrl])

  return (
    <div className="eg-gallery-image-container">
      {/* Prev Image Button */}
      <div
        className="eg-gallery-image-buttons"
        onClick={() => onPrevClick && onPrevClick()}
      >
        <i className="fa fa-angle-left"></i>
      </div>
      {status === "loading" && (
        <div className="eg-gallery-active-image-loading">
          <i className="fa fa-spinner fa-2x"></i>
          <div>Yükleniyor</div>
        </div>
      )}
      {status === "error" && (
        <div className="eg-gallery-active-image-loading">
          <i className="fa fa-frown-o fa-2x"></i>
          <div>Bağlantı bulunamadı ya da desteklenmiyor</div>
          <a
            href={imageUrl}
            target={"_blank"}
            rel="noopener noreferrer"
            style={{
              color: "#81c14b",
              textDecoration: "none",
            }}
          >
            Bir de sen dene
          </a>
        </div>
      )}
      <a
        href={imageUrl}
        target={"_blank"}
        rel="noopener noreferrer"
        style={{
          display: status === "loaded" ? "block" : "none",
        }}
      >
        <img
          className="eg-gallery-active-image"
          src={imageUrl}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      </a>
      {/* Next Image Button */}
      <div
        className="eg-gallery-image-buttons"
        onClick={() => onNextClick && onNextClick()}
      >
        <i className="fa fa-angle-right"></i>
      </div>
    </div>
  )
}

const EksiGallery = (props: IGallery) => {
  ReactDOM.render(
    <Gallery
      entryList={props.entryList}
      visible={props.visible}
      goPrevPage={props.goPrevPage}
      goNextPage={props.goNextPage}
    />,
    document.getElementById("eg-gallery-modal")
  )
}

export default EksiGallery
