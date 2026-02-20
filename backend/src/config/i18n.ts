import i18next from 'i18next';
import middleware from 'i18next-http-middleware';

const resources = {
    en: {
        translation: {
            auth: {
                required: 'Authentication required.',
                invalid_token: 'Invalid or expired token.',
                user_exists: 'User already exists.',
                registered: 'User registered successfully.',
                invalid_credentials: 'Invalid credentials.',
                login_success: 'Login successful.',
            },
            video: {
                unauthorized: 'Unauthorized.',
                no_url: 'No video URL provided.',
                user_not_found: 'User not found.',
                subscription_required: 'Please subscribe to a premium plan before you can upload videos.',
                upload_success: 'Video uploaded successfully.',
                internal_error: 'Internal server error.',
            },
            subscription: {
                no_session: 'No session ID provided.',
                active: 'Subscription activated successfully.',
            },
            admin: {
                unauthorized: 'Unauthorized. Admin role required.',
                video_not_found: 'Video not found.',
                status_updated: 'Video status updated successfully.',
            },
        },
    },
    es: {
        translation: {
            auth: {
                required: 'Se requiere autenticación.',
                invalid_token: 'Token inválido o expirado.',
                user_exists: 'El usuario ya existe.',
                registered: 'Usuario registrado exitosamente.',
                invalid_credentials: 'Credenciales inválidas.',
                login_success: 'Inicio de sesión exitoso.',
            },
            video: {
                unauthorized: 'No autorizado.',
                no_url: 'No se proporcionó la URL del video.',
                user_not_found: 'Usuario no encontrado.',
                subscription_required: 'Por favor, suscríbete a un plan premium antes de poder subir videos.',
                upload_success: 'Video subido exitosamente.',
                internal_error: 'Error interno del servidor.',
            },
            subscription: {
                no_session: 'No se proporcionó el ID de sesión.',
                active: 'Suscripción activada exitosamente.',
            },
            admin: {
                unauthorized: 'No autorizado. Se requiere rol de administrador.',
                video_not_found: 'Video no encontrado.',
                status_updated: 'Estado del video actualizado exitosamente.',
            },
        },
    },
    fr: {
        translation: {
            auth: {
                required: 'Authentification requise.',
                invalid_token: 'Jeton invalide ou expiré.',
                user_exists: "L'utilisateur existe déjà.",
                registered: 'Utilisateur enregistré avec succès.',
                invalid_credentials: 'Identifiants invalides.',
                login_success: 'Connexion réussie.',
            },
            video: {
                unauthorized: 'Non autorisé.',
                no_url: 'Aucune URL de vidéo fournie.',
                user_not_found: 'Utilisateur non trouvé.',
                subscription_required: 'Veuillez vous abonner à un forfait premium avant de pouvoir télécharger des vidéos.',
                upload_success: 'Vidéo téléchargée avec succès.',
                internal_error: 'Erreur interne du serveur.',
            },
            subscription: {
                no_session: 'Aucun identifiant de session fourni.',
                active: 'Abonnement activé avec succès.',
            },
            admin: {
                unauthorized: "Non autorisé. Rôle d'administrateur requis.",
                video_not_found: 'Vidéo non trouvée.',
                status_updated: 'Statut de la vidéo mis à jour avec succès.',
            },
        },
    },
    de: {
        translation: {
            auth: {
                required: 'Authentifizierung erforderlich.',
                invalid_token: 'Ungültiges oder abgelaufenes Token.',
                user_exists: 'Benutzer existiert bereits.',
                registered: 'Benutzer erfolgreich registriert.',
                invalid_credentials: 'Ungültige Anmeldedaten.',
                login_success: 'Anmeldung erfolgreich.',
            },
            video: {
                unauthorized: 'Nicht autorisiert.',
                no_url: 'Keine Video-URL angegeben.',
                user_not_found: 'Benutzer nicht gefunden.',
                subscription_required: 'Bitte abonnieren Sie einen Premium-Plan, bevor Sie Videos hochladen können.',
                upload_success: 'Video erfolgreich hochgeladen.',
                internal_error: 'Interner Serverfehler.',
            },
            subscription: {
                no_session: 'Keine Sitzungs-ID angegeben.',
                active: 'Abonnement erfolgreich aktiviert.',
            },
            admin: {
                unauthorized: 'Nicht autorisiert. Administratorrolle erforderlich.',
                video_not_found: 'Video nicht gefunden.',
                status_updated: 'Videostatus erfolgreich aktualisiert.',
            },
        },
    },
    pt: {
        translation: {
            auth: {
                required: 'Autenticação obrigatória.',
                invalid_token: 'Token inválido ou expirado.',
                user_exists: 'Usuário já existe.',
                registered: 'Usuário registrado com sucesso.',
                invalid_credentials: 'Credenciais inválidas.',
                login_success: 'Login efetuado com sucesso.',
            },
            video: {
                unauthorized: 'Não autorizado.',
                no_url: 'Nenhuma URL de vídeo fornecida.',
                user_not_found: 'Usuário não encontrado.',
                subscription_required: 'Por favor, assine um plano premium antes de poder enviar vídeos.',
                upload_success: 'Vídeo enviado com sucesso.',
                internal_error: 'Erro interno do servidor.',
            },
            subscription: {
                no_session: 'Nenhum ID de sessão fornecido.',
                active: 'Assinatura ativada com sucesso.',
            },
            admin: {
                unauthorized: 'Não autorizado. Função de administrador necessária.',
                video_not_found: 'Vídeo não encontrado.',
                status_updated: 'Status do vídeo atualizado com sucesso.',
            },
        },
    },
};

i18next
    .use(middleware.LanguageDetector)
    .init({
        resources,
        fallbackLng: 'es',
        supportedLngs: ['en', 'es', 'fr', 'de', 'pt'],
        detection: {
            order: ['header'],
            caches: false,
        },
    });

export { i18next, middleware };
