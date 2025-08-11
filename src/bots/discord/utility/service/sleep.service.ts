import { Debug } from "@develop";

const SECONDS_TO_MILLISECONDS = 1000;

class Service {
  private readonly _timeout: number;

  /** @param timeout times in seconds */
  public constructor(timeout: number = 10) {
    this._timeout = (timeout - 10 >= 0 ? timeout : 10) * SECONDS_TO_MILLISECONDS;
  }

  public execute(func: (delay: number) => void) {
    Debug.Log(["Программа скоро завершит работу"]);

    return new Promise<{
      interval: NodeJS.Timeout;
      timeoutDelay: number;
    }>((resolve) => {
      let delay: number = this._timeout / SECONDS_TO_MILLISECONDS;
      const interval = setInterval(() => {
        delay -= 1;
        func(delay);
      }, 1000);

      setTimeout(() => {
        setTimeout(() => {
          func(1);
          clearInterval(interval);
        }, 2000);

        setTimeout(() => {
          resolve({ interval: interval, timeoutDelay: this._timeout });
          
          Debug.Log(["Завершении программы через 5 секунд..."])
          setTimeout(() => {
            Debug.Log(["Завершение программы"]);
            process.exit();
          }, 5000);
        }, 2500);
      }, this._timeout - 3000);
    });
  }
}

export { Service };

export default Service;
