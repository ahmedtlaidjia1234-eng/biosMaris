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

  // Load products
  const loadProducts = async () => {
    try {
      const allProducts = await ProductManager.getProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  };

  // Load messages
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
    localStorage.setItem("bios_maris_messages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  // Mark message as read
  const handleMarkAsRead = async (id: string, email: string, subject: string) => {
    const updatedMessages = messages.map((m) =>
      m.id === id ? { ...m, read: true } : m
    );

    try {
      const fet = await fetch(`${BackEndLink}/api/contact/updatemessage/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, read: true }),
      });

      if (fet.ok) {
        saveMessages(updatedMessages);
      }
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  // Delete message
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
        saveMessages(updatedMessages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Edit settings
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

  // Login
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

  // Logout
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

  // Delete product
  const handleDeleteProduct = async (qrCode: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await ProductManager.deleteProduct(qrCode);
      await loadProducts();
    }
  };

  // Save product
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
                              onClick={() => handleMarkAsRead(message.id, message.email, message.subject)}
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
            {/* ... باقي الكود تاع المنتجات والإعدادات نفسو ... */}
          </Tabs>
        </div>
      </div>
    </>
  );
}
