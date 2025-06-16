
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Award, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Program = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  ባለአደራ ትውልድ
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Trustee Generation Camp</p>
              </div>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-blue-950/20 dark:via-background dark:to-red-950/20 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
            <span className="block text-foreground mb-2">Camp</span>
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Program</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            An epic journey built to ignite your purpose, boost your confidence, and equip you with real tools to lead, create change, and leave your mark on the world.
            <br /><br />
            <span className="font-medium text-foreground">This isn't just a camp — it's where future world-changers are made.</span>
          </p>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Event Details</h3>
            <p className="text-lg text-muted-foreground">Join us for a transformative experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-card dark:from-blue-950/20 dark:to-card">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-xl text-card-foreground">When</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  ሐምሌ 7 (July 13, 2025)
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-card dark:from-red-950/20 dark:to-card">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-xl text-card-foreground">Where</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Location 1: ሀዋሳ ገነት ቤተ-ክርሰቲያን (Hawasa Genet Church)<br /><br />
                  Location 2: ሀዋሳ አማኑኤል ኀብረት ቤተ-ክርሰቲያን (Hawasa Emmanuel United Church)
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-card dark:from-green-950/20 dark:to-card">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-xl text-card-foreground">Who</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Teens Ages 14-19<br />
                  From Partner Churches<br />
                  All Welcome
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-card dark:from-purple-950/20 dark:to-card">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <CardTitle className="text-xl text-card-foreground">Duration</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  2:00 - 10:30 PM local time<br />
                  Training, prayer, interactive sessions,<br />
                  networking and meals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Program Highlights</h3>
            <p className="text-lg text-muted-foreground">What Makes This Experience Unforgettable</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1 1.5 1.2 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                </div>
                <CardTitle className="text-xl text-card-foreground">Power Encounter</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Life-changing moments in the presence of the Holy Spirit
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Trustee Generation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Raising a bold generation entrusted with purpose and impact
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Next-Level Leadership</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Unlock your voice, vision, and influence
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card group md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <CardTitle className="text-xl text-card-foreground">Future-Ready Skills</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Learn real-world skills to lead, create, and thrive
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card group md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <CardTitle className="text-xl text-card-foreground">Unshakable Character</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Build a strong heart, grounded values, and inner strength
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Join?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Register now to secure your spot in this transformative experience
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Register for the Camp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Program;
