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
        <table cellPadding="5" cellSpacing="0" border="0" width="300">
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td className="text" align="center">
                <div className="sectionhead">Sorry - The Page You Want Was Not Found</div>
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
          </tbody>
        </table>
      </center>
    </div>
  )
}

export default NotFound
