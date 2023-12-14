import {Form} from '@remix-run/react';
import React from 'react';

export default function Banner() {
  return (
    <div className="banner container">
      <Form action="/contact">
        <input
          autoComplete="name"
          type="text"
          name="contact[Name]"
          placeholder="Name"
        />
        <input
          autoComplete="off"
          type="email"
          spellCheck="false"
          autoCapitalize="off"
          aria-required="true"
          placeholder="Email"
        />
        <input
          type="tel"
          autoComplete="tel"
          name="contact[Phone number]"
          pattern="[0-9\-]*"
          placeholder="Phone number"
        />
        <textarea
          rows={10}
          name="contact[Comment]"
          placeholder="Comment"
        ></textarea>
        <button type="submit">send</button>
      </Form>
    </div>
  );
}
