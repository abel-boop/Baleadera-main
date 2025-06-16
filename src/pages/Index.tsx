
import { Link } from "react-router-dom";
import { Users, UserCheck, Calendar, MapPin, Award, Target, Heart, ChevronRight, Facebook, Phone, Mail, Menu, X, BookOpen, Lightbulb, Crown, Youtube, Instagram, MessageSquare } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useState } from "react";

const Index = () => {
  const { scrollToSection } = useSmoothScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  ባለአደራ ትውልድ
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Trustee Generation Leadership Camp</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavClick('home')} 
                className="text-foreground hover:text-blue-600 font-medium transition-colors duration-300 hover:scale-105"
              >
                Home
              </button>
              <Link to="/about" className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                About Us
              </Link>
              <Link to="/program" className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                Program
              </Link>
              <Link to="/register" className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                Registration
              </Link>
              <Link to="/testimonials" className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                Testimonials
              </Link>
              <Link to="/memories" className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                Memories
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/register" className="hidden sm:block">
                <Button className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white transition-all duration-500 hover:scale-110 hover:shadow-lg relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></span>
                  <span className="relative">Register Now</span>
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden transition-transform duration-200 hover:scale-110"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => handleNavClick('home')} 
                  className="text-left py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                >
                  Home
                </button>
                <Link 
                  to="/about" 
                  className="py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/program" 
                  className="py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Program
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registration
                </Link>
                <Link 
                  to="/testimonials" 
                  className="py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link 
                  to="/memories" 
                  className="py-2 px-4 text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:bg-accent rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Memories
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-slate-900/20 dark:via-background dark:to-slate-800/20 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/eadb4c28-fc6b-401e-9970-5f67b9ce053c.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 animate-fade-in leading-tight">
                <span className="block text-foreground mb-2 animate-slide-in-left">Become a</span>
                <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent animate-slide-in-right">Trustee Generation</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-delayed max-w-2xl mx-auto lg:mx-0">
                Join us in a life-changing journey where young hearts are lit with divine wisdom, 
                trained in real biblical power, and called to carry God's mission with purpose. 
                This is your moment. A generation rising — bold, fearless, and grounded in truth.
                <br /><br />
                <span className="font-medium text-foreground">
                  You're not just learning — you're becoming a trusted leader, a world-changer, 
                  a kingdom warrior for your generation.
                </span>
              </p>
              <div className="w-full">
                <div className="inline-flex flex-wrap gap-3 sm:gap-4">
                  <Link to="/register" className="min-w-[140px] max-w-[200px] sm:max-w-none">
                    <Button 
                      size="sm"
                      className="group w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-3 text-xs sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden animate-pulse-glow"
                      style={{
                        animation: 'pulse-glow 3s infinite',
                        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-shimmer"></span>
                      <span className="relative flex items-center justify-center">
                        <span className="group-hover:animate-button-scale inline-block">
                          Register Now
                        </span>
                        <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-all duration-300 group-hover:scale-125" />
                      </span>
                    </Button>
                  </Link>
                  <Link to="/about" className="min-w-[140px] max-w-[200px] sm:max-w-none">
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 sm:px-6 py-1.5 sm:py-3 text-xs sm:text-base font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Our Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative animate-float">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-6 sm:p-8 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-105 shadow-2xl">
                <div className="text-center">
                  <Crown className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">ባለአደራ ትውልድ</h3>
                  <p className="text-blue-100 text-sm sm:text-base">Trustee Generation of Tomorrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 animate-fade-in">Our Divine Calling</h3>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              To raise a generation of trustworthy, Christ-centered individuals who are deeply passionate about and faithfully committed to their local church — cultivating the Body of Christ, advancing the mission of the Church, and strengthening the unity and fellowship of believers for the glory of God.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in group">
              <CardHeader className="text-center">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Biblical Foundation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Grounded in Scripture, we equip young people with God's Word as the foundation 
                  for wise leadership and righteous living in their communities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in group" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center">
                <Heart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Servant Leadership</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Following Christ's example of servant leadership, we nurture hearts that 
                  seek to serve others with humility, compassion, and divine love.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in group" style={{ animationDelay: '200ms' }}>
              <CardHeader className="text-center">
                <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Spiritual Growth</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Through prayer, fellowship, and biblical study, participants grow in 
                  spiritual maturity and develop a deeper relationship with God.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 animate-fade-in">Event Details</h3>
            <p className="text-base sm:text-lg text-muted-foreground animate-slide-up">Join us for a transformative spiritual experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-card dark:from-slate-800/40 dark:to-card animate-fade-in">
              <CardHeader className="text-center">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">When</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  ሐምሌ 7 (July 13, 2025)
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-card dark:from-slate-800/40 dark:to-card animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center">
                <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Where</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
Location 1: ሀዋሳ ገነት ቤተ-ክርሰቲያን (Hawasa Genet Church)<br /><br />
                  Location 2: ሀዋሳ አማኑኤል ኀብረት ቤተ-ክርሰቲያን (Hawasa Emmanuel United Church)
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-card dark:from-slate-800/40 dark:to-card md:col-span-2 lg:col-span-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader className="text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Who</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Young Believers Ages 14-19<br />
                  From Partner Churches<br />
                  Called to Leadership
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-red-50 dark:from-slate-900/20 dark:to-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 animate-fade-in">Our Impact</h3>
            <p className="text-base sm:text-lg text-muted-foreground animate-slide-up">Transforming lives through 4 powerful rounds of our program</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-card dark:from-slate-800/40 dark:to-card animate-fade-in">
              <CardHeader className="text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Total Reach</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">5,110+</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Teenagers reached across our 4 rounds of programs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-card dark:from-slate-800/40 dark:to-card animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader className="text-center">
                <Heart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Spiritual Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">538+</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Set free from demonic oppression
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-card dark:from-slate-800/40 dark:to-card animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader className="text-center">
                <Target className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Life Changes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">400+</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Lives transformed by overcoming addiction through our program
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-purple-50 to-card dark:from-slate-800/40 dark:to-card max-w-3xl mx-auto animate-fade-in">
              <CardContent className="p-6">
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">20+ Churches</div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Partnered with us, including 11 churches that have integrated our program into their regular curriculum
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 animate-fade-in">Answer Your Divine Calling</h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 animate-slide-up">
            Join the trustee generation who are transforming their communities through God's love and wisdom
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce-in">
              Begin Your Spiritual Journey
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-card-foreground">ባለአደራ ትውልድ</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Trustee Generation Leadership Camp</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Raising the next generation of trustees through biblical wisdom, spiritual growth, and servant leadership.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/share/16c5nWxemv/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors" aria-label="Facebook" title="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://youtube.com/@baleaderatiweled?si=Qzuly1Hjs07OIC-v" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="YouTube" title="YouTube">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/baleadera_teweled?igsh=eGx5OTV4NnU1eDNx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors" aria-label="Instagram" title="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@baleadera_tewled?_t=ZM-8wtAMUzIsp6&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="TikTok" title="TikTok">
                  <FaTiktok className="h-6 w-6" />
                </a>
                <a href="https://t.me/baladera_teweled" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-500 transition-colors" aria-label="Telegram" title="Telegram">
                  <FaTelegramPlane className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-card-foreground transition-colors text-sm sm:text-base">About Us</Link></li>
                <li><Link to="/program" className="text-muted-foreground hover:text-card-foreground transition-colors text-sm sm:text-base">Program</Link></li>
                <li><Link to="/register" className="text-muted-foreground hover:text-card-foreground transition-colors text-sm sm:text-base">Registration</Link></li>
                <li><Link to="/testimonials" className="text-muted-foreground hover:text-card-foreground transition-colors text-sm sm:text-base">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground text-sm sm:text-base">
                  <Mail className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                  <a href="mailto:baladeratiweled15@gmail.com" className="hover:text-card-foreground transition-colors">
                    baladeratiweled15@gmail.com
                  </a>
                </li>
                <li className="flex items-start text-muted-foreground text-sm sm:text-base">
                  <Phone className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="hover:text-card-foreground transition-colors">
                      <a href="tel:+251916078032" className="block">+251 91 607 8032 (Hawassa)</a>
                    </div>
                    <div className="hover:text-card-foreground transition-colors mt-1">
                      <a href="tel:+251916156529" className="block">+251 91 615 6529 (Addis Ababa)</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <Link to="/login" className="text-muted-foreground hover:text-card-foreground text-sm transition-colors">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              © 2025 ባለአደራ ትውልድ Trustee Generation Leadership Camp. Transforming communities through faithful stewardship.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Built with ❤️ by Abel Desalegn · 
              <a href="mailto:abeldesalegn2121@gmail.com" className="hover:text-muted-foreground transition-colors" aria-label="Contact developer">
                abeldesalegn2121@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
