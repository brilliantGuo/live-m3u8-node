export class HomeService {
  hello = () => {
    return new Promise((resolve) => resolve('hello world'))
  }
}
