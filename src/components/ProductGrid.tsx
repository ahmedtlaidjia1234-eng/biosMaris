import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ProductManager, Product } from '@/lib/products';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadProducts = async () => {
  try {
    const allProducts = await ProductManager.getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
    setProducts([]);
    setFilteredProducts([]);
  }
};

    loadProducts();
    
    // Listen for storage changes to update products when admin makes changes
    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(products?.map(p => p.category)))];

  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Produits
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez notre gamme complète de compléments alimentaires naturels 
            pour votre bien-être quotidien
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
  {categories.map((category,index) => {
    // fallback: if category is empty/null, give it a safe string
    const safeValue = category && category.trim() !== "" ? category : "uncategorized";
    return (
      <SelectItem key={`${safeValue}-${index}`} value={safeValue}>
        {category === "all"
          ? "Toutes les catégories"
          : category && category.trim() !== ""
          ? category
          : "Sans catégorie"}
      </SelectItem>
    );
  })}
</SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts?.map((product, index) => (
            <div
              key={product.id}
              className=" fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Aucun produit trouvé pour votre recherche.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};