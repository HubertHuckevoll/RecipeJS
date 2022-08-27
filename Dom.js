/**
 * DOM action(s)
 * ________________________________________________________________
 */
export class Dom
{
  constructor()
  {
    this.log = null;
  }

  exec(method, rcp)
  {
    return new Promise((resolve, reject) =>
    {
      let elem = document.querySelector(rcp.target);

      if (elem)
      {
        this.log('Executing', rcp.module, '/', rcp.method, 'on', rcp.target);
        this[method](elem, rcp);
        resolve();
      }
      else
      {
        reject('dom: "' + rcp.target + '" yields no element.');
      }
    });
  }

  replace(elem, rcp)
  {
    elem.outerHTML = rcp.html;
  }

  replaceInner(elem, rcp)
  {
    elem.innerHTML = rcp.html;
  }

  attr(elem, rcp)
  {
    elem.setAttribute(rcp.attrName, rcp.attrVal);
  }

}
