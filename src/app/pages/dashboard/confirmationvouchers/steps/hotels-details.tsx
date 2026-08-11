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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { hotelMealPlans } from "@/constants/hotelMealPlans";
import { hotelRoomTypes } from "@/constants/hotelRoomTypes";
import { destinations as defaultDestinations } from "@/constants/destinations";
import { hotels as defaultHotels } from "@/constants/hotels";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";

type DestinationItem = { name: string; country?: string };
type HotelItem = {
  name: string;
  destination?: string;
  rating?: string;
  notes?: string;
};

type DrawerState = {
  mode: "destination" | "hotel";
  index: number;
};

const HotelsDetails = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hotels",
  });

  const hotelsValues = watch("hotels");

  const [destinations, setDestinations] =
    useState<DestinationItem[]>(defaultDestinations);
  const [hotelsList, setHotelsList] = useState<HotelItem[]>(defaultHotels);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    mode: "destination",
    index: 0,
  });
  const [newDestination, setNewDestination] = useState<DestinationItem>({
    name: "",
    country: "",
  });
  const [newHotel, setNewHotel] = useState<HotelItem>({
    name: "",
    destination: "",
    rating: "",
    notes: "",
  });

  const destinationOptions: ComboboxOption[] = destinations.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const hotelOptions: ComboboxOption[] = hotelsList.map((h) => ({
    value: h.name,
    label: h.name,
  }));

  const handleAddHotel = () => {
    append({
      destination: "",
      hotelName: "",
      mealType: "",
      room: "",
      roomCategory: "",
      maxOccupancy: "",
      adults: "",
      children: "",
      extraMattress: "",
      checkinDate: new Date(),
      checkoutDate: new Date(),
    });
  };

  const handleOpenAddDrawer = (mode: DrawerState["mode"], index: number, initialName: string) => {
    setDrawerState({ mode, index });
    if (mode === "destination") {
      setNewDestination({ name: initialName, country: "" });
    } else {
      setNewHotel({ name: initialName, destination: "", rating: "", notes: "" });
    }
    setDrawerOpen(true);
  };

  const handleSaveEntity = () => {
    if (drawerState.mode === "destination") {
      const name = newDestination.name.trim();
      if (!name) return;
      setDestinations((prev) =>
        prev.some((d) => d.name.toLowerCase() === name.toLowerCase())
          ? prev
          : [...prev, { ...newDestination, name }]
      );
      setValue(`hotels.${drawerState.index}.destination`, name, {
        shouldValidate: true,
      });
    } else {
      const name = newHotel.name.trim();
      if (!name) return;
      setHotelsList((prev) =>
        prev.some((h) => h.name.toLowerCase() === name.toLowerCase())
          ? prev
          : [...prev, { ...newHotel, name }]
      );
      setValue(`hotels.${drawerState.index}.hotelName`, name, {
        shouldValidate: true,
      });
    }
    setDrawerOpen(false);
  };

  const isNameEmpty =
    drawerState.mode === "destination"
      ? !newDestination.name.trim()
      : !newHotel.name.trim();

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddHotel}>
          Add New Hotel
        </Button>
      </div>

      {errors.hotels?.root && (
        <p className="text-sm text-red-500 mb-2">
          {errors.hotels.root.message}
        </p>
      )}

      {fields.map((field, index) => {
        const hotelData = hotelsValues?.[index];

        return (
          <div
            key={field.id}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-md p-4 mb-4"
          >
            {index !== 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="grid gap-1.5">
              <Label>Destination</Label>
              <Combobox
                options={destinationOptions}
                value={hotelData?.destination}
                onChange={(val) =>
                  setValue(`hotels.${index}.destination`, val, {
                    shouldValidate: true,
                  })
                }
                placeholder="Select or add destination"
                searchPlaceholder="Search destinations..."
                invalid={!!errors.hotels?.[index]?.destination}
                onAddNew={(term) => handleOpenAddDrawer("destination", index, term)}
                addNewLabel="Add destination"
              />
              {errors.hotels?.[index]?.destination && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.destination?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Hotel Name</Label>
              <Combobox
                options={hotelOptions}
                value={hotelData?.hotelName}
                onChange={(val) =>
                  setValue(`hotels.${index}.hotelName`, val, {
                    shouldValidate: true,
                  })
                }
                placeholder="Select or add hotel"
                searchPlaceholder="Search hotels..."
                invalid={!!errors.hotels?.[index]?.hotelName}
                onAddNew={(term) => handleOpenAddDrawer("hotel", index, term)}
                addNewLabel="Add hotel"
              />
              {errors.hotels?.[index]?.hotelName && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.hotelName?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Meal Type</Label>
              <Select
                value={hotelData?.mealType}
                onValueChange={(value) =>
                  setValue(`hotels.${index}.mealType`, value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={`w-full bg-white ${
                    errors.hotels?.[index]?.mealType ? "border-red-500" : ""
                  }`}
                >
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
              {errors.hotels?.[index]?.mealType && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.mealType?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Room</Label>
              <Input
                type="number"
                placeholder="1"
                className="bg-white"
                aria-invalid={!!errors.hotels?.[index]?.room}
                {...control.register(`hotels.${index}.room`)}
              />
              {errors.hotels?.[index]?.room && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.room?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Room Category</Label>
              <Select
                value={hotelData?.roomCategory}
                onValueChange={(value) =>
                  setValue(`hotels.${index}.roomCategory`, value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={`w-full bg-white ${
                    errors.hotels?.[index]?.roomCategory ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {hotelRoomTypes.map((roomType) => (
                    <SelectItem key={roomType.code} value={roomType.code}>
                      {roomType.code} - {roomType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hotels?.[index]?.roomCategory && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.roomCategory?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Max Occupancy</Label>
              <Input
                type="number"
                placeholder="3"
                className="bg-white"
                aria-invalid={!!errors.hotels?.[index]?.maxOccupancy}
                {...control.register(`hotels.${index}.maxOccupancy`)}
              />
              {errors.hotels?.[index]?.maxOccupancy && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.maxOccupancy?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Adults</Label>
              <Input
                type="number"
                placeholder="2"
                className="bg-white"
                aria-invalid={!!errors.hotels?.[index]?.adults}
                {...control.register(`hotels.${index}.adults`)}
              />
              {errors.hotels?.[index]?.adults && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.adults?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Children</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-white"
                aria-invalid={!!errors.hotels?.[index]?.children}
                {...control.register(`hotels.${index}.children`)}
              />
              {errors.hotels?.[index]?.children && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.children?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Extra Mattress</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-white"
                aria-invalid={!!errors.hotels?.[index]?.extraMattress}
                {...control.register(`hotels.${index}.extraMattress`)}
              />
              {errors.hotels?.[index]?.extraMattress && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.extraMattress?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Checkin date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.hotels?.[index]?.checkinDate ? "border-red-500" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {hotelData?.checkinDate ? (
                      format(new Date(hotelData.checkinDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      hotelData?.checkinDate
                        ? new Date(hotelData.checkinDate)
                        : undefined
                    }
                    onSelect={(day) =>
                      setValue(`hotels.${index}.checkinDate`, day as Date, {
                        shouldValidate: true,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.hotels?.[index]?.checkinDate && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.checkinDate?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Checkout date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.hotels?.[index]?.checkoutDate ? "border-red-500" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {hotelData?.checkoutDate ? (
                      format(new Date(hotelData.checkoutDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      hotelData?.checkoutDate
                        ? new Date(hotelData.checkoutDate)
                        : undefined
                    }
                    onSelect={(day) =>
                      setValue(`hotels.${index}.checkoutDate`, day as Date, {
                        shouldValidate: true,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.hotels?.[index]?.checkoutDate && (
                <p className="text-sm text-red-500">
                  {errors.hotels[index]?.checkoutDate?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="top-0 right-0 h-full w-full sm:max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Add {drawerState.mode === "destination" ? "Destination" : "Hotel"}
            </DrawerTitle>
            <DrawerDescription>
              Fill in the{" "}
              {drawerState.mode === "destination" ? "destination" : "hotel"}{" "}
              details below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4 overflow-y-auto">
            {drawerState.mode === "destination" ? (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-name">Destination Name</Label>
                  <Input
                    id="destination-name"
                    value={newDestination.name}
                    onChange={(e) =>
                      setNewDestination({ ...newDestination, name: e.target.value })
                    }
                    placeholder="e.g. Andaman Islands"
                    autoFocus
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-country">Country</Label>
                  <Input
                    id="destination-country"
                    value={newDestination.country ?? ""}
                    onChange={(e) =>
                      setNewDestination({
                        ...newDestination,
                        country: e.target.value,
                      })
                    }
                    placeholder="e.g. India"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="hotel-name">Hotel Name</Label>
                  <Input
                    id="hotel-name"
                    value={newHotel.name}
                    onChange={(e) =>
                      setNewHotel({ ...newHotel, name: e.target.value })
                    }
                    placeholder="e.g. Taj Mahal Palace"
                    autoFocus
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hotel-destination">Destination</Label>
                  <Input
                    id="hotel-destination"
                    value={newHotel.destination ?? ""}
                    onChange={(e) =>
                      setNewHotel({
                        ...newHotel,
                        destination: e.target.value,
                      })
                    }
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Star Rating</Label>
                  <Select
                    value={newHotel.rating}
                    onValueChange={(value) =>
                      setNewHotel({ ...newHotel, rating: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5"].map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating} Star
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hotel-notes">Notes</Label>
                  <Textarea
                    id="hotel-notes"
                    value={newHotel.notes ?? ""}
                    onChange={(e) =>
                      setNewHotel({ ...newHotel, notes: e.target.value })
                    }
                    placeholder="Optional notes..."
                  />
                </div>
              </>
            )}
          </div>
          <DrawerFooter>
            <Button onClick={handleSaveEntity} disabled={isNameEmpty}>
              Add {drawerState.mode === "destination" ? "Destination" : "Hotel"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HotelsDetails;
