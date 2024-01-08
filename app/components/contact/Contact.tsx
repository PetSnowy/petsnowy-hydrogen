import {useFetcher, type Form as FormType} from '@remix-run/react';
import {LegacyRef, useRef} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Contact() {
  const {Form, ...fetcher} = useFetcher<any>();
  const data = fetcher?.data;
  const formSubmitted = data?.form;
  const formError = data?.error;

  return (
    <div>
      <h3>Contact Us</h3>
      {formSubmitted ? (
        <div>
          <p>Thank you for your message. We will get back to you shortly.</p>
        </div>
      ) : (
        <ContactForm Form={Form} />
      )}
      {formError && (
        <div>
          <p>There was an error submitting your message. Please try again.</p>
          <p>{formError.message}</p>
        </div>
      )}
    </div>
  );
}
function ContactForm({Form}: {Form: typeof FormType}) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    form.reset();
  };

  return (
    <Form action="/api/contact-form" method="post" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" required />
      </fieldset>
      <fieldset>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
      </fieldset>
      <fieldset>
        <label htmlFor="subject">Subject</label>
        <input type="text" name="subject" required />
      </fieldset>
      <input type="text" hidden name="date" defaultValue={yyyyMmDd} />
      <textarea name="message" required />
      <br />
      <button type="submit">Send</button>
      <ReCAPTCHA
        ref={recaptchaRef as React.RefObject<ReCAPTCHA>}
        sitekey="6Le7KqknAAAAAHu_OjuH_Lg3Bl7xSUQb2kKVC2fh"
        size="invisible"
      />
    </Form>
  );
}
