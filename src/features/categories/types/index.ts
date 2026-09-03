export interface CategoryCount {
  products: number;
  children?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
    parent?: { id: string; name: string; slug: string } | null;
  } | null;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  _count?: CategoryCount;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeSubItem {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  parentId?: string | null;
  _count?: { products: number };
}

export interface CategoryTreeChildItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  parentId?: string | null;
  _count?: { products: number };
  children?: CategoryTreeSubItem[];
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  _count?: { products: number };
  children: CategoryTreeChildItem[];
}

export interface CategoryQueryFilters {
  onlyRoot?: boolean;
  parentId?: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface ReorderCategoriesInput {
  items: { id: string; sortOrder: number }[];
}
