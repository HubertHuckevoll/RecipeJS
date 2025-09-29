<?php
require_once __DIR__ . '/../../RecipeJS.php';

function assertEquals($expected, $actual, $message = ''): void
{
  if ($expected !== $actual)
  {
    if ($message === '')
    {
      $message = 'Failed asserting that ' . var_export($actual, true) . ' matches expected ' . var_export($expected, true);
    }
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
  }
}

$recipe = new RecipeJS();
$recipe->cssReplaceClass('.target', 'old', 'new');

$ref = new ReflectionClass(RecipeJS::class);
$prop = $ref->getProperty('out');
$prop->setAccessible(true);
$out = $prop->getValue($recipe);

assertEquals('replaceClass', $out[0]['method'], 'cssReplaceClass should emit the replaceClass method name.');
assertEquals('.target', $out[0]['target']);
assertEquals('old', $out[0]['oldName']);
assertEquals('new', $out[0]['newName']);

echo "PHP tests passed" . PHP_EOL;
