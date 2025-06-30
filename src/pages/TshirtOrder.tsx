import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getActiveEdition } from '@/utils/supabaseDataManager';
import { createTShirtOrder } from '@/utils/tshirtOrderManager';
import { supabase } from '@/integrations/supabase/client';
import { TShirtSize } from '@/types/tshirt-order';

interface Registration {
  id: string;
  name: string;
  phone: string;
}

// Helper to normalize phone numbers
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  // If 9 digits and doesn't start with 0, add 0
  if (digits.length === 9 && digits[0] !== '0') {
    digits = '0' + digits;
  }
  return digits;
}

export default function TshirtOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'phone' | 'form' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState<TShirtSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [paymentReference, setPaymentReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [editionName, setEditionName] = useState('');

  // Load active edition name
  useEffect(() => {
    const loadActiveEdition = async () => {
      try {
        const edition = await getActiveEdition();
        if (edition) {
          setEditionName(edition.name);
        }
      } catch (error) {
        console.error('Error loading active edition:', error);
      }
    };

    loadActiveEdition();
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: 'Error',
        description: 'Please enter your phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Normalize phone number
      const normalizedPhone = normalizePhone(phone);
      // Get the active edition
      const edition = await getActiveEdition();
      if (!edition) {
        throw new Error('No active edition found');
      }

      // Check if registration exists
      const { data: registration, error } = await supabase
        .from('registrations')
        .select('id, name, phone')
        .eq('phone', normalizedPhone)
        .eq('edition_id', edition.id)
        .single();

      if (error || !registration) {
        toast({
          title: 'Registration not found',
          description: 'We could not find a registration with that phone number.',
          variant: 'destructive',
        });
        return;
      }

      setRegistration(registration);
      setStep('form');
    } catch (error) {
      console.error('Error checking registration:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registration || !size || !paymentReference) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the active edition
      const edition = await getActiveEdition();
      if (!edition) {
        throw new Error('No active edition found');
      }

      // Create the order
      const orderData = {
        registration_id: registration.id,
        edition_id: edition.id,
        size,
        quantity,
        payment_reference: paymentReference,
      };

      await createTShirtOrder(orderData);
      setStep('success');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold mb-6 text-center">T-Shirt Order</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Enter the phone number you used for registration to order your event T-shirt.
          </p>
          
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Button
            variant="ghost"
            onClick={() => setStep('phone')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold mb-2 text-center">T-Shirt Order</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            {editionName}
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Registered to:</strong> {registration?.name}<br />
              <strong>Phone:</strong> {registration?.phone}
            </p>
          </div>
          
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <Label htmlFor="size" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                T-Shirt Size <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={size} 
                onValueChange={(value: TShirtSize) => setSize(value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small (S)</SelectItem>
                  <SelectItem value="M">Medium (M)</SelectItem>
                  <SelectItem value="L">Large (L)</SelectItem>
                  <SelectItem value="XL">Extra Large (XL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Max 10 T-shirts per order
              </p>
            </div>
            
            <div>
              <Label htmlFor="reference" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Payment Reference Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reference"
                type="text"
                placeholder="Enter your payment reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Reference number from your bank or Telebirr payment
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Payment Instructions
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-5">
                <li>Make payment to our bank account or via Telebirr</li>
                <li>Use your phone number as the reference</li>
                <li>Enter the payment reference number above</li>
                <li>Your order will be verified within 24-48 hours</li>
              </ul>
            </div>
            
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Success step
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your T-shirt order. We've received your payment reference and will verify it shortly.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Details</h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p><span className="font-medium">Name:</span> {registration?.name}</p>
            <p><span className="font-medium">Phone:</span> {registration?.phone}</p>
            <p><span className="font-medium">Size:</span> {size}</p>
            <p><span className="font-medium">Quantity:</span> {quantity}</p>
            <p><span className="font-medium">Reference:</span> {paymentReference}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          You'll receive a confirmation message once your payment is verified.
          If you have any questions, please contact our support team.
        </p>
        
        <Button 
          onClick={() => navigate('/')} 
          className="w-full"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
