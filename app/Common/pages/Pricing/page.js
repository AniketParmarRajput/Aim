"use client"

import React, { useMemo, useState } from "react"

const Page = () => {
  const [value, setValue] = useState({
    number: "",
    gst: "",
  })

  const handle1 = (e) => {
    const { name, value } = e.target
    setValue((pre) => ({
      ...pre,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted Values:", value)
  }

  // Memoized calculation
  const cal = useMemo(() => {
    const start = performance.now()
    console.log("➡️ Calculation started")

    const p = parseFloat(value.number || 0)
    const g = parseFloat(value.gst || 0)

    const rate = p * g

    const end = performance.now()


     console.log(rate)
     console.log(end);
  }, [value])

  return (
    <>
      <form className="text-red-500" onSubmit={handleSubmit}>
        <input
          name="number"
          value={value.number}
          placeholder="number"
          onChange={handle1}
        />

        <input
          name="gst"
          value={value.gst}
          placeholder="gst"
          onChange={handle1}
        />

        <button type="submit">submit</button>
        <br />

        {cal}
      </form>
    </>
  )
}

export default Page

