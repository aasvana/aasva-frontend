"use client";

import { useMemo, useState } from "react";
import { Send, CheckCircle2, RotateCcw, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Delivery,
  useDeliveryStore,
} from "@/stores/deliveryStore";
import {
  deliveryStatusPill,
  logDeliveryAction,
} from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DispatchPage() {
  const deliveries = useDeliveryStore((s) => s.deliveries);
  const partners = useDeliveryStore((s) => s.partners);
  const settings = useDeliveryStore((s) => s.settings);
  const dispatchDelivery = useDeliveryStore((s) => s.dispatchDelivery);
  const markDelivered = useDeliveryStore((s) => s.markDelivered);
  const updateDelivery = useDeliveryStore((s) => s.updateDelivery);

  const [dispatchTarget, setDispatchTarget] = useState<Delivery | null>(null);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const activePartners = useMemo(
    () => partners.filter((p) => p.isActive === "Yes"),
    [partners]
  );

  const queue = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === "Pending" || d.status === "Ready for Dispatch"
      ),
    [deliveries]
  );

  const inTransit = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === "Dispatched" || d.status === "In Transit"
      ),
    [deliveries]
  );

  const failed = useMemo(
    () => deliveries.filter((d) => d.status === "Failed"),
    [deliveries]
  );

  const ready = useClientReady();
  if (!ready) return null;

  const openDispatchSheet = (delivery: Delivery) => {
    setDispatchTarget(delivery);
    setSelectedPartner(
      activePartners.find((p) => p.name === settings.defaultPartnerName)?.name ??
        delivery.partnerName ??
        ""
    );
    setSheetOpen(true);
  };

  const confirmDispatch = () => {
    if (!dispatchTarget) return;
    if (!selectedPartner) {
      toast.error("Select a delivery partner.");
      return;
    }
    const partner = activePartners.find((p) => p.name === selectedPartner);
    dispatchDelivery(dispatchTarget.id, partner?.id ?? "", selectedPartner);
    logDeliveryAction(
      "sent",
      "Delivery",
      dispatchTarget.deliveryNo,
      `${dispatchTarget.deliveryNo} dispatched with ${selectedPartner}.`
    );
    toast.success(`${dispatchTarget.deliveryNo} dispatched.`);
    setSheetOpen(false);
    setDispatchTarget(null);
  };

  const handleMarkDelivered = (delivery: Delivery) => {
    markDelivered(delivery.id);
    logDeliveryAction(
      "updated",
      "Delivery",
      delivery.deliveryNo,
      `${delivery.deliveryNo} marked as delivered.`
    );
    toast.success(`${delivery.deliveryNo} marked as delivered.`);
  };

  const handleReattempt = (delivery: Delivery) => {
    updateDelivery(delivery.id, {
      deliveryNo: delivery.deliveryNo,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      address: delivery.address,
      pincode: delivery.pincode,
      zoneId: delivery.zoneId,
      zoneName: delivery.zoneName,
      partnerId: "",
      partnerName: "",
      orderRef: delivery.orderRef,
      items: delivery.items,
      weight: delivery.weight,
      charge: delivery.charge,
      cod: delivery.cod,
      scheduledDate: delivery.scheduledDate,
      dispatchedAt: "",
      deliveredAt: "",
      status: "Ready for Dispatch",
      notes: delivery.notes,
    });
    logDeliveryAction(
      "updated",
      "Delivery",
      delivery.deliveryNo,
      `${delivery.deliveryNo} queued for re-attempt.`
    );
    toast.success(`${delivery.deliveryNo} queued for re-attempt.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Dispatch</h1>
        <p className="text-sm text-gray-500">
          Assign partners and manage active deliveries.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Pending dispatch <span className="text-gray-400">({queue.length})</span>
            </p>
          </div>
          {queue.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <PackageSearch className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">Nothing awaiting dispatch.</p>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Delivery", "Customer", "Zone", "Items", "Scheduled", "Status", "Action"].map(
                      (h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-2.5 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {queue.map((d) => (
                    <tr key={d.id}>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{d.deliveryNo}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.customerName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{d.zoneName || "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.items}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{d.scheduledDate}</td>
                      <td className="px-4 py-2.5">{deliveryStatusPill(d.status)}</td>
                      <td className="px-4 py-2.5 text-sm">
                        <Button size="sm" onClick={() => openDispatchSheet(d)}>
                          <Send /> Dispatch
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              In transit <span className="text-gray-400">({inTransit.length})</span>
            </p>
          </div>
          {inTransit.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <PackageSearch className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No active deliveries.</p>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Delivery", "Customer", "Partner", "Items", "Dispatched", "Status", "Action"].map(
                      (h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-2.5 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inTransit.map((d) => (
                    <tr key={d.id}>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{d.deliveryNo}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.customerName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.partnerName || "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.items}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{d.dispatchedAt || "—"}</td>
                      <td className="px-4 py-2.5">{deliveryStatusPill(d.status)}</td>
                      <td className="px-4 py-2.5 text-sm">
                        <Button size="sm" variant="outline" onClick={() => handleMarkDelivered(d)}>
                          <CheckCircle2 /> Mark Delivered
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {failed.length > 0 && (
          <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Failed attempts <span className="text-gray-400">({failed.length})</span>
              </p>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Delivery", "Customer", "Partner", "Items", "Status", "Action"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-2.5 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {failed.map((d) => (
                    <tr key={d.id}>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{d.deliveryNo}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.customerName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.partnerName || "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{d.items}</td>
                      <td className="px-4 py-2.5">{deliveryStatusPill(d.status)}</td>
                      <td className="px-4 py-2.5 text-sm">
                        <Button size="sm" variant="outline" onClick={() => handleReattempt(d)}>
                          <RotateCcw /> Re-attempt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Dispatch {dispatchTarget?.deliveryNo ?? ""}</SheetTitle>
            <SheetDescription>
              Assign a partner to dispatch this delivery.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-sm">
              <p className="font-medium text-gray-800">
                {dispatchTarget?.customerName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {dispatchTarget?.address}, {dispatchTarget?.pincode} ·{" "}
                {dispatchTarget?.zoneName || "No zone"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{dispatchTarget?.items}</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Delivery Partner</Label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
                  {activePartners.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name} · {p.vehicleType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={confirmDispatch} disabled={!selectedPartner}>
              <Send /> Confirm Dispatch
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
