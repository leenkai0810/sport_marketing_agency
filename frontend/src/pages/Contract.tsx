import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Contract = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        if (!accepted) {
            toast.error('You must accept the contract to proceed.');
            return;
        }

        setIsLoading(true);
        try {
            await userApi.acceptContract();
            toast.success('Contract accepted successfully.');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to accept contract.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen py-10">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Digital Representation Agreement</CardTitle>
                    <CardDescription>
                        Please review and accept the terms of our representation agreement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-96 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50 text-sm">
                    <h3 className="font-bold mb-2">1. Parties</h3>
                    <p className="mb-4">
                        This Agreement is between Global Media Sports ("Agency") and the User ("Athlete").
                    </p>

                    <h3 className="font-bold mb-2">2. Services</h3>
                    <p className="mb-4">
                        Agency agrees to promote Athlete's sports highlights on social media platforms including but not limited to Instagram, TikTok, and Facebook.
                    </p>

                    <h3 className="font-bold mb-2">3. Rights</h3>
                    <p className="mb-4">
                        Athlete grants Agency a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display the uploaded content for marketing and promotional purposes.
                    </p>

                    <h3 className="font-bold mb-2">4. Term</h3>
                    <p className="mb-4">
                        This agreement is effective upon acceptance and continues as long as the Athlete maintains an account with the Agency.
                    </p>

                    <h3 className="font-bold mb-2">5. Disclaimer</h3>
                    <p className="mb-4">
                        Agency does not guarantee specific results, such as recruitment by professional teams or sponsorship deals.
                    </p>

                    <div className="mt-8 text-xs text-gray-500">
                        Last Updated: {new Date().toLocaleDateString()}
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="accept" checked={accepted} onCheckedChange={(checked) => setAccepted(checked as boolean)} />
                        <Label htmlFor="accept" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I have read and agree to the Digital Representation Agreement
                        </Label>
                    </div>
                    <Button className="w-full" onClick={handleAccept} disabled={!accepted || isLoading}>
                        {isLoading ? 'Processing...' : 'Accept & Continue'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Contract;
