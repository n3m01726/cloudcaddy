import { useLocation } from 'react-router-dom';
import { getRouteTitle } from '@/shared/constants/routes';

export const usePageTitle = () => getRouteTitle(useLocation().pathname);
