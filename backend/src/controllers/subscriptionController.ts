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

        const userEmail = user.email;

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

// Helper: activate subscription in DB
async function activateSubscription(userId: string, stripeSubscriptionId: string, stripeSub: any) {
    // Try multiple possible field names for the period end date
    const periodEndRaw = stripeSub.current_period_end
        || stripeSub.currentPeriodEnd
        || stripeSub.items?.data?.[0]?.current_period_end;

    let currentPeriodEnd: Date;
    if (periodEndRaw && !isNaN(Number(periodEndRaw))) {
        // Stripe returns Unix timestamp in seconds
        currentPeriodEnd = new Date(Number(periodEndRaw) * 1000);
    } else {
        // Fallback: 30 days from now
        console.warn('Could not extract current_period_end from Stripe subscription, using 30-day fallback. Stripe sub keys:', Object.keys(stripeSub));
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // Upsert Subscription record
    await prisma.subscription.upsert({
        where: { stripeId: stripeSubscriptionId },
        update: {
            status: 'ACTIVE',
            currentPeriodEnd,
        },
        create: {
            stripeId: stripeSubscriptionId,
            status: 'ACTIVE',
            currentPeriodEnd,
            userId,
        },
    });

    // Update User status
    await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: 'ACTIVE' },
    });

    console.log(`User ${userId} subscription activated (Stripe sub: ${stripeSubscriptionId}, periodEnd: ${currentPeriodEnd.toISOString()})`);
}

// Webhook handler
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
            const stripeSubscriptionId = session.subscription;

            if (userId && stripeSubscriptionId) {
                try {
                    // Fetch the subscription from Stripe
                    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
                    await activateSubscription(userId, stripeSubscriptionId, stripeSub);
                } catch (dbError) {
                    console.error('Failed to activate subscription in webhook:', dbError);
                }
            } else {
                console.warn('Webhook: Missing userId or subscriptionId in session', {
                    userId,
                    stripeSubscriptionId,
                    sessionId: session.id,
                });
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
};

// Verify session endpoint (fallback for when webhook is delayed)
export const verifySession = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { sessionId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!sessionId) {
            return res.status(400).json({ message: 'No session ID provided' });
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify the session belongs to this user
        if (session.metadata?.userId !== userId) {
            return res.status(403).json({ message: 'Session does not belong to this user' });
        }

        // Check if payment was successful
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not completed', status: session.payment_status });
        }

        const stripeSubscriptionId = session.subscription as string;

        if (!stripeSubscriptionId) {
            return res.status(400).json({ message: 'No subscription found in session' });
        }

        // Fetch the subscription from Stripe
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        await activateSubscription(userId, stripeSubscriptionId, stripeSub);

        res.json({ message: 'Subscription activated successfully', status: 'ACTIVE' });
    } catch (error: any) {
        console.error('Verify session error:', error);
        res.status(500).json({ message: 'Failed to verify session' });
    }
};

