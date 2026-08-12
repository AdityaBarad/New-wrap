import mixpanel from 'mixpanel-browser';
import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === 'production';
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: !isProduction,
      track_pageview: false, // We will handle page views manually with our provider
    });

    // Automatically set Environment property on every event
    mixpanel.register({
      Environment: isProduction ? 'production' : 'development',
    });
  }
};

export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
    mixpanel.track(eventName, props);
  }
};

export const identifyUser = (distinctId: string) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
    mixpanel.identify(distinctId);
  }
  Sentry.setUser({ id: distinctId });
};

export const updateProfile = (props: Record<string, any>) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
    mixpanel.people.set(props);
  }
};

export const incrementProfile = (propName: string, amount: number = 1) => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
    mixpanel.people.increment(propName, amount);
  }
};
