import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Heart, Leaf, Shield, Award, Users, Clock, Star, CheckCircle, Microscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchSystem } from '@/components/SearchSystem';
import { CustomCursor } from '@/components/CustomCursor';
import { ContactForm } from '@/components/ContactForm';
import Admin from './Admin';
import { BackEndLink } from '@/lib/links';

export default function Index() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
const API_BASE = `${BackEndLink}/api/admin`;

 const getData = async ()=>{
  try{
      const res = await fetch(`${API_BASE}/getadminData`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if(res.ok){
      const data = await res.json()
        setAdminData(data.admin)
        console.log(data)
      }
    }catch(err){
      console.log(err)
    }
 }



  useEffect(() => {
    // Trigger entrance animation
    const fetch =  setTimeout(getData,2000)

    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(timer)
    clearTimeout(fetch)
    };
  }, []);

  if (showAdmin) {
    return  <Admin onBack={() => setShowAdmin(false)} />;
  }

  return (
    <>
    <CustomCursor/>
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Background Blur Element */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <img 
          src="/assets/background-blur.png" 
          alt="" 
          className="w-full h-full object-cover blur-3xl scale-150 opacity-20 " 
        />
      </div>
      
      <div className="relative z-10">
        
        
        <Navbar 
          onSearchClick={() => setShowSearch(true)}
          onAdminClick={() => setShowAdmin(true)}
        />

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-[#d8be7d]/10 via-[#d8be7d]/5 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
          />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div 
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="mb-8">
                <img 
                  src="/assets/logo.png" 
                  alt="Bios Maris Logo" 
                  className="w-24 h-24 mx-auto mb-4 object-contain logo"
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-[#d8be7d] to-[#c9a96b] bg-clip-text text-transparent">
                  Bios Maris
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                Compléments Alimentaires Naturels
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Découvrez notre gamme de compléments alimentaires d'origine marine 
                pour votre bien-être quotidien et votre santé naturelle
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#d8be7d] hover:bg-[#c9a96b] text-gray-900 px-8 py-3"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrir nos produits
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-[#d8be7d] text-[#d8be7d] hover:bg-[#d8be7d]/10 px-8 py-3"
                  onClick={() => setShowSearch(true)}
                >
                  Rechercher un produit
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#d8be7d]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-[#d8be7d]/15 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-[#d8be7d]/25 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                À Propos de Bios Maris
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
                Depuis notre création, nous nous engageons à fournir des compléments alimentaires 
                de la plus haute qualité, issus des richesses de la mer.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Notre Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chez Bios Maris, nous croyons que la nature marine offre les meilleurs nutriments 
                  pour maintenir une santé optimale. Notre mission est de vous proposer des compléments 
                  alimentaires purs, efficaces et respectueux de l'environnement.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
                    <div className="text-2xl font-bold text-[#d8be7d]">10+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Années d'expérience</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
                    <div className="text-2xl font-bold text-[#d8be7d]">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Produits naturels</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
                    <div className="text-2xl font-bold text-[#d8be7d]">1000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Clients satisfaits</div>
                  </div>
<<<<<<< HEAD
                  {/* <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
=======
{/*                   <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
>>>>>>> 0a9f2a109678500bc2580469467cde833fb727ca
                    <div className="text-2xl font-bold text-[#d8be7d]">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Naturel</div>
                  </div> */}
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop" 
                  alt="Laboratoire Bios Maris" 
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#d8be7d]/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Pourquoi Choisir Bios Maris ?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Notre engagement envers la qualité et la nature
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="h-8 w-8 text-[#d8be7d]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
<<<<<<< HEAD
                     Naturel
=======
                    Naturel
>>>>>>> 0a9f2a109678500bc2580469467cde833fb727ca
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tous nos produits sont issus d'ingrédients naturels d'origine marine, 
                    sans additifs artificiels
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-[#d8be7d]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Qualité Garantie
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contrôles qualité rigoureux pour assurer 
                    l'efficacité et la sécurité de nos produits
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-[#d8be7d]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bien-être Global
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Une approche holistique de la santé pour améliorer votre 
                    qualité de vie au quotidien
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Products Section */}
      <ProductGrid />

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Les Bienfaits des Compléments Marins
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Découvrez pourquoi les nutriments d'origine marine sont essentiels pour votre santé
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-6 w-6 text-[#d8be7d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Santé Cardiovasculaire</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Les oméga-3 marins soutiennent la santé du cœur et des vaisseaux sanguins
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Microscope className="h-6 w-6 text-[#d8be7d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fonction Cérébrale</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amélioration de la mémoire et des fonctions cognitives
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-[#d8be7d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Immunité Renforcée</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Renforcement naturel du système immunitaire
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6 text-[#d8be7d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Anti-âge Naturel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Propriétés antioxydantes pour lutter contre le vieillissement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Testimonials */}
            {/* <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Témoignages Clients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#d8be7d] text-[#d8be7d]" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "Excellents produits, je recommande vivement les oméga-3 de Bios Maris. 
                      Ma santé cardiovasculaire s'est nettement améliorée."
                    </p>
                    <div className="text-sm text-gray-500">- Sarah M.</div>
                  </CardContent>
                </Card>

                <Card className="p-6 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#d8be7d] text-[#d8be7d]" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "Qualité exceptionnelle et service client au top. 
                      Les produits sont vraiment efficaces et naturels."
                    </p>
                    <div className="text-sm text-gray-500">- Ahmed K.</div>
                  </CardContent>
                </Card>

                <Card className="p-6 border-[#d8be7d]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#d8be7d] text-[#d8be7d]" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "Je prends le magnésium marin depuis 6 mois, 
                      mon sommeil et mon stress se sont considérablement améliorés."
                    </p>
                    <div className="text-sm text-gray-500">- Fatima L.</div>
                  </CardContent>
                </Card>
              </div>
            </div>*/}
          </div>
          
        </section> 

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Contactez-nous
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Notre équipe est à votre disposition pour répondre à toutes vos questions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="p-6 hover:shadow-lg transition-shadow border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-[#d8be7d]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                        <p className="text-gray-600 dark:text-gray-400">{adminData?.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-shadow border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-[#d8be7d]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Téléphone</h3>
                        <p className="text-gray-600 dark:text-gray-400">0{adminData?.phone}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-shadow border-[#d8be7d]/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#d8be7d]/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-[#d8be7d]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Localisation</h3>
                        <p className="text-gray-600 dark:text-gray-400">Algérie</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Info */}
                <Card className="p-6 bg-[#d8be7d]/5 border-[#d8be7d]/20 backdrop-blur-sm">
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Horaires d'ouverture
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Dimanche - Jeudi:</span>
                        <span>8h00 - 17h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendredi:</span>
                        <span>8h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi:</span>
                        <span>Fermé</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-sm text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/assets/logo.png" 
                    alt="Bios Maris Logo" 
                    className="w-8 h-8 object-contain logo"
                  />
                  <h3 className="text-xl font-bold">Bios Maris</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Compléments alimentaires naturels pour votre bien-être quotidien
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#d8be7d]">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Accueil</a>
                  <a href="#about" className="block text-gray-400 hover:text-white transition-colors">À Propos</a>
                  <a href="#products" className="block text-gray-400 hover:text-white transition-colors">Produits</a>
                  <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#d8be7d]">Produits</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-400">Vitamines</div>
                  <div className="text-gray-400">Oméga-3</div>
                  <div className="text-gray-400">Magnésium</div>
                  <div className="text-gray-400">Antioxydants</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-[#d8be7d]">Contact</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>{adminData?.email}</div>
                  <div>0{adminData?.phone}</div>
                  <div>Algérie</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 Bios Maris. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>

        {/* Search System Dialog */}
        <SearchSystem 
          isOpen={showSearch} 
          onClose={() => setShowSearch(false)} 
        />
      </div>
    </div>
    </>
    
  );
}
