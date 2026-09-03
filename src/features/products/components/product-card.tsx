import Link from "next/link";
import type { Product } from "../types/product.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductCard({ product }: ProductCardProps) {
  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category || "Apparel";

  const priceNum =
    typeof product.price === "number"
      ? product.price
      : typeof product.basePrice === "number"
      ? product.basePrice
      : parseFloat(String(product.basePrice || 0));

  const displayName = product.title || product.name || "Product";

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      {/* Image placeholder */}
      <div className="flex aspect-video items-center justify-center rounded-t-xl bg-foreground/5 text-4xl">
        📦
      </div>

      <CardHeader>
        <div className="mb-1">
          <span className="inline-block rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider">
            {categoryName}
          </span>
        </div>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <p className="text-xl font-semibold">
          ৳{priceNum.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter>
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
