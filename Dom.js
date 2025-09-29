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
      if (typeof this[method] === "function")
      {
        let elems = document.querySelectorAll(rcp.target);

        if (elems.length > 0)
        {
          this.log('Executing', rcp.module, '/', rcp.method, 'on', rcp.target);

          elems.forEach((elem) =>
          {
            this[method](elem, rcp);
          });

          resolve();
        }
        else
        {
          reject('dom: "' + rcp.target + '" yields no element.');
        }
      }
      else
      {
        reject('dom: "' + method + '" unknown.');
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

  append(elem, rcp)
  {
    elem.appendChild(this.str2el(rcp.html));
  }

  prepend(elem, rcp)
  {
    elem.insertBefore(this.str2el(rcp.html), elem.firstChild);
  }

  before(elem, rcp)
  {
    if (elem.parentNode)
    {
      elem.parentNode.insertBefore(this.str2el(rcp.html), elem);
    }
  }

  after(elem, rcp)
  {
    if (elem.parentNode)
    {
      elem.parentNode.insertBefore(this.str2el(rcp.html), elem.nextSibling);
    }
  }

  attr(elem, rcp)
  {
    elem.setAttribute(rcp.attrName, rcp.attrVal);
  }

  str2el(htmlStr)
  {
    let template = document.createElement('template');
    template.innerHTML = htmlStr.trim();
    let fragment = template.content;

    if (fragment.childNodes.length === 1)
    {
      return fragment.removeChild(fragment.firstChild);
    }

    return fragment;
  }

}
