import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentTypes } from "@/constants/paymentTypes";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

const OfficialDetails = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5">
        <Label htmlFor="airline">Voucher No.</Label>
        <Input
          type="text"
          id="airline"
          placeholder="Xmerge/Kol/A/001"
          className="bg-white"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="journeyDate">Booking Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="airline">Total Amount</Label>
        <Input
          type="number"
          id="airline"
          placeholder="$2450"
          className="bg-white"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="airline">Payment Type</Label>
        <Select>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map((paymentType) => (
              <SelectItem key={paymentType.code} value={paymentType.name}>
                {paymentType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="airline">Amount Received</Label>
        <Input
          type="number"
          id="airline"
          placeholder="$2450"
          className="bg-white"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="airline">Amount Balanced</Label>
        <Input
          type="number"
          id="airline"
          placeholder="$2450"
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default OfficialDetails;
