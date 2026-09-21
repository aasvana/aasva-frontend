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
import { JSX, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";
import { useCvConfigStore } from "@/stores/cvConfigStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useAgentStore } from "@/stores/agentStore";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { PartyDetailsSheet } from "@/components/cv/party-details-sheet";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import TravellersDetails from "./travellers-details";
import HotelsDetails from "./hotels-details";
import GeneralDetails from "./general-details";
import ItineraryDetails from "./itinerary-details";
import OfficialDetails from "./official-details";
import { capitalizeWords } from "@/lib/text-format";

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

type SearchablePartyFieldProps = {
  id: string;
  value: string;
  options: ComboboxOption[];
  placeholder: string;
  searchPlaceholder: string;
  addLabel: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  onAddNew: (value: string) => void;
};

function SearchablePartyField({
  id,
  value,
  options,
  placeholder,
  searchPlaceholder,
  addLabel,
  invalid,
  onChange,
  onAddNew,
}: SearchablePartyFieldProps) {
  return (
    <Combobox
      id={id}
      options={options}
      value={value}
      onChange={(nextValue) => onChange(capitalizeWords(nextValue))}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      addNewLabel={addLabel}
      onAddNew={(name) => {
        if (name.trim()) onAddNew(capitalizeWords(name));
      }}
      invalid={invalid}
    />
  );
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
  const customerTitle = watch("customerTitle");
  const agentName = watch("agentName");

  const customers = useCustomerStore((s) => s.customers);
  const addCustomer = useCustomerStore((s) => s.addCustomer);
  const agents = useAgentStore((s) => s.agents);
  const addAgent = useAgentStore((s) => s.addAgent);
  const [partySheet, setPartySheet] = useState<"customer" | "agent" | null>(null);
  const [partyName, setPartyName] = useState("");

  const handleCustomerSelect = (name: string) => {
    const cleanSelectedName = name.replace(/^(Mr|Mrs|Ms)\s+/i, "");
    const customer = customers.find((c) => c.name === name || c.name === cleanSelectedName);
    if (!customer) return;
    setValue("customerName", capitalizeWords(customer.name).replace(/^(Mr|Mrs|Ms)\s+/i, ""), { shouldValidate: true });
    setValue("companyName", customer.company ?? "");
    setValue("emailAddress", customer.email ?? "");
    setValue("mobileNo", customer.phone ?? "");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5 md:col-span-2">
        <Label htmlFor="packageName">Package name</Label>
        <Input id="packageName" placeholder="e.g. Kashmir 5 Days" className="bg-gray-50" aria-invalid={!!errors.packageName} {...register("packageName", { setValueAs: capitalizeWords })} />
        {errors.packageName && <p className="text-sm text-red-500">{errors.packageName.message as string}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="customerName">Customer name</Label>
        <div className="flex gap-2">
          <select
            aria-label="Customer title"
            value={customerTitle}
            onChange={(event) => {
              const title = event.target.value as "" | "Mr" | "Mrs" | "Ms";
              setValue("customerTitle", title, { shouldValidate: true });
            }}
            className="h-12 w-24 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[15px]"
          >
            <option value="">Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>
          <div className="min-w-0 flex-1">
            <SearchablePartyField
              id="customerName"
              value={customerName}
              options={customers.map((customer) => ({
                value: customer.name,
                label: `${customer.name}${customer.company ? ` (${customer.company})` : ""}`,
              }))}
              placeholder="Search or enter customer name"
              searchPlaceholder="Search customers..."
              addLabel="Add customer"
              invalid={!!errors.customerName}
              onChange={handleCustomerSelect}
              onAddNew={(name) => {
                setPartyName(name);
                setPartySheet("customer");
              }}
            />
          </div>
        </div>
        {errors.customerName && (
          <p className="text-sm text-red-500">{errors.customerName.message as string}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="agentName">Agent name</Label>
        <SearchablePartyField
          id="agentName"
          value={agentName}
          options={agents.map((agent) => ({
            value: agent.name,
            label: `${agent.name}${agent.company ? ` (${agent.company})` : ""}`,
          }))}
          placeholder="Search or enter agent name"
          searchPlaceholder="Search agents..."
          addLabel="Add agent"
          onChange={(name) => setValue("agentName", name, { shouldValidate: true })}
          onAddNew={(name) => {
            setPartyName(name);
            setPartySheet("agent");
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="numberOfPersons">No. of pax</Label>
        <Input type="number" min="1" id="numberOfPersons" className="bg-gray-50" aria-invalid={!!errors.numberOfPersons} {...register("numberOfPersons")} />
        {errors.numberOfPersons && <p className="text-sm text-red-500">{errors.numberOfPersons.message as string}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="numberOfTourDays">No. of tour days</Label>
        <Input type="number" min="1" id="numberOfTourDays" className="bg-gray-50" aria-invalid={!!errors.numberOfTourDays} {...register("numberOfTourDays")} />
        {errors.numberOfTourDays && <p className="text-sm text-red-500">{errors.numberOfTourDays.message as string}</p>}
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
      {partySheet && (
        <PartyDetailsSheet
          kind={partySheet}
          open
          initialName={partyName}
          onOpenChange={(open) => {
            if (!open) setPartySheet(null);
          }}
          onSave={(details) => {
            if (partySheet === "customer") {
              addCustomer({
                name: details.name,
                company: details.company,
                email: details.email,
                phone: details.phone,
                place: details.place,
                country: details.country ?? "",
                address: details.address ?? "",
                currency: details.currency ?? "",
                taxId: details.taxId ?? "",
                notes: details.notes,
              });
              setValue("customerName", capitalizeWords(details.name).replace(/^(Mr|Mrs|Ms)\s+/i, ""), { shouldValidate: true });
              setValue("companyName", details.company);
              setValue("emailAddress", details.email, { shouldValidate: true });
              setValue("mobileNo", details.phone, { shouldValidate: true });
            } else {
              addAgent({
                name: details.name,
                company: details.company,
                phone: details.phone,
                email: details.email,
                place: details.place,
                notes: details.notes,
              });
              setValue("agentName", details.name, { shouldValidate: true });
            }
            setPartySheet(null);
          }}
        />
      )}
    </>
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
  const journeyDate = watch("journeyDate");
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
              disabled={journeyDate ? { before: journeyDate } : undefined}
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
  const boardingDate = watch("boardingDate");
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
              disabled={boardingDate ? { before: boardingDate } : undefined}
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
