import CreateGalleryDialog from "@/app/(root)/gallery/components/CreateGalleryDialog";
import GalleryTable from "@/app/(root)/gallery/components/GalleryTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const Gallery = () => {
  return (
    <PageContainer title="Gallery" addButton={<CreateGalleryDialog />}>
      <PageTableContainer>
        <GalleryTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default Gallery;
