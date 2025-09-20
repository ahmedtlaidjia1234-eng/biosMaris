import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { ProductManager, Product } from "@/lib/products";
import { CustomCursor } from "@/components/CustomCursor";
import { BackEndLink } from "@/lib/links";

/* -------------------- TYPES -------------------- */
interface AdminProps {
  onBack: () => void;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/* -------------------- ADMIN COMPONENT -------------------- */
export default function Admin({ onBack }: AdminProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const API_BASE = `${BackEndLink}/api/admin`;

  /* -------------------- LOAD INITIAL DATA -------------------- */
  useEffect(() => {
    const authState = window.localStorage.getItem("Auth");
    const storedUser = window.localStorage.getItem("user");

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setEmail(userObj.email || "");
      setNumber(userObj.phone ? userObj.phone : "");
      setData(userObj);
    }

    if (authState === "true") {
      loadProducts();
      loadMessages();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  /* -------------------- LOAD PRODUCTS -------------------- */
  const loadProducts = async () => {
    try {
      const allProducts = await ProductManager.getProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  };

  /* -------------------- LOAD MESSAGES -------------------- */
  const loadMessages = async () => {
    try {
      const res = await fetch(`${BackEndLink}/api/contact/list`);
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des messages:", err);
    }
  };

  /* -------------------- MARK MESSAGE AS READ -------------------- */
  const handleMarkAsRead = async (id: string, email: string) => {
    console.log(id)
    const updatedMessages = messages.map((m) =>
      m.id === id ? { ...m, read: true } : m
    );

    try {
      const fet = await fetch(`${BackEndLink}/api/contact/updatemessage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (fet.ok) {
        setMessages(updatedMessages);
      }
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  /* -------------------- DELETE MESSAGE -------------------- */
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      const del = await fetch(`${BackEndLink}/api/contact/deletemessage`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (del.ok) {
        const updatedMessages = messages.filter((m) => m.id !== id);
        setMessages(updatedMessages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* -------------------- EDIT SETTINGS -------------------- */
  const editHandle = async () => {
    try {
      const res = await fetch(`${API_BASE}/editAdmin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, number }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmail(data.admin.email);
        setNumber(data.admin.phone);
        setData(data.admin);
        window.localStorage.setItem("user", JSON.stringify(data.admin));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* -------------------- LOGIN -------------------- */
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.admin.auth === true) {
        window.localStorage.setItem("Auth", "true");
        setIsAuthenticated(true);
        window.localStorage.setItem("user", JSON.stringify(data.admin));
        setData(data.admin);
      } else {
        alert(data.message || "Mot de passe incorrect");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const HandleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.admin.auth === false) {
          window.localStorage.setItem("Auth", "false");
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* -------------------- DELETE PRODUCT -------------------- */
  const handleDeleteProduct = async (qrCode: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await ProductManager.deleteProduct(qrCode);
      await loadProducts();
    }
  };

  /* -------------------- SAVE PRODUCT -------------------- */
  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    try {
      if (editingProduct) {
        await ProductManager.updateProduct(editingProduct.id, productData);
      } else {
        await ProductManager.addProduct({
          ...productData,
          price: Number(productData.price),
        });
      }
      await loadProducts();
      setEditingProduct(null);
      setIsAddingProduct(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Impossible d'enregistrer le produit");
    }
  };

  /* -------------------- LOGIN SCREEN -------------------- */
  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Se connecter
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  /* -------------------- ADMIN PANEL -------------------- */
  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Administration Bios Maris
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button onClick={() => setIsAddingProduct(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
              <Button variant="outline" onClick={HandleLogout} className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* TABS */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="messages">
                Messages ({messages.filter((m) => !m.read).length}/{messages.length})
              </TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* MESSAGES */}
            <TabsContent value="messages" className="space-y-6">
  {messages.length > 0 ? (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={`hover:shadow-lg transition-shadow ${
            !message.read ? "border-yellow-400 bg-yellow-50" : ""
          }`}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg break-words">
                  {message.sujet}
                </CardTitle>
                <p className="text-sm text-gray-600 break-words">
                  De: {message.nom} ({message.email})
                </p>
              </div>
              <span className="text-xs text-gray-500 shrink-0">
                {new Date(message.createdAt).toLocaleString("fr-FR")}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3 break-words">
              <strong>Téléphone:</strong> {message.phone}
            </p>
            <p className="text-sm bg-gray-50 p-3 rounded break-words">
              {message.message}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {!message.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleMarkAsRead(message.id, message.email)
                  }
                >
                  Marquer comme lu
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteMessage(message.id)}
              >
                Supprimer
              </Button>
              {/* <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  (window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`)
                }
              >
                Répondre
              </Button> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-gray-600">Aucun message reçu.</p>
      <p className="text-sm text-gray-500 mt-2">
        Les messages envoyés via le formulaire de contact apparaîtront ici.
      </p>
    </div>
  )}
</TabsContent>


            {/* PRODUCTS */}
            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.qrCode)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <Badge className="mb-2">{product.category}</Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {product.description}
                      </p>
                      <p className="font-semibold">{product.price} DA</p>
                      <p className="text-xs text-gray-500">QR: {product.qrCode}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* SETTINGS */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email de contact</label>
                    <Input
                      value={email ?? ""}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && editHandle()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                    <Input
                      value={number ?? ""}
                      type="text"
                      onChange={(e) => setNumber(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && editHandle()}
                    />
                  </div>

                  <Button onClick={editHandle}>Sauvegarder les paramètres</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* PRODUCT FORM DIALOG */}
          <ProductFormDialog
            product={editingProduct}
            isOpen={!!editingProduct || isAddingProduct}
            onClose={() => {
              setEditingProduct(null);
              setIsAddingProduct(false);
            }}
            onSave={handleSaveProduct}
          />
        </div>
      </div>
    </>
  );
}

/* -------------------- PRODUCT FORM -------------------- */
interface ProductFormDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
}

function ProductFormDialog({ product, isOpen, onClose, onSave }: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [""],
    qrCode: "",
    ingredients: [""],
    benefits: [""],
    usage: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        images: product.images || [""],
        qrCode: product.qrCode,
        ingredients: product.ingredients || [""],
        benefits: product.benefits || [""],
        usage: product.usage || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [""],
        qrCode: "",
        ingredients: [""],
        benefits: [""],
        usage: "",
      });
    }
  }, [product]);

  const handleSubmit = () => {
    const cleanedData = {
      ...formData,
      price: Number(formData.price),
      images: formData.images.filter((img) => img.trim()),
      ingredients: formData.ingredients.filter((ing) => ing.trim()),
      benefits: formData.benefits.filter((ben) => ben.trim()),
    };
    onSave(cleanedData);
  };

  const addArrayItem = (field: "images" | "ingredients" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateArrayItem = (field: "images" | "ingredients" | "benefits", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeArrayItem = (field: "images" | "ingredients" | "benefits", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nom du produit"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Prix"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
          />
          <Input
            placeholder="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          />
          <Input
            placeholder="QR Code"
            value={formData.qrCode}
            onChange={(e) => setFormData((prev) => ({ ...prev, qrCode: e.target.value }))}
          />

          {/* Arrays: Images, Ingredients, Benefits */}
          {(["images", "ingredients", "benefits"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
              {formData[field].map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    placeholder={`${field} ${i + 1}`}
                    value={item}
                    onChange={(e) => updateArrayItem(field, i, e.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeArrayItem(field, i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem(field)}>
                Ajouter {field.slice(0, -1)}
              </Button>
            </div>
          ))}

          <Textarea
            placeholder="Utilisation"
            value={formData.usage}
            onChange={(e) => setFormData((prev) => ({ ...prev, usage: e.target.value }))}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
