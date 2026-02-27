"use client";

import HoverImage from "@/components/layout/HoverImage";
import TableSkeleton from "@/components/layout/TableSkeleton";
import ToggleActiveIcon from "@/components/layout/ToggleActiveIcon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  getAllShoutOuts,
  reorderShoutOuts,
  updateActiveStatusShoutOut,
} from "@/lib/actions/shout-out.actions";
import { formatDate } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import DeleteShoutOutDialog from "./DeleteShoutOutDialog";
import UpdateShoutOutDialog from "./UpdateShoutOutDialog";

interface SortableTableRowProps {
  shoutOut: ShoutOut;
  onRefresh: () => Promise<void>;
}

function SortableTableRow({ shoutOut, onRefresh }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shoutOut._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-50" : ""}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <HoverImage text={shoutOut.name} imageUrl={shoutOut.img} />
        </div>
      </TableCell>
      <TableCell className="font-medium">{shoutOut.title}</TableCell>
      <TableCell className="font-medium text-sm leading-tight max-w-xs truncate whitespace-nowrap overflow-hidden hidden md:table-cell">
        <HoverCard>
          <HoverCardTrigger className="cursor-pointer hover:underline underline-offset-4">
            {shoutOut.description}
          </HoverCardTrigger>
          <HoverCardContent className="whitespace-pre-wrap">
            {shoutOut.description}
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="font-medium">{shoutOut.location}</TableCell>
      <TableCell className="text-center">
        <ToggleActiveIcon
          id={shoutOut._id}
          active={shoutOut.active}
          updateAction={updateActiveStatusShoutOut}
        />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {shoutOut.createdAt ? formatDate(shoutOut.createdAt) : ""}
      </TableCell>
      <TableCell className="text-center">
        <UpdateShoutOutDialog shoutOut={shoutOut} onUpdate={onRefresh} />
        <DeleteShoutOutDialog
          shoutOutId={shoutOut._id}
          requiredPhrase={shoutOut.title}
          onDelete={onRefresh}
        />
      </TableCell>
    </TableRow>
  );
}

const ShoutOutsTable = () => {
  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchShoutOuts = async () => {
    try {
      const response = await getAllShoutOuts();
      if (response.success) {
        setShoutOuts(response.data);
      } else {
        toast.error("Failed to fetch shout-outs");
      }
    } catch (error) {
      console.error("Error fetching shout-outs:", error);
      toast.error("Error fetching shout-outs");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchShoutOuts();
  };

  useEffect(() => {
    fetchShoutOuts();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = shoutOuts.findIndex((item) => item._id === active.id);
    const newIndex = shoutOuts.findIndex((item) => item._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const newShoutOuts = arrayMove(shoutOuts, oldIndex, newIndex);
    setShoutOuts(newShoutOuts);

    // Prepare the reorder data
    const reorderedItems = newShoutOuts.map((item, index) => ({
      id: item._id,
      order: index,
    }));

    try {
      const result = await reorderShoutOuts(reorderedItems);
      if (result.success) {
        toast.success("Shout-outs reordered successfully!");
      } else {
        // Revert on error
        setShoutOuts(shoutOuts);
        toast.error(result.message || "Failed to reorder shout-outs");
      }
    } catch (error) {
      // Revert on error
      setShoutOuts(shoutOuts);
      console.error("Error reordering shout-outs:", error);
      toast.error("Error reordering shout-outs");
    }
  };

  if (loading) {
    return (
      <TableSkeleton numRows={7}>
        <></>
      </TableSkeleton>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table className="border border-gray-200 dark:border-gray-700">
        <TableCaption>A list of all your Shout Outs.</TableCaption>
        <TableHeader>
          <TableRow className="bg-accent text-white">
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead className="hidden lg:table-cell">Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={shoutOuts.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {shoutOuts.map((shoutOut: ShoutOut) => (
              <SortableTableRow
                key={shoutOut._id}
                shoutOut={shoutOut}
                onRefresh={handleRefresh}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
};

export default ShoutOutsTable;
