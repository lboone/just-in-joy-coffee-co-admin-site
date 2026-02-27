"use client";

import TableSkeleton from "@/components/layout/TableSkeleton";
import ToggleActiveIcon from "@/components/layout/ToggleActiveIcon";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllSocials,
  reorderSocials,
  updateActiveStatusSocial,
} from "@/lib/actions/social.actions";
import { formatDate } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteSocialDialog from "./DeleteSocialDialog";
import UpdateSocialDialog from "./UpdateSocialDialog";

// Sortable Row Component
function SortableTableRow({
  social,
  children,
}: {
  social: Social;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: social._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50 z-50" : ""} hover:bg-gray-50`}
    >
      <TableCell
        className="w-8 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </TableCell>
      {children}
    </TableRow>
  );
}

const SocialsTable = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllSocials();
        if (result.success) {
          setSocials(result.data);
        } else {
          toast.error("Failed to fetch socials");
        }
      } catch (error) {
        console.error("Error fetching socials:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = async (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = socials.findIndex((item) => item._id === active.id);
    const newIndex = socials.findIndex((item) => item._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const reorderedItems = arrayMove(socials, oldIndex, newIndex);
    setSocials(reorderedItems);

    try {
      // Send the reordered items to the backend
      const reorderData = reorderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      const result = await reorderSocials(reorderData);

      if (result.success) {
        toast.success("Items reordered successfully");
      } else {
        // Revert the optimistic update if the backend call fails
        setSocials(socials);
        toast.error("Failed to reorder items");
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setSocials(socials);
      console.error("Error reordering items:", error);
      toast.error("Error reordering items");
    }
  };

  // Handle refresh after update/delete operations
  const handleRefresh = async () => {
    try {
      const result = await getAllSocials();
      if (result.success) {
        setSocials(result.data);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  if (loading) {
    return (
      <TableSkeleton numRows={5}>
        <></>
      </TableSkeleton>
    );
  }

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="border border-gray-200 dark:border-gray-700">
          <TableCaption>
            A list of all your Socials. Drag rows to reorder.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-accent text-white">
              <TableHead className="w-8"></TableHead> {/* Drag handle column */}
              <TableHead>Instagram Reel URL</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="hidden lg:table-cell">Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={socials.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              {socials.map((social) => (
                <SortableTableRow key={social._id} social={social}>
                  <TableCell className="font-medium">
                    {social.permalink}
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleActiveIcon
                      id={social._id}
                      active={social.active}
                      updateAction={updateActiveStatusSocial}
                    />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {social.createdAt ? formatDate(social.createdAt) : ""}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {social.updatedAt ? formatDate(social.updatedAt) : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <UpdateSocialDialog
                      social={social}
                      onUpdate={handleRefresh}
                    />
                    <DeleteSocialDialog
                      socialId={social._id}
                      requiredPhrase="Delete social"
                      onDelete={handleRefresh}
                    />
                  </TableCell>
                </SortableTableRow>
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
};

export default SocialsTable;
