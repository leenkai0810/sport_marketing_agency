import { Request, Response } from 'express';
import stripe from '../config/stripe';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

// Create a checkout session
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: (req as any).t('video.unauthorized') });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: (req as any).t('video.user_not_found') });
        }

        const userEmail = user.email; // In a real app, fetch from DB if not in token

        // Simple fixed price for MVP - e.g., $10/month
        // You should replace this with a real Price ID from your Stripe Dashboard
        // Hardcoded price for MVP
        // const priceId = process.env.STRIPE_PRICE_ID;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Global Media Sports Premium',
                            description: 'Unlock exclusive features: 2 Pro Videos/mo, Strategy & Reporting',
                        },
                        unit_amount: 1000,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
            customer_email: userEmail,
            metadata: {
                userId: userId || '',
            },
            custom_text: {
                submit: {
                    message: "Join Global Media Sports Premium",
                },
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ message: 'Failed to create checkout session' });
    }
};

// Webhook handler
// Note: Webhook signature verification is critical for production
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.error('CRITICAL: STRIPE_WEBHOOK_SECRET environment variable is missing.');
        return res.status(500).json({ message: 'Webhook secret is not configured' });
    }

    if (!sig) {
        return res.status(400).send('No Stripe signature provided');
    }

    let event;

    try {
        // req.body is a raw Buffer because of express.raw() in subscriptionRoutes.ts
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any;
            const userId = session.metadata?.userId;

            if (userId) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { subscriptionStatus: 'ACTIVE' },
                });
                console.log(`User ${userId} subscription activated`);
            }
            break;
        }

        // Add other event handlers (invoice.payment_failed, etc.)
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
};
