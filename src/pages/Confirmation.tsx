
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Users, Calendar, MapPin, CreditCard, CalendarDays, MapPin as MapPinIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getRegistration, Registration } from "@/utils/supabaseDataManager";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Edition = Database['public']['Tables']['editions']['Row'];

const Confirmation = () => {
  const { id } = useParams();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegistrationAndEdition = async () => {
      if (!id) {
        setError("No registration ID provided");
        setLoading(false);
        return;
      }

      try {
        // Load the registration
        const data = await getRegistration(id);
        if (!data) {
          setError("Registration not found");
          setLoading(false);
          return;
        }
        
        setRegistration(data);

        // Load the edition information
        if (data.edition_id) {
          const { data: editionData, error: editionError } = await supabase
            .from('editions')
            .select('*')
            .eq('id', data.edition_id)
            .single();
          
          if (editionError) {
            console.error('Error loading edition:', editionError);
            // Don't fail the whole page if we can't load the edition
            return;
          }
          
          setEdition(editionData);
        }
      } catch (err: any) {
        console.error('Error loading registration:', err);
        setError(err.message || "Failed to load registration");
      } finally {
        setLoading(false);
      }
    };

    loadRegistrationAndEdition();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-blue-950/20 dark:via-background dark:to-red-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-blue-950/20 dark:via-background dark:to-red-950/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto border border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600 dark:text-red-400">Registration Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || "We couldn't find your registration. Please check the URL or try registering again."}
            </p>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700">
                Register Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-blue-950/20 dark:via-background dark:to-red-950/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                    ባለአደራ ትውልድ
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">Trustee Generation Leadership Camp</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Confirmation Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <Card className="border border-border shadow-2xl bg-card/90 backdrop-blur-sm mb-8">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce-in" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                Registration Successful!
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Thank you for registering for the {edition?.name || 'Trustee Generation Leadership Camp'}
              </CardDescription>
              {edition && (
                <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  {edition.start_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 mr-1.5" />
                      <span>{new Date(edition.start_date).toLocaleDateString()}</span>
                      {edition.end_date && (
                        <>
                          <span className="mx-1">-</span>
                          <span>{new Date(edition.end_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  )}
                  {edition.event_location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4 mr-1.5" />
                      <span>Event Location: {edition.event_location}</span>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Registration Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <span className="ml-2 text-foreground">{registration.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Phone:</span>
                    <span className="ml-2 text-foreground">{registration.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Age:</span>
                    <span className="ml-2 text-foreground">{registration.age}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Grade:</span>
                    <span className="ml-2 text-foreground">{registration.grade}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Gender:</span>
                    <span className="ml-2 text-foreground">{registration.gender}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Church:</span>
                    <span className="ml-2 text-foreground">{registration.church}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Event Location:</span>
                    <span className="ml-2 text-foreground">{edition?.event_location || 'Hawassa'}</span>
                  </div>
                  {edition && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-muted-foreground">Event:</span>
                      <span className="ml-2 text-foreground">{edition.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      registration.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200' 
                        : registration.status === 'rejected' 
                        ? 'bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-200' 
                        : 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {registration.status === 'pending' ? 'Pending Review' : 
                       registration.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                  <div className="mt-2">
                    {registration.participant_id ? (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Your Participant ID:</span>
                        <span className="font-mono text-sm bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          {registration.participant_id}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        Your participant ID will be assigned once your registration is approved.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg text-foreground">Registration Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground">
                  Your registration is being reviewed. Your participant ID will be sent to your church coordinator once approved.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-lg text-foreground">Get Your ID</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground">
                  Your participant ID will be sent to your church. Please contact your church coordinator to collect your ID before the event.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-lg text-foreground">Event Locations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground">
                  <div className="space-y-2">
                    <div>Location 1: ሀዋሳ ገነት ቤተ-ክርሰቲያን</div>
                    <div className="text-sm">(Hawasa Genet Church)</div>
                    <div className="mt-2">Location 2: ሀዋሳ አማኑኤል ኀብረት ቤተ-ክርሰቲያን</div>
                    <div className="text-sm">(Hawasa Emmanuel United Church)</div>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Questions? Contact us at the church office or through your local church coordinator.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
