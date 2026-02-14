import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        navigate('/');
        return;
      }

      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentStatus('completed');
      setVerifying(false);
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <CardTitle className="text-4xl text-white mb-2">Payment Successful!</CardTitle>
          <CardDescription className="text-lg text-gray-300">
            Welcome to Elite Sports Agency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">What Happens Next?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">1.</span>
                <span>Our team will contact you within 24 hours to discuss your social media strategy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">2.</span>
                <span>We'll set up your content calendar and begin managing your Instagram and TikTok accounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">3.</span>
                <span>Send us your raw footage and our professional editors will create compelling highlight reels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">4.</span>
                <span>Watch your athletic visibility grow as we connect you with teams and brands</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-3">Important Information</h3>
            <p className="text-gray-300 mb-4">
              You'll receive a confirmation email with your subscription details and next steps. 
              Check your inbox (and spam folder) for an email from our team.
            </p>
            <p className="text-gray-400 text-sm">
              Payment Status: <span className="text-green-500 font-semibold">{paymentStatus}</span>
            </p>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6"
          >
            RETURN TO HOME
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
