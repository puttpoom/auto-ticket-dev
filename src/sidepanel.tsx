import { useEffect, useState } from "react"

import "./style.css"

const Sidebar = () => {
  const [searching, setSearching] = useState(false)
  const [foundElements, setFoundElements] = useState<string[]>([])
  const [port, setPort] = useState<chrome.runtime.Port | null>(null)

  useEffect(() => {
    const connectPort = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (tab.id) {
        const newPort = chrome.runtime.connect({ name: "sidebar-background" })
        setPort(newPort)

        newPort.onMessage.addListener((message) => {
          if (message.action === "elementsFound") {
            setFoundElements(message.elements)
            setSearching(false)
          } else if (message.action === "elementsNOTFound") {
            console.log("is Array")
            setFoundElements(["NOTFOUND"])
            setSearching(false)
          }
        })
      }
    }

    connectPort()

    return () => {
      if (port) {
        port.disconnect()
      }
    }
  }, [])

  const findElements = () => {
    if (port) {
      setSearching(true)
      setFoundElements([])
      port.postMessage({ action: "findElements" })
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chrome Extension Sidebar</h1>
      <button
        onClick={findElements}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        disabled={!port || searching}>
        {searching ? "Searching..." : "Find Elements"}
      </button>
      {foundElements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Found Elements:</h2>
          <ul className="list-disc pl-5">
            {foundElements.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar
