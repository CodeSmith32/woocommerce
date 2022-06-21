/**
 * External dependencies
 */
import { render, waitFor } from '@testing-library/react';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { ShippingRecommendations } from '../shipping-recommendations-wrapper';

jest.mock( '@wordpress/data', () => ( {
	...jest.requireActual( '@wordpress/data' ),
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( '@wordpress/element', () => ( {
	...jest.requireActual( '@wordpress/element' ),
	Suspense: () => <div>Woocommerce Shipping</div>,
} ) );

const eligibleSelectReturn = {
	getInstalledPlugins: () => [],
	getSettings: () => ( {
		general: {
			woocommerce_default_country: 'US',
		},
	} ),
	getOption: () => 'yes',
	getCurrentUser: () => ( {
		is_super_admin: true,
	} ),
	hasStartedResolution: () => true,
	hasFinishedResolution: () => true,
};

describe( 'ShippingRecommendations', () => {
	beforeEach( () => {
		( useSelect as jest.Mock ).mockImplementation( ( fn ) =>
			fn( () => eligibleSelectReturn )
		);
	} );

	it( 'should not render when section is not empty', () => {
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ 'section' }
				zone_id={ undefined }
			/>
		);

		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should not render when zone_id is not empty', () => {
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ 'zone_id' }
			/>
		);

		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should not render when jetpack is already installed', () => {
		( useSelect as jest.Mock ).mockImplementation( ( fn ) =>
			fn( () => ( {
				...eligibleSelectReturn,
				getInstalledPlugins: () => [ 'jetpack' ],
				getSettings: () => ( {
					general: {
						woocommerce_default_country: 'US',
					},
				} ),
			} ) )
		);
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ undefined }
			/>
		);

		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should not render when country is not US', () => {
		( useSelect as jest.Mock ).mockImplementation( ( fn ) =>
			fn( () => ( {
				...eligibleSelectReturn,
				getSettings: () => ( {
					general: {
						woocommerce_default_country: 'CA',
					},
				} ),
			} ) )
		);
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ undefined }
			/>
		);
		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should not render when woocommerce_show_marketplace_suggestions is "no"', () => {
		( useSelect as jest.Mock ).mockImplementation( ( fn ) =>
			fn( () => ( {
				...eligibleSelectReturn,
				getOption: () => 'no',
			} ) )
		);
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ undefined }
			/>
		);
		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should not render when user is not allowed', () => {
		( useSelect as jest.Mock ).mockImplementation( ( fn ) =>
			fn( () => ( {
				...eligibleSelectReturn,
				getCurrentUser: () => ( {
					is_super_admin: false,
					capabilities: {},
				} ),
			} ) )
		);
		const { queryByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ undefined }
			/>
		);
		expect( queryByText( 'Woocommerce Shipping' ) ).not.toBeInTheDocument();
	} );

	it( 'should render WCS', async () => {
		const { getByText } = render(
			<ShippingRecommendations
				page="wc-settings"
				tab="shipping"
				section={ undefined }
				zone_id={ undefined }
			/>
		);

		expect( getByText( 'Woocommerce Shipping' ) ).toBeInTheDocument();
	} );
} );
