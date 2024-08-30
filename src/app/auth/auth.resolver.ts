import { ResolveFn } from '@angular/router';

export const authResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
