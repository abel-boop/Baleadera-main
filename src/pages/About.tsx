
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
                <p className="text-sm text-muted-foreground hidden sm:block">Youth Empowerment Forum</p>
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
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Our Forum</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            The Baleadera Tiweled Youth Empowerment Forum is dedicated to nurturing young leaders 
            and building stronger communities through education, mentorship, and fellowship.
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
                  To empower young people with the skills, knowledge, and values 
                  needed to become effective leaders in their communities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-xl text-card-foreground">Our Values</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Integrity, excellence, compassion, and service to others 
                  form the foundation of everything we do.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-xl text-card-foreground">Our Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  Over 500 young leaders have been equipped and are making 
                  positive changes in their communities.
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
              The Baleadera Tiweled Youth Empowerment Forum was founded with a vision to transform 
              communities through empowered youth. Our journey began with a simple belief: when young 
              people are equipped with the right tools, values, and opportunities, they become catalysts 
              for positive change.
            </p>
            
            <p className="mb-6">
              Over the years, we have developed comprehensive programs that focus on leadership development, 
              character building, and practical skills training. Our approach combines traditional values 
              with modern methodologies to prepare young leaders for the challenges of today's world.
            </p>
            
            <p className="mb-6">
              The forum serves as a platform where young minds come together to learn, share experiences, 
              and build lasting networks. Through workshops, mentorship programs, and community service 
              initiatives, participants develop the confidence and competence needed to make a difference 
              in their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Join Our Mission</h3>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a movement that's transforming communities through empowered youth
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
