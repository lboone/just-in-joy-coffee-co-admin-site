"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ToggleActiveIconProps = {
  id: string; // Document ID
  active: boolean; // Current active state
  updateAction: (
    id: string,
    updateValue: { active: boolean }
  ) => Promise<{ success: boolean; message?: string }>; // Action call for updating
};

const ToggleActiveIcon = ({
  id,
  active,
  updateAction,
}: ToggleActiveIconProps) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await updateAction(id, { active: !isActive });
      if (res.success) {
        setIsActive(!isActive);
        toast.success(
          `Successfully updated to ${isActive ? "inactive" : "active"}`
        );
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update active state");
      }
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast.error("An error occurred while updating the active state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center justify-center hover:cursor-pointer"
      aria-label={`Toggle active state to ${!isActive ? "active" : "inactive"}`}
    >
      {isActive ? (
        <ThumbsUpIcon
          className={`text-blue-900 dark:text-blue-600 ${
            loading ? "opacity-50" : ""
          }`}
          size="18"
        />
      ) : (
        <ThumbsDownIcon
          className={`text-red-900 dark:text-red-600 ${
            loading ? "opacity-50" : ""
          }`}
          size="18"
        />
      )}
    </button>
  );
};

export default ToggleActiveIcon;
