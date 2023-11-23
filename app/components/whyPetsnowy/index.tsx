import styles from '../../styles/whyPetsnowy/index.css';
import {LinksFunction} from '@shopify/remix-oxygen';

export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}];

export default function index() {
  return <div className="why-petsnowy">index</div>;
}
