"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((response) => {
        console.log("Response object:", response); // valid here
        return response.json();
      })
      .then((json) => {
        console.log("JSON data:", json);
        setData(json);
      })
      .catch((err) => console.error("Fetch error:", err));

    console.log("Outside fetch:", data); // runs BEFORE data loads
  }, []);

  return (
    <div>
      <h1>Page 2</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Page;

