// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  FLASK_ENDPOINT: "https://hereapp-live.herokuapp.com/",
  RTC_ENDPOINT: "https://rtc-server-here.herokuapp.com",
  TEST_ENDPOINT: "localhost:80",
  BACKEND_IP: "https://hereappbackend.com",
  SCHEDULE_ENDPOINT: "https://hereapp-live.herokuapp.com/course",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
