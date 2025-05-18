"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hotelMealPlans } from "@/constants/hotelMealPlans";
import { hotelRoomTypes } from "@/constants/hotelRoomTypes";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
const uuidv4 = () => crypto.randomUUID();

const HotelsDetails = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [hotels, setHotels] = useState([
    { id: uuidv4(), name: "", age: "", gender: "male" },
  ]);

  const handleAddHotel = () => {
    setHotels((prev) => [
      ...prev,
      { id: uuidv4(), name: "", age: "", gender: "male" },
    ]);
  };

  const handleRemoveHotel = (id: string) => {
    setHotels((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (id: string, key: string, value: string) => {
    setHotels((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddHotel}>
          Add New Hotel
        </Button>
      </div>
      {hotels.map((hotels, index) => (
        <div
          key={hotels.id}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-md p-4 mb-4"
        >
          {index !== 0 && (
            <button
              type="button"
              onClick={() => handleRemoveHotel(hotels.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Destination</Label>
            <Input
              type="text"
              id={`name-${hotels.id}`}
              placeholder="New York"
              className="bg-white"
              value={hotels.name}
              onChange={(e) =>
                handleChange(hotels.id, "destination", e.target.value)
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Hotel Name</Label>
            <Input
              type="text"
              id={`name-${hotels.id}`}
              placeholder="Marriott"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Meal Type</Label>
            <Select>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {hotelMealPlans.map((mealType) => (
                  <SelectItem key={mealType.code} value={mealType.code}>
                    {mealType.code} - {mealType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Room</Label>
            <Input
              type="number"
              id={`room-${hotels.id}`}
              placeholder="1"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Room Category</Label>
            <Select>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {hotelRoomTypes.map((roomType) => (
                  <SelectItem key={roomType.code} value={roomType.code}>
                    {roomType.code} - {roomType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Max Occupancy</Label>
            <Input
              type="number"
              id={`room-${hotels.id}`}
              placeholder="3"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Adults</Label>
            <Input
              type="number"
              id={`room-${hotels.id}`}
              placeholder="2"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Children</Label>
            <Input
              type="number"
              id={`room-${hotels.id}`}
              placeholder="0"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${hotels.id}`}>Extra Mattress</Label>
            <Input
              type="number"
              id={`room-${hotels.id}`}
              placeholder="0"
              className="bg-white"
              value={hotels.name}
              onChange={(e) => handleChange(hotels.id, "name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="journeyDate">Checkin date</Label>
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
            <Label htmlFor="journeyDate">Checkout date</Label>
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
      ))}
    </>
  );
};

export default HotelsDetails;
