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
import {
  INDIA_CITIES_BY_STATE,
  INDIA_COUNTRY,
  INDIA_STATES,
} from "@/constants/indiaLocations";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";
import { useDestinationSearch } from "@/lib/destinations-query";
import { apiCreateDestination, apiGetDestinations } from "@/lib/destinations-api";
import { apiCreateHotel } from "@/lib/hotels-api";
import { useHotelSearch } from "@/lib/hotels-query";
import { DestinationDrawer } from "@/components/cv/destination-drawer";
import { capitalizeWords } from "@/lib/text-format";
import { toast } from "sonner";

type DestinationItem = {
  id?: string;
  name: string;
  state: string;
  city: string;
  country: string;
};
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

  const journeyDate = watch("journeyDate");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hotels",
  });

  const hotelsValues = watch("hotels");

  React.useEffect(() => {
    if (!journeyDate || !hotelsValues) return;
    hotelsValues.forEach((hotel, index) => {
      if (!hotel.checkinDate || new Date(hotel.checkinDate) < journeyDate) {
        setValue(`hotels.${index}.checkinDate`, journeyDate, { shouldValidate: true });
      }
      if (!hotel.checkoutDate || new Date(hotel.checkoutDate) < journeyDate) {
        setValue(`hotels.${index}.checkoutDate`, journeyDate, { shouldValidate: true });
      }
      const checkout = hotel.checkoutDate ? new Date(hotel.checkoutDate) : journeyDate;
      const checkin = hotel.checkinDate ? new Date(hotel.checkinDate) : journeyDate;
      if (checkout < checkin) {
        setValue(`hotels.${index}.checkoutDate`, checkin, { shouldValidate: true });
      }
    });
  }, [journeyDate, hotelsValues, setValue]);

  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  React.useEffect(() => {
    void apiGetDestinations().then((items) => {
      setDestinations(items.map((item) => ({ id: item.id, name: item.name, state: item.state, city: item.city, country: item.country })));
    });
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDestinationSearch, setDrawerDestinationSearch] = useState("");
  const [drawerSuggestionsOpen, setDrawerSuggestionsOpen] = useState(false);
  const [debouncedDrawerDestinationSearch, setDebouncedDrawerDestinationSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [debouncedDestinationSearch, setDebouncedDestinationSearch] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [debouncedHotelSearch, setDebouncedHotelSearch] = useState("");
  const { data: locationResults = [], isFetching: locationsLoading } = useDestinationSearch(
    debouncedDestinationSearch,
  );
  const { data: drawerLocationResults = [], isFetching: drawerLocationsLoading } =
    useDestinationSearch(debouncedDrawerDestinationSearch);
  const { data: searchedHotels = [], isFetching: hotelsLoading } = useHotelSearch(debouncedHotelSearch);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    mode: "destination",
    index: 0,
  });
  const [newDestination, setNewDestination] = useState<DestinationItem>({
    name: "",
    state: "",
    city: "",
    country: INDIA_COUNTRY,
  });
  const [newHotel, setNewHotel] = useState<HotelItem>({
    name: "",
    destination: "",
    rating: "",
    notes: "",
  });

  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const savedDestinationOptions = (hotelsValues ?? []).map((hotel) => hotel?.destination).filter((destination): destination is string => Boolean(destination?.trim())).map((destination) => ({ value: destination, label: destination }));
  const destinationOptions: ComboboxOption[] = [...safeDestinations.map((d) => ({
    value: d.name,
    label: d.name,
  })), ...savedDestinationOptions].filter((option, index, options) => options.findIndex((candidate) => candidate.value === option.value) === index);
  const safeLocationResults = Array.isArray(locationResults) ? locationResults : [];
  const remoteDestinationOptions = safeLocationResults.map((location) => ({
    value: location.name,
    label: `${location.name} · ${[location.city, location.state, location.country]
      .filter(Boolean)
      .join(", ")}`,
  }));
  const allDestinationOptions = [
    ...destinationOptions,
    ...remoteDestinationOptions.filter(
      (remote) => !destinationOptions.some((local) => local.value === remote.value),
    ),
  ];

  React.useEffect(() => {
    const normalizedSearch = typeof destinationSearch === "string" ? destinationSearch.trim() : "";
    const timer = window.setTimeout(
      () => setDebouncedDestinationSearch(normalizedSearch),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [destinationSearch]);

  React.useEffect(() => {
    const normalizedSearch = typeof hotelSearch === "string" ? hotelSearch.trim() : "";
    const timer = window.setTimeout(() => setDebouncedHotelSearch(normalizedSearch), 300);
    return () => window.clearTimeout(timer);
  }, [hotelSearch]);

  React.useEffect(() => {
    const normalizedSearch =
      typeof drawerDestinationSearch === "string" ? drawerDestinationSearch.trim() : "";
    const timer = window.setTimeout(
      () => setDebouncedDrawerDestinationSearch(normalizedSearch),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [drawerDestinationSearch]);

  const hotelOptions: ComboboxOption[] = searchedHotels.map((hotel) => ({
    value: hotel.name,
    label: `${hotel.name}${hotel.destination?.name ? ` · ${hotel.destination.name}` : ""}`,
  }));

  const handleAddHotel = () => {
    const selectedDestination = [...(hotelsValues ?? [])]
      .reverse()
      .find((hotel) => hotel?.destination)?.destination ?? "";
    append({
      destination: selectedDestination,
      hotelName: "",
      mealType: "",
      room: "",
      roomCategory: "",
      maxOccupancy: "",
      adults: "",
      children: "",
      extraMattress: "",
       checkinDate: journeyDate ?? new Date(),
       checkoutDate: journeyDate ?? new Date(),
    });
  };

  const handleOpenAddDrawer = (mode: DrawerState["mode"], index: number, initialName: string) => {
    setDrawerState({ mode, index });
    if (mode === "destination") {
      setNewDestination({
        name: initialName,
        state: "",
        city: "",
        country: INDIA_COUNTRY,
      });
      setDrawerDestinationSearch(initialName);
      setDrawerSuggestionsOpen(Boolean(initialName.trim()));
    } else {
      setNewHotel({
        name: initialName,
        destination: hotelsValues?.[index]?.destination ?? "",
        rating: "",
        notes: "",
      });
    }
    setDrawerOpen(true);
  };

  const handleSaveEntity = async () => {
    if (drawerState.mode === "destination") {
      const name = capitalizeWords(newDestination.name);
      const state = newDestination.state.trim();
      const city = newDestination.city.trim();
      const country = newDestination.country.trim();
      if (!name) return;
       const created = await apiCreateDestination({ name, state, city, country });
       setDestinations((prev) =>
        prev.some((d) => d.name.toLowerCase() === name.toLowerCase())
          ? prev
           : [...prev, { id: created.id, name: created.name, state: created.state, city: created.city, country: created.country }]
      );
      setValue(`hotels.${drawerState.index}.destination`, name, {
        shouldValidate: true,
      });
    } else {
      const name = capitalizeWords(newHotel.name);
      if (!name) return;
      const destinationName = (newHotel.destination ?? "").trim();
      const destination = destinations.find(
        (item) => item.name.trim().toLowerCase() === destinationName.toLowerCase(),
      );
      if (!destination?.id) {
        toast.error("Select a saved destination before adding a hotel.");
        return;
      }
      try {
        await apiCreateHotel({
          name,
          destinationId: destination.id,
          starRating: newHotel.rating,
          notes: newHotel.notes,
        });
        setValue(`hotels.${drawerState.index}.destination`, destination.name, {
          shouldValidate: true,
        });
        setValue(`hotels.${drawerState.index}.hotelName`, name, {
          shouldValidate: true,
        });
        toast.success("Hotel saved. Save the confirmation voucher to store it in the voucher.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save hotel.");
        return;
      }
    }
    setDrawerOpen(false);
  };

  const isRequiredFieldEmpty =
    drawerState.mode === "destination"
      ? !newDestination.name.trim()
      : !newHotel.name.trim();

  const selectDrawerDestination = (destination: (typeof drawerLocationResults)[number]) => {
    setNewDestination((current) => ({
      ...current,
      name: destination.name,
      state: destination.state,
      city: destination.city,
      country: destination.country,
    }));
    setDrawerDestinationSearch(destination.name);
    setDrawerSuggestionsOpen(false);
  };
  const safeDrawerLocationResults = Array.isArray(drawerLocationResults)
    ? drawerLocationResults
    : [];

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
                options={allDestinationOptions}
                value={hotelData?.destination}
                onChange={async (val) => {
                  const remote = safeLocationResults.find((location) => location.name === val);
                  if (remote) {
                    const saved = await apiCreateDestination({
                      name: remote.name,
                      street: remote.street,
                      city: remote.city,
                      state: remote.state,
                      country: remote.country,
                      countryCode: remote.countryCode,
                      postalCode: remote.postalCode,
                      latitude: remote.latitude ?? undefined,
                      longitude: remote.longitude ?? undefined,
                      displayName: remote.displayName,
                      source: remote.source ?? undefined,
                      externalId: remote.externalId ?? undefined,
                    });
                    setDestinations((previous) => previous.some((item) => item.name === val)
                      ? previous
                      : [...previous, { name: saved.name, state: saved.state, city: saved.city, country: saved.country }]);
                  }
                  setValue(`hotels.${index}.destination`, capitalizeWords(val), { shouldValidate: true });
                }}
                placeholder="Select or add destination"
                searchPlaceholder="Search destinations..."
                invalid={!!errors.hotels?.[index]?.destination}
                onAddNew={(term) => handleOpenAddDrawer("destination", index, term)}
                addNewLabel="Add destination"
                onSearchChange={setDestinationSearch}
                loading={
                  (typeof destinationSearch === "string" ? destinationSearch.trim().length : 0) >= 3 &&
                  (locationsLoading ||
                    debouncedDestinationSearch !==
                      (typeof destinationSearch === "string" ? destinationSearch.trim() : ""))
                }
                emptyLabel="No locations found"
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
                  setValue(`hotels.${index}.hotelName`, capitalizeWords(val), {
                    shouldValidate: true,
                  })
                }
                placeholder="Select or add hotel"
                searchPlaceholder="Search hotels..."
                onSearchChange={setHotelSearch}
                loading={
                  (typeof hotelSearch === "string" ? hotelSearch.trim().length : 0) >= 2 &&
                  (hotelsLoading || debouncedHotelSearch !== hotelSearch.trim())
                }
                emptyLabel="No hotels found"
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
                className="bg-gray-50"
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
                className="bg-gray-50"
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
                className="bg-gray-50"
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
                className="bg-gray-50"
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
                className="bg-gray-50"
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
                    className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                      errors.hotels?.[index]?.checkinDate ? "border-red-500" : "border-gray-200"
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
                    disabled={journeyDate ? { before: journeyDate } : undefined}
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
                    autoFocus
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
                    className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                      errors.hotels?.[index]?.checkoutDate ? "border-red-500" : "border-gray-200"
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
                    disabled={
                      journeyDate || hotelData?.checkinDate
                        ? {
                            before: new Date(
                              Math.max(
                                journeyDate?.getTime() ?? 0,
                                hotelData?.checkinDate
                                  ? new Date(hotelData.checkinDate).getTime()
                                  : 0,
                              ),
                            ),
                          }
                        : undefined
                    }
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
                    autoFocus
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

      {drawerState.mode === "destination" ? (
        <DestinationDrawer
          open={drawerOpen}
          initialValue={newDestination}
          onOpenChange={setDrawerOpen}
          onSave={async (draft, suggestion) => {
            const created = await apiCreateDestination({
              name: draft.name,
              state: draft.state,
              city: draft.city,
              country: draft.country,
              ...(suggestion
                ? {
                    street: suggestion.street,
                    countryCode: suggestion.countryCode,
                    postalCode: suggestion.postalCode,
                    latitude: suggestion.latitude ?? undefined,
                    longitude: suggestion.longitude ?? undefined,
                    displayName: suggestion.displayName,
                    source: suggestion.source ?? undefined,
                    externalId: suggestion.externalId ?? undefined,
                  }
                : {}),
            });
            setDestinations((previous) =>
              previous.some((item) => item.name.toLowerCase() === created.name.toLowerCase())
                ? previous
                : [...previous, { name: created.name, state: created.state, city: created.city, country: created.country }],
            );
                setValue(`hotels.${drawerState.index}.destination`, capitalizeWords(created.name), { shouldValidate: true });
            setDrawerOpen(false);
          }}
        />
      ) : (
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="top-0 right-0 h-full w-full sm:max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Add Hotel
            </DrawerTitle>
            <DrawerDescription>
              Fill in the hotel details below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4 overflow-y-auto">
            {false ? (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-name">
                    Destination Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="destination-name"
                    value={newDestination.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewDestination({ ...newDestination, name: value });
                      setDrawerDestinationSearch(value);
                      setDrawerSuggestionsOpen(true);
                    }}
                    placeholder="Search destination, e.g. Havelock"
                    autoFocus
                  />
                  {drawerSuggestionsOpen && drawerDestinationSearch.trim().length >= 3 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                      {drawerLocationsLoading ? (
                        <p className="px-3 py-2 text-sm text-gray-500">Searching destinations...</p>
                      ) : safeDrawerLocationResults.length > 0 ? (
                        safeDrawerLocationResults.map((destination) => (
                          <button
                            key={`${destination.externalId ?? destination.name}-${destination.city}`}
                            type="button"
                            className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-gray-50"
                            onClick={() => selectDrawerDestination(destination)}
                          >
                            <span className="text-sm font-medium text-gray-800">
                              {destination.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {[destination.city, destination.state, destination.country]
                                .filter(Boolean)
                                .join(", ") || destination.displayName}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-gray-500">No destinations found</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-state">
                    State
                  </Label>
                  <Combobox
                    id="destination-state"
                    options={INDIA_STATES.map((state) => ({ value: state, label: state }))}
                    value={newDestination.state}
                    onChange={(state) =>
                      setNewDestination({ ...newDestination, state, city: "" })
                    }
                    placeholder="Select state"
                    searchPlaceholder="Search states..."
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-city">
                    City
                  </Label>
                  <Combobox
                    id="destination-city"
                    options={(INDIA_CITIES_BY_STATE[newDestination.state] ?? []).map((city) => ({
                      value: city,
                      label: city,
                    }))}
                    value={newDestination.city}
                    onChange={(city) => setNewDestination({ ...newDestination, city })}
                    placeholder={newDestination.state ? "Select city" : "Select state first"}
                    searchPlaceholder="Search cities..."
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="destination-country">
                    Country
                  </Label>
                  <Input
                    id="destination-country"
                    value={newDestination.country ?? ""}
                    readOnly
                    aria-readonly="true"
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
                    readOnly
                    aria-readonly="true"
                    className="bg-gray-100"
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
            <Button onClick={handleSaveEntity} disabled={isRequiredFieldEmpty}>
              Add Hotel
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      )}
    </>
  );
};

export default HotelsDetails;
