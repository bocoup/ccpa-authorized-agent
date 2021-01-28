#!/bin/sh
# wait-for-migration.sh

set -e

until ./node_modules/.bin/sequelize db:migrate; do
  >&2 echo "Migration failed - sleeping"
  sleep 1
done

>&2 echo "Migration complete"
