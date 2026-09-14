import { z } from "zod";

const stripHtml = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>|<\/div>|<\/li>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();


const travellerSchema = z.object({
  name: z.string().min(1, "Traveller name is required"),
  age: z.string().min(1, "Age is required").refine((v) => {
    const n = Number(v);
    return !isNaN(n) && n >= 0 && n <= 120;
  }, "Age must be between 0 and 120"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
});

const hotelSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  hotelName: z.string().min(1, "Hotel name is required"),
  mealType: z.string().min(1, "Meal type is required"),
  room: z.string().min(1, "Room number is required"),
  roomCategory: z.string().min(1, "Room category is required"),
  maxOccupancy: z.string().min(1, "Max occupancy is required"),
  adults: z.string().min(1, "Adults count is required"),
  children: z.string().min(1, "Children count is required"),
  extraMattress: z.string().min(1, "Extra mattress count is required"),
  checkinDate: z.date({ required_error: "Check-in date is required" }),
  checkoutDate: z.date({ required_error: "Check-out date is required" }),
});

const itinerarySchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  subject: z.string().min(1, "Subject is required"),
  itinerary: z.string().min(1, "Itinerary description is required"),
});

export const confirmationVoucherSchema = z.object({
  // Step 1 - Customer Details
  customerName: z.string().min(1, "Customer name is required"),
  mobileNo: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  emailAddress: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  companyName: z.string(),
  agentName: z.string(),
  journeyDate: z.date({ required_error: "Journey date is required" }),

  // Step 2 - Boarding
  boardingAirline: z.string().min(1, "Airline is required"),
  boardingDate: z.date({ required_error: "Boarding date is required" }),
  boardingFrom: z.string().min(1, "Boarding from is required"),
  boardingTo: z.string().min(1, "Boarding to is required"),
  boardingDepartureTime: z.string().min(1, "Departure time is required"),
  boardingArrivalTime: z.string().min(1, "Arrival time is required"),

  // Step 3 - Returning
  returnAirline: z.string().min(1, "Airline is required"),
  returnDate: z.date({ required_error: "Return date is required" }),
  returnFrom: z.string().min(1, "Boarding from is required"),
  returnTo: z.string().min(1, "Boarding to is required"),
  returnDepartureTime: z.string().min(1, "Departure time is required"),
  returnArrivalTime: z.string().min(1, "Arrival time is required"),

  // Step 4 - Travellers
  travellers: z
    .array(travellerSchema)
    .min(1, "At least one traveller is required"),

  // Step 5 - Hotels
  hotels: z.array(hotelSchema).min(1, "At least one hotel is required"),

  // Step 6 - Package
  packageIncluded: z
    .string()
    .refine((v) => stripHtml(v).length > 0, "Package inclusions are required"),
  packageExcluded: z
    .string()
    .refine((v) => stripHtml(v).length > 0, "Package exclusions are required"),

  // Step 7 - Itinerary
  itineraries: z
    .array(itinerarySchema)
    .min(1, "At least one itinerary item is required"),

  // Step 8 - General Details
  checkinTime: z.string().min(1, "Check-in time is required"),
  checkoutTime: z.string().min(1, "Checkout time is required"),
  smokingPolicy: z.string().min(1, "Smoking policy is required"),
  consumptionOfLiquor: z.string().min(1, "Liquor policy is required"),
  assistanceName: z.string().min(1, "Assistance name is required"),
  assistancePhone: z
    .string()
    .min(1, "Assistance phone is required")
    .regex(/^\d{10}$/, "Phone must be 10 digits"),
  supportName: z.string().min(1, "Support name is required"),
  supportPhone: z
    .string()
    .min(1, "Support phone is required")
    .regex(/^\d{10}$/, "Phone must be 10 digits"),
  emergencyName: z.string().min(1, "Emergency name is required"),
  emergencyPhone: z
    .string()
    .min(1, "Emergency phone is required")
    .regex(/^\d{10}$/, "Phone must be 10 digits"),

  // Step 9 - Official Details
  voucherNo: z.string().min(1, "Voucher number is required"),
  bookingDate: z.date({ required_error: "Booking date is required" }),
  totalAmount: z
    .string()
    .min(1, "Total amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid amount"),
  paymentType: z.string().min(1, "Payment type is required"),
  amountReceived: z
    .string()
    .min(1, "Amount received is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid amount"),
  amountBalanced: z
    .string()
    .min(1, "Amount balanced is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid amount"),
});

export type ConfirmationVoucherFormData = z.infer<
  typeof confirmationVoucherSchema
>;

export const stepFieldMap: (keyof ConfirmationVoucherFormData)[][] = [
  ["customerName", "mobileNo", "emailAddress", "companyName", "agentName", "journeyDate"],
  [
    "boardingAirline",
    "boardingDate",
    "boardingFrom",
    "boardingTo",
    "boardingDepartureTime",
    "boardingArrivalTime",
  ],
  [
    "returnAirline",
    "returnDate",
    "returnFrom",
    "returnTo",
    "returnDepartureTime",
    "returnArrivalTime",
  ],
  ["travellers"],
  ["hotels"],
  ["packageIncluded", "packageExcluded"],
  ["itineraries"],
  [
    "checkinTime",
    "checkoutTime",
    "smokingPolicy",
    "consumptionOfLiquor",
    "assistanceName",
    "assistancePhone",
    "supportName",
    "supportPhone",
    "emergencyName",
    "emergencyPhone",
  ],
  [
    "voucherNo",
    "bookingDate",
    "totalAmount",
    "paymentType",
    "amountReceived",
    "amountBalanced",
  ],
];
