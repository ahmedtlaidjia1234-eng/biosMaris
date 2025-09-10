import { BackEndLink } from '@/lib/links';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Number;
  category: string;
  images: string[];
  qrCode: Number;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
}


const API_BASE = `${BackEndLink}/api/products`;

export class ProductManager {
  // ✅ Fetch all products from backend
  // static async getProducts(): Promise<Product[]> {
  //   try {
  //     const res = await fetch(`${API_BASE}/getProducts`);
  //     if (!res.ok) throw new Error("Failed to fetch products");
  //     return await res.json();
  //   } catch (err) {
  //     console.error("Error fetching products:", err);
  //     return []; // fallback empty list
  //   }
  // }
 static async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/getProducts`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data
    } catch (err) {
      console.error("Error fetching products:", err);
      return []; // return empty array if DB is empty or error happens
    }
  }

  // ✅ fetch a single product
  static async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  }

  // ✅ Add product to backend
  static async addProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/addProduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }
  
  );

    // ✅ Log more useful details
    const text = await res.text();
    console.log("Raw response:", text);

    if (!res.ok) {
      throw new Error(`Failed to add product: ${res.status} ${res.statusText} → ${text}`);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Error adding product:", err);
    return null;
  }
}


  // ✅ Update product (optional)
  static async updateProduct(qrcode: string, updates: Partial<Product>): Promise<void> {
    try {
      await fetch(`${API_BASE}/updateProduct`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error("Error updating product:", err);
    }
  }

  // ✅ Delete product (optional)
  static async deleteProduct(qrCode: integer): Promise<void> {
    try {
      await fetch(`${API_BASE}/deleteProduct`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ qrCode }),
});
      // console.log(qrCode)
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  // ✅ Search product by QR code (client-side filter)
  // static async searchByQR(qrCode: string): Promise<Product | null> {
  //   const products = await this.getProducts();
  //   return products.find((p) => p.qrCode === qrCode) || null;
  // }
}
