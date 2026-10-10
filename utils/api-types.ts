export interface ProductImage { file_name: string; title: string }
export interface Taxonomy { id: string; name: string; slug?: string }
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  is_location_offer: boolean;
  is_rental: boolean;
  product_image: ProductImage;
  category: Taxonomy;
  brand: Taxonomy;
}
export interface ProductPage {
  current_page: number;
  data: Product[];
  last_page: number;
  per_page: number;
  total: number;
}
