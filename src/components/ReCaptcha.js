import React, { createRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

class ReCaptchaV2Label extends React.Component {
  constructor(props) {
    super(props);
    this.recaptchaRef = createRef(); // Create a ref for the reCAPTCHA component
  }

  onSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    const recaptchaValue = this.recaptchaRef.current.getValue(); // Get reCAPTCHA value
    if (recaptchaValue) {
      this.props.onVerify(recaptchaValue); // Pass the value to the parent onVerify handler
    } else {
      alert("Please complete the reCAPTCHA verification.");
    }
  };

  render() {
    return (
      <div>
        <ReCAPTCHA
          ref={this.recaptchaRef} // Attach the ref to the ReCAPTCHA component
          sitekey={`${process.env.REACT_APP_SITE_KEY_RECAPTCHA}`} // Replace with your actual site key
          onChange={(value) => {
            // On successful completion of reCAPTCHA
            this.props.onVerify(value);
          }}
        />
      </div>
    );
  }
}

export default ReCaptchaV2Label;