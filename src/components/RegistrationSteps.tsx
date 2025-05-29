
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, User, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";

interface RegistrationStepsProps {
  formData: {
    name: string;
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

  const nextStep = () => {
    // Validate step 1 before proceeding
    if (currentStep === 1) {
      const requiredStep1Fields = ['name', 'phone', 'age'];
      const missingFields = requiredStep1Fields.filter(field => !formData[field]);
      
      if (missingFields.length > 0 || ageError) {
        return;
      }
    }
    setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);

  const isStep1Valid = formData.name && formData.phone && formData.age && !ageError;
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
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                    className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-foreground">
                    Age (14-19 years) *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => onInputChange('age', e.target.value)}
                    className={`border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                      ageError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    min="14"
                    max="19"
                    required
                  />
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
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                      <SelectItem value="preparatory">Preparatory</SelectItem>
                      <SelectItem value="first-year">First Year University</SelectItem>
                      <SelectItem value="second-year">Second Year University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="church" className="text-sm font-medium text-foreground">
                    Church *
                  </Label>
                  <Input
                    id="church"
                    placeholder="Enter your church name"
                    value={formData.church}
                    onChange={(e) => onInputChange('church', e.target.value)}
                    className="border-border focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
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
