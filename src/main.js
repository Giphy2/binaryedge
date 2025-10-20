// app bootstrap

import './app.js';
import { derivApi } from './services/deriv-api.js';

derivApi.init();
derivApi.connect();