export type BannerPlacement =
  | "HERO"
  | "SECTION_TOP"
  | "SECTION_MIDDLE"
  | "POPUP";

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
  ctaText?: string | null;
  linkUrl?: string | null;
  placement: BannerPlacement;
  sortOrder: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerQueryFilters {
  placement?: BannerPlacement;
  isActive?: boolean;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  linkUrl?: string;
  placement?: BannerPlacement;
  sortOrder?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {
  id: string;
}

export interface ReorderBannersInput {
  items: { id: string; sortOrder: number }[];
}
