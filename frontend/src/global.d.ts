declare module "global" {
  declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
      }
      interface Process {
        env: ProcessEnv;
      }
    }
  }
}
