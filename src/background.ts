chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidebar-background") {
    port.onMessage.addListener(async (message) => {
      if (message.action === "findElements") {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        console.log(tab.id, "tabs")
        if (tab.id) {
          chrome.scripting
            .executeScript({
              target: { tabId: tab.id },
              func: findElementsInPage
            })
            .then((results) => {
              console.log(results, "results")
              if (results && results[0] && results[0].result && Array.isArray(results[0].result[0])) {
                console.log("elementsFound")
                port.postMessage({
                  action: "elementsFound",
                  elements: results[0].result
                })
              } else {
                console.log("elementsNOTFound")
                port.postMessage({ action: "elementsNOTFound", elements: results[0].result })
              }
            })
        }
      }
    })
  }
})

function findElementsInPage() {
  const elementsToFind = [
    { xpath: '//*[@class="product_label"]', description: "Main Heading" },
    {
      xpath: "//*[contains(@class, 'product-price')]",
      description: "Product Price"
    },
    {
      xpath: "//*[@id='add-to-cart-button']",
      description: "Add to Cart Button"
    }
  ]

  function getElementByXPath(xpath: string) {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
  }

  const foundElements = elementsToFind
    .map((item) => (getElementByXPath(item.xpath) ? item.description : null))
    .filter((item) => item !== null)

  if (Array.isArray(foundElements)) {
    return foundElements
  }

  return ["NULL"]
}
