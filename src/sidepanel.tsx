import type { PlasmoGetStyle } from "plasmo"
import { useState } from "react"

import { usePort } from "@plasmohq/messaging/hook"

// export const getStyle: PlasmoGetStyle = () => {
//   return {
//     width: "300px",
//     height: "100%",
//     padding: "16px"
//   }
// }

const Sidebar = () => {
  const [seatNo, setSeatNo] = useState("")
  const [zone, setZone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [message, setMessage] = useState("")

  const port = usePort("ticketBookingPort")

  const handleStart = async () => {
    try {
      port.send({
        action: "startBooking",
        data: { seatNo, zone, paymentMethod }
      })

      if (port.data.success) {
        console.log(port.data, "port data")
        setMessage("Booking process started successfully!")
      } else {
        setMessage("Failed to start booking process: " + port.data?.message)
      }
    } catch (error) {
      console.log(error)
      setMessage("An error occurred while starting the booking process.")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ticket Booking</h2>
      <input
        type="text"
        value={seatNo}
        onChange={(e) => setSeatNo(e.target.value)}
        placeholder="Seat Number"
      />
      <input
        type="text"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        placeholder="Zone"
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="">Select Payment Method</option>
        <option value="credit">Credit Card</option>
        <option value="debit">Debit Card</option>
        <option value="paypal">PayPal</option>
      </select>
      <button onClick={handleStart}>Start Booking</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Sidebar
