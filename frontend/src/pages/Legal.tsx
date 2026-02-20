import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Legal = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Legal Notice</h1>
                <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
            </div>
            <div className="prose max-w-none">
                <h2>Company Information</h2>
                <p><strong>Global Media Sports</strong></p>
                <p>Registered Address: 123 Sports Avenue, Athletic City, AC 12345</p>
                <p>Email: contact@globalmediasports.com</p>
                <p>Phone: +1 (555) 123-4567</p>

                <h2>Copyright</h2>
                <p>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Global Media Sports or its content suppliers and protected by international copyright laws.</p>
            </div>
        </div>
    );
};

export default Legal;
