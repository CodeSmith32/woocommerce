/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { lazy, Suspense } from '@wordpress/element';
import { SETTINGS_STORE_NAME, PLUGINS_STORE_NAME } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import { EmbeddedBodyProps } from '../embedded-body-layout/embedded-body-props';
import RecommendationsEligibilityWrapper from '../settings-recommendations/recommendations-eligibility-wrapper';
import { getCountryCode } from '~/dashboard/utils';

const ShippingRecommendationsLoader = lazy(
	() =>
		import(
			/* webpackChunkName: "shipping-recommendations" */ './shipping-recommendations'
		)
);

export const ShippingRecommendations: React.FC< EmbeddedBodyProps > = ( {
	page,
	tab,
	section,
	zone_id,
} ) => {
	const { countryCode, installedPlugins } = useSelect( ( select ) => {
		const settings = select( SETTINGS_STORE_NAME ).getSettings< {
			general?: {
				woocommerce_default_country: string;
			};
		} >( 'general' );

		return {
			countryCode: getCountryCode(
				settings.general?.woocommerce_default_country
			),
			installedPlugins:
				select( PLUGINS_STORE_NAME ).getInstalledPlugins(),
		};
	} );

	if ( page !== 'wc-settings' || tab !== 'shipping' ) {
		return null;
	}

	if ( Boolean( section ) || Boolean( zone_id ) ) {
		// Return null if it's in the zone page or other shipping sections
		return null;
	}

	if ( countryCode !== 'US' || installedPlugins.includes( 'jetpack' ) ) {
		return null;
	}

	return (
		<RecommendationsEligibilityWrapper>
			<Suspense fallback={ null }>
				<ShippingRecommendationsLoader />
			</Suspense>
		</RecommendationsEligibilityWrapper>
	);
};
