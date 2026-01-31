'use client';

import { useState } from 'react';
import { packages, getServicesForPackage, calculatePackagePrice, PackageType } from '@/lib/services-pricing';
import { Locale } from '@/lib/i18n';
import { colors, components, borderRadius, shadows, spacing } from '@/lib/design-tokens';

interface PackageBuilderProps {
  locale: Locale;
  translations: {
    [key: string]: string;
  };
}

export function PackageBuilder({ locale, translations }: PackageBuilderProps) {
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'complete'>('basic');
  const [additionalPersons, setAdditionalPersons] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedPkg = packages.find((p) => p.id === selectedPackage);
  const totalPrice = calculatePackagePrice(selectedPackage, additionalPersons);
  const includedServices = getServicesForPackage(selectedPackage);

  const isRTL = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setSubmitError(translations['pricing.form.errorRequired'] || 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/leads.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: '',
          message: `Package: ${selectedPackage.toUpperCase()}, Additional Persons: ${additionalPersons}, Total Price: $${totalPrice}`,
          source: 'pricing-package-builder',
          selectedPackage,
          additionalPersons,
          totalPrice,
          website: honeypot, // Honeypot field
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
        setName('');
        setAdditionalPersons(0);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(translations['pricing.form.errorGeneral'] || 'Something went wrong');
      }
    } catch (error) {
      setSubmitError(translations['pricing.form.errorGeneral'] || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="package-builder-container"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing[8],
      }}
    >
      {/* Package Selection Cards */}
      <div
        className="package-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing[6],
          marginBottom: spacing[12],
        }}
      >
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackage === pkg.id}
            onSelect={() => setSelectedPackage(pkg.id)}
            translations={translations}
            isRTL={isRTL}
          />
        ))}
      </div>

      {/* Builder Layout */}
      <div
        className="builder-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: isRTL ? '400px 1fr' : '1fr 400px',
          gap: spacing[8],
          alignItems: 'start',
        }}
      >
        {/* Included Services */}
        <div
          className="included-services-panel"
          style={{
            order: isRTL ? 2 : 1,
            background: '#ffffff',
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.md,
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: colors.neutral[900],
              marginBottom: spacing[6],
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {translations['pricing.includedServices'] || 'Included Services'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {includedServices.map((service) => (
              <div
                key={service.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: spacing[3],
                  background: colors.neutral[50],
                  borderRadius: borderRadius.lg,
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.lg,
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  <i className={service.icon} style={{ fontSize: '1.25rem' }} />
                </div>
                <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.neutral[900],
                    }}
                  >
                    {translations[service.nameKey] || service.nameKey}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: colors.neutral[600],
                      marginTop: '2px',
                    }}
                  >
                    {translations[service.descriptionKey] || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Summary Panel */}
        <div
          className="summary-panel"
          style={{
            order: isRTL ? 1 : 2,
            position: 'sticky',
            top: '20px',
          }}
        >
          {/* Price Summary */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: borderRadius.xl,
              padding: spacing[8],
              boxShadow: shadows.md,
              marginBottom: spacing[6],
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: colors.neutral[900],
                marginBottom: spacing[6],
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {translations['pricing.yourPackage'] || 'Your Package'}
            </h3>

            {/* Beneficiaries Counter */}
            <div
              style={{
                padding: spacing[4],
                background: colors.neutral[50],
                borderRadius: borderRadius.lg,
                marginBottom: spacing[6],
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.neutral[700],
                  marginBottom: spacing[3],
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {translations['pricing.additionalPersons'] || 'Additional Persons'}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[4],
                }}
              >
                <button
                  type="button"
                  onClick={() => setAdditionalPersons(Math.max(0, additionalPersons - 1))}
                  disabled={additionalPersons === 0}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: additionalPersons === 0 ? colors.neutral[200] : colors.primary[500],
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    cursor: additionalPersons === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="ri-subtract-line" />
                </button>
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: colors.neutral[900],
                  }}
                >
                  {additionalPersons}
                </span>
                <button
                  type="button"
                  onClick={() => setAdditionalPersons(additionalPersons + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: colors.primary[500],
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="ri-add-line" />
                </button>
              </div>
              {additionalPersons > 0 && selectedPkg && (
                <div
                  style={{
                    marginTop: spacing[3],
                    fontSize: '0.75rem',
                    color: colors.neutral[600],
                    textAlign: 'center',
                  }}
                >
                  +${selectedPkg.additionalPersonPrice} × {additionalPersons} = +$
                  {selectedPkg.additionalPersonPrice * additionalPersons}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: spacing[6] }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: spacing[3],
                  fontSize: '0.875rem',
                }}
              >
                <span style={{ color: colors.neutral[600] }}>
                  {translations['pricing.basePrice'] || 'Base Price'}
                </span>
                <span style={{ fontWeight: 600, color: colors.neutral[900] }}>
                  ${selectedPkg?.basePrice}
                </span>
              </div>
              {additionalPersons > 0 && selectedPkg && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: spacing[3],
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: colors.neutral[600] }}>
                    {translations['pricing.additionalCost'] || 'Additional Persons'}
                  </span>
                  <span style={{ fontWeight: 600, color: colors.neutral[900] }}>
                    +${selectedPkg.additionalPersonPrice * additionalPersons}
                  </span>
                </div>
              )}
              <div
                style={{
                  borderTop: `2px solid ${colors.neutral[200]}`,
                  paddingTop: spacing[4],
                  marginTop: spacing[4],
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: colors.neutral[900],
                  }}
                >
                  {translations['pricing.total'] || 'Total'}
                </span>
                <span
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: colors.primary[500],
                  }}
                >
                  ${totalPrice}
                </span>
              </div>
            </div>

            {/* Payment Terms */}
            {selectedPkg && (
              <div
                style={{
                  padding: spacing[4],
                  background: colors.neutral[50],
                  borderRadius: borderRadius.lg,
                  marginBottom: spacing[6],
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: colors.neutral[700],
                    marginBottom: spacing[2],
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {translations['pricing.paymentTerms'] || 'Payment Terms'}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.neutral[600], textAlign: isRTL ? 'right' : 'left' }}>
                  <div style={{ marginBottom: spacing[1] }}>
                    • {selectedPkg.paymentTerms.upfront}%{' '}
                    {translations['pricing.paymentTerms.upfront'] || 'upfront'}
                  </div>
                  <div style={{ marginBottom: spacing[1] }}>
                    • {selectedPkg.paymentTerms.milestone1}%{' '}
                    {translations[selectedPkg.paymentTerms.milestone1Key] || 'at milestone 1'}
                  </div>
                  <div>
                    • {selectedPkg.paymentTerms.milestone2}%{' '}
                    {translations[selectedPkg.paymentTerms.milestone2Key] || 'at milestone 2'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: borderRadius.xl,
              padding: spacing[6],
              boxShadow: shadows.md,
            }}
          >
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: colors.neutral[900],
                marginBottom: spacing[4],
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {translations['pricing.form.title'] || 'Get Package Details'}
            </h4>

            {submitSuccess ? (
              <div
                style={{
                  padding: spacing[4],
                  background: colors.success.light,
                  color: colors.success.dark,
                  borderRadius: borderRadius.lg,
                  textAlign: 'center',
                  fontSize: '0.875rem',
                }}
              >
                <i className="ri-checkbox-circle-line" style={{ fontSize: '2rem', display: 'block', marginBottom: spacing[2] }} />
                {translations['pricing.form.success'] || 'Thank you! We will contact you soon.'}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Honeypot field */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div style={{ marginBottom: spacing[4] }}>
                  <input
                    type="text"
                    placeholder={translations['pricing.form.name'] || 'Your Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: borderRadius.lg,
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing[4] }}>
                  <input
                    type="email"
                    placeholder={translations['pricing.form.email'] || 'Your Email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: borderRadius.lg,
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                </div>

                {submitError && (
                  <div
                    style={{
                      padding: spacing[3],
                      background: colors.error.light,
                      color: colors.error.dark,
                      borderRadius: borderRadius.lg,
                      fontSize: '0.75rem',
                      marginBottom: spacing[4],
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    background: colors.primary[500],
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: borderRadius.full,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {isSubmitting
                    ? translations['pricing.form.submitting'] || 'Submitting...'
                    : translations['pricing.form.submit'] || 'Get Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
          }
          .summary-panel {
            order: 1 !important;
            position: static !important;
          }
          .included-services-panel {
            order: 2 !important;
          }
        }

        @media (max-width: 768px) {
          .package-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }

        input:focus {
          border-color: ${colors.primary[500]} !important;
          box-shadow: 0 0 0 3px ${colors.primary[500]}40 !important;
        }

        button:hover:not(:disabled) {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

interface PackageCardProps {
  pkg: PackageType;
  isSelected: boolean;
  onSelect: () => void;
  translations: { [key: string]: string };
  isRTL: boolean;
}

function PackageCard({ pkg, isSelected, onSelect, translations, isRTL }: PackageCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`
          : '#ffffff',
        border: isSelected ? 'none' : `2px solid ${colors.neutral[200]}`,
        borderRadius: borderRadius.xl,
        padding: spacing[6],
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: isSelected ? shadows.lg : shadows.md,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        position: 'relative',
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: spacing[4],
            right: isRTL ? 'auto' : spacing[4],
            left: isRTL ? spacing[4] : 'auto',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary[500],
          }}
        >
          <i className="ri-checkbox-circle-fill" style={{ fontSize: '1.5rem' }} />
        </div>
      )}

      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: borderRadius.xl,
          background: isSelected ? 'rgba(255,255,255,0.2)' : colors.neutral[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing[4],
          color: isSelected ? '#ffffff' : colors.primary[500],
        }}
      >
        <i className={pkg.icon} style={{ fontSize: '2rem' }} />
      </div>

      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: isSelected ? '#ffffff' : colors.neutral[900],
          marginBottom: spacing[2],
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {translations[pkg.nameKey] || pkg.nameKey}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: isSelected ? 'rgba(255,255,255,0.9)' : colors.neutral[600],
          marginBottom: spacing[4],
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {translations[pkg.descriptionKey] || pkg.descriptionKey}
      </p>

      <div
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: isSelected ? '#ffffff' : colors.primary[500],
          marginBottom: spacing[2],
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        ${pkg.basePrice}
      </div>

      <div
        style={{
          fontSize: '0.75rem',
          color: isSelected ? 'rgba(255,255,255,0.8)' : colors.neutral[500],
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {translations['pricing.basePackage'] || 'Base package (2 adults + 1 newborn)'}
      </div>
    </div>
  );
}
