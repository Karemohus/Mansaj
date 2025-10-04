
export interface FurnitureItem {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
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
