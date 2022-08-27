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
      this[method](rcp);
      resolve();
    });
  }

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