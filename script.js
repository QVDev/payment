const request = new PaymentRequest([{
  supportedMethods: 'https://clean-mall.glitch.me',
  data: {
    supportedTypes: ['foo'],
  },
}], {
  total: {
    label: 'total',
    amount: { value: '10', currency: 'USD' }
  }
});

// Check if service worker is available 
if ('serviceWorker' in navigator) {
  // Register a service worker
  
  
  navigator.serviceWorker.register(
    // A service worker JS file is separate
    'service-worker.js'
  ).then(function(ServiceWorkerRegistration) { 
    const registration = ServiceWorkerRegistration
    console.log("available" + registration.paymentManager) 
      // Check if Payment Handler is available
    if (!registration.paymentManager) return;
    console.log("available")  
    
    registration.paymentManager.userHint = 'payment-handler user hint';
    registration.paymentManager.instruments.set(
      // Payment instrument key can be any string.
      "bobpay-payment-method",
      // Payment instrument detail
      {
        name: 'Payment Handler Example',
        method: 'https://clean-mall.glitch.me'
      }
    )    
  });
}