
import { Link } from "react-router-dom";
import { Target, Heart, Award, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
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
            <span className="block text-foreground mb-2">About</span>
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Our Camp</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            <span className="block font-medium text-foreground text-2xl mb-4">This isn't just a camp — it's a movement.</span>
            The Baleadera Tiweled Trustee Generation Camp is where future leaders are born. It's your space to grow, 
            lead, and ignite real change — in your life, your crew, and your community.
            <br /><br />
            Through powerful mentorship, real-talk learning, and deep faith-filled fellowship, we're raising a generation 
            that's strong, smart, and spiritually unstoppable.
          </p>
        </div>
      </section>

      {/* Mission, Values, Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-xl text-card-foreground">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  To inspire and equip the next generation of changemakers — 
                  empowering teens with the mindset, skills, and heart to lead 
                  boldly and make a real difference in their world.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-xl text-card-foreground">Our Core Values</CardTitle>
              </CardHeader>
              <CardContent className="text-left px-6">
                <CardDescription className="text-muted-foreground text-base space-y-3">
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">1.</span>
                    <span>Confidentiality</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">2.</span>
                    <span>Integrity</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">3.</span>
                    <span>Excellence</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">4.</span>
                    <span>Humility and Closeness</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">5.</span>
                    <span>Servant Heart</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold text-foreground mr-2">6.</span>
                    <span>Focus on Teenagers</span>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-xl text-card-foreground">Our Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">5,110+</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Teenagers reached across our 4 rounds of programs, with over 538 set free from demonic oppression and 400+ lives transformed through overcoming addiction.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Story</h3>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="mb-6">
              We recognize a critical gap within the Church — a gap that has led to the loss of many teenagers before they can transition into leadership. This gap, between Sunday School and Young Adult Ministry, often leaves ages 13 to 19 overlooked and underserved. As a result, we risk missing a whole generation of future leaders in God's Kingdom.
            </p>
            
            <blockquote className="border-l-4 border-blue-600 pl-6 py-2 my-8 italic text-foreground font-medium">
              "I am the Trustee Generation — turning from self, reaching for Christ."
            </blockquote>
            
            <p className="mb-6">
              Our mission is to stand in that gap — to engage, equip, and empower this age group to grow in their faith and confidently live it out and share it in the years to come. We believe that by addressing this critical transition period, we can raise up a generation of young people who are firmly rooted in their faith and prepared to be leaders in both the church and the world.
            </p>
            
            <p className="mb-6">
              Through targeted programs, mentorship, and biblical teaching, we help young people navigate the challenges of adolescence while deepening their relationship with Christ. Our approach combines spiritual formation with practical life skills, creating well-rounded individuals who are prepared to make a lasting impact for God's Kingdom.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Join Our Mission</h3>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a movement that's transforming communities through empowered teenagers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Register Now
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
