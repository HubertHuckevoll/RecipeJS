<?php

/**
 * RecipeJS - your final JavaSript Library
 * __________________________________________________________________
 */

class RecipeJS
{
  protected $out = [];

  public function domReplace(string $target, string $html): void
  {
    $this->addOutput(
    [
      'module' => 'dom',
      'method' => 'replace',
      'target' => $target,
      'html' => $html
    ]);
  }

  public function domReplaceInner(string $target, string $html): void
  {
    $this->addOutput(
    [
      'module' => 'dom',
      'method' => 'replaceInner',
      'target' => $target,
      'html' => $html
    ]);
  }

  public function append(string $target, string $html): void
  {
    $this->addOutput(
      [
        'module' => 'dom',
        'method' => 'append',
        'target' => $target,
        'html' => $html
      ]);
  }

  public function prepend(string $target, string $html)
  {
    $this->addOutput(
      [
        'module' => 'dom',
        'method' => 'prepend',
        'target' => $target,
        'html' => $html
      ]);
  }

  public function before(string $target, string $html)
  {
    $this->addOutput(
      [
        'module' => 'dom',
        'method' => 'before',
        'target' => $target,
        'html' => $html
      ]);
  }

  public function after(string $target, string $html)
  {
    $this->addOutput(
      [
        'module' => 'dom',
        'method' => 'after',
        'target' => $target,
        'html' => $html
      ]);
  }

  public function domAttr(string $target, string $attrName, string $attrVal)
  {
    $this->addOutput(
    [
      'module' => 'dom',
      'method' => 'attr',
      'target' => $target,
      'attrName' => $attrName,
      'attrVal' => $attrVal
    ]);
  }

  public function focusFocus(string $target): void
  {
    $this->addOutput(
    [
      'module' => 'focus',
      'method' => 'focus',
      'target' => $target
    ]);
  }

  public function focusBlur(string $target): void
  {
    $this->addOutput(
    [
      'module' => 'focus',
      'method' => 'blur',
      'target' => $target
    ]);
  }

  public function cssAddClass(string $target, array $classes): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'addClass',
      'target' => $target,
      'classes' => $classes
    ]);
  }

  public function cssRemoveClass(string $target, array $classes): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'removeClass',
      'target' => $target,
      'classes' => $classes
    ]);
  }

  public function cssToggleClass(string $target, array $classes): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'toggleClass',
      'target' => $target,
      'classes' => $classes
    ]);
  }

  public function cssReplaceClass(string $target, string $oldName, string $newName): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'addClass',
      'target' => $target,
      'oldName' => $oldName,
      'newName' => $newName
    ]);
  }

  public function cssHide(string $target, string $hideClass, string $showClass, bool $await = false): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'hide',
      'target' => $target,
      'showClass' => $showClass,
      'hideClass' => $hideClass,
      'await' => $await
    ]);
  }

  public function cssShow(string $target, string $hideClass, string $showClass, bool $await = false): void
  {
    $this->addOutput(
    [
      'module' => 'css',
      'method' => 'show',
      'target' => $target,
      'showClass' => $showClass,
      'hideClass' => $hideClass,
      'await' => $await
    ]);
  }

  public function eventEmitRcp(array $detail, int $timeout): void
  {
    $this->addOutput(
    [
      'module' => 'event',
      'method' => 'emit',
      'type' => 'rcp',
      'detail' => $detail,
      'timeout' => $timeout
    ]);
  }

  public function toolLog(string $msg): void
  {
    $this->addOutput(
    [
      'module' => 'tool',
      'method' => 'log',
      'msg' => $msg
    ]);
  }

  public function toolNop(): void
  {
    $this->addOutput(
    [
      'module' => 'tool',
      'method' => 'nop'
    ]);
  }

  public function toolReload(): void
  {
    $this->addOutput(
    [
      'module' => 'tool',
      'method' => 'reload'
    ]);
  }

  public function send(): void
  {
    echo json_encode($this->out);
  }

  protected function addOutput($data): void
  {
    array_push($this->out, $data);
  }

}
