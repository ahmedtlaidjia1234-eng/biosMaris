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

  // 🔹 Load products
  const loadProducts = async () => {
    try {
      const allProducts = await ProductManager.getProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  };

  // 🔹 Load messages
  const loadMessages = async () => {
    try {
      const res = await fetch(`${BackEndLink}/api/contact/list`);
      if (res.ok) {
        const messages = await res.json();
        setMessages(messages);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des messages:", err);
    }
  };

  const saveMessages = async (updatedMessages: ContactMessage[]) => {
     await localStorage.setItem("bios_maris_messages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const handleMarkAsRead = async (id: string, email: string) => {
    const updatedMessages = messages.map((m) =>
      m.id === id ? { ...m, read: true } : m
    );

    try {
      const fet = await fetch(`${BackEndLink}/api/contact/updatemessage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (fet.ok) {
        setMessages(updatedMessages);
        console.log(updatedMessages)
      }
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try{
      const del = await fetch(`${BackEndLink}/api/contact/deletemessage`,{
        method : 'DELETE',
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({id})
      });
      if(del.ok){
 const updatedMessages = messages.filter((m) => m.id !== id);
    saveMessages(updatedMessages);
      }
    }
    catch(err){
      console.log(err)
    }
   
  };

  // 🔹 Load auth state
  useEffect(() => {
    const authState = window.localStorage.getItem("Auth");
    const storedUser = window.localStorage.getItem("user");

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setEmail(userObj.email || "");
      setNumber(userObj.phone ? "0" + userObj.phone : "");
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

  // 🔹 Edit settings
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

  // 🔹 Login
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

  // 🔹 Logout
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

  // 🔹 Delete product
  const handleDeleteProduct = async (qrCode: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await ProductManager.deleteProduct(qrCode);
      await loadProducts();
    }
  };

  // 🔹 Save product
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

  // 🔹 Not logged in
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

  // 🔹 Logged in admin panel
  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        {/* HEADER */}
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                Messages ({messages.filter((m) => !m.read).length} non lus)
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
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{message.subject}</CardTitle>
                            <p className="text-sm text-gray-600">
                              De: {message.name} ({message.email})
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString("fr-FR")}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          <strong>Téléphone:</strong> {message.phone}
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded">{message.message}</p>
                        <div className="flex gap-2 pt-2">
                          {!message.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(message.id, message.email)}
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              (window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`)
                            }
                          >
                            Répondre
                          </Button>
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

  const updateArrayItem = (
    field: "images" | "ingredients" | "benefits",
    index: number,
    value: string
  ) => {
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
          <DialogTitle>{product ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom + Prix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prix</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          {/* Catégorie + QR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Code QR</label>
              <Input
                value={formData.qrCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, qrCode: e.target.value }))}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Usage */}
          <div>
            <label className="block text-sm font-medium mb-2">Usage</label>
            <Textarea
              value={formData.usage}
              onChange={(e) => setFormData((prev) => ({ ...prev, usage: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Images */}
          <ArrayField
            label="Images (URLs)"
            field="images"
            values={formData.images}
            onUpdate={updateArrayItem}
            onRemove={removeArrayItem}
            onAdd={addArrayItem}
          />

          {/* Ingredients */}
          <ArrayField
            label="Ingrédients"
            field="ingredients"
            values={formData.ingredients}
            onUpdate={updateArrayItem}
            onRemove={removeArrayItem}
            onAdd={addArrayItem}
          />

          {/* Bienfaits */}
          <ArrayField
            label="Bienfaits"
            field="benefits"
            values={formData.benefits}
            onUpdate={updateArrayItem}
            onRemove={removeArrayItem}
            onAdd={addArrayItem}
          />

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- ARRAY FIELD -------------------- */
function ArrayField({
  label,
  field,
  values,
  onUpdate,
  onRemove,
  onAdd,
}: {
  label: string;
  field: "images" | "ingredients" | "benefits";
  values: string[];
  onUpdate: (field: any, index: number, value: string) => void;
  onRemove: (field: any, index: number) => void;
  onAdd: (field: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {values.map((val, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input
            value={val}
            onChange={(e) => onUpdate(field, index, e.target.value)}
            placeholder={label.slice(0, -1)}
          />
          <Button variant="outline" size="icon" onClick={() => onRemove(field, index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => onAdd(field)}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
}
