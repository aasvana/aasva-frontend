export type GuideStep = {
  title: string;
  body: string;
};

export type Guide = {
  id: string;
  module: string;
  title: string;
  description: string;
  minutes: number;
  steps: GuideStep[];
};

export const GUIDE_MODULES = [
  "Getting Started",
  "Store",
  "Inventory",
  "Accounting",
  "Travel",
  "Delivery",
] as const;

export const GUIDES: Guide[] = [
  {
    id: "setup-business",
    module: "Getting Started",
    title: "Setting up your business",
    description:
      "Configure your company profile, branding and accounting preferences before you start transacting.",
    minutes: 10,
    steps: [
      {
        title: "Complete your business profile",
        body: "Go to Settings → Company and enter your business name, legal entity type, address, tax ID and default currency. This information is printed on every invoice, estimate and delivery note you issue.",
      },
      {
        title: "Set up accounting preferences",
        body: "Open Accounting → Settings to choose your fiscal year start, default tax rates and invoice numbering. Consistent numbering (e.g. INV-0001) keeps your records audit-ready from day one.",
      },
      {
        title: "Add your brand",
        body: "Upload your logo and set invoice design under Accounting → Settings → Invoice Settings. A branded look makes your documents look professional for customers and suppliers.",
      },
      {
        title: "Invite your team",
        body: "Add team members so each person works on what they own. Assign clear responsibilities for sales, accounting and delivery so every action is traceable in the audit trail.",
      },
    ],
  },
  {
    id: "setup-outlets",
    module: "Store",
    title: "Setting up multiple outlets",
    description:
      "Create outlets, assign products and track sales per location.",
    minutes: 8,
    steps: [
      {
        title: "Create your outlets",
        body: "Go to Store → Outlets and add each physical or online location. Give every outlet a name, address and assign it an account so revenue is recorded to the right place.",
      },
      {
        title: "Assign products to outlets",
        body: "Add products under Store → Products, then choose which outlets stock them. You can maintain a shared price list or set outlet-specific prices.",
      },
      {
        title: "Track sales per outlet",
        body: "Every order you raise is tagged to an outlet. Use the POS overview and sales reports to compare performance across locations and spot your best performers.",
      },
      {
        title: "Keep stock outlet-aware",
        body: "Enable stock tracking per product so each outlet maintains its own inventory count. This is the foundation for transfers between outlets.",
      },
    ],
  },
  {
    id: "stock-between-outlets",
    module: "Inventory",
    title: "Managing stock between outlets",
    description:
      "Move stock safely between outlets and keep counts accurate.",
    minutes: 12,
    steps: [
      {
        title: "Enable stock tracking",
        body: "Turn on inventory tracking for the products you want to monitor. Without tracking enabled, quantities won't be deducted when you sell.",
      },
      {
        title: "Transfer stock between outlets",
        body: "Use Stock Transfers to move items from one outlet to another. Record the source and destination outlet, and the transfer updates both counts at once.",
      },
      {
        title: "Adjust stock when needed",
        body: "Record Stock Adjustments for damaged, lost or returned goods. Each adjustment is logged in the audit trail so discrepancies stay explainable.",
      },
      {
        title: "Watch low-stock alerts",
        body: "Check the Low Stock page to see products approaching their reorder level across outlets, and top them up before you run out.",
      },
    ],
  },
  {
    id: "invoice-to-payment",
    module: "Accounting",
    title: "Complete invoice-to-payment workflow",
    description:
      "From estimate to reconciled payment in a few steps.",
    minutes: 15,
    steps: [
      {
        title: "Send an estimate",
        body: "Create an estimate for your customer. Once they approve it, convert the estimate into an invoice with one click — all line items carry over.",
      },
      {
        title: "Issue the invoice",
        body: "Finalise the invoice and send it. The invoice shows the amount due, tax and any outstanding balance on the customer's account.",
      },
      {
        title: "Record the payment",
        body: "When money arrives, log a receipt against the invoice. The outstanding balance updates automatically and the payment appears in your reports.",
      },
      {
        title: "Handle returns with credit notes",
        body: "For returns or partial refunds, raise a credit note and apply it to the invoice. This keeps the customer account accurate.",
      },
      {
        title: "Reconcile and review",
        body: "Reconcile payments against your bank transactions, then review Profit & Loss and Accounts Receivable reports to see how your business is performing.",
      },
    ],
  },
  {
    id: "travel-itinerary",
    module: "Travel",
    title: "Creating and sending a travel itinerary",
    description:
      "Turn an enquiry into a polished, sendable itinerary.",
    minutes: 14,
    steps: [
      {
        title: "Capture the customer and enquiry",
        body: "Add a customer record and log the enquiry with their destination, dates and preferences. This becomes the starting point of the trip.",
      },
      {
        title: "Build the itinerary",
        body: "Create an itinerary and add services from your suppliers — hotels, flights, transport and activities — day by day.",
      },
      {
        title: "Create the booking",
        body: "Once the itinerary is confirmed, create a booking against the chosen supplier and service so inventory is committed.",
      },
      {
        title: "Generate the confirmation voucher",
        body: "Produce a confirmation voucher with the itinerary summary, supplier details and traveller information to hand to the customer.",
      },
      {
        title: "Send the itinerary",
        body: "Share the final itinerary with the customer and log the communication on their record, so the whole conversation stays in one place.",
      },
    ],
  },
  {
    id: "delivery-operations",
    module: "Delivery",
    title: "Setting up delivery operations",
    description:
      "Zones, charges, partners and dispatch — ready to ship.",
    minutes: 10,
    steps: [
      {
        title: "Define your delivery zones",
        body: "Go to Delivery → Delivery Zones and group pincodes into zones. Each zone carries its own delivery time and base charge.",
      },
      {
        title: "Set up delivery charges",
        body: "Create charge rules per zone by weight or distance. Delivery fees are then calculated automatically when you raise a delivery.",
      },
      {
        title: "Add delivery partners",
        body: "Add partners under Delivery → Delivery Partners with their vehicle type, service zones and commission. Mark them active to make them assignable.",
      },
      {
        title: "Configure dispatch settings",
        body: "In Delivery → Settings choose manual or auto-assign dispatch, enable COD, live tracking and the notifications you send customers.",
      },
      {
        title: "Dispatch your first delivery",
        body: "Create a delivery, assign a partner from the Dispatch page, and track it through to delivered. Delivery activity is recorded in the audit trail.",
      },
    ],
  },
];
