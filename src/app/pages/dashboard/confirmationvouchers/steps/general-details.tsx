import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const GeneralDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Checkin Time</Label>
          <Input
            type="time"
            id="airline"
            placeholder="Air India"
            className="bg-white"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Checkout Time</Label>
          <Input
            type="time"
            id="airline"
            placeholder="Air India"
            className="bg-white"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Smoking Policy</Label>
          <Input
            type="text"
            id="airline"
            placeholder="As per the hotel policy"
            className="bg-white"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Consumption of Liquor</Label>
          <Input
            type="text"
            id="airline"
            placeholder="As per the hotel policy"
            className="bg-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Assistance</Label>
          <div className="flex flex-col items-center gap-6">
            <Input
              type="text"
              id="airline"
              placeholder="John Doe"
              className="bg-white gap-6"
            />
            <Input
              type="number"
              id="airline"
              placeholder="9876543210"
              className="bg-white"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Support</Label>
          <div className="flex flex-col items-center gap-6">
            <Input
              type="text"
              id="airline"
              placeholder="John Doe"
              className="bg-white gap-6"
            />
            <Input
              type="number"
              id="airline"
              placeholder="9876543210"
              className="bg-white"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="airline">Emergency</Label>
          <div className="flex flex-col items-center gap-6">
            <Input
              type="text"
              id="airline"
              placeholder="John Doe"
              className="bg-white gap-6"
            />
            <Input
              type="number"
              id="airline"
              placeholder="9876543210"
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetails;
