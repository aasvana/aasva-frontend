import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { MoveLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const goBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}

  return (
    <div className="flex items-center justify-between border-gray-200 dark:border-neutral-700">
      <Button
        variant="secondary"
        className="hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
        onClick={() => goBack()}
      >
        <MoveLeft />
      </Button>
    </div>
  );
};

export default BackButton;
