"use client";

import "./globals.css";
 import dotenv from 'dotenv';
 dotenv.config();

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function RootLayout({ children }) {
    console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  return (
    <html lang="en">
      <body>

        <PayPalScriptProvider
          options={{
            clientId:
              process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,

            currency: "USD",
          }}
        >
          {children}
        </PayPalScriptProvider>

      </body>
    </html>
  );
}