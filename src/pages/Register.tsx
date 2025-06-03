import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationSteps } from "@/components/RegistrationSteps";
import { saveRegistration } from "@/utils/supabaseDataManager";
import type { Database } from "@/integrations/supabase/types";

type Edition = Database['public']['Tables']['editions']['Row'];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ageError, setAgeError] = useState("");
  const [edition, setEdition] = useState<Edition | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    grade: "",
    gender: "",
    church: "",
    participant_location: "Hawassa" as 'Hawassa' | 'Addis Ababa'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Age validation
    if (field === 'age') {
      const ageNum = parseInt(value);
      if (value && (ageNum < 13 || ageNum > 20)) {
        setAgeError("Age must be between 13 and 20 years");
      } else {
        setAgeError("");
      }
    }
  };

  // Fetch active edition on component mount
  useEffect(() => {
    const fetchActiveEdition = async () => {
      try {
        const { data, error } = await supabase
          .from('editions')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) throw error;
        
        if (data) {
          setEdition({
            id: data.id,
            year: data.year,
            name: data.name,
            is_active: data.is_active,
            start_date: data.start_date,
            end_date: data.end_date,
            event_location: data.event_location,
            created_at: data.created_at
          });
        } else {
          toast({
            title: "No Active Event",
            description: "There is currently no active event for registration.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching active edition:', error);
        toast({
          title: "Error",
          description: "Failed to load event information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveEdition();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!edition) {
      toast({
        title: "Error",
        description: "No active event found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form
      const requiredFields = ['name', 'phone', 'age', 'grade', 'gender', 'church', 'participant_location'] as const;
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Age validation
      const ageNum = parseInt(formData.age);
      if (ageNum < 13 || ageNum > 20) {
        throw new Error("Age must be between 13 and 20 years.");
      }

      // Create the registration data that matches the RegistrationInsert type
      const registrationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        age: formData.age,
        grade: formData.grade,
        gender: formData.gender,
        church: formData.church,
        participant_location: formData.participant_location,
        edition_id: edition.id
      };

      // Save the registration
      const registrationId = await saveRegistration(registrationData);
      
      // Show success message
      toast({
        title: "Registration Successful!",
        description: "Your registration has been submitted successfully.",
      });

      // Navigate to confirmation page
      navigate(`/confirmation/${registrationId}`);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error message
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!edition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Active Event</h1>
          <p className="text-muted-foreground">There is currently no active event for registration.</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="font-bold">{edition.name} {edition.year}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <RegistrationSteps
            formData={formData}
            ageError={ageError}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
