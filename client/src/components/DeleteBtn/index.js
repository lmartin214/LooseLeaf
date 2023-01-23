// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
import React from "react";
import { Button } from "semantic-ui-react";

function DeleteBtn(props) {
  return (
    <Button {...props} role="button" tabIndex="0">
      ✗
    </Button>
  );
}

export default DeleteBtn;