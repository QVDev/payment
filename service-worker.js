const origin = 'https://clean-mall.glitch.me';
const methodName = `${origin}/pay`;
const checkoutURL = `${origin}/checkout`;
let resolver;
let payment_request_event;

self.addEventListener('paymentrequest', e => {
  // Preserve the event for future use
  payment_request_event = e;
  // You'll need a polyfill for `PromiseResolver`
  // As it's not implemented in Chrome yet.
  resolver = new PromiseResolver();

  e.respondWith(resolver.promise);
  e.openWindow(checkoutURL).then(client => {
    if (client === null) {
      resolver.reject('Failed to open window');
    }
  }).catch(err => {
    resolver.reject(err);
  });
});

self.addEventListener('message', e => {
  console.log('A message received:', e);
  if (e.data === "payment_app_window_ready") {
    sendPaymentRequest();
    return;
  }

  console.log(e.data.methodName);
  console.log(methodName);
  if (e.data.methodName === methodName) {  
    resolver.resolve(e.data);  
  } else {  
    resolver.reject(e.data);  
  }  
});

const sendPaymentRequest = () => {
  if (!payment_request_event) return;
  clients.matchAll({
    includeUncontrolled: false,
    type: 'window'
  }).then(clientList => {
    for (let client of clientList) {
      client.postMessage(payment_request_event.total);
    }
  });
}

function PromiseResolver() {
  /** @private {function(T=): void} */
  this.resolve_;

  /** @private {function(*=): void} */
  this.reject_;

  /** @private {!Promise<T>} */
  this.promise_ = new Promise(function(resolve, reject) {
    this.resolve_ = resolve;
    this.reject_ = reject;
  }.bind(this));
}

PromiseResolver.prototype = {
  /** @return {!Promise<T>} */
  get promise() {
    return this.promise_;
  },

  /** @return {function(T=): void} */
  get resolve() {
    return this.resolve_;
  },

  /** @return {function(*=): void} */
  get reject() {
    return this.reject_;
  },
};