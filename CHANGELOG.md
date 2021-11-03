# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.6.1 (2021-11-04)

- fix: incorrect statuses logged in verbose mode (#111)

## 1.6.0 (2021-10-27)

- feat: make the [`windowsHide`](https://nodejs.org/api/child_process.html) property configurable (defaults to `true`) - #108
- chore: run tests on node17, stop testing on node10

## 1.5.1 (2021-07-27)

- fix: fix bug with RTSP transport option (#89)

## 1.5.0 (2021-07-14)

- feat: add option to specify RTSP transport protocol (#85)

## 1.4.1 (2021-06-18)

- fix: fix streams not being killed when there are multiple users and multiple streams (#74)

## 1.4.0 (2021-03-04)

- feat: add `onDisconnect` option to `loadPlayer`

## 1.3.0 (2021-02-21)

- feat: create a new `loadPlayer` method for creating the canvas on the client-side

## 1.2.0 (2021-02-13)

- feat: support HTTPS on the server

## 1.1.3 (2021-02-13)

- feat: generate & publish `.d.ts` files in addition to the existing JSDoc types

## 1.1.2 (2021-02-06)

- perf: performance improvements
- chore: set up automated dependency updates

## 1.1.1 (2021-02-02)

- fix: fix bug on windows

## 1.1.0 (2021-01-20)

- feat: support multiple different simultaneous streams
- chore: add end-to-end tests
- chore: don't run CI tests on node v8 anymore
- chore: add tests for JSDoc types

## 1.0.6 (2020-08-16)

- chore: typecheck the JS code with TypeScript's checkJs mode

## 1.0.5 (2020-07-20)

- chore: dependabot security update for devDependencies

## 1.0.4 (2020-07-20)

- feat: bundle ffmpeg

## 1.0.3 (2020-03-16)

- perf: performance improvements

## 1.0.2 (2020-01-27)

- perf: performance improvements

## 1.0.1 (2020-01-26)

- fix: bug fixes

## 1.0.0 (2020-01-26)

- Initial release
