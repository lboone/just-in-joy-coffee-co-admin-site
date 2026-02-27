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
  getAllGalleries,
  reorderGalleries,
  updateActiveStatusGallery,
} from "@/lib/actions/gallery.actions";
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
import DeleteGalleryDialog from "./DeleteGalleryDialog";
import UpdateGalleryDialog from "./UpdateGalleryDialog";

// Sortable Row Component
function SortableTableRow({
  gallery,
  children,
}: {
  gallery: Gallery;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gallery._id });

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

const GalleryTable = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
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
        const result = await getAllGalleries();
        if (result.success) {
          setGalleries(result.data);
        } else {
          toast.error("Failed to fetch galleries");
        }
      } catch (error) {
        console.error("Error fetching galleries:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = galleries.findIndex((item) => item._id === active.id);
    const newIndex = galleries.findIndex((item) => item._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const reorderedItems = arrayMove(galleries, oldIndex, newIndex);
    setGalleries(reorderedItems);

    try {
      // Send the reordered items to the backend
      const reorderData = reorderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      const result = await reorderGalleries(reorderData);

      if (result.success) {
        toast.success("Items reordered successfully");
      } else {
        // Revert the optimistic update if the backend call fails
        setGalleries(galleries);
        toast.error("Failed to reorder items");
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setGalleries(galleries);
      console.error("Error reordering items:", error);
      toast.error("Error reordering items");
    }
  };

  // Handle refresh after update/delete operations
  const handleRefresh = async () => {
    try {
      const result = await getAllGalleries();
      if (result.success) {
        setGalleries(result.data);
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
            A list of all your Gallery items. Drag rows to reorder.
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
              items={galleries.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              {galleries.map((gallery) => (
                <SortableTableRow key={gallery._id} gallery={gallery}>
                  <TableCell className="font-medium">
                    <HoverImage
                      imageUrl={gallery.img}
                      text={gallery.title}
                      cardTitle={gallery.alt}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {gallery.subtitle}
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleActiveIcon
                      id={gallery._id}
                      active={gallery.active}
                      updateAction={updateActiveStatusGallery}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {gallery.createdAt ? formatDate(gallery.createdAt) : ""}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {gallery.updatedAt ? formatDate(gallery.updatedAt) : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    <UpdateGalleryDialog
                      gallery={gallery}
                      onUpdate={handleRefresh}
                    />
                    <DeleteGalleryDialog
                      galleryId={gallery._id}
                      requiredPhrase={gallery.title}
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

export default GalleryTable;
