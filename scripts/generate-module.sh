#!/bin/bash
# Uso: bash scripts/generate-module.sh academic/teachers teacher

MODULE_PATH=$1   # ex: academic/teachers
ENTITY_NAME=$2   # ex: teacher

if [ -z "$MODULE_PATH" ] || [ -z "$ENTITY_NAME" ]; then
  echo "Uso: bash scripts/generate-module.sh <module-path> <entity-name>"
  echo "Exemplo: bash scripts/generate-module.sh academic/teachers teacher"
  exit 1
fi

BASE="modules/$MODULE_PATH"
PLURAL="${ENTITY_NAME}s"
NEST="npx nest g"

echo "Gerando módulo: $BASE"

$NEST module   $BASE
$NEST class    $BASE/domain/models/$ENTITY_NAME.entity                    --flat --no-spec
$NEST interface $BASE/domain/repositories/$ENTITY_NAME-repository         --flat
$NEST class    $BASE/application/dto/$ENTITY_NAME.dto                     --flat --no-spec
$NEST service  $BASE/application/services/create-$ENTITY_NAME             --flat --no-spec
$NEST service  $BASE/application/services/edit-$ENTITY_NAME               --flat --no-spec
$NEST service  $BASE/application/services/list-$PLURAL                    --flat --no-spec
$NEST service  $BASE/application/services/return-$ENTITY_NAME             --flat --no-spec
$NEST service  $BASE/application/services/remove-$ENTITY_NAME             --flat --no-spec
$NEST controller $BASE/infra/controllers/$PLURAL                          --flat --no-spec
$NEST class    $BASE/infra/repositories/drizzle-$ENTITY_NAME.repository   --flat --no-spec
$NEST class    $BASE/infra/database/schemas/$ENTITY_NAME.schema            --flat --no-spec

echo "Módulo $ENTITY_NAME gerado com sucesso em src/$BASE"