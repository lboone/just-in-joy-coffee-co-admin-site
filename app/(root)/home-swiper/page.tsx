import CreateHomeSwiperDialog from "@/app/(root)/home-swiper/components/CreateHomeSwiperDialog";
import HomeSwipersTable from "@/app/(root)/home-swiper/components/HomeSwipersTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const HomeSwiper = () => {
  return (
    <PageContainer title="Home Swipers" addButton={<CreateHomeSwiperDialog />}>
      <PageTableContainer>
        <HomeSwipersTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default HomeSwiper;
