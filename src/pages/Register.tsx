
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { saveRegistration } from "@/utils/supabaseDataManager";
import { RegistrationSteps } from "@/components/RegistrationSteps";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    grade: "",
    gender: "",
    church: "",
    location: ""
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const requiredFields = ['name', 'phone', 'age', 'grade', 'gender', 'church', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Age validation
    const ageNum = parseInt(formData.age);
    if (ageNum < 13 || ageNum > 20) {
      toast({
        title: "Invalid Age",
        description: "Age must be between 13 and 20 years.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Save registration using Supabase
      const registrationId = await saveRegistration(formData);
      
      toast({
        title: "Registration Successful!",
        description: "Your registration has been submitted successfully.",
      });

      // Navigate to confirmation page
      navigate(`/confirmation/${registrationId}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-red-50 dark:from-blue-950/20 dark:via-background dark:to-red-950/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b">
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
                  <p className="text-sm text-muted-foreground hidden sm:block">Faithful Stewards Leadership Forum</p>
                </div>
              </div>
            </div>
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
