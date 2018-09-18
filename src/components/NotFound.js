// NotFound.js

import React from 'react'

const NotFound = () => {
  //   return <h1>Not Found</h1>
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <center>
        <table cellpadding="5" cellspacing="0" border="0" width="300">
          <tr>
            <td>&nbsp;</td>
            <td class="text" align="center">
              <div class="sectionhead">Sorry - The Page You Want Was Not Found</div>
              <br />
              &nbsp;
              <br />
              <b>
                <p>
                  <i>You step in the stream, </i>
                  <br />
                  <i>but the water has moved on.</i>
                  <br />
                  <i>This page is not here. </i>
                  <br />
                </p>
              </b>
              <br />
              &nbsp;
              <br />
              <p>Please use another link.</p>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </center>
    </div>
  )
}

export default NotFound
