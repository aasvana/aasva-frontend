import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mars, Venus, X } from "lucide-react";
import React, { useState } from "react";
const uuidv4 = () => crypto.randomUUID();

const TravellersDetails = () => {
  const [travellers, setTravellers] = useState([
    { id: uuidv4(), name: "", age: "", gender: "male" },
    { id: uuidv4(), name: "", age: "", gender: "female" },
  ]);

  const handleAddTraveller = () => {
    setTravellers((prev) => [
      ...prev,
      { id: uuidv4(), name: "", age: "", gender: "male" },
    ]);
  };

  const handleRemoveTraveller = (id: string) => {
    setTravellers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (id: string, key: string, value: string) => {
    setTravellers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddTraveller}>
          Add New Traveller
        </Button>
      </div>

      {travellers.map((traveller, index) => (
        <div
          key={traveller.id}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-md p-4 mb-4"
        >
          {index !== 0 && (
            <button
              type="button"
              onClick={() => handleRemoveTraveller(traveller.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor={`name-${traveller.id}`}>Traveller Name</Label>
            <Input
              type="text"
              id={`name-${traveller.id}`}
              placeholder="John Doe"
              className="bg-white"
              value={traveller.name}
              onChange={(e) =>
                handleChange(traveller.id, "name", e.target.value)
              }
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`age-${traveller.id}`}>Traveller Age</Label>
            <Input
              type="number"
              id={`age-${traveller.id}`}
              placeholder="30"
              className="bg-white"
              value={traveller.age}
              onChange={(e) => handleChange(traveller.id, "age", e.target.value)}
            />
          </div>

          <div className="flex flex-row items-end gap-4">
            <div className="w-full">
              <label
                htmlFor={`male-${traveller.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border rounded-md p-2",
                  traveller.gender === "male"
                    ? "bg-blue-100 border-blue-600 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                )}
              >
                <input
                  type="radio"
                  id={`male-${traveller.id}`}
                  name={`gender-${traveller.id}`}
                  value="male"
                  checked={traveller.gender === "male"}
                  onChange={() => handleChange(traveller.id, "gender", "male")}
                  className="sr-only"
                />
                <Mars className="w-5 h-5" />
                <span>Male</span>
              </label>
            </div>
            <div className="w-full">
              <label
                htmlFor={`female-${traveller.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border rounded-md p-2",
                  traveller.gender === "female"
                    ? "bg-pink-100 border-pink-600 text-pink-700"
                    : "bg-white border-gray-300 text-gray-700"
                )}
              >
                <input
                  type="radio"
                  id={`female-${traveller.id}`}
                  name={`gender-${traveller.id}`}
                  value="female"
                  checked={traveller.gender === "female"}
                  onChange={() => handleChange(traveller.id, "gender", "female")}
                  className="sr-only"
                />
                <Venus className="w-5 h-5" />
                <span>Female</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TravellersDetails;
