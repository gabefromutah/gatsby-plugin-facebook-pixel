jest.useFakeTimers();

const env = process.env;

const { onRouteUpdate } = require('../src/gatsby-browser');
const { onRenderBody } = require('../src/gatsby-ssr');

describe('gatsby-plugin-facebook-pixel', () => {
	beforeEach(() => {
		process.env = Object.assign(env, {
			NODE_ENV: 'production',
		});
	});

	describe('onRenderBody', () => {
		const setup = (options = {}) => {
			const setHeadComponents = jest.fn();
			const reporter = {
				warn: jest.fn(),
			};

			onRenderBody({ reporter, setHeadComponents }, options);

			return { options, reporter, setHeadComponents };
		};

		it('reports when no pixelId is provided', () => {
			const { reporter, setHeadComponents } = setup();

			expect(setHeadComponents).toHaveBeenCalledTimes(0);
			expect(reporter.warn).toHaveBeenCalledTimes(1);
		});

		it('works when pixelId is provided', () => {
			const options = {
				pixelId: 1234567,
			};

			const { reporter, setHeadComponents } = setup(options);

			expect(reporter.warn).toHaveBeenCalledTimes(0);
			expect(setHeadComponents).toHaveBeenCalledTimes(1);

			const resultObj = setHeadComponents.mock.calls[0][0];

			expect(Array.isArray(resultObj)).toBe(true);
			expect(resultObj[0].type).toEqual('script');
			expect(resultObj[0].props.dangerouslySetInnerHTML.__html).toMatch(
				/1234567/
			);
		});

		it('does nothing when NODE_ENV !== production', () => {
			process.env.NODE_ENV = 'test';

			const options = {
				pixelId: 1234567,
			};

			const { setHeadComponents } = setup(options);

			expect(setHeadComponents).toHaveBeenCalledTimes(0);
		});
	});

	describe('onRouteUpdate', () => {
		const location = {
			hash: '#hash',
			pathname: '/page',
			search: '?search',
		};

		beforeEach(() => {
			global.window = Object.assign(global.window, {
				fbq: jest.fn(),
			});
		});

		it('tracks page view', () => {
			onRouteUpdate({ location });

			expect(global.window.fbq).toHaveBeenCalledTimes(1);
			expect(global.window.fbq).toHaveBeenCalledWith(
				'track',
				'ViewContent'
			);
		});

		it('tracks multiple page views', () => {
			onRouteUpdate({ location });

			onRouteUpdate({
				location: {
					hash: '',
					pathname: '/page/sub-page',
					search: '',
				},
			});

			expect(global.window.fbq).toHaveBeenCalledTimes(2);
		});

		it('does nothing when window.fbq is undefined', () => {
			delete global.window.fbq;

			onRouteUpdate({ location });

			expect(global.window.fbq).toBeUndefined();
		});

		it('does nothing when process.env.NODE_ENV is not production', () => {
			process.env.NODE_ENV = 'test';

			onRouteUpdate({ location });

			expect(global.window.fbq).toHaveBeenCalledTimes(0);
		});
	});

	afterEach(() => {
		process.env = env;
	});
});
