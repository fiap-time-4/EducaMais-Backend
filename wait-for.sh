#!/usr/bin/env bash
# wait-for.sh

set -e

hostport="$1"
shift

until nc -z ${hostport%:*} ${hostport#*:}; do
  echo "⏳ Aguardando $hostport..."
  sleep 2
done

echo "✅ $hostport está pronto!"
exec "$@"