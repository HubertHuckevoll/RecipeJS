import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { RecipeJS } from '../RecipeJS.js';
import { Dom } from '../Dom.js';
import { Css } from '../Css.js';

function setupDom(html = '<!doctype html><html><body></body></html>')
{
  const dom = new JSDOM(html);
  global.window = dom.window;
  global.document = dom.window.document;
  global.DOMParser = dom.window.DOMParser;
  global.Node = dom.window.Node;
  return dom;
}

test('exec decrements counter and skips cook on failed request', async (t) =>
{
  setupDom();
  const recipe = new RecipeJS();
  let cookCalls = 0;
  recipe.cook = () =>
  {
    cookCalls++;
  };

  global.fetch = () => Promise.reject(new Error('network down'));

  await recipe.exec('/fail', {}, 0);

  assert.equal(recipe.requestCounter, 0);
  assert.equal(cookCalls, 0);
  assert.equal(recipe.requestQueue.length, 0);
});

test('request throws on non-ok responses and leaves queue untouched', async (t) =>
{
  setupDom();
  const recipe = new RecipeJS();

  global.fetch = () => Promise.resolve(
  {
    ok: false,
    status: 500,
    statusText: 'Server Error'
  });

  await assert.rejects(
    recipe.request(0, '/boom', {}),
    /status 500/);
  assert.equal(recipe.requestQueue.length, 0);
});

test('cook skips unknown modules safely', async (t) =>
{
  setupDom();
  const recipe = new RecipeJS();
  recipe.requestQueue = [
    [
      { module: 'dom', method: 'replaceInner', target: 'body', html: '<p>ok</p>' },
      { module: 'unknown', method: 'noop' }
    ]
  ];

  let domCalled = 0;
  recipe.modules.dom.exec = async () =>
  {
    domCalled++;
  };

  recipe.cook();
  assert.equal(domCalled, 1);
});

test('css module rejects unknown method and resolves toggleClass', async (t) =>
{
  setupDom('<!doctype html><html><body><div class="box"></div></body></html>');
  const css = new Css();

  assert.throws(() => css.exec('missing', { target: '.box' }), /unknown/);

  const nodes = document.querySelectorAll('.box');
  await css.toggleClass(nodes, { classes: ['hidden'] });
  assert.equal(document.querySelector('.box').classList.contains('hidden'), true);
});

test('dom insert helpers append markup without moving body', async (t) =>
{
  setupDom('<!doctype html><html><body><ul id="list"><li>first</li></ul></body></html>');
  const dom = new Dom();
  const list = document.querySelector('#list');

  dom.append(list, { html: '<li>second</li><li>third</li>' });
  dom.prepend(list, { html: '<li>zero</li>' });
  dom.before(list, { html: '<p id="before">before</p>' });
  dom.after(list, { html: '<p id="after">after</p>' });

  const beforeElem = document.querySelector('#before');
  const afterElem = document.querySelector('#after');

  assert.equal(beforeElem.nextSibling, list);
  assert.equal(afterElem.previousSibling, list);
  assert.deepEqual(Array.from(list.querySelectorAll('li')).map((li) => li.textContent), ['zero', 'first', 'second', 'third']);
});

test('successful requests trigger cooking when queue settles', async (t) =>
{
  setupDom('<!doctype html><html><body></body></html>');
  const recipe = new RecipeJS();

  global.fetch = () => Promise.resolve(
  {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve([[{ module: 'dom', method: 'replaceInner', target: 'body', html: '<p>done</p>' }]])
  });

  let cooked = false;
  recipe.cook = () =>
  {
    cooked = true;
  };

  await recipe.exec('/ok', {}, 0);
  assert.equal(recipe.requestCounter, 0);
  assert.equal(cooked, true);
});
