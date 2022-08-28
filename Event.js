/**
 * EVENT module
 * ________________________________________________________________
 */
export class Event
{
  constructor()
  {
    this.log = null;
  }

  exec(method, rcp)
  {
    if (typeof this[method] === "function")
    {
      this.log('Executing', rcp.module, '/', rcp.method, 'with event', rcp.type);
      return this[method](rcp);
    }
    else
    {
      return new Promise((resolve, reject) =>
      {
        reject('event: "' + method + '" unknown.');
      });
    }
  }

  emit(rcp)
  {
    return new Promise((resolve, reject) =>
    {
      // set up event
      let evDetails =
      {
        detail: rcp.detail,
        bubbles: true,
        cancelable: true
      }
      let ev = new CustomEvent(rcp.type, evDetails);

      // dispatch event
      window.setTimeout(() =>
      {
        window.dispatchEvent(ev);
        resolve();
      }, rcp.timeout);
    });
  }
}
