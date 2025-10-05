
export interface FurnitureItem {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  imageUrl: string;
  price: string;
  productUrl: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    text: string;
    imageUrl: string;
  };
  furniture: {
    title: string;
    items: FurnitureItem[];
  };
  store: {
    title: string;
    subtitle: string;
    items: StoreProduct[];
  };
  clients: {
    title: string;
    items: Client[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}
