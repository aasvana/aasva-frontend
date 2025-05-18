import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
const uuidv4 = () => crypto.randomUUID();

const ItineraryDetails = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [itineraries, setItineraries] = useState([
    { id: uuidv4(), name: "", age: "", gender: "male" },
  ]);

  const handleAddItinerary = () => {
    setItineraries((prev) => [
      ...prev,
      { id: uuidv4(), name: "", age: "", gender: "male" },
    ]);
  };

  const handleRemoveItinerary = (id: string) => {
    setItineraries((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (id: string, key: string, value: string) => {
    setItineraries((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddItinerary}>
          Add New Itinerary
        </Button>
      </div>
      {itineraries.map((itinerary, index) => (
        <div
          key={itinerary.id}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-md p-4 mb-4"
        >
          {index !== 0 && (
            <button
              type="button"
              onClick={() => handleRemoveItinerary(itinerary.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="journeyDate">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Date</span>}
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
            <Label htmlFor={`name-${itinerary.id}`}>Subject</Label>
            <Input
              type="text"
              id={`room-${itinerary.id}`}
              placeholder="0"
              className="bg-white"
              value={itinerary.name}
              onChange={(e) =>
                handleChange(itinerary.id, "name", e.target.value)
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`name-${itinerary.id}`}>Itinerary</Label>
            <Input
              type="text"
              id={`room-${itinerary.id}`}
              placeholder="0"
              className="bg-white"
              value={itinerary.name}
              onChange={(e) =>
                handleChange(itinerary.id, "name", e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default ItineraryDetails;
