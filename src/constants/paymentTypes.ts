export const paymentTypes = [
  {
    code: "FULL",
    name: "Full Payment",
    description: "The complete amount is paid at the time of booking or check-in.",
  },
  {
    code: "PARTIAL",
    name: "Partial Payment",
    description: "Only part of the total amount is paid upfront; remaining is paid later.",
  },
  {
    code: "ADVANCE",
    name: "Advance Payment",
    description: "Payment paid in advance to confirm the booking.",
  },
  {
    code: "PENDING",
    name: "Pending Payment",
    description: "Payment is yet to be completed; booking may be provisional.",
  },
  {
    code: "DEPOSIT",
    name: "Security Deposit",
    description: "An upfront deposit held to cover potential damages or additional charges.",
  },
];