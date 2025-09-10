import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Search, X } from 'lucide-react';
import { ProductManager, Product } from '@/lib/products';
import { ProductCard } from './ProductCard';

interface SearchSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchSystem = ({ isOpen, onClose }: SearchSystemProps) => {
  const [searchMode, setSearchMode] = useState<'text' | 'qr'>('text');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // 🔎 run text search when searchTerm changes
  useEffect(() => {
    const runSearch = async () => {
      if (searchTerm.trim()) {
        await handleTextSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    };
    runSearch();
  }, [searchTerm]);

  const handleTextSearch = async (term: string) => {
    if (!term.trim()) return;

    const products = await ProductManager.getProducts();
    const lowerTerm = term.toLowerCase();

    const results = products.filter((product) =>
      (product.name?.toLowerCase() || '').includes(lowerTerm) ||
      (product.description?.toLowerCase() || '').includes(lowerTerm) ||
      (product.category?.toLowerCase() || '').includes(lowerTerm) 
      // ||
      // (product.qrCode || '').includes(lowerTerm)
    );

    setSearchResults(results);
  };

const handleQRSearch = async () => {
  if (!qrCode.trim()) return;

  const products = await ProductManager.getProducts();

  const found = products.filter((p) =>
    String(p.qrCode || '').includes(qrCode) // force string
  );

  console.log(found)

  setSearchResults(found);
};

  const simulateQRScan = async () => {
    setIsScanning(true);

    setTimeout(async () => {
      const products = await ProductManager.getProducts();
      if (products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setQrCode(randomProduct.qrCode);
        setSearchResults([randomProduct]);
      }
      setIsScanning(false);
    }, 2000);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setQrCode('');
    setSearchResults([]);
    setSearchMode('text');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche de Produits
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={searchMode === 'text' ? 'default' : 'outline'}
              onClick={() => setSearchMode('text')}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Recherche Texte
            </Button>
            <Button
              variant={searchMode === 'qr' ? 'default' : 'outline'}
              onClick={() => setSearchMode('qr')}
              className="flex-1"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scanner QR
            </Button>
          </div>

          {/* Text Search */}
          {searchMode === 'text' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher par nom, description, catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSearch(searchTerm)}
                  className="flex-1"
                />
                <Button onClick={() => handleTextSearch(searchTerm)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* QR Code Search */}
          {searchMode === 'qr' && (
            <div className="space-y-4">
              {/* <Card className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {isScanning ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    ) : (
                      <QrCode className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <Button
                    onClick={simulateQRScan}
                    disabled={isScanning}
                    className="w-full"
                  >
                    {isScanning ? 'Scan en cours...' : 'Démarrer le scan QR'}
                  </Button>
                </CardContent>
              </Card> */}

              <div className="flex gap-2">
                <Input
                  placeholder="Ou saisir le code QR manuellement..."
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQRSearch()}
                  className="flex-1"
                />
                <Button onClick={handleQRSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(searchResults.length > 0 || searchTerm || qrCode) && (
            <Button variant="outline" onClick={resetSearch} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Réinitialiser la recherche
            </Button>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Résultats de recherche ({searchResults.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {(searchTerm || qrCode) && searchResults.length === 0 && !isScanning && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Aucun produit trouvé pour votre recherche.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
