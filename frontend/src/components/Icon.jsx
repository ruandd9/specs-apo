import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faChalkboardTeacher,
  faBook,
  faShoppingCart,
  faBookOpen,
  faUser,
  faEnvelope,
  faCalendar,
  faLock,
  faCreditCard,
  faBolt,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faBoxOpen,
  faTrophy,
  faChartLine,
  faRocket,
  faShieldAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  'graduation-cap': faGraduationCap,
  'chalkboard-teacher': faChalkboardTeacher,
  'book': faBook,
  'shopping-cart': faShoppingCart,
  'book-open': faBookOpen,
  'user': faUser,
  'envelope': faEnvelope,
  'calendar': faCalendar,
  'lock': faLock,
  'credit-card': faCreditCard,
  'bolt': faBolt,
  'check-circle': faCheckCircle,
  'exclamation-triangle': faExclamationTriangle,
  'spinner': faSpinner,
  'box-open': faBoxOpen,
  'trophy': faTrophy,
  'chart-line': faChartLine,
  'rocket': faRocket,
  'shield-alt': faShieldAlt,
  'clock': faClock
};

const Icon = ({ name, className = '', size, spin = false, ...props }) => {
  const icon = iconMap[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  
  return (
    <FontAwesomeIcon 
      icon={icon} 
      className={className}
      size={size}
      spin={spin}
      {...props}
    />
  );
};

export default Icon;
