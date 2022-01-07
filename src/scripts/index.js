import '../styles/index.scss';
import { start } from './game';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

start();