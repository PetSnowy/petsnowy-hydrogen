import {Form} from '@remix-run/react';
import {MouseEvent} from 'react';

// 邮件转发
// const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
//   method: 'POST',
//   headers: {
//     'content-type': 'application/json',
//   },
//   body: JSON.stringify({
//     personalizations: [
//       {
//         to: [{email: 'dongdaozheng0103@gmail.com', name: 'Test Recipient'}],
//       },
//     ],
//     from: {
//       email: '2456820347@qq.com',
//       name: 'Workers - MailChannels integration',
//     },
//     subject: 'Look! No servers',
//     content: [
//       {
//         type: 'text/plain',
//         value: 'And no email service accounts and all for free too!',
//       },
//     ],
//   }),
// });

export default function Banner() {
  const handleClick = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    const url = 'https://api.ip.sb/geoip';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    // const response = await fetch(send_request);
    // console.log(response);
  };
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
        <button type="submit" onClick={(e) => handleClick(e)}>
          send
        </button>
      </Form>
    </div>
  );
}
