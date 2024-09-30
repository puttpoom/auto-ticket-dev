import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  run_at: "document_end",
  matches: ["https://www.allticket.com/*"]
}

// Function to find an element by XPath
function getElementByXpath(path: string): Element | null {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as Element
}

// Function to wait for an element to appear
function waitForElement(xpath: string, timeout = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const element = getElementByXpath(xpath)
      if (element) {
        clearInterval(interval)
        resolve(element)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error(`Timeout waiting for element: ${xpath}`))
      }
    }, 100)
  })
}

// Function to click an element
async function clickElement(xpath: string) {
  const element = await waitForElement(xpath)
  ;(element as HTMLElement).click()
}

// Function to scroll to an element
async function scrollToElement(xpath: string) {
  const element = await waitForElement(xpath)
  element.scrollIntoView({ behavior: "smooth", block: "center" })
  // Wait a bit for the scroll to complete
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// Main function to execute the booking flow
async function executeBookingFlow(data: {
  seatNo: string
  zone: string
  paymentMethod: string
}) {
  try {
    // 1. Enter the concert site or Refresh current window
    // window.location.reload()

    // Wait for the page to load after refresh

    // await new Promise((resolve) => setTimeout(resolve, 3000))

    // 2. Wait and click Buy now button
    await clickElement('//button[@class="btn btn-atk-primary" and not(@id)]')

    await clickElement('//label[@class="custom-control-label"]')

    await clickElement('//span[text()=" Confirm "]')

    await clickElement('//label[text()=" Show Date : 2 November 2024 18:00 "]')

    await clickElement('//area[@class="p_SF1"]')
    // 3. Page will redirect the user to zone page
    // Wait for the zone page to load
    await waitForElement("//h1[contains(text(), 'Select Zone')]", 15000)

    // 4. Click on zone area
    await clickElement(
      `//div[contains(@class, 'zone') and contains(text(), '${data.zone}')]`
    )

    // Scroll down the site
    await scrollToElement("//div[contains(@class, 'seat-selection')]")

    // Click on the seat
    await clickElement(
      `//div[contains(@class, 'seat') and @data-seat-number='${data.seatNo}']`
    )

    // Fill in payment method
    const paymentSelect = (await waitForElement(
      "//select[@name='payment']"
    )) as HTMLSelectElement
    paymentSelect.value = data.paymentMethod

    // Submit the form
    await clickElement("//button[@type='submit']")

    console.log("Booking flow completed successfully")
  } catch (error) {
    console.error("Error in booking flow:", error)
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name === "startBooking") {
    console.log(message)
    executeBookingFlow(message.body)
    sendResponse({ success: true })
  }
})

console.log("Ticket booking content script loaded")
