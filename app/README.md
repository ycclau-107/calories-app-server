# calories-app

### Prerequisite

- Node version ^16.\*
- pnpm version ^8.\*
  You may download the prerequisites by following the document at https://pnpm.io/installation.

### Development

Before starting to develop the app from every git pull, run `pnpm install` to ensure required dependencies are installed.
Use `pnpm add --save-dev` for development-only dependencies during development to optimize production build.
For most of the issues arisen from the package manager, deleting both `/node_modules` and `pnpm-lock.yaml` then run `pnpm install` again will help.

### Testing

Run `pnpm start` to start the local server.

1. Using Expo Go

- Download the Expo Go app from play store / app store.
- Scan the QR code to access the metro server.

2. Using a Physical Device / Simulator

- Make sure a physical device is connected with physical cable / a simulator is active to be called.
