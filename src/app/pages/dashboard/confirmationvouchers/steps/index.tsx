"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Hotel } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import TravellersDetails from "./travellers-details";
import { Textarea } from "@/components/ui/textarea";
import HotelsDetails from "./hotels-details";
import GeneralDetails from "./general-details";
import ItineraryDetails from "./itinerary-details";
import OfficialDetails from "./official-details";

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
      title: "Travel Details - Boarding",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="airline">Airline</Label>
            <Input
              type="text"
              id="airline"
              placeholder="Air India"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="boardingDate">Boarding date</Label>
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
            <Label htmlFor="boardingFrom">Boarding from</Label>
            <Input
              type="text"
              id="boardingFrom"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="boardingTo">Boarding to</Label>
            <Input
              type="text"
              id="boardingTo"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="departureTime">Departure time</Label>
            <Input
              type="time"
              id="boardingTime"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="arrivalTime">Arrival time</Label>
            <Input
              type="time"
              id="arrivalTime"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Travel Details - Returning",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="airline">Airline</Label>
            <Input
              type="text"
              id="airline"
              placeholder="Air India"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="boardingDate">Boarding date</Label>
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
            <Label htmlFor="boardingFrom">Boarding from</Label>
            <Input
              type="text"
              id="boardingFrom"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="boardingTo">Boarding to</Label>
            <Input
              type="text"
              id="boardingTo"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="departureTime">Departure time</Label>
            <Input
              type="time"
              id="boardingTime"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="arrivalTime">Arrival time</Label>
            <Input
              type="time"
              id="arrivalTime"
              placeholder="Airport/Station"
              className="bg-white"
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Traveller Details",
      content: <TravellersDetails />,
    },
    {
      id: 5,
      title: "Hotel Details",
      content: <HotelsDetails />,
    },
    {
      id: 6,
      title: "Packege Details",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="included">Package Included</Label>
            <Textarea placeholder="Type here..." id="included" className="min-h-[320px] bg-white" spellCheck="true" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="excluded">Package Exclueded</Label>
            <Textarea placeholder="Type here..." id="excluded" className="min-h-[320px] bg-white" spellCheck="true" />
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Tour Itinerary",
      content: <ItineraryDetails />,
    },
    {
      id: 8,
      title: "General Details",
      content: <GeneralDetails />,
    },
    {
      id: 9,
      title: "Official Details",
      content: <OfficialDetails />,
    }
  ];
}
