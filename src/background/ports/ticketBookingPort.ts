import type { PlasmoMessaging } from "@plasmohq/messaging"

// src/background/index.ts
import { startBooking } from "../index"

type BookingData = {
  seatNo: string
  zone: string
  paymentMethod: string
}

type RequestBody = {
  action: "startBooking"
  data: BookingData
}

type ResponseBody = {
  success: boolean
  message: string
}

const handler: PlasmoMessaging.PortHandler<RequestBody, ResponseBody> = async (
  req,
  res
) => {
  console.log(req, "req")
  const { action, data } = req.body

  if (action === "startBooking") {
    try {
      startBooking(data)
      // Here we would typically send a message to the content script
      // For now, we'll just simulate a successful booking
      console.log("Booking started with data:", data)
      res.send({
        success: true,
        message: "Booking process initiated"
      })
    } catch (error) {
      res.send({
        success: false,
        message: "Failed to start booking process"
      })
    }
  } else {
    res.send({
      success: false,
      message: `Unknown action ${action}`
    })
  }
}

export default handler
