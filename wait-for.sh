#!/usr/bin/env sh
# wait-for.sh

set -e

hostport="$1"
shift

# Skip optional "--" separator
if [ "$1" = "--" ]; then
  shift
fi

until nc -z ${hostport%:*} ${hostport#*:}; do
  echo "⏳ Aguardando $hostport..."
  sleep 2
done

echo "✅ $hostport está pronto!"
exec "$@"