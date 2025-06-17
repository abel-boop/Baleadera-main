
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, User, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";

interface RegistrationStepsProps {
  formData: {
    firstName: string;
    fathersName: string;
    phone: string;
    age: string;
    grade: string;
    gender: string;
    church: string;
  };
  ageError: string;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const RegistrationSteps = ({ 
  formData, 
  ageError, 
  onInputChange, 
  onSubmit, 
  isSubmitting 
}: RegistrationStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({ 
    firstName: '', 
    fathersName: '',
    phone: '' 
  });
  
  const validateName = (name: string, field: 'firstName' | 'fathersName') => {
    // Only allow letters and Amharic characters
    const nameRegex = /^[\p{L}]+(?:[\s-][\p{L}]+)*$/u;
    if (!name.trim()) return field === 'firstName' ? 'First name is required' : 'Father\'s name is required';
    if (!nameRegex.test(name)) return 'Can only contain letters and hyphens';
    if (name.trim().split(/\s+/).length > 2) return 'Please enter only first and last name';
    return '';
  };
  
  const validatePhone = (phone: string) => {
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly) return 'Phone number is required';
    if (digitsOnly.length !== 10) return 'Phone number must be 10 digits';
    if (!digitsOnly.startsWith('09')) return 'Phone number must start with 09';
    return '';
  };
  
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 09XX XXX XXXX
    if (cleaned.length > 3 && cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
    return cleaned;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate all fields
      const firstNameError = validateName(formData.firstName, 'firstName');
      const fathersNameError = validateName(formData.fathersName, 'fathersName');
      const phoneError = validatePhone(formData.phone);
      
      const newErrors = {
        firstName: firstNameError,
        fathersName: fathersNameError,
        phone: phoneError
      };
      
      setErrors(newErrors);
      
      // Only proceed if there are no validation errors
      if (firstNameError || fathersNameError || phoneError || ageError) {
        return;
      }
      
      // Format phone number before proceeding
      onInputChange('phone', formData.phone.replace(/\s/g, ''));
      
      // Clear any previous errors
      setErrors({ firstName: '', fathersName: '', phone: '' });
      
      // Proceed to next step
      setCurrentStep(2);
    }
  };

  const prevStep = () => setCurrentStep(1);

  const isStep1Valid = 
    formData.firstName && 
    formData.fathersName && 
    formData.phone && 
    formData.age && 
    !ageError &&
    !errors.firstName &&
    !errors.fathersName &&
    !errors.phone;
    
  const isStep2Valid = formData.grade && formData.gender && formData.church;

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className={`${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'} rounded-full p-2 transition-all duration-300`}>
            {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-300`}>
            Personal Info
          </span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'} transition-all duration-500`}></div>
        <div className="flex items-center">
          <div className={`${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'} rounded-full p-2 transition-all duration-300`}>
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-300`}>
            Church & Education
          </span>
        </div>
      </div>

      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm dark:bg-card/95">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            {currentStep === 1 ? "Personal Information" : "Church & Education Details"}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            {currentStep === 1 ? "Tell us about yourself" : "Complete your registration"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only update if the input matches the allowed pattern or is empty
                        if (value === '' || /^[\p{L}\s-]*$/u.test(value)) {
                          onInputChange('firstName', value);
                          setErrors(prev => ({ ...prev, firstName: '' }));
                        }
                      }}
                      onBlur={(e) => {
                        const error = validateName(e.target.value, 'firstName');
                        setErrors(prev => ({ ...prev, firstName: error }));
                      }}
                      className={`border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                        errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fathersName" className="text-sm font-medium text-foreground">
                      Father's Name *
                    </Label>
                    <Input
                      id="fathersName"
                      placeholder="Your father's name"
                      value={formData.fathersName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only update if the input matches the allowed pattern or is empty
                        if (value === '' || /^[\p{L}\s-]*$/u.test(value)) {
                          onInputChange('fathersName', value);
                          setErrors(prev => ({ ...prev, fathersName: '' }));
                        }
                      }}
                      onBlur={(e) => {
                        const error = validateName(e.target.value, 'fathersName');
                        setErrors(prev => ({ ...prev, fathersName: error }));
                      }}
                      className={`border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                        errors.fathersName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                    />
                    {errors.fathersName && (
                      <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.fathersName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09XX XXX XXXX"
                      value={formatPhoneNumber(formData.phone)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers and spaces, max 12 characters (including spaces)
                        if (/^[0-9\s]*$/.test(value) && value.replace(/\s/g, '').length <= 10) {
                          onInputChange('phone', value.replace(/\s/g, ''));
                          setErrors(prev => ({ ...prev, phone: '' }));
                        }
                      }}
                      onBlur={(e) => {
                        const error = validatePhone(e.target.value);
                        setErrors(prev => ({ ...prev, phone: error }));
                      }}
                      className={`border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pr-10 ${
                        errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      maxLength={12} // 09XX XXX XXXX
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-muted-foreground text-sm">
                        +251
                      </span>
                    </div>
                  </div>
                  {errors.phone ? (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.phone}</p>
                  ) : (
                    <p className="text-muted-foreground text-xs mt-1">
                      Enter your 10-digit (e.g., 0912345678)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-foreground">
                    Age (14-19 years) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age (14-19)"
                      value={formData.age}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers and empty string
                        if (value === '' || /^\d*$/.test(value)) {
                          onInputChange('age', value);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow only numbers, backspace, delete, tab, arrow keys
                        if (!/^[0-9\b\t\n\r\x00\x1B]$/.test(e.key) && 
                            e.key !== 'Backspace' && 
                            e.key !== 'Delete' && 
                            e.key !== 'Tab' &&
                            !e.key.startsWith('Arrow')) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value) {
                          const age = parseInt(value, 10);
                          if (age < 14 || age > 19) {
                            onInputChange('age', '');
                          }
                        }
                      }}
                      className={`pr-10 border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                        ageError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      min="14"
                      max="19"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-muted-foreground text-sm">
                        yrs
                      </span>
                    </div>
                  </div>
                  {ageError && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{ageError}</p>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                    Gender *
                  </Label>
                  <Select onValueChange={(value) => onInputChange('gender', value)} required>
                    <SelectTrigger className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-medium text-foreground">
                    School Grade *
                  </Label>
                  <Select onValueChange={(value) => onInputChange('grade', value)} required>
                    <SelectTrigger className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="grade-7">Grade 7</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="church" className="text-sm font-medium text-foreground">
                    Church *
                  </Label>
                  <Select onValueChange={(value) => onInputChange('church', value)} required>
                    <SelectTrigger className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                      <SelectValue placeholder="Select your church" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-60 overflow-y-auto">
                      <SelectItem value="ሀዋሳ አማኑኤል ኅብረት ቤተ-ክርስቲያን">1. ሀዋሳ አማኑኤል ኅብረት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ካቦድ አማኑኤል ኅብረት ቤተ-ክርስቲያን">2. ሀዋሳ ካቦድ አማኑኤል ኅብረት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ የህይወት ብርሃን ቤተ-ክርስቲያን">3. ሀዋሳ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ታቦር የህይወት ብርሃን ቤተ-ክርስቲያን">4. ሀዋሳ ታቦር የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ መንኃሪያ አከባቢ የህይወት ብርሃን ቤተ-ክርስቲያን">5. ሀዋሳ መንኃሪያ አከባቢ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ አላሙራ የህይወት ብርሃን ቤተ-ክርስቲያን">6. ሀዋሳ አላሙራ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ሆጎባ የህይወት ብርሃን ቤተ-ክርስቲያን">7. ሀዋሳ ሆጎባ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ አዳሬ የህይወት ብርሃን ቤተ-ክርስቲያን">8. ሀዋሳ አዳሬ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ምስራቅ የህይወት ብርሃን ቤተ-ክርስቲያን">9. ሀዋሳ ምስራቅ የህይወት ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ሀይቅ ዳር ቃለ-ህይወት ቤተ-ክርስቲያን">10. ሀዋሳ ሀይቅ ዳር ቃለ-ህይወት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ መኃል ቃለ-ህይወት ቤተ-ክርስቲያን">11. ሀዋሳ መኃል ቃለ-ህይወት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ታቦር ቃለ-ህይወት ቤተ-ክርስቲያን">12. ሀዋሳ ታቦር ቃለ-ህይወት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ቡልቻ ቃለ-ህይወት ቤተ-ክርስቲያን">13. ሀዋሳ ቡልቻ ቃለ-ህይወት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ምስራቅ መሠረተ ክርስቶስ ቤተ-ክርስቲያን">14. ሀዋሳ ምስራቅ መሠረተ ክርስቶስ ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ታቦር መሠረተ ክርስቶስ ቤተ-ክርስቲያን">15. ሀዋሳ ታቦር መሠረተ ክርስቶስ ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ መኃል መሠረተ ክርስቶስ ቤተ-ክርስቲያን">16. ሀዋሳ መኃል መሠረተ ክርስቶስ ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ ገነት ቤተ-ክርስቲያን">17. ሀዋሳ ገነት ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ሀዋሳ የህይወት ቃል ቤተ-ክርስቲያን">18. ሀዋሳ የህይወት ቃል ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ቤሪያ የክ/ዳ/ም/አ ቤተ-ክርስቲያን">19. ቤሪያ የክ/ዳ/ም/አ ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="በክርስቶስ ፍቅር የዓለም ብርሃን ቤተ-ክርስቲያን">20. በክርስቶስ ፍቅር የዓለም ብርሃን ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ቤተ-ሳይዳ የወንጌል አማኞች ቤተ-ክርስቲያን">21. ቤተ-ሳይዳ የወንጌል አማኞች ቤተ-ክርስቲያን</SelectItem>
                      <SelectItem value="ምስጋና ቤተ-ክርስቲያን">22. ምስጋና ቤተ-ክርስቲያን</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Registration Requirements:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Age must be between 14 and 19 years</li>
                    <li>• Must be affiliated with a partner church</li>
                    <li>• Commitment to spiritual growth and leadership</li>
                    <li>• Registration is subject to approval</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-gray-400 py-3 text-lg font-semibold transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isStep2Valid}
                    className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Submitting Registration..." : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
