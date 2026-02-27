declare global {
  interface CreateEvent {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    latitude: number;
    longitude: number;
    date: date;
    starttime: string;
    endtime: string;
  }
  interface UpdateEvent {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    date?: date;
    starttime?: string;
    endtime?: string;
  }
  interface Event {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    latitude: number;
    longitude: number;
    date: string;
    starttime: string;
    endtime: string;
    createdAt?: string;
    updatedAt?: string;
  }
  interface CreateFeaturedDrink {
    title: string;
    subtitle: string;
    img: string;
    alt: string;
    orderUrl: string;
    imgKey: string;
  }
  interface UpdateFeaturedDrink {
    title?: string;
    subtitle?: string;
    img?: string;
    alt?: string;
    orderUrl?: string;
    active?: boolean;
    imgKey?: string;
  }
  interface FeaturedDrink {
    _id: string;
    img: string;
    alt: string;
    subtitle: string;
    title: string;
    orderUrl: string;
    imgKey: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  interface CreateGallery {
    title: string;
    subtitle: string;
    img: string;
    alt: string;
    imgKey: string;
  }
  interface UpdateGallery {
    title?: string;
    subtitle?: string;
    img?: string;
    alt?: string;
    active?: boolean;
    imgKey?: string;
  }
  interface Gallery {
    _id: string;
    title: string;
    subtitle: string;
    img: string;
    alt: string;
    imgKey: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  interface CreateHomeSwiper {
    src: string;
    alt: string;
    width: number;
    height: number;
    imgKey: string;
  }
  interface UpdateHomeSwiper {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    active?: boolean;
    imgKey?: string;
  }
  interface HomeSwiper {
    _id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    imgKey: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  interface CreateShoutOut {
    title: string;
    description: string;
    img: string;
    imgAlt: string;
    name: string;
    location: string;
    imgKey: string;
  }
  interface UpdateShoutOut {
    title?: string;
    description?: string;
    img?: string;
    imgAlt?: string;
    name?: string;
    location?: string;
    active?: boolean;
    imgKey?: string;
  }
  interface ShoutOut {
    _id: string;
    title: string;
    description: string;
    img: string;
    imgAlt: string;
    name: string;
    location: string;
    imgKey: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  interface CreateSocial {
    permalink: string;
  }
  interface UpdateSocial {
    permalink?: string;
    active?: boolean;
  }
  interface Social {
    _id: string;
    permalink: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  interface DashboardCardData {
    title: string;
    subTitle: string;
    body: string;
    dataKey: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
  interface DashboardCountsData {
    [key: string]: number;
    featuredDrinksCount: number;
    shoutOutsCount: number;
    eventsCount: number;
    galleriesCount: number;
    homeSwiperCount: number;
    socialsCount: number;
  }
}

export {};
