import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/products";
import { useTheme } from "../hooks/useTheme";




interface ProductCardProps {
  product: Product;
}

const stored = localStorage.getItem('bios-maris-theme') as Theme;

// console.log(Theme)
export const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasImages = product?.images && product.images.length > 0;

  const nextImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };


  return (
    <Card
    
      className=" group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer border-[#d8be7d]/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div className="relative h-64 overflow-hidden">
        <img
        // style={hasImages ? {} : {scale }}
          src={hasImages ? product.images[currentImageIndex] : "/assets/placeholder.png"}
          alt={product?.name ?? "Product"}
          className={hasImages ? "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" : "w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"}
        />

        {/* Image Navigation */}
        {isHovered && hasImages && product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Image Indicators */}
        {hasImages && product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Category Badge */}
        {product?.category && (
          <Badge className="absolute top-2 left-2 bg-[#d8be7d] hover:bg-[#c9a96b] text-gray-900">
            {product.category}
          </Badge>
        )}

        {/* Price Badge */}
        {product?.price && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            {product.price}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
          {product?.name ?? "Produit sans nom"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product?.description ?? "Pas de description disponible."}
        </p>

        {/* Expanded Details on Hover */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isHovered ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {product?.ingredients?.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                Ingrédients:
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {product?.benefits?.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                Bienfaits:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-[#d8be7d] rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product?.usage && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                Usage:
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {product.usage}
              </p>
            </div>
          )}

{/*           <Button className="w-full bg-[#d8be7d] hover:bg-[#c9a96b] text-gray-900">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commander
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};
