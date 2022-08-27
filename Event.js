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
    return this[method](rcp);
  }

  emit(rcp)
  {
    return new Promise((resolve, reject) =>
    {
      this.log('Executing', rcp.module, '/', rcp.type);

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
