export interface Dish {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  price: number;
  featured: boolean;
  categoryId: string;
}
