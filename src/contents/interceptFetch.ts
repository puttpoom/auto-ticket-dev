import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  run_at: "document_end",
  matches: ["https://www.allticket.com/*"]
}

const originalFetch = window.fetch

window.fetch = async (...args) => {
  const response = await originalFetch(...args)

  // Check if this is the POST request we are interested in

  const url = args[0]
  console.log(url, "urls")
  const options = args[1]

  if (
    (url as string).includes("https://api.allticket.com/content/check-event") &&
    options?.method === "POST"
  ) {
    const clonedResponse = response.clone() // Clone response to inspect without consuming it

    clonedResponse.json().then((data) => {
      if (data?.success === true) {
        console.log("Success response received. Injecting content...")

        // Inject content or modify the UI as needed
        injectContent()
      }
    })
  }

  return response
}

// Function to inject or manipulate DOM
function injectContent() {
  console.log("Interscrpt req")
}
