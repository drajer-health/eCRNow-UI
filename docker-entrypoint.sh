#!/bin/sh

# Write runtime environment variables into env.js
cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  REACT_APP_ECR_BASE_URL: '${REACT_APP_ECR_BASE_URL}',
  REACT_APP_BYPASS_AUTH: '${REACT_APP_BYPASS_AUTH}',
  REACT_APP_REFRESH_TIME: '${REACT_APP_REFRESH_TIME}',
};
EOF

exec nginx -g "daemon off;"
