"use client";

import HoverImage from "@/components/layout/HoverImage";
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
  getAllFeaturedDrinks,
  reorderFeaturedDrinks,
  updateActiveStatusFeaturedDrink,
} from "@/lib/actions/featured-drinks.actions";
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
import DeleteFeaturedDrinkDialog from "./DeleteFeaturedDrinkDialog";
import UpdateFeaturedDrinkDialog from "./UpdateFeaturedDrinkDialog";

// Sortable Row Component
function SortableTableRow({
  featuredDrink,
  children,
}: {
  featuredDrink: FeaturedDrink;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: featuredDrink._id });

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

const FeaturedDrinksTable = () => {
  const [featuredDrinks, setFeaturedDrinks] = useState<FeaturedDrink[]>([]);
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
        const result = await getAllFeaturedDrinks();
        if (result.success) {
          setFeaturedDrinks(result.data);
        } else {
          toast.error("Failed to fetch featured drinks");
        }
      } catch (error) {
        console.error("Error fetching featured drinks:", error);
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

    const oldIndex = featuredDrinks.findIndex((item) => item._id === active.id);
    const newIndex = featuredDrinks.findIndex((item) => item._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const reorderedItems = arrayMove(featuredDrinks, oldIndex, newIndex);
    setFeaturedDrinks(reorderedItems);

    try {
      // Send the reordered items to the backend
      const reorderData = reorderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      const result = await reorderFeaturedDrinks(reorderData);

      if (result.success) {
        toast.success("Items reordered successfully");
      } else {
        // Revert the optimistic update if the backend call fails
        setFeaturedDrinks(featuredDrinks);
        toast.error("Failed to reorder items");
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setFeaturedDrinks(featuredDrinks);
      console.error("Error reordering items:", error);
      toast.error("Error reordering items");
    }
  };

  // Handle refresh after update/delete operations
  const handleRefresh = async () => {
    try {
      const result = await getAllFeaturedDrinks();
      if (result.success) {
        setFeaturedDrinks(result.data);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  if (loading) {
    return (
      <TableSkeleton numRows={6}>
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
            A list of all your Featured Drinks. Drag rows to reorder.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-accent text-white">
              <TableHead className="w-8"></TableHead> {/* Drag handle column */}
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={featuredDrinks.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              {featuredDrinks.map((featuredDrink) => (
                <SortableTableRow
                  key={featuredDrink._id}
                  featuredDrink={featuredDrink}
                >
                  <TableCell className="font-medium">
                    <HoverImage
                      text={featuredDrink.title}
                      imageUrl={featuredDrink.img}
                      cardTitle={featuredDrink.alt}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {featuredDrink.subtitle}
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleActiveIcon
                      id={featuredDrink._id}
                      active={featuredDrink.active}
                      updateAction={updateActiveStatusFeaturedDrink}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {featuredDrink.createdAt
                      ? formatDate(featuredDrink.createdAt)
                      : ""}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {featuredDrink.updatedAt
                      ? formatDate(featuredDrink.updatedAt)
                      : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <UpdateFeaturedDrinkDialog
                      featuredDrink={featuredDrink}
                      onUpdate={handleRefresh}
                    />
                    <DeleteFeaturedDrinkDialog
                      featuredDrinkId={featuredDrink._id}
                      requiredPhrase={featuredDrink.subtitle}
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

export default FeaturedDrinksTable;
