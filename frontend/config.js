window.NEXTSTEP_CONFIG = Object.assign({
  // Local Django API. Override in production deploys if needed.
  API_BASE: 'http://127.0.0.1:8000',
}, window.NEXTSTEP_CONFIG || {});
