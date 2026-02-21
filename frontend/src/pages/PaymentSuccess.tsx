import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { subscriptionApi } from '@/api/subscription';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard');
      return;
    }

    const verify = async () => {
      try {
        await subscriptionApi.verifySession(sessionId);
        setVerified(true);
      } catch (error) {
        console.error('Failed to verify session:', error);
        // Even if verify fails (e.g. webhook already handled it), show success
        // since Stripe already confirmed payment
        setVerified(true);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {verifying ? (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verifying ? 'Verifying Payment...' : 'Payment Successful!'}
          </CardTitle>
          <CardDescription>
            {verifying
              ? 'Please wait while we activate your subscription...'
              : 'Thank you for subscribing to Global Media Sports.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!verifying && (
            <>
              <p className="text-gray-600">
                Your account has been upgraded. You can now upload unlimited videos and access premium features.
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

