import CreateEventDialog from "@/app/(root)/events/components/CreateEventDialog";
import EventsTable from "@/app/(root)/events/components/EventsTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const Event = () => {
  return (
    <PageContainer title="Events" addButton={<CreateEventDialog />}>
      <PageTableContainer>
        <EventsTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default Event;
