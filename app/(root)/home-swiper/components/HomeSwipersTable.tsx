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
  getAllHomeSwipers,
  reorderHomeSwipers,
  updateActiveStatusHomeSwiper,
} from "@/lib/actions/home-swiper.actions";
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
import DeleteHomeSwiperDialog from "./DeleteHomeSwiperDialog";
import UpdateHomeSwiperDialog from "./UpdateHomeSwiperDialog";

// Sortable Row Component
function SortableTableRow({
  homeSwiper,
  children,
}: {
  homeSwiper: HomeSwiper;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: homeSwiper._id });

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

const HomeSwipersTable = () => {
  const [homeSwipers, setHomeSwipers] = useState<HomeSwiper[]>([]);
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
        const result = await getAllHomeSwipers();
        if (result.success) {
          setHomeSwipers(result.data);
        } else {
          toast.error("Failed to fetch home swipers");
        }
      } catch (error) {
        console.error("Error fetching home swipers:", error);
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

    const oldIndex = homeSwipers.findIndex((item) => item._id === active.id);
    const newIndex = homeSwipers.findIndex((item) => item._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const reorderedItems = arrayMove(homeSwipers, oldIndex, newIndex);
    setHomeSwipers(reorderedItems);

    try {
      // Send the reordered items to the backend
      const reorderData = reorderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      const result = await reorderHomeSwipers(reorderData);

      if (result.success) {
        toast.success("Items reordered successfully");
      } else {
        // Revert the optimistic update if the backend call fails
        setHomeSwipers(homeSwipers);
        toast.error("Failed to reorder items");
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setHomeSwipers(homeSwipers);
      console.error("Error reordering items:", error);
      toast.error("Error reordering items");
    }
  };

  // Handle refresh after update/delete operations
  const handleRefresh = async () => {
    try {
      const result = await getAllHomeSwipers();
      if (result.success) {
        setHomeSwipers(result.data);
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
            A list of all your Home Swipers. Drag rows to reorder.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-accent text-white">
              <TableHead className="w-8"></TableHead> {/* Drag handle column */}
              <TableHead>Name</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={homeSwipers.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              {homeSwipers.map((homeSwiper) => (
                <SortableTableRow key={homeSwiper._id} homeSwiper={homeSwiper}>
                  <TableCell className="font-medium">
                    <HoverImage
                      text={homeSwiper.alt}
                      imageUrl={homeSwiper.src}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleActiveIcon
                      id={homeSwiper._id}
                      active={homeSwiper.active}
                      updateAction={updateActiveStatusHomeSwiper}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {homeSwiper.createdAt
                      ? formatDate(homeSwiper.createdAt)
                      : ""}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {homeSwiper.updatedAt
                      ? formatDate(homeSwiper.updatedAt)
                      : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <UpdateHomeSwiperDialog
                      homeSwiper={homeSwiper}
                      onUpdate={handleRefresh}
                    />
                    <DeleteHomeSwiperDialog
                      homeSwiperId={homeSwiper._id}
                      requiredPhrase={homeSwiper.alt}
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

export default HomeSwipersTable;
