import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { registerSchema, RegisterData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            termsAccepted: false,
        },
    });

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            await authApi.register(data);
            toast.success(t('auth.register_success', 'Registration successful! Please login.'));
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || t('auth.register_failed', 'Registration failed');
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex flex-col items-center justify-center min-h-screen py-10 relative">
            <div className="absolute top-4 right-4 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
                <LanguageSwitcher isDark={true} />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('auth.createAccount', 'Create an Account')}</CardTitle>
                    <CardDescription>
                        {t('auth.registerDesc', 'Join Global Media Sports to promote your talent.')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.name', 'Full Name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.email', 'Email')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.password', 'Password')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="termsAccepted"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                {t('auth.termsAccept', 'I accept the terms and privacy policy')}
                                            </FormLabel>
                                            <FormDescription>
                                                {t('auth.termsDesc1', 'You agree to our')} <Link to="/terms" className="underline">{t('nav.terms', 'Terms of Service')}</Link> {t('auth.termsDesc2', 'and')} <Link to="/privacy" className="underline">{t('nav.privacy', 'Privacy Policy')}</Link>.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? t('auth.creatingAccount', 'Creating account...') : t('auth.registerBtn', 'Register')}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {t('auth.alreadyAccount', 'Already have an account?')} {' '}
                        <Link to="/login" className="underline text-blue-600">
                            {t('auth.loginHere', 'Login here')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;

