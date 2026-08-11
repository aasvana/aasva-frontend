"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function MeetingsRoomsPage() {
  const rooms = useTeamMeetStore((s) => s.rooms);
  const addRoom = useTeamMeetStore((s) => s.addRoom);
  const updateRoom = useTeamMeetStore((s) => s.updateRoom);
  const deleteRoom = useTeamMeetStore((s) => s.deleteRoom);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "name", label: "Room name", required: true, placeholder: "Boardroom A" },
      { name: "location", label: "Location", placeholder: "Floor 4" },
      { name: "capacity", label: "Capacity", type: "number", placeholder: "12" },
      { name: "amenities", label: "Amenities", placeholder: "4K display, video bar" },
      {
        name: "isAvailable",
        label: "Available",
        type: "select",
        options: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ],
      },
    ],
    []
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Meeting Rooms"
      description="Bookable spaces across the office."
      addLabel="Add Room"
      emptyTitle="No rooms yet"
      emptyDescription="Add your first meeting room to start booking."
      searchPlaceholder="Search rooms…"
      fields={fields}
      tableHeaders={["Room", "Location", "Capacity", "Amenities", "Available"]}
      rowCells={(item) => [
        <div key="n" className="flex items-center gap-3">
          <Avatar name={item.name} size="size-9" />
          <p className="font-medium text-gray-800">{item.name}</p>
        </div>,
        item.location,
        item.capacity,
        item.amenities,
        <span
          key="a"
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.isAvailable === "Yes"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              item.isAvailable === "Yes" ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          {item.isAvailable}
        </span>,
      ]}
      items={rooms}
      searchText={(item) => `${item.name} ${item.location} ${item.amenities}`}
      add={addRoom}
      update={updateRoom}
      remove={deleteRoom}
    />
  );
}
