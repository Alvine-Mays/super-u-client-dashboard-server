import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  Shield,
  Truck,
  CreditCard,
  Heart,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  DollarSign,
  Star,
  Crown,
  Rocket,
  Package,
  Leaf,
  Smartphone,
  ShieldCheck,
  Gem,
  Bullseye,
  Zap,
  Globe,
  PhoneCall,
  LocateFixed
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section modernisée */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10"> 
	  <nav className="flex items-center space-x-2 text-sm text-white/90 mb-8">
            <Link href="/" className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white hover:underline hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-0">
              Accueil
            </Link>
            <span className="text-white/60">&gt;</span>
            <Link href="/a-propos" className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white hover:underline hover:bg-white/10 transition-colors duration-150 border-0 focus:outline-none focus:ring-0">
              A propos
            </Link>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Depuis plus de 20 ans</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              À Propos de <span className="text-white">Géant Casino</span>
            </h1>
		

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre histoire, nos valeurs et notre engagement pour
              <span className="font-semibold text-white"> simplifier votre quotidien</span>
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-20">
        {/* Services Principaux - Design moderne */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200">
              Nos services phares
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Des Services <span className="text-red-500">Pensés Pour Vous</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Une expérience shopping unique alliant modernité, praticité et qualité
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: ShoppingCart,
                title: "Click & Collect",
                description: "Commandez en ligne, récupérez en magasin. Simple, rapide et efficace.",
                features: ["Retrait en 2h", "Créneaux flexibles", "Zéro attente"]
              },
              {
                icon: Shield,
                title: "Qualité Garantie",
                description: "Des produits frais rigoureusement sélectionnés pour votre satisfaction.",
                features: ["Produits frais", "Contrôle qualité", "Origine certifiée"]
              },
              {
                icon: Users,
                title: "Service Client 360°",
                description: "Un accompagnement personnalisé à chaque étape de votre expérience.",
                features: ["Support 7j/7", "Expert dédié", "Résolution rapide"]
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:elevate transition-all duration-500 border-2 border-transparent hover:border-red-100 hover:shadow-xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-6 relative z-10">
                  <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="h-10 w-10 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl text-foreground mb-4">{service.title}</CardTitle>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-red-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bannière Avantages - Design impactant */}
        <section className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-white text-center mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-4xl font-bold mb-6">Exclusivités Géant Casino</h3>
            <p className="text-red-100 text-xl mb-8 leading-relaxed">
              Profitez d'avantages uniques conçus pour votre confort au quotidien
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Prix Compétitifs", icon: DollarSign },
                { label: "Qualité Premium", icon: Star },
                { label: "Service Personnalisé", icon: Crown },
                { label: "Innovation Continue", icon: Rocket }
              ].map((advantage, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 flex items-center gap-2">
                  <advantage.icon className="h-5 w-5" />
                  <span className="text-lg font-semibold">{advantage.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision - Layout amélioré */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          <Card className="hover:elevate transition-all duration-300 group border-2 border-transparent hover:border-red-100">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-7 w-7 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl text-foreground">Notre Mission</CardTitle>
                  <CardDescription className="text-lg mt-2">Engagement quotidien</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl">
                Depuis plus de 20 ans, <strong className="text-foreground">Géant Casino Brazzaville</strong> s'engage à
                révolutionner votre expérience shopping. Notre mission : vous offrir
                <strong className="text-foreground"> le meilleur rapport qualité-prix</strong> avec un service qui simplifie votre quotidien.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:elevate transition-all duration-300 group border-2 border-transparent hover:border-red-100">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-7 w-7 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl text-foreground">Click & Collect</CardTitle>
                  <CardDescription className="text-lg mt-2">Innovation au service du quotidien</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl">
                Notre service <strong className="text-foreground">Click & Collect</strong> transforme vos courses.
                Commandez en ligne, récupérez en magasin selon vos disponibilités.
                <strong className="text-foreground"> Gain de temps garanti</strong> et fraîcheur préservée.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Services Détaillés - Grid améliorée */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200">
              Fonctionnalités
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Une Expérience <span className="text-red-500">Sans Compromis</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tous les services essentiels pour des courses simples et agréables
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Clock,
                title: "Flexibilité Totale",
                description: "Choisissez votre créneau de retrait selon vos disponibilités"
              },
              {
                icon: Shield,
                title: "Fraîcheur Garantie",
                description: "Produits frais sélectionnés et contrôlés quotidiennement"
              },
              {
                icon: CreditCard,
                title: "Paiements Sécurisés",
                description: "MTN Money, Airtel Money et cartes bancaires acceptés"
              },
              {
                icon: Truck,
                title: "Efficacité Maximale",
                description: "Préparation de commande en moins de 2 heures"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:elevate transition-all duration-300 hover:translate-y-[-8px] text-center border-2 border-transparent hover:border-red-100">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-red-500/15 transition-all duration-300">
                    <service.icon className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg lg:text-xl mb-4 text-foreground group-hover:text-red-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Valeurs - Design enrichi */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200">
              Notre ADN
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Des Valeurs <span className="text-red-500">Authentiques</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Les principes fondamentaux qui guident chacune de nos actions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Excellence",
                description: "Nous nous engageons à vous offrir une qualité irréprochable dans chaque produit et service.",
                highlight: "Rigueur et perfection"
              },
              {
                icon: Users,
                title: "Proximité",
                description: "À l'écoute de vos besoins, nous construisons une relation de confiance durable.",
                highlight: "Écoute et confiance"
              },
              {
                icon: Heart,
                title: "Innovation",
                description: "Nous repoussons constamment les limites pour simplifier et améliorer votre quotidien.",
                highlight: "Modernité et progrès"
              }
            ].map((value, index) => (
              <Card key={index} className="group hover:elevate transition-all duration-300 border-2 border-transparent hover:border-red-100">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl text-foreground">{value.title}</CardTitle>
                      <CardDescription className="text-red-600 font-medium mt-1">
                        {value.highlight}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact - Design moderne */}
        <section className="mb-16">
          <Card className="bg-card border-2 border-red-50">
            <CardHeader className="text-center pb-8">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-red-50 text-red-600 border-red-200 w-fit mx-auto">
                Nous contacter
              </Badge>
              <CardTitle className="text-4xl text-foreground mb-4">Restons Connectés</CardTitle>
              <CardDescription className="text-xl text-muted-foreground">
                Notre équipe vous accompagne avec expertise et bienveillance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {[
                  {
                    icon: LocateFixed,
                    title: "Notre Adresse",
                    content: "Avenue Amilcar Cabral\nCentre-ville, Brazzaville\nRépublique du Congo",
                    accent: "Au cœur de la ville"
                  },
                  {
                    icon: PhoneCall,
                    title: "Appelez-nous",
                    content: "+242 06 xxx xx xx\nLun-Sam: 8h-20h\nDim: 8h-18h",
                    accent: "Service réactif"
                  },
                  {
                    icon: Mail,
                    title: "Écrivez-nous",
                    content: "contact@geantcasino-brazza.cg\nclickcollect@geantcasino-brazza.cg",
                    accent: "Réponse sous 24h"
                  },
                  {
                    icon: Clock,
                    title: "Disponibilités",
                    content: "Lun-Sam: 9h-19h\nDim: 9h-17h\nCréneaux de 2h",
                    accent: "Flexibilité"
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <contact.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg lg:text-xl mb-3 text-foreground">{contact.title}</h3>
                    <p className="text-sm text-red-600 font-medium mb-3">{contact.accent}</p>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg">
                      {contact.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pourquoi Nous Choisir - Section finale */}
        <section className="text-center">
          <div className="mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pourquoi <span className="text-red-500">Géant Casino</span> ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Rejoignez une communauté de clients satisfaits qui nous font confiance au quotidien
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { label: "5000+ produits", icon: Package },
                { label: "Retrait express 2h", icon: Zap },
                { label: "Produits locaux", icon: Leaf },
                { label: "Paiement mobile", icon: Smartphone },
                { label: "Support 7j/7", icon: ShieldCheck },
                { label: "Fraîcheur garantie", icon: Globe },
                { label: "Prix compétitifs", icon: Gem },
                { label: "Qualité premium", icon: Star }
              ].map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-5 py-3 text-base bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-border hover:scale-105 transition-all duration-300 shadow-sm flex items-center gap-1.5"
                >
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">Prêt à révolutionner vos courses ?</h3>
              <p className="text-red-100 text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
                Rejoignez l'expérience Géant Casino et découvrez un nouveau standard
                de qualité et de service
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
		<Link href="/produits">
                   <button className="bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg">
                  Explorer nos produits →
                   </button>
		</Link>
		<Link href="/contact">
               	  <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg">
                  Nous contacter !
                  </button>
		</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
