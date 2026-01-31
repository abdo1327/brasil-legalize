import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// Public GET - Get pricing packages and services
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  try {
    // Get packages from 'packages' table
    const packagesResult = await query(`
      SELECT id, slug, 
             CASE WHEN $1 = 'ar' THEN name_ar
                  WHEN $1 = 'es' THEN name_es
                  WHEN $1 = 'pt' THEN name_pt
                  ELSE name_en END as name,
             description_en as description,
             price, currency, adults_included, children_included,
             price_per_extra_adult, price_per_extra_child,
             is_popular, sort_order,
             discount_percent, discount_ends_at, original_price
      FROM packages WHERE is_active = TRUE
      ORDER BY sort_order
    `, [locale]);

    // Get services from 'services' table
    const servicesResult = await query(`
      SELECT id, slug,
             CASE WHEN $1 = 'ar' THEN COALESCE(name_ar, name_en)
                  WHEN $1 = 'es' THEN COALESCE(name_es, name_en)
                  WHEN $1 = 'pt' THEN COALESCE(name_pt, name_en)
                  ELSE name_en END as name,
             description_en as description,
             price, currency, icon, color, category, 
             included_in_basic, included_in_complete,
             display_order
      FROM services WHERE is_active = TRUE
      ORDER BY display_order
    `, [locale]);

    // Build packages response
    const packages = packagesResult.rows.map((pkg: any) => {
      // Determine included services based on package slug
      const includedServices = servicesResult.rows
        .filter((svc: any) => {
          if (pkg.slug === 'basic') return svc.included_in_basic;
          if (pkg.slug === 'complete') return svc.included_in_complete;
          return false;
        })
        .map((svc: any) => svc.slug);

      return {
        id: pkg.id,
        slug: pkg.slug,
        key: pkg.slug,
        name: pkg.name,
        description: pkg.description,
        price: parseFloat(pkg.price),
        basePrice: parseFloat(pkg.price),
        currency: pkg.currency,
        adultsIncluded: pkg.adults_included,
        childrenIncluded: pkg.children_included,
        pricePerExtraAdult: parseFloat(pkg.price_per_extra_adult || 0),
        pricePerExtraChild: parseFloat(pkg.price_per_extra_child || 0),
        is_popular: pkg.is_popular,
        isPopular: pkg.is_popular,
        discount_percent: parseFloat(pkg.discount_percent || 0),
        discountPercent: parseFloat(pkg.discount_percent || 0),
        discountEndsAt: pkg.discount_ends_at,
        original_price: pkg.original_price ? parseFloat(pkg.original_price) : null,
        originalPrice: pkg.original_price ? parseFloat(pkg.original_price) : null,
        discount_active: pkg.discount_percent > 0,
        includedServices,
      };
    });

    // Build services by category
    const services: Record<string, any[]> = {
      essential: [],
      premium: [],
      addon: [],
    };

    servicesResult.rows.forEach((svc: any) => {
      const service = {
        key: svc.slug,
        name: svc.name,
        description: svc.description,
        price: parseFloat(svc.price),
        currency: svc.currency,
        icon: svc.icon,
        color: svc.color,
      };
      if (services[svc.category]) {
        services[svc.category].push(service);
      }
    });

    return jsonResponse({
      success: true,
      packages,
      services,
    });
  } catch (error) {
    console.error('Pricing fetch error:', error);
    return errorResponse('Failed to fetch pricing', 500);
  }
}
