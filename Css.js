/**
 * CSS module(s)
 * ________________________________________________________________
 */
export class Css
{
  constructor()
  {
    this.log = null;
  }

  exec(method, rcp)
  {
    let result = null;

    if (typeof this[method] === "function")
    {
      let nodes = document.querySelectorAll(rcp.target);
      this.log('Executing', rcp.module, '/', rcp.method, 'on', rcp.target);

      if (nodes.length > 0)
      {
        result = this[method](nodes, rcp);
      }
      else
      {
        throw('css: "' + rcp.target + '" yields no elements.');
      }
    }
    else
    {
      reject('css: "' + method + '" unknown.');
    }

    return result;
  }

  addClass(nodes, rcp)
  {
    return new Promise((resolve, reject) =>
    {
      nodes.forEach((node) =>
      {
        for (let cl of rcp.classes)
        {
          node.classList.add(cl);
        };
      });
      resolve();
    });
  }

  removeClass(nodes, rcp)
  {
    return new Promise((resolve, reject) =>
    {
      nodes.forEach((node) =>
      {
        for (let cl of rcp.classes)
        {
          node.classList.remove(cl);
        };
      });
      resolve();
    });
  }

  toggleClass(nodes, rcp)
  {
    return Promise((resolve, reject) =>
    {
      nodes.forEach((node) =>
      {
        for (let cl of rcp.classes)
        {
          node.classList.toggle(cl);
        };
      });
      resolve();
    });
  }

  replaceClass(nodes, rcp)
  {
    return new Promise((resolve, reject) =>
    {
      nodes.forEach((node) =>
      {
        node.classList.replace(rcp.oldName, rcp.newName);
      });
      resolve();
    });
  }

  hide(nodes, rcp)
  {
    let promises = [];
    nodes.forEach((node) =>
    {
      let elemP = new Promise(function(resolve, reject)
      {
        node.ontransitionend = () => resolve();
        node.classList.remove(rcp.showClass);
        node.classList.add(rcp.hideClass);
      });

      promises.push(elemP);
    });

    return Promise.all(promises);
  }

  show(nodes, rcp)
  {
    let promises = [];
    nodes.forEach((node) =>
    {
      let elemP = new Promise(function(resolve, reject)
      {
        node.ontransitionend = () => resolve();
        node.classList.remove(rcp.hideClass);
        node.classList.add(rcp.showClass);
      });

      promises.push(elemP);
    });

    return Promise.all(promises);
  }
}
