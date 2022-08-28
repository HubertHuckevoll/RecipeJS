/**
 * TOOL module
 * ________________________________________________________________
 */
export class Tool
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
        this[method](rcp);
        resolve();
      }
      else
      {
        reject('tool: "' + method + '" unknown.');
      }
    });
  }

  /**
   * LOG server side msg
   */
  log(rcp)
  {
    console.log(rcp.msg);
  }

  /**
   * NOP
   * do nothing
   * useful when just sending state changes to the server
   * ________________________________________________________________
   */
  nop(rcp)
  {
    return;
  }

  /**
   * reload the page
   * ________________________________________________________________
   */
  reload(rcp)
  {
    window.location.reload();
  }
}