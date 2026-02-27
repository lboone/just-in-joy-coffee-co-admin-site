import TableSkeleton from "@/components/layout/TableSkeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllEvents } from "@/lib/actions/event.actions";
import { formatDate, formatTime } from "@/lib/utils";
import DeleteEventDialog from "./DeleteEventDialog";
import UpdateEventDialog from "./UpdateEventDialog";

const EventsTable = async () => {
  const events = await getAllEvents();

  return (
    <TableSkeleton numRows={5}>
      <Table className="border border-gray-200 dark:border-gray-700">
        <TableCaption>A list of all your Events.</TableCaption>
        <TableHeader>
          <TableRow className="bg-accent text-white">
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.data.map((event: Event) => (
            <TableRow key={event._id}>
              <TableCell className="font-medium whitespace-normal text-sm leading-tight max-w-xs">
                {event.name}
              </TableCell>
              <TableCell className="whitespace-normal text-sm leading-tight max-w-xs hidden md:table-cell">
                <div>
                  {event.address}
                  <br />
                  {event.city}, {event.state} {event.zip}
                </div>
              </TableCell>
              <TableCell>{event.date ? formatDate(event.date) : ""}</TableCell>
              <TableCell className="whitespace-normal text-sm leading-tight max-w-xs">
                {formatTime(event.starttime)} - {formatTime(event.endtime)}
              </TableCell>
              <TableCell className="text-center">
                <UpdateEventDialog event={event} />
                <DeleteEventDialog
                  eventId={event._id}
                  requiredPhrase={event.name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableSkeleton>
  );
};
export default EventsTable;
