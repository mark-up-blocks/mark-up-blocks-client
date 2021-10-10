import React from "react";
import PropTypes from "prop-types";

function Button({ className, value, onClick }) {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
    >
      {value}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  className: "",
  value: "",
};

export default Button;
