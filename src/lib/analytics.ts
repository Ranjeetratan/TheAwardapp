// Google Analytics utility functions
// This helps track user interactions and verify that GA is working

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters
    });
    
    // Also log to console for debugging
    console.log('GA Event:', eventName, parameters);
  }
};

export const trackPageView = (pageName: string, pageUrl?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GPNTX4Z409', {
      page_title: pageName,
      page_location: pageUrl || window.location.href,
    });
    
    console.log('GA Page View:', pageName, pageUrl);
  }
};

// Track specific CofounderBase events
export const trackProfileView = (profileId: string, profileRole: string) => {
  trackEvent('profile_view', {
    event_category: 'profile',
    profile_id: profileId,
    profile_role: profileRole,
    label: `${profileRole}_profile_view`
  });
};

export const trackProfileSubmission = (role: string) => {
  trackEvent('profile_submission', {
    event_category: 'conversion',
    profile_role: role,
    label: `${role}_profile_submitted`
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    event_category: 'engagement',
    search_term: searchTerm,
    label: 'profile_search'
  });
};

export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent('filter_use', {
    event_category: 'engagement',
    filter_type: filterType,
    filter_value: filterValue,
    label: `filter_${filterType}`
  });
};

export const trackContactClick = (contactType: 'email' | 'linkedin' | 'share', profileRole: string) => {
  trackEvent('contact_click', {
    event_category: 'engagement',
    contact_type: contactType,
    profile_role: profileRole,
    label: `${contactType}_click`
  });
};

// Test function to verify GA is working
export const testGoogleAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('Testing Google Analytics...');
    console.log('gtag function exists:', typeof window.gtag === 'function');
    console.log('dataLayer exists:', Array.isArray(window.dataLayer));
    
    // Send a test event
    trackEvent('ga_test', {
      event_category: 'test',
      label: 'google_analytics_test',
      value: 1
    });
    
    return {
      gtagExists: typeof window.gtag === 'function',
      dataLayerExists: Array.isArray(window.dataLayer),
      dataLayerLength: window.dataLayer?.length || 0
    };
  }
  return null;
};