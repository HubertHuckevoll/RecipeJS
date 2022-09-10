/**
 * RecipeJS
 * your final JavaScript library, lel
 * __________________________________________________________________
 */

import { Dom } from './Dom.js';
import { Css } from './Css.js';
import { Event } from './Event.js';
import { Focus } from './Focus.js';
import { Tool } from './Tool.js';

export class RecipeJS
{
  /**
   * Konstruktor
   * ________________________________________________________________
   */
  constructor()
  {
    this.events = ['click', 'dblclick', 'change', 'select', 'blur', 'focus', 'submit', 'rcp', 'contextmenu'];
    this.handler = this.handleEvents.bind(this);
    this.logging = true;

    this.requestCounter = 0;
    this.requestNo = 0;
    this.requestQueue = [];

    this.modules = {};
    this.modules.dom = new Dom();
    this.modules.css = new Css();
    this.modules.event = new Event();
    this.modules.tool = new Tool();
    this.modules.focus = new Focus();
    this.modules.dom.log = this.log.bind(this);
    this.modules.css.log = this.log.bind(this);
    this.modules.event.log = this.log.bind(this);
    this.modules.tool.log = this.log.bind(this);
    this.modules.focus.log = this.log.bind(this);
  }

  /**
   * attach our event listeners
   * call this after initializing the object
   * ________________________________________________________________
   */
  attach(newEvtNames = [])
  {
    if (newEvtNames.length > 0)
    {
      this.events = newEvtNames;
    }

    for (let evName of this.events)
    {
      window.addEventListener(evName, this.handler, true);
    };
  }

  /**
   * detach all of the event listeners
   * ________________________________________________________________
   */
  detach()
  {
    for (let evName of this.events)
    {
      window.removeEventListener(evName, this.handler, true);
    };
  }

  /**
   * main event handling entry point
   * ________________________________________________________________
   */
  handleEvents(ev)
  {
    let url = '';
    let params = {};

    switch (ev.type)
    {
      case 'submit':
        url = ev.target.getAttribute('action');
        params = this.readForm(ev);

        this.exec(url, params, this.requestNo);

        this.requestNo++;

        ev.preventDefault();
        return false;
      break;

      case 'rcp':
        url = ev.detail.route;
        params.target = ev.detail;

        this.exec(url, params, this.requestNo);

        this.requestNo++;
      break;

      default:
        let rcpEvent = 'data-rcp-' + ev.type;

        if ((ev.target.hasAttribute) && (ev.target.hasAttribute(rcpEvent)))
        {
          if (!this.isBlurOnSubmit(ev))
          {
            url = ev.target.getAttribute(rcpEvent);
            params = this.readData(ev);

            this.exec(url, params, this.requestNo);

            this.requestNo++;

            ev.preventDefault(); // must be called before any await
            return false;
          }
        }
      break;
    }
  }

  /**
   * Exec function
   * ...is called, whenever a registered event happens and calls the
   * "request" function.
   *
   * Await waits for the "request" function to finish, but as the function
   * gets called multiple times when multiple events happen at more
   * or less the same time, it doesn't wait for the requests to return "in order".
   *
   * All requests are therefore assigned a request number ("reqNo")
   * and the result for each request is stored in "requestQueue" with
   * the "reqNo" as index (see the "request" function).
   *
   * Whenever we issue a request, "requestCounter" goes up.
   * Whenever a request returns, "requestCounter" goes down.
   * When all concurrent requests have returned, "requestCounter"
   * should be zero again.
   *
   * We check if "requestCounter" is zero after each request has returned.
   * Once all requests have settled down and "requestCounter" is zero,
   * we start cooking the recipes in the order of how the events happened.
   * ________________________________________________________________
   *
   */
  async exec(url, params, reqNo)
  {
    try
    {
      this.requestCounter++;
      this.log('Requesting: ', reqNo, url, params);
      await this.request(reqNo, url, params); // don't fuck with the await, I dare you!!!
      this.requestCounter--;

      if (this.requestCounter == 0)
      {
        this.cook();
        this.requestQueue = [];
        this.requestNo = 0;
      }
    }
    catch (e)
    {
      this.log(e);
    }
  }

  /**
   * do a request
   * ________________________________________________________________
   */
  async request(reqNo, url, params)
  {
    try
    {
      let reqData =
      {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(params) // body data type must match "Content-Type" header
      };

      const resp = await fetch(url, reqData);
      const js = await resp.json();

      this.log('Fetched data for request no', reqNo, ', is:', js);
      this.requestQueue[reqNo] = js;
    }
    catch (e)
    {
      this.log(e);
    }
  }

  /**
   * cook our recipes.
   * ________________________________________________________________
   */
  cook()
  {
    this.requestQueue.forEach(async (js) =>
    {
      for (let rcp of js)
      {
        if (this.modules[rcp.module] !== "undefined")
        {
          try
          {
            if (rcp.module !== 'event')
            {
              this.detach();
            }

            if (rcp.await == true)
            {
              await this.modules[rcp.module].exec(rcp.method, rcp);
            }
            else
            {
              this.modules[rcp.module].exec(rcp.method, rcp);
            }

            if (rcp.module !== 'event')
            {
              this.attach();
            }
          }
          catch (e)
          {
            this.log(e);
          }
        }
      }
    });
  }

  /**
   * check if a BLUR event happens while we are
   * hitting a submit button - in this case we
   * will cancel the BLUR event.
   * ________________________________________________________________
   */
  isBlurOnSubmit(ev)
  {
    if (
      (ev.type == 'blur') &&
      (ev.relatedTarget) && (ev.relatedTarget.tagName == 'INPUT') && (ev.relatedTarget.type == 'submit') &&
      (ev.target.form == ev.relatedTarget.form)
    )
    {
      return true;
    }
    return false;
  }

  /**
   * read data attributes from target node
   * and relatedTarget
   * ________________________________________________________________
   */
  readData(ev)
  {
    let result = {};
    let el = ev.target;
    let relEl = null;

    if (ev.relatedTarget)
    {
      relEl = ev.relatedTarget;
    }

    result.target = Object.assign({}, el.dataset);
    if (el.value && el.name)
    {
      result.target[el.name] = el.value;
    }

    if (relEl)
    {
      result.relatedTarget = Object.assign({}, relEl.dataset);
      if (relEl.value && relEl.name)
      {
        result.relatedTarget[relEl.name] = relEl.value;
      }
    }

    return result;
  }

  /**
   * read form data from target
   * ________________________________________________________________
   */
  readForm(ev)
  {
    let result = {};
    let form = ev.target;

    result.target = {}; // this is necessary!!!

    for (let formElem of form.elements)
    {
      result.target[formElem.name] = formElem.value;
    }

    return result;
  }

  /**
   *
   * log variables when logging is on
   * ________________________________________________________________
   */
  log(...vars)
  {
    if (this.logging == true)
    {
      console.log(...vars);
    }
  }
}