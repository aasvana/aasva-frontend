"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";
import { useCvConfigStore } from "@/stores/cvConfigStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useAgentStore } from "@/stores/agentStore";
import Link from "next/link";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import TravellersDetails from "./travellers-details";
import HotelsDetails from "./hotels-details";
import GeneralDetails from "./general-details";
import ItineraryDetails from "./itinerary-details";
import OfficialDetails from "./official-details";

export type Step = {
  id: number;
  title: string;
  content: JSX.Element;
};

function useTravelOptions() {
  const airlines = useCvConfigStore((s) => s.airlines);
  const airports = useCvConfigStore((s) => s.airports);

  const airlineOptions: ComboboxOption[] = airlines.map((a) => ({
    value: a.code,
    label: `${a.code} - ${a.name}`,
  }));

  const airportOptions: ComboboxOption[] = airports.map((a) => ({
    value: a.code,
    label: `${a.code} - ${a.name} (${a.city})`,
  }));

  return { airlineOptions, airportOptions };
}

export function getSteps(): Step[] {
  return [
    { id: 1, title: "Customer Details", content: <Step1CustomerDetails /> },
    { id: 2, title: "Travel Details - Boarding", content: <Step2Boarding /> },
    { id: 3, title: "Travel Details - Returning", content: <Step3Returning /> },
    { id: 4, title: "Traveller Details", content: <TravellersDetails /> },
    { id: 5, title: "Hotels Details", content: <HotelsDetails /> },
    { id: 6, title: "Package Details", content: <Step6Package /> },
    { id: 7, title: "Tour Itinerary", content: <ItineraryDetails /> },
    { id: 8, title: "General Details", content: <GeneralDetails /> },
    { id: 9, title: "Official Details", content: <OfficialDetails /> },
  ];
}

function Step1CustomerDetails() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ConfirmationVoucherFormData>();
  const journeyDate = watch("journeyDate");
  const customerName = watch("customerName");
  const agentName = watch("agentName");

  const customers = useCustomerStore((s) => s.customers);
  const agents = useAgentStore((s) => s.agents);

  const customerOptions: ComboboxOption[] = customers.map((c) => ({
    value: c.name,
    label: `${c.name}${c.company ? ` (${c.company})` : ""}`,
  }));

  const agentOptions: ComboboxOption[] = agents.map((a) => ({
    value: a.name,
    label: `${a.name}${a.company ? ` (${a.company})` : ""}`,
  }));

  const handleCustomerSelect = (name: string) => {
    const customer = customers.find((c) => c.name === name);
    if (!customer) return;
    setValue("customerName", customer.name, { shouldValidate: true });
    setValue("companyName", customer.company ?? "");
    setValue("emailAddress", customer.email ?? "");
    setValue("mobileNo", customer.phone ?? "");
  };

  const handleAgentSelect = (name: string) => {
    setValue("agentName", name, { shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5 md:col-span-2">
        <Label>Saved customer</Label>
        <Combobox
          options={customerOptions}
          value={customerOptions.some((o) => o.value === customerName)
            ? customerName
            : ""}
          onChange={handleCustomerSelect}
          placeholder="Select a saved customer to prefill"
          searchPlaceholder="Search customers..."
        />
        <p className="text-sm text-gray-500">
          <Link
            href="/dashboard/customers"
            className="font-medium text-emerald-600 hover:underline"
          >
            Manage customers
          </Link>
        </p>
      </div>
      <div className="grid gap-1.5 md:col-span-2">
        <Label>Saved agent</Label>
        <Combobox
          options={agentOptions}
          value={agentOptions.some((o) => o.value === agentName)
            ? agentName
            : ""}
          onChange={handleAgentSelect}
          placeholder="Select a saved agent (optional)"
          searchPlaceholder="Search agents..."
        />
        <p className="text-sm text-gray-500">
          <Link
            href="/dashboard/agents"
            className="font-medium text-emerald-600 hover:underline"
          >
            Manage agents
          </Link>
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="customerName">Customer name</Label>
        <Input
          type="text"
          id="customerName"
          placeholder="John Doe"
          className="bg-gray-50"
          aria-invalid={!!errors.customerName}
          {...register("customerName")}
        />
        {errors.customerName && (
          <p className="text-sm text-red-500">{errors.customerName.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="mobileNo">Mobile no.</Label>
        <Input
          type="text"
          id="mobileNo"
          placeholder="9876543210"
          className="bg-gray-50"
          maxLength={10}
          aria-invalid={!!errors.mobileNo}
          {...register("mobileNo")}
        />
        {errors.mobileNo && (
          <p className="text-sm text-red-500">{errors.mobileNo.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="emailAddress">Email address</Label>
        <Input
          type="email"
          id="emailAddress"
          placeholder="name@domain.com"
          className="bg-gray-50"
          aria-invalid={!!errors.emailAddress}
          {...register("emailAddress")}
        />
        {errors.emailAddress && (
          <p className="text-sm text-red-500">{errors.emailAddress.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="companyName">Company name (optional)</Label>
        <Input
          type="text"
          id="companyName"
          placeholder="SpaceX"
          className="bg-gray-50"
          {...register("companyName")}
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Journey date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                errors.journeyDate ? "border-red-500" : "border-gray-200"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
                  {journeyDate ? format(new Date(journeyDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={journeyDate}
              onSelect={(day) =>
                day && setValue("journeyDate", day, { shouldValidate: true })
              }
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {errors.journeyDate && (
          <p className="text-sm text-red-500">{errors.journeyDate.message as string}</p>
        )}
      </div>
    </div>
  );
}

function Step2Boarding() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ConfirmationVoucherFormData>();
  const boardingDate = watch("boardingDate");
  const boardingAirline = watch("boardingAirline");
  const boardingFrom = watch("boardingFrom");
  const boardingTo = watch("boardingTo");

  const { airlineOptions, airportOptions } = useTravelOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5">
        <Label>Airline</Label>
        <Combobox
          options={airlineOptions}
          value={boardingAirline}
          onChange={(val) =>
            setValue("boardingAirline", val, { shouldValidate: true })
          }
          placeholder="Select airline"
          searchPlaceholder="Search airlines..."
          invalid={!!errors.boardingAirline}
        />
        {errors.boardingAirline && (
          <p className="text-sm text-red-500">{errors.boardingAirline.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Boarding date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                errors.boardingDate ? "border-red-500" : "border-gray-200"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {boardingDate ? format(new Date(boardingDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={boardingDate}
              onSelect={(day) =>
                day && setValue("boardingDate", day, { shouldValidate: true })
              }
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {errors.boardingDate && (
          <p className="text-sm text-red-500">{errors.boardingDate.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Boarding from</Label>
        <Combobox
          options={airportOptions}
          value={boardingFrom}
          onChange={(val) =>
            setValue("boardingFrom", val, { shouldValidate: true })
          }
          placeholder="Select airport"
          searchPlaceholder="Search airports..."
          invalid={!!errors.boardingFrom}
        />
        {errors.boardingFrom && (
          <p className="text-sm text-red-500">{errors.boardingFrom.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Boarding to</Label>
        <Combobox
          options={airportOptions}
          value={boardingTo}
          onChange={(val) =>
            setValue("boardingTo", val, { shouldValidate: true })
          }
          placeholder="Select airport"
          searchPlaceholder="Search airports..."
          invalid={!!errors.boardingTo}
        />
        {errors.boardingTo && (
          <p className="text-sm text-red-500">{errors.boardingTo.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="boardingDepartureTime">Departure time</Label>
        <Input
          type="time"
          id="boardingDepartureTime"
          className="bg-gray-50"
          aria-invalid={!!errors.boardingDepartureTime}
          {...register("boardingDepartureTime")}
        />
        {errors.boardingDepartureTime && (
          <p className="text-sm text-red-500">{errors.boardingDepartureTime.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="boardingArrivalTime">Arrival time</Label>
        <Input
          type="time"
          id="boardingArrivalTime"
          className="bg-gray-50"
          aria-invalid={!!errors.boardingArrivalTime}
          {...register("boardingArrivalTime")}
        />
        {errors.boardingArrivalTime && (
          <p className="text-sm text-red-500">{errors.boardingArrivalTime.message as string}</p>
        )}
      </div>
    </div>
  );
}

function Step3Returning() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ConfirmationVoucherFormData>();
  const returnDate = watch("returnDate");
  const returnAirline = watch("returnAirline");
  const returnFrom = watch("returnFrom");
  const returnTo = watch("returnTo");

  const { airlineOptions, airportOptions } = useTravelOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5">
        <Label>Airline</Label>
        <Combobox
          options={airlineOptions}
          value={returnAirline}
          onChange={(val) =>
            setValue("returnAirline", val, { shouldValidate: true })
          }
          placeholder="Select airline"
          searchPlaceholder="Search airlines..."
          invalid={!!errors.returnAirline}
        />
        {errors.returnAirline && (
          <p className="text-sm text-red-500">{errors.returnAirline.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Return date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                errors.returnDate ? "border-red-500" : "border-gray-200"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? format(new Date(returnDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={(day) =>
                day && setValue("returnDate", day, { shouldValidate: true })
              }
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {errors.returnDate && (
          <p className="text-sm text-red-500">{errors.returnDate.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Boarding from</Label>
        <Combobox
          options={airportOptions}
          value={returnFrom}
          onChange={(val) =>
            setValue("returnFrom", val, { shouldValidate: true })
          }
          placeholder="Select airport"
          searchPlaceholder="Search airports..."
          invalid={!!errors.returnFrom}
        />
        {errors.returnFrom && (
          <p className="text-sm text-red-500">{errors.returnFrom.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Boarding to</Label>
        <Combobox
          options={airportOptions}
          value={returnTo}
          onChange={(val) =>
            setValue("returnTo", val, { shouldValidate: true })
          }
          placeholder="Select airport"
          searchPlaceholder="Search airports..."
          invalid={!!errors.returnTo}
        />
        {errors.returnTo && (
          <p className="text-sm text-red-500">{errors.returnTo.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="returnDepartureTime">Departure time</Label>
        <Input
          type="time"
          id="returnDepartureTime"
          className="bg-gray-50"
          aria-invalid={!!errors.returnDepartureTime}
          {...register("returnDepartureTime")}
        />
        {errors.returnDepartureTime && (
          <p className="text-sm text-red-500">{errors.returnDepartureTime.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="returnArrivalTime">Arrival time</Label>
        <Input
          type="time"
          id="returnArrivalTime"
          className="bg-gray-50"
          aria-invalid={!!errors.returnArrivalTime}
          {...register("returnArrivalTime")}
        />
        {errors.returnArrivalTime && (
          <p className="text-sm text-red-500">{errors.returnArrivalTime.message as string}</p>
        )}
      </div>
    </div>
  );
}

function Step6Package() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const packageIncluded = watch("packageIncluded");
  const packageExcluded = watch("packageExcluded");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="packageIncluded">Package Included</Label>
        <RichTextEditor
          id="packageIncluded"
          value={packageIncluded}
          onChange={(html) =>
            setValue("packageIncluded", html, { shouldValidate: true })
          }
          placeholder="Type here..."
          invalid={!!errors.packageIncluded}
        />
        {errors.packageIncluded && (
          <p className="text-sm text-red-500">{errors.packageIncluded.message as string}</p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="packageExcluded">Package Excluded</Label>
        <RichTextEditor
          id="packageExcluded"
          value={packageExcluded}
          onChange={(html) =>
            setValue("packageExcluded", html, { shouldValidate: true })
          }
          placeholder="Type here..."
          invalid={!!errors.packageExcluded}
        />
        {errors.packageExcluded && (
          <p className="text-sm text-red-500">{errors.packageExcluded.message as string}</p>
        )}
      </div>
    </div>
  );
}
