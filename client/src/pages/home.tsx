import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import React, { useEffect, useState } from "react";
import { ShoppingBag, AlertCircle, Target, Users, Heart, Sparkles, CheckCircle, ShoppingCart, Shield, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";
import { apiRequest } from "@/lib/queryClient";

function RotatingText() {
  const items = [
    "Gagnez en temps",
    "Vos courses sont prêtes en moins de 2 heures après commande",
    "Choisissez votre horaire de retrait",
    "Different moyens de paiement sont pris en compte",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-16 md:h-20 lg:h-28 flex items-center z-20" aria-live="polite">
      {items.map((text, i) => (
        <div
          key={i}
          className={`absolute left-0 top-0 w-full transition-all duration-200 ease-out transform ${
            index === i ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
          }`}
        >
          <h1
            className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </h1>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: catResp, isLoading } = useQuery<{ success?: boolean; data?: { items?: Category[] } } | Category[]>({
    queryKey: ["/api/categories"],
    queryFn: () => apiRequest("GET", "/api/categories"),
  });
  const categories: any[] = Array.isArray(catResp) ? (catResp as any) : (catResp as any)?.data?.items ?? [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative h-[69vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 to-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center">
          <div className="relative flex-1 flex items-center">
            <RotatingText />
          </div>

          <nav className="absolute bottom-8 md:bottom-10 right-6 md:right-12 flex items-center gap-2">
            <Link href="/" className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white hover:underline hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-0">
              Accueil
            </Link>
            <span className="text-white/60">&gt;</span>
            <Link href="/produits" className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white hover:underline hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-0">
              Produits
            </Link>
            <span className="text-white/60">&gt;</span>
            <Link href="/a-propos" className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white hover:underline hover:bg-white/10 transition-colors duration-150 border-0 focus:outline-none focus:ring-0">
              A propos
            </Link>
          </nav>
        </div>
      </header>

      {/* Section Qui sommes-nous - Modernisée */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200">
              Notre histoire
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Bien plus qu'un <span className="text-red-500">supermarché</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Depuis plus de 20 ans, <strong className="text-foreground">Géant Casino Brazzaville</strong> révolutionne 
              votre expérience shopping avec un engagement constant : qualité, innovation et proximité.
            </p>
          </div>

          {/* Cartes principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: "Notre Mission",
                description: "Rendre vos courses quotidiennes plus simples, plus rapides et plus agréables.",
                features: ["Qualité accessible", "Service personnalisé", "Innovation continue"],
                color: "red"
              },
              {
                icon: Users,
                title: "Notre Vision",
                description: "Devenir votre partenaire shopping de référence au Congo.",
                features: ["Excellence client", "Développement local", "Innovation durable"],
                color: "red"
              },
              {
                icon: Heart,
                title: "Nos Valeurs",
                description: "Des principes qui guident chacune de nos actions.",
                features: ["Proximité", "Transparence", "Engagement"],
                color: "red"
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="group hover:elevate transition-all duration-300 border-2 border-transparent hover:border-red-100 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-7 w-7 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl text-foreground">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/about" className="mt-6 inline-block">
                    <Button variant="link" className="text-red-600 hover:text-red-700 px-0 h-auto font-semibold group-hover:underline transition-all duration-300">
                      Découvrir notre histoire →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section Chiffres clés */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-white text-center mb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-12">Notre Impact en Chiffres</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "20+", label: "Ans d'expérience" },
                  { number: "5000+", label: "Produits disponibles" },
                  { number: "50k+", label: "Clients satisfaits" },
                  { number: "2h", label: "Retrait maximum" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                    <div className="text-red-100 text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services phares */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200">
                Nos innovations
              </Badge>
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Des Services <span className="text-red-500">Révolutionnaires</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: ShoppingCart,
                  title: "Click & Collect",
                  description: "Notre service phare qui transforme votre façon de faire les courses. Commandez en ligne, récupérez en magasin selon vos disponibilités.",
                  features: ["Gain de temps garanti", "Créneaux flexibles", "Produits frais préservés"]
                },
                {
                  icon: Shield,
                  title: "Qualité Garantie",
                  description: "Un engagement quotidien pour vous offrir les meilleurs produits, rigoureusement sélectionnés et contrôlés.",
                  features: ["Produits frais certifiés", "Contrôle qualité strict", "Origine tracée"]
                }
              ].map((service, index) => (
                <Card key={index} className="group hover:elevate transition-all duration-300 border-2 border-transparent hover:border-red-100">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="h-8 w-8 text-red-500" />
                      </div>
                      <CardTitle className="text-2xl text-foreground">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-3xl p-12 border-2 border-red-100">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Prêt à découvrir l'expérience Géant Casino ?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rejoignez notre communauté de clients satisfaits et transformez votre quotidien
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/a-propos">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    Notre histoire complète
                  </Button>
                </Link>
                <Link href="/produits">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                    Découvrir nos produits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Notice */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8 relative z-20">
        <Alert className="bg-chart-3/10 border-l-4 border-chart-3" data-testid="alert-policy">
          <AlertCircle className="h-5 w-5 text-chart-3" />
          <AlertDescription className="text-sm md:text-base font-medium">
            <strong>Politique de retrait :</strong> 24h maximum pour produits périssables, 
            48h pour non périssables. Passé ce délai, commande annulée et remise en rayon, 
            sans remboursement (commande expirée).
          </AlertDescription>
        </Alert>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Nos catégories
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez notre large sélection de produits
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category: any) => (
              <Link
                key={(category as any)._id ?? category.id}
                href={`/categories/${category.slug}`}
              >
                <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer group" data-testid={`category-card-${category.slug}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading font-semibold text-lg text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {(category as any).productCount ?? 0} produits
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucune catégorie disponible pour le moment
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                Large choix
              </h3>
              <p className="text-muted-foreground">
                Des milliers de produits frais et d'épicerie disponibles
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                Retrait rapide
              </h3>
              <p className="text-muted-foreground">
                Choisissez votre créneau et retirez vos courses en magasin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                Paiement sécurisé
              </h3>
              <p className="text-muted-foreground">
                Mobile Money et carte bancaire acceptés
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}