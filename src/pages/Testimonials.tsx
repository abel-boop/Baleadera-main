
import { Link } from "react-router-dom";
import { Users, ArrowLeft, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Youth Pastor",
      church: "Hope Community Church",
      content: "The forum changed my perspective on leadership and gave me the confidence to start a youth ministry in my church. The skills I learned here are invaluable.",
      rating: 5
    },
    {
      name: "Daniel K.",
      role: "Community Leader",
      church: "Grace Fellowship",
      content: "The skills I learned here helped me organize community development projects that have impacted hundreds of families. This forum is truly transformative.",
      rating: 5
    },
    {
      name: "Ruth A.",
      role: "Student Leader",
      church: "New Life Church",
      content: "This forum equipped me with leadership tools that I use daily in my university and community activities. The networking opportunities were amazing.",
      rating: 5
    },
    {
      name: "Michael T.",
      role: "Youth Coordinator",
      church: "Faith Baptist Church",
      content: "The character building sessions helped me develop a strong foundation for leadership. I now mentor other young people in my community.",
      rating: 5
    },
    {
      name: "Hanna W.",
      role: "Event Organizer",
      church: "Unity Christian Center",
      content: "The project management skills I gained here enabled me to successfully organize large-scale community events. The training was practical and effective.",
      rating: 5
    },
    {
      name: "Yonas B.",
      role: "Social Worker",
      church: "Bethel Church",
      content: "This forum opened my eyes to the power of youth in community transformation. I've since started programs that have reached over 200 young people.",
      rating: 5
    }
  ];

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
                <p className="text-sm text-muted-foreground hidden sm:block">Trustee Generation Forum</p>
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
            <span className="block text-foreground mb-2">Success</span>
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Hear from our alumni who are making a difference in their communities 
            and leading positive change wherever they go.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-blue-600 mr-3" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.church}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Impact in Numbers</h3>
            <p className="text-lg text-muted-foreground">The difference we've made together</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-muted-foreground">Teens Empowered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
              <div className="text-muted-foreground">Partner Churches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-muted-foreground">Community Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-muted-foreground">Years of Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of young leaders who have transformed their communities
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Register for the Forum
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
