import clsx from 'clsx';

type IconProps = JSX.IntrinsicElements['svg'] & {
  direction?: 'up' | 'right' | 'down' | 'left';
};

function Icon({
  children,
  className,
  fill = 'currentColor',
  stroke,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
      fill={fill}
      stroke={stroke}
      className={clsx('w-5 h-5', className)}
    >
      {children}
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3629"
    >
      <path
        d="M992 224 32 224C14.336 224 0 209.664 0 192s14.336-32 32-32l960 0c17.696 0 32 14.336 32 32S1009.696 224 992 224zM992 544 32 544c-17.664 0-32-14.304-32-32s14.336-32 32-32l960 0c17.696 0 32 14.304 32 32S1009.696 544 992 544zM992 864 32 864c-17.664 0-32-14.304-32-32s14.336-32 32-32l960 0c17.696 0 32 14.304 32 32S1009.696 864 992 864z"
        fill="#000000"
        p-id="3630"
      ></path>
    </svg>
  );
}

export function IconFreight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      height="24"
      width="24"
    >
      <defs>
        <symbol id="delivery">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle
              cx="7"
              cy="18"
              r="2"
              stroke="#1D1D1D"
              strokeWidth="1.5px"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            ></circle>
            <circle
              cx="17"
              cy="18"
              r="2"
              stroke="#1D1D1D"
              strokeWidth="1.5px"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            ></circle>
            <path
              d="M3 18V6C3 5.44772 3.44772 5 4 5H14C14.5523 5 15 5.44772 15 6V13.5M15 18H11.5"
              stroke="#1D1D1D"
              strokeWidth="1.5px"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            ></path>
            <path
              d="M15 13.5V8.5H17.9854C18.3083 8.5 18.6114 8.65597 18.7991 8.91876L20.8137 11.7392C20.9349 11.9088 21 12.112 21 12.3205V17C21 17.5523 20.5523 18 20 18H19"
              stroke="#1D1D1D"
              strokeWidth="1.5px"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            ></path>
          </svg>
        </symbol>
      </defs>
      <use href="#delivery" fill="none"></use>
    </svg>
  );
}

export function IconCheckout(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      version="1.1"
    >
      <path id="path" d="M10 50 L40 80 L90 20"></path>
    </svg>
  );
}

export function IconTrial() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      height="24"
      width="24"
    >
      <path
        d="M17 15V14.5C17 13.3954 16.1046 12.5 15 12.5H9C7.89543 12.5 7 13.3954 7 14.5V19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19V18"
        stroke="#1D1D1D"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M3 6.5H16.5C18.9853 6.5 21 8.51472 21 11V11C21 13.4853 18.9853 15.5 16.5 15.5H14"
        stroke="#1D1D1D"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M3 6.5L6 3.5"
        stroke="#1D1D1D"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M6 9.5L3 6.5"
        stroke="#1D1D1D"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
    </svg>
  );
}

export function IconWarranty() {
  return (
    <svg
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      width="24"
    >
      <path
        d="M4.65332 8.99999L6.73249 11.0833L10.8908 7.33333"
        stroke="#1D1D1D"
        strokeWidth="1.13025px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.46488 2.96565C4.5986 3.09964 4.77955 3.17584 4.96885 3.17786L5.39786 3.18243C5.85121 3.18727 6.29364 3.04329 6.65731 2.77256L7.41767 2.20653C7.75145 1.95805 8.20874 1.95805 8.54252 2.20653L9.30288 2.77256C9.66655 3.04329 10.109 3.18727 10.5623 3.18243L11.5099 3.17232C11.9255 3.16789 12.2949 3.43643 12.4189 3.83316L12.7034 4.74319C12.8383 5.17501 13.1109 5.55078 13.4795 5.81314L14.2559 6.36579C14.5939 6.6064 14.7347 7.03986 14.6025 7.43315L14.2978 8.33991C14.1538 8.7682 14.1538 9.23179 14.2978 9.66008L14.6025 10.5668C14.7347 10.9601 14.5939 11.3936 14.2559 11.6342L13.4795 12.1868C13.1109 12.4492 12.8383 12.825 12.7034 13.2568L12.4189 14.1668C12.2949 14.5636 11.9255 14.8321 11.5099 14.8277L10.5623 14.8176C10.109 14.8127 9.66655 14.9567 9.30288 15.2274L8.54252 15.7935C8.20874 16.0419 7.75145 16.0419 7.41767 15.7935L6.65731 15.2274C6.29364 14.9567 5.85121 14.8127 5.39786 14.8176L4.45029 14.8277C4.03466 14.8321 3.66526 14.5636 3.54126 14.1668L3.25682 13.2568C3.12185 12.825 2.84926 12.4492 2.48069 12.1868L1.7043 11.6342C1.36628 11.3936 1.22552 10.9601 1.35769 10.5668L1.66242 9.66008C1.80635 9.23179 1.80635 8.7682 1.66242 8.33991L1.35769 7.43315C1.22552 7.03986 1.36628 6.6064 1.7043 6.36579L1.82676 6.27862C2.11137 6.07603 2.14583 5.6663 1.89904 5.41902C1.70399 5.22358 1.39627 5.1977 1.17132 5.35782L1.04886 5.44499C0.305216 5.97433 -0.00445348 6.92795 0.286325 7.7932L0.591049 8.69995C0.656473 8.89463 0.656473 9.10536 0.591049 9.30003L0.286325 10.2068C-0.00445352 11.072 0.305216 12.0257 1.04886 12.555L1.82525 13.1076C1.99278 13.2269 2.11668 13.3977 2.17803 13.594L2.46247 14.504C2.73528 15.3768 3.54796 15.9676 4.46235 15.9578L5.40992 15.9477C5.61599 15.9455 5.81709 16.011 5.9824 16.134L6.74276 16.7001C7.47708 17.2467 8.48311 17.2467 9.21743 16.7001L9.97779 16.134C10.1431 16.011 10.3442 15.9455 10.5503 15.9477L11.4978 15.9578C12.4122 15.9676 13.2249 15.3768 13.4977 14.504L13.7822 13.594C13.8435 13.3977 13.9674 13.2269 14.1349 13.1076L14.9113 12.555C15.655 12.0257 15.9646 11.072 15.6739 10.2068L15.3691 9.30003C15.3037 9.10536 15.3037 8.89463 15.3691 8.69995L15.6739 7.7932C15.9646 6.92795 15.655 5.97433 14.9113 5.44499L14.1349 4.89235C13.9674 4.77309 13.8435 4.60228 13.7822 4.406L13.4977 3.49597C13.2249 2.62317 12.4122 2.03238 11.4978 2.04214L10.5503 2.05225C10.3442 2.05445 10.1431 1.989 9.97779 1.86594L9.21743 1.29991C8.48311 0.75326 7.47708 0.75326 6.74276 1.29991L5.9824 1.86594C5.81709 1.989 5.61599 2.05445 5.40992 2.05225L4.46235 2.04214C4.08719 2.03813 3.98169 2.4815 4.24673 2.74706L4.46488 2.96565Z"
        fill="#1D1D1D"
      ></path>
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        strokeWidth="1.25"
      />
    </Icon>
  );
}
export function IconHeaderArrow() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      className="icon icon-caret"
      viewBox="0 0 10 6"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconArrow({direction = 'right'}: IconProps) {
  let rotate;

  switch (direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon className={`w-5 h-5 ${rotate}`}>
      <title>Arrow</title>
      <path d="M7 3L14 10L7 17" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconCaret({
  direction = 'down',
  stroke = 'currentColor',
  ...props
}: IconProps) {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`w-5 h-5 transition ${rotate}`}
      fill="transparent"
      stroke={stroke}
    >
      <title>Caret</title>
      <path d="M14 8L10 12L6 8" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconSelect(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Select</title>
      <path d="M7 8.5L10 6.5L13 8.5" strokeWidth="1.25" />
      <path d="M13 11.5L10 13.5L7 11.5" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42.000000 40.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,40.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M0 389 c0 -6 9 -13 20 -16 25 -7 27 -17 35 -138 10 -149 5 -145 180 -145 168 0 157 -8 175 118 10 64 10 85 0 97 -9 11 -46 15 -169 17 l-156 3 -3
					31 c-2 23 -9 34 -25 38 -34 9 -57 7 -57 -5z m330 -164 c0 -11 -12 -15 -45 -15
					-33 0 -45 4 -45 15 0 11 12 15 45 15 33 0 45 -4 45 -15z"
        />
        <path d="M90 45 c-11 -13 -11 -19 3 -32 21 -21 49 -9 45 19 -4 28 -30 35 -48 13z" />
        <path d="M324 46 c-10 -26 4 -48 28 -44 33 4 33 52 0 56 -13 2 -25 -3 -28 -12z" />
      </g>
    </svg>
  );
}

export function IconLogin(props: IconProps) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36.000000 44.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,44.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M118 424 c-53 -28 -72 -98 -43 -154 21 -40 53 -60 98 -60 50 0 93 23
					112 60 53 102 -64 210 -167 154z"
        />
        <path
          d="M50 128 c-57 -29 -61 -61 -12 -94 93 -63 317 -30 317 46 0 66 -206
					97 -305 48z"
        />
      </g>
    </svg>
  );
}

export function IconAccount(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Account</title>
      <path
        fillRule="evenodd"
        d="M9.9998 12.625c-1.9141 0-3.6628.698-5.0435 1.8611C3.895 13.2935 3.25 11.7221 3.25 10c0-3.728 3.022-6.75 6.75-6.75 3.7279 0 6.75 3.022 6.75 6.75 0 1.7222-.645 3.2937-1.7065 4.4863-1.3807-1.1632-3.1295-1.8613-5.0437-1.8613ZM10 18c-2.3556 0-4.4734-1.0181-5.9374-2.6382C2.7806 13.9431 2 12.0627 2 10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8Zm0-12.5c-1.567 0-2.75 1.394-2.75 3s1.183 3 2.75 3 2.75-1.394 2.75-3-1.183-3-2.75-3Z"
      />
    </Icon>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Help</title>
      <path d="M3.375 10a6.625 6.625 0 1 1 13.25 0 6.625 6.625 0 0 1-13.25 0ZM10 2.125a7.875 7.875 0 1 0 0 15.75 7.875 7.875 0 0 0 0-15.75Zm.699 10.507H9.236V14h1.463v-1.368ZM7.675 7.576A3.256 3.256 0 0 0 7.5 8.67h1.245c0-.496.105-.89.316-1.182.218-.299.553-.448 1.005-.448a1 1 0 0 1 .327.065c.124.044.24.113.35.208.108.095.2.223.272.383.08.154.12.34.12.558a1.3 1.3 0 0 1-.076.471c-.044.131-.11.252-.197.361-.08.102-.174.197-.283.285-.102.087-.212.182-.328.284a3.157 3.157 0 0 0-.382.383c-.102.124-.19.27-.262.438a2.476 2.476 0 0 0-.164.591 6.333 6.333 0 0 0-.043.81h1.179c0-.263.021-.485.065-.668a1.65 1.65 0 0 1 .207-.47c.088-.139.19-.263.306-.372.117-.11.244-.223.382-.34l.35-.306c.116-.11.218-.23.305-.361.095-.139.168-.3.219-.482.058-.19.087-.412.087-.667 0-.35-.062-.664-.186-.942a1.881 1.881 0 0 0-.513-.689 2.07 2.07 0 0 0-.753-.427A2.721 2.721 0 0 0 10.12 6c-.4 0-.764.066-1.092.197a2.36 2.36 0 0 0-.83.536c-.225.234-.4.515-.523.843Z" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z"
      />
    </Icon>
  );
}

export function IconCheck({
  stroke = 'currentColor',
  ...props
}: React.ComponentProps<typeof Icon>) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Check</title>
      <circle cx="10" cy="10" r="7.25" strokeWidth="1.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.04 10.37 2.42 2.41 3.5-5.56"
      />
    </Icon>
  );
}

export function IconXMark({
  stroke = 'currentColor',
  ...props
}: React.ComponentProps<typeof Icon>) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Delete</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </Icon>
  );
}

export function IconRemove(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconFilters(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Filters</title>
      <circle cx="4.5" cy="6.5" r="2" />
      <line x1="6" y1="6.5" x2="14" y2="6.5" />
      <line x1="4.37114e-08" y1="6.5" x2="3" y2="6.5" />
      <line x1="4.37114e-08" y1="13.5" x2="8" y2="13.5" />
      <line x1="11" y1="13.5" x2="14" y2="13.5" />
      <circle cx="9.5" cy="13.5" r="2" />
    </Icon>
  );
}
