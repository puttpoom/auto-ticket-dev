import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  run_at: "document_end",
  matches: ["https://www.allticket.com/*"]
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "DOM is fully loaded and parsed, but not waiting for images or CSS."
  )
  // Your DOM manipulation logic here
})

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  console.log("DOM is ready from the start.")
  // Your DOM manipulation logic here if DOM is already in 'interactive' state
}
