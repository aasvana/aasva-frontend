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
import { Dispatch, JSX, SetStateAction } from "react";

export type Step = {
  id: number;
  title: string;
  content: JSX.Element;
};

export function getSteps(
  date: Date | undefined,
  setDate: Dispatch<SetStateAction<Date | undefined>>
): Step[] {
  return [
    {
      id: 1,
      title: "Customer Details",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="customerName">Customer name</Label>
            <Input
              type="text"
              id="customerName"
              placeholder="John Doe"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mobileNo">Mobile no.</Label>
            <Input
              type="number"
              id="mobileNo"
              placeholder="9876543210"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emailAddress">Email address</Label>
            <Input
              type="email"
              id="emailAddress"
              placeholder="name@domain.com"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="companyName">Company name (optional)</Label>
            <Input
              type="text"
              id="companyName"
              placeholder="SpaceX"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="journeyDate">Journey date</Label>
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
        </div>
      ),
    },
    {
      id: 2,

      title: "Travel Details",
      content: (
        <div className="text-gray-500 dark:text-neutral-500">
          Travel details go here
        </div>
      ),
    },
    {
      id: 3,
      title: "Payment",
      content: (
        <div className="text-gray-500 dark:text-neutral-500">
          Payment section
        </div>
      ),
    },
    {
      id: 4,
      title: "Confirmation",
      content: (
        <div className="text-gray-500 dark:text-neutral-500">
          Confirm and submit
        </div>
      ),
    },
  ];
}
