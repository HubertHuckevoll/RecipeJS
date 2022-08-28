/**
 * FOCUS module
 * ________________________________________________________________
 */
export class Focus
{
  constructor()
  {
    this.log = null;
  }

  exec(method, rcp)
  {
    return new Promise((resolve, reject) =>
    {
      if (typeof this[method] === "function")
      {
        let el = document.querySelector(rcp.target);

        if (el)
        {
          this.log('Executing', rcp.module, '/', rcp.method, 'on', rcp.target);
          this[method](el);
          resolve();
        }
        else
        {
          reject('focus: "' + rcp.target + '" yields no element.');
        }
      }
      else
      {
        reject('focus: "' + method + '" unknown.');
      }
    });
  }

  focus(el)
  {
    el.focus();
  }

  blur(el)
  {
    el.blur();
  }
}
